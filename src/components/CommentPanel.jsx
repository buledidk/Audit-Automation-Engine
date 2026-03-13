/**
 * COMMENT PANEL COMPONENT
 * ═════════════════════════════════════════════════════════════════════
 * Main UI component for displaying and managing comments on working papers
 */

import { useState, useEffect, useCallback } from 'react';
import {
  COMMENT_TYPES,
  PRIORITY_LEVELS,
  RESOLUTION_STATUS,
  COMMENT_TEMPLATES
} from '../models/commentSystem';
import commentService from '../lib/commentService';

const COLORS = {
  bg: '#0A0E17',
  card: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  text: '#F8F8F8',
  dim: 'rgba(255,255,255,0.6)',
  faint: 'rgba(255,255,255,0.3)',
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#42A5F5'
};

export function CommentPanel({
  engagementId,
  workingPaperId,
  workingPaperSection,
  currentUser,
  onCommentAdded
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [selectedType, setSelectedType] = useState('preparer_notes');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('routine');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [templates, setTemplates] = useState([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [expandedComments, setExpandedComments] = useState(new Set());

  // Load comments
  useEffect(() => {
    loadComments();
    loadTemplates();
  }, [engagementId, workingPaperId]);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getWorkingPaperComments(
        engagementId,
        workingPaperId,
        {
          status: filterStatus === 'all' ? null : filterStatus,
          commentType: filterType === 'all' ? null : filterType
        }
      );
      setComments(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await commentService.getCommentTemplates(engagementId, {
        commentType: selectedType
      });
      setTemplates(data);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError('Comment text cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const commentData = {
        engagementId,
        workingPaperId,
        workingPaperSection,
        commentType: selectedType,
        text: newComment,
        templateId: selectedTemplate,
        createdBy: {
          userId: currentUser.id,
          name: currentUser.name,
          role: currentUser.role
        },
        priority: selectedPriority
      };

      const created = await commentService.createComment(commentData);
      setComments([created, ...comments]);
      setNewComment('');
      setSelectedTemplate(null);
      setError(null);

      if (onCommentAdded) {
        onCommentAdded(created);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComment = async (commentId, resolutionData) => {
    setLoading(true);
    try {
      const updated = await commentService.resolveComment(commentId, {
        ...resolutionData,
        resolvedBy: {
          userId: currentUser.id,
          name: currentUser.name
        }
      });

      setComments(comments.map(c => c.id === commentId ? updated : c));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error resolving comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyToComment = async (parentCommentId, replyText) => {
    setLoading(true);
    try {
      const reply = await commentService.replyToComment(parentCommentId, {
        engagementId,
        text: replyText,
        createdBy: {
          userId: currentUser.id,
          name: currentUser.name,
          role: currentUser.role
        }
      });

      // Reload comments to include new reply
      await loadComments();
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error replying to comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCommentExpanded = (commentId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const filteredComments = comments.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterType !== 'all' && c.comment_type !== filterType) return false;
    return true;
  });

  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: COLORS.text, marginTop: 0, marginBottom: '8px' }}>
          💬 Comments & Annotations
        </h3>
        <p style={{ color: COLORS.dim, margin: 0, fontSize: '12px' }}>
          {comments.length} comment{comments.length !== 1 ? 's' : ''} •
          {comments.filter(c => c.status === 'open').length} open
        </p>
      </div>

      {error && (
        <div style={{
          background: COLORS.error + '20',
          border: `1px solid ${COLORS.error}50`,
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: COLORS.error,
          fontSize: '12px'
        }}>
          {error}
        </div>
      )}

      {/* New Comment Form */}
      <CommentForm
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        newComment={newComment}
        setNewComment={setNewComment}
        templates={templates}
        showTemplateSelector={showTemplateSelector}
        setShowTemplateSelector={setShowTemplateSelector}
        onSubmit={handleAddComment}
        loading={loading}
      />

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        borderTop: `1px solid ${COLORS.border}`,
        paddingTop: '16px'
      }}>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            loadComments();
          }}
          style={{
            padding: '8px 12px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Status</option>
          {Object.values(RESOLUTION_STATUS).map(status => (
            <option key={status.id} value={status.id}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            loadComments();
          }}
          style={{
            padding: '8px 12px',
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            color: COLORS.text,
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Types</option>
          {Object.values(COMMENT_TYPES).map(type => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Comments List */}
      <div style={{
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        {loading && <p style={{ color: COLORS.dim }}>Loading comments...</p>}

        {!loading && filteredComments.length === 0 && (
          <p style={{ color: COLORS.dim, textAlign: 'center', padding: '20px 0' }}>
            No comments yet. Start the discussion!
          </p>
        )}

        {filteredComments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isExpanded={expandedComments.has(comment.id)}
            onToggleExpand={() => toggleCommentExpanded(comment.id)}
            onResolve={(data) => handleResolveComment(comment.id, data)}
            onReply={(text) => handleReplyToComment(comment.id, text)}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// COMMENT FORM COMPONENT
// ═════════════════════════════════════════════════════════════════════

function CommentForm({
  selectedType,
  setSelectedType,
  selectedTemplate,
  setSelectedTemplate,
  selectedPriority,
  setSelectedPriority,
  newComment,
  setNewComment,
  templates,
  showTemplateSelector,
  setShowTemplateSelector,
  onSubmit,
  loading
}) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '20px' }}>
      {/* Type selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '8px',
        marginBottom: '12px'
      }}>
        {Object.values(COMMENT_TYPES).map(type => (
          <button
            key={type.id}
            type="button"
            onClick={() => {
              setSelectedType(type.id);
              setSelectedTemplate(null);
            }}
            style={{
              padding: '8px 12px',
              background: selectedType === type.id ? type.color + '40' : 'transparent',
              border: `1px solid ${selectedType === type.id ? type.color + '80' : COLORS.border}`,
              borderRadius: '6px',
              color: selectedType === type.id ? type.color : COLORS.dim,
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={type.description}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Comment text area */}
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Type your comment here... Use @ to mention team members"
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '12px',
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          color: COLORS.text,
          fontFamily: 'monospace',
          fontSize: '12px',
          resize: 'vertical',
          marginBottom: '12px'
        }}
      />

      {/* Template selector */}
      <div style={{ marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setShowTemplateSelector(!showTemplateSelector)}
          style={{
            padding: '8px 12px',
            background: COLORS.info + '20',
            border: `1px solid ${COLORS.info}50`,
            borderRadius: '6px',
            color: COLORS.info,
            fontSize: '11px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {showTemplateSelector ? '✕ Hide Templates' : '+ Use Template'}
        </button>

        {showTemplateSelector && templates.length > 0 && (
          <div style={{
            marginTop: '8px',
            maxHeight: '150px',
            overflowY: 'auto',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            background: COLORS.bg
          }}>
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => {
                  setNewComment(template.template_text);
                  setSelectedTemplate(template.id);
                  setShowTemplateSelector(false);
                }}
                style={{
                  padding: '10px 12px',
                  borderBottom: `1px solid ${COLORS.border}`,
                  cursor: 'pointer',
                  background: selectedTemplate === template.id ? COLORS.info + '20' : 'transparent',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedTemplate !== template.id) {
                    e.target.style.background = COLORS.border;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTemplate !== template.id) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ color: COLORS.text, fontSize: '11px', fontWeight: 500 }}>
                  {template.template_name}
                </div>
                <div style={{ color: COLORS.dim, fontSize: '10px' }}>
                  {template.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Priority selector */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
        <label style={{ color: COLORS.dim, fontSize: '11px', fontWeight: 500 }}>Priority:</label>
        {Object.values(PRIORITY_LEVELS).map(level => (
          <button
            key={level.id}
            type="button"
            onClick={() => setSelectedPriority(level.id)}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              background: selectedPriority === level.id ? level.color : COLORS.border,
              border: `1px solid ${selectedPriority === level.id ? level.color : 'transparent'}`,
              cursor: 'pointer',
              title: level.label
            }}
            title={level.label}
          />
        ))}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !newComment.trim()}
        style={{
          padding: '10px 16px',
          background: COLORS.success,
          border: 'none',
          borderRadius: '6px',
          color: '#000',
          fontSize: '12px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading || !newComment.trim() ? 0.6 : 1,
          transition: 'opacity 0.2s'
        }}
      >
        {loading ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
}

// ═════════════════════════════════════════════════════════════════════
// COMMENT ITEM COMPONENT
// ═════════════════════════════════════════════════════════════════════

function CommentItem({
  comment,
  isExpanded,
  onToggleExpand,
  onResolve,
  onReply,
  currentUser
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [resolveMode, setResolveMode] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const commentType = COMMENT_TYPES[comment.comment_type.toUpperCase().replace(/_/g, '_')] ||
    Object.values(COMMENT_TYPES).find(t => t.id === comment.comment_type);

  const status = RESOLUTION_STATUS[comment.status.toUpperCase().replace(/_/g, '_')] ||
    Object.values(RESOLUTION_STATUS).find(s => s.id === comment.status);

  const priority = PRIORITY_LEVELS[comment.priority.toUpperCase()] ||
    Object.values(PRIORITY_LEVELS).find(p => p.id === comment.priority);

  return (
    <div style={{
      background: COLORS.bg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}>
      {/* Comment header */}
      <div
        onClick={onToggleExpand}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: isExpanded ? '12px' : 0
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px' }}>{commentType?.icon}</span>
            <span style={{ color: COLORS.text, fontSize: '11px', fontWeight: 600 }}>
              {commentType?.label}
            </span>
            <span style={{
              background: status?.color + '40',
              color: status?.color,
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: 500
            }}>
              {status?.label}
            </span>
            {priority && (
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: priority.color,
                title: priority.label
              }} />
            )}
          </div>
          <p style={{ color: COLORS.dim, margin: 0, fontSize: '11px' }}>
            {comment.created_by_name} • {new Date(comment.created_at).toLocaleDateString()}
          </p>
        </div>
        <span style={{ color: COLORS.dim, fontSize: '14px' }}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {/* Comment content (expanded) */}
      {isExpanded && (
        <>
          <p style={{
            color: COLORS.text,
            fontSize: '12px',
            lineHeight: '1.5',
            marginBottom: '12px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {comment.text}
          </p>

          {comment.resolution_notes && (
            <div style={{
              background: COLORS.success + '20',
              border: `1px solid ${COLORS.success}40`,
              borderRadius: '6px',
              padding: '8px',
              marginBottom: '12px',
              fontSize: '11px'
            }}>
              <span style={{ color: COLORS.success, fontWeight: 600 }}>Resolution:</span>
              <p style={{ color: COLORS.text, margin: '4px 0 0 0' }}>
                {comment.resolution_notes}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: `1px solid ${COLORS.border}`
          }}>
            {comment.status === 'open' && (
              <>
                <button
                  onClick={() => setResolveMode(!resolveMode)}
                  style={{
                    padding: '6px 12px',
                    background: COLORS.success + '20',
                    border: `1px solid ${COLORS.success}40`,
                    borderRadius: '4px',
                    color: COLORS.success,
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  ✓ Resolve
                </button>
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  style={{
                    padding: '6px 12px',
                    background: COLORS.info + '20',
                    border: `1px solid ${COLORS.info}40`,
                    borderRadius: '4px',
                    color: COLORS.info,
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  💬 Reply
                </button>
              </>
            )}
          </div>

          {/* Resolve form */}
          {resolveMode && (
            <div style={{
              background: COLORS.success + '10',
              border: `1px solid ${COLORS.success}40`,
              borderRadius: '6px',
              padding: '12px',
              marginTop: '12px'
            }}>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="How was this resolved?"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  color: COLORS.text,
                  fontSize: '11px',
                  marginBottom: '8px'
                }}
              />
              <button
                onClick={() => {
                  onResolve({
                    resolutionStatus: 'resolved',
                    resolutionNotes: resolutionNotes
                  });
                  setResolveMode(false);
                  setResolutionNotes('');
                }}
                style={{
                  padding: '6px 12px',
                  background: COLORS.success,
                  border: 'none',
                  borderRadius: '4px',
                  color: '#000',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Mark Resolved
              </button>
            </div>
          )}

          {/* Reply form */}
          {showReplyForm && (
            <div style={{
              background: COLORS.border,
              borderRadius: '6px',
              padding: '12px',
              marginTop: '12px'
            }}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px',
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '4px',
                  color: COLORS.text,
                  fontSize: '11px',
                  marginBottom: '8px'
                }}
              />
              <button
                onClick={() => {
                  onReply(replyText);
                  setReplyText('');
                  setShowReplyForm(false);
                }}
                style={{
                  padding: '6px 12px',
                  background: COLORS.info,
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Post Reply
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CommentPanel;
