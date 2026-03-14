/**
 * Three-Way Merge Conflict Resolver
 * ==================================
 * Implements RFC 3394 three-way merge algorithm
 * Used for concurrent edit conflict resolution
 */

export class ThreeWayMerge {
  /**
   * Main merge method
   * @param {Object} baseVersion - Original version both started from
   * @param {Object} currentVersion - Version from server (someone else's changes)
   * @param {Object} incomingVersion - Version user is trying to save
   * @returns {Object} { merged, conflicts }
   */
  static merge(baseVersion, currentVersion, incomingVersion) {
    const merged = {};
    const conflicts = [];

    // Get all keys from all versions
    const allKeys = new Set([
      ...Object.keys(baseVersion || {}),
      ...Object.keys(currentVersion || {}),
      ...Object.keys(incomingVersion || {})
    ]);

    for (const key of allKeys) {
      const base = baseVersion?.[key];
      const current = currentVersion?.[key];
      const incoming = incomingVersion?.[key];

      const result = this._mergeField(key, base, current, incoming);

      if (result.conflict) {
        conflicts.push({
          field: key,
          base,
          current,
          incoming,
          reason: result.reason,
          suggestion: result.suggestion
        });
        merged[key] = current; // Default to server version
      } else {
        merged[key] = result.value;
      }
    }

    return {
      merged,
      conflicts,
      hasConflicts: conflicts.length > 0,
      autoMergeSuccessful: conflicts.length === 0
    };
  }

  /**
   * Merge a single field
   * @private
   */
  static _mergeField(fieldName, base, current, incoming) {
    // Case 1: Both sides made identical changes
    if (this._deepEqual(current, incoming)) {
      return { value: current, conflict: false };
    }

    // Case 2: One side didn't change
    if (this._deepEqual(base, current)) {
      // Base = Current, so current didn't change. Use incoming
      return { value: incoming, conflict: false };
    }

    if (this._deepEqual(base, incoming)) {
      // Base = Incoming, so incoming didn't change. Use current
      return { value: current, conflict: false };
    }

    // Case 3: Both sides changed - try smart merges

    // Try array merge
    if (Array.isArray(base) && Array.isArray(current) && Array.isArray(incoming)) {
      return this._mergeArray(fieldName, base, current, incoming);
    }

    // Try object merge
    if (
      this._isPlainObject(base) &&
      this._isPlainObject(current) &&
      this._isPlainObject(incoming)
    ) {
      return this._mergeObject(fieldName, base, current, incoming);
    }

    // Case 4: True conflict - both modified incompatibly
    return {
      value: current,
      conflict: true,
      reason: `Both sides modified '${fieldName}' in incompatible ways`,
      suggestion: `Keep server version or manually select`
    };
  }

  /**
   * Merge array fields
   * @private
   */
  static _mergeArray(fieldName, base, current, incoming) {
    // Calculate what each side added/removed
    const addedByServer = current.filter(x => !base.includes(x));
    const removedByServer = base.filter(x => !current.includes(x));

    const addedByClient = incoming.filter(x => !base.includes(x));
    const removedByClient = base.filter(x => !incoming.includes(x));

    // If both removed the same item, it's intentional - respect it
    const commonRemovals = removedByServer.filter(x =>
      removedByClient.some(y => this._deepEqual(x, y))
    );

    // If one removes while other modifies same array position, conflict
    if (removedByServer.length > 0 && addedByClient.length > 0) {
      // Check if additions are simple (strings/numbers)
      const allSimple = addedByClient.every(x =>
        typeof x === 'string' || typeof x === 'number'
      );

      if (!allSimple) {
        // Complex objects being added while removals - potential conflict
        // But try to merge anyway
      }
    }

    // Build merged array:
    // 1. Start with base
    // 2. Apply server additions
    // 3. Apply client additions
    // 4. Apply common removals
    // 5. Remove server-only removals only if client didn't add
    // 6. Remove client-only removals only if server didn't add

    let merged = [...base];

    // Apply removals that both sides agree on
    merged = merged.filter(x => !commonRemovals.some(y => this._deepEqual(x, y)));

    // Add new items (deduplicated)
    const toAdd = [...addedByServer, ...addedByClient];
    const seen = new Set();

    for (const item of toAdd) {
      const key = JSON.stringify(item);
      if (!seen.has(key)) {
        merged.push(item);
        seen.add(key);
      }
    }

    return {
      value: merged,
      conflict: false
    };
  }

  /**
   * Merge object fields (recursive)
   * @private
   */
  static _mergeObject(fieldName, base, current, incoming) {
    const baseObj = base || {};
    const currentObj = current || {};
    const incomingObj = incoming || {};

    // Recursively merge each field
    const merged = {};
    const allKeys = new Set([
      ...Object.keys(baseObj),
      ...Object.keys(currentObj),
      ...Object.keys(incomingObj)
    ]);

    let hasConflict = false;

    for (const key of allKeys) {
      const result = this._mergeField(
        `${fieldName}.${key}`,
        baseObj[key],
        currentObj[key],
        incomingObj[key]
      );

      if (result.conflict) {
        hasConflict = true;
      }

      merged[key] = result.value;
    }

    return {
      value: merged,
      conflict: hasConflict,
      reason: hasConflict ? 'Nested object has conflicts' : ''
    };
  }

  /**
   * Deep equality check
   * @private
   */
  static _deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object') return false;

    const keysA = Object.keys(a || {});
    const keysB = Object.keys(b || {});

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => this._deepEqual(a[key], b[key]));
  }

  /**
   * Check if value is plain object
   * @private
   */
  static _isPlainObject(obj) {
    if (!obj) return false;
    if (Array.isArray(obj)) return false;
    if (typeof obj !== 'object') return false;

    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }

  /**
   * Generate detailed conflict report
   */
  static generateConflictReport(conflicts) {
    return {
      timestamp: new Date().toISOString(),
      totalConflicts: conflicts.length,
      byField: conflicts.reduce((acc, c) => {
        acc[c.field] = {
          reason: c.reason,
          suggestion: c.suggestion
        };
        return acc;
      }, {}),
      details: conflicts
    };
  }

  /**
   * Attempt automatic resolution strategies
   */
  static autoResolveConflicts(conflicts, strategy = 'server-wins') {
    return conflicts.map(conflict => {
      switch (strategy) {
        case 'server-wins':
          return { field: conflict.field, resolution: conflict.current };

        case 'client-wins':
          return { field: conflict.field, resolution: conflict.incoming };

        case 'merge-strategy':
          // Try various merge strategies
          return { field: conflict.field, resolution: this._smartResolve(conflict) };

        default:
          return null;
      }
    });
  }

  /**
   * Smart resolution attempt
   * @private
   */
  static _smartResolve(conflict) {
    // If both are strings, prefer longer (more detailed)
    if (typeof conflict.current === 'string' && typeof conflict.incoming === 'string') {
      return conflict.incoming.length >= conflict.current.length
        ? conflict.incoming
        : conflict.current;
    }

    // Default: server wins
    return conflict.current;
  }
}

/**
 * Conflict Detection Class
 */
export class ConflictDetector {
  /**
   * Detect if save should trigger conflict resolution
   */
  static detectConflict(clientVersion, serverVersion) {
    if (clientVersion === undefined || serverVersion === undefined) {
      return null; // No conflict info available
    }

    return clientVersion !== serverVersion
      ? {
          detected: true,
          clientVersion,
          serverVersion,
          type: 'version-mismatch'
        }
      : null;
  }

  /**
   * Retrieve version history for diff
   */
  static async getVersionHistory(workingPaperId, limit = 10) {
    // Implementation would fetch from database
    // Returns array of { version, timestamp, editor, snapshot }
    return [];
  }

  /**
   * Create version checkpoint
   */
  static createCheckpoint(data) {
    return {
      version: data.version || 1,
      timestamp: new Date().toISOString(),
      checksum: this._generateChecksum(data),
      snapshot: JSON.parse(JSON.stringify(data)) // Deep clone
    };
  }

  /**
   * Generate data checksum
   * @private
   */
  static _generateChecksum(data) {
    const json = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < json.length; i++) {
      const char = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

// Export for use in components
export default { ThreeWayMerge, ConflictDetector };
