# Conflict Resolution System Architecture

**Version**: 1.0 | **Status**: Design Ready | **Date**: March 14, 2026

---

## Overview

This document defines the conflict resolution system for concurrent edits in the Audit Automation Engine. When multiple users edit the same working paper or record simultaneously, the system uses a **three-way merge algorithm** to intelligently resolve conflicts without requiring manual intervention.

---

## Problem Statement

### Current Issue
```
Timeline:
09:00:00 - User A loads Working Paper "WP-001"
09:00:05 - User B loads Working Paper "WP-001" (same document)
09:00:30 - User A modifies "procedures" field
09:00:35 - User B modifies "exceptions_found" field
09:00:40 - User A clicks Save (success)
09:00:45 - User B clicks Save (CONFLICT!)
          - Server has version 2 (A's changes)
          - B is sending version 1 (base)
          - Result: B's changes are lost
```

### Impact
- User frustration (lost work)
- Data integrity concerns
- Audit trail gaps
- Potential compliance issues

---

## Solution: Three-Way Merge Algorithm

### How It Works

Three-way merge compares three versions:

1. **Base version** (last known good state both users started from)
2. **User A's version** (current server state - what A saved)
3. **User B's version** (what B is trying to save)

```
Base version:           { procedures: [P1, P2],        exceptions: 0 }
User A's changes:       { procedures: [P1, P2, P3],    exceptions: 0 }
Server (User B's base): { procedures: [P1, P2],        exceptions: 0 }
User B is saving:       { procedures: [P1, P2],        exceptions: 2 }

Analysis:
- "procedures": A changed it (P1,P2 → P1,P2,P3), B didn't (P1,P2 → P1,P2)
  → Use A's version: [P1, P2, P3] ✓

- "exceptions": B changed it (0 → 2), A didn't (0 → 0)
  → Use B's version: 2 ✓

Result: { procedures: [P1, P2, P3], exceptions: 2 } ✅ MERGED!
```

### Three Types of Conflicts

| Type | Example | Resolution |
|------|---------|-----------|
| **Non-Conflicting** | A changes field X, B changes field Y | Automatic merge ✓ |
| **Same field, compatible** | A adds to array, B deletes different item | Merge intelligently |
| **True conflict** | Both change same field differently | Show to user |

---

## Implementation: Four Phases

### Phase 1: Conflict Detection (Week 2)

**Goal**: Detect when edits conflict

```javascript
// Working Paper version tracking
class WorkingPaperManager {
  async saveWorkingPaper(wpId, userId, newData) {
    const currentVersion = await db.get(wpId);
    const userLoadedVersion = newData._version; // Client sends this

    if (currentVersion.version !== userLoadedVersion) {
      // CONFLICT DETECTED!
      return {
        status: 'conflict',
        baseVersion: userLoadedVersion,
        serverVersion: currentVersion.version,
        serverData: currentVersion,
        clientData: newData,
        conflictType: await this.analyzeConflict(currentVersion, newData)
      };
    }

    // No conflict, save normally
    return this.persistWorkingPaper(wpId, newData);
  }
}
```

**Data Structure**:
```javascript
{
  id: "wp-001",
  version: 5,
  versionHistory: [
    { version: 1, timestamp: "2026-03-14 09:00", editor: "user-a" },
    { version: 2, timestamp: "2026-03-14 09:01", editor: "user-a" },
    { version: 3, timestamp: "2026-03-14 09:02", editor: "user-b" },
    { version: 4, timestamp: "2026-03-14 09:03", editor: "user-a" },
    { version: 5, timestamp: "2026-03-14 09:04", editor: "user-b" }
  ],
  // ... other fields
}
```

### Phase 2: Merge Algorithm (Week 3)

**Goal**: Automatically merge non-conflicting changes

```javascript
class ThreeWayMerge {
  /**
   * Merge baseVersion, userVersion (current server), and incomingVersion
   * Returns: { merged, conflicts, warnings }
   */
  merge(baseVersion, userVersion, incomingVersion) {
    const merged = {};
    const conflicts = [];

    // Get all keys from all three versions
    const allKeys = new Set([
      ...Object.keys(baseVersion),
      ...Object.keys(userVersion),
      ...Object.keys(incomingVersion)
    ]);

    for (const key of allKeys) {
      const base = baseVersion[key];
      const current = userVersion[key];
      const incoming = incomingVersion[key];

      // Three-way merge logic for this key
      const result = this.mergeField(key, base, current, incoming);

      if (result.conflict) {
        conflicts.push({
          field: key,
          base,
          current,
          incoming,
          reason: result.reason
        });
      } else {
        merged[key] = result.value;
      }
    }

    return { merged, conflicts };
  }

  /**
   * Merge logic for individual field
   */
  mergeField(fieldName, base, current, incoming) {
    // Rule 1: If both made the same change, use it
    if (JSON.stringify(current) === JSON.stringify(incoming)) {
      return { value: current, conflict: false };
    }

    // Rule 2: If only one side changed, use that change
    if (JSON.stringify(base) === JSON.stringify(current)) {
      // Current unchanged, use incoming
      return { value: incoming, conflict: false };
    }

    if (JSON.stringify(base) === JSON.stringify(incoming)) {
      // Incoming unchanged, use current
      return { value: current, conflict: false };
    }

    // Rule 3: For arrays, try to merge (add/remove tracking)
    if (Array.isArray(base) && Array.isArray(current) && Array.isArray(incoming)) {
      return this.mergeArrayField(fieldName, base, current, incoming);
    }

    // Rule 4: For objects, recursively merge
    if (typeof base === 'object' && typeof current === 'object' && typeof incoming === 'object') {
      return this.mergeObjectField(fieldName, base, current, incoming);
    }

    // Rule 5: Otherwise, it's a true conflict
    return {
      value: current, // Default to server's version
      conflict: true,
      reason: 'Both sides modified differently'
    };
  }

  /**
   * Merge array fields (e.g., procedures list)
   */
  mergeArrayField(fieldName, base, current, incoming) {
    // Track what was added/removed in each version
    const addedByCurrent = current.filter(x => !base.includes(x));
    const removedByCurrent = base.filter(x => !current.includes(x));

    const addedByIncoming = incoming.filter(x => !base.includes(x));
    const removedByIncoming = base.filter(x => !incoming.includes(x));

    // If removals conflict, that's a problem
    const removeConflict = removedByCurrent.some(x => removedByIncoming.includes(x));

    if (removeConflict) {
      return { conflict: true, reason: `Both removed items from ${fieldName}` };
    }

    // Otherwise, merge: start with base, apply both additions, both removals
    let merged = [...base];

    // Remove items removed by either side
    merged = merged.filter(x => !removedByCurrent.includes(x) && !removedByIncoming.includes(x));

    // Add items added by either side
    merged = [...new Set([...merged, ...addedByCurrent, ...addedByIncoming])];

    return { value: merged, conflict: false };
  }

  /**
   * Merge object fields (e.g., metadata)
   */
  mergeObjectField(fieldName, base, current, incoming) {
    // Recursively merge objects
    return {
      value: this.merge(base, current, incoming),
      conflict: false
    };
  }
}
```

### Phase 3: Conflict UI Resolution (Week 4)

**Goal**: Show conflicts to user and let them choose

```javascript
// React Component
function ConflictResolutionDialog({ conflict, onResolve }) {
  return (
    <div className="conflict-dialog">
      <h2>⚠️ Conflict Detected</h2>

      <div className="conflict-field">
        <h3>Field: "{conflict.field}"</h3>

        <div className="conflict-version">
          <h4>Your Changes:</h4>
          <code className="preferred">
            {JSON.stringify(conflict.incoming, null, 2)}
          </code>
          <button onClick={() => onResolve('incoming')}>
            ✓ Keep Your Version
          </button>
        </div>

        <div className="separator">VS</div>

        <div className="conflict-version">
          <h4>Their Changes:</h4>
          <code className="alternative">
            {JSON.stringify(conflict.current, null, 2)}
          </code>
          <button onClick={() => onResolve('current')}>
            Keep Their Version
          </button>
        </div>

        <div className="conflict-diff">
          <h4>What Changed:</h4>
          <p>{conflict.reason}</p>
          <DiffViewer base={conflict.base}
                       current={conflict.current}
                       incoming={conflict.incoming} />
        </div>
      </div>

      <div className="conflict-actions">
        <button onClick={() => onResolve('cancel')}>Cancel</button>
        <button onClick={() => onResolve('auto-merge')}>Auto-Merge Non-Conflicts</button>
      </div>
    </div>
  );
}
```

### Phase 4: Testing & Edge Cases (Week 5)

**Test Scenarios**:

1. **Same field, different changes**
   ```
   Base:     { procedures: [P1, P2] }
   Current:  { procedures: [P1, P2, P3] }
   Incoming: { procedures: [P1, P2, P4] }
   Result:   Conflict - ask user
   ```

2. **Different fields**
   ```
   Base:     { procedures: [P1], exceptions: [] }
   Current:  { procedures: [P1, P2], exceptions: [] }
   Incoming: { procedures: [P1], exceptions: [E1] }
   Result:   Merged: { procedures: [P1, P2], exceptions: [E1] }
   ```

3. **Both add same item**
   ```
   Base:     { procedures: [P1] }
   Current:  { procedures: [P1, P2] }
   Incoming: { procedures: [P1, P2] }
   Result:   Merged: { procedures: [P1, P2] } - deduplicated
   ```

4. **Delete vs Modify**
   ```
   Base:     { title: "Procedures" }
   Current:  { title: "Updated Procedures" }
   Incoming: (field deleted)
   Result:   Conflict - which is right?
   ```

---

## Conflict Resolution Strategies

### Strategy 1: Automatic Non-Conflicting Merge
- **When**: Different fields were changed
- **Action**: Merge automatically, no user input needed
- **Audit Log**: Record that merge occurred

### Strategy 2: Intelligent Array Merge
- **When**: Same array field, but different items added/removed
- **Action**: Combine all additions, apply all removals
- **Example**: User A adds "Procedure 3", User B adds "Procedure 4"
- **Result**: Both are included

### Strategy 3: User Choice for True Conflicts
- **When**: Same field changed in incompatible ways
- **Action**: Show UI with three-way diff
- **Options**:
  - Keep your version
  - Accept their version
  - Cancel save and reload

### Strategy 4: Server-Side Resolution (Last Write Wins)
- **When**: User doesn't respond to conflict dialog
- **Action**: After timeout (30 seconds), accept server's version
- **Rationale**: Can't block saves indefinitely

---

## Data Structure: Versioning

### Simple Versioning
```javascript
class VersionedWorkingPaper {
  id: "wp-001",
  version: 5,              // Current version
  _version: 5,             // Sent to client, checked on save
  modified_at: "2026-03-14T09:04:32Z",

  // Immutable version history
  history: {
    1: { timestamp: "...", editor: "user-a", snapshot: {...} },
    2: { timestamp: "...", editor: "user-b", snapshot: {...} },
    // ...
  }
}
```

### Change Vector Clocks (Advanced)
For distributed systems:
```javascript
{
  id: "wp-001",
  vectorClock: { "user-a": 3, "user-b": 2, "user-c": 1 },
  // Can determine causality: event A happened before event B
}
```

---

## Implementation Checklist

### Week 2: Conflict Detection
- [ ] Add version field to working_papers table
- [ ] Add versionHistory tracking
- [ ] Implement conflict detection on save
- [ ] Log all conflict events
- [ ] Add version mismatch HTTP status (409)

### Week 3: Merge Algorithm
- [ ] Implement ThreeWayMerge class
- [ ] Unit tests for all merge scenarios
- [ ] Performance testing with 10k+ field changes
- [ ] Benchmark: < 100ms merge time
- [ ] Handle nested objects/arrays

### Week 4: UI & UX
- [ ] Design conflict resolution dialog
- [ ] Implement ConflictDialog component
- [ ] Side-by-side diff viewer
- [ ] User preference: auto-merge vs manual review
- [ ] Keyboard shortcuts for resolution

### Week 5: Testing & Rollout
- [ ] Integration tests with real scenarios
- [ ] Load test: 100 concurrent conflicts
- [ ] Test on staging environment
- [ ] Gradual rollout (5% → 25% → 100% of users)
- [ ] 24/7 monitoring for issues

---

## Metrics & Monitoring

### Key Metrics
1. **Conflict frequency**: % of saves that have conflicts
2. **Auto-merge rate**: % of conflicts auto-resolved
3. **User choice**: Which option users prefer when forced to choose
4. **Merge time**: P50, P95, P99 latency
5. **Accuracy**: False conflicts? Lost data?

### Alerts
- Alert if conflict rate > 5% (indicates data issues)
- Alert if merge time > 500ms (performance regression)
- Alert if data inconsistency detected post-merge

---

## Limitations & Future Work

### Known Limitations
1. **Concurrent deletes** - Hard to merge deletion of same field
2. **Large objects** - Merge performance degrades with large JSON
3. **Semantic conflicts** - Algorithm doesn't understand business logic

### Future Enhancements
1. **Semantic understanding** - Field-specific merge rules
2. **Partial merges** - Ask user about specific fields only
3. **Merge history** - Show all previous merges for context
4. **Collaborative editing** - Real-time sync (Yjs/Automerge libraries)

---

## References

- RFC 3-way merge algorithm
- Google Docs conflict resolution model
- GitHub merge strategies
- ISA 700 - Forming an Opinion on Financial Statements

---

**Next Steps**:
1. Get design approval from tech lead
2. Begin Phase 1 (conflict detection) implementation
3. Set up monitoring infrastructure
4. Plan user communication strategy
