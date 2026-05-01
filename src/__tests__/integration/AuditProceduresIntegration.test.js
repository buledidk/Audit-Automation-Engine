/**
 * Audit Procedures Integration Tests
 * Verifies integration between auditProceduresService and AuditProceduresPanel
 */
import { describe, test, expect } from 'vitest';

describe('Audit Procedures System Integration', () => {
    test('auditProceduresService exports correctly', async () => {
          const module = await import('../../services/auditProceduresService');
          const service = module.default;
          expect(service).toBeDefined();
          expect(service.registerProcedure).toBeDefined();
          expect(service.recordTestingResults).toBeDefined();
          expect(service.attachEvidence).toBeDefined();
    });

           test('service registers procedures correctly', async () => {
                 const module = await import('../../services/auditProceduresService');
                 const service = module.default;
                 service.registerProcedure('proc-001', {
                         fsli: 'cash',
                         description: 'Bank confirmations',
                         complexity: 'medium'
                 });
                 expect(service.procedures.has('proc-001')).toBe(true);
           });

           test('service records testing results with professional judgment', async () => {
                 const module = await import('../../services/auditProceduresService');
                 const service = module.default;
                 const results = service.recordTestingResults('proc-001', {
                         itemsTested: 50,
                         itemsPassed: 50,
                         itemsFailed: 0
                 }, {
                         auditorName: 'John Auditor',
                         decision: 'Approved',
                         reasoning: 'Testing adequate',
                         riskLevel: 'Low'
                 });
                 expect(results.itemsTested).toBe(50);
                 expect(results.auditor).toBe('John Auditor');
                 expect(results.decision).toBe('Approved');
           });

           test('service tracks evidence attachments', async () => {
                 const module = await import('../../services/auditProceduresService');
                 const service = module.default;
                 const evidence = service.attachEvidence('proc-001', {
                         filename: 'bank-statement.pdf',
                         fileType: 'pdf',
                         size: 2048,
                         description: 'Bank confirmation'
                 });
                 expect(evidence.filename).toBe('bank-statement.pdf');
                 expect(evidence.id).toBeDefined();
           });

           test('AuditProceduresPanel component loads', async () => {
                 const module = await import('../../components/AuditProceduresPanel.jsx');
                 const Component = module.default;
                 expect(Component).toBeDefined();
           });
});
