// Help text and regulatory detail map — extracted from AuditEngine_AURA.jsx
import {
  FRC_DETAIL,
  HMRC_DETAIL,
  FCA_DETAIL,
  PRA_DETAIL,
  CHARITY_COMMISSION_DETAIL
} from "../RegulatoryData";

export const REGULATORY_DETAIL_MAP = {
  frc: FRC_DETAIL,
  hmrc: HMRC_DETAIL,
  fca: FCA_DETAIL,
  pra: PRA_DETAIL,
  "charity-commission": CHARITY_COMMISSION_DETAIL
};

export const HELP_TEXT = {
  planning:"Planning papers establish the audit strategy, materiality, and team allocation per ISA 300. These form the foundation of the audit approach and must be completed before fieldwork begins.",
  risk:"Risk papers document the auditor's assessment of risks of material misstatement per ISA 315. They drive the nature, timing, and extent of further audit procedures.",
  lead:"Lead schedules bridge the trial balance to individual working papers. They trace each FSLI line from the TB through to detailed testing and must reconcile to the financial statements.",
  testing:"Testing programmes document substantive procedures performed per ISA 330/500. Each test must link to an identified risk and provide sufficient appropriate audit evidence.",
  completion:"Completion papers document the auditor's overall conclusions, subsequent events review, and going concern assessment. They must be finalised before the audit report is signed.",
  reporting:"Reporting papers include the audit report (ISA 700), management letter (ISA 265), and representations letter (ISA 580). These are the formal deliverables to stakeholders.",
  fs:"Financial statement working papers document the preparation and review of the entity's financial statements, ensuring compliance with the applicable framework.",
  regulatory:"Regulatory papers document compliance with laws and regulations (ISA 250) and filings with bodies such as Companies House, HMRC, FCA, and Charity Commission.",
  models:"Financial models provide independent auditor calculations for complex estimates including impairment, leases, ECL, and share-based payments per ISA 540.",
  research:"Research papers provide reference material including ISA encyclopaedia, chart of accounts templates, and audit methodology guidance.",
  integration:"Integrations enable import of trial balances and supporting data from accounting platforms such as Sage, Xero, and QuickBooks.",
  trail:"The audit trail map provides a cross-reference index of all working papers, evidence, and conclusions across the engagement file."
};
