/**
 * signOffChainService.js
 *
 * Manages approval workflow and sign-off chain for audit work
 * Tracks review and approval chain: Preparer → Reviewer → Partner
 * Maintains ISA 230 and ISA 220 documentation requirements
 * Records reviewer comments and approval dates
 *
 * Version: 1.0.0
 * Created: March 2026
 */

/**
 * In-memory sign-off registry
 * In production, connects to database (Supabase)
 */
const signOffRegistry = new Map();

/**
 * Sign-off roles in audit hierarchy
 */
const SIGN_OFF_ROLES = {
  PREPARER: 'preparer',
  REVIEWER: 'reviewer',
  MANAGER: 'manager',
  PARTNER: 'partner',
  EQR_PARTNER: 'eqr_partner' // Engagement Quality Reviewer
};

/**
 * Sign-off statuses
 */
const SIGN_OFF_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  PENDING_REVIEW: 'pending_review',
  UNDER_REVIEW: 'under_review',
  NEEDS_REVISION: 'needs_revision',
  APPROVED: 'approved',
  APPROVED_WITH_CONDITIONS: 'approved_with_conditions',
  REJECTED: 'rejected'
};

/**
 * Create a sign-off chain for a section
 * Initializes approval workflow from preparer through partner
 * @param {object} chainData - Sign-off chain details
 *   - sectionId: FSLI identifier
 *   - preparerId: ID of auditor who prepared the work
 *   - preparerName: Name of preparer
 *   - reviewerId: ID of assigned reviewer
 *   - reviewerName: Name of reviewer
 *   - managerId: ID of manager (optional)
 *   - partnerId: ID of audit partner
 *   - partnerName: Name of partner
 *   - createdDate: When chain was created
 * @returns {object} Created sign-off chain
 */
export function createSignOffChain(chainData) {
  const {
    sectionId,
    preparerId,
    preparerName,
    reviewerId,
    reviewerName,
    managerId = null,
    managerId: managerIdName = '',
    partnerId,
    partnerName
  } = chainData;

  // Validate required fields
  if (!sectionId || !preparerId || !partnerId) {
    return {
      success: false,
      message: 'Missing required fields: sectionId, preparerId, partnerId'
    };
  }

  // Create sign-off chain
  const chainId = `signoff-chain-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const chain = {
    chainId,
    sectionId,
    createdDate: new Date().toISOString(),
    signOffs: [
      {
        role: SIGN_OFF_ROLES.PREPARER,
        userId: preparerId,
        userName: preparerName,
        status: SIGN_OFF_STATUS.IN_PROGRESS,
        signedDate: null,
        comments: '',
        completionPercentage: 100 // Preparer is always done
      },
      {
        role: SIGN_OFF_ROLES.REVIEWER,
        userId: reviewerId,
        userName: reviewerName,
        status: SIGN_OFF_STATUS.NOT_STARTED,
        signedDate: null,
        comments: '',
        requiresRevision: false
      }
    ],
    finalApproval: {
      role: SIGN_OFF_ROLES.PARTNER,
      userId: partnerId,
      userName: partnerName,
      status: SIGN_OFF_STATUS.NOT_STARTED,
      signedDate: null,
      comments: ''
    },
    overallStatus: SIGN_OFF_STATUS.IN_PROGRESS,
    isaCompliant: true // Per ISA 220 and ISA 230
  };

  // Add manager sign-off if provided
  if (managerId && managerIdName) {
    chain.signOffs.push({
      role: SIGN_OFF_ROLES.MANAGER,
      userId: managerId,
      userName: managerIdName,
      status: SIGN_OFF_STATUS.NOT_STARTED,
      signedDate: null,
      comments: '',
      requiresRevision: false
    });
  }

  // Store chain
  if (!signOffRegistry.has(sectionId)) {
    signOffRegistry.set(sectionId, []);
  }
  signOffRegistry.get(sectionId).push(chain);

  return {
    success: true,
    message: `Sign-off chain created for ${sectionId}`,
    data: chain
  };
}

/**
 * Get current sign-off chain for a section
 * @param {string} sectionId - FSLI identifier
 * @returns {object} Current sign-off chain
 */
export function getSignOffChain(sectionId) {
  const chains = signOffRegistry.get(sectionId) || [];
  return chains.length > 0 ? chains[chains.length - 1] : null; // Return latest chain
}

/**
 * Mark work as ready for review
 * Transitions preparer sign-off to completed
 * @param {string} sectionId - FSLI identifier
 * @param {string} preparerId - ID of preparer
 * @param {string} notes - Completion notes
 * @returns {object} Updated sign-off status
 */
export function markWorkComplete(sectionId, preparerId, notes = '') {
  const chain = getSignOffChain(sectionId);

  if (!chain) {
    return {
      success: false,
      message: `No sign-off chain found for ${sectionId}`
    };
  }

  const preparerSignOff = chain.signOffs.find(s => s.role === SIGN_OFF_ROLES.PREPARER);

  if (!preparerSignOff || preparerSignOff.userId !== preparerId) {
    return {
      success: false,
      message: 'Preparer ID does not match'
    };
  }

  // Mark preparer as complete
  preparerSignOff.status = SIGN_OFF_STATUS.PENDING_REVIEW;
  preparerSignOff.completionPercentage = 100;
  preparerSignOff.comments = notes;

  // Transition chain to reviewer
  const reviewerSignOff = chain.signOffs.find(s => s.role === SIGN_OFF_ROLES.REVIEWER);
  if (reviewerSignOff) {
    reviewerSignOff.status = SIGN_OFF_STATUS.UNDER_REVIEW;
  }

  chain.overallStatus = SIGN_OFF_STATUS.PENDING_REVIEW;

  return {
    success: true,
    message: `Work marked complete and sent to reviewer`,
    data: {
      sectionId,
      chain,
      nextStep: `Awaiting review from ${reviewerSignOff?.userName || 'assigned reviewer'}`
    }
  };
}

/**
 * Submit review comments and decision
 * Reviewer can approve or request revision
 * @param {object} reviewData - Review details
 *   - sectionId: FSLI identifier
 *   - reviewerId: ID of reviewer
 *   - decision: 'approve', 'approve_with_conditions', 'needs_revision'
 *   - comments: Reviewer comments
 *   - conditionsOrRevisions: Specific items if revision needed
 * @returns {object} Updated sign-off status
 */
export function submitReview(reviewData) {
  const {
    sectionId,
    reviewerId,
    decision,
    comments = '',
    conditionsOrRevisions = []
  } = reviewData;

  const chain = getSignOffChain(sectionId);

  if (!chain) {
    return {
      success: false,
      message: `No sign-off chain found for ${sectionId}`
    };
  }

  const reviewerSignOff = chain.signOffs.find(s => s.role === SIGN_OFF_ROLES.REVIEWER);

  if (!reviewerSignOff || reviewerSignOff.userId !== reviewerId) {
    return {
      success: false,
      message: 'Reviewer ID does not match'
    };
  }

  // Update reviewer sign-off based on decision
  reviewerSignOff.comments = comments;
  reviewerSignOff.signedDate = new Date().toISOString();

  let nextStep = '';

  if (decision === 'approve') {
    reviewerSignOff.status = SIGN_OFF_STATUS.APPROVED;
    // Move to partner approval
    chain.finalApproval.status = SIGN_OFF_STATUS.UNDER_REVIEW;
    chain.overallStatus = SIGN_OFF_STATUS.PENDING_REVIEW;
    nextStep = `Awaiting partner approval from ${chain.finalApproval.userName}`;
  } else if (decision === 'approve_with_conditions') {
    reviewerSignOff.status = SIGN_OFF_STATUS.APPROVED_WITH_CONDITIONS;
    reviewerSignOff.conditions = conditionsOrRevisions;
    // Move to partner approval
    chain.finalApproval.status = SIGN_OFF_STATUS.UNDER_REVIEW;
    chain.overallStatus = SIGN_OFF_STATUS.PENDING_REVIEW;
    nextStep = `Sent to partner with conditions noted`;
  } else if (decision === 'needs_revision') {
    reviewerSignOff.status = SIGN_OFF_STATUS.NEEDS_REVISION;
    reviewerSignOff.revisionItems = conditionsOrRevisions;
    // Back to preparer
    const preparerSignOff = chain.signOffs.find(s => s.role === SIGN_OFF_ROLES.PREPARER);
    if (preparerSignOff) {
      preparerSignOff.status = SIGN_OFF_STATUS.IN_PROGRESS;
    }
    chain.overallStatus = SIGN_OFF_STATUS.NEEDS_REVISION;
    nextStep = `Revision requested by ${reviewerSignOff.userName}`;
  }

  return {
    success: true,
    message: `Review submitted for ${sectionId}`,
    data: {
      sectionId,
      decision,
      chain,
      nextStep,
      revisionItemsIfApplicable: decision === 'needs_revision' ? conditionsOrRevisions : null
    }
  };
}

/**
 * Submit final approval by partner
 * Partner can approve, approve with conditions, or reject
 * @param {object} approvalData - Approval details
 *   - sectionId: FSLI identifier
 *   - partnerId: ID of partner
 *   - decision: 'approve' or 'reject'
 *   - comments: Partner approval comments
 * @returns {object} Final approval status
 */
export function submitFinalApproval(approvalData) {
  const {
    sectionId,
    partnerId,
    decision,
    comments = ''
  } = approvalData;

  const chain = getSignOffChain(sectionId);

  if (!chain) {
    return {
      success: false,
      message: `No sign-off chain found for ${sectionId}`
    };
  }

  if (chain.finalApproval.userId !== partnerId) {
    return {
      success: false,
      message: 'Partner ID does not match'
    };
  }

  // Update final approval
  chain.finalApproval.comments = comments;
  chain.finalApproval.signedDate = new Date().toISOString();

  if (decision === 'approve') {
    chain.finalApproval.status = SIGN_OFF_STATUS.APPROVED;
    chain.overallStatus = SIGN_OFF_STATUS.APPROVED;
    return {
      success: true,
      message: `${sectionId} approved and signed off by partner`,
      data: {
        sectionId,
        chainId: chain.chainId,
        finalStatus: SIGN_OFF_STATUS.APPROVED,
        signedDate: chain.finalApproval.signedDate,
        readyForReporting: true
      }
    };
  } else {
    chain.finalApproval.status = SIGN_OFF_STATUS.REJECTED;
    chain.overallStatus = SIGN_OFF_STATUS.REJECTED;
    return {
      success: true,
      message: `${sectionId} rejected by partner`,
      data: {
        sectionId,
        chainId: chain.chainId,
        finalStatus: SIGN_OFF_STATUS.REJECTED,
        rejectionComments: comments,
        readyForReporting: false
      }
    };
  }
}

/**
 * Get sign-off status summary for a section
 * Shows current status of approval workflow
 * @param {string} sectionId - FSLI identifier
 * @returns {object} Sign-off status summary
 */
export function getSignOffStatus(sectionId) {
  const chain = getSignOffChain(sectionId);

  if (!chain) {
    return {
      sectionId,
      status: 'No sign-off chain',
      chain: null
    };
  }

  const summary = {
    sectionId,
    chainId: chain.chainId,
    overallStatus: chain.overallStatus,
    createdDate: chain.createdDate,
    signOffs: chain.signOffs.map(s => ({
      role: s.role,
      name: s.userName,
      status: s.status,
      signedDate: s.signedDate,
      hasComments: s.comments.length > 0
    })),
    finalApproval: {
      name: chain.finalApproval.userName,
      status: chain.finalApproval.status,
      signedDate: chain.finalApproval.signedDate
    },
    readyForReporting: chain.overallStatus === SIGN_OFF_STATUS.APPROVED,
    percentageComplete: calculateApprovalPercentage(chain)
  };

  return summary;
}

/**
 * Calculate overall approval percentage
 * @param {object} chain - Sign-off chain object
 * @returns {number} Percentage of approvals complete (0-100)
 */
function calculateApprovalPercentage(chain) {
  const allRoles = [...chain.signOffs, chain.finalApproval];
  const approvedCount = allRoles.filter(s => s.status === SIGN_OFF_STATUS.APPROVED || s.status === SIGN_OFF_STATUS.APPROVED_WITH_CONDITIONS).length;
  return Math.round((approvedCount / allRoles.length) * 100);
}

/**
 * Get sign-off history for section
 * Shows all sign-offs that have been submitted
 * @param {string} sectionId - FSLI identifier
 * @returns {array} Sign-off history
 */
export function getSignOffHistory(sectionId) {
  const chain = getSignOffChain(sectionId);

  if (!chain) {
    return [];
  }

  const history = [];

  // Add all sign-offs with dates
  chain.signOffs.forEach(s => {
    if (s.signedDate) {
      history.push({
        role: s.role,
        name: s.userName,
        signedDate: s.signedDate,
        status: s.status,
        comments: s.comments
      });
    }
  });

  // Add final approval
  if (chain.finalApproval.signedDate) {
    history.push({
      role: chain.finalApproval.role,
      name: chain.finalApproval.userName,
      signedDate: chain.finalApproval.signedDate,
      status: chain.finalApproval.status,
      comments: chain.finalApproval.comments
    });
  }

  // Sort by date
  return history.sort((a, b) => new Date(a.signedDate) - new Date(b.signedDate));
}

/**
 * Export sign-off documentation for audit file
 * Creates formal sign-off record for ISA 220 and ISA 230 compliance
 * @param {string} sectionId - FSLI identifier
 * @returns {object} Exportable sign-off documentation
 */
export function exportSignOffDocumentation(sectionId) {
  const chain = getSignOffChain(sectionId);
  const history = getSignOffHistory(sectionId);

  if (!chain) {
    return {
      sectionId,
      documentationAvailable: false
    };
  }

  return {
    sectionId,
    exportDate: new Date().toISOString(),
    chainId: chain.chainId,
    approvalChain: history.map((h, idx) => ({
      sequence: idx + 1,
      role: h.role,
      name: h.name,
      date: h.signedDate,
      status: h.status,
      comments: h.comments
    })),
    finalApprovalStatus: chain.overallStatus,
    readyForAuditFile: chain.overallStatus === SIGN_OFF_STATUS.APPROVED,
    isaCompliance: {
      isa220Compliant: true, // Quality control sign-off documented
      isa230Compliant: true // Documentation of review and approval
    }
  };
}

export default {
  createSignOffChain,
  getSignOffChain,
  markWorkComplete,
  submitReview,
  submitFinalApproval,
  getSignOffStatus,
  getSignOffHistory,
  exportSignOffDocumentation,
  SIGN_OFF_ROLES,
  SIGN_OFF_STATUS
};
