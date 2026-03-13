/**
 * COMMENT SERVICE - DATABASE OPERATIONS LAYER
 * ═════════════════════════════════════════════════════════════════════
 * Supabase integration for all comment operations
 */

import { supabase } from './supabaseClient';
import {
  COMMENT_TYPES,
  COMMENT_TEMPLATES,
  RESOLUTION_STATUS,
  WORKPAPER_COMMENT_SECTIONS,
  STAGE_COMMENT_SECTIONS
} from '../models/commentSystem';

// ═════════════════════════════════════════════════════════════════════
// CORE COMMENT OPERATIONS
// ═════════════════════════════════════════════════════════════════════

/**
 * Create a new comment on a working paper
 * @param {object} commentData - Comment details
 * @returns {Promise<object>} Created comment with ID
 */
export const createComment = async (commentData) => {
  const {
    engagementId,
    workingPaperId,
    workingPaperSection,
    commentType,
    text,
    templateId,
    createdBy,
    priority = 'routine',
    confidentiality = 'standard',
    tags = []
  } = commentData;

  try {
    const { data, error } = await supabase
      .from('audit_comments')
      .insert([
        {
          engagement_id: engagementId,
          working_paper_ref: workingPaperId,
          working_paper_section: workingPaperSection,
          comment_type: commentType,
          text: text,
          template_id: templateId,
          created_by_user_id: createdBy.userId,
          created_by_name: createdBy.name,
          created_by_role: createdBy.role,
          priority: priority,
          confidentiality: confidentiality,
          tags: tags,
          status: 'open'
        }
      ])
      .select();

    if (error) throw error;

    // Record audit trail
    await recordAuditTrail({
      engagementId,
      userId: createdBy.userId,
      action: 'CREATE_COMMENT',
      wpId: workingPaperId,
      change: `Created ${commentType} comment`
    });

    return data[0];
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

/**
 * Update an existing comment
 * @param {string} commentId - Comment ID to update
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated comment
 */
export const updateComment = async (commentId, updates, editedBy) => {
  try {
    const { data: existing } = await supabase
      .from('audit_comments')
      .select('text')
      .eq('id', commentId)
      .single();

    const { data, error } = await supabase
      .from('audit_comments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        edit_count: (existing.edit_count || 0) + 1
      })
      .eq('id', commentId)
      .select();

    if (error) throw error;

    // Record edit history
    if (updates.text && existing.text !== updates.text) {
      await supabase
        .from('audit_comment_edits')
        .insert([
          {
            comment_id: commentId,
            edited_by_user_id: editedBy.userId,
            edited_by_name: editedBy.name,
            original_text: existing.text,
            new_text: updates.text,
            change_reason: updates.editReason
          }
        ]);
    }

    return data[0];
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

/**
 * Add a reply to a comment (thread-based)
 * @param {string} parentCommentId - Parent comment ID
 * @param {object} replyData - Reply comment data
 * @returns {Promise<object>} Created reply
 */
export const replyToComment = async (parentCommentId, replyData) => {
  const { engagementId, text, createdBy } = replyData;

  try {
    const { data, error } = await supabase
      .from('audit_comments')
      .insert([
        {
          engagement_id: engagementId,
          parent_comment_id: parentCommentId,
          comment_type: 'team_discussion',
          text: text,
          created_by_user_id: createdBy.userId,
          created_by_name: createdBy.name,
          created_by_role: createdBy.role,
          status: 'open'
        }
      ])
      .select();

    if (error) throw error;

    // Update parent comment's reply count
    await supabase
      .from('audit_comments')
      .update({
        view_count: (await getCommentReplies(parentCommentId)).length
      })
      .eq('id', parentCommentId);

    return data[0];
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};

/**
 * Get all replies to a comment
 * @param {string} parentCommentId - Parent comment ID
 * @returns {Promise<array>} Array of reply comments
 */
export const getCommentReplies = async (parentCommentId) => {
  try {
    const { data, error } = await supabase
      .from('audit_comments')
      .select('*')
      .eq('parent_comment_id', parentCommentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// MENTION (@mention) OPERATIONS
// ═════════════════════════════════════════════════════════════════════

/**
 * Add @mentions to a comment
 * @param {string} commentId - Comment ID
 * @param {array} mentions - Array of user objects to mention
 * @returns {Promise<void>}
 */
export const mentionUsers = async (commentId, mentions) => {
  try {
    const mentionRecords = mentions.map(user => ({
      comment_id: commentId,
      mentioned_user_id: user.userId,
      mentioned_user_name: user.name,
      mentioned_user_email: user.email
    }));

    const { error } = await supabase
      .from('audit_comment_mentions')
      .insert(mentionRecords);

    if (error) throw error;

    // Send notifications to mentioned users
    for (const user of mentions) {
      await notifyUser({
        userId: user.userId,
        email: user.email,
        notificationType: 'mention',
        commentId: commentId,
        message: `You were mentioned in a comment`
      });
    }
  } catch (error) {
    console.error('Error mentioning users:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// RESOLUTION & STATUS MANAGEMENT
// ═════════════════════════════════════════════════════════════════════

/**
 * Resolve a comment
 * @param {string} commentId - Comment ID
 * @param {object} resolutionData - Resolution details
 * @returns {Promise<object>} Updated comment
 */
export const resolveComment = async (commentId, resolutionData) => {
  const {
    resolvedBy,
    resolutionNotes,
    resolutionStatus = 'resolved',
    resolutionType,
    resolvedAmount
  } = resolutionData;

  try {
    // Update comment status
    const { data: comment, error: commentError } = await supabase
      .from('audit_comments')
      .update({
        status: resolutionStatus,
        resolved_by_user_id: resolvedBy.userId,
        resolved_at: new Date().toISOString(),
        resolution_notes: resolutionNotes
      })
      .eq('id', commentId)
      .select();

    if (commentError) throw commentError;

    // Create resolution record
    const { error: resolutionError } = await supabase
      .from('comment_resolutions')
      .insert([
        {
          comment_id: commentId,
          resolution_status: resolutionStatus,
          resolved_by_user_id: resolvedBy.userId,
          resolved_at: new Date().toISOString(),
          resolution_notes: resolutionNotes,
          resolution_type: resolutionType,
          resolved_amount_if_exception: resolvedAmount
        }
      ]);

    if (resolutionError) throw resolutionError;

    // Notify original commenter
    const { data: originalComment } = await supabase
      .from('audit_comments')
      .select('created_by_user_id, created_by_name')
      .eq('id', commentId)
      .single();

    if (originalComment) {
      await notifyUser({
        userId: originalComment.created_by_user_id,
        notificationType: 'resolution',
        commentId: commentId,
        message: `Your comment has been resolved`
      });
    }

    return comment[0];
  } catch (error) {
    console.error('Error resolving comment:', error);
    throw error;
  }
};

/**
 * Get comments for a working paper
 * @param {string} engagementId - Engagement ID
 * @param {string} workingPaperId - WP reference
 * @param {object} filters - Optional filters {status, type, priority}
 * @returns {Promise<array>} Comments array
 */
export const getWorkingPaperComments = async (engagementId, workingPaperId, filters = {}) => {
  try {
    let query = supabase
      .from('audit_comments')
      .select(`
        *,
        replies:audit_comments!parent_comment_id(id, text, created_by_name, created_at),
        mentions:audit_comment_mentions(mentioned_user_name, mentioned_user_email)
      `)
      .eq('engagement_id', engagementId)
      .eq('working_paper_ref', workingPaperId)
      .is('parent_comment_id', null); // Only top-level comments

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.commentType) {
      query = query.eq('comment_type', filters.commentType);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching WP comments:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// EVIDENCE LINKING
// ═════════════════════════════════════════════════════════════════════

/**
 * Link evidence/document to a comment
 * @param {string} commentId - Comment ID
 * @param {object} evidence - Evidence details
 * @returns {Promise<object>} Created evidence link
 */
export const linkEvidence = async (commentId, evidence) => {
  const {
    documentType,
    fileName,
    fileUrl,
    description,
    uploadedBy
  } = evidence;

  try {
    const { data, error } = await supabase
      .from('audit_comment_evidence')
      .insert([
        {
          comment_id: commentId,
          document_type: documentType,
          file_name: fileName,
          file_url: fileUrl,
          description: description,
          uploaded_by_user_id: uploadedBy.userId
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error linking evidence:', error);
    throw error;
  }
};

/**
 * Get evidence linked to a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<array>} Evidence array
 */
export const getCommentEvidence = async (commentId) => {
  try {
    const { data, error } = await supabase
      .from('audit_comment_evidence')
      .select('*')
      .eq('comment_id', commentId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching evidence:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// WORKPAPER-LEVEL COMMENT MANAGEMENT
// ═════════════════════════════════════════════════════════════════════

/**
 * Create/update working paper comment section
 * @param {string} engagementId - Engagement ID
 * @param {string} workingPaperId - WP reference
 * @param {object} sectionData - Section details
 * @returns {Promise<object>} Created/updated section
 */
export const updateWPCommentSection = async (engagementId, workingPaperId, sectionData) => {
  const {
    sectionId,
    sectionTitle,
    sectionContent,
    templateId,
    createdBy
  } = sectionData;

  try {
    const { data, error } = await supabase
      .from('working_paper_comments')
      .upsert(
        [
          {
            engagement_id: engagementId,
            working_paper_ref: workingPaperId,
            section_id: sectionId,
            section_title: sectionTitle,
            section_content: sectionContent,
            section_template_id: templateId,
            created_by_user_id: createdBy.userId,
            created_by_name: createdBy.name,
            updated_at: new Date().toISOString()
          }
        ],
        { onConflict: ['engagement_id', 'working_paper_ref', 'section_id'] }
      )
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating WP comment section:', error);
    throw error;
  }
};

/**
 * Sign off a working paper
 * @param {string} engagementId - Engagement ID
 * @param {string} workingPaperId - WP reference
 * @param {object} signOffData - Sign-off details
 * @returns {Promise<object>} Updated section
 */
export const signOffWorkingPaper = async (engagementId, workingPaperId, signOffData) => {
  const {
    reviewedBy,
    reviewerInitials,
    reviewNotes
  } = signOffData;

  try {
    const { data, error } = await supabase
      .from('working_paper_comments')
      .update({
        reviewed_by_user_id: reviewedBy.userId,
        reviewed_by_name: reviewedBy.name,
        reviewed_date: new Date().toISOString(),
        reviewer_initials: reviewerInitials,
        reviewer_notes: reviewNotes,
        is_complete: true
      })
      .eq('engagement_id', engagementId)
      .eq('working_paper_ref', workingPaperId)
      .eq('section_id', 'reviewer_signoff')
      .select();

    if (error) throw error;

    // Record audit trail
    await recordAuditTrail({
      engagementId,
      userId: reviewedBy.userId,
      action: 'SIGNOFF',
      wpId: workingPaperId,
      change: `Reviewed and signed off`
    });

    return data[0];
  } catch (error) {
    console.error('Error signing off WP:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// COMMENT TEMPLATES
// ═════════════════════════════════════════════════════════════════════

/**
 * Get available comment templates
 * @param {string} engagementId - Engagement ID
 * @param {object} filters - Filter options {category, industry, commentType}
 * @returns {Promise<array>} Templates array
 */
export const getCommentTemplates = async (engagementId, filters = {}) => {
  try {
    let query = supabase
      .from('comment_templates')
      .select('*')
      .or(`engagement_id.is.null,engagement_id.eq.${engagementId}`) // Firm-wide or engagement-specific
      .eq('is_active', true);

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters.commentType) {
      query = query.eq('comment_type', filters.commentType);
    }

    const { data, error } = await query.order('template_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// SMART SUGGESTIONS
// ═════════════════════════════════════════════════════════════════════

/**
 * Get smart comment suggestions
 * @param {string} engagementId - Engagement ID
 * @param {string} workingPaperId - WP reference
 * @param {object} context - Context data {exceptions, risk, procedure, priorYear}
 * @returns {Promise<array>} Suggestions array
 */
export const getCommentSuggestions = async (engagementId, workingPaperId, context) => {
  try {
    let suggestions = [];

    // Check for exceptions
    if (context.exceptions && context.exceptions.length > 0) {
      suggestions.push({
        id: 'exception_found_suggestion',
        triggerType: 'exceptions_found',
        suggestedCommentType: 'exception_found',
        suggestedTemplate: 'exception_summary',
        priority: 'critical',
        message: `${context.exceptions.length} exception(s) found - exception documentation recommended`
      });
    }

    // Check risk level
    if (context.riskLevel === 'high') {
      suggestions.push({
        id: 'high_risk_suggestion',
        triggerType: 'high_risk',
        suggestedCommentType: 'preparer_notes',
        priority: 'important',
        message: 'High-risk area - ensure comprehensive documentation'
      });
    }

    // Check prior year issues
    if (context.priorYearIssue) {
      suggestions.push({
        id: 'prior_year_suggestion',
        triggerType: 'prior_year_issue',
        suggestedCommentType: 'reviewer_comment',
        priority: 'critical',
        message: 'Prior year issue identified - verify resolution procedures'
      });
    }

    // Save suggestions to database
    for (const suggestion of suggestions) {
      await supabase
        .from('comment_suggestions')
        .insert([
          {
            engagement_id: engagementId,
            working_paper_ref: workingPaperId,
            trigger_type: suggestion.triggerType,
            trigger_context: context,
            suggested_comment_type: suggestion.suggestedCommentType,
            suggested_template_id: suggestion.suggestedTemplate,
            suggested_priority: suggestion.priority,
            suggestion_message: suggestion.message
          }
        ]);
    }

    return suggestions;
  } catch (error) {
    console.error('Error generating suggestions:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// ANALYTICS & REPORTING
// ═════════════════════════════════════════════════════════════════════

/**
 * Get comment analytics for engagement
 * @param {string} engagementId - Engagement ID
 * @returns {Promise<object>} Analytics data
 */
export const getCommentAnalytics = async (engagementId) => {
  try {
    // Get all comments
    const { data: comments, error: commentsError } = await supabase
      .from('audit_comments')
      .select('*')
      .eq('engagement_id', engagementId);

    if (commentsError) throw commentsError;

    // Calculate metrics
    const analytics = {
      totalComments: comments.length,
      byType: {},
      byStatus: {},
      byPriority: {},
      wpDistribution: {},
      commenters: new Set(),
      exceptionsCount: 0,
      averageResolutionTime: 0
    };

    let totalResolutionTime = 0;
    let resolvedCount = 0;

    comments.forEach(comment => {
      // By type
      analytics.byType[comment.comment_type] = (analytics.byType[comment.comment_type] || 0) + 1;

      // By status
      analytics.byStatus[comment.status] = (analytics.byStatus[comment.status] || 0) + 1;

      // By priority
      analytics.byPriority[comment.priority] = (analytics.byPriority[comment.priority] || 0) + 1;

      // WP distribution
      analytics.wpDistribution[comment.working_paper_ref] =
        (analytics.wpDistribution[comment.working_paper_ref] || 0) + 1;

      // Commenters
      analytics.commenters.add(comment.created_by_user_id);

      // Exceptions
      if (comment.comment_type === 'exception_found') {
        analytics.exceptionsCount += 1;
      }

      // Resolution time
      if (comment.status === 'resolved' && comment.resolved_at && comment.created_at) {
        const time = new Date(comment.resolved_at) - new Date(comment.created_at);
        totalResolutionTime += time;
        resolvedCount += 1;
      }
    });

    if (resolvedCount > 0) {
      analytics.averageResolutionTime = totalResolutionTime / resolvedCount / (1000 * 60 * 60); // hours
    }

    analytics.commenterCount = analytics.commenters.size;

    return analytics;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// COMPLIANCE CHECKING
// ═════════════════════════════════════════════════════════════════════

/**
 * Run compliance checks on comments
 * @param {string} engagementId - Engagement ID
 * @returns {Promise<array>} Compliance check results
 */
export const runComplianceChecks = async (engagementId) => {
  const results = [];

  try {
    // Get engagement config
    const { data: config } = await supabase
      .from('engagement_comment_config')
      .select('*')
      .eq('engagement_id', engagementId)
      .single();

    // Get all comments
    const { data: comments } = await supabase
      .from('audit_comments')
      .select('*')
      .eq('engagement_id', engagementId);

    // Check 1: Critical comments addressed
    const criticalUnresolved = comments.filter(
      c => c.priority === 'critical' && c.status === 'open'
    );

    results.push({
      checkName: 'critical_comment_addressed',
      checkStatus: criticalUnresolved.length === 0 ? 'passed' : 'failed',
      issuesFound: criticalUnresolved.length,
      affectedComments: criticalUnresolved.map(c => c.id)
    });

    // Check 2: Exception quantification
    const unquantifiedExceptions = comments.filter(
      c => c.comment_type === 'exception_found' && !c.resolution_notes
    );

    results.push({
      checkName: 'exception_quantification',
      checkStatus: unquantifiedExceptions.length === 0 ? 'passed' : 'failed',
      issuesFound: unquantifiedExceptions.length,
      affectedComments: unquantifiedExceptions.map(c => c.id)
    });

    // Check 3: Reviewer responses
    const unresponded = comments.filter(
      c => c.requires_response && !c.responded_at
    );

    results.push({
      checkName: 'reviewer_responses',
      checkStatus: unresponded.length === 0 ? 'passed' : 'failed',
      issuesFound: unresponded.length,
      affectedComments: unresponded.map(c => c.id)
    });

    // Save compliance check results
    await supabase
      .from('comment_compliance_checks')
      .insert(
        results.map(r => ({
          engagement_id: engagementId,
          check_name: r.checkName,
          check_status: r.checkStatus,
          issues_found: r.issuesFound,
          affected_comments: r.affectedComments
        }))
      );

    return results;
  } catch (error) {
    console.error('Error running compliance checks:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═════════════════════════════════════════════════════════════════════

/**
 * Notify user of comment activity
 * @param {object} notification - Notification details
 * @returns {Promise<object>} Created notification
 */
export const notifyUser = async (notification) => {
  const {
    userId,
    email,
    notificationType,
    commentId,
    message
  } = notification;

  try {
    const { data, error } = await supabase
      .from('comment_notifications')
      .insert([
        {
          notified_user_id: userId,
          notified_user_email: email,
          notification_type: notificationType,
          comment_id: commentId,
          notification_message: message
        }
      ])
      .select();

    if (error) throw error;

    // TODO: Send email notification here
    // await sendEmailNotification(email, message);

    return data[0];
  } catch (error) {
    console.error('Error notifying user:', error);
    throw error;
  }
};

// ═════════════════════════════════════════════════════════════════════
// AUDIT TRAIL
// ═════════════════════════════════════════════════════════════════════

/**
 * Record action in audit trail
 * @param {object} trailData - Audit trail entry details
 * @returns {Promise<void>}
 */
export const recordAuditTrail = async (trailData) => {
  const {
    engagementId,
    userId,
    action,
    wpId,
    change
  } = trailData;

  try {
    // This would be stored in a separate audit trail table
    // For now, we're using the built-in updated_at on comments
    console.log(`[AUDIT TRAIL] ${action}: ${wpId} by ${userId}`, change);
  } catch (error) {
    console.error('Error recording audit trail:', error);
  }
};

export default {
  createComment,
  updateComment,
  replyToComment,
  getCommentReplies,
  mentionUsers,
  resolveComment,
  getWorkingPaperComments,
  linkEvidence,
  getCommentEvidence,
  updateWPCommentSection,
  signOffWorkingPaper,
  getCommentTemplates,
  getCommentSuggestions,
  getCommentAnalytics,
  runComplianceChecks,
  notifyUser,
  recordAuditTrail
};
