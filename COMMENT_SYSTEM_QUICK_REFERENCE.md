# Audit Comment System - Quick Reference Card

## 🚀 Quick Start (5 Steps)

```javascript
// 1. Import service
import commentService from './lib/commentService';

// 2. Create comment
const comment = await commentService.createComment({
  engagementId: "2024-ABC-001",
  workingPaperId: "D3",
  commentType: "preparer_notes",
  text: "Sample items selected...",
  createdBy: { userId, name, role },
  priority: "routine"
});

// 3. Reply to comment
const reply = await commentService.replyToComment(comment.id, {
  engagementId, text, createdBy
});

// 4. Resolve comment
await commentService.resolveComment(comment.id, {
  resolvedBy, resolutionNotes, resolutionStatus: "resolved"
});

// 5. Get analytics
const analytics = await commentService.getCommentAnalytics(engagementId);
```

---

## 📋 Comment Types Quick Lookup

| Type | When to Use | Example |
|------|-----------|---------|
| **Preparer Notes** | Document procedures done | "Sample selected as follows..." |
| **Reviewer Comment** | Ask question/give feedback | "Can you clarify this?" |
| **Team Discussion** | Collaborate with team | "Agree - adjusted in JE log" |
| **Mgmt Communication** | Track client requests | "Client confirmed adjustment" |
| **Exception Found** | Issues/errors found | "Revenue in wrong period - £12.5K" |
| **Follow-up Item** | Outstanding work | "Awaiting client email" |
| **Evidence Reference** | Link to files | "See attached confirmation" |

---

## 🎯 Priority Levels

- 🔵 **Routine** - Regular documentation, no rush
- 🟠 **Important** - Needs attention within 48 hours
- 🔴 **Critical** - Immediate action, escalate, monitor deadline

---

## ✅ Resolution Status Flow

Open → In Progress → (Resolved OR Acknowledged) → Closed

---

## 💡 Smart Suggestions

System automatically suggests comments when:

| Trigger | Suggestion |
|---------|-----------|
| Exceptions found | Use "All exceptions were..." template |
| High risk area | "Ensure comprehensive documentation" |
| Zero exceptions | Use "No exceptions noted..." template |
| Prior year issue found again | "Verify resolution procedures" |
| ISA requirement applies | Suggest ISA-specific documentation |

---

## 📝 Template Names (12 Quick Access)

```
sampling_selection          - "Sample items selected as follows..."
exception_summary           - "All exceptions were..."
conclusion_template         - "Based on our testing..."
mgmt_representation         - "Management represented that..."
clean_testing              - "No exceptions noted in our testing"
construction_revenue       - Construction industry revenue recognition
manufacturing_inventory    - Manufacturing inventory valuation
[6 more available]
```

---

## 🔗 Evidence Types to Link

- 📧 Email (client correspondence)
- 📁 File (uploaded documents)
- ✉️ Confirmation (bank/supplier confirmations)
- 📋 Evidence (audit evidence, calculations)
- 📄 Prior Year (link to 2023 working paper)
- 📊 FSLI Testing (link to detailed testing)

---

## 🚨 Critical Things to Check

**Before advancing phases:**
- [ ] All CRITICAL priority comments resolved
- [ ] All reviewer comments responded to
- [ ] All exceptions documented with resolution
- [ ] All WPs have conclusion comment
- [ ] Compliance check: RUN COMPLIANCE CHECKS

**To run compliance checks:**
```javascript
const results = await commentService.runComplianceChecks(engagementId);
// See results before advancing phase
```

---

## 📊 Workpaper Comment Sections (Required)

Every working paper must have:

1. **Objective** - What are we testing?
2. **Scope** - Population, sample, method
3. **Procedures** - List of testing steps
4. **Results** - What did we find?
5. **Conclusion** - Is assertion satisfied? YES/NO
6. **Reviewer Sign-off** - Name, date, initials

---

## 👥 Team Features

**@Mention** team members:
```
Type: "John, can you review @john.doe this?"
System detects @john.doe → sends notification → he can acknowledge
```

**Reply** to comments:
```
Click "💬 Reply" on comment → type response → post
Creates thread of discussion → easier to follow context
```

---

## 📈 Analytics Dashboard Shows

```
Total Comments: X
By Type: Preparer (Y), Reviewer (Z), Exceptions (A)
By Status: Open (X), Resolved (Y)
Most Discussed WP: D3 (42 comments)
Avg Resolution Time: 18 hours
Critical Unresolved: 0
Exceptions Found: 34 (adjusted: 28, unadjusted: 6)
```

---

## 📤 Export Options

| Format | Best For | Includes |
|--------|----------|----------|
| **Excel** | Partner review, data analysis | All comments, exceptions, analytics |
| **Word** | Documentation, footnotes | Comments linked to sections |
| **PDF** | Stakeholders, archiving | Embedded comments with bookmarks |
| **Summary Report** | Executive, KAM discussion | Key findings, open items, metrics |

---

## 🔒 Security & Access

- **Engagement Isolation**: Only see comments for your engagement
- **Role-Based**: Preparer < Reviewer < Manager < Partner
- **Confidentiality Marking**: Standard (all see) vs Restricted (partner only) vs External
- **Immutable Audit Trail**: All changes logged, nothing deleted

---

## ⚠️ Common Mistakes to Avoid

❌ Don't: Leave exceptions without resolution notes
✅ Do: Document how each exception was resolved

❌ Don't: Ignore smart suggestions
✅ Do: Use templates to save time and improve quality

❌ Don't: Forget to mention manager on critical items
✅ Do: Use @mentions to flag important reviews

❌ Don't: Leave WP without conclusion
✅ Do: Write conclusion for every WP tested

❌ Don't: Create duplicate comments
✅ Do: Reply to comment thread instead

---

## 🎓 Learning Resources

1. **Design Doc** → COMMENT_SYSTEM_DESIGN.md (comprehensive 3000+ lines)
2. **Implementation Guide** → COMMENT_SYSTEM_IMPLEMENTATION_GUIDE.md (step-by-step)
3. **Architecture** → COMMENT_SYSTEM_ARCHITECTURE.txt (diagrams)
4. **Code Examples** → See usage examples in implementation guide

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Comment won't save | Check Supabase connection, verify auth token |
| Mention not notifying | Verify @username format, check email config |
| Compliance check failing | Run check manually to see which rule failed |
| Template not appearing | Verify template is enabled for your engagement |
| Comments slow | Use filters (status, type) to reduce load |

---

## 📞 Key Service Methods (Simplified)

```javascript
// CRUD
createComment(data)          // Add new comment
updateComment(id, updates)   // Edit comment
replyToComment(parentId)     // Add reply/thread
resolveComment(id, data)     // Mark resolved

// Retrieval
getWorkingPaperComments(engagementId, wpId)
getCommentReplies(commentId)
getCommentEvidence(commentId)
getCommentTemplates(engagementId, filters)

// Smart Features
getCommentSuggestions(engagementId, wpId, context)
getCommentAnalytics(engagementId)
runComplianceChecks(engagementId)

// Linking
linkEvidence(commentId, evidence)
mentionUsers(commentId, mentions)
notifyUser(notification)

// Export
exportComments(engagementId, { format, type, filters })
```

---

## 🎯 Phase-Specific Comments

**Planning Phase**
- ✓ Engagement strategy notes
- ✓ Materiality calculations and rationale
- ✓ Team allocation and roles

**Risk Assessment Phase**
- ✓ Key risks identified
- ✓ Fraud assessment results
- ✓ Going concern determination

**Interim Phase**
- ✓ Control reliance determination
- ✓ Substantive testing plan
- ✓ Control test results

**Final Audit Phase**
- ✓ FSLI testing summary
- ✓ Exceptions and adjustments
- ✓ Complex judgments

**Completion Phase**
- ✓ Subsequent events
- ✓ Management representations
- ✓ Disclosure completeness

**Reporting Phase**
- ✓ Opinion formulation
- ✓ Key audit matters
- ✓ Management letter items

---

## 💾 Database Tables at a Glance

```
audit_comments           ← Main comment storage
audit_comment_edits      ← Edit history
audit_comment_mentions   ← @mention records
audit_comment_evidence   ← Linked files
working_paper_comments   ← WP framework sections
stage_comments          ← Phase-level comments
comment_templates       ← Template library
comment_suggestions     ← Smart suggestions
comment_resolutions     ← Resolution tracking
comment_compliance_checks ← Compliance results
```

---

## 🚨 MUST REMEMBER

1. **Comments are REQUIRED for exceptions** - Cannot skip this
2. **Conclusions must be signed off** - Cannot mark WP complete without
3. **Critical items need response** - System monitors 24-hour deadline
4. **Compliance checks block phases** - Cannot advance without passing
5. **Everything is auditable** - Full trail of who did what when why

---

**Last Updated**: March 13, 2024
**Status**: Ready for Implementation
**Questions?** See full documentation files
