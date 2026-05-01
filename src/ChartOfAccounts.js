// ChartOfAccounts.js — UK Chart of Accounts Templates for 8 Industries
// Full implementation with fuzzy matching and auto-mapping

const COA_FSLI_SUMMARY = {
  Revenue: { classification: "PL", fsLines: ["Turnover", "Other operating income", "Interest receivable"], sign: "Cr" },
  Receivables: { classification: "BS", fsLines: ["Trade debtors", "Other debtors", "Prepayments"], sign: "Dr" },
  Inventory: { classification: "BS", fsLines: ["Raw materials", "Work in progress", "Finished goods", "Stock"], sign: "Dr" },
  Payables: { classification: "BS", fsLines: ["Trade creditors", "Other creditors", "Accruals", "Deferred income"], sign: "Cr" },
  Cash: { classification: "BS", fsLines: ["Bank accounts", "Cash in hand", "Short-term deposits"], sign: "Dr" },
  "Fixed Assets": { classification: "BS", fsLines: ["Tangible fixed assets", "Intangible fixed assets", "Investments"], sign: "Dr" },
  Equity: { classification: "BS", fsLines: ["Share capital", "Share premium", "Retained earnings", "Other reserves"], sign: "Cr" },
  Loans: { classification: "BS", fsLines: ["Bank loans", "Directors loans", "Finance leases", "Hire purchase"], sign: "Cr" },
  Provisions: { classification: "BS", fsLines: ["Provisions for liabilities", "Deferred tax", "Other provisions"], sign: "Cr" },
  Tax: { classification: "BS", fsLines: ["Corporation tax", "VAT", "PAYE/NIC"], sign: "Cr" },
  Other: { classification: "PL", fsLines: ["Exceptional items", "Tax on profit", "Dividends", "Depreciation", "Amortisation"], sign: "Dr" }
};

// Helper to create account objects
function a(code, name, type, category, fsliMapping, normalBalance, subCategory) {
  return { code, name, type, category, fsliMapping, normalBalance, subCategory };
}

// ============================================================
// CONSTRUCTION INDUSTRY
// ============================================================
const construction = [
  // Fixed Assets 1000-1999
  a(1000, "Freehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1010, "Leasehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1020, "Leasehold Improvements", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1030, "Plant and Machinery", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1040, "Heavy Plant Register", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1050, "Light Plant and Tools", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1060, "Scaffolding Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1070, "Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1080, "Vans and Trucks", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1090, "Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1100, "Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1110, "Furniture and Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1200, "Goodwill", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1210, "Software Licences", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1300, "Investments in Subsidiaries", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1310, "Investments in Joint Ventures", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1500, "Depreciation - Property", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1510, "Depreciation - Plant", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1520, "Depreciation - Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1530, "Depreciation - Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1540, "Depreciation - Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  // Current Assets 2000-2999
  a(2000, "Raw Materials Stock", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2010, "Work in Progress - Contracts", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2020, "WIP - Labour", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2030, "WIP - Materials", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2040, "WIP - Subcontractors", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2050, "WIP - Overheads Applied", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2100, "Trade Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2110, "Retention Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2120, "CIS Deductions Receivable", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2130, "Contract Variations Receivable", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2140, "Amounts Due from Subcontractors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2150, "Other Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2160, "Prepayments", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2170, "Accrued Income", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2180, "VAT Input Tax", "BS", "Current Assets", "Receivables", "Dr", "VAT"),
  a(2200, "Provision for Bad Debts", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2500, "Bank Current Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2510, "Bank Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2520, "Project Bank Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2530, "Petty Cash", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  // Current Liabilities 3000-3999
  a(3000, "Trade Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3010, "Retention Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3020, "CIS Liability", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3030, "Subcontractor Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3040, "Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3050, "Deferred Income", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3060, "Payments on Account", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3100, "VAT Output Tax", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3110, "VAT Liability", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3120, "PAYE and NIC", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3130, "Corporation Tax", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3140, "Other Taxes and Social Security", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3200, "Other Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3210, "Credit Card Account", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3220, "Directors Loan Account", "BS", "Current Liabilities", "Loans", "Cr", "Directors"),
  a(3300, "Bank Overdraft", "BS", "Current Liabilities", "Loans", "Cr", "Bank"),
  // Long-term Liabilities 4000-4999
  a(4000, "Bank Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4010, "Asset Finance - Plant", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4020, "Asset Finance - Vehicles", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4030, "Finance Lease Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4100, "Provision for Rectification", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4110, "Provision for Contract Losses", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4120, "Deferred Tax", "BS", "Long-term Liabilities", "Tax", "Cr", "Deferred Tax"),
  // Capital & Reserves 5000-5999
  a(5000, "Ordinary Share Capital", "BS", "Capital and Reserves", "Equity", "Cr", "Share Capital"),
  a(5010, "Share Premium Account", "BS", "Capital and Reserves", "Equity", "Cr", "Share Premium"),
  a(5100, "Profit and Loss Account", "BS", "Capital and Reserves", "Equity", "Cr", "Retained Earnings"),
  a(5110, "Dividends Paid", "BS", "Capital and Reserves", "Equity", "Dr", "Dividends"),
  a(5120, "Revaluation Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  // Revenue 6000-6999
  a(6000, "Contract Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6010, "New Build Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6020, "Refurbishment Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6030, "Maintenance Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6040, "Plant Hire Income", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  a(6050, "Variation Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6060, "Claims Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  // Cost of Sales 7000-7999
  a(7000, "Materials Purchased", "PL", "Cost of Sales", "Other", "Dr", "Materials"),
  a(7010, "Subcontractor Costs", "PL", "Cost of Sales", "Other", "Dr", "Subcontractors"),
  a(7020, "Direct Labour", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7030, "Agency Labour", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7040, "Plant Hire Costs", "PL", "Cost of Sales", "Other", "Dr", "Plant"),
  a(7050, "Skip and Waste Disposal", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7060, "Site Security", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7070, "Site Welfare and Facilities", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7080, "Scaffolding Costs", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7090, "Health and Safety Costs", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7100, "Small Tools and Consumables", "PL", "Cost of Sales", "Other", "Dr", "Materials"),
  a(7110, "Defects and Rectification", "PL", "Cost of Sales", "Other", "Dr", "Defects"),
  a(7120, "Stock Adjustments", "PL", "Cost of Sales", "Other", "Dr", "Adjustments"),
  // Overheads 8000-8999
  a(8000, "Directors Remuneration", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8010, "Office Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8020, "Employers NIC", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8030, "Pension Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8040, "Staff Training", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8050, "Rent and Rates", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8060, "Light and Heat", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8070, "Insurance", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8080, "Contractors All Risks Insurance", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8090, "Motor Expenses", "PL", "Overheads", "Other", "Dr", "Motor"),
  a(8100, "Telephone and Internet", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8110, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8120, "Postage", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8130, "Computer and IT Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8140, "Professional Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8150, "Accountancy Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8160, "Legal Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8170, "Bank Charges", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8180, "Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8190, "Depreciation - Plant", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8200, "Depreciation - Vehicles", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8210, "Depreciation - Office Equipment", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8220, "Bad Debts", "PL", "Overheads", "Other", "Dr", "Bad Debts"),
  a(8230, "Entertaining", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8240, "Travel and Subsistence", "PL", "Overheads", "Other", "Dr", "Travel"),
  // Other Income/Tax 9000-9999
  a(9000, "Interest Receivable", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9010, "Profit on Disposal of Assets", "PL", "Other Income", "Other", "Cr", "Disposals"),
  a(9020, "Sundry Income", "PL", "Other Income", "Revenue", "Cr", "Other"),
  a(9100, "Corporation Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9110, "Deferred Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9200, "Exceptional Items - Costs", "PL", "Exceptional", "Other", "Dr", "Exceptional"),
  a(9210, "Exceptional Items - Income", "PL", "Exceptional", "Other", "Cr", "Exceptional"),
  // Additional construction-specific accounts
  a(1120, "Site Cabins and Portacabins", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1130, "Temporary Works Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1140, "Surveying Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1150, "Concrete Batching Plant", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1550, "Depreciation - Furniture", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(2060, "WIP - Preliminaries", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2070, "WIP - Design Fees", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2190, "Amounts Recoverable on Contracts", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2210, "Staff Loans and Advances", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2540, "Building Society Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(3070, "Amounts Due to Subcontractors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3080, "Applications for Payment Received", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3150, "Construction Industry Levy", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3230, "Hire Purchase Creditor Current", "BS", "Current Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4040, "CBILS Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4130, "Provision for Restoration Costs", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(5130, "Capital Redemption Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(6070, "Compensation Events", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6080, "Preliminaries Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6090, "Design Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(7130, "PPE and Safety Equipment", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7140, "Temporary Works Costs", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7150, "Testing and Commissioning", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7160, "Environmental Costs", "PL", "Cost of Sales", "Other", "Dr", "Site Costs"),
  a(7170, "Design Costs", "PL", "Cost of Sales", "Other", "Dr", "Design"),
  a(7180, "Preliminaries Costs", "PL", "Cost of Sales", "Other", "Dr", "Preliminaries"),
  a(8250, "Recruitment Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8260, "CITB Levy", "PL", "Overheads", "Other", "Dr", "Levies"),
  a(8270, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8280, "Repairs and Maintenance", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8290, "Cleaning Costs", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8300, "Subscriptions", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8310, "Marketing and Advertising", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(9030, "Insurance Recoveries", "PL", "Other Income", "Other", "Cr", "Insurance"),
  a(9040, "Grant Income", "PL", "Other Income", "Revenue", "Cr", "Grants"),
  a(9120, "Prior Year Adjustments", "PL", "Tax", "Other", "Dr", "Adjustments"),
];

// ============================================================
// MANUFACTURING INDUSTRY
// ============================================================
const manufacturing = [
  // Fixed Assets 1000-1999
  a(1000, "Freehold Land and Buildings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1010, "Leasehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1020, "Leasehold Improvements", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1030, "Production Machinery", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1040, "CNC Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1050, "Assembly Line Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1060, "Quality Testing Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1070, "Warehouse Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1080, "Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1090, "Delivery Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1100, "Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1110, "Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1120, "Furniture and Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1200, "Goodwill", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1210, "Patents and Trademarks", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1220, "Development Costs Capitalised", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1230, "Software Licences", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1300, "Investments in Subsidiaries", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1500, "Depreciation - Property", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1510, "Depreciation - Machinery", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1520, "Depreciation - Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1530, "Depreciation - Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1540, "Amortisation - Intangibles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  // Current Assets 2000-2999
  a(2000, "Raw Materials Stock", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2010, "Component Parts Stock", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2020, "Packaging Materials", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2030, "Work in Progress - Manufacturing", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2040, "WIP - Labour Content", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2050, "WIP - Overhead Absorbed", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2060, "Finished Goods Stock", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2070, "Goods in Transit", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2080, "Stock Provision - Obsolescence", "BS", "Current Assets", "Inventory", "Cr", "Provisions"),
  a(2100, "Trade Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2110, "Export Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2120, "Other Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2130, "Prepayments", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2140, "Accrued Income", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2150, "VAT Input Tax", "BS", "Current Assets", "Receivables", "Dr", "VAT"),
  a(2200, "Provision for Bad Debts", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2500, "Bank Current Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2510, "Bank Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2520, "Petty Cash", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  // Current Liabilities 3000-3999
  a(3000, "Trade Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3010, "Import Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3020, "Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3030, "Deferred Income", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3040, "Payments on Account", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3100, "VAT Output Tax", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3110, "VAT Liability", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3120, "PAYE and NIC", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3130, "Corporation Tax", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3200, "Other Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3210, "Credit Card Account", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3220, "Directors Loan Account", "BS", "Current Liabilities", "Loans", "Cr", "Directors"),
  a(3300, "Bank Overdraft", "BS", "Current Liabilities", "Loans", "Cr", "Bank"),
  // Long-term Liabilities 4000-4999
  a(4000, "Bank Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4010, "Asset Finance - Machinery", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4020, "Asset Finance - Vehicles", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4030, "Finance Lease Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4100, "Provision for Warranties", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4110, "Provision for Decommissioning", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4120, "Deferred Tax", "BS", "Long-term Liabilities", "Tax", "Cr", "Deferred Tax"),
  // Capital & Reserves 5000-5999
  a(5000, "Ordinary Share Capital", "BS", "Capital and Reserves", "Equity", "Cr", "Share Capital"),
  a(5010, "Share Premium Account", "BS", "Capital and Reserves", "Equity", "Cr", "Share Premium"),
  a(5100, "Profit and Loss Account", "BS", "Capital and Reserves", "Equity", "Cr", "Retained Earnings"),
  a(5110, "Dividends Paid", "BS", "Capital and Reserves", "Equity", "Dr", "Dividends"),
  a(5120, "Revaluation Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  // Revenue 6000-6999
  a(6000, "Product Sales - Domestic", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6010, "Product Sales - Export", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6020, "Contract Manufacturing Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6030, "Spare Parts Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6040, "Tooling Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6050, "Scrap Sales", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  // Cost of Sales 7000-7999
  a(7000, "Raw Materials Consumed", "PL", "Cost of Sales", "Other", "Dr", "Materials"),
  a(7010, "Component Parts Consumed", "PL", "Cost of Sales", "Other", "Dr", "Materials"),
  a(7020, "Packaging Costs", "PL", "Cost of Sales", "Other", "Dr", "Materials"),
  a(7030, "Direct Production Labour", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7040, "Agency Production Labour", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7050, "Production Overheads Absorbed", "PL", "Cost of Sales", "Other", "Dr", "Overheads"),
  a(7060, "Factory Rent and Rates", "PL", "Cost of Sales", "Other", "Dr", "Factory Costs"),
  a(7070, "Factory Power and Utilities", "PL", "Cost of Sales", "Other", "Dr", "Factory Costs"),
  a(7080, "Machine Maintenance", "PL", "Cost of Sales", "Other", "Dr", "Factory Costs"),
  a(7090, "Quality Control Costs", "PL", "Cost of Sales", "Other", "Dr", "Quality"),
  a(7100, "Carriage Inwards", "PL", "Cost of Sales", "Other", "Dr", "Distribution"),
  a(7110, "Carriage Outwards", "PL", "Cost of Sales", "Other", "Dr", "Distribution"),
  a(7120, "Stock Adjustments", "PL", "Cost of Sales", "Other", "Dr", "Adjustments"),
  a(7130, "Warranty Costs", "PL", "Cost of Sales", "Other", "Dr", "Warranty"),
  a(7140, "Production Waste and Scrap", "PL", "Cost of Sales", "Other", "Dr", "Waste"),
  // Overheads 8000-8999
  a(8000, "Directors Remuneration", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8010, "Office Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8020, "Employers NIC", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8030, "Pension Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8040, "Staff Training", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8050, "Rent and Rates - Office", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8060, "Light and Heat - Office", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8070, "Insurance", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8080, "Motor Expenses", "PL", "Overheads", "Other", "Dr", "Motor"),
  a(8090, "Telephone and Internet", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8100, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8110, "Computer and IT Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8120, "Professional Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8130, "Accountancy Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8140, "Legal Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8150, "Bank Charges", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8160, "Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8170, "Depreciation - Machinery", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8180, "Depreciation - Vehicles", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8190, "Depreciation - Office Equipment", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8200, "Amortisation", "PL", "Overheads", "Other", "Dr", "Amortisation"),
  a(8210, "Bad Debts", "PL", "Overheads", "Other", "Dr", "Bad Debts"),
  a(8220, "Entertaining", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8230, "Travel and Subsistence", "PL", "Overheads", "Other", "Dr", "Travel"),
  a(8240, "Research and Development", "PL", "Overheads", "Other", "Dr", "R&D"),
  // Other Income/Tax 9000-9999
  a(9000, "Interest Receivable", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9010, "Profit on Disposal of Assets", "PL", "Other Income", "Other", "Cr", "Disposals"),
  a(9020, "Sundry Income", "PL", "Other Income", "Revenue", "Cr", "Other"),
  a(9030, "Grant Income", "PL", "Other Income", "Revenue", "Cr", "Grants"),
  a(9100, "Corporation Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9110, "Deferred Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9200, "Exceptional Items - Costs", "PL", "Exceptional", "Other", "Dr", "Exceptional"),
  a(9210, "Exceptional Items - Income", "PL", "Exceptional", "Other", "Cr", "Exceptional"),
  // Additional manufacturing-specific accounts
  a(1130, "Moulding and Tooling Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1140, "Forklift Trucks", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1150, "Cleanroom Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1160, "Environmental Control Systems", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1550, "Depreciation - Furniture", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(2090, "Consumables and Spares Stock", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2160, "Staff Loans and Advances", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2170, "Customs Duty Recoverable", "BS", "Current Assets", "Receivables", "Dr", "Tax"),
  a(2530, "Building Society Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(3050, "Customer Deposits Received", "BS", "Current Liabilities", "Payables", "Cr", "Deposits"),
  a(3060, "Warranty Provision - Current", "BS", "Current Liabilities", "Payables", "Cr", "Provisions"),
  a(3230, "Hire Purchase Creditor", "BS", "Current Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4040, "CBILS Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4130, "Provision for Restructuring", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(5130, "Capital Redemption Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(6060, "Royalty Income", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  a(6070, "Waste Recycling Income", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  a(7150, "Tooling Costs", "PL", "Cost of Sales", "Other", "Dr", "Materials"),
  a(7160, "Calibration Costs", "PL", "Cost of Sales", "Other", "Dr", "Quality"),
  a(7170, "Subcontract Processing", "PL", "Cost of Sales", "Other", "Dr", "Subcontractors"),
  a(7180, "Customs Duty", "PL", "Cost of Sales", "Other", "Dr", "Duties"),
  a(7190, "Royalties Paid", "PL", "Cost of Sales", "Other", "Dr", "Royalties"),
  a(8250, "Recruitment Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8260, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8270, "Repairs and Maintenance - Office", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8280, "Cleaning Costs", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8290, "Subscriptions", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8300, "Marketing and Advertising", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8310, "Exhibition Costs", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8320, "Postage and Courier", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(9040, "Insurance Recoveries", "PL", "Other Income", "Other", "Cr", "Insurance"),
  a(9120, "Prior Year Adjustments", "PL", "Tax", "Other", "Dr", "Adjustments"),
];

// ============================================================
// TECHNOLOGY INDUSTRY
// ============================================================
const technology = [
  // Fixed Assets 1000-1999
  a(1000, "Freehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1010, "Leasehold Office Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1020, "Leasehold Improvements", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1030, "Server Hardware", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1040, "Network Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1050, "Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1060, "Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1070, "Furniture and Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1080, "Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1200, "Goodwill", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1210, "Capitalised R&D Costs", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1220, "Capitalised Development Costs", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1230, "Software Platform Costs", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1240, "Acquired IP and Technology", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1250, "Patents and Trademarks", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1260, "Customer Relationships Acquired", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1270, "Software Licences", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1300, "Investments in Subsidiaries", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1310, "Investments in Associates", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1500, "Depreciation - Property", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1510, "Depreciation - Servers", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1520, "Depreciation - Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1530, "Depreciation - Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1540, "Amortisation - Capitalised R&D", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  a(1550, "Amortisation - Software Platform", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  a(1560, "Amortisation - Acquired IP", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  // Current Assets 2000-2999
  a(2000, "Trade Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2010, "Contract Assets", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2020, "Unbilled Revenue", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2030, "Other Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2040, "Prepayments", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2050, "Prepaid Hosting Costs", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2060, "R&D Tax Credit Receivable", "BS", "Current Assets", "Receivables", "Dr", "Tax"),
  a(2070, "Accrued Income", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2080, "VAT Input Tax", "BS", "Current Assets", "Receivables", "Dr", "VAT"),
  a(2100, "Provision for Bad Debts", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2500, "Bank Current Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2510, "Bank Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2520, "Short Term Deposits", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2530, "Petty Cash", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  // Current Liabilities 3000-3999
  a(3000, "Trade Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3010, "Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3020, "Deferred Revenue - SaaS", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3030, "Deferred Revenue - Licences", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3040, "Deferred Revenue - Support", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3050, "Contract Liabilities", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3060, "Customer Deposits", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3100, "VAT Output Tax", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3110, "VAT Liability", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3120, "PAYE and NIC", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3130, "Corporation Tax", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3200, "Other Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3210, "Credit Card Account", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3220, "Directors Loan Account", "BS", "Current Liabilities", "Loans", "Cr", "Directors"),
  a(3230, "Share Options Liability", "BS", "Current Liabilities", "Equity", "Cr", "Share Options"),
  a(3300, "Bank Overdraft", "BS", "Current Liabilities", "Loans", "Cr", "Bank"),
  // Long-term Liabilities 4000-4999
  a(4000, "Bank Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4010, "Venture Debt", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4020, "Convertible Loan Notes", "BS", "Long-term Liabilities", "Loans", "Cr", "Convertibles"),
  a(4030, "Finance Lease Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4100, "Provision for Dilapidations", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4110, "Deferred Tax", "BS", "Long-term Liabilities", "Tax", "Cr", "Deferred Tax"),
  a(4120, "Long-term Deferred Revenue", "BS", "Long-term Liabilities", "Payables", "Cr", "Deferred Income"),
  // Capital & Reserves 5000-5999
  a(5000, "Ordinary Share Capital", "BS", "Capital and Reserves", "Equity", "Cr", "Share Capital"),
  a(5010, "Preference Share Capital", "BS", "Capital and Reserves", "Equity", "Cr", "Share Capital"),
  a(5020, "Share Premium Account", "BS", "Capital and Reserves", "Equity", "Cr", "Share Premium"),
  a(5030, "Share Options Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(5040, "EMI Share Option Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(5100, "Profit and Loss Account", "BS", "Capital and Reserves", "Equity", "Cr", "Retained Earnings"),
  a(5110, "Dividends Paid", "BS", "Capital and Reserves", "Equity", "Dr", "Dividends"),
  a(5120, "Foreign Currency Translation Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  // Revenue 6000-6999
  a(6000, "SaaS Subscription Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6010, "Software Licence Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6020, "Implementation Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6030, "Support and Maintenance Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6040, "Consulting Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6050, "Training Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6060, "API and Usage Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6070, "Hardware Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  // Cost of Sales 7000-7999
  a(7000, "Hosting and Infrastructure", "PL", "Cost of Sales", "Other", "Dr", "Infrastructure"),
  a(7010, "Cloud Services (AWS/Azure/GCP)", "PL", "Cost of Sales", "Other", "Dr", "Infrastructure"),
  a(7020, "Third Party Licence Costs", "PL", "Cost of Sales", "Other", "Dr", "Licences"),
  a(7030, "Data Centre Costs", "PL", "Cost of Sales", "Other", "Dr", "Infrastructure"),
  a(7040, "Technical Support Staff", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7050, "Implementation Delivery Costs", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7060, "Payment Processing Fees", "PL", "Cost of Sales", "Other", "Dr", "Transaction Costs"),
  a(7070, "Content Delivery Network", "PL", "Cost of Sales", "Other", "Dr", "Infrastructure"),
  a(7080, "Domain and SSL Costs", "PL", "Cost of Sales", "Other", "Dr", "Infrastructure"),
  // Overheads 8000-8999
  a(8000, "Directors Remuneration", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8010, "Developer Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8020, "Sales and Marketing Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8030, "Admin Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8040, "Employers NIC", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8050, "Pension Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8060, "Share Based Payment Charge", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8070, "Staff Training and Conferences", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8080, "Recruitment Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8090, "Contractor and Freelancer Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8100, "Rent and Rates", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8110, "Light and Heat", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8120, "Insurance", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8130, "Cyber Insurance", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8140, "Marketing and Advertising", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8150, "Digital Marketing", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8160, "Motor Expenses", "PL", "Overheads", "Other", "Dr", "Motor"),
  a(8170, "Telephone and Internet", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8180, "Software Subscriptions", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8190, "Professional Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8200, "Accountancy Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8210, "Legal Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8220, "Patent and IP Costs", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8230, "Bank Charges", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8240, "Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8250, "FX Losses", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8260, "Depreciation - Hardware", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8270, "Depreciation - Office Equipment", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8280, "Amortisation - Capitalised Dev", "PL", "Overheads", "Other", "Dr", "Amortisation"),
  a(8290, "Bad Debts", "PL", "Overheads", "Other", "Dr", "Bad Debts"),
  a(8300, "Travel and Subsistence", "PL", "Overheads", "Other", "Dr", "Travel"),
  a(8310, "Entertaining", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8320, "R&D Costs Expensed", "PL", "Overheads", "Other", "Dr", "R&D"),
  // Other Income/Tax 9000-9999
  a(9000, "Interest Receivable", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9010, "FX Gains", "PL", "Other Income", "Other", "Cr", "FX"),
  a(9020, "R&D Tax Credit", "PL", "Other Income", "Other", "Cr", "Tax Credits"),
  a(9030, "Grant Income", "PL", "Other Income", "Revenue", "Cr", "Grants"),
  a(9040, "Profit on Disposal of Assets", "PL", "Other Income", "Other", "Cr", "Disposals"),
  a(9050, "Sundry Income", "PL", "Other Income", "Revenue", "Cr", "Other"),
  a(9100, "Corporation Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9110, "Deferred Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9200, "Exceptional Items - Costs", "PL", "Exceptional", "Other", "Dr", "Exceptional"),
  a(9210, "Exceptional Items - Income", "PL", "Exceptional", "Other", "Cr", "Exceptional"),
  // Additional technology-specific accounts
  a(1090, "Right of Use Asset - Office", "BS", "Fixed Assets", "Fixed Assets", "Dr", "IFRS16"),
  a(1280, "Domain Names and URLs", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1570, "Amortisation - Customer Relationships", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  a(2090, "Security Deposits", "BS", "Current Assets", "Receivables", "Dr", "Deposits"),
  a(2110, "Intercompany Receivable", "BS", "Current Assets", "Receivables", "Dr", "Intercompany"),
  a(2540, "Escrow Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(3070, "Intercompany Payable", "BS", "Current Liabilities", "Payables", "Cr", "Intercompany"),
  a(3080, "Employee Expense Claims", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3090, "Payroll Accrual", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3240, "R&D Tax Credit Advance", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(4040, "SEIS/EIS Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "Investor Obligations"),
  a(4130, "Provision for Restructuring", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(5050, "Treasury Shares", "BS", "Capital and Reserves", "Equity", "Dr", "Share Capital"),
  a(5130, "Merger Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(6080, "Marketplace Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6090, "Advertising Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(7090, "Customer Success Costs", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7100, "Data Storage Costs", "PL", "Cost of Sales", "Other", "Dr", "Infrastructure"),
  a(7110, "Security and Monitoring Costs", "PL", "Cost of Sales", "Other", "Dr", "Infrastructure"),
  a(8330, "Office Supplies", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8340, "Repairs and Maintenance", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8350, "Cleaning Costs", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8360, "Subscriptions and Memberships", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8370, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8380, "Postage and Courier", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8390, "Staff Welfare and Benefits", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8400, "Co-working Space Costs", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(9060, "Insurance Recoveries", "PL", "Other Income", "Other", "Cr", "Insurance"),
  a(9120, "Prior Year Adjustments", "PL", "Tax", "Other", "Dr", "Adjustments"),
];

// ============================================================
// FINANCIAL SERVICES INDUSTRY
// ============================================================
const financial_services = [
  // Fixed Assets 1000-1999
  a(1000, "Freehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1010, "Leasehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1020, "Leasehold Improvements", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1030, "Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1040, "Server Infrastructure", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1050, "Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1060, "Furniture and Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1070, "Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1200, "Goodwill", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1210, "Acquired Customer Books", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1220, "Software Licences", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1230, "Regulatory Licences", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1240, "Capitalised Platform Costs", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1300, "Investments - Listed Securities", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1310, "Investments - Unlisted Securities", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1320, "Investments in Subsidiaries", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1330, "Investments in Associates", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1500, "Depreciation - Property", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1510, "Depreciation - Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1520, "Depreciation - Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1530, "Amortisation - Intangibles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  // Current Assets 2000-2999
  a(2000, "Trade Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2010, "Fees Receivable", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2020, "Commission Receivable", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2030, "Accrued Fee Income", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2040, "Other Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2050, "Prepayments", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2060, "Regulatory Deposits", "BS", "Current Assets", "Receivables", "Dr", "Regulatory"),
  a(2070, "VAT Input Tax", "BS", "Current Assets", "Receivables", "Dr", "VAT"),
  a(2080, "Loans and Advances to Customers", "BS", "Current Assets", "Receivables", "Dr", "Loans Issued"),
  a(2100, "Provision for Bad Debts", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2110, "ECL Provision - Stage 1", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2120, "ECL Provision - Stage 2", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2130, "ECL Provision - Stage 3", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2500, "Bank Current Account - Firm", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2510, "Bank Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2520, "Client Money Account - Segregated", "BS", "Current Assets", "Cash", "Dr", "Client Money"),
  a(2530, "Client Money Account - Designated", "BS", "Current Assets", "Cash", "Dr", "Client Money"),
  a(2540, "Short Term Deposits", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2550, "Petty Cash", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  // Current Liabilities 3000-3999
  a(3000, "Trade Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3010, "Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3020, "Deferred Fee Income", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3030, "Client Money Creditor", "BS", "Current Liabilities", "Payables", "Cr", "Client Money"),
  a(3040, "Customer Deposits Held", "BS", "Current Liabilities", "Payables", "Cr", "Deposits"),
  a(3050, "Commissions Payable", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3060, "Bonus Accrual", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3100, "VAT Output Tax", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3110, "VAT Liability", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3120, "PAYE and NIC", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3130, "Corporation Tax", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3200, "Other Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3210, "Credit Card Account", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3220, "Directors Loan Account", "BS", "Current Liabilities", "Loans", "Cr", "Directors"),
  a(3300, "Bank Overdraft", "BS", "Current Liabilities", "Loans", "Cr", "Bank"),
  // Long-term Liabilities 4000-4999
  a(4000, "Bank Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4010, "Subordinated Debt", "BS", "Long-term Liabilities", "Loans", "Cr", "Regulatory Capital"),
  a(4020, "Finance Lease Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4100, "Provision for Regulatory Fines", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4110, "Provision for PI Claims", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4120, "Provision for Redress", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4130, "Deferred Tax", "BS", "Long-term Liabilities", "Tax", "Cr", "Deferred Tax"),
  // Capital & Reserves 5000-5999
  a(5000, "Ordinary Share Capital", "BS", "Capital and Reserves", "Equity", "Cr", "Share Capital"),
  a(5010, "Share Premium Account", "BS", "Capital and Reserves", "Equity", "Cr", "Share Premium"),
  a(5020, "Regulatory Capital Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(5100, "Profit and Loss Account", "BS", "Capital and Reserves", "Equity", "Cr", "Retained Earnings"),
  a(5110, "Dividends Paid", "BS", "Capital and Reserves", "Equity", "Dr", "Dividends"),
  a(5120, "Revaluation Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  // Revenue 6000-6999
  a(6000, "Advisory Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6010, "Management Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6020, "Performance Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6030, "Brokerage Commission", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6040, "Trail Commission", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6050, "Administration Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6060, "Platform Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6070, "Interest Income - Loans", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6080, "Arrangement Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  // Cost of Sales 7000-7999
  a(7000, "Introducer Commissions", "PL", "Cost of Sales", "Other", "Dr", "Commissions"),
  a(7010, "Sub-Advisory Fees", "PL", "Cost of Sales", "Other", "Dr", "Commissions"),
  a(7020, "Custodian Fees", "PL", "Cost of Sales", "Other", "Dr", "Direct Costs"),
  a(7030, "Transaction Costs", "PL", "Cost of Sales", "Other", "Dr", "Direct Costs"),
  a(7040, "Market Data Costs", "PL", "Cost of Sales", "Other", "Dr", "Direct Costs"),
  a(7050, "Bloomberg Terminal Costs", "PL", "Cost of Sales", "Other", "Dr", "Direct Costs"),
  a(7060, "ECL Impairment Charge", "PL", "Cost of Sales", "Other", "Dr", "Impairment"),
  a(7070, "Settlement Costs", "PL", "Cost of Sales", "Other", "Dr", "Direct Costs"),
  // Overheads 8000-8999
  a(8000, "Directors Remuneration", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8010, "Staff Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8020, "Employers NIC", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8030, "Pension Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8040, "Staff Bonuses", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8050, "Staff Training and CPD", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8060, "Recruitment Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8070, "Rent and Rates", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8080, "Light and Heat", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8090, "Insurance - PI", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8100, "Insurance - Other", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8110, "FCA Fees and Levies", "PL", "Overheads", "Other", "Dr", "Regulatory"),
  a(8120, "FSCS Levy", "PL", "Overheads", "Other", "Dr", "Regulatory"),
  a(8130, "Compliance Consultancy", "PL", "Overheads", "Other", "Dr", "Regulatory"),
  a(8140, "Motor Expenses", "PL", "Overheads", "Other", "Dr", "Motor"),
  a(8150, "Telephone and Internet", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8160, "Computer and IT Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8170, "Professional Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8180, "Accountancy and Audit Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8190, "Legal Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8200, "Bank Charges", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8210, "Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8220, "Depreciation", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8230, "Amortisation", "PL", "Overheads", "Other", "Dr", "Amortisation"),
  a(8240, "Bad Debts", "PL", "Overheads", "Other", "Dr", "Bad Debts"),
  a(8250, "Travel and Subsistence", "PL", "Overheads", "Other", "Dr", "Travel"),
  a(8260, "Entertaining", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8270, "Marketing and Advertising", "PL", "Overheads", "Other", "Dr", "Marketing"),
  // Other Income/Tax 9000-9999
  a(9000, "Interest Receivable", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9010, "Investment Gains", "PL", "Other Income", "Other", "Cr", "Investments"),
  a(9020, "Investment Losses", "PL", "Other Income", "Other", "Dr", "Investments"),
  a(9030, "Dividend Income", "PL", "Other Income", "Revenue", "Cr", "Investments"),
  a(9040, "FX Gains and Losses", "PL", "Other Income", "Other", "Cr", "FX"),
  a(9050, "Profit on Disposal of Assets", "PL", "Other Income", "Other", "Cr", "Disposals"),
  a(9060, "Sundry Income", "PL", "Other Income", "Revenue", "Cr", "Other"),
  a(9100, "Corporation Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9110, "Deferred Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9200, "Exceptional Items - Costs", "PL", "Exceptional", "Other", "Dr", "Exceptional"),
  a(9210, "Exceptional Items - Income", "PL", "Exceptional", "Other", "Cr", "Exceptional"),
  // Additional financial services-specific accounts
  a(1080, "Security Systems", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1250, "Trading Platform Software", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1540, "Amortisation - Platform", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  a(2090, "Settlement Receivable", "BS", "Current Assets", "Receivables", "Dr", "Settlements"),
  a(2140, "ECL Provision - POCI", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2560, "Nostro Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(3070, "Settlement Payable", "BS", "Current Liabilities", "Payables", "Cr", "Settlements"),
  a(3080, "Employee Expense Claims", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3090, "Payroll Accrual", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3230, "Intercompany Payable", "BS", "Current Liabilities", "Payables", "Cr", "Intercompany"),
  a(4030, "Tier 2 Capital Instruments", "BS", "Long-term Liabilities", "Loans", "Cr", "Regulatory Capital"),
  a(4140, "Pension Scheme Liability", "BS", "Long-term Liabilities", "Provisions", "Cr", "Pensions"),
  a(5030, "Capital Redemption Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(5130, "Merger Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(6090, "Foreign Exchange Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6100, "Custody Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(7080, "Compliance Monitoring Costs", "PL", "Cost of Sales", "Other", "Dr", "Compliance"),
  a(7090, "AML Screening Costs", "PL", "Cost of Sales", "Other", "Dr", "Compliance"),
  a(8280, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8290, "Postage and Courier", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8300, "Subscriptions", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8310, "Repairs and Maintenance", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8320, "Cleaning Costs", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8330, "Staff Welfare", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8340, "Regulatory Capital Costs", "PL", "Overheads", "Other", "Dr", "Regulatory"),
  a(9070, "Insurance Recoveries", "PL", "Other Income", "Other", "Cr", "Insurance"),
  a(9120, "Prior Year Adjustments", "PL", "Tax", "Other", "Dr", "Adjustments"),
];

// ============================================================
// RETAIL INDUSTRY
// ============================================================
const retail = [
  // Fixed Assets 1000-1999
  a(1000, "Freehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1010, "Leasehold Store Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1020, "Leasehold Improvements - Stores", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1030, "Warehouse Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1040, "Shop Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1050, "EPOS and Till Systems", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1060, "Refrigeration Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1070, "Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1080, "Delivery Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1090, "Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1100, "Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1110, "Furniture and Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1200, "Goodwill", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1210, "Brand and Trademarks", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1220, "Software and E-commerce Platform", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1230, "Software Licences", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1300, "Investments in Subsidiaries", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1500, "Depreciation - Property", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1510, "Depreciation - Shop Fittings", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1520, "Depreciation - Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1530, "Depreciation - Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1540, "Amortisation - Intangibles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  // Current Assets 2000-2999
  a(2000, "Goods for Resale", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2010, "Stock in Transit", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2020, "Stock at Warehouse", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2030, "Stock at Stores", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2040, "Consignment Stock", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2050, "Stock Provision - Obsolescence", "BS", "Current Assets", "Inventory", "Cr", "Provisions"),
  a(2060, "Stock Provision - Shrinkage", "BS", "Current Assets", "Inventory", "Cr", "Provisions"),
  a(2100, "Trade Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2110, "Concession Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2120, "Other Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2130, "Prepayments", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2140, "Accrued Income", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2150, "VAT Input Tax", "BS", "Current Assets", "Receivables", "Dr", "VAT"),
  a(2200, "Provision for Bad Debts", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2500, "Bank Current Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2510, "Bank Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2520, "Cash at Stores", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  a(2530, "Cash in Transit", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  a(2540, "Petty Cash", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  // Current Liabilities 3000-3999
  a(3000, "Trade Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3010, "Supplier Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3020, "Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3030, "Deferred Income", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3040, "Gift Card Liability", "BS", "Current Liabilities", "Payables", "Cr", "Gift Cards"),
  a(3050, "Loyalty Programme Liability", "BS", "Current Liabilities", "Payables", "Cr", "Loyalty"),
  a(3060, "Returns Provision", "BS", "Current Liabilities", "Payables", "Cr", "Returns"),
  a(3070, "Deposits from Customers", "BS", "Current Liabilities", "Payables", "Cr", "Deposits"),
  a(3100, "VAT Output Tax", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3110, "VAT Liability", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3120, "PAYE and NIC", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3130, "Corporation Tax", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3200, "Other Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3210, "Credit Card Account", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3220, "Directors Loan Account", "BS", "Current Liabilities", "Loans", "Cr", "Directors"),
  a(3300, "Bank Overdraft", "BS", "Current Liabilities", "Loans", "Cr", "Bank"),
  // Long-term Liabilities 4000-4999
  a(4000, "Bank Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4010, "Asset Finance", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4020, "Finance Lease Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4030, "Right of Use Asset Lease Liability", "BS", "Long-term Liabilities", "Loans", "Cr", "IFRS16"),
  a(4100, "Provision for Dilapidations", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4110, "Deferred Tax", "BS", "Long-term Liabilities", "Tax", "Cr", "Deferred Tax"),
  // Capital & Reserves 5000-5999
  a(5000, "Ordinary Share Capital", "BS", "Capital and Reserves", "Equity", "Cr", "Share Capital"),
  a(5010, "Share Premium Account", "BS", "Capital and Reserves", "Equity", "Cr", "Share Premium"),
  a(5100, "Profit and Loss Account", "BS", "Capital and Reserves", "Equity", "Cr", "Retained Earnings"),
  a(5110, "Dividends Paid", "BS", "Capital and Reserves", "Equity", "Dr", "Dividends"),
  a(5120, "Revaluation Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  // Revenue 6000-6999
  a(6000, "Retail Sales - Stores", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6010, "Retail Sales - Online", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6020, "Wholesale Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6030, "Concession Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6040, "Gift Card Breakage Income", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  a(6050, "Loyalty Breakage Income", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  a(6060, "Delivery Charges Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6070, "Click and Collect Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6080, "Returns and Refunds", "PL", "Revenue", "Revenue", "Dr", "Turnover"),
  a(6090, "Staff Discount", "PL", "Revenue", "Revenue", "Dr", "Turnover"),
  // Cost of Sales 7000-7999
  a(7000, "Purchases - Goods for Resale", "PL", "Cost of Sales", "Other", "Dr", "Purchases"),
  a(7010, "Import Duty and Freight", "PL", "Cost of Sales", "Other", "Dr", "Purchases"),
  a(7020, "Carriage Inwards", "PL", "Cost of Sales", "Other", "Dr", "Distribution"),
  a(7030, "Warehouse Labour", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7040, "Warehouse Costs", "PL", "Cost of Sales", "Other", "Dr", "Distribution"),
  a(7050, "Delivery Costs to Customers", "PL", "Cost of Sales", "Other", "Dr", "Distribution"),
  a(7060, "Stock Shrinkage", "PL", "Cost of Sales", "Other", "Dr", "Shrinkage"),
  a(7070, "Stock Obsolescence Write-off", "PL", "Cost of Sales", "Other", "Dr", "Stock Loss"),
  a(7080, "Packaging and Carrier Bags", "PL", "Cost of Sales", "Other", "Dr", "Materials"),
  // Overheads 8000-8999
  a(8000, "Directors Remuneration", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8010, "Store Staff Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8020, "Head Office Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8030, "Employers NIC", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8040, "Pension Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8050, "Staff Training", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8060, "Recruitment Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8070, "Store Rent and Rates", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8080, "Store Light and Heat", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8090, "Store Repairs and Maintenance", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8100, "Head Office Rent and Rates", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8110, "Insurance", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8120, "Motor Expenses", "PL", "Overheads", "Other", "Dr", "Motor"),
  a(8130, "Telephone and Internet", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8140, "Computer and IT Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8150, "E-commerce Platform Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8160, "Marketing and Advertising", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8170, "Visual Merchandising", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8180, "Professional Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8190, "Accountancy Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8200, "Legal Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8210, "Bank Charges", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8220, "Card Processing Fees", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8230, "Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8240, "Depreciation - Shop Fittings", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8250, "Depreciation - Vehicles", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8260, "Depreciation - Equipment", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8270, "Bad Debts", "PL", "Overheads", "Other", "Dr", "Bad Debts"),
  a(8280, "Security Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8290, "Travel and Subsistence", "PL", "Overheads", "Other", "Dr", "Travel"),
  // Other Income/Tax 9000-9999
  a(9000, "Interest Receivable", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9010, "Supplier Rebates and Volume Discounts", "PL", "Other Income", "Revenue", "Cr", "Rebates"),
  a(9020, "Profit on Disposal of Assets", "PL", "Other Income", "Other", "Cr", "Disposals"),
  a(9030, "Sundry Income", "PL", "Other Income", "Revenue", "Cr", "Other"),
  a(9100, "Corporation Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9110, "Deferred Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9200, "Exceptional Items - Costs", "PL", "Exceptional", "Other", "Dr", "Exceptional"),
  a(9210, "Exceptional Items - Income", "PL", "Exceptional", "Other", "Cr", "Exceptional"),
  // Additional retail-specific accounts
  a(1120, "Right of Use Asset - Stores", "BS", "Fixed Assets", "Fixed Assets", "Dr", "IFRS16"),
  a(1130, "Security Systems", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1140, "Signage", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1550, "Depreciation - Signage", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(2070, "Supplier Rebates Receivable", "BS", "Current Assets", "Receivables", "Dr", "Rebates"),
  a(2160, "Staff Loans", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2550, "PayPal Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2560, "Stripe Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(3080, "Employee Expense Claims", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3090, "Payroll Accrual", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3230, "Hire Purchase Creditor", "BS", "Current Liabilities", "Loans", "Cr", "HP and Leases"),
  a(3240, "Intercompany Payable", "BS", "Current Liabilities", "Payables", "Cr", "Intercompany"),
  a(4040, "Lease Liability - Long Term", "BS", "Long-term Liabilities", "Loans", "Cr", "IFRS16"),
  a(4120, "Provision for Onerous Leases", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(5130, "Capital Redemption Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(6100, "Marketplace Sales Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6110, "Sale or Return Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(7090, "Returns Processing Costs", "PL", "Cost of Sales", "Other", "Dr", "Distribution"),
  a(7100, "Quality Inspection Costs", "PL", "Cost of Sales", "Other", "Dr", "Quality"),
  a(8300, "Cleaning Costs", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8310, "Subscriptions", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8320, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8330, "Postage and Courier", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8340, "Staff Welfare", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8350, "Repairs and Maintenance", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8360, "Loyalty Programme Costs", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(9040, "Insurance Recoveries", "PL", "Other Income", "Other", "Cr", "Insurance"),
  a(9120, "Prior Year Adjustments", "PL", "Tax", "Other", "Dr", "Adjustments"),
];

// ============================================================
// PROFESSIONAL SERVICES INDUSTRY
// ============================================================
const professional_services = [
  // Fixed Assets 1000-1999
  a(1000, "Freehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1010, "Leasehold Office Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1020, "Leasehold Improvements", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1030, "Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1040, "Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1050, "Furniture and Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1060, "Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1200, "Goodwill", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1210, "Customer Relationships Acquired", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1220, "Software Licences", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1230, "Brand Value", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1300, "Investments in Subsidiaries", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1310, "Investments in Associates", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1500, "Depreciation - Property", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1510, "Depreciation - Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1520, "Depreciation - Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1530, "Depreciation - Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1540, "Amortisation - Intangibles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  // Current Assets 2000-2999
  a(2000, "Work in Progress - Unbilled Time", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2010, "WIP - Disbursements", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2020, "WIP - Expenses Recoverable", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2100, "Trade Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2110, "Client Account Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2120, "Other Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2130, "Prepayments", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2140, "Accrued Income", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2150, "VAT Input Tax", "BS", "Current Assets", "Receivables", "Dr", "VAT"),
  a(2200, "Provision for Bad Debts", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2210, "WIP Provision", "BS", "Current Assets", "Inventory", "Cr", "Provisions"),
  a(2500, "Bank Current Account - Office", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2510, "Bank Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2520, "Client Account - Designated", "BS", "Current Assets", "Cash", "Dr", "Client Account"),
  a(2530, "Client Account - General", "BS", "Current Assets", "Cash", "Dr", "Client Account"),
  a(2540, "Petty Cash", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  // Current Liabilities 3000-3999
  a(3000, "Trade Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3010, "Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3020, "Deferred Income", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3030, "Client Account Creditor", "BS", "Current Liabilities", "Payables", "Cr", "Client Account"),
  a(3040, "Fees Invoiced in Advance", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3050, "Disbursements Held for Clients", "BS", "Current Liabilities", "Payables", "Cr", "Client Account"),
  a(3100, "VAT Output Tax", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3110, "VAT Liability", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3120, "PAYE and NIC", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3130, "Corporation Tax", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3200, "Other Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3210, "Credit Card Account", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3220, "Directors Loan Account", "BS", "Current Liabilities", "Loans", "Cr", "Directors"),
  a(3300, "Bank Overdraft", "BS", "Current Liabilities", "Loans", "Cr", "Bank"),
  // Long-term Liabilities 4000-4999
  a(4000, "Bank Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4010, "Finance Lease Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4020, "Partner Capital Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Partner Capital"),
  a(4100, "Provision for PI Claims", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4110, "Provision for Dilapidations", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4120, "Deferred Tax", "BS", "Long-term Liabilities", "Tax", "Cr", "Deferred Tax"),
  // Capital & Reserves 5000-5999
  a(5000, "Ordinary Share Capital", "BS", "Capital and Reserves", "Equity", "Cr", "Share Capital"),
  a(5010, "Share Premium Account", "BS", "Capital and Reserves", "Equity", "Cr", "Share Premium"),
  a(5020, "Partner Capital Account", "BS", "Capital and Reserves", "Equity", "Cr", "Partner Capital"),
  a(5030, "Partner Current Account", "BS", "Capital and Reserves", "Equity", "Cr", "Partner Capital"),
  a(5100, "Profit and Loss Account", "BS", "Capital and Reserves", "Equity", "Cr", "Retained Earnings"),
  a(5110, "Dividends / Drawings", "BS", "Capital and Reserves", "Equity", "Dr", "Dividends"),
  a(5120, "Revaluation Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  // Revenue 6000-6999
  a(6000, "Professional Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6010, "Consulting Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6020, "Advisory Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6030, "Audit Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6040, "Tax Advisory Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6050, "Outsourcing Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6060, "Disbursements Recovered", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6070, "Training Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  // Cost of Sales 7000-7999
  a(7000, "Fee Earner Salaries", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7010, "Fee Earner NIC", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7020, "Fee Earner Pensions", "PL", "Cost of Sales", "Other", "Dr", "Labour"),
  a(7030, "Subcontractor and Associate Costs", "PL", "Cost of Sales", "Other", "Dr", "Subcontractors"),
  a(7040, "Outsourced Service Costs", "PL", "Cost of Sales", "Other", "Dr", "Subcontractors"),
  a(7050, "Disbursements Incurred", "PL", "Cost of Sales", "Other", "Dr", "Disbursements"),
  a(7060, "Client Entertainment", "PL", "Cost of Sales", "Other", "Dr", "Client Costs"),
  a(7070, "WIP Write-offs", "PL", "Cost of Sales", "Other", "Dr", "Adjustments"),
  a(7080, "Fee Adjustments and Write-downs", "PL", "Cost of Sales", "Other", "Dr", "Adjustments"),
  // Overheads 8000-8999
  a(8000, "Directors / Partner Remuneration", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8010, "Admin Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8020, "Employers NIC", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8030, "Pension Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8040, "Staff Training and CPD", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8050, "Recruitment Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8060, "Rent and Rates", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8070, "Light and Heat", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8080, "Insurance - PI", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8090, "Insurance - Other", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8100, "Motor Expenses", "PL", "Overheads", "Other", "Dr", "Motor"),
  a(8110, "Telephone and Internet", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8120, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8130, "Computer and IT Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8140, "Software Subscriptions", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8150, "Library and Research", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8160, "Professional Subscriptions", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8170, "Accountancy Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8180, "Legal Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8190, "Bank Charges", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8200, "Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8210, "Depreciation", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8220, "Amortisation", "PL", "Overheads", "Other", "Dr", "Amortisation"),
  a(8230, "Bad Debts", "PL", "Overheads", "Other", "Dr", "Bad Debts"),
  a(8240, "Marketing and Business Development", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8250, "Travel and Subsistence", "PL", "Overheads", "Other", "Dr", "Travel"),
  a(8260, "Entertaining", "PL", "Overheads", "Other", "Dr", "Marketing"),
  // Other Income/Tax 9000-9999
  a(9000, "Interest Receivable", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9010, "Client Account Interest Earned", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9020, "Profit on Disposal of Assets", "PL", "Other Income", "Other", "Cr", "Disposals"),
  a(9030, "Sundry Income", "PL", "Other Income", "Revenue", "Cr", "Other"),
  a(9100, "Corporation Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9110, "Deferred Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9200, "Exceptional Items - Costs", "PL", "Exceptional", "Other", "Dr", "Exceptional"),
  a(9210, "Exceptional Items - Income", "PL", "Exceptional", "Other", "Cr", "Exceptional"),
  // Additional professional services-specific accounts
  a(1070, "Right of Use Asset - Office", "BS", "Fixed Assets", "Fixed Assets", "Dr", "IFRS16"),
  a(1240, "Practice Management Software", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1550, "Depreciation - Furniture", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(2030, "WIP - Contingent Fees", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2040, "WIP - Fixed Fee Contracts", "BS", "Current Assets", "Inventory", "Dr", "WIP"),
  a(2160, "Staff Loans and Advances", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2170, "Intercompany Receivable", "BS", "Current Assets", "Receivables", "Dr", "Intercompany"),
  a(2550, "Client Trust Account", "BS", "Current Assets", "Cash", "Dr", "Client Account"),
  a(3060, "Employee Expense Claims", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3070, "Payroll Accrual", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3080, "Bonus Accrual", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3090, "Intercompany Payable", "BS", "Current Liabilities", "Payables", "Cr", "Intercompany"),
  a(3230, "Lease Liability - Current", "BS", "Current Liabilities", "Loans", "Cr", "IFRS16"),
  a(4030, "Lease Liability - Long Term", "BS", "Long-term Liabilities", "Loans", "Cr", "IFRS16"),
  a(4130, "Provision for Restructuring", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(5040, "Partner Tax Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Partner Capital"),
  a(5130, "Capital Redemption Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(6080, "Secondment Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6090, "Expert Witness Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(7090, "Research and Database Costs", "PL", "Cost of Sales", "Other", "Dr", "Disbursements"),
  a(7100, "Court Fees and Filing", "PL", "Cost of Sales", "Other", "Dr", "Disbursements"),
  a(7110, "Expert Reports", "PL", "Cost of Sales", "Other", "Dr", "Disbursements"),
  a(8270, "Cleaning Costs", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8280, "Repairs and Maintenance", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8290, "Postage and Courier", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8300, "Staff Welfare", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(9040, "Insurance Recoveries", "PL", "Other Income", "Other", "Cr", "Insurance"),
  a(9120, "Prior Year Adjustments", "PL", "Tax", "Other", "Dr", "Adjustments"),
];

// ============================================================
// PROPERTY INDUSTRY
// ============================================================
const property = [
  // Fixed Assets 1000-1999
  a(1000, "Investment Properties at Fair Value", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investment Property"),
  a(1010, "Investment Properties at Cost", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investment Property"),
  a(1020, "Investment Property - Residential", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investment Property"),
  a(1030, "Investment Property - Commercial", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investment Property"),
  a(1040, "Investment Property - Industrial", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investment Property"),
  a(1050, "Freehold Property - Own Use", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1060, "Leasehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1070, "Leasehold Improvements", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1080, "Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1090, "Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1100, "Furniture and Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1110, "Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1200, "Goodwill", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1210, "Software Licences", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1300, "Investments in Subsidiaries", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1310, "Investments in Joint Ventures", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1320, "Investments in Associates", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1500, "Depreciation - Property Own Use", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1510, "Depreciation - Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1520, "Depreciation - Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1530, "Fair Value Adjustment - Investment Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Revaluation"),
  // Current Assets 2000-2999
  a(2000, "Development WIP - Land", "BS", "Current Assets", "Inventory", "Dr", "Development WIP"),
  a(2010, "Development WIP - Construction", "BS", "Current Assets", "Inventory", "Dr", "Development WIP"),
  a(2020, "Development WIP - Professional Fees", "BS", "Current Assets", "Inventory", "Dr", "Development WIP"),
  a(2030, "Development WIP - Finance Costs", "BS", "Current Assets", "Inventory", "Dr", "Development WIP"),
  a(2040, "Development WIP - Planning Costs", "BS", "Current Assets", "Inventory", "Dr", "Development WIP"),
  a(2050, "Properties Held for Resale", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2100, "Trade Debtors - Tenants", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2110, "Rent Receivable", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2120, "Service Charge Debtors", "BS", "Current Assets", "Receivables", "Dr", "Service Charges"),
  a(2130, "Development Sales Receivable", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2140, "Other Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2150, "Prepayments", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2160, "Accrued Income", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2170, "VAT Input Tax", "BS", "Current Assets", "Receivables", "Dr", "VAT"),
  a(2200, "Provision for Bad Debts", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2500, "Bank Current Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2510, "Bank Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2520, "Rent Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2530, "Service Charge Reserve Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2540, "Petty Cash", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  // Current Liabilities 3000-3999
  a(3000, "Trade Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3010, "Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3020, "Deferred Income - Rent", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3030, "Service Charge Funds Held", "BS", "Current Liabilities", "Payables", "Cr", "Service Charges"),
  a(3040, "Service Charge Creditor", "BS", "Current Liabilities", "Payables", "Cr", "Service Charges"),
  a(3050, "Tenant Deposits Held", "BS", "Current Liabilities", "Payables", "Cr", "Deposits"),
  a(3060, "Rent Deposits Received", "BS", "Current Liabilities", "Payables", "Cr", "Deposits"),
  a(3070, "Development Deposits Received", "BS", "Current Liabilities", "Payables", "Cr", "Deposits"),
  a(3100, "VAT Output Tax", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3110, "VAT Liability", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3120, "PAYE and NIC", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3130, "Corporation Tax", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3140, "SDLT Payable", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3200, "Other Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3210, "Credit Card Account", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3220, "Directors Loan Account", "BS", "Current Liabilities", "Loans", "Cr", "Directors"),
  a(3300, "Bank Overdraft", "BS", "Current Liabilities", "Loans", "Cr", "Bank"),
  // Long-term Liabilities 4000-4999
  a(4000, "Bank Loan - Investment Property", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4010, "Bank Loan - Development Finance", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4020, "Mezzanine Finance", "BS", "Long-term Liabilities", "Loans", "Cr", "Other Loans"),
  a(4030, "Finance Lease Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4040, "Mortgage Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Mortgages"),
  a(4100, "Provision for Dilapidations", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4110, "Provision for Remediation", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4120, "Deferred Tax", "BS", "Long-term Liabilities", "Tax", "Cr", "Deferred Tax"),
  // Capital & Reserves 5000-5999
  a(5000, "Ordinary Share Capital", "BS", "Capital and Reserves", "Equity", "Cr", "Share Capital"),
  a(5010, "Share Premium Account", "BS", "Capital and Reserves", "Equity", "Cr", "Share Premium"),
  a(5100, "Profit and Loss Account", "BS", "Capital and Reserves", "Equity", "Cr", "Retained Earnings"),
  a(5110, "Dividends Paid", "BS", "Capital and Reserves", "Equity", "Dr", "Dividends"),
  a(5120, "Revaluation Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(5130, "Capital Redemption Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  // Revenue 6000-6999
  a(6000, "Rental Income - Residential", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6010, "Rental Income - Commercial", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6020, "Rental Income - Industrial", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6030, "Service Charge Income", "PL", "Revenue", "Revenue", "Cr", "Service Charges"),
  a(6040, "Ground Rent Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6050, "Development Sales Revenue", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6060, "Property Management Fees", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6070, "Licence Fee Income", "PL", "Revenue", "Revenue", "Cr", "Turnover"),
  a(6080, "Dilapidation Income", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  // Cost of Sales 7000-7999
  a(7000, "Development Costs - Land", "PL", "Cost of Sales", "Other", "Dr", "Development"),
  a(7010, "Development Costs - Construction", "PL", "Cost of Sales", "Other", "Dr", "Development"),
  a(7020, "Development Costs - Professional", "PL", "Cost of Sales", "Other", "Dr", "Development"),
  a(7030, "Property Repairs and Maintenance", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(7040, "Property Insurance", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(7050, "Service Charge Expenditure", "PL", "Cost of Sales", "Other", "Dr", "Service Charges"),
  a(7060, "Ground Rent Payable", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(7070, "Letting Agent Fees", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(7080, "Void Costs", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(7090, "Estate Agent Fees", "PL", "Cost of Sales", "Other", "Dr", "Sales Costs"),
  // Overheads 8000-8999
  a(8000, "Directors Remuneration", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8010, "Office Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8020, "Employers NIC", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8030, "Pension Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8040, "Staff Training", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8050, "Rent and Rates - Office", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8060, "Light and Heat - Office", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8070, "Insurance - Office", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8080, "Motor Expenses", "PL", "Overheads", "Other", "Dr", "Motor"),
  a(8090, "Telephone and Internet", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8100, "Computer and IT Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8110, "Professional Fees - Surveyors", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8120, "Accountancy Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8130, "Legal Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8140, "Valuation Fees", "PL", "Overheads", "Other", "Dr", "Professional"),
  a(8150, "Bank Charges", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8160, "Loan Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8170, "Mortgage Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8180, "Loan Arrangement Fees", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8190, "Depreciation", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8200, "Bad Debts - Tenants", "PL", "Overheads", "Other", "Dr", "Bad Debts"),
  a(8210, "Marketing and Advertising", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8220, "Travel and Subsistence", "PL", "Overheads", "Other", "Dr", "Travel"),
  // Other Income/Tax 9000-9999
  a(9000, "Interest Receivable", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9010, "Fair Value Gain on Investment Property", "PL", "Other Income", "Other", "Cr", "Revaluation"),
  a(9020, "Fair Value Loss on Investment Property", "PL", "Other Income", "Other", "Dr", "Revaluation"),
  a(9030, "Profit on Disposal of Property", "PL", "Other Income", "Other", "Cr", "Disposals"),
  a(9040, "Loss on Disposal of Property", "PL", "Other Income", "Other", "Dr", "Disposals"),
  a(9050, "Sundry Income", "PL", "Other Income", "Revenue", "Cr", "Other"),
  a(9100, "Corporation Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9110, "Deferred Tax Charge", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9200, "Exceptional Items - Costs", "PL", "Exceptional", "Other", "Dr", "Exceptional"),
  a(9210, "Exceptional Items - Income", "PL", "Exceptional", "Other", "Cr", "Exceptional"),
  // Additional property-specific accounts
  a(1120, "Plant and Machinery - Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1130, "Right of Use Asset - Office", "BS", "Fixed Assets", "Fixed Assets", "Dr", "IFRS16"),
  a(1540, "Depreciation - Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(2060, "Development WIP - S106 Contributions", "BS", "Current Assets", "Inventory", "Dr", "Development WIP"),
  a(2070, "Development WIP - Marketing", "BS", "Current Assets", "Inventory", "Dr", "Development WIP"),
  a(2180, "Intercompany Receivable", "BS", "Current Assets", "Receivables", "Dr", "Intercompany"),
  a(2190, "Insurance Claims Receivable", "BS", "Current Assets", "Receivables", "Dr", "Insurance"),
  a(2550, "Building Society Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(3080, "Employee Expense Claims", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3090, "Payroll Accrual", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3150, "Annual Tax on Enveloped Dwellings", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3230, "Intercompany Payable", "BS", "Current Liabilities", "Payables", "Cr", "Intercompany"),
  a(3240, "Lease Liability - Current", "BS", "Current Liabilities", "Loans", "Cr", "IFRS16"),
  a(4050, "Bridging Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Other Loans"),
  a(4060, "Investor Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Other Loans"),
  a(4130, "Provision for Environmental Cleanup", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(5140, "Merger Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(6090, "Insurance Recovery Income", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  a(6100, "Surrender Premium Income", "PL", "Revenue", "Revenue", "Cr", "Other Income"),
  a(7100, "Property Management Costs", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(7110, "Security Costs", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(7120, "Cleaning and Maintenance", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(7130, "Utilities - Investment Property", "PL", "Cost of Sales", "Other", "Dr", "Property Costs"),
  a(8230, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8240, "Postage and Courier", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8250, "Cleaning - Office", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8260, "Subscriptions", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(9060, "Grant Income", "PL", "Other Income", "Revenue", "Cr", "Grants"),
  a(9120, "Prior Year Adjustments", "PL", "Tax", "Other", "Dr", "Adjustments"),
];

// ============================================================
// CHARITIES INDUSTRY
// ============================================================
const charities = [
  // Fixed Assets 1000-1999
  a(1000, "Freehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1010, "Leasehold Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1020, "Leasehold Improvements", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1030, "Charity Shop Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1040, "Office Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1050, "Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1060, "Furniture and Fittings", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1070, "Motor Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1080, "Programme Equipment", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1090, "Heritage Assets", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Heritage Assets"),
  a(1200, "Intangible Assets - Software", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Intangible Assets"),
  a(1300, "Endowment Investments - Listed", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1310, "Endowment Investments - Unlisted", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1320, "Programme Related Investments", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1330, "Social Investments", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1340, "Investment Property", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1500, "Depreciation - Property", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1510, "Depreciation - Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1520, "Depreciation - Vehicles", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  a(1530, "Depreciation - Computer Equipment", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Depreciation"),
  // Current Assets 2000-2999
  a(2000, "Stock - Charity Shops", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2010, "Stock - Publications", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2100, "Trade Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2110, "Grant Receivable - Restricted", "BS", "Current Assets", "Receivables", "Dr", "Grants"),
  a(2120, "Grant Receivable - Unrestricted", "BS", "Current Assets", "Receivables", "Dr", "Grants"),
  a(2130, "Legacy Receivable", "BS", "Current Assets", "Receivables", "Dr", "Legacies"),
  a(2140, "Gift Aid Receivable", "BS", "Current Assets", "Receivables", "Dr", "Tax"),
  a(2150, "Other Debtors", "BS", "Current Assets", "Receivables", "Dr", "Debtors"),
  a(2160, "Prepayments", "BS", "Current Assets", "Receivables", "Dr", "Prepayments"),
  a(2170, "Accrued Income", "BS", "Current Assets", "Receivables", "Dr", "Accrued Income"),
  a(2180, "VAT Input Tax", "BS", "Current Assets", "Receivables", "Dr", "VAT"),
  a(2200, "Provision for Bad Debts", "BS", "Current Assets", "Receivables", "Cr", "Provisions"),
  a(2500, "Bank Current Account - Unrestricted", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2510, "Bank Current Account - Restricted", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2520, "Bank Deposit Account", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2530, "Short Term Deposits", "BS", "Current Assets", "Cash", "Dr", "Bank"),
  a(2540, "Petty Cash", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  a(2550, "Collection Tins Float", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  // Current Liabilities 3000-3999
  a(3000, "Trade Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3010, "Accruals", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3020, "Deferred Income - Grants", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3030, "Deferred Income - Events", "BS", "Current Liabilities", "Payables", "Cr", "Deferred Income"),
  a(3040, "Grants Payable", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3050, "Donations Held for Third Parties", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3100, "VAT Output Tax", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3110, "VAT Liability", "BS", "Current Liabilities", "Tax", "Cr", "VAT"),
  a(3120, "PAYE and NIC", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3130, "Corporation Tax on Non-Charitable Income", "BS", "Current Liabilities", "Tax", "Cr", "Tax"),
  a(3200, "Other Creditors", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3210, "Credit Card Account", "BS", "Current Liabilities", "Payables", "Cr", "Creditors"),
  a(3300, "Bank Overdraft", "BS", "Current Liabilities", "Loans", "Cr", "Bank"),
  // Long-term Liabilities 4000-4999
  a(4000, "Bank Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Bank Loans"),
  a(4010, "Social Investment Loan", "BS", "Long-term Liabilities", "Loans", "Cr", "Social Investment"),
  a(4020, "Finance Lease Obligations", "BS", "Long-term Liabilities", "Loans", "Cr", "HP and Leases"),
  a(4100, "Provision for Dilapidations", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4110, "Provision for Grants Committed", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(4120, "Pension Scheme Liability", "BS", "Long-term Liabilities", "Provisions", "Cr", "Pensions"),
  // Capital & Reserves (Funds) 5000-5999
  a(5000, "Unrestricted General Fund", "BS", "Capital and Reserves", "Equity", "Cr", "Unrestricted Funds"),
  a(5010, "Unrestricted Designated Fund - Fixed Assets", "BS", "Capital and Reserves", "Equity", "Cr", "Designated Funds"),
  a(5020, "Unrestricted Designated Fund - Reserves", "BS", "Capital and Reserves", "Equity", "Cr", "Designated Funds"),
  a(5030, "Unrestricted Designated Fund - Projects", "BS", "Capital and Reserves", "Equity", "Cr", "Designated Funds"),
  a(5100, "Restricted Fund - Programme A", "BS", "Capital and Reserves", "Equity", "Cr", "Restricted Funds"),
  a(5110, "Restricted Fund - Programme B", "BS", "Capital and Reserves", "Equity", "Cr", "Restricted Funds"),
  a(5120, "Restricted Fund - Capital Projects", "BS", "Capital and Reserves", "Equity", "Cr", "Restricted Funds"),
  a(5130, "Restricted Fund - Overseas", "BS", "Capital and Reserves", "Equity", "Cr", "Restricted Funds"),
  a(5200, "Endowment Fund - Permanent", "BS", "Capital and Reserves", "Equity", "Cr", "Endowment Funds"),
  a(5210, "Endowment Fund - Expendable", "BS", "Capital and Reserves", "Equity", "Cr", "Endowment Funds"),
  a(5300, "Revaluation Reserve", "BS", "Capital and Reserves", "Equity", "Cr", "Reserves"),
  a(5310, "Pension Reserve", "BS", "Capital and Reserves", "Equity", "Dr", "Reserves"),
  // Revenue (SOFA Income) 6000-6999
  a(6000, "Donations - Unrestricted", "PL", "Revenue", "Revenue", "Cr", "Donations"),
  a(6010, "Donations - Restricted", "PL", "Revenue", "Revenue", "Cr", "Donations"),
  a(6020, "Gift Aid Donations", "PL", "Revenue", "Revenue", "Cr", "Donations"),
  a(6030, "Regular Giving - Standing Orders", "PL", "Revenue", "Revenue", "Cr", "Donations"),
  a(6040, "Legacy Income", "PL", "Revenue", "Revenue", "Cr", "Legacies"),
  a(6050, "Grant Income - Government", "PL", "Revenue", "Revenue", "Cr", "Grants"),
  a(6060, "Grant Income - Trusts and Foundations", "PL", "Revenue", "Revenue", "Cr", "Grants"),
  a(6070, "Grant Income - Lottery", "PL", "Revenue", "Revenue", "Cr", "Grants"),
  a(6080, "Grant Income - Corporate", "PL", "Revenue", "Revenue", "Cr", "Grants"),
  a(6100, "Charity Shop Income", "PL", "Revenue", "Revenue", "Cr", "Trading"),
  a(6110, "Fundraising Event Income", "PL", "Revenue", "Revenue", "Cr", "Fundraising"),
  a(6120, "Membership Subscriptions", "PL", "Revenue", "Revenue", "Cr", "Subscriptions"),
  a(6130, "Contract Income - Services", "PL", "Revenue", "Revenue", "Cr", "Charitable Trading"),
  a(6140, "Training and Course Fees", "PL", "Revenue", "Revenue", "Cr", "Charitable Trading"),
  a(6150, "Publication Sales", "PL", "Revenue", "Revenue", "Cr", "Trading"),
  a(6160, "Gift Aid Tax Reclaim", "PL", "Revenue", "Revenue", "Cr", "Tax Reclaims"),
  // Cost of Charitable Activities 7000-7999
  a(7000, "Programme Delivery Costs", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  a(7010, "Programme Staff Costs", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  a(7020, "Programme Materials", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  a(7030, "Grants Made - Organisations", "PL", "Cost of Sales", "Other", "Dr", "Grant Making"),
  a(7040, "Grants Made - Individuals", "PL", "Cost of Sales", "Other", "Dr", "Grant Making"),
  a(7050, "Charity Shop Costs", "PL", "Cost of Sales", "Other", "Dr", "Trading Costs"),
  a(7060, "Charity Shop Staff", "PL", "Cost of Sales", "Other", "Dr", "Trading Costs"),
  a(7070, "Fundraising Costs", "PL", "Cost of Sales", "Other", "Dr", "Fundraising Costs"),
  a(7080, "Fundraising Staff Costs", "PL", "Cost of Sales", "Other", "Dr", "Fundraising Costs"),
  a(7090, "Fundraising Event Costs", "PL", "Cost of Sales", "Other", "Dr", "Fundraising Costs"),
  a(7100, "Volunteer Expenses", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  a(7110, "Beneficiary Support Costs", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  // Overheads / Support Costs 8000-8999
  a(8000, "Management and Admin Salaries", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8010, "Employers NIC", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8020, "Pension Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8030, "Staff Training", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8040, "Recruitment Costs", "PL", "Overheads", "Other", "Dr", "Staff Costs"),
  a(8050, "Rent and Rates", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8060, "Light and Heat", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8070, "Insurance", "PL", "Overheads", "Other", "Dr", "Insurance"),
  a(8080, "Motor Expenses", "PL", "Overheads", "Other", "Dr", "Motor"),
  a(8090, "Telephone and Internet", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8100, "Printing and Stationery", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8110, "Computer and IT Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8120, "Audit and Accountancy Fees", "PL", "Overheads", "Other", "Dr", "Governance"),
  a(8130, "Legal Fees", "PL", "Overheads", "Other", "Dr", "Governance"),
  a(8140, "Trustee Expenses", "PL", "Overheads", "Other", "Dr", "Governance"),
  a(8150, "Trustee Indemnity Insurance", "PL", "Overheads", "Other", "Dr", "Governance"),
  a(8160, "AGM and Meeting Costs", "PL", "Overheads", "Other", "Dr", "Governance"),
  a(8170, "Bank Charges", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8180, "Interest Paid", "PL", "Overheads", "Other", "Dr", "Finance"),
  a(8190, "Depreciation", "PL", "Overheads", "Other", "Dr", "Depreciation"),
  a(8200, "Bad Debts", "PL", "Overheads", "Other", "Dr", "Bad Debts"),
  a(8210, "Marketing and Communications", "PL", "Overheads", "Other", "Dr", "Marketing"),
  a(8220, "Travel and Subsistence", "PL", "Overheads", "Other", "Dr", "Travel"),
  a(8230, "Irrecoverable VAT", "PL", "Overheads", "Other", "Dr", "VAT"),
  // Other Income/Tax 9000-9999
  a(9000, "Interest Receivable", "PL", "Other Income", "Revenue", "Cr", "Interest"),
  a(9010, "Investment Income - Dividends", "PL", "Other Income", "Revenue", "Cr", "Investments"),
  a(9020, "Investment Income - Endowment", "PL", "Other Income", "Revenue", "Cr", "Investments"),
  a(9030, "Investment Gains", "PL", "Other Income", "Other", "Cr", "Investments"),
  a(9040, "Investment Losses", "PL", "Other Income", "Other", "Dr", "Investments"),
  a(9050, "Rental Income", "PL", "Other Income", "Revenue", "Cr", "Property"),
  a(9060, "Profit on Disposal of Assets", "PL", "Other Income", "Other", "Cr", "Disposals"),
  a(9070, "Sundry Income", "PL", "Other Income", "Revenue", "Cr", "Other"),
  a(9100, "Tax on Non-Charitable Income", "PL", "Tax", "Tax", "Dr", "Tax"),
  a(9200, "Exceptional Items - Costs", "PL", "Exceptional", "Other", "Dr", "Exceptional"),
  a(9210, "Exceptional Items - Income", "PL", "Exceptional", "Other", "Cr", "Exceptional"),
  a(9300, "Transfer Between Funds", "PL", "Transfers", "Other", "Dr", "Fund Transfers"),
  a(9310, "Transfer to Restricted Funds", "PL", "Transfers", "Other", "Cr", "Fund Transfers"),
  a(9320, "Transfer from Restricted Funds", "PL", "Transfers", "Other", "Dr", "Fund Transfers"),
  // Additional charity-specific accounts
  a(1100, "Specialist Programme Assets", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Tangible Assets"),
  a(1110, "Right of Use Asset", "BS", "Fixed Assets", "Fixed Assets", "Dr", "IFRS16"),
  a(1350, "Mixed Motive Investments", "BS", "Fixed Assets", "Fixed Assets", "Dr", "Investments"),
  a(1540, "Amortisation - Software", "BS", "Fixed Assets", "Fixed Assets", "Cr", "Amortisation"),
  a(2020, "Stock - Merchandise", "BS", "Current Assets", "Inventory", "Dr", "Stock"),
  a(2190, "Intercompany Receivable", "BS", "Current Assets", "Receivables", "Dr", "Intercompany"),
  a(2560, "Fundraising Float", "BS", "Current Assets", "Cash", "Dr", "Cash"),
  a(3060, "Employee Expense Claims", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3070, "Payroll Accrual", "BS", "Current Liabilities", "Payables", "Cr", "Accruals"),
  a(3080, "Intercompany Payable", "BS", "Current Liabilities", "Payables", "Cr", "Intercompany"),
  a(3140, "Lease Liability - Current", "BS", "Current Liabilities", "Loans", "Cr", "IFRS16"),
  a(4030, "Lease Liability - Long Term", "BS", "Long-term Liabilities", "Loans", "Cr", "IFRS16"),
  a(4130, "Provision for Restructuring", "BS", "Long-term Liabilities", "Provisions", "Cr", "Provisions"),
  a(5040, "Unrestricted Designated Fund - Pension", "BS", "Capital and Reserves", "Equity", "Cr", "Designated Funds"),
  a(5140, "Restricted Fund - Emergency", "BS", "Capital and Reserves", "Equity", "Cr", "Restricted Funds"),
  a(5220, "Endowment Fund - Property", "BS", "Capital and Reserves", "Equity", "Cr", "Endowment Funds"),
  a(6170, "Sponsorship Income", "PL", "Revenue", "Revenue", "Cr", "Fundraising"),
  a(6180, "Challenge Event Income", "PL", "Revenue", "Revenue", "Cr", "Fundraising"),
  a(6190, "Corporate Partnership Income", "PL", "Revenue", "Revenue", "Cr", "Fundraising"),
  a(6200, "Payroll Giving", "PL", "Revenue", "Revenue", "Cr", "Donations"),
  a(6210, "In Kind Donations", "PL", "Revenue", "Revenue", "Cr", "Donations"),
  a(7120, "Advocacy and Campaigning", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  a(7130, "Research Costs", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  a(7140, "Partnership Programme Costs", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  a(7150, "Overseas Programme Costs", "PL", "Cost of Sales", "Other", "Dr", "Charitable Activities"),
  a(8240, "Repairs and Maintenance", "PL", "Overheads", "Other", "Dr", "Premises"),
  a(8250, "Postage and Courier", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8260, "Subscriptions", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(8270, "CRM and Database Costs", "PL", "Overheads", "Other", "Dr", "Admin"),
  a(9080, "Insurance Recoveries", "PL", "Other Income", "Other", "Cr", "Insurance"),
  a(9120, "Prior Year Adjustments", "PL", "Tax", "Other", "Dr", "Adjustments"),
];

// ============================================================
// UK_COA_TEMPLATES — keyed by industry
// ============================================================
const UK_COA_TEMPLATES = {
  construction,
  manufacturing,
  technology,
  financial_services,
  retail,
  professional_services,
  property,
  charities,
};

// ============================================================
// fuzzyMatchAccount — word-overlap scoring
// ============================================================
function fuzzyMatchAccount(accountName, industryId) {
  if (!accountName || !industryId) {
    return { match: null, score: 0, alternatives: [] };
  }

  const template = UK_COA_TEMPLATES[industryId];
  if (!template) {
    return { match: null, score: 0, alternatives: [] };
  }

  const inputWords = accountName.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  if (inputWords.length === 0) {
    return { match: null, score: 0, alternatives: [] };
  }

  // Common stop words to reduce noise
  const stopWords = new Set(["the", "a", "an", "and", "or", "of", "in", "on", "at", "to", "for", "is", "it", "by"]);
  const meaningfulInput = inputWords.filter(w => !stopWords.has(w));
  const searchWords = meaningfulInput.length > 0 ? meaningfulInput : inputWords;

  const scored = template.map(acct => {
    const acctWords = acct.name.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    const meaningfulAcct = acctWords.filter(w => !stopWords.has(w));
    const targetWords = meaningfulAcct.length > 0 ? meaningfulAcct : acctWords;

    let matchCount = 0;
    let partialCount = 0;

    for (const sw of searchWords) {
      if (targetWords.includes(sw)) {
        matchCount++;
      } else {
        // Check partial matches (one contains the other)
        for (const tw of targetWords) {
          if (tw.includes(sw) || sw.includes(tw)) {
            partialCount++;
            break;
          }
        }
      }
    }

    const maxLen = Math.max(searchWords.length, targetWords.length);
    const score = maxLen > 0 ? ((matchCount + partialCount * 0.5) / maxLen) : 0;

    return { account: acct, score: Math.round(score * 100) / 100 };
  });

  scored.sort((x, y) => y.score - x.score);

  const best = scored[0];
  const alternatives = scored.slice(1, 4).filter(s => s.score > 0).map(s => s.account);

  return {
    match: best && best.score > 0 ? best.account : null,
    score: best ? best.score : 0,
    alternatives,
  };
}

// ============================================================
// autoMapTrialBalance — code-first then fuzzy name matching
// ============================================================
function autoMapTrialBalance(tbRows, industryId) {
  if (!tbRows || !Array.isArray(tbRows)) {
    return [];
  }

  const template = UK_COA_TEMPLATES[industryId];
  if (!template) {
    return tbRows.map(row => ({
      ...row,
      mappedAccount: null,
      mappedFsli: null,
      confidence: "none",
    }));
  }

  // Build a lookup by code for exact matching
  const codeMap = {};
  for (const acct of template) {
    codeMap[acct.code] = acct;
  }

  return tbRows.map(row => {
    // 1. Try exact code match
    const codeNum = typeof row.code === "string" ? parseInt(row.code, 10) : row.code;
    if (codeMap[codeNum]) {
      const matched = codeMap[codeNum];
      return {
        ...row,
        mappedAccount: matched.name,
        mappedFsli: matched.fsliMapping,
        confidence: "high",
      };
    }

    // 2. Try fuzzy name match
    const accountName = row.account || row.name || row.description || "";
    if (accountName) {
      const result = fuzzyMatchAccount(accountName, industryId);
      if (result.match && result.score >= 0.6) {
        return {
          ...row,
          mappedAccount: result.match.name,
          mappedFsli: result.match.fsliMapping,
          confidence: "high",
        };
      }
      if (result.match && result.score >= 0.3) {
        return {
          ...row,
          mappedAccount: result.match.name,
          mappedFsli: result.match.fsliMapping,
          confidence: "medium",
        };
      }
      if (result.match && result.score > 0) {
        return {
          ...row,
          mappedAccount: result.match.name,
          mappedFsli: result.match.fsliMapping,
          confidence: "low",
        };
      }
    }

    // 3. Try range-based FSLI mapping from the code
    if (codeNum && !isNaN(codeNum)) {
      let fsli = null;
      let accountGuess = null;
      if (codeNum >= 1000 && codeNum < 2000) { fsli = "Fixed Assets"; accountGuess = "Fixed Asset (unmapped)"; }
      else if (codeNum >= 2000 && codeNum < 2500) { fsli = "Receivables"; accountGuess = "Current Asset (unmapped)"; }
      else if (codeNum >= 2500 && codeNum < 3000) { fsli = "Cash"; accountGuess = "Cash/Bank (unmapped)"; }
      else if (codeNum >= 3000 && codeNum < 4000) { fsli = "Payables"; accountGuess = "Current Liability (unmapped)"; }
      else if (codeNum >= 4000 && codeNum < 5000) { fsli = "Loans"; accountGuess = "Long-term Liability (unmapped)"; }
      else if (codeNum >= 5000 && codeNum < 6000) { fsli = "Equity"; accountGuess = "Capital/Reserve (unmapped)"; }
      else if (codeNum >= 6000 && codeNum < 7000) { fsli = "Revenue"; accountGuess = "Revenue (unmapped)"; }
      else if (codeNum >= 7000 && codeNum < 8000) { fsli = "Other"; accountGuess = "Cost of Sales (unmapped)"; }
      else if (codeNum >= 8000 && codeNum < 9000) { fsli = "Other"; accountGuess = "Overhead (unmapped)"; }
      else if (codeNum >= 9000 && codeNum < 10000) { fsli = "Other"; accountGuess = "Other Income/Tax (unmapped)"; }

      if (fsli) {
        return {
          ...row,
          mappedAccount: accountGuess,
          mappedFsli: fsli,
          confidence: "low",
        };
      }
    }

    return {
      ...row,
      mappedAccount: null,
      mappedFsli: null,
      confidence: "none",
    };
  });
}

// ============================================================
// Additional Utility Functions
// ============================================================

/**
 * Get all accounts for a given industry, grouped by category.
 * @param {string} industryId - One of the 8 industry keys
 * @returns {Object} Categories mapped to arrays of accounts
 */
function getAccountsByCategory(industryId) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return {};
  const groups = {};
  for (const acct of template) {
    if (!groups[acct.category]) {
      groups[acct.category] = [];
    }
    groups[acct.category].push(acct);
  }
  return groups;
}

/**
 * Get all accounts for a given industry, grouped by FSLI mapping.
 * @param {string} industryId - One of the 8 industry keys
 * @returns {Object} FSLI mappings to arrays of accounts
 */
function getAccountsByFsli(industryId) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return {};
  const groups = {};
  for (const acct of template) {
    if (!groups[acct.fsliMapping]) {
      groups[acct.fsliMapping] = [];
    }
    groups[acct.fsliMapping].push(acct);
  }
  return groups;
}

/**
 * Get all accounts for a given industry, grouped by type (BS or PL).
 * @param {string} industryId - One of the 8 industry keys
 * @returns {{ BS: Array, PL: Array }}
 */
function getAccountsByType(industryId) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return { BS: [], PL: [] };
  const result = { BS: [], PL: [] };
  for (const acct of template) {
    if (acct.type === "BS") {
      result.BS.push(acct);
    } else {
      result.PL.push(acct);
    }
  }
  return result;
}

/**
 * Get all accounts within a specific code range.
 * @param {string} industryId
 * @param {number} fromCode - Start code (inclusive)
 * @param {number} toCode - End code (inclusive)
 * @returns {Array}
 */
function getAccountsByCodeRange(industryId, fromCode, toCode) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return [];
  return template.filter(acct => acct.code >= fromCode && acct.code <= toCode);
}

/**
 * Validate a trial balance mapping result for completeness.
 * Returns warnings for unmapped or low-confidence mappings.
 * @param {Array} mappedRows - Output from autoMapTrialBalance
 * @returns {{ valid: boolean, warnings: string[], stats: Object }}
 */
function validateMapping(mappedRows) {
  if (!mappedRows || !Array.isArray(mappedRows)) {
    return { valid: false, warnings: ["No mapped rows provided"], stats: {} };
  }

  const warnings = [];
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let noneCount = 0;

  for (let i = 0; i < mappedRows.length; i++) {
    const row = mappedRows[i];
    const rowLabel = row.account || row.name || row.code || `Row ${i + 1}`;

    switch (row.confidence) {
      case "high":
        highCount++;
        break;
      case "medium":
        mediumCount++;
        warnings.push(`Medium confidence mapping for "${rowLabel}" -> ${row.mappedAccount}`);
        break;
      case "low":
        lowCount++;
        warnings.push(`Low confidence mapping for "${rowLabel}" -> ${row.mappedAccount}`);
        break;
      case "none":
      default:
        noneCount++;
        warnings.push(`No mapping found for "${rowLabel}"`);
        break;
    }
  }

  const total = mappedRows.length;
  const mappedPct = total > 0 ? Math.round(((highCount + mediumCount) / total) * 100) : 0;
  const valid = noneCount === 0 && lowCount === 0;

  return {
    valid,
    warnings,
    stats: {
      total,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
      none: noneCount,
      mappedPercentage: mappedPct,
    },
  };
}

/**
 * Generate a summary of the trial balance by FSLI category.
 * @param {Array} mappedRows - Output from autoMapTrialBalance
 * @returns {Array<{ fsli: string, classification: string, currentYear: number, priorYear: number }>}
 */
function summariseByFsli(mappedRows) {
  if (!mappedRows || !Array.isArray(mappedRows)) return [];

  const summary = {};

  for (const row of mappedRows) {
    const fsli = row.mappedFsli || "Unmapped";
    if (!summary[fsli]) {
      summary[fsli] = { fsli, currentYear: 0, priorYear: 0 };
    }
    const cy = parseFloat(row.cy) || 0;
    const py = parseFloat(row.py) || 0;
    summary[fsli].currentYear += cy;
    summary[fsli].priorYear += py;
  }

  const result = Object.values(summary);

  // Add classification from COA_FSLI_SUMMARY
  for (const item of result) {
    const fsliInfo = COA_FSLI_SUMMARY[item.fsli];
    if (fsliInfo) {
      item.classification = fsliInfo.classification;
    } else {
      item.classification = "Unknown";
    }
    item.currentYear = Math.round(item.currentYear * 100) / 100;
    item.priorYear = Math.round(item.priorYear * 100) / 100;
  }

  return result;
}

/**
 * Get the list of available industry IDs.
 * @returns {string[]}
 */
function getIndustryIds() {
  return Object.keys(UK_COA_TEMPLATES);
}

/**
 * Get a display name for an industry ID.
 * @param {string} industryId
 * @returns {string}
 */
const INDUSTRY_DISPLAY_NAMES = {
  construction: "Construction",
  manufacturing: "Manufacturing",
  technology: "Technology",
  financial_services: "Financial Services",
  retail: "Retail",
  professional_services: "Professional Services",
  property: "Property & Real Estate",
  charities: "Charities & Not-for-Profit",
};

function getIndustryDisplayName(industryId) {
  return INDUSTRY_DISPLAY_NAMES[industryId] || industryId;
}

/**
 * Search accounts across all industries by name.
 * @param {string} searchTerm
 * @returns {Array<{ industryId: string, account: Object, score: number }>}
 */
function searchAccountsGlobal(searchTerm) {
  if (!searchTerm) return [];

  const results = [];
  for (const [industryId, accounts] of Object.entries(UK_COA_TEMPLATES)) { // eslint-disable-line no-unused-vars
    const match = fuzzyMatchAccount(searchTerm, industryId);
    if (match.match && match.score > 0) {
      results.push({
        industryId,
        account: match.match,
        score: match.score,
      });
      for (const alt of match.alternatives) {
        results.push({
          industryId,
          account: alt,
          score: match.score * 0.8,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 20);
}

/**
 * Get the code range description for a given code.
 * @param {number} code
 * @returns {{ range: string, description: string, type: string }}
 */
function getCodeRangeInfo(code) {
  const codeNum = typeof code === "string" ? parseInt(code, 10) : code;
  if (isNaN(codeNum)) return { range: "Unknown", description: "Invalid code", type: "Unknown" };

  if (codeNum >= 1000 && codeNum < 2000) {
    return { range: "1000-1999", description: "Fixed Assets (tangible, intangible, investments)", type: "BS" };
  }
  if (codeNum >= 2000 && codeNum < 3000) {
    return { range: "2000-2999", description: "Current Assets (stock, debtors, bank, cash)", type: "BS" };
  }
  if (codeNum >= 3000 && codeNum < 4000) {
    return { range: "3000-3999", description: "Current Liabilities (creditors, tax, accruals)", type: "BS" };
  }
  if (codeNum >= 4000 && codeNum < 5000) {
    return { range: "4000-4999", description: "Long-term Liabilities (loans, provisions, deferred tax)", type: "BS" };
  }
  if (codeNum >= 5000 && codeNum < 6000) {
    return { range: "5000-5999", description: "Capital & Reserves", type: "BS" };
  }
  if (codeNum >= 6000 && codeNum < 7000) {
    return { range: "6000-6999", description: "Revenue / Turnover", type: "PL" };
  }
  if (codeNum >= 7000 && codeNum < 8000) {
    return { range: "7000-7999", description: "Cost of Sales / Direct Costs", type: "PL" };
  }
  if (codeNum >= 8000 && codeNum < 9000) {
    return { range: "8000-8999", description: "Overheads / Admin Expenses", type: "PL" };
  }
  if (codeNum >= 9000 && codeNum < 10000) {
    return { range: "9000-9999", description: "Other Income, Tax, Exceptional Items", type: "PL" };
  }
  return { range: "Out of range", description: "Code outside UK COA range 1000-9999", type: "Unknown" };
}

/**
 * Validate that a chart of accounts has no duplicate codes.
 * @param {string} industryId
 * @returns {{ valid: boolean, duplicates: Array }}
 */
function validateCoaDuplicates(industryId) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return { valid: false, duplicates: [] };

  const seen = {};
  const duplicates = [];

  for (const acct of template) {
    if (seen[acct.code]) {
      duplicates.push({
        code: acct.code,
        first: seen[acct.code].name,
        second: acct.name,
      });
    } else {
      seen[acct.code] = acct;
    }
  }

  return { valid: duplicates.length === 0, duplicates };
}

/**
 * Get statistics about a COA template.
 * @param {string} industryId
 * @returns {Object}
 */
function getCoaStats(industryId) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return null;

  const stats = {
    totalAccounts: template.length,
    bsAccounts: 0,
    plAccounts: 0,
    categories: {},
    fsliMappings: {},
    codeRanges: {
      fixedAssets: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      longTermLiabilities: 0,
      capitalReserves: 0,
      revenue: 0,
      costOfSales: 0,
      overheads: 0,
      otherIncomeTax: 0,
    },
  };

  for (const acct of template) {
    if (acct.type === "BS") stats.bsAccounts++;
    else stats.plAccounts++;

    stats.categories[acct.category] = (stats.categories[acct.category] || 0) + 1;
    stats.fsliMappings[acct.fsliMapping] = (stats.fsliMappings[acct.fsliMapping] || 0) + 1;

    if (acct.code >= 1000 && acct.code < 2000) stats.codeRanges.fixedAssets++;
    else if (acct.code >= 2000 && acct.code < 3000) stats.codeRanges.currentAssets++;
    else if (acct.code >= 3000 && acct.code < 4000) stats.codeRanges.currentLiabilities++;
    else if (acct.code >= 4000 && acct.code < 5000) stats.codeRanges.longTermLiabilities++;
    else if (acct.code >= 5000 && acct.code < 6000) stats.codeRanges.capitalReserves++;
    else if (acct.code >= 6000 && acct.code < 7000) stats.codeRanges.revenue++;
    else if (acct.code >= 7000 && acct.code < 8000) stats.codeRanges.costOfSales++;
    else if (acct.code >= 8000 && acct.code < 9000) stats.codeRanges.overheads++;
    else if (acct.code >= 9000 && acct.code < 10000) stats.codeRanges.otherIncomeTax++;
  }

  return stats;
}

/**
 * Compare two industry COA templates.
 * Returns accounts unique to each and accounts shared (by name similarity).
 * @param {string} industryA
 * @param {string} industryB
 * @returns {{ shared: Array, onlyA: Array, onlyB: Array }}
 */
function compareIndustryTemplates(industryA, industryB) {
  const templateA = UK_COA_TEMPLATES[industryA];
  const templateB = UK_COA_TEMPLATES[industryB];
  if (!templateA || !templateB) return { shared: [], onlyA: [], onlyB: [] };

  const namesA = new Set(templateA.map(a => a.name.toLowerCase()));
  const namesB = new Set(templateB.map(a => a.name.toLowerCase()));

  const shared = [];
  const onlyA = [];
  const onlyB = [];

  for (const acct of templateA) {
    if (namesB.has(acct.name.toLowerCase())) {
      shared.push(acct);
    } else {
      onlyA.push(acct);
    }
  }

  for (const acct of templateB) {
    if (!namesA.has(acct.name.toLowerCase())) {
      onlyB.push(acct);
    }
  }

  return { shared, onlyA, onlyB };
}

/**
 * Generate a flat list of FSLI line items for financial statement building.
 * @param {string} industryId
 * @param {string} statementType - "BS" or "PL"
 * @returns {Array<{ fsli: string, accounts: Array, sign: string }>}
 */
function getFsliLineItems(industryId, statementType) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return [];

  const filtered = template.filter(acct => acct.type === statementType);
  const fsliGroups = {};

  for (const acct of filtered) {
    if (!fsliGroups[acct.fsliMapping]) {
      const fsliInfo = COA_FSLI_SUMMARY[acct.fsliMapping];
      fsliGroups[acct.fsliMapping] = {
        fsli: acct.fsliMapping,
        accounts: [],
        sign: fsliInfo ? fsliInfo.sign : "Dr",
      };
    }
    fsliGroups[acct.fsliMapping].accounts.push(acct);
  }

  // Order: Fixed Assets, Receivables, Inventory, Cash, Payables, Loans, Provisions, Tax, Equity, Revenue, Other
  const order = ["Fixed Assets", "Receivables", "Inventory", "Cash", "Payables", "Loans", "Provisions", "Tax", "Equity", "Revenue", "Other"];
  const result = [];
  for (const key of order) {
    if (fsliGroups[key]) {
      result.push(fsliGroups[key]);
    }
  }
  // Add any remaining
  for (const key of Object.keys(fsliGroups)) {
    if (!order.includes(key)) {
      result.push(fsliGroups[key]);
    }
  }

  return result;
}

/**
 * FSLI mapping validation constants.
 * All valid FSLI mapping values that accounts can reference.
 */
const VALID_FSLI_MAPPINGS = [
  "Revenue",
  "Receivables",
  "Inventory",
  "Payables",
  "Cash",
  "Fixed Assets",
  "Equity",
  "Loans",
  "Provisions",
  "Tax",
  "Other",
];

/**
 * Validate that all accounts in a template use valid FSLI mappings.
 * @param {string} industryId
 * @returns {{ valid: boolean, invalid: Array }}
 */
function validateFsliMappings(industryId) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return { valid: false, invalid: [] };

  const validSet = new Set(VALID_FSLI_MAPPINGS);
  const invalid = [];

  for (const acct of template) {
    if (!validSet.has(acct.fsliMapping)) {
      invalid.push({ code: acct.code, name: acct.name, fsliMapping: acct.fsliMapping });
    }
  }

  return { valid: invalid.length === 0, invalid };
}

/**
 * Map a single account code to its FSLI and category based on industry template.
 * @param {number} code
 * @param {string} industryId
 * @returns {Object|null}
 */
function lookupAccountByCode(code, industryId) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return null;

  const codeNum = typeof code === "string" ? parseInt(code, 10) : code;
  return template.find(acct => acct.code === codeNum) || null;
}

/**
 * Create a custom account and add it to a template copy.
 * Returns a new array (does not mutate the original).
 * @param {string} industryId
 * @param {Object} newAccount
 * @returns {Array}
 */
function addCustomAccount(industryId, newAccount) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return [];

  const required = ["code", "name", "type", "category", "fsliMapping", "normalBalance", "subCategory"];
  for (const field of required) {
    if (newAccount[field] === undefined || newAccount[field] === null) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (newAccount.type !== "BS" && newAccount.type !== "PL") {
    throw new Error("type must be 'BS' or 'PL'");
  }
  if (newAccount.normalBalance !== "Dr" && newAccount.normalBalance !== "Cr") {
    throw new Error("normalBalance must be 'Dr' or 'Cr'");
  }
  if (!VALID_FSLI_MAPPINGS.includes(newAccount.fsliMapping)) {
    throw new Error(`Invalid fsliMapping: ${newAccount.fsliMapping}. Must be one of: ${VALID_FSLI_MAPPINGS.join(", ")}`);
  }

  const copy = [...template, newAccount];
  copy.sort((a, b) => a.code - b.code);
  return copy;
}

/**
 * Generate a trial balance template (empty rows) for an industry.
 * Useful for creating blank TB import templates.
 * @param {string} industryId
 * @returns {Array<{ code: number, account: string, py: 0, cy: 0 }>}
 */
function generateBlankTrialBalance(industryId) {
  const template = UK_COA_TEMPLATES[industryId];
  if (!template) return [];

  return template.map(acct => ({
    code: acct.code,
    account: acct.name,
    py: 0,
    cy: 0,
  }));
}

/**
 * Calculate the balance sheet equation check (Assets = Liabilities + Equity).
 * @param {Array} mappedRows - Output from autoMapTrialBalance with cy values
 * @returns {{ balanced: boolean, assets: number, liabilities: number, equity: number, difference: number }}
 */
function checkBalanceSheetEquation(mappedRows) {
  if (!mappedRows || !Array.isArray(mappedRows)) {
    return { balanced: false, assets: 0, liabilities: 0, equity: 0, difference: 0 };
  }

  let assets = 0;
  let liabilities = 0;
  let equity = 0;

  for (const row of mappedRows) {
    const cy = parseFloat(row.cy) || 0;
    const code = typeof row.code === "string" ? parseInt(row.code, 10) : row.code;

    if (code >= 1000 && code < 3000) {
      assets += cy;
    } else if (code >= 3000 && code < 5000) {
      liabilities += cy;
    } else if (code >= 5000 && code < 6000) {
      equity += cy;
    }
  }

  assets = Math.round(assets * 100) / 100;
  liabilities = Math.round(liabilities * 100) / 100;
  equity = Math.round(equity * 100) / 100;
  const difference = Math.round((assets - liabilities - equity) * 100) / 100;

  return {
    balanced: Math.abs(difference) < 0.01,
    assets,
    liabilities,
    equity,
    difference,
  };
}

/**
 * Extract balance sheet and profit & loss rows from mapped trial balance.
 * @param {Array} mappedRows
 * @returns {{ balanceSheet: Array, profitAndLoss: Array }}
 */
function splitByStatement(mappedRows) {
  if (!mappedRows || !Array.isArray(mappedRows)) {
    return { balanceSheet: [], profitAndLoss: [] };
  }

  const balanceSheet = [];
  const profitAndLoss = [];

  for (const row of mappedRows) {
    const code = typeof row.code === "string" ? parseInt(row.code, 10) : row.code;
    if (code >= 1000 && code < 6000) {
      balanceSheet.push(row);
    } else {
      profitAndLoss.push(row);
    }
  }

  return { balanceSheet, profitAndLoss };
}

/**
 * Normalise an account name for better matching.
 * Handles common abbreviations and variations.
 * @param {string} name
 * @returns {string}
 */
function normaliseAccountName(name) {
  if (!name) return "";
  let normalised = name.toLowerCase().trim();

  // Common UK accounting abbreviations
  const replacements = [
    [/\bnic\b/g, "national insurance contributions"],
    [/\bpaye\b/g, "pay as you earn"],
    [/\bvat\b/g, "value added tax"],
    [/\bp&l\b/g, "profit and loss"],
    [/\bbs\b/g, "balance sheet"],
    [/\bcis\b/g, "construction industry scheme"],
    [/\bwip\b/g, "work in progress"],
    [/\bfv\b/g, "fair value"],
    [/\becl\b/g, "expected credit loss"],
    [/\bfca\b/g, "financial conduct authority"],
    [/\bfscs\b/g, "financial services compensation scheme"],
    [/\bcbils\b/g, "coronavirus business interruption loan scheme"],
    [/\bpi\b/g, "professional indemnity"],
    [/\br&d\b/g, "research and development"],
    [/\bsdlt\b/g, "stamp duty land tax"],
    [/\bcrm\b/g, "customer relationship management"],
    [/\bepos\b/g, "electronic point of sale"],
    [/\bcnc\b/g, "computer numerical control"],
    [/\bip\b/g, "intellectual property"],
    [/\bemi\b/g, "enterprise management incentive"],
    [/\bsaas\b/g, "software as a service"],
    [/\bapi\b/g, "application programming interface"],
    [/\bsofa\b/g, "statement of financial activities"],
    [/\bagm\b/g, "annual general meeting"],
    [/\bcpd\b/g, "continuing professional development"],
    [/\baml\b/g, "anti money laundering"],
    [/\bssl\b/g, "secure sockets layer"],
    [/\bcdn\b/g, "content delivery network"],
    [/\baws\b/g, "amazon web services"],
    [/\bgcp\b/g, "google cloud platform"],
    [/\bfx\b/g, "foreign exchange"],
    [/\bhp\b/g, "hire purchase"],
    [/\bseis\b/g, "seed enterprise investment scheme"],
    [/\beis\b/g, "enterprise investment scheme"],
    [/\bdepn\b/g, "depreciation"],
    [/\bamort\b/g, "amortisation"],
    [/\baccts\b/g, "accounts"],
    [/\bacct\b/g, "account"],
    [/\badmin\b/g, "administration"],
    [/\bexp\b/g, "expenses"],
    [/\bprop\b/g, "property"],
    [/\bequip\b/g, "equipment"],
    [/\bfurn\b/g, "furniture"],
    [/\btel\b/g, "telephone"],
    [/\binsur\b/g, "insurance"],
    [/\bprof\b/g, "professional"],
    [/\bmktg\b/g, "marketing"],
    [/\brec\b/g, "receivable"],
    [/\bpay\b/g, "payable"],
    [/\bprov\b/g, "provision"],
    [/\bcred\b/g, "creditor"],
    [/\bdeb\b/g, "debtor"],
    [/\brev\b/g, "revenue"],
  ];

  for (const [pattern, replacement] of replacements) {
    normalised = normalised.replace(pattern, replacement);
  }

  return normalised;
}

/**
 * Enhanced fuzzy match that uses normalised names.
 * @param {string} accountName
 * @param {string} industryId
 * @returns {Object}
 */
function enhancedFuzzyMatch(accountName, industryId) {
  const normalised = normaliseAccountName(accountName);
  return fuzzyMatchAccount(normalised, industryId);
}

/**
 * Batch validate multiple industry templates.
 * @returns {Object} Validation results keyed by industry
 */
function validateAllTemplates() {
  const results = {};
  for (const industryId of Object.keys(UK_COA_TEMPLATES)) {
    const dupCheck = validateCoaDuplicates(industryId);
    const fsliCheck = validateFsliMappings(industryId);
    const stats = getCoaStats(industryId);
    results[industryId] = {
      industry: getIndustryDisplayName(industryId),
      accountCount: stats.totalAccounts,
      hasDuplicateCodes: !dupCheck.valid,
      duplicateCodes: dupCheck.duplicates,
      hasInvalidFsli: !fsliCheck.valid,
      invalidFsli: fsliCheck.invalid,
      bsAccounts: stats.bsAccounts,
      plAccounts: stats.plAccounts,
    };
  }
  return results;
}

/**
 * Get suggested account mappings for common TB line items.
 * These are standard names often seen in imported trial balances.
 */
const COMMON_TB_MAPPINGS = {
  "sales": { fsli: "Revenue", codeHint: 6000 },
  "turnover": { fsli: "Revenue", codeHint: 6000 },
  "revenue": { fsli: "Revenue", codeHint: 6000 },
  "cost of sales": { fsli: "Other", codeHint: 7000 },
  "cost of goods sold": { fsli: "Other", codeHint: 7000 },
  "cogs": { fsli: "Other", codeHint: 7000 },
  "gross profit": { fsli: "Other", codeHint: null },
  "wages": { fsli: "Other", codeHint: 8010 },
  "salaries": { fsli: "Other", codeHint: 8010 },
  "rent": { fsli: "Other", codeHint: 8050 },
  "rates": { fsli: "Other", codeHint: 8050 },
  "depreciation": { fsli: "Other", codeHint: 8190 },
  "amortisation": { fsli: "Other", codeHint: 8200 },
  "bank interest": { fsli: "Other", codeHint: 8180 },
  "interest payable": { fsli: "Other", codeHint: 8180 },
  "interest receivable": { fsli: "Revenue", codeHint: 9000 },
  "corporation tax": { fsli: "Tax", codeHint: 9100 },
  "deferred tax": { fsli: "Tax", codeHint: 9110 },
  "trade debtors": { fsli: "Receivables", codeHint: 2100 },
  "trade creditors": { fsli: "Payables", codeHint: 3000 },
  "bank": { fsli: "Cash", codeHint: 2500 },
  "cash": { fsli: "Cash", codeHint: 2530 },
  "petty cash": { fsli: "Cash", codeHint: 2530 },
  "vat": { fsli: "Tax", codeHint: 3100 },
  "paye": { fsli: "Tax", codeHint: 3120 },
  "share capital": { fsli: "Equity", codeHint: 5000 },
  "retained earnings": { fsli: "Equity", codeHint: 5100 },
  "profit and loss": { fsli: "Equity", codeHint: 5100 },
  "dividends": { fsli: "Equity", codeHint: 5110 },
  "goodwill": { fsli: "Fixed Assets", codeHint: 1200 },
  "motor vehicles": { fsli: "Fixed Assets", codeHint: 1080 },
  "computer equipment": { fsli: "Fixed Assets", codeHint: 1100 },
  "fixtures and fittings": { fsli: "Fixed Assets", codeHint: 1110 },
  "furniture and fittings": { fsli: "Fixed Assets", codeHint: 1110 },
  "prepayments": { fsli: "Receivables", codeHint: 2160 },
  "accruals": { fsli: "Payables", codeHint: 3040 },
  "deferred income": { fsli: "Payables", codeHint: 3050 },
  "bank loan": { fsli: "Loans", codeHint: 4000 },
  "directors loan": { fsli: "Loans", codeHint: 3220 },
  "hire purchase": { fsli: "Loans", codeHint: 4010 },
  "overdraft": { fsli: "Loans", codeHint: 3300 },
  "stock": { fsli: "Inventory", codeHint: 2000 },
  "inventory": { fsli: "Inventory", codeHint: 2000 },
  "work in progress": { fsli: "Inventory", codeHint: 2010 },
  "bad debts": { fsli: "Other", codeHint: 8220 },
  "insurance": { fsli: "Other", codeHint: 8070 },
  "telephone": { fsli: "Other", codeHint: 8100 },
  "travel": { fsli: "Other", codeHint: 8240 },
  "entertaining": { fsli: "Other", codeHint: 8230 },
  "legal fees": { fsli: "Other", codeHint: 8160 },
  "accountancy fees": { fsli: "Other", codeHint: 8150 },
  "professional fees": { fsli: "Other", codeHint: 8140 },
  "bank charges": { fsli: "Other", codeHint: 8170 },
  "marketing": { fsli: "Other", codeHint: 8310 },
  "printing": { fsli: "Other", codeHint: 8110 },
  "postage": { fsli: "Other", codeHint: 8120 },
  "stationery": { fsli: "Other", codeHint: 8110 },
  "subscriptions": { fsli: "Other", codeHint: 8300 },
  "pension": { fsli: "Other", codeHint: 8030 },
};

/**
 * Quick lookup for common TB account names.
 * @param {string} accountName
 * @returns {Object|null}
 */
function quickMapCommonAccount(accountName) {
  if (!accountName) return null;
  const lower = accountName.toLowerCase().trim();

  // Exact match first
  if (COMMON_TB_MAPPINGS[lower]) {
    return { ...COMMON_TB_MAPPINGS[lower], matchType: "exact" };
  }

  // Partial match
  for (const [key, value] of Object.entries(COMMON_TB_MAPPINGS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return { ...value, matchType: "partial", matchedTerm: key };
    }
  }

  return null;
}

// ============================================================
// Exports
// ============================================================
export {
  UK_COA_TEMPLATES,
  fuzzyMatchAccount,
  autoMapTrialBalance,
  COA_FSLI_SUMMARY,
  getAccountsByCategory,
  getAccountsByFsli,
  getAccountsByType,
  getAccountsByCodeRange,
  validateMapping,
  summariseByFsli,
  getIndustryIds,
  getIndustryDisplayName,
  INDUSTRY_DISPLAY_NAMES,
  searchAccountsGlobal,
  getCodeRangeInfo,
  validateCoaDuplicates,
  getCoaStats,
  compareIndustryTemplates,
  getFsliLineItems,
  VALID_FSLI_MAPPINGS,
  validateFsliMappings,
  lookupAccountByCode,
  addCustomAccount,
  generateBlankTrialBalance,
  checkBalanceSheetEquation,
  splitByStatement,
  normaliseAccountName,
  enhancedFuzzyMatch,
  validateAllTemplates,
  COMMON_TB_MAPPINGS,
  quickMapCommonAccount,
};
