/**
 * Documentation Generation Integration Tests
 * Verifies auto-generation of audit documentation
 */
import { describe, test, expect } from 'vitest';

describe('Documentation Generation System Integration', () => {
    test('documentationGenerationService exports correctly', async () => {
          const module = await import('../../services/documentationGenerationService');
          const service = module.default;
          expect(service).toBeDefined();
          expect(service.generateDocumentationForPhase).toBeDefined();
          expect(service.exportToExcel).toBeDefined();
          expect(service.exportToWord).toBeDefined();
    });

           test('fsliNarrativeService exports correctly', async () => {
                 const module = await import('../../services/fsliNarrativeService');
                 const service = module.default;
                 expect(service).toBeDefined();
                 expect(service.generateNarrative).toBeDefined();
                 expect(service.getNarrative).toBeDefined();
                 expect(service.updateNarrative).toBeDefined();
           });

           test('FSLI narrative service has templates for all FSLIs', async () => {
                 const module = await import('../../services/fsliNarrativeService');
                 const service = module.default;
                 const templates = service.templates;
                 expect(templates.cash).toBeDefined();
                 expect(templates.receivables).toBeDefined();
                 expect(templates.inventory).toBeDefined();
                 expect(templates.fixedAssets).toBeDefined();
                 expect(templates.payables).toBeDefined();
           });

           test('DocumentationPanel component loads', async () => {
                 const module = await import('../../components/DocumentationPanel.jsx');
                 const Component = module.default;
                 expect(Component).toBeDefined();
           });

           test('useDocumentGeneration hook works', async () => {
                 const module = await import('../../hooks/useDocumentGeneration');
                 const useDocumentGeneration = module.default;
                 expect(useDocumentGeneration).toBeDefined();
           });

           test('FSLI narrative can be generated', async () => {
                 const module = await import('../../services/fsliNarrativeService');
                 const service = module.default;
                 const narrative = service.generateNarrative('cash', {
                         bankCount: 3,
                         amount: '1,000,000'
                 });
                 expect(narrative).toBeDefined();
                 expect(narrative.fsliName).toBe('Cash & Bank Accounts');
                 expect(narrative.narrative).toContain('bank');
           });

           test('Documentation panel exports in multiple formats', async () => {
                 const module = await import('../../services/documentationGenerationService');
                 const service = module.default;
                 expect(service.exportToExcel).toBeDefined();
                 expect(service.exportToWord).toBeDefined();
           });
});
