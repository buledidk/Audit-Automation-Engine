--
-- 002_seed_reference_data.sql
-- Seed Reference Data for AuditEngine
--
-- Seeds jurisdiction_config, framework_config, and procedure_templates
-- with production reference data extracted from the application server.
--
-- All inserts use ON CONFLICT DO NOTHING for idempotent re-runs.
--

BEGIN;

-- ============================================================================
-- JURISDICTION CONFIGURATION
-- Source: server/app.js  GET /api/jurisdictions and GET /api/jurisdictions/:code
-- ============================================================================

INSERT INTO jurisdiction_config (
  jurisdiction_code, jurisdiction_name, region,
  primary_framework, secondary_frameworks,
  audit_exemption_threshold, accounts_filing_months,
  materiality_guidance, key_regulations, entity_types
) VALUES
(
  'UK', 'United Kingdom', 'Europe',
  'FRS102', '["IFRS"]',
  10200000.00, 9,
  '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.01}',
  '["Companies Act 2006", "Listing Rules"]',
  '["Limited Company", "Charity", "Cooperative"]'
),
(
  'DE', 'Germany', 'Europe',
  'IFRS', '["HGB"]',
  12000000.00, 12,
  '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.02}',
  '["HGB"]',
  '["GmbH", "AG", "KG", "OHG"]'
),
(
  'FR', 'France', 'Europe',
  'IFRS', '["French GAAP"]',
  8000000.00, 6,
  '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.02}',
  '["French Commercial Code"]',
  '["SA", "SAS", "SARL", "SCI"]'
),
(
  'IT', 'Italy', 'Europe',
  'IFRS', '["Italian GAAP"]',
  8800000.00, 6,
  '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.02}',
  '["Italian Civil Code"]',
  '["SPA", "SRL", "SNC", "SAS"]'
),
(
  'ES', 'Spain', 'Europe',
  'IFRS', '["Spanish GAAP"]',
  11400000.00, 6,
  '{"profit_basis": 0.05, "revenue_basis": 0.01, "assets_basis": 0.02}',
  '["Spanish Commercial Code"]',
  '["SA", "SL", "SC", "CB"]'
)
ON CONFLICT (jurisdiction_code) DO NOTHING;

-- ============================================================================
-- FRAMEWORK CONFIGURATION
-- ============================================================================

INSERT INTO framework_config (
  framework_code, framework_name, description,
  applicable_jurisdictions, is_active
) VALUES
(
  'FRS102',
  'Financial Reporting Standard 102',
  'The Financial Reporting Standard applicable in the UK and Republic of Ireland. '
  'Covers the recognition, measurement, presentation and disclosure requirements for '
  'transactions and events that are relevant to general purpose financial statements.',
  '["UK"]',
  TRUE
),
(
  'IFRS',
  'International Financial Reporting Standards',
  'Global accounting standards issued by the International Accounting Standards Board (IASB). '
  'Required or permitted for use in over 140 jurisdictions worldwide. Provides a common '
  'framework for financial reporting across borders.',
  '["UK", "DE", "FR", "IT", "ES"]',
  TRUE
),
(
  'IFRS_SME',
  'IFRS for Small and Medium-sized Entities',
  'A simplified version of full IFRS designed for small and medium-sized entities that do not '
  'have public accountability. Reduces disclosure requirements and simplifies recognition '
  'and measurement principles where appropriate.',
  '["UK", "DE", "FR", "IT", "ES"]',
  TRUE
)
ON CONFLICT (framework_code) DO NOTHING;

-- ============================================================================
-- PROCEDURE TEMPLATES
-- Common audit procedures covering major FSLIs
-- Source: server/app.js  GET /api/engagements/:id/procedures (mock data)
-- ============================================================================

INSERT INTO procedure_templates (
  procedure_code, procedure_name, description,
  fsli, assertion,
  applicable_frameworks, applicable_jurisdictions,
  sample_size_formula, estimated_hours, required_evidence, is_active
) VALUES
-- Revenue procedures
(
  'REV-001',
  'Revenue Recognition Testing',
  'Test revenue transactions for proper recognition in accordance with applicable framework. '
  'Select a sample of revenue transactions and trace to supporting documentation including '
  'contracts, delivery notes, and invoices to verify occurrence and accuracy.',
  'Revenue', 'Occurrence',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(25, population * 0.05)', 8,
  '["Sales invoices", "Contracts", "Delivery notes", "Bank statements"]',
  TRUE
),
(
  'REV-002',
  'Revenue Cut-off Testing',
  'Verify that revenue is recorded in the correct accounting period by testing transactions '
  'around the year-end date. Select transactions before and after period end to confirm '
  'proper cut-off treatment.',
  'Revenue', 'Cut-off',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(15, population * 0.03)', 6,
  '["Sales invoices near period end", "Credit notes", "Shipping documents", "Sales ledger"]',
  TRUE
),
-- Receivables procedures
(
  'REC-001',
  'Receivables Circularization',
  'Send confirmation requests to a sample of trade debtors to confirm balances outstanding '
  'at the reporting date. Perform alternative procedures for non-replies including subsequent '
  'cash receipts testing and invoice verification.',
  'Receivables', 'Existence',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(20, population * 0.10)', 10,
  '["Debtor confirmations", "Subsequent receipts", "Invoices", "Aged debtor listing"]',
  TRUE
),
(
  'REC-002',
  'Allowance for Doubtful Debts Review',
  'Review management''s estimate of the allowance for doubtful debts. Assess the aged debtor '
  'analysis, evaluate historical write-off rates, and test the reasonableness of specific '
  'and general provisions.',
  'Receivables', 'Valuation',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'ALL', 4,
  '["Aged debtor analysis", "Write-off history", "Post year-end receipts", "Credit reports"]',
  TRUE
),
-- Inventory procedures
(
  'INV-001',
  'Inventory Count Observation',
  'Attend the physical inventory count to observe counting procedures, perform test counts, '
  'and assess the condition and existence of inventory. Document count instructions, controls, '
  'and any discrepancies identified.',
  'Inventory', 'Existence',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(30, population * 0.05)', 12,
  '["Count sheets", "Test count records", "Inventory listing", "Warehouse layout"]',
  TRUE
),
(
  'INV-002',
  'Inventory Valuation Testing',
  'Test inventory valuation by comparing carrying amounts to cost and net realisable value. '
  'Verify cost calculations including raw materials, labour, and overhead allocation. '
  'Assess NRV for slow-moving or obsolete items.',
  'Inventory', 'Valuation',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(20, population * 0.05)', 8,
  '["Purchase invoices", "Cost build-up schedules", "Sales price lists", "Aged inventory report"]',
  TRUE
),
-- Fixed Assets procedures
(
  'FA-001',
  'Fixed Asset Additions Testing',
  'Select a sample of fixed asset additions during the period and verify existence, proper '
  'authorisation, correct classification, and accurate capitalisation amounts by tracing '
  'to purchase invoices, contracts, and physical inspection.',
  'Fixed Assets', 'Existence',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(15, population * 0.10)', 6,
  '["Purchase invoices", "Capital expenditure approvals", "Fixed asset register", "Title deeds"]',
  TRUE
),
(
  'FA-002',
  'Depreciation Recalculation',
  'Recalculate depreciation charges for a sample of fixed assets to verify accuracy of the '
  'depreciation expense. Assess the reasonableness of useful lives and depreciation methods '
  'applied under the applicable framework.',
  'Fixed Assets', 'Accuracy',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(10, population * 0.10)', 4,
  '["Fixed asset register", "Depreciation schedules", "Accounting policies"]',
  TRUE
),
-- Payables procedures
(
  'PAY-001',
  'Trade Payables Completeness Testing',
  'Perform a search for unrecorded liabilities by examining post year-end payments, '
  'supplier statements, and goods received not invoiced. Reconcile supplier statements '
  'to the purchase ledger for a sample of key suppliers.',
  'Payables', 'Completeness',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(20, population * 0.10)', 8,
  '["Supplier statements", "Post year-end payments", "GRN records", "Purchase ledger"]',
  TRUE
),
(
  'PAY-002',
  'Payables Cut-off Testing',
  'Verify that trade payables are recorded in the correct accounting period by examining '
  'purchase transactions and goods received notes around the year-end date to ensure '
  'proper cut-off treatment.',
  'Payables', 'Cut-off',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'GREATER(15, population * 0.03)', 5,
  '["Purchase invoices near period end", "GRN records", "Supplier statements"]',
  TRUE
),
-- Cash and Bank
(
  'CASH-001',
  'Bank Reconciliation Review',
  'Obtain bank reconciliations for all bank accounts at the reporting date. Verify the '
  'bank balance to confirmation or statement, test reconciling items for validity, and '
  'investigate aged or unusual items.',
  'Cash and Bank', 'Existence',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'ALL', 4,
  '["Bank confirmations", "Bank statements", "Bank reconciliations", "Cashbook"]',
  TRUE
),
-- Payroll and Employee Benefits
(
  'PAY-003',
  'Payroll Analytical Review',
  'Perform analytical procedures on payroll costs including month-by-month comparison, '
  'headcount analysis, and proof-in-total calculation. Investigate significant variances '
  'and unusual fluctuations in payroll expenses.',
  'Payroll', 'Completeness',
  '["FRS102", "IFRS", "IFRS_SME"]', '["UK", "DE", "FR", "IT", "ES"]',
  'ALL', 5,
  '["Payroll summaries", "HR records", "Tax filings", "Employment contracts"]',
  TRUE
)
ON CONFLICT (procedure_code) DO NOTHING;

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================

COMMIT;
