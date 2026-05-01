// ═══════════════════════════════════════════════════════════════════════
// ESG / SUSTAINABILITY AUDIT FRAMEWORK
// TCFD, CSRD, UK SDR, ISSB, SECR — Standards and Audit Considerations
// ═══════════════════════════════════════════════════════════════════════

// ─── TCFD FRAMEWORK ──────────────────────────────────────────────────

export const TCFD_FRAMEWORK = {
  name: 'Task Force on Climate-related Financial Disclosures',
  reference: 'TCFD Final Report (June 2017) and 2021 Annex Updates',
  effectiveDate: '2017-06-29',
  scope: 'Organisations reporting climate-related financial information to investors, lenders and insurance underwriters',
  regulatoryBody: 'Financial Stability Board (FSB)',
  affectedEntities: 'UK premium-listed companies (mandatory under FCA PS21/24), large private companies and LLPs (under Companies Act SI 2022/31), asset managers and owners',
  keyRequirements: [
    'Governance: Disclose the organisation\'s governance around climate-related risks and opportunities',
    'Strategy: Disclose actual and potential impacts of climate-related risks and opportunities on the organisation\'s businesses, strategy and financial planning',
    'Risk Management: Disclose how the organisation identifies, assesses and manages climate-related risks',
    'Metrics and Targets: Disclose the metrics and targets used to assess and manage relevant climate-related risks and opportunities',
    'Board oversight of climate-related risks and opportunities must be described',
    'Management\'s role in assessing and managing climate-related risks must be described',
    'Climate-related scenario analysis should cover at least a 2 degrees Celsius or lower scenario',
    'Scope 1, Scope 2 and, if appropriate, Scope 3 greenhouse gas emissions must be disclosed',
  ],
  auditConsiderations: [
    'Assess whether TCFD disclosures are consistent with information in the audited financial statements',
    'Consider whether climate-related risks identified in TCFD reporting are reflected in asset impairment assessments, provisions and going concern evaluations',
    'Evaluate the completeness of scenario analysis and whether assumptions are reasonable and supportable',
    'Review governance structures described to verify they are operating as disclosed',
    'Verify metrics and targets against underlying data, including GHG emissions calculations',
    'Consider ISA (UK) 720 responsibilities regarding Other Information consistency with TCFD narrative',
    'Assess whether the entity has obtained independent assurance over emissions data',
    'Evaluate transition plan disclosures for consistency with financial statement assumptions',
  ],
  pillars: [
    {
      pillar: 'Governance',
      description: 'Organisation governance around climate-related risks and opportunities',
      disclosures: [
        'Board oversight of climate-related risks and opportunities',
        'Management role in assessing and managing climate-related risks and opportunities',
      ],
      auditFocus: [
        'Verify board and committee terms of reference include climate risk oversight',
        'Check minutes of board meetings for evidence of climate risk discussion',
        'Confirm management reporting lines for climate risk are in place',
      ],
    },
    {
      pillar: 'Strategy',
      description: 'Actual and potential impacts on business, strategy and financial planning',
      disclosures: [
        'Climate-related risks and opportunities identified over the short, medium and long term',
        'Impact on business, strategy and financial planning',
        'Resilience of strategy taking into consideration different climate-related scenarios',
      ],
      auditFocus: [
        'Assess whether identified risks and opportunities are reflected in financial statements',
        'Evaluate scenario analysis methodology and underlying assumptions',
        'Check consistency between strategy narrative and capital expenditure plans',
      ],
    },
    {
      pillar: 'Risk Management',
      description: 'Processes used to identify, assess and manage climate-related risks',
      disclosures: [
        'Processes for identifying and assessing climate-related risks',
        'Processes for managing climate-related risks',
        'How processes are integrated into the overall risk management framework',
      ],
      auditFocus: [
        'Verify climate risk is integrated into the enterprise risk management framework',
        'Test sample of identified climate risks through the assessment process',
        'Confirm risk appetite and tolerance thresholds are defined for climate risks',
      ],
    },
    {
      pillar: 'Metrics and Targets',
      description: 'Metrics and targets used to assess and manage climate-related risks',
      disclosures: [
        'Metrics used to assess climate-related risks and opportunities in line with strategy and risk management process',
        'Scope 1, Scope 2 and if appropriate Scope 3 greenhouse gas emissions and the related risks',
        'Targets used to manage climate-related risks and opportunities and performance against targets',
      ],
      auditFocus: [
        'Verify GHG emissions data against source records and calculation methodologies',
        'Test emissions factors applied and assess their appropriateness',
        'Compare reported progress against prior year targets for consistency',
        'Assess whether intensity ratios are calculated consistently year on year',
      ],
    },
  ],
};

// ─── CSRD FRAMEWORK ──────────────────────────────────────────────────

export const CSRD_FRAMEWORK = {
  name: 'Corporate Sustainability Reporting Directive',
  reference: 'Directive (EU) 2022/2464 amending the Accounting Directive, Transparency Directive, Audit Directive and Audit Regulation',
  effectiveDate: '2024-01-01',
  scope: 'EU large undertakings, listed SMEs, and third-country undertakings with significant EU activity; UK subsidiaries of in-scope EU parent companies may be affected',
  regulatoryBody: 'European Commission / European Financial Reporting Advisory Group (EFRAG)',
  affectedEntities: 'Large EU companies (meeting 2 of 3: >250 employees, >EUR 50m turnover, >EUR 25m balance sheet), EU-listed SMEs (from 2026), non-EU companies with >EUR 150m EU net turnover (from 2028), UK subsidiaries of in-scope EU groups',
  keyRequirements: [
    'Double materiality assessment: assess both impact materiality (entity impact on environment and society) and financial materiality (sustainability matters impacting financial position)',
    'Report in accordance with European Sustainability Reporting Standards (ESRS) adopted as delegated acts',
    'ESRS 1 General Requirements and ESRS 2 General Disclosures are mandatory for all in-scope entities',
    'Topical standards ESRS E1-E5 (Environment), ESRS S1-S4 (Social), ESRS G1 (Governance) apply subject to materiality assessment',
    'Sustainability report must be included in the management report (not a separate document)',
    'Information must be provided in machine-readable XHTML format with iXBRL tagging',
    'Forward-looking information including transition plans and targets required',
    'Value chain information required covering upstream and downstream impacts',
  ],
  auditConsiderations: [
    'Determine whether the UK subsidiary falls within scope through its EU parent company reporting obligations',
    'Evaluate the double materiality assessment process for completeness and rigour',
    'Assess whether ESRS disclosure requirements have been correctly identified as material or not material',
    'Review the sustainability due diligence process described in the report',
    'Verify quantitative sustainability data against source records and calculation methodologies',
    'Assess the consistency of sustainability information with financial statements',
    'Consider the adequacy of the entity\'s systems and controls for sustainability data collection',
    'Evaluate whether limited or reasonable assurance has been obtained over sustainability information as required',
    'Consider group consolidation requirements for sustainability data',
    'Review iXBRL tagging accuracy against the ESRS digital taxonomy',
  ],
  esrsStandards: [
    { code: 'ESRS 1', title: 'General Requirements', mandatory: true },
    { code: 'ESRS 2', title: 'General Disclosures', mandatory: true },
    { code: 'ESRS E1', title: 'Climate Change', mandatory: false },
    { code: 'ESRS E2', title: 'Pollution', mandatory: false },
    { code: 'ESRS E3', title: 'Water and Marine Resources', mandatory: false },
    { code: 'ESRS E4', title: 'Biodiversity and Ecosystems', mandatory: false },
    { code: 'ESRS E5', title: 'Resource Use and Circular Economy', mandatory: false },
    { code: 'ESRS S1', title: 'Own Workforce', mandatory: false },
    { code: 'ESRS S2', title: 'Workers in the Value Chain', mandatory: false },
    { code: 'ESRS S3', title: 'Affected Communities', mandatory: false },
    { code: 'ESRS S4', title: 'Consumers and End-users', mandatory: false },
    { code: 'ESRS G1', title: 'Business Conduct', mandatory: false },
  ],
};

// ─── UK SDR FRAMEWORK ────────────────────────────────────────────────

export const UK_SDR_FRAMEWORK = {
  name: 'UK Sustainability Disclosure Requirements',
  reference: 'FCA Policy Statement PS23/16 (Sustainability Disclosure Requirements and investment labels)',
  effectiveDate: '2023-11-28',
  scope: 'FCA-authorised firms marketing sustainability-related financial products in the UK; broader entity-level disclosure requirements for listed companies and large asset managers',
  regulatoryBody: 'Financial Conduct Authority (FCA)',
  affectedEntities: 'UK asset managers, FCA-authorised fund managers, listed issuers, firms making sustainability-related claims about financial products',
  keyRequirements: [
    'Anti-greenwashing rule (FCA PRIN 2A and ESG 4.3): all FCA-authorised firms must ensure sustainability-related claims are fair, clear and not misleading (effective 31 May 2024)',
    'Sustainability labels: four labels available for qualifying products (Sustainability Focus, Sustainability Improvers, Sustainability Impact, Sustainability Mixed Goals)',
    'Consumer-facing disclosures: pre-contractual product-level sustainability information for labelled products',
    'Detailed product-level disclosures: ongoing sustainability performance reporting for labelled products',
    'Entity-level disclosures: TCFD-aligned entity-level sustainability reporting for in-scope asset managers and listed companies',
    'Naming and marketing rules: restrictions on use of sustainability-related terms in product names and marketing for products without a sustainability label',
    'Distributors must not market overseas funds to UK retail investors using sustainability labels unless qualifying criteria are met',
    'Firms must maintain adequate records supporting any sustainability-related claims',
  ],
  auditConsiderations: [
    'Assess whether the entity has correctly identified which SDR requirements apply to its products and activities',
    'Evaluate compliance with the anti-greenwashing rule across all client-facing communications and marketing materials',
    'Review the basis for any sustainability label applied to products and whether qualifying criteria are met',
    'Verify consumer-facing and detailed product-level disclosures for accuracy and completeness',
    'Assess the adequacy of systems and controls for producing and monitoring sustainability disclosures',
    'Review entity-level TCFD-aligned disclosures for compliance with FCA requirements',
    'Consider whether naming and marketing restrictions have been properly applied to non-labelled products',
    'Evaluate record-keeping supporting sustainability-related claims',
    'Assess whether distributors have complied with overseas fund marketing restrictions',
    'Consider interactions with other regulatory frameworks including TCFD and ISSB requirements',
  ],
  labels: [
    { label: 'Sustainability Focus', description: 'Invests in assets that are environmentally or socially sustainable, determined using a robust, evidence-based standard' },
    { label: 'Sustainability Improvers', description: 'Invests in assets that may not be environmentally or socially sustainable now, with an aim to improve their sustainability over time' },
    { label: 'Sustainability Impact', description: 'Invests in solutions to environmental or social problems, to achieve positive, measurable, real-world sustainability outcomes' },
    { label: 'Sustainability Mixed Goals', description: 'Invests in a mix of assets pursuing environmental or social sustainability goals through a combination of the above strategies' },
  ],
};

// ─── ISSB FRAMEWORK ──────────────────────────────────────────────────

export const ISSB_FRAMEWORK = {
  name: 'International Sustainability Standards Board Standards',
  reference: 'IFRS S1 General Requirements for Disclosure of Sustainability-related Financial Information; IFRS S2 Climate-related Disclosures',
  effectiveDate: '2024-01-01',
  scope: 'Entities preparing general purpose financial reports; adoption subject to jurisdictional endorsement; UK endorsement expected through UK Sustainability Disclosure Standards',
  regulatoryBody: 'IFRS Foundation / International Sustainability Standards Board (ISSB)',
  affectedEntities: 'All entities preparing general purpose financial reports in adopting jurisdictions; UK adoption anticipated for listed companies, large private companies and financial institutions through UK SDS endorsement process',
  keyRequirements: [
    'IFRS S1: Disclose information about all sustainability-related risks and opportunities that could reasonably be expected to affect the entity\'s cash flows, access to finance or cost of capital over the short, medium or long term',
    'IFRS S1: Apply the same reporting entity boundary as financial statements',
    'IFRS S1: Provide connected information between sustainability disclosures and financial statements',
    'IFRS S1: Disclose governance, strategy, risk management, and metrics and targets for each material sustainability-related risk or opportunity',
    'IFRS S2: Disclose information about climate-related risks and opportunities including physical risks and transition risks',
    'IFRS S2: Climate resilience assessment using climate-related scenario analysis',
    'IFRS S2: Scope 1, Scope 2 and Scope 3 greenhouse gas emissions using GHG Protocol methodology',
    'IFRS S2: Disclose climate-related targets and progress, including whether targets are based on scientific evidence',
    'Cross-reference to industry-based guidance derived from SASB Standards',
  ],
  auditConsiderations: [
    'Assess the completeness of the entity\'s identification of sustainability-related risks and opportunities under IFRS S1',
    'Evaluate whether sustainability disclosures are connected to and consistent with the audited financial statements',
    'Verify that the reporting entity boundary for sustainability matches the financial reporting boundary',
    'Assess whether governance, strategy and risk management disclosures accurately reflect the entity\'s actual processes',
    'Verify GHG emissions data (Scope 1, 2 and 3) against source records and the GHG Protocol methodology applied',
    'Evaluate the appropriateness of climate scenario analysis assumptions and methodology under IFRS S2',
    'Consider the reliability of Scope 3 emissions estimates and the use of industry averages or proxies',
    'Assess whether targets are clearly described, measurable and consistent with disclosed strategy',
    'Evaluate the entity\'s use of industry-based SASB metrics and their relevance',
    'Consider the implications of sustainability disclosures for financial statement items such as asset impairment, provisions, useful lives and going concern',
  ],
  standards: [
    {
      code: 'IFRS S1',
      title: 'General Requirements for Disclosure of Sustainability-related Financial Information',
      focus: 'Framework for disclosing material sustainability-related risks and opportunities across governance, strategy, risk management, metrics and targets',
      connectionToFinancialStatements: 'Requires connected information showing how sustainability risks and opportunities affect financial position, performance and cash flows reported in financial statements',
    },
    {
      code: 'IFRS S2',
      title: 'Climate-related Disclosures',
      focus: 'Climate-specific risks and opportunities including physical risks, transition risks, scenario analysis, and greenhouse gas emissions',
      connectionToFinancialStatements: 'Climate-related risks must be reflected in financial statement estimates including asset impairment, provisions, expected credit losses, fair values and useful economic lives',
    },
  ],
};

// ─── SECR FRAMEWORK ──────────────────────────────────────────────────

export const SECR_FRAMEWORK = {
  name: 'Streamlined Energy and Carbon Reporting',
  reference: 'The Companies (Directors\' Report) and Limited Liability Partnerships (Energy and Carbon Report) Regulations 2018 (SI 2018/1155)',
  effectiveDate: '2019-04-01',
  scope: 'UK quoted companies, large unquoted companies and large LLPs meeting qualifying criteria',
  regulatoryBody: 'Department for Energy Security and Net Zero (DESNZ) / Companies House',
  affectedEntities: 'UK quoted companies (all), large unquoted companies and LLPs meeting at least 2 of 3 criteria: >250 employees, >GBP 36m turnover, >GBP 18m balance sheet total',
  keyRequirements: [
    'Report Scope 1 emissions: direct GHG emissions from sources owned or controlled by the entity (e.g. combustion in boilers, furnaces, vehicles)',
    'Report Scope 2 emissions: indirect GHG emissions from purchased electricity, heat, steam or cooling consumed by the entity',
    'Report Scope 3 emissions: quoted companies must include Scope 3 emissions where practical; large unquoted companies may report voluntarily',
    'Report total energy consumption in kWh for the UK as a minimum (quoted companies must report global energy consumption)',
    'Disclose at least one intensity ratio (e.g. tCO2e per GBP revenue, per employee, or per unit of production)',
    'Describe energy efficiency actions taken during the reporting period',
    'Apply a recognised methodology such as the GHG Protocol Corporate Standard or DEFRA Environmental Reporting Guidelines',
    'Information must be included in the directors\' report (or energy and carbon report for LLPs)',
    'Prior year comparative figures must be provided',
    'State the methodology, conversion factors and any exclusions applied',
  ],
  auditConsiderations: [
    'Determine whether the entity meets the qualifying criteria for SECR reporting (quoted company test or large company/LLP size thresholds)',
    'Verify the completeness of the organisational boundary used for emissions reporting (operational control vs equity share approach)',
    'Test Scope 1 emissions data against source records such as fuel purchase invoices, meter readings and fleet records',
    'Test Scope 2 emissions data against electricity bills, supplier statements and meter data',
    'Verify conversion factors used against published DEFRA/BEIS greenhouse gas reporting conversion factors for the relevant year',
    'Assess the appropriateness and consistency of the intensity ratio selected',
    'Verify total energy consumption figure in kWh against underlying utility data',
    'Review any exclusions claimed and assess whether they are justified and properly disclosed',
    'Confirm that prior year comparatives have been presented and are consistent with the prior year report',
    'Consider ISA (UK) 720 responsibilities in relation to SECR disclosures as Other Information in the annual report',
    'Assess the adequacy of internal controls over energy and emissions data collection processes',
    'Evaluate whether the methodology statement is sufficient and accurately describes the approach used',
  ],
  emissionsScopes: [
    {
      scope: 'Scope 1',
      title: 'Direct Emissions',
      description: 'GHG emissions from sources owned or controlled by the reporting entity',
      examples: [
        'Natural gas combustion in boilers and heating systems',
        'Company-owned vehicle fleet fuel consumption',
        'Fugitive emissions from refrigeration and air conditioning',
        'Process emissions from manufacturing operations',
      ],
    },
    {
      scope: 'Scope 2',
      title: 'Indirect Emissions from Purchased Energy',
      description: 'GHG emissions from the generation of purchased electricity, heat, steam or cooling consumed by the reporting entity',
      examples: [
        'Purchased electricity for offices, data centres and facilities',
        'Purchased heat or steam for industrial processes',
        'District heating or cooling consumption',
      ],
    },
    {
      scope: 'Scope 3',
      title: 'Other Indirect Emissions',
      description: 'All other indirect GHG emissions that occur in the value chain of the reporting entity',
      examples: [
        'Business travel (flights, rail, hotels)',
        'Employee commuting',
        'Upstream transportation and distribution',
        'Waste generated in operations',
        'Purchased goods and services',
        'Use of sold products',
        'End-of-life treatment of sold products',
      ],
    },
  ],
};

// ─── COMBINED ESG STANDARDS INDEX ────────────────────────────────────

export const ESG_STANDARDS = {
  tcfd: TCFD_FRAMEWORK,
  csrd: CSRD_FRAMEWORK,
  ukSDR: UK_SDR_FRAMEWORK,
  issb: ISSB_FRAMEWORK,
  secr: SECR_FRAMEWORK,
};

export const ESG_STANDARDS_LIST = [
  { key: 'tcfd', title: 'TCFD (Climate-related Financial Disclosures)', color: '#10B981', count: TCFD_FRAMEWORK.pillars.length },
  { key: 'csrd', title: 'CSRD (Corporate Sustainability Reporting)', color: '#3B82F6', count: CSRD_FRAMEWORK.esrsStandards.length },
  { key: 'ukSDR', title: 'UK Sustainability Disclosure Requirements', color: '#8B5CF6', count: UK_SDR_FRAMEWORK.labels.length },
  { key: 'issb', title: 'ISSB Standards (IFRS S1 & S2)', color: '#F59E0B', count: ISSB_FRAMEWORK.standards.length },
  { key: 'secr', title: 'Streamlined Energy and Carbon Reporting', color: '#EF4444', count: SECR_FRAMEWORK.emissionsScopes.length },
];
