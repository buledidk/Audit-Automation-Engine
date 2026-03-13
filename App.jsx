import { useState, useEffect, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, BorderStyle, WidthType, AlignmentType } from "docx";

// ═══════════════════════════════════════════════════════════════════════════
// AUDITENGINE v9.1 — LIVE AUDIT SOFTWARE
// 47 Working Papers · 8 Industries · FSLI-Driven Layout · Editable Cells
// Bright UI · Custom Items · Section Progress · Full Export · Lead→Testing Trace
// ═══════════════════════════════════════════════════════════════════════════

const INDUSTRIES = {
  construction: {
    label:"Construction & Infrastructure", icon:"🏗️",
    sectors:["Civil Engineering","Residential","Commercial","Infrastructure","Specialist Trades"],
    risks:[
      {id:"R01",text:"Revenue recognition on long-term contracts (stage of completion)",level:"SIGNIFICANT",isa:"ISA 240.26",response:"Extended substantive testing on contract revenue; independent recalculation of stage of completion"},
      {id:"R02",text:"WIP valuation and cost allocation across projects",level:"SIGNIFICANT",isa:"ISA 540",response:"Detailed cost-to-complete analysis; project margin review with management"},
      {id:"R03",text:"Retentions receivable — recoverability and ageing",level:"ELEVATED",isa:"ISA 540",response:"Ageing analysis; confirmation of material balances; assess provision adequacy"},
      {id:"R04",text:"Subcontractor accruals and contra arrangements",level:"ELEVATED",isa:"ISA 330",response:"CIS reconciliation; verify accruals to payment applications"},
      {id:"R05",text:"Health & safety provisions and contingent liabilities",level:"ELEVATED",isa:"ISA 540",response:"Review H&S register; obtain legal update; assess provision methodology"},
      {id:"R06",text:"Liquidated damages exposure on delayed projects",level:"ELEVATED",isa:"ISA 540",response:"Review project schedules; assess LD clauses and management exposure estimates"},
      {id:"R07",text:"Plant & equipment — capitalisation vs expense boundary",level:"NORMAL",isa:"ISA 540",response:"Test capitalisation policy; verify useful life estimates"},
      {id:"R08",text:"Foreign currency on international contracts",level:"NORMAL",isa:"ISA 330",response:"Verify translation rates; test hedging; review unrealised gains/losses"}
    ],
    procedures:[
      {area:"Revenue",ref:"D1",proc:"Test stage of completion for contracts > PM — recalculate % complete using cost-to-cost method",assertion:"Accuracy; Cut-off",isa:"ISA 540; FRS 102 s23"},
      {area:"Revenue",ref:"D1",proc:"Verify contract terms, variations, claims against signed agreements",assertion:"Occurrence; Rights",isa:"ISA 500; ISA 240.26"},
      {area:"WIP",ref:"D3",proc:"Assess cost-to-complete — review QS reports, challenge assumptions, compare estimates to actuals",assertion:"Valuation",isa:"ISA 540; FRS 102 s13"},
      {area:"Retentions",ref:"D2",proc:"Confirm retention balances; test subsequent release; assess recoverability",assertion:"Existence; Valuation",isa:"ISA 505; FRS 102 s11"},
      {area:"Subcontractors",ref:"D4",proc:"Reconcile CIS deductions to HMRC returns; verify accruals",assertion:"Completeness; Accuracy",isa:"ISA 330; ITEPA 2003"},
      {area:"Provisions",ref:"D12",proc:"Review legal claims, H&S incidents, warranty and defects obligations",assertion:"Completeness; Valuation",isa:"ISA 540; FRS 102 s21"},
      {area:"Fixed Assets",ref:"D7",proc:"Test plant additions > PM; verify capitalisation vs repair classification",assertion:"Existence; Valuation",isa:"ISA 540; FRS 102 s17"},
      {area:"Tax",ref:"D13",proc:"Verify CIS deductions; agree CT computation; test capital allowances",assertion:"Accuracy",isa:"ISA 540; ITEPA 2003"},
      {area:"Leases",ref:"D14",proc:"Classify plant leases (finance vs operating); test ROU assets for IFRS",assertion:"Classification; Accuracy",isa:"FRS 102 s20; IFRS 16"},
      {area:"Related Parties",ref:"D15",proc:"Identify connected contracts; test director interests; verify disclosures",assertion:"Completeness",isa:"ISA 550; FRS 102 s33"}
    ],
    kpis:["Gross margin by project","WIP as % of revenue","Debtor days","Retention ageing > 12m","Subcontractor cost ratio","Plant utilisation","Cash conversion cycle","Order book coverage"],
    disclosures:["Long-term contract balances (s23.30)","Retentions receivable/payable","CIS obligations","Performance bonds","Capital commitments (s20.16)","Contingent liabilities (s21.15)"],
    controls:["Contract approval and variation controls","Cost allocation and timesheet controls","CIS deduction processing","H&S incident reporting","Plant asset register maintenance","Payment certification process"],
    goingConcern:["Pipeline of contracted work","Cash flow from retentions","Bonding capacity","Key customer concentration","Seasonal cash flow patterns","Subcontractor payment stability"],
    laws:["Companies Act 2006","Health & Safety at Work Act 1974","CDM Regulations 2015","Building Safety Act 2022","ITEPA 2003 (CIS)","Environmental Protection Act 1990","Bribery Act 2010","Modern Slavery Act 2015"],
    fsli:{
      revenue:["Contract revenue","Variation income","Claims income","Other operating income"],
      receivables:["Trade receivables","Retentions receivable","Amounts due on contracts","Prepayments"],
      inventory:["Work in progress","Raw materials","Plant stores"],
      payables:["Trade payables","Subcontractor accruals","Retentions payable","CIS liability","Other accruals"],
      fixedAssets:["Freehold property","Plant & machinery","Motor vehicles","Office equipment","Assets under construction"],
      equity:["Share capital","Share premium","Retained earnings","Revaluation reserve"],
      loans:["Bank overdraft","Term loans","HP/finance leases","Directors loans"],
      provisions:["Defects liability","H&S claims","Liquidated damages","Dilapidations","Deferred tax"],
      tax:["Corporation tax","Deferred tax","CIS deductions receivable","VAT"],
      cash:["Current accounts","Deposit accounts","Project trust accounts"]
    }
  },
  manufacturing: {
    label:"Manufacturing", icon:"🏭",
    sectors:["Food & Beverage","Automotive","Aerospace","Pharmaceuticals","Textiles","Electronics"],
    risks:[
      {id:"R01",text:"Inventory valuation — cost allocation and overhead absorption",level:"SIGNIFICANT",isa:"ISA 501",response:"Attend stock count; test cost build-up; verify overhead absorption rates"},
      {id:"R02",text:"Obsolete or slow-moving stock provisions",level:"SIGNIFICANT",isa:"ISA 540",response:"Analyse ageing; test NRV to post year-end sales; assess provision methodology"},
      {id:"R03",text:"Revenue on bill-and-hold or consignment",level:"ELEVATED",isa:"ISA 240.26",response:"Identify arrangements; verify transfer of risks; test cut-off ±10 days"},
      {id:"R04",text:"Capital expenditure — capitalisation boundary",level:"ELEVATED",isa:"ISA 540",response:"Test additions > PM; review near-threshold items; assess useful lives"},
      {id:"R05",text:"Environmental and decommissioning provisions",level:"ELEVATED",isa:"ISA 540",response:"Review compliance reports; verify discount rate and timing assumptions"},
      {id:"R06",text:"Transfer pricing on intercompany",level:"ELEVATED",isa:"ISA 550",response:"Review TP documentation; test sample; verify arm's length basis"},
      {id:"R07",text:"Grant income recognition and clawback",level:"NORMAL",isa:"FRS 102 s24",response:"Verify conditions met; test recognition timing; assess clawback risk"}
    ],
    procedures:[
      {area:"Inventory",ref:"D3",proc:"Attend stock count — observe procedures, test counts, investigate discrepancies; test cost build-up",assertion:"Existence; Valuation",isa:"ISA 501; FRS 102 s13"},
      {area:"Inventory",ref:"D3",proc:"NRV testing — test slow-moving lines to post year-end selling prices",assertion:"Valuation",isa:"ISA 540; FRS 102 s13.4"},
      {area:"Revenue",ref:"D1",proc:"Test cut-off on despatch notes ±10 days; verify bill-and-hold criteria",assertion:"Cut-off; Occurrence",isa:"ISA 240.26; FRS 102 s23"},
      {area:"Fixed Assets",ref:"D7",proc:"Test additions > PM to invoice and delivery note; recalculate depreciation",assertion:"Existence; Valuation",isa:"ISA 540; FRS 102 s17"},
      {area:"Provisions",ref:"D12",proc:"Review environmental compliance and warranty claims history",assertion:"Completeness; Valuation",isa:"ISA 540; FRS 102 s21"},
      {area:"Tax",ref:"D13",proc:"Verify capital allowances (AIA, SBA); R&D tax relief claim",assertion:"Accuracy",isa:"ISA 540; CTA 2009"},
      {area:"Leases",ref:"D14",proc:"Classify equipment leases; test HP agreements",assertion:"Classification",isa:"FRS 102 s20"},
      {area:"Related Parties",ref:"D15",proc:"Test intercompany pricing; verify group recharges",assertion:"Accuracy; Completeness",isa:"ISA 550; FRS 102 s33"}
    ],
    kpis:["Gross margin %","Stock turn days","Overhead absorption rate","Capex:depreciation ratio","Defect rate","Capacity utilisation","Revenue per employee"],
    disclosures:["Inventory categories","Depreciation policies","Government grants","Environmental obligations","Capital commitments","R&D expenditure"],
    controls:["Stock count procedures","Purchase order authorisation","Production cost tracking","Quality control","Asset register maintenance","Environmental monitoring"],
    goingConcern:["Order book visibility","Raw material exposure","Key customer dependence","Equipment replacement","Debt covenants","Supply chain stability"],
    laws:["Companies Act 2006","Health & Safety at Work Act 1974","Environmental Protection Act 1990","Consumer Rights Act 2015","Modern Slavery Act 2015","REACH Regulations"],
    fsli:{
      revenue:["Product sales","Service revenue","By-product income","Export sales"],
      receivables:["Trade receivables","Amounts due from group","Prepayments","Other debtors"],
      inventory:["Raw materials","Work in progress","Finished goods","Consumables"],
      payables:["Trade payables","Accruals","Amounts due to group","Other creditors"],
      fixedAssets:["Freehold property","Plant & machinery","Motor vehicles","Office equipment","Tooling"],
      equity:["Share capital","Share premium","Retained earnings","Other reserves"],
      loans:["Bank overdraft","Term loans","HP/finance leases","Group loans"],
      provisions:["Warranty","Environmental","Restructuring","Deferred tax"],
      tax:["Corporation tax","Deferred tax","R&D tax credit","VAT"],
      cash:["Current accounts","Deposit accounts","Petty cash"]
    }
  },
  technology: {
    label:"Technology & SaaS", icon:"💻",
    sectors:["Software","Cloud/SaaS","Fintech","Cybersecurity","AI/ML","Hardware"],
    risks:[
      {id:"R01",text:"Revenue — multi-element arrangements (licence + services)",level:"SIGNIFICANT",isa:"IFRS 15",response:"Identify performance obligations; test SSP allocation; verify timing"},
      {id:"R02",text:"Capitalisation of development costs (FRS 102 s18)",level:"SIGNIFICANT",isa:"ISA 540",response:"Test six capitalisation criteria per project; review technical feasibility"},
      {id:"R03",text:"Deferred revenue accuracy",level:"ELEVATED",isa:"ISA 540",response:"Recalculate roll-forward; test releases to contract terms"},
      {id:"R04",text:"Share-based payment expense (FRS 102 s26)",level:"ELEVATED",isa:"ISA 540",response:"Verify model inputs; test vesting conditions; recalculate charge"},
      {id:"R05",text:"R&D tax credit eligibility",level:"ELEVATED",isa:"CTA 2009",response:"Review methodology; test qualifying expenditure; verify subcontracted R&D"},
      {id:"R06",text:"Impairment of intangibles and goodwill",level:"NORMAL",isa:"ISA 540",response:"Assess indicators; review CGU projections; challenge discount rate"}
    ],
    procedures:[
      {area:"Revenue",ref:"D1",proc:"Test transaction price allocation across performance obligations",assertion:"Accuracy; Classification",isa:"IFRS 15 / FRS 102 s23"},
      {area:"Revenue",ref:"D1",proc:"Recalculate deferred revenue roll-forward; test releases",assertion:"Cut-off; Completeness",isa:"ISA 330; FRS 102 s23"},
      {area:"Intangibles",ref:"D7",proc:"Assess dev cost capitalisation criteria (6 conditions FRS 102 s18.8H)",assertion:"Existence; Valuation",isa:"ISA 540; FRS 102 s18.8H"},
      {area:"SBP",ref:"D10",proc:"Recalculate share option expense; verify vesting conditions",assertion:"Accuracy; Completeness",isa:"FRS 102 s26; IFRS 2"},
      {area:"Tax",ref:"D13",proc:"Review R&D tax credit claim and qualifying expenditure",assertion:"Accuracy; Existence",isa:"ISA 540; CTA 2009"},
      {area:"Provisions",ref:"D12",proc:"Assess onerous contracts and restructuring provisions",assertion:"Completeness; Valuation",isa:"ISA 540; FRS 102 s21"},
      {area:"Leases",ref:"D14",proc:"Test office/data centre leases under IFRS 16 or FRS 102 s20",assertion:"Completeness; Accuracy",isa:"IFRS 16; FRS 102 s20"},
      {area:"Related Parties",ref:"D15",proc:"Test founder/director transactions; verify IP ownership",assertion:"Completeness",isa:"ISA 550; FRS 102 s33"}
    ],
    kpis:["ARR/MRR growth","Net revenue retention","Churn rate","CAC:LTV ratio","Gross margin %","Deferred revenue movement","R&D spend %","Rule of 40"],
    disclosures:["Revenue disaggregation","Development costs","Share options","R&D credits","Deferred revenue","Contract assets/liabilities"],
    controls:["Revenue recognition policy review","Dev cost capitalisation approval","SBP tracking","IP protection","GDPR compliance","Change management"],
    goingConcern:["Cash runway months","Revenue concentration","Funding status","Churn trends","Burn rate","Key person dependency"],
    laws:["Companies Act 2006","Data Protection Act 2018","Computer Misuse Act 1990","Consumer Rights Act 2015","Patents Act 1977","Employment Rights Act 1996"],
    fsli:{
      revenue:["Licence revenue","SaaS subscription","Implementation services","Support & maintenance","Professional services"],
      receivables:["Trade receivables","Accrued income","Contract assets","Prepayments"],
      inventory:["N/A for pure SaaS"],
      payables:["Trade payables","Deferred revenue","Contract liabilities","Accruals","Tax and social security"],
      fixedAssets:["Computer equipment","Leasehold improvements","Development costs (capitalised)","Goodwill"],
      equity:["Share capital","Share premium","Share option reserve","Retained earnings"],
      loans:["Convertible notes","Venture debt","Bank facilities","Directors loans"],
      provisions:["Onerous contracts","Restructuring","Dilapidations","Deferred tax"],
      tax:["Corporation tax","R&D tax credit receivable","Deferred tax","EMI/CSOP tax benefit"],
      cash:["Current accounts","Money market deposits","Restricted cash"]
    }
  },
  financial_services: {
    label:"Financial Services", icon:"🏦",
    sectors:["Banking","Insurance","Asset Management","Private Equity","Payments","Lending"],
    risks:[
      {id:"R01",text:"Fair value of financial instruments (IFRS 9 / FRS 102 s11-12)",level:"SIGNIFICANT",isa:"ISA 540",response:"Independent price verification; test Level 2/3 models; verify valuation adjustments"},
      {id:"R02",text:"Expected credit loss provisioning — model risk",level:"SIGNIFICANT",isa:"ISA 540",response:"Test ECL model inputs and staging; back-test model predictions; sensitivity analysis"},
      {id:"R03",text:"Revenue on complex financial products",level:"ELEVATED",isa:"IFRS 15",response:"Recalculate fee income; verify against agreements and AUM/NAV"},
      {id:"R04",text:"Regulatory capital adequacy",level:"ELEVATED",isa:"ISA 250",response:"Verify capital ratios; test regulatory returns; assess compliance"},
      {id:"R05",text:"Client money segregation (CASS)",level:"SIGNIFICANT",isa:"ISA 505",response:"Confirm reconciliation; test segregation; verify CASS 7 compliance"},
      {id:"R06",text:"AML compliance",level:"ELEVATED",isa:"ISA 250",response:"Review AML framework; test KYC/CDD procedures; assess suspicious activity reporting"}
    ],
    procedures:[
      {area:"Investments",ref:"D9",proc:"Independent price verification for material holdings",assertion:"Valuation",isa:"ISA 540; IFRS 13"},
      {area:"Loans",ref:"D11",proc:"Test ECL model inputs, assumptions, staging criteria",assertion:"Valuation",isa:"ISA 540; IFRS 9"},
      {area:"Revenue",ref:"D1",proc:"Recalculate fee income; verify against agreements and AUM",assertion:"Accuracy; Occurrence",isa:"ISA 330; IFRS 15"},
      {area:"Client Money",ref:"D6",proc:"Confirm client money reconciliation and CASS 7 segregation",assertion:"Existence; Rights",isa:"ISA 505; CASS 7"},
      {area:"Provisions",ref:"D12",proc:"Test claims provisions and IBNR reserves",assertion:"Valuation; Completeness",isa:"ISA 540; FRS 102 s21"},
      {area:"Tax",ref:"D13",proc:"Verify bank levy, surcharge, deferred tax on FV movements",assertion:"Accuracy",isa:"ISA 540; CTA 2009"},
      {area:"Leases",ref:"D14",proc:"Test office leases under IFRS 16 / FRS 102 s20",assertion:"Completeness; Accuracy",isa:"IFRS 16; FRS 102 s20"},
      {area:"Related Parties",ref:"D15",proc:"Test connected lending and personal account dealing",assertion:"Completeness",isa:"ISA 550; FCA SYSC"}
    ],
    kpis:["Net interest margin","Cost:income ratio","NPL ratio","Capital adequacy","AUM growth","Solvency ratio","Liquidity coverage","Claims ratio"],
    disclosures:["Fair value hierarchy","ECL methodology","Regulatory capital","Client money","Risk management","Solvency"],
    controls:["Client money reconciliation (daily)","Trade settlement","Credit approval","AML/KYC screening","Regulatory reporting","Market risk limits"],
    goingConcern:["Capital headroom","Liquidity ratio","Client concentration","Funding stability","Regulatory action risk","Market conditions"],
    laws:["Companies Act 2006","FSMA 2000","FCA Handbook (CASS, SYSC)","MLR 2017","Bribery Act 2010","Proceeds of Crime Act 2002"],
    fsli:{
      revenue:["Interest income","Fee and commission income","Trading income","Insurance premiums","Investment returns"],
      receivables:["Loans and advances","Trade receivables","Accrued income","Insurance receivables"],
      inventory:["N/A"],
      payables:["Customer deposits","Trade payables","Insurance liabilities","Deferred income","Accruals"],
      fixedAssets:["Office premises","IT infrastructure","Leasehold improvements","Goodwill"],
      equity:["Share capital","Share premium","Retained earnings","Regulatory reserves","Other reserves"],
      loans:["Subordinated debt","Bank facilities","Repo agreements","Tier 2 capital"],
      provisions:["ECL provision","Insurance claims (IBNR)","Conduct/redress","Restructuring","Deferred tax"],
      tax:["Corporation tax","Bank levy","Deferred tax","SDRT"],
      cash:["Cash at bank","Central bank reserves","Client money (segregated)","Money market"]
    }
  },
  retail: {
    label:"Retail & Consumer", icon:"🛒",
    sectors:["E-commerce","Grocery","Fashion","Hospitality","Leisure","Food Service"],
    risks:[
      {id:"R01",text:"Inventory — markdowns, shrinkage, obsolescence",level:"SIGNIFICANT",isa:"ISA 501",response:"Attend counts; test shrinkage provision; markdown analysis"},
      {id:"R02",text:"Revenue — loyalty, gift cards, returns",level:"SIGNIFICANT",isa:"IFRS 15",response:"Test loyalty deferrals; gift card breakage; returns provision"},
      {id:"R03",text:"Lease accounting (IFRS 16 / FRS 102 s20)",level:"ELEVATED",isa:"ISA 540",response:"Recalculate ROU and lease liability for material leases"},
      {id:"R04",text:"Impairment of store assets",level:"ELEVATED",isa:"ISA 540",response:"Assess CGUs; review underperforming stores; test impairment models"},
      {id:"R05",text:"VAT on mixed supplies",level:"NORMAL",isa:"ISA 250",response:"Review partial exemption calculation; test input VAT recovery"}
    ],
    procedures:[
      {area:"Inventory",ref:"D3",proc:"Attend stock counts; test shrinkage provision methodology",assertion:"Existence; Valuation",isa:"ISA 501; FRS 102 s13"},
      {area:"Revenue",ref:"D1",proc:"Test loyalty deferrals and gift card breakage estimates",assertion:"Accuracy; Cut-off",isa:"IFRS 15 / FRS 102 s23"},
      {area:"Leases",ref:"D14",proc:"Recalculate ROU and lease liability for material store leases",assertion:"Accuracy; Completeness",isa:"IFRS 16 / FRS 102 s20"},
      {area:"Fixed Assets",ref:"D7",proc:"Test store fit-out additions; assess CGU impairment",assertion:"Existence; Valuation",isa:"ISA 540; FRS 102 s27"},
      {area:"Tax",ref:"D13",proc:"Verify VAT partial exemption; capital allowances on fit-outs",assertion:"Accuracy",isa:"ISA 540; VATA 1994"},
      {area:"Provisions",ref:"D12",proc:"Test dilapidations and onerous lease provisions",assertion:"Valuation; Completeness",isa:"ISA 540; FRS 102 s21"},
      {area:"Related Parties",ref:"D15",proc:"Test franchise/concession arrangements with connected parties",assertion:"Completeness",isa:"ISA 550; FRS 102 s33"}
    ],
    kpis:["Like-for-like sales","Gross margin %","Stock turn days","Rent:revenue ratio","Online mix %","Footfall conversion"],
    disclosures:["Lease commitments","Loyalty accounting","Store impairments","Segment reporting"],
    controls:["EPOS reconciliation","Stock count procedures","Returns processing","Gift card controls","Cash handling"],
    goingConcern:["Like-for-like trends","Lease maturity","Seasonal cash flow","Competition","Online growth"],
    laws:["Companies Act 2006","Consumer Rights Act 2015","Food Safety Act 1990","Health & Safety Act 1974","Data Protection Act 2018"],
    fsli:{
      revenue:["Retail sales","Online sales","Franchise income","Concession income","Gift card redemptions"],
      receivables:["Trade receivables","Franchise receivables","Prepayments","Accrued income"],
      inventory:["Finished goods","Goods in transit","Packaging","Consumables"],
      payables:["Trade payables","Gift card liability","Loyalty programme liability","Accruals","Deferred income"],
      fixedAssets:["Freehold stores","Leasehold improvements","Fixtures & fittings","IT systems","ROU assets"],
      equity:["Share capital","Share premium","Retained earnings","Hedging reserve"],
      loans:["Bank overdraft","Term loans","Lease liabilities","Asset finance"],
      provisions:["Dilapidations","Onerous leases","Restructuring","Deferred tax"],
      tax:["Corporation tax","Deferred tax","VAT","Business rates provision"],
      cash:["Store floats","Current accounts","Deposit accounts"]
    }
  },
  professional_services: {
    label:"Professional Services", icon:"⚖️",
    sectors:["Legal","Accounting","Consulting","Recruitment","Architecture"],
    risks:[
      {id:"R01",text:"WIP and unbilled disbursements — recoverability",level:"SIGNIFICANT",isa:"ISA 540",response:"Aged WIP analysis; lock-up review; recoverability assessment"},
      {id:"R02",text:"Revenue on fixed-fee engagements",level:"SIGNIFICANT",isa:"FRS 102 s23",response:"Test time records to fee notes; verify stage of completion"},
      {id:"R03",text:"Partner profit shares and capital",level:"ELEVATED",isa:"ISA 550",response:"Review partnership agreement; verify allocations; test drawings"},
      {id:"R04",text:"Professional indemnity provisions",level:"ELEVATED",isa:"ISA 540",response:"Review PI claims register; assess adequacy; obtain insurer confirmation"},
      {id:"R05",text:"Client account compliance",level:"SIGNIFICANT",isa:"ISA 250",response:"Test reconciliation; verify segregation; SRA/ICAEW rules compliance"}
    ],
    procedures:[
      {area:"WIP",ref:"D3",proc:"Assess recoverability of aged WIP; review lock-up days",assertion:"Valuation",isa:"ISA 540; FRS 102 s23"},
      {area:"Revenue",ref:"D1",proc:"Test time records to fee notes; verify completion stage",assertion:"Occurrence; Accuracy",isa:"ISA 330; FRS 102 s23"},
      {area:"Provisions",ref:"D12",proc:"Review PI claims register; assess provision adequacy",assertion:"Completeness; Valuation",isa:"ISA 540; FRS 102 s21"},
      {area:"Client Money",ref:"D6",proc:"Confirm client account reconciliation and compliance",assertion:"Existence; Rights",isa:"ISA 505; SRA Rules"},
      {area:"Fixed Assets",ref:"D7",proc:"Test goodwill on acquisitions/lateral hires for impairment",assertion:"Valuation",isa:"ISA 540; FRS 102 s19"},
      {area:"Tax",ref:"D13",proc:"Verify LLP/partnership tax allocations",assertion:"Accuracy",isa:"ISA 540; ITTOIA 2005"},
      {area:"Related Parties",ref:"D15",proc:"Test partner transactions and connected entities",assertion:"Completeness",isa:"ISA 550; FRS 102 s33"}
    ],
    kpis:["Revenue per partner","Lock-up days","Utilisation rate","Fee recovery %","WIP ageing","PEP"],
    disclosures:["WIP methodology","Partner arrangements","PI exposure","Client account balances"],
    controls:["Time recording","Client money handling","Engagement letters","PI claims reporting","Partner approvals"],
    goingConcern:["Client concentration","Partner retention","PI exposure","Cash lock-up","Lateral hire pipeline"],
    laws:["Companies Act 2006","SRA Accounts Rules","Legal Services Act 2007","Data Protection Act 2018","AML Regulations 2017"],
    fsli:{
      revenue:["Fee income (time-based)","Fixed fee income","Disbursements recovered","Other income"],
      receivables:["Trade receivables","Unbilled WIP","Disbursements recoverable","Prepayments"],
      inventory:["Work in progress"],
      payables:["Trade payables","Partner drawings","Accruals","Client account balances due"],
      fixedAssets:["Leasehold improvements","Office equipment","Goodwill (lateral hires)","IT systems"],
      equity:["Partner capital","Current accounts","Reserves"],
      loans:["Bank facilities","Partner loans","Lease liabilities"],
      provisions:["PI claims","Dilapidations","Sabbatical","Deferred tax"],
      tax:["Income tax (LLP)","Corporation tax (Ltd)","Deferred tax","VAT"],
      cash:["Office account","Client account (segregated)","Deposit accounts"]
    }
  },
  property: {
    label:"Property & Real Estate", icon:"🏢",
    sectors:["Commercial","Residential Development","REIT","Property Management","Social Housing"],
    risks:[
      {id:"R01",text:"Investment property valuation (FRS 102 s16)",level:"SIGNIFICANT",isa:"ISA 540",response:"Assess valuer competence; challenge yield and ERV assumptions"},
      {id:"R02",text:"Development profit recognition",level:"SIGNIFICANT",isa:"ISA 540",response:"Recalculate profit; verify costs to complete; test completion %"},
      {id:"R03",text:"Impairment of development land",level:"ELEVATED",isa:"ISA 540",response:"Review land bank; assess planning status; test for indicators"},
      {id:"R04",text:"Service charge accounting",level:"ELEVATED",isa:"ISA 330",response:"Test fund accounting; verify compliance with lease terms"},
      {id:"R05",text:"S106/CIL obligations",level:"ELEVATED",isa:"ISA 540",response:"Review planning conditions; verify provision for outstanding obligations"}
    ],
    procedures:[
      {area:"Valuation",ref:"D7",proc:"Assess valuer competence and independence; challenge yield/ERV",assertion:"Valuation",isa:"ISA 540; ISA 620; FRS 102 s16"},
      {area:"Revenue",ref:"D1",proc:"Recalculate development profit; verify costs to complete",assertion:"Accuracy; Cut-off",isa:"ISA 540; FRS 102 s23"},
      {area:"Leases",ref:"D14",proc:"Test lease incentive spreading calculations",assertion:"Accuracy",isa:"FRS 102 s20"},
      {area:"Fixed Assets",ref:"D7",proc:"Verify Land Registry ownership; test capital improvements",assertion:"Existence; Rights",isa:"ISA 500; FRS 102 s17"},
      {area:"Provisions",ref:"D12",proc:"Test S106/CIL obligations and dilapidations",assertion:"Completeness; Valuation",isa:"ISA 540; FRS 102 s21"},
      {area:"Loans",ref:"D11",proc:"Verify LTV covenants; test interest capitalisation",assertion:"Accuracy",isa:"FRS 102 s25.2; ISA 330"},
      {area:"Related Parties",ref:"D15",proc:"Test property transactions with connected parties",assertion:"Completeness; Valuation",isa:"ISA 550; FRS 102 s33"},
      {area:"Tax",ref:"D13",proc:"Verify SDLT; capital allowances on commercial property",assertion:"Accuracy",isa:"ISA 540; FA 2003"}
    ],
    kpis:["Net initial yield","Occupancy rate","ERV growth","Development margin","LTV ratio","Void rate"],
    disclosures:["Investment property valuation","Development properties","Lease commitments","Joint ventures","Service charges"],
    controls:["Valuation process","Rent collection","Development cost monitoring","Service charge management","Tenant covenant monitoring"],
    goingConcern:["Occupancy/void rates","Debt maturity","Development funding","Interest cover","Market conditions"],
    laws:["Companies Act 2006","Landlord & Tenant Act 1954","Housing Act 2004","Building Safety Act 2022","RICS Red Book"],
    fsli:{
      revenue:["Rental income","Service charge income","Development sales","Management fees","Dilapidation recoveries"],
      receivables:["Rent receivable","Service charge debtors","Development debtors","Prepayments"],
      inventory:["Development WIP","Land bank","Properties held for sale"],
      payables:["Trade payables","Service charge funds held","Deposits held","Accruals","Deferred income"],
      fixedAssets:["Investment properties (fair value)","Development properties (cost)","Office premises","Equipment"],
      equity:["Share capital","Share premium","Revaluation reserve","Retained earnings"],
      loans:["Development finance","Investment loans","Mezzanine debt","Lease liabilities"],
      provisions:["S106/CIL","Dilapidations","Void costs","Deferred tax"],
      tax:["Corporation tax","SDLT provision","Deferred tax on revaluations","Capital gains"],
      cash:["Current accounts","Rent collection accounts","Service charge trust accounts"]
    }
  },
  charities: {
    label:"Charities & Not-for-Profit", icon:"🤝",
    sectors:["Grant-Making","Service Delivery","Membership","Education","Healthcare","Religious"],
    risks:[
      {id:"R01",text:"Income recognition — donations, legacies, grants (SORP)",level:"SIGNIFICANT",isa:"Charities SORP",response:"Test entitlement, probability, measurement criteria for legacy income"},
      {id:"R02",text:"Fund accounting — restricted vs unrestricted",level:"SIGNIFICANT",isa:"Charities SORP",response:"Verify designations; confirm restricted fund expenditure compliance"},
      {id:"R03",text:"Trustee related party transactions",level:"ELEVATED",isa:"ISA 550",response:"Review declarations; test transactions; verify authorisation"},
      {id:"R04",text:"Going concern — funding dependence",level:"ELEVATED",isa:"ISA 570",response:"Assess funding pipeline; review reserves vs policy; stress test scenarios"},
      {id:"R05",text:"Expenditure allocation methodology",level:"ELEVATED",isa:"Charities SORP",response:"Test allocation basis; verify consistency; review staff time analysis"}
    ],
    procedures:[
      {area:"Income",ref:"D1",proc:"Test legacy recognition: entitlement, probability, measurement",assertion:"Occurrence; Cut-off",isa:"Charities SORP; ISA 330"},
      {area:"Funds",ref:"D10",proc:"Verify fund designations; confirm restricted fund compliance",assertion:"Classification",isa:"Charities SORP; ISA 330"},
      {area:"Governance",ref:"D15",proc:"Review trustee declarations; test RP transactions",assertion:"Completeness",isa:"ISA 550; Charities Act 2011"},
      {area:"Expenditure",ref:"D1",proc:"Test expenditure allocation across activities",assertion:"Classification; Accuracy",isa:"Charities SORP; ISA 330"},
      {area:"Grants",ref:"D12",proc:"Verify grant conditions; test for repayment provisions",assertion:"Completeness; Valuation",isa:"Charities SORP; FRS 102 s21"},
      {area:"Fixed Assets",ref:"D7",proc:"Test heritage asset recognition and valuation",assertion:"Existence; Valuation",isa:"Charities SORP; FRS 102 s17"},
      {area:"Tax",ref:"D13",proc:"Verify charity exemptions; trading subsidiary Gift Aid",assertion:"Accuracy",isa:"CTA 2010 s478; ISA 540"},
      {area:"Leases",ref:"D14",proc:"Test property leases; peppercorn arrangements",assertion:"Completeness; Valuation",isa:"FRS 102 s20; Charities SORP"}
    ],
    kpis:["Charitable spend ratio","Fundraising efficiency","Reserves coverage months","Admin cost %","Grant utilisation","Beneficiary reach"],
    disclosures:["Fund analysis (restricted/unrestricted)","Trustee remuneration","Related parties","Reserves policy","Grant conditions","Staff > £60k"],
    controls:["Donation recording","Restricted fund tracking","Trustee expense approval","Grant compliance","Safeguarding"],
    goingConcern:["Funding pipeline","Reserve levels vs policy","Key funder dependency","Regulatory compliance","Beneficiary demand"],
    laws:["Charities Act 2011","Companies Act 2006","Charity Commission CC guidance","Data Protection Act 2018","Safeguarding legislation"],
    fsli:{
      revenue:["Donations","Legacies","Grant income","Trading income","Investment income","Membership subscriptions"],
      receivables:["Legacy debtors","Grant receivable","Trade receivables","Gift Aid receivable","Prepayments"],
      inventory:["Trading stock","Goods for distribution"],
      payables:["Trade payables","Grants payable","Accruals","Deferred income","Designated fund commitments"],
      fixedAssets:["Heritage assets","Freehold property","Leasehold improvements","Equipment","Motor vehicles"],
      equity:["Unrestricted funds","Restricted funds","Endowment funds","Designated funds"],
      loans:["Bank facilities","Social investment","Charity bonds"],
      provisions:["Grant repayment","Redundancy","Dilapidations","Pension deficit"],
      tax:["PAYE/NIC","Trading subsidiary CT","Gift Aid payments due","VAT (irrecoverable)"],
      cash:["Current accounts","Deposit accounts","Restricted fund accounts","Petty cash"]
    }
  }
};

const FRAMEWORKS = {
  frs102:{label:"FRS 102 (UK GAAP)",desc:"Full FRS 102 — medium/large private",color:"#1565C0"},
  frs102_1a:{label:"FRS 102 Section 1A",desc:"Small companies — reduced disclosures",color:"#2196F3"},
  frs105:{label:"FRS 105 (Micro-entities)",desc:"Micro-entity — minimal disclosures",color:"#42A5F5"},
  ifrs:{label:"IFRS",desc:"International — listed/PIE entities",color:"#D32F2F"},
  charities_sorp:{label:"Charities SORP (FRS 102)",desc:"Charity-specific requirements",color:"#7B1FA2"}
};

const ENTITY_SIZES = {
  micro:{label:"Micro Entity",turnover:"≤ £632k",assets:"≤ £316k",employees:"≤ 10",framework:"frs105"},
  small:{label:"Small Company",turnover:"≤ £10.2m",assets:"≤ £5.1m",employees:"≤ 50",framework:"frs102_1a"},
  medium:{label:"Medium Company",turnover:"≤ £36m",assets:"≤ £18m",employees:"≤ 250",framework:"frs102"},
  large:{label:"Large Private",turnover:"> £36m",assets:"> £18m",employees:"> 250",framework:"frs102"},
  listed:{label:"Listed / PIE",turnover:"Any",assets:"Any",employees:"Any",framework:"ifrs"}
};

const WP_SECTIONS = [
  {id:"dashboard",label:"Dashboard",icon:"📊",ref:"DASH",type:"dashboard"},
  {id:"sep1",label:"PLANNING & ACCEPTANCE",type:"separator",color:"#1565C0"},
  {id:"a1",label:"Engagement Letter",icon:"📋",ref:"A1",type:"planning",isa:"ISA 210"},
  {id:"a2",label:"Client Acceptance",icon:"✅",ref:"A2",type:"planning",isa:"ISA 220"},
  {id:"a3",label:"Audit Strategy",icon:"🎯",ref:"A3",type:"planning",isa:"ISA 300"},
  {id:"a4",label:"Materiality",icon:"📐",ref:"A4",type:"planning",isa:"ISA 320"},
  {id:"a5",label:"Understanding the Entity",icon:"🔍",ref:"A5",type:"planning",isa:"ISA 315"},
  {id:"a6",label:"Fraud Risk Assessment",icon:"⚠️",ref:"A6",type:"planning",isa:"ISA 240"},
  {id:"a7",label:"Going Concern",icon:"🔄",ref:"A7",type:"planning",isa:"ISA 570"},
  {id:"a8",label:"Analytical Review (Planning)",icon:"📈",ref:"A8",type:"planning",isa:"ISA 520"},
  {id:"a9",label:"Laws & Regulations",icon:"⚖️",ref:"A9",type:"planning",isa:"ISA 250"},
  {id:"a10",label:"Group Audit",icon:"🏢",ref:"A10",type:"planning",isa:"ISA 600"},
  {id:"sep2",label:"RISK ASSESSMENT",type:"separator",color:"#C62828"},
  {id:"b1",label:"Risk Assessment Matrix",icon:"🔴",ref:"B1",type:"risk",isa:"ISA 315"},
  {id:"b2",label:"Controls Assessment",icon:"🛡️",ref:"B2",type:"risk",isa:"ISA 315.14"},
  {id:"b3",label:"Significant Risks",icon:"🚨",ref:"B3",type:"risk",isa:"ISA 315.28"},
  {id:"sep3",label:"LEAD SCHEDULES",type:"separator",color:"#2E7D32"},
  {id:"c1",label:"Trial Balance",icon:"📊",ref:"C1",type:"lead"},
  {id:"c2",label:"P&L Lead Schedule",icon:"📈",ref:"C2",type:"lead"},
  {id:"c3",label:"Balance Sheet Lead",icon:"📋",ref:"C3",type:"lead"},
  {id:"c4",label:"Journal Entry Testing",icon:"🔢",ref:"C4",type:"lead",isa:"ISA 240.33"},
  {id:"c5",label:"Fixed Assets Lead",icon:"🏗️",ref:"C5",type:"lead"},
  {id:"c6",label:"Equity & Reserves Lead",icon:"💰",ref:"C6",type:"lead"},
  {id:"c7",label:"Loans & Borrowings Lead",icon:"🏦",ref:"C7",type:"lead"},
  {id:"c8",label:"Provisions Lead",icon:"📑",ref:"C8",type:"lead"},
  {id:"sep4",label:"TESTING PROGRAMMES",type:"separator",color:"#E65100"},
  {id:"d1",label:"Revenue",icon:"💷",ref:"D1",type:"testing",isa:"ISA 240.26",fsliKey:"revenue"},
  {id:"d2",label:"Receivables",icon:"📨",ref:"D2",type:"testing",isa:"ISA 505",fsliKey:"receivables"},
  {id:"d3",label:"Inventory / WIP",icon:"📦",ref:"D3",type:"testing",isa:"ISA 501",fsliKey:"inventory"},
  {id:"d4",label:"Payables",icon:"📤",ref:"D4",type:"testing",isa:"ISA 505",fsliKey:"payables"},
  {id:"d5",label:"Payroll",icon:"👥",ref:"D5",type:"testing",isa:"ISA 330"},
  {id:"d6",label:"Cash & Bank",icon:"🏧",ref:"D6",type:"testing",isa:"ISA 505",fsliKey:"cash"},
  {id:"d7",label:"Fixed Assets",icon:"🏗️",ref:"D7",type:"testing",isa:"ISA 540",fsliKey:"fixedAssets"},
  {id:"d8",label:"Intangibles & Goodwill",icon:"💎",ref:"D8",type:"testing",isa:"FRS 102 s18/19"},
  {id:"d9",label:"Investments",icon:"📊",ref:"D9",type:"testing",isa:"FRS 102 s14/15"},
  {id:"d10",label:"Share Capital & Reserves",icon:"💰",ref:"D10",type:"testing",isa:"FRS 102 s22",fsliKey:"equity"},
  {id:"d11",label:"Loans & Borrowings",icon:"🏦",ref:"D11",type:"testing",isa:"FRS 102 s11",fsliKey:"loans"},
  {id:"d12",label:"Provisions & Contingencies",icon:"📑",ref:"D12",type:"testing",isa:"FRS 102 s21",fsliKey:"provisions"},
  {id:"d13",label:"Taxation",icon:"🧾",ref:"D13",type:"testing",isa:"FRS 102 s29",fsliKey:"tax"},
  {id:"d14",label:"Leases",icon:"📄",ref:"D14",type:"testing",isa:"FRS 102 s20/IFRS 16"},
  {id:"d15",label:"Related Parties",icon:"🔗",ref:"D15",type:"testing",isa:"ISA 550"},
  {id:"d16",label:"Cash Flow Statement",icon:"💸",ref:"D16",type:"testing",isa:"FRS 102 s7"},
  {id:"sep5",label:"COMPLETION & REPORTING",type:"separator",color:"#6A1B9A"},
  {id:"e1",label:"Completion Checklist",icon:"✔️",ref:"E1",type:"completion",isa:"ISA 220"},
  {id:"e2",label:"Final Analytical Review",icon:"📊",ref:"E2",type:"completion",isa:"ISA 520.6"},
  {id:"e3",label:"Subsequent Events",icon:"📅",ref:"E3",type:"completion",isa:"ISA 560"},
  {id:"e4",label:"Written Representations",icon:"✍️",ref:"E4",type:"completion",isa:"ISA 580"},
  {id:"e5",label:"Summary of Adjustments",icon:"📝",ref:"E5",type:"completion",isa:"ISA 450"},
  {id:"e6",label:"Audit Completion Memo",icon:"📄",ref:"E6",type:"completion",isa:"ISA 230"},
  {id:"sep6",label:"REPORTING",type:"separator",color:"#4E342E"},
  {id:"f1",label:"Management Letter",icon:"✉️",ref:"F1",type:"reporting",isa:"ISA 265"},
  {id:"f2",label:"Audit Report",icon:"📜",ref:"F2",type:"reporting",isa:"ISA 700"},
  {id:"z1",label:"Audit Trail Map",icon:"🗺️",ref:"Z",type:"trail"}
];

const ADD_TESTS = {
  d1:["Revenue cut-off: test transactions ±10 days of year end","Revenue occurrence: vouch sample to contracts/invoices","Revenue completeness: from despatch/delivery records to revenue","Revenue classification: verify correct GL coding","Deferred revenue: test release schedule and completeness"],
  d2:["Circularise material receivables (ISA 505)","Subsequent receipts testing","Aged debt review and provision assessment","Credit note testing post year-end","Intercompany balance confirmation"],
  d3:["Stock count attendance (ISA 501)","Cost vs NRV testing for material items","Overhead absorption rate review","Cut-off: goods received/despatched around year end","Provision methodology assessment (obsolescence, slow-moving)"],
  d4:["Supplier statement reconciliations","Unrecorded liabilities search (post year-end payments)","Cut-off: GRNI accrual testing","Accruals completeness and accuracy","Intercompany payable confirmation"],
  d5:["Payroll analytical review (headcount × avg salary)","Starter/leaver testing to HR records","Overtime and bonus accrual testing","PAYE/NIC reconciliation to RTI submissions","Director remuneration to board minutes and service contracts"],
  d6:["Bank confirmation letter (ISA 505)","Bank reconciliation testing — all accounts","Outstanding items: verify subsequent clearance","Cash count attendance (if applicable)","Multi-currency account: verify translation rate"],
  d7:["Additions: vouch to invoice/contract > PM","Disposals: verify proceeds, P&L, and Companies House (property)","Depreciation: recalculate for material asset classes","Impairment indicators review (ISA 540; FRS 102 s27)","Physical verification of material assets","Ownership: title deeds, V5, HP agreements","Capital vs revenue expenditure boundary testing","Capital commitments: verify to contracts/board minutes"],
  d8:["Dev cost capitalisation: test 6 criteria (FRS 102 s18.8H)","Amortisation policy and useful life review","Goodwill impairment: test CGU cash flows and discount rate","Internally generated: verify capitalisation threshold"],
  d9:["Investment schedule: agree to certificates/custodian","Subsidiary: compare net asset to carrying value","Impairment indicators for material investments","Dividend income: trace to investee board resolutions"],
  d10:["Share capital: verify to Companies House confirmation statement","Share movements: trace to board/shareholder minutes","Dividend: verify legality against distributable reserves (s.830 CA06)","Reserve transfers: verify authority and appropriateness","Share premium: verify calculation on share issues"],
  d11:["Bank confirmation of all facilities and drawn balances","Covenant compliance testing (LTV, interest cover, etc.)","Interest recalculation for material loans","New borrowings: trace to signed facility agreements","Repayment schedule: verify current/non-current split","Security: verify charge registration at Companies House"],
  d12:["Provisions: test FRS 102 s21.4 recognition criteria (obligation, probable, reliable)","Legal claims: review solicitor's letter (ISA 501)","Warranty/defects: analyse historical claims vs provision","Onerous contracts: identify and test loss-making commitments","Contingent liabilities: assess disclosure requirements","Provision releases/utilisations: verify basis and authority"],
  d13:["CT computation: agree to financial statements and tax return","Capital allowances: verify AIA, SBA, general pool calculations","Disallowable items: test completeness (entertaining, depreciation, provisions)","Prior year: agree CT61 payment/refund to HMRC records","Deferred tax: verify timing differences and rate applied","Tax losses: verify carry-forward, restrictions, and utilisation plans","R&D credits: test qualifying expenditure against HMRC criteria"],
  d14:["Lease schedule: test completeness against contracts register","Finance lease classification: test FRS 102 s20 criteria","Operating lease commitments: verify note disclosure < 1yr, 2-5yr, > 5yr","ROU asset and lease liability: recalculate under IFRS 16","New leases in year: verify terms, recognition, and measurement","Lease modifications: test accounting treatment for changes"],
  d15:["RP identification: directors, shareholders, family, connected entities","Companies House confirmation statement: verify PSC and directorships","RP transaction testing: verify arm's length pricing and commercial terms","RP balance confirmation at year end","Directors' loans: test s.197-214 CA06 compliance and disclosure","Key management compensation: verify completeness of disclosure","Disclosure review: FRS 102 s33 / IAS 24 completeness check"],
  d16:["Operating activities: reconcile net profit to cash generated","Working capital movements: verify to BS lead schedules","Investing activities: agree to FA additions/disposals and investments","Financing activities: agree to loan drawdowns/repayments and dividends","Cash and equivalents: reconcile opening and closing to BS","Material non-cash transactions: identify and disclose separately"]
};

/* ═══════════════════════════════════════════════════════════════ */
/* MAIN APPLICATION                                               */
/* ═══════════════════════════════════════════════════════════════ */
export default function AuditEngine() {
  const [activeWP, setActiveWP] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cfg, setCfg] = useState({
    industry:"",sector:"",framework:"",entitySize:"",entityName:"",fye:"",partner:"",manager:"",firmName:"",
    materiality:"",perfMateriality:"",trivial:"",configured:false
  });
  const [signOffs, setSignOffs] = useState({});
  const [wpNotes, setWpNotes] = useState({});
  const [cellData, setCellData] = useState({});
  const [customItems, setCustomItems] = useState({risks:[],procedures:[],tests:{},fsliLines:{}});
  const [showAddModal, setShowAddModal] = useState(null);
  const [modalInput, setModalInput] = useState({});

  const upd = (k,v) => setCfg(p=>({...p,[k]:v}));
  const ind = cfg.industry ? INDUSTRIES[cfg.industry] : null;
  const fw = cfg.framework ? FRAMEWORKS[cfg.framework] : null;
  const sz = cfg.entitySize ? ENTITY_SIZES[cfg.entitySize] : null;
  const doSignOff = (id,role) => setSignOffs(p=>({...p,[id]:{...(p[id]||{}),[role]:new Date().toISOString().slice(0,10)}}));
  const totalWPs = WP_SECTIONS.filter(w=>w.type!=="separator").length;
  const doneCount = Object.keys(signOffs).filter(k=>signOffs[k]?.preparedBy).length;
  const setCell = (table,row,col,val) => setCellData(p=>({...p,[`${table}_${row}_${col}`]:val}));
  const getCell = (table,row,col) => cellData[`${table}_${row}_${col}`] || "";

  // Colour palette — brighter, professional
  const C = {
    bg:"#080D19", sidebar:"#0C1225", card:"rgba(255,255,255,0.035)",
    border:"rgba(255,255,255,0.09)", accent:"#F5A623", accentLight:"#FFD54F",
    accentBg:"rgba(245,166,35,0.10)", text:"#F8F8F8", dim:"rgba(255,255,255,0.65)",
    faint:"rgba(255,255,255,0.35)", green:"#66BB6A", red:"#EF5350", orange:"#FFA726",
    blue:"#42A5F5", purple:"#CE93D8", teal:"#26A69A", cyan:"#4DD0E1",
    planning:"#1E88E5", risk:"#E53935", lead:"#43A047", testing:"#FB8C00",
    completion:"#8E24AA", reporting:"#5D4037"
  };

  const inp = {width:"100%",padding:"10px 14px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.border,color:C.text,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"};
  const lbl = {fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6,display:"block",fontWeight:600};

  const SecTitle = ({t,color}) => <div style={{fontSize:11,color:color||C.accent,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:14,fontWeight:700,paddingBottom:8,borderBottom:"2px solid "+(color||C.accent)+"33",display:"flex",alignItems:"center",gap:8}}><div style={{width:4,height:16,borderRadius:2,background:color||C.accent}} />{t}</div>;

  const Badge = ({level}) => {
    const c = level==="SIGNIFICANT"?C.red:level==="ELEVATED"?C.orange:C.green;
    return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,background:c+"22",border:"1px solid "+c+"55",color:c,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{level}</span>;
  };

  /* ─── EDITABLE TABLE ─── */
  const ETable = ({id,headers,rows,editable=[]}) => (
    <div style={{overflowX:"auto",borderRadius:8,border:"1px solid "+C.border}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>{headers.map((h,i) => <th key={i} style={{textAlign:"left",padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderBottom:"2px solid "+C.accent+"33",fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row,ri) => <tr key={ri} style={{background:ri%2===0?"rgba(255,255,255,0.015)":"transparent",transition:"background 0.15s"}}>{row.map((cell,ci) => <td key={ci} style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:C.dim,lineHeight:1.5}}>
          {editable.includes(ci) ? <input value={getCell(id,ri,ci)} onChange={e=>setCell(id,ri,ci,e.target.value)} style={{width:"100%",padding:"6px 8px",borderRadius:4,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",color:C.text,fontSize:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}} placeholder="—" /> : cell}
        </td>)}</tr>)}</tbody>
      </table>
    </div>
  );

  /* ─── WP HEADER ─── */
  const WPHead = ({wp}) => {
    const typeColor = wp.type==="planning"?C.planning:wp.type==="risk"?C.risk:wp.type==="lead"?C.lead:wp.type==="testing"?C.testing:wp.type==="completion"?C.completion:C.reporting;
    return <div style={{background:"linear-gradient(135deg, "+typeColor+"15, "+typeColor+"08)",border:"1px solid "+typeColor+"33",borderRadius:12,padding:"18px 22px",marginBottom:20,borderLeft:"4px solid "+typeColor}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>{wp.icon}</span>
          <div>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:typeColor}}>{wp.ref}</span>
              <span style={{fontSize:16,color:C.text,fontWeight:600}}>{wp.label}</span>
            </div>
            <div style={{fontSize:11,color:C.dim,marginTop:2}}>{wp.isa} · {ind?.label} · {cfg.sector}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {["preparedBy","reviewedBy"].map(role => {
            const done = signOffs[wp.id]?.[role];
            return <button key={role} onClick={()=>doSignOff(wp.id,role)} style={{
              padding:"8px 16px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",
              background:done?"rgba(76,175,80,0.15)":"rgba(255,255,255,0.05)",
              border:"1px solid "+(done?"rgba(76,175,80,0.4)":"rgba(255,255,255,0.1)"),
              color:done?C.green:C.dim,textTransform:"uppercase",letterSpacing:"0.08em",transition:"all 0.2s"
            }}>{done?("✓ "+(role==="preparedBy"?"Prepared":"Reviewed")+" "+done):(role==="preparedBy"?"✎ Prepared By":"✎ Reviewed By")}</button>;
          })}
        </div>
      </div>
      <div style={{display:"flex",gap:16,marginTop:12,fontSize:10,color:C.faint,flexWrap:"wrap",paddingTop:8,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <span>Entity: <b style={{color:C.accentLight}}>{cfg.entityName}</b></span>
        <span>FYE: <b style={{color:C.dim}}>{cfg.fye}</b></span>
        <span>Partner: <b style={{color:C.dim}}>{cfg.partner||"TBD"}</b></span>
        <span>Firm: <b style={{color:C.dim}}>{cfg.firmName||"TBD"}</b></span>
        <span>Framework: <b style={{color:C.dim}}>{fw?.label}</b></span>
        <span>Materiality: <b style={{color:C.accentLight}}>£{cfg.materiality||"TBD"}</b></span>
      </div>
    </div>;
  };

  /* ─── ADD CUSTOM ITEM MODAL ─── */
  const AddModal = () => {
    if(!showAddModal) return null;
    const type = showAddModal;
    return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAddModal(null)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#151D30",border:"1px solid "+C.border,borderRadius:16,padding:32,width:500,maxWidth:"90vw"}}>
        <div style={{fontSize:16,color:C.text,fontWeight:700,marginBottom:16}}>Add Custom {type==="risk"?"Risk":type==="procedure"?"Procedure":"Test"}</div>
        {type==="risk" && <>
          <label style={lbl}>Risk Description</label>
          <textarea value={modalInput.text||""} onChange={e=>setModalInput(p=>({...p,text:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical",marginBottom:12}} placeholder="Describe the risk..." />
          <label style={lbl}>Risk Level</label>
          <select value={modalInput.level||"ELEVATED"} onChange={e=>setModalInput(p=>({...p,level:e.target.value}))} style={{...inp,marginBottom:12,cursor:"pointer"}}>
            <option value="SIGNIFICANT">Significant</option><option value="ELEVATED">Elevated</option><option value="NORMAL">Normal</option>
          </select>
          <label style={lbl}>ISA Reference</label>
          <input value={modalInput.isa||""} onChange={e=>setModalInput(p=>({...p,isa:e.target.value}))} style={{...inp,marginBottom:16}} placeholder="e.g. ISA 540" />
        </>}
        {type==="test" && <>
          <label style={lbl}>Test Procedure</label>
          <textarea value={modalInput.text||""} onChange={e=>setModalInput(p=>({...p,text:e.target.value}))} style={{...inp,minHeight:60,resize:"vertical",marginBottom:12}} placeholder="Describe the test..." />
          <label style={lbl}>Working Paper</label>
          <input value={modalInput.wp||""} onChange={e=>setModalInput(p=>({...p,wp:e.target.value}))} style={{...inp,marginBottom:16}} placeholder="e.g. D7" />
        </>}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={()=>{setShowAddModal(null);setModalInput({});}} style={{padding:"10px 20px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.border,color:C.dim,cursor:"pointer",fontSize:12}}>Cancel</button>
          <button onClick={()=>{
            if(type==="risk"&&modalInput.text) setCustomItems(p=>({...p,risks:[...p.risks,{id:"CR"+String(p.risks.length+1).padStart(2,"0"),text:modalInput.text,level:modalInput.level||"ELEVATED",isa:modalInput.isa||""}]}));
            if(type==="test"&&modalInput.text) setCustomItems(p=>({...p,tests:{...p.tests,[modalInput.wp||"d7"]:[...(p.tests[modalInput.wp||"d7"]||[]),modalInput.text]}}));
            setShowAddModal(null);setModalInput({});
          }} style={{padding:"10px 20px",borderRadius:8,background:C.accent,border:"none",color:"#000",cursor:"pointer",fontSize:12,fontWeight:700}}>Add</button>
        </div>
      </div>
    </div>;
  };

  /* ─── FSLI LEAD SCHEDULE (shown on top of testing WPs) ─── */
  const FSLILead = ({wp}) => {
    if(!wp.fsliKey || !ind?.fsli?.[wp.fsliKey]) return null;
    const baseLines = ind.fsli[wp.fsliKey].filter(l => l !== "N/A" && l !== "N/A for pure SaaS");
    const customLines = customItems.fsliLines?.[wp.id] || [];
    const allLines = [...baseLines, ...customLines];
    if(!allLines.length) return null;
    return <div style={{marginBottom:0,position:"relative"}}>
      <div style={{background:"linear-gradient(135deg, rgba(67,160,71,0.08), rgba(67,160,71,0.03))",border:"1px solid rgba(67,160,71,0.25)",borderRadius:"12px 12px 0 0",padding:"18px 20px",borderLeft:"4px solid "+C.lead,borderBottom:"2px dashed rgba(67,160,71,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg, #66BB6A, #43A047)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700}}>LS</div>
            <div>
              <div style={{fontSize:11,color:C.lead,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700}}>FSLI Lead Schedule — {wp.label}</div>
              <div style={{fontSize:9,color:C.faint,marginTop:1}}>Financial Statement Line Items → Traces to C2 (P&L) / C3 (Balance Sheet)</div>
            </div>
          </div>
          <button onClick={()=>{const name=prompt("Enter new FSLI line item name:");if(name)setCustomItems(p=>({...p,fsliLines:{...(p.fsliLines||{}),[wp.id]:[...(p.fsliLines?.[wp.id]||[]),name]}}));}} style={{padding:"5px 14px",borderRadius:6,background:"rgba(67,160,71,0.12)",border:"1px solid rgba(67,160,71,0.35)",color:C.lead,cursor:"pointer",fontSize:10,fontWeight:600}}>+ Add FSLI Line</button>
        </div>
        <ETable id={"fsli_"+wp.id} headers={["FSLI Line Item","PY (£)","CY (£)","Movement (£)","Movement %","Ref","Audit Status"]}
          rows={allLines.map(l=>[<span style={{color:C.text,fontWeight:500}}>{l}</span>,"","","","",wp.ref,""])}
          editable={[1,2,3,4,6]}
        />
        <div style={{marginTop:8,padding:"8px 12px",background:"rgba(67,160,71,0.05)",borderRadius:6,display:"flex",justifyContent:"space-between",fontSize:10}}>
          <span style={{color:C.lead,fontWeight:600}}>∑ {allLines.length} line items</span>
          <span style={{color:C.faint}}>PY/CY editable · Status tracks progress per line</span>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"center",background:"linear-gradient(180deg, rgba(67,160,71,0.04), rgba(251,140,0,0.04))",padding:"4px 0",borderLeft:"4px solid transparent",borderImage:"linear-gradient(180deg, "+C.lead+", "+C.testing+") 1"}}>
        <div style={{padding:"4px 16px",fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:C.lead}}>▲ LEAD</span><span style={{color:C.faint}}>─── traces to ───</span><span style={{color:C.testing}}>▼ TESTING</span>
        </div>
      </div>
    </div>;
  };

  /* ─── EXPORT ─── */
  const doExport = () => {
    if(!cfg.configured||!ind) return;
    const r = []; const add = (...c) => r.push(c.map(x=>'"'+String(x||'').replace(/"/g,'""')+'"').join(","));
    add("AUDIT WORKING PAPER FILE"); add("Entity:",cfg.entityName); add("Generated:","AuditEngine v9.0 — "+new Date().toISOString().slice(0,10));
    r.push(""); add("Industry:",ind.label); add("Sector:",cfg.sector); add("Framework:",fw?.label); add("Size:",sz?.label);
    add("FYE:",cfg.fye); add("Partner:",cfg.partner); add("Manager:",cfg.manager); add("Firm:",cfg.firmName);
    add("Materiality:","£"+cfg.materiality); add("Perf Materiality:","£"+cfg.perfMateriality); add("Trivial:","£"+cfg.trivial);
    r.push("");r.push("");
    // Risks
    add("═══ RISK ASSESSMENT ═══"); add("Ref","Risk","Level","ISA","Planned Response");
    [...ind.risks,...customItems.risks].forEach(x=>add(x.id,x.text,x.level,x.isa,x.response||""));
    r.push("");
    // FSLI Lead Schedules with user data
    add("═══ FSLI LEAD SCHEDULES ═══");
    WP_SECTIONS.filter(w=>w.fsliKey&&ind.fsli[w.fsliKey]).forEach(wp=>{
      add("--- "+wp.ref+" "+wp.label+" ---");
      add("Line Item","PY","CY","Movement","Movement %","Status");
      ind.fsli[wp.fsliKey].forEach((l,i)=>{
        add(l,getCell("fsli_"+wp.id,i,1),getCell("fsli_"+wp.id,i,2),getCell("fsli_"+wp.id,i,3),getCell("fsli_"+wp.id,i,4),getCell("fsli_"+wp.id,i,6));
      });
      r.push("");
    });
    // Procedures
    add("═══ AUDIT PROCEDURES ═══"); add("WP","Area","Procedure","Assertion","ISA","Result","Prepared","Reviewed");
    ind.procedures.forEach(x=>add(x.ref,x.area,x.proc,x.assertion,x.isa,"","",""));
    r.push("");
    // Test programmes with user data
    add("═══ TEST PROGRAMMES (with user inputs) ═══");
    Object.entries(ADD_TESTS).forEach(([ref,tests])=>{
      const allTests = [...tests,...(customItems.tests[ref]||[])];
      add("--- "+ref.toUpperCase()+" ---"); add("#","Test","Sample","Result","Exception","Prepared","Reviewed");
      allTests.forEach((t,i)=>add(ref.toUpperCase()+".S"+String(i+1).padStart(2,"0"),t,getCell("test_"+ref,i,2),getCell("test_"+ref,i,3),getCell("test_"+ref,i,4),getCell("test_"+ref,i,5),getCell("test_"+ref,i,6)));
      r.push("");
    });
    // KPIs, controls etc
    add("═══ KPIs ═══"); add("KPI","CY","PY","Movement","Comment");
    ind.kpis.forEach((k,i)=>add(k,getCell("kpi",i,1),getCell("kpi",i,2),getCell("kpi",i,3),getCell("kpi",i,4)));
    r.push("");
    add("═══ DISCLOSURES ═══"); ind.disclosures.forEach(d=>add(d,"",""));
    add("═══ CONTROLS ═══"); ind.controls.forEach(c=>add(c,"","",""));
    add("═══ GOING CONCERN ═══"); ind.goingConcern.forEach(g=>add(g,"",""));
    add("═══ LAWS & REGS ═══"); ind.laws.forEach(l=>add(l,"","",""));
    r.push("");
    add("═══ WP INDEX ═══"); add("Ref","WP","ISA","Status","Prepared","Reviewed","Notes");
    WP_SECTIONS.filter(w=>w.type!=="separator").forEach(w=>{
      const so=signOffs[w.id]||{};
      add(w.ref,w.label,w.isa||"",so.preparedBy?"Complete":"Open",so.preparedBy||"",so.reviewedBy||"",wpNotes[w.id]||"");
    });
    const blob = new Blob(["\uFEFF"+r.join("\n")],{type:"text/csv;charset=utf-8;"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=(cfg.entityName.replace(/[^a-zA-Z0-9]/g,"_")||"Audit")+"_"+cfg.fye.replace(/\//g,"-")+".csv";
    a.click();
  };

  const doExportExcel = () => {
    if(!cfg.configured||!ind) return;
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summary = [
      ["AUDIT WORKING PAPER FILE"],
      ["Entity:", cfg.entityName],
      ["Generated:", new Date().toISOString().slice(0,10)],
      [],
      ["Industry:", ind.label],
      ["Sector:", cfg.sector],
      ["Framework:", fw?.label],
      ["Size:", sz?.label],
      ["FYE:", cfg.fye],
      ["Partner:", cfg.partner],
      ["Manager:", cfg.manager],
      ["Firm:", cfg.firmName],
      ["Materiality:", "£"+cfg.materiality],
      ["Perf Materiality:", "£"+cfg.perfMateriality],
      ["Trivial:", "£"+cfg.trivial]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");

    // Risk Assessment sheet
    const risks = [["Ref","Risk","Level","ISA","Planned Response"]];
    [...ind.risks,...customItems.risks].forEach(x=>risks.push([x.id,x.text,x.level,x.isa,x.response||""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(risks), "Risk Assessment");

    // FSLI Lead Schedules sheet
    const fsli = [["FSLI LEAD SCHEDULES"]];
    WP_SECTIONS.filter(w=>w.fsliKey&&ind.fsli[w.fsliKey]).forEach(wp=>{
      fsli.push([]);
      fsli.push([wp.ref, wp.label]);
      fsli.push(["Line Item","PY","CY","Movement","Movement %","Status"]);
      ind.fsli[wp.fsliKey].forEach((l,i)=>{
        fsli.push([l,getCell("fsli_"+wp.id,i,1),getCell("fsli_"+wp.id,i,2),getCell("fsli_"+wp.id,i,3),getCell("fsli_"+wp.id,i,4),getCell("fsli_"+wp.id,i,6)]);
      });
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(fsli), "FSLI Lead Schedules");

    // Audit Procedures sheet
    const procs = [["WP","Area","Procedure","Assertion","ISA","Result","Prepared","Reviewed"]];
    ind.procedures.forEach(x=>procs.push([x.ref,x.area,x.proc,x.assertion,x.isa,"","",""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(procs), "Procedures");

    // Test Programmes sheet
    const tests = [["TEST PROGRAMMES (with user inputs)"]];
    Object.entries(ADD_TESTS).forEach(([ref,testList])=>{
      const allTests = [...testList,...(customItems.tests[ref]||[])];
      tests.push([]);
      tests.push([ref.toUpperCase()]);
      tests.push(["#","Test","Sample","Result","Exception","Prepared","Reviewed"]);
      allTests.forEach((t,i)=>tests.push([ref.toUpperCase()+".S"+String(i+1).padStart(2,"0"),t,getCell("test_"+ref,i,2),getCell("test_"+ref,i,3),getCell("test_"+ref,i,4),getCell("test_"+ref,i,5),getCell("test_"+ref,i,6)]));
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tests), "Test Programmes");

    // KPIs sheet
    const kpis = [["KPI","CY","PY","Movement","Comment"]];
    ind.kpis.forEach((k,i)=>kpis.push([k,getCell("kpi",i,1),getCell("kpi",i,2),getCell("kpi",i,3),getCell("kpi",i,4)]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(kpis), "KPIs");

    // Disclosures, Controls, Going Concern, Laws sheet
    const other = [
      ["DISCLOSURES"],...ind.disclosures.map(d=>[d]),
      [],["CONTROLS"],...ind.controls.map(c=>[c]),
      [],["GOING CONCERN"],...ind.goingConcern.map(g=>[g]),
      [],["LAWS & REGULATIONS"],...ind.laws.map(l=>[l])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(other), "Compliance");

    // WP Index sheet
    const index = [["Ref","WP","ISA","Status","Prepared","Reviewed","Notes"]];
    WP_SECTIONS.filter(w=>w.type!=="separator").forEach(w=>{
      const so=signOffs[w.id]||{};
      index.push([w.ref,w.label,w.isa||"",so.preparedBy?"Complete":"Open",so.preparedBy||"",so.reviewedBy||"",wpNotes[w.id]||""]);
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(index), "WP Index");

    XLSX.writeFile(wb, (cfg.entityName.replace(/[^a-zA-Z0-9]/g,"_")||"Audit")+"_"+cfg.fye.replace(/\//g,"-")+".xlsx");
  };

  const doExportWord = async () => {
    if(!cfg.configured||!ind) return;

    const sections = [];

    // Title and metadata
    sections.push(
      new Paragraph({text: "AUDIT WORKING PAPER FILE", bold: true, size: 28}),
      new Paragraph({text: "Entity: "+cfg.entityName, size: 20}),
      new Paragraph({text: "Generated: "+new Date().toISOString().slice(0,10), size: 20}),
      new Paragraph({text: ""})
    );

    // Configuration
    sections.push(
      new Paragraph({text: "CONFIGURATION", bold: true, size: 24}),
      new Table({
        rows: [
          new TableRow({cells: [new TableCell({children: [new Paragraph("Industry")]}), new TableCell({children: [new Paragraph(ind.label)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Sector")]}), new TableCell({children: [new Paragraph(cfg.sector)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Framework")]}), new TableCell({children: [new Paragraph(fw?.label)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Size")]}), new TableCell({children: [new Paragraph(sz?.label)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("FYE")]}), new TableCell({children: [new Paragraph(cfg.fye)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Partner")]}), new TableCell({children: [new Paragraph(cfg.partner)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Manager")]}), new TableCell({children: [new Paragraph(cfg.manager)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Firm")]}), new TableCell({children: [new Paragraph(cfg.firmName)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Materiality")]}), new TableCell({children: [new Paragraph("£"+cfg.materiality)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Perf Materiality")]}), new TableCell({children: [new Paragraph("£"+cfg.perfMateriality)]})]}),
          new TableRow({cells: [new TableCell({children: [new Paragraph("Trivial")]}), new TableCell({children: [new Paragraph("£"+cfg.trivial)]})]}),
        ]
      }),
      new Paragraph({text: ""})
    );

    // Risk Assessment
    sections.push(new Paragraph({text: "RISK ASSESSMENT", bold: true, size: 24}));
    const riskRows = [new TableRow({cells: [new TableCell({children: [new Paragraph("Ref")]}), new TableCell({children: [new Paragraph("Risk")]}), new TableCell({children: [new Paragraph("Level")]}), new TableCell({children: [new Paragraph("ISA")]}), new TableCell({children: [new Paragraph("Response")]})]}), ];
    [...ind.risks,...customItems.risks].forEach(x=>{
      riskRows.push(new TableRow({cells: [new TableCell({children: [new Paragraph(x.id)]}), new TableCell({children: [new Paragraph(x.text)]}), new TableCell({children: [new Paragraph(x.level)]}), new TableCell({children: [new Paragraph(x.isa)]}), new TableCell({children: [new Paragraph(x.response||"")]})]}));
    });
    sections.push(new Table({rows: riskRows}), new Paragraph({text: ""}));

    // WP Index
    sections.push(new Paragraph({text: "WORKING PAPER INDEX", bold: true, size: 24}));
    const wpRows = [new TableRow({cells: [new TableCell({children: [new Paragraph("Ref")]}), new TableCell({children: [new Paragraph("WP")]}), new TableCell({children: [new Paragraph("ISA")]}), new TableCell({children: [new Paragraph("Status")]}), new TableCell({children: [new Paragraph("Prepared")]}), new TableCell({children: [new Paragraph("Reviewed")]}), new TableCell({children: [new Paragraph("Notes")]})]}), ];
    WP_SECTIONS.filter(w=>w.type!=="separator").forEach(w=>{
      const so=signOffs[w.id]||{};
      wpRows.push(new TableRow({cells: [new TableCell({children: [new Paragraph(w.ref)]}), new TableCell({children: [new Paragraph(w.label)]}), new TableCell({children: [new Paragraph(w.isa||"")]}), new TableCell({children: [new Paragraph(so.preparedBy?"Complete":"Open")]}), new TableCell({children: [new Paragraph(so.preparedBy||"")]}), new TableCell({children: [new Paragraph(so.reviewedBy||"")]}), new TableCell({children: [new Paragraph(wpNotes[w.id]||"")]})]}));
    });
    sections.push(new Table({rows: wpRows}));

    const doc = new Document({sections: [{children: sections}]});
    const blob = await Packer.toBlob(doc);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (cfg.entityName.replace(/[^a-zA-Z0-9]/g,"_")||"Audit")+"_"+cfg.fye.replace(/\//g,"-")+".docx";
    a.click();
  };

  /* ─── WP BODY RENDERERS ─── */
  const renderBody = (wp) => {
    if(!ind) return null;

    // PLANNING
    if(wp.id==="a1") return <div><SecTitle t={"Engagement Letter — "+wp.isa} color={C.planning} /><div style={{background:C.card,borderRadius:10,padding:24,border:"1px solid "+C.border}}><div style={{fontSize:14,color:C.dim,lineHeight:1.9}}><p><b style={{color:C.text}}>To:</b> The Board of Directors of <b style={{color:C.accentLight}}>{cfg.entityName}</b></p><p style={{marginTop:12}}>We confirm our engagement to audit the financial statements for the year ended <b style={{color:C.accentLight}}>{cfg.fye}</b> prepared under <b style={{color:C.accentLight}}>{fw?.label}</b>.</p><p style={{marginTop:8}}>The audit will be conducted in accordance with International Standards on Auditing (UK) and applicable law. The engagement partner is <b style={{color:C.accentLight}}>{cfg.partner||"[TBD]"}</b> of <b style={{color:C.accentLight}}>{cfg.firmName||"[TBD]"}</b>.</p><p style={{marginTop:8}}>As a <b style={{color:C.accentLight}}>{ind.label}</b> entity ({cfg.sector}), classified as <b style={{color:C.accentLight}}>{sz?.label}</b>, our audit approach addresses sector-specific risks including:</p><p style={{marginTop:4,color:C.dim}}>{ind.risks.slice(0,3).map(r=>r.text).join("; ")}.</p></div></div></div>;

    if(wp.id==="a2") return <div><SecTitle t="Client Acceptance — ISA 220" color={C.planning} /><ETable id="a2" headers={["Factor","Assessment","Evidence","Conclusion"]} rows={[["Independence","","ICAEW Code of Ethics",""],["Competence & resources","","Sector: "+ind.label,""],["Management integrity","","Director searches",""],["AML compliance","","MLR 2017 CDD",""],["Ethical considerations","","",""],["Predecessor auditor","","ISA 510",""],["Engagement risk","","",""],["Fee agreement","","",""]]} editable={[1,2,3]} /></div>;

    if(wp.id==="a3") return <div><SecTitle t="Audit Strategy — ISA 300" color={C.planning} /><div style={{background:"rgba(21,101,192,0.06)",borderRadius:10,padding:16,border:"1px solid rgba(21,101,192,0.2)",marginBottom:16,fontSize:13,color:C.dim,lineHeight:1.8}}><b style={{color:C.text}}>Entity:</b> {cfg.entityName} · <b style={{color:C.text}}>Industry:</b> {ind.label} — {cfg.sector} · <b style={{color:C.text}}>Framework:</b> {fw?.label} · <b style={{color:C.text}}>Size:</b> {sz?.label}<br/><b style={{color:C.accentLight}}>Materiality:</b> £{cfg.materiality||"TBD"} · <b style={{color:C.accentLight}}>Perf Mat:</b> £{cfg.perfMateriality||"TBD"} · <b style={{color:C.accentLight}}>Trivial:</b> £{cfg.trivial||"TBD"}</div><SecTitle t="Audit Approach by FS Area" color={C.planning} /><ETable id="a3" headers={["Area","Approach","Key Risk","WP Ref","Planned Hours"]} rows={ind.procedures.map(p=>[p.area,"Substantive",p.proc.slice(0,65)+"...",p.ref,""])} editable={[1,4]} /></div>;

    if(wp.id==="a4") return <div><SecTitle t="Materiality — ISA 320" color={C.planning} /><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>{[{l:"Overall Materiality",v:"£"+(cfg.materiality||"—"),d:"ISA 320.10",c:C.accent},{l:"Performance Materiality",v:"£"+(cfg.perfMateriality||"—"),d:"ISA 320.11",c:C.blue},{l:"Trivial Threshold",v:"£"+(cfg.trivial||"—"),d:"ISA 450.A2",c:C.green}].map((m,i)=><div key={i} style={{padding:24,borderRadius:12,background:"linear-gradient(135deg, "+m.c+"12, "+m.c+"06)",border:"1px solid "+m.c+"33",textAlign:"center"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:m.c,fontWeight:700}}>{m.v}</div><div style={{fontSize:11,color:C.dim,marginTop:6,fontWeight:600}}>{m.l}</div><div style={{fontSize:9,color:C.faint,marginTop:2}}>{m.d}</div></div>)}</div><ETable id="a4" headers={["Benchmark","Amount (£)","% Applied","Materiality (£)","Basis / Rationale"]} rows={[["Revenue","","5%","","Most common for "+ind.label],["Gross profit","","5-10%","",""],["Total assets","","1-2%","",""],["Net assets","","2-5%","",""],["PBT","","5-10%","",""]]} editable={[1,2,3,4]} /></div>;

    if(wp.id==="a5") return <div><SecTitle t={"Understanding — ISA 315 · "+ind.label} color={C.planning} /><SecTitle t="Industry KPIs — ISA 520" color={C.blue} /><ETable id="kpi" headers={["KPI","Current Year","Prior Year","Movement %","Commentary"]} rows={ind.kpis.map(k=>[<span style={{color:C.text,fontWeight:500}}>{k}</span>,"","","",""])} editable={[1,2,3,4]} /><div style={{marginTop:20}}><SecTitle t="Key Controls" color={C.blue} /></div><ETable id="a5c" headers={["Control","Design Effective","Operating Effective","Reliance?","Evidence"]} rows={ind.controls.map(c=>[c,"","","",""])} editable={[1,2,3,4]} /></div>;

    if(wp.id==="a6") return <div><SecTitle t="Fraud Risk — ISA 240" color={C.red} /><div style={{background:"rgba(239,83,80,0.06)",border:"1px solid rgba(239,83,80,0.2)",borderRadius:10,padding:16,marginBottom:20,borderLeft:"4px solid "+C.red}}><div style={{fontSize:11,color:C.red,fontWeight:700,marginBottom:4}}>⚠ ISA 240.26 — PRESUMED RISK</div><div style={{fontSize:13,color:C.dim}}>Revenue recognition is a presumed fraud risk for <b style={{color:C.text}}>{cfg.entityName}</b> ({ind.label}). Management override of controls is also presumed (ISA 240.31).</div></div><ETable id="a6" headers={["Risk","Industry Factor","Risk Level","Planned Response","WP Ref"]} rows={ind.risks.filter(r=>r.level==="SIGNIFICANT").map(r=>[r.text,ind.label,<Badge level="SIGNIFICANT" />,r.response||"",""])} editable={[3,4]} /></div>;

    if(wp.id==="a7") return <div><SecTitle t="Going Concern — ISA 570" color={C.planning} /><ETable id="a7" headers={["Indicator","Assessment","Evidence Obtained","Conclusion"]} rows={ind.goingConcern.map(g=>[<span style={{color:C.text}}>{g}</span>,"","",""])} editable={[1,2,3]} /></div>;

    if(wp.id==="a8") return <div><SecTitle t="Planning Analytical Review — ISA 520" color={C.planning} /><ETable id="a8" headers={["Line Item","CY (£)","PY (£)","Movement (£)","Movement %","Expectation","Commentary"]} rows={["Revenue","Cost of sales","Gross profit","Admin expenses","Operating profit","Interest","Tax","Net profit","","Fixed assets","Current assets","Current liabilities","Long-term liabilities","Net assets"].map(l=>[<span style={{color:C.text,fontWeight:l.includes("profit")||l==="Net assets"?600:400}}>{l}</span>,"","","","","",""])} editable={[1,2,3,4,5,6]} /></div>;

    if(wp.id==="a9") return <div><SecTitle t="Laws & Regulations — ISA 250" color={C.planning} /><ETable id="a9" headers={["Law / Regulation","Category","Compliance Status","Impact Assessment","Evidence"]} rows={ind.laws.map(l=>[<span style={{color:C.text}}>{l}</span>,l.includes("Companies")?"Direct":"Indirect","","",""])} editable={[2,3,4]} /></div>;

    if(wp.id==="a10") return <div><SecTitle t="Group Audit — ISA 600" color={C.planning} /><ETable id="a10" headers={["Consideration","Assessment","Response / Action"]} rows={[["Group structure complexity","",""],["Component auditors involved","",""],["Intercompany transactions","",""],["Consolidation adjustments","",""],["Group materiality allocation","",""],["Component audit instructions","",""]]} editable={[1,2]} /></div>;

    // RISK
    if(wp.id==="b1") return <div><SecTitle t={"Risk Matrix — "+ind.label} color={C.risk} /><ETable id="b1" headers={["Ref","Risk Factor","Inherent Risk","Control Risk","Detection Risk","Combined","ISA","Response"]} rows={[...ind.risks,...customItems.risks].map(r=>[<span style={{fontFamily:"monospace",color:C.accent,fontWeight:700}}>{r.id}</span>,<span style={{color:C.text}}>{r.text}</span>,<Badge level={r.level} />,"","","",<span style={{fontSize:10,fontStyle:"italic"}}>{r.isa}</span>,r.response||""])} editable={[3,4,5,7]} /><button onClick={()=>setShowAddModal("risk")} style={{marginTop:12,padding:"8px 20px",borderRadius:8,background:C.accentBg,border:"1px solid "+C.accent+"44",color:C.accent,cursor:"pointer",fontSize:11,fontWeight:600}}>+ Add Custom Risk</button></div>;

    if(wp.id==="b2") return <div><SecTitle t="Controls — ISA 315.14" color={C.risk} /><ETable id="b2" headers={["Control Area","Description","Design Effective?","Operating Effective?","Test Method","Evidence","Reliance?"]} rows={ind.controls.map(c=>[ind.label,c,"","","","",""])} editable={[2,3,4,5,6]} /></div>;

    if(wp.id==="b3") return <div><SecTitle t="Significant Risks — ISA 315.28" color={C.risk} /><ETable id="b3" headers={["Risk","Why Significant","Planned Response","WP Ref","Conclusion"]} rows={ind.risks.filter(r=>r.level==="SIGNIFICANT").map(r=>[<span style={{color:C.text}}>{r.text}</span>,"Inherent complexity; estimation uncertainty",r.response||"",r.isa,""])} editable={[1,2,3,4]} /></div>;

    // LEAD SCHEDULES
    const leads = {
      c1:{t:"Trial Balance",h:["Code","Account Name","PY (£)","CY (£)","Movement (£)","Lead Ref","Comment"],e:[0,1,2,3,4,5,6]},
      c2:{t:"P&L Lead Schedule",h:["Line Item","PY (£)","CY (£)","Movement (£)","Movement %","WP Ref","Status"],r:[["Revenue","","","","","D1",""],["Cost of sales","","","","","D3",""],["Gross profit","","","","","",""],["Admin expenses","","","","","D5",""],["Depreciation","","","","","D7",""],["Interest payable","","","","","D11",""],["Tax charge","","","","","D13",""],["Net profit","","","","","",""]],e:[1,2,3,4,6]},
      c3:{t:"Balance Sheet Lead",h:["Line Item","PY (£)","CY (£)","Movement (£)","Movement %","WP Ref","Status"],r:[["Fixed assets (NBV)","","","","","D7/C5",""],["Intangible assets","","","","","D8",""],["Investments","","","","","D9",""],["Inventory / WIP","","","","","D3",""],["Trade receivables","","","","","D2",""],["Cash & bank","","","","","D6",""],["Trade payables","","","","","D4",""],["Other creditors","","","","","D4",""],["Taxation","","","","","D13",""],["Loans & borrowings","","","","","D11/C7",""],["Provisions","","","","","D12/C8",""],["Share capital","","","","","D10/C6",""],["Retained earnings","","","","","D10/C6",""]],e:[1,2,3,4,6]},
      c4:{t:"Journal Entry Testing — ISA 240.33",h:["Journal #","Date","Description","Dr (£)","Cr (£)","Posted By","Risk Indicator","Result"],e:[0,1,2,3,4,5,6,7]},
      c5:{t:"Fixed Assets Lead",h:["Asset Class","PY NBV (£)","Additions (£)","Disposals (£)","Depreciation (£)","Revaluation (£)","CY NBV (£)","WP Ref"],r:[["Freehold","","","","","","","D7"],["Leasehold improvements","","","","","","","D7"],["Plant & machinery","","","","","","","D7"],["Motor vehicles","","","","","","","D7"],["Office equipment","","","","","","","D7"],["ROU assets (IFRS 16)","","","","","","","D14"]],e:[1,2,3,4,5,6]},
      c6:{t:"Equity & Reserves Lead",h:["Component","PY (£)","Movements In (£)","Movements Out (£)","CY (£)","WP Ref","Comment"],r:[["Share capital","","","","","D10",""],["Share premium","","","","","D10",""],["Retained earnings","","","","","D10",""],["Revaluation reserve","","","","","D7",""],["Other reserves","","","","","D10",""]],e:[1,2,3,4,6]},
      c7:{t:"Loans & Borrowings Lead",h:["Lender","Facility (£)","Drawn (£)","Rate %","Maturity","Security","Covenant Status","Current/Non-current"],r:[["Bank overdraft","","","","","","","Current"],["Term loan 1","","","","","","",""],["HP / finance lease","","","","","","",""],["Directors loan","","","","","","",""]],e:[1,2,3,4,5,6,7]},
      c8:{t:"Provisions Lead",h:["Provision Type","PY (£)","Charge (£)","Utilised (£)","Released (£)","CY (£)","Basis","WP Ref"],r:[["Warranty/defects","","","","","","FRS 102 s21","D12"],["Dilapidations","","","","","","FRS 102 s21","D12"],["Legal claims","","","","","","FRS 102 s21","D12"],["Deferred tax","","","","","","FRS 102 s29","D13"],["Other","","","","","","","D12"]],e:[1,2,3,4,5]}
    };
    if(leads[wp.id]) {
      const l=leads[wp.id];
      const defaultRows = l.r || [["","","","","","","",""]];
      return <div><SecTitle t={l.t} color={C.lead} /><ETable id={wp.id} headers={l.h} rows={defaultRows} editable={l.e} /></div>;
    }

    // TESTING PROGRAMMES — with FSLI lead on top
    if(wp.type==="testing") {
      const procs = ind.procedures.filter(p=>p.ref===wp.ref);
      const addT = [...(ADD_TESTS[wp.id]||[]),...(customItems.tests[wp.id]||[])];
      return <div>
        <FSLILead wp={wp} />
        <div style={{background:"linear-gradient(135deg, rgba(251,140,0,0.08), rgba(251,140,0,0.03))",border:"1px solid rgba(251,140,0,0.25)",borderRadius:wp.fsliKey?"0 0 12px 12px":"12px",padding:"18px 20px",borderLeft:"4px solid "+C.testing,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg, #FFA726, #FB8C00)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700}}>TP</div>
          <div>
            <div style={{fontSize:11,color:C.testing,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700}}>Testing Programme — {wp.label}</div>
            <div style={{fontSize:9,color:C.faint}}>{ind.label} · {cfg.sector} · {wp.isa}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:16}}>
          {[{l:"ISA Ref",v:wp.isa,c:C.blue},{l:"Materiality",v:"£"+(cfg.materiality||"TBD"),c:C.accent},{l:"Perf Mat",v:"£"+(cfg.perfMateriality||"TBD"),c:C.teal||C.blue},{l:"Trivial",v:"£"+(cfg.trivial||"TBD"),c:C.green}].map((m,i)=><div key={i} style={{padding:"8px 12px",borderRadius:6,background:m.c+"0D",border:"1px solid "+m.c+"33",textAlign:"center"}}>
            <div style={{fontSize:9,color:m.c,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{m.l}</div>
            <div style={{fontSize:13,color:C.text,fontWeight:600,marginTop:2}}>{m.v}</div>
          </div>)}
        </div>
        {procs.length>0 && <><SecTitle t="Industry-Specific Procedures" color={C.orange} /><ETable id={"proc_"+wp.id} headers={["#","Procedure","Assertion","ISA Ref","Sample","Result","Prepared","Reviewed"]} rows={procs.map((p,i)=>[<span style={{fontFamily:"monospace",color:C.accent,fontWeight:700}}>{wp.ref}.{String(i+1).padStart(2,"0")}</span>,<span style={{color:C.text}}>{p.proc}</span>,<span style={{fontSize:10}}>{p.assertion}</span>,<span style={{fontSize:10,fontStyle:"italic",color:C.faint}}>{p.isa}</span>,"","","",""])} editable={[4,5,6,7]} /></>}
        {addT.length>0 && <div style={{marginTop:20}}><SecTitle t="Standard Test Programme" color={C.orange} /><ETable id={"test_"+wp.id} headers={["#","Test Procedure","Sample","Result","Exception","Prepared","Reviewed"]} rows={addT.map((t,i)=>[<span style={{fontFamily:"monospace",color:C.accent,fontWeight:700}}>{wp.ref}.S{String(i+1).padStart(2,"0")}</span>,<span style={{color:C.text}}>{t}</span>,"","","","",""])} editable={[2,3,4,5,6]} /></div>}
        <button onClick={()=>{setModalInput({wp:wp.id});setShowAddModal("test");}} style={{marginTop:12,padding:"8px 20px",borderRadius:8,background:C.accentBg,border:"1px solid "+C.accent+"44",color:C.accent,cursor:"pointer",fontSize:11,fontWeight:600}}>+ Add Custom Test</button>
        </div>
      </div>;
    }

    // COMPLETION
    if(wp.id==="e1") return <div><SecTitle t="Completion Checklist — ISA 220" color={C.completion} /><ETable id="e1" headers={["#","Checklist Item","ISA Ref","Completed?","Date","Comment"]} rows={[["1","All planned procedures performed","ISA 330","","",""],["2","Sufficient appropriate evidence obtained","ISA 500","","",""],["3","Materiality reassessed at completion","ISA 320.12","","",""],["4","Going concern conclusion reached","ISA 570","","",""],["5","Subsequent events reviewed to report date","ISA 560","","",""],["6","Related party procedures completed","ISA 550","","",""],["7","Written representations obtained","ISA 580","","",""],["8","Unadjusted differences reviewed","ISA 450","","",""],["9","EQCR performed (if applicable)","ISQM 1","","",""],["10","Audit report form and content approved","ISA 700","","",""],["11","File assembly completed (60-day rule)","ISA 230","","",""],["12","Engagement partner sign-off","ISA 220","","",""]]} editable={[3,4,5]} /></div>;
    if(wp.id==="e2") return <div><SecTitle t="Final Analytical Review — ISA 520.6" color={C.completion} /><div style={{background:C.completion+"12",borderLeft:"4px solid "+C.completion,padding:14,borderRadius:6,marginBottom:16,fontSize:12,color:C.dim}}>Purpose: Form overall conclusion that financial statements are consistent with our understanding of {cfg.entityName}.</div><ETable id="e2" headers={["Ratio / Metric","CY","PY","Industry Avg","Commentary","Consistent?"]} rows={ind.kpis.map(k=>[<span style={{color:C.text}}>{k}</span>,"","","","",""])} editable={[1,2,3,4,5]} /></div>;
    if(wp.id==="e3") return <div><SecTitle t="Subsequent Events — ISA 560" color={C.completion} /><ETable id="e3" headers={["Date","Event Description","Type","Adjusting?","Impact (£)","FS Impact","Action Taken"]} rows={[["","","","","","",""],["","","","","","",""],["","","","","","",""]]} editable={[0,1,2,3,4,5,6]} /><div style={{marginTop:12,fontSize:11,color:C.dim}}>Review period: {cfg.fye} to date of audit report signing. Consider events specific to {ind.label} sector.</div></div>;
    if(wp.id==="e4") return <div><SecTitle t="Written Representations — ISA 580" color={C.completion} /><ETable id="e4" headers={["#","Representation","ISA Ref","Included?","N/A?"]} rows={[["1","Responsibility for FS preparation","ISA 580.10","",""],["2","All transactions recorded and reflected","ISA 580.11","",""],["3","Fraud involving management or employees disclosed","ISA 240","",""],["4","Related party transactions disclosed","ISA 550","",""],["5","Going concern — no material uncertainties beyond disclosed","ISA 570","",""],["6","Subsequent events appropriately reflected","ISA 560","",""],["7","Compliance with laws and regulations","ISA 250","",""],["8","Provisions and contingent liabilities complete","FRS 102 s21","",""],["9","Title to assets confirmed; liabilities complete","","",""],["10","Industry-specific: "+ind.label+" sector representations","","",""]]} editable={[3,4]} /></div>;
    if(wp.id==="e5") return <div><SecTitle t="Summary of Differences — ISA 450" color={C.completion} /><div style={{display:"flex",gap:16,marginBottom:16}}>{[{l:"Trivial",v:"£"+(cfg.trivial||"—"),c:C.green},{l:"Materiality",v:"£"+(cfg.materiality||"—"),c:C.accent},{l:"Perf Materiality",v:"£"+(cfg.perfMateriality||"—"),c:C.blue}].map((m,i)=><div key={i} style={{padding:"8px 16px",borderRadius:8,background:m.c+"12",border:"1px solid "+m.c+"33",fontSize:12}}><span style={{color:m.c,fontWeight:600}}>{m.l}: {m.v}</span></div>)}</div><ETable id="e5" headers={["#","Description","Dr (£)","Cr (£)","WP Ref","FS Impact","Adjusted?"]} rows={[["1","","","","","",""],["2","","","","","",""],["3","","","","","",""],["4","","","","","",""],["5","","","","","",""]]} editable={[1,2,3,4,5,6]} /></div>;
    if(wp.id==="e6") return <div><SecTitle t="Completion Memo — ISA 230" color={C.completion} /><div style={{background:C.card,borderRadius:10,padding:24,border:"1px solid "+C.border,fontSize:14,color:C.dim,lineHeight:1.9}}><p><b style={{color:C.text}}>Entity:</b> {cfg.entityName} · <b style={{color:C.text}}>FYE:</b> {cfg.fye}</p><p><b style={{color:C.text}}>Industry:</b> {ind.label} — {cfg.sector} · <b style={{color:C.text}}>Framework:</b> {fw?.label}</p><p><b style={{color:C.text}}>Materiality:</b> £{cfg.materiality||"TBD"} · <b style={{color:C.text}}>Perf Mat:</b> £{cfg.perfMateriality||"TBD"}</p><p style={{marginTop:16}}><b style={{color:C.accent}}>Significant audit matters:</b></p><textarea value={wpNotes["e6_matters"]||""} onChange={e=>setWpNotes(p=>({...p,e6_matters:e.target.value}))} style={{...inp,minHeight:80,marginTop:4}} placeholder="Document significant matters arising from the audit..." /><p style={{marginTop:16}}><b style={{color:C.accent}}>Audit opinion:</b></p><textarea value={wpNotes["e6_opinion"]||""} onChange={e=>setWpNotes(p=>({...p,e6_opinion:e.target.value}))} style={{...inp,minHeight:60,marginTop:4}} placeholder="True and fair / Modified — detail basis..." /></div></div>;

    // REPORTING
    if(wp.id==="f1") return <div><SecTitle t="Management Letter — ISA 265" color={C.reporting} /><div style={{background:C.card,borderRadius:10,padding:24,border:"1px solid "+C.border,marginBottom:16,fontSize:14,color:C.dim,lineHeight:1.9}}>Dear Directors of <b style={{color:C.accentLight}}>{cfg.entityName}</b>,<br/><br/>Following our audit of the financial statements for the year ended <b style={{color:C.accentLight}}>{cfg.fye}</b>, we write to bring the following matters to your attention. These matters do not modify our audit opinion.</div><ETable id="f1" headers={["#","Finding","Risk Rating","Recommendation","Management Response","Agreed Deadline"]} rows={[["1","","","","",""],["2","","","","",""],["3","","","","",""],["4","","","","",""],["5","","","","",""]]} editable={[1,2,3,4,5]} /></div>;
    if(wp.id==="f2") return <div><SecTitle t="Audit Report — ISA 700" color={C.reporting} /><div style={{background:C.card,borderRadius:10,padding:24,border:"1px solid "+C.border,fontSize:14,color:C.dim,lineHeight:1.9}}><p style={{textAlign:"center",fontWeight:700,color:C.text,fontSize:16,marginBottom:4}}>INDEPENDENT AUDITOR'S REPORT</p><p style={{textAlign:"center",marginBottom:16}}>To the members of <b style={{color:C.accentLight}}>{cfg.entityName}</b></p><p><b style={{color:C.accent}}>Opinion</b></p><p>We have audited the financial statements of {cfg.entityName} for the year ended {cfg.fye} which comprise the statement of comprehensive income, the balance sheet, the statement of changes in equity, the statement of cash flows, and related notes. The financial reporting framework that has been applied is applicable law and {fw?.label}.</p><p style={{marginTop:12}}>In our opinion the financial statements:</p><p style={{marginLeft:16}}>• give a true and fair view of the state of the company's affairs as at {cfg.fye} and of its profit/loss for the year then ended;</p><p style={{marginLeft:16}}>• have been properly prepared in accordance with {fw?.label}; and</p><p style={{marginLeft:16}}>• have been prepared in accordance with the requirements of the Companies Act 2006.</p><p style={{marginTop:16}}><b style={{color:C.accent}}>Basis for opinion</b></p><p>We conducted our audit in accordance with International Standards on Auditing (UK) (ISAs (UK)) and applicable law.</p></div></div>;

    // TRAIL MAP
    if(wp.id==="z1") return <div><SecTitle t="Audit Trail Map — Complete Index" color={C.accent} /><ETable id="z1" headers={["Ref","Working Paper","ISA","Type","Status","Prepared","Reviewed"]} rows={WP_SECTIONS.filter(w=>w.type!=="separator").map(w=>{const so=signOffs[w.id]||{};const done=so.preparedBy&&so.reviewedBy;return[<span style={{fontFamily:"monospace",color:C.accent,fontWeight:700}}>{w.ref}</span>,w.label,w.isa||"—",<span style={{color:w.type==="planning"?C.planning:w.type==="risk"?C.risk:w.type==="lead"?C.lead:w.type==="testing"?C.testing:w.type==="completion"?C.completion:C.accent,fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{w.type}</span>,<span style={{color:done?C.green:so.preparedBy?C.orange:C.faint}}>{done?"✓ Complete":so.preparedBy?"◐ In Progress":"○ Open"}</span>,so.preparedBy||"",so.reviewedBy||""];})} editable={[]} /></div>;

    return <div style={{color:C.dim,padding:20}}>Working paper template ready.</div>;
  };

  /* --- DASHBOARD --- */
  const Dashboard = () => {
    if(!cfg.configured) return <div style={{animation:"fadeUp 0.6s ease-out"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:48,marginBottom:8}}>&#x26A1;</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:300,color:C.text,marginBottom:8}}>Audit<span style={{color:C.accent,fontWeight:700}}>Engine</span> <span style={{fontSize:20,color:C.faint}}>v9</span></h1>
        <p style={{fontSize:14,color:C.dim,maxWidth:500,margin:"0 auto"}}>Professional audit automation. 47 working papers, 8 industries, full ISA compliance. Configure your engagement to begin.</p>
      </div>
      <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:16,padding:32,maxWidth:800,margin:"0 auto"}}>
        <SecTitle t="Engagement Configuration" />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div><label style={lbl}>Industry *</label><select value={cfg.industry} onChange={e=>{upd("industry",e.target.value);upd("sector","");}} style={{...inp,cursor:"pointer"}}><option value="">Select industry...</option>{Object.entries(INDUSTRIES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}</select></div>
          <div><label style={lbl}>Sector *</label><select value={cfg.sector} onChange={e=>upd("sector",e.target.value)} style={{...inp,cursor:"pointer"}} disabled={!cfg.industry}><option value="">Select sector...</option>{cfg.industry && INDUSTRIES[cfg.industry].sectors.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
          <div><label style={lbl}>Framework *</label><select value={cfg.framework} onChange={e=>upd("framework",e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Select framework...</option>{Object.entries(FRAMEWORKS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
          <div><label style={lbl}>Entity Size *</label><select value={cfg.entitySize} onChange={e=>{upd("entitySize",e.target.value);if(!cfg.framework&&ENTITY_SIZES[e.target.value])upd("framework",ENTITY_SIZES[e.target.value].framework);}} style={{...inp,cursor:"pointer"}}><option value="">Select size...</option>{Object.entries(ENTITY_SIZES).map(([k,v])=><option key={k} value={k}>{v.label} ({v.turnover})</option>)}</select></div>
          <div><label style={lbl}>Entity Name *</label><input value={cfg.entityName} onChange={e=>upd("entityName",e.target.value)} style={inp} placeholder="e.g. Duglas Alliance Ltd" /></div>
          <div><label style={lbl}>Financial Year End *</label><input value={cfg.fye} onChange={e=>upd("fye",e.target.value)} style={inp} placeholder="e.g. 28/02/2025" /></div>
          <div><label style={lbl}>Audit Firm</label><input value={cfg.firmName} onChange={e=>upd("firmName",e.target.value)} style={inp} placeholder="e.g. Christiansons Ltd" /></div>
          <div><label style={lbl}>Engagement Partner</label><input value={cfg.partner} onChange={e=>upd("partner",e.target.value)} style={inp} placeholder="e.g. C A Joannou" /></div>
          <div><label style={lbl}>Audit Manager</label><input value={cfg.manager} onChange={e=>upd("manager",e.target.value)} style={inp} placeholder="Audit manager name" /></div>
          <div><label style={lbl}>Overall Materiality</label><input value={cfg.materiality} onChange={e=>upd("materiality",e.target.value)} style={inp} placeholder="e.g. 50000" /></div>
          <div><label style={lbl}>Performance Materiality</label><input value={cfg.perfMateriality} onChange={e=>upd("perfMateriality",e.target.value)} style={inp} placeholder="e.g. 37500" /></div>
          <div><label style={lbl}>Trivial Threshold</label><input value={cfg.trivial} onChange={e=>upd("trivial",e.target.value)} style={inp} placeholder="e.g. 2500" /></div>
        </div>
        <div style={{marginTop:24,textAlign:"center"}}>
          <button onClick={()=>{if(cfg.industry&&cfg.sector&&cfg.framework&&cfg.entitySize&&cfg.entityName&&cfg.fye)upd("configured",true);}} disabled={!(cfg.industry&&cfg.sector&&cfg.framework&&cfg.entitySize&&cfg.entityName&&cfg.fye)} style={{padding:"14px 40px",borderRadius:10,border:"none",cursor:cfg.industry&&cfg.sector&&cfg.framework&&cfg.entitySize&&cfg.entityName&&cfg.fye?"pointer":"not-allowed",background:cfg.industry&&cfg.sector?"linear-gradient(135deg, "+C.accent+", "+C.accentLight+")":"rgba(255,255,255,0.05)",color:cfg.industry&&cfg.sector?"#000":"rgba(255,255,255,0.2)",fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",transition:"all 0.3s"}}>
            Save Configuration
          </button>
        </div>
      </div>
    </div>;

    return <div style={{animation:"fadeUp 0.5s ease-out"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:C.text,margin:0}}>{cfg.entityName}</h1>
          <div style={{fontSize:12,color:C.dim,marginTop:4}}>{ind?.icon} {ind?.label} -- {cfg.sector} | {fw?.label} | {sz?.label}</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={()=>upd("configured",false)} style={{padding:"10px 20px",borderRadius:8,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.border,color:C.dim,cursor:"pointer",fontSize:11,fontWeight:600}}>Edit Config</button>
          <button onClick={doExport} style={{padding:"10px 24px",borderRadius:8,background:C.blue+"30",border:"1px solid "+C.blue+"60",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>📊 CSV Export</button>
          <button onClick={doExportExcel} style={{padding:"10px 24px",borderRadius:8,background:C.green+"30",border:"1px solid "+C.green+"60",color:C.green,fontSize:12,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>📑 Excel Export</button>
          <button onClick={doExportWord} style={{padding:"10px 24px",borderRadius:8,background:C.purple+"30",border:"1px solid "+C.purple+"60",color:C.purple,fontSize:12,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>📄 Word Export</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:24}}>
        {[
          {l:"Progress",v:Math.round(doneCount/totalWPs*100)+"%",sub:doneCount+"/"+totalWPs+" WPs",c:C.accent},
          {l:"Risks",v:(ind?.risks?.length||0)+customItems.risks.length,sub:ind?.risks?.filter(r=>r.level==="SIGNIFICANT").length+" significant",c:C.red},
          {l:"Procedures",v:ind?.procedures?.length||0,sub:"Across "+new Set((ind?.procedures||[]).map(p=>p.area)).size+" areas",c:C.blue},
          {l:"Test Bank",v:Object.values(ADD_TESTS).flat().length,sub:"Standard tests",c:C.orange},
          {l:"Materiality",v:"\u00A3"+(cfg.materiality||"--"),sub:"PM: \u00A3"+(cfg.perfMateriality||"--"),c:C.green}
        ].map((s,i)=><div key={i} style={{background:"linear-gradient(135deg, "+s.c+"12, "+s.c+"06)",border:"1px solid "+s.c+"33",borderRadius:12,padding:"16px 18px",borderTop:"3px solid "+s.c}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:s.c}}>{s.v}</div>
          <div style={{fontSize:10,color:C.dim,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:2}}>{s.l}</div>
          <div style={{fontSize:9,color:C.faint,marginTop:2}}>{s.sub}</div>
        </div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[{l:"Risk Matrix",id:"b1",c:C.red,icon:"\uD83D\uDD34"},{l:"Revenue Testing",id:"d1",c:C.orange,icon:"\uD83D\uDCB7"},{l:"Completion",id:"e1",c:C.purple,icon:"\u2714\uFE0F"},{l:"Audit Report",id:"f2",c:C.accent,icon:"\uD83D\uDCDC"}].map((q,i)=><button key={i} onClick={()=>setActiveWP(q.id)} style={{background:q.c+"12",border:"1px solid "+q.c+"33",borderRadius:10,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",color:C.text}}>
          <div style={{fontSize:20,marginBottom:4}}>{q.icon}</div>
          <div style={{fontSize:12,fontWeight:600}}>{q.l}</div>
          <div style={{fontSize:10,color:C.faint,marginTop:2}}>Jump to WP</div>
        </button>)}
      </div>
      <div style={{marginTop:24,background:C.card,border:"1px solid "+C.border,borderRadius:12,padding:20}}>
        <SecTitle t="Engagement Summary" />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,fontSize:12}}>
          {[["Entity",cfg.entityName],["FYE",cfg.fye],["Industry",ind?.label],["Sector",cfg.sector],["Framework",fw?.label],["Size",sz?.label],["Partner",cfg.partner||"TBD"],["Manager",cfg.manager||"TBD"],["Firm",cfg.firmName||"TBD"],["Materiality","\u00A3"+(cfg.materiality||"TBD")],["Perf Mat","\u00A3"+(cfg.perfMateriality||"TBD")],["Trivial","\u00A3"+(cfg.trivial||"TBD")]].map(([k,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",borderRadius:6,background:i%2===0?"rgba(255,255,255,0.015)":"transparent"}}><span style={{color:C.faint}}>{k}</span><span style={{color:C.text,fontWeight:500}}>{v}</span></div>)}
        </div>
      </div>
    </div>;
  };

  const currentWP = WP_SECTIONS.find(w=>w.id===activeWP);
  const sw = sidebarOpen ? 268 : 52;

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif",color:C.text,display:"flex",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.accent}44;border-radius:3px}
        button:hover{filter:brightness(1.1)} input:focus,textarea:focus,select:focus{border-color:${C.accent}88!important}
        tr:hover{background:rgba(255,255,255,0.03)!important}
      `}</style>

      <aside style={{width:sw,height:"100vh",position:"fixed",left:0,top:0,background:C.sidebar,borderRight:"1px solid "+C.border,overflowY:"auto",overflowX:"hidden",transition:"width 0.3s ease",zIndex:100,display:"flex",flexDirection:"column"}}>
        <div style={{padding:sidebarOpen?"16px 18px":"16px 10px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}} onClick={()=>setSidebarOpen(!sidebarOpen)}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg, "+C.accent+", "+C.accentLight+")",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,color:"#000",flexShrink:0}}>A</div>
          {sidebarOpen && <div style={{overflow:"hidden",whiteSpace:"nowrap"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600}}>Audit<span style={{color:C.accent}}>Engine</span></div><div style={{fontSize:8,color:C.faint,letterSpacing:"0.15em",textTransform:"uppercase"}}>v9.0 | ISA (UK)</div></div>}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
          {WP_SECTIONS.map((w,i)=>{
            if(w.type==="separator") return sidebarOpen ? <div key={i} style={{padding:"12px 18px 4px",fontSize:9,fontWeight:700,color:w.color||C.faint,letterSpacing:"0.15em",textTransform:"uppercase",borderTop:i>0?"1px solid "+C.border:"none",marginTop:i>0?4:0}}>{w.label}</div> : <div key={i} style={{height:1,background:C.border,margin:"4px 8px"}} />;
            const active = activeWP === w.id;
            const typeColor = w.type==="planning"?C.planning:w.type==="risk"?C.risk:w.type==="lead"?C.lead:w.type==="testing"?C.testing:w.type==="completion"?C.completion:w.type==="reporting"?C.reporting:C.accent;
            const so = signOffs[w.id]||{};
            const status = so.preparedBy && so.reviewedBy ? "done" : so.preparedBy ? "wip" : "open";
            return <button key={w.id} onClick={()=>setActiveWP(w.id)} title={w.label} style={{
              width:"100%",display:"flex",alignItems:"center",gap:10,
              padding:sidebarOpen?"8px 18px":"8px 12px",cursor:"pointer",border:"none",textAlign:"left",
              background:active?"linear-gradient(90deg, "+typeColor+"22, transparent)":"transparent",
              borderLeft:active?"3px solid "+typeColor:"3px solid transparent",
              color:active?C.text:C.dim,transition:"all 0.15s",fontSize:12
            }}>
              <span style={{fontSize:sidebarOpen?14:18,flexShrink:0}}>{w.icon}</span>
              {sidebarOpen && <>
                <span style={{fontWeight:active?600:400,flex:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}><span style={{fontFamily:"monospace",color:typeColor,fontSize:10,marginRight:4}}>{w.ref}</span>{w.label}</span>
                <span style={{fontSize:8,color:status==="done"?C.green:status==="wip"?C.orange:C.faint}}>{status==="done"?"\u2713":status==="wip"?"\u25D0":"\u25CB"}</span>
              </>}
            </button>;
          })}
        </div>

        {sidebarOpen && <div style={{padding:"12px 18px",borderTop:"1px solid "+C.border,fontSize:9,color:C.faint,flexShrink:0}}>
          {totalWPs} WPs | {Object.keys(INDUSTRIES).length} Industries | ISA (UK)
        </div>}
      </aside>

      <main style={{marginLeft:sw,flex:1,minHeight:"100vh",transition:"margin-left 0.3s ease"}}>
        {cfg.configured && <div style={{padding:"8px 32px",background:"linear-gradient(90deg, "+C.accent+"12, transparent)",borderBottom:"1px solid "+C.accent+"22",display:"flex",alignItems:"center",gap:20,fontSize:10,color:C.dim,flexWrap:"wrap"}}>
          <span style={{fontWeight:700,color:C.accentLight}}>{cfg.entityName}</span>
          <span>FYE: {cfg.fye}</span>
          <span>{ind?.icon} {ind?.label} -- {cfg.sector}</span>
          <span>{fw?.label}</span>
          <span>\u00A3{cfg.materiality||"TBD"}</span>
          <span style={{marginLeft:"auto",fontWeight:600,color:C.accent}}>{doneCount}/{totalWPs} complete</span>
        </div>}

        <div style={{padding:"24px 32px",maxWidth:1100}}>
          {activeWP === "dashboard" ? <Dashboard /> : currentWP && currentWP.type !== "separator" ? <div style={{animation:"fadeUp 0.4s ease-out"}}>
            <WPHead wp={currentWP} />
            {renderBody(currentWP)}
            <div style={{marginTop:24,background:C.card,border:"1px solid "+C.border,borderRadius:10,padding:16}}>
              <div style={{fontSize:10,color:C.accent,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:700,marginBottom:8}}>Working Paper Notes</div>
              <textarea value={wpNotes[currentWP.id]||""} onChange={e=>setWpNotes(p=>({...p,[currentWP.id]:e.target.value}))} style={{...inp,minHeight:80,resize:"vertical"}} placeholder={"Document observations for "+currentWP.label+"..."} />
            </div>
          </div> : null}
        </div>
      </main>

      <AddModal />
    </div>
  );
}
