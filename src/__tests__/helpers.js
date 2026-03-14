/**
 * Test helpers and utilities
 */

export const createMockEngagement = (overrides = {}) => ({
  id: 'eng-001',
  entityName: 'Test Corp Ltd',
  fiscalYearEnd: '2025-12-31',
  riskLevel: 'Medium',
  materiality: 50000,
  performanceMateriality: 37500,
  triviality: 2500,
  ...overrides
})

export const createMockProcedure = (overrides = {}) => ({
  id: 'proc-001',
  procedureName: 'Test Procedure',
  assertion: 'Completeness',
  fsli: 'Revenue',
  riskLevel: 'Medium',
  samplingMethod: 'Stratified',
  sampleSize: 50,
  populationSize: 500,
  ...overrides
})

export const createMockException = (overrides = {}) => ({
  id: 'exc-001',
  procedureId: 'proc-001',
  description: 'Exception Description',
  amount: 5000,
  itemDesc: 'Item Description',
  status: 'Pending Evaluation',
  ...overrides
})

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mockSupabaseResponse = {
  data: [],
  error: null,
  status: 200,
  statusText: 'OK',
  count: null
}

export const assertAuditStandard = (value, standard) => {
  const standards = {
    ISA: ['ISA 200', 'ISA 210', 'ISA 230', 'ISA 240', 'ISA 250', 'ISA 260', 'ISA 315', 'ISA 320', 'ISA 330', 'ISA 500', 'ISA 501', 'ISA 505', 'ISA 510', 'ISA 520', 'ISA 530', 'ISA 540', 'ISA 550', 'ISA 560', 'ISA 570', 'ISA 580', 'ISA 600', 'ISA 610', 'ISA 620', 'ISA 700', 'ISA 701', 'ISA 705', 'ISA 706', 'ISA 710', 'ISA 720', 'ISA 800', 'ISA 805', 'ISA 810'],
    PCAOB: ['AS 1001', 'AS 1010', 'AS 1015', 'AS 1020', 'AS 1025', 'AS 1305', 'AS 1401', 'AS 1501', 'AS 1505', 'AS 1510', 'AS 1520', 'AS 1530', 'AS 2005', 'AS 2010', 'AS 2015', 'AS 2020', 'AS 2105', 'AS 2110', 'AS 2201', 'AS 2301', 'AS 2302', 'AS 2310', 'AS 2315', 'AS 2320', 'AS 2401', 'AS 2410', 'AS 2501', 'AS 2601', 'AS 2701', 'AS 3101', 'AS 3201', 'AS 3301', 'AS 3401', 'AS 3501', 'AS 3600', 'AS 3700', 'AS 3800', 'AS 3900', 'AS 4000', 'AS 4010', 'AS 4011']
  }
  return standards[standard]?.includes(value) || false
}
