import { describe, it, expect } from 'vitest'
import {
  FRAMEWORKS,
  ENTITY_SIZES,
  AUDIT_PHASES,
  WORKING_PAPERS,
  getWorkingPapersByPhase,
  getSignificantRiskPapers,
  getDefaultFramework,
} from '../../data/AuditFrameworks.js'

describe('AuditFrameworks', () => {
  describe('FRAMEWORKS', () => {
    it('should have 5 frameworks', () => {
      expect(Object.keys(FRAMEWORKS)).toHaveLength(5)
    })

    it('should include FRS 102, FRS 105, IFRS, FRS 102 s1A, and Charities SORP', () => {
      expect(FRAMEWORKS.frs102).toBeTruthy()
      expect(FRAMEWORKS.frs105).toBeTruthy()
      expect(FRAMEWORKS.ifrs).toBeTruthy()
      expect(FRAMEWORKS.frs102_1a).toBeTruthy()
      expect(FRAMEWORKS.charities_sorp).toBeTruthy()
    })

    it('each framework should have label, full, and color', () => {
      for (const [key, fw] of Object.entries(FRAMEWORKS)) {
        expect(fw.label, `${key}.label`).toBeTruthy()
        expect(fw.full, `${key}.full`).toBeTruthy()
        expect(fw.color, `${key}.color`).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }
    })
  })

  describe('ENTITY_SIZES', () => {
    it('should have 5 size categories', () => {
      expect(Object.keys(ENTITY_SIZES)).toHaveLength(5)
    })

    it('should have micro, small, medium, large, listed', () => {
      expect(ENTITY_SIZES.micro).toBeTruthy()
      expect(ENTITY_SIZES.small).toBeTruthy()
      expect(ENTITY_SIZES.medium).toBeTruthy()
      expect(ENTITY_SIZES.large).toBeTruthy()
      expect(ENTITY_SIZES.listed).toBeTruthy()
    })

    it('each size should have label, turnover, totalAssets, employees, defaultFramework', () => {
      for (const [key, sz] of Object.entries(ENTITY_SIZES)) {
        expect(sz.label, `${key}.label`).toBeTruthy()
        expect(sz.turnover, `${key}.turnover`).toBeTruthy()
        expect(sz.totalAssets, `${key}.totalAssets`).toBeTruthy()
        expect(sz.employees, `${key}.employees`).toBeTruthy()
        expect(sz.defaultFramework, `${key}.defaultFramework`).toBeTruthy()
        expect(FRAMEWORKS[sz.defaultFramework], `${key} defaultFramework should be valid`).toBeTruthy()
      }
    })

    it('micro entities should default to FRS 105', () => {
      expect(ENTITY_SIZES.micro.defaultFramework).toBe('frs105')
    })

    it('listed entities should default to IFRS', () => {
      expect(ENTITY_SIZES.listed.defaultFramework).toBe('ifrs')
    })
  })

  describe('AUDIT_PHASES', () => {
    it('should have 8 phases', () => {
      expect(Object.keys(AUDIT_PHASES)).toHaveLength(8)
    })

    it('each phase should have label and color', () => {
      for (const [key, phase] of Object.entries(AUDIT_PHASES)) {
        expect(phase.label, `${key}.label`).toBeTruthy()
        expect(phase.color, `${key}.color`).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }
    })
  })

  describe('WORKING_PAPERS', () => {
    it('should have 22 working papers', () => {
      expect(WORKING_PAPERS).toHaveLength(22)
    })

    it('each WP should have id, ref, title, and phase', () => {
      for (const wp of WORKING_PAPERS) {
        expect(wp.id, 'missing id').toBeTruthy()
        expect(wp.ref, `${wp.id} missing ref`).toBeTruthy()
        expect(wp.title, `${wp.id} missing title`).toBeTruthy()
        expect(wp.phase, `${wp.id} missing phase`).toBeTruthy()
        expect(AUDIT_PHASES[wp.phase], `${wp.id} invalid phase: ${wp.phase}`).toBeTruthy()
      }
    })

    it('should have unique IDs', () => {
      const ids = WORKING_PAPERS.map(wp => wp.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('should have unique refs', () => {
      const refs = WORKING_PAPERS.map(wp => wp.ref)
      expect(new Set(refs).size).toBe(refs.length)
    })

    it('should have WPs in all phases', () => {
      const phases = new Set(WORKING_PAPERS.map(wp => wp.phase))
      expect(phases.size).toBeGreaterThanOrEqual(7)
    })
  })

  describe('getWorkingPapersByPhase', () => {
    it('should return planning WPs for "pl" phase', () => {
      const planningWPs = getWorkingPapersByPhase('pl')
      expect(planningWPs.length).toBeGreaterThanOrEqual(5)
      expect(planningWPs.every(wp => wp.phase === 'pl')).toBe(true)
    })

    it('should return testing WPs for "te" phase', () => {
      const testingWPs = getWorkingPapersByPhase('te')
      expect(testingWPs.length).toBeGreaterThanOrEqual(3)
      expect(testingWPs.every(wp => wp.phase === 'te')).toBe(true)
    })

    it('should return empty array for invalid phase', () => {
      expect(getWorkingPapersByPhase('invalid')).toHaveLength(0)
    })
  })

  describe('getSignificantRiskPapers', () => {
    it('should return WPs flagged as significant risk', () => {
      const sigRiskWPs = getSignificantRiskPapers()
      expect(sigRiskWPs.length).toBeGreaterThanOrEqual(3)
      expect(sigRiskWPs.every(wp => wp.significantRisk === true)).toBe(true)
    })

    it('should include Revenue Testing and Journals & Override', () => {
      const sigRiskWPs = getSignificantRiskPapers()
      const ids = sigRiskWPs.map(wp => wp.id)
      expect(ids).toContain('d1')
      expect(ids).toContain('d6')
    })
  })

  describe('getDefaultFramework', () => {
    it('should return FRS 105 for micro entities', () => {
      const fw = getDefaultFramework('micro')
      expect(fw).toBeTruthy()
      expect(fw.label).toBe('FRS 105')
    })

    it('should return FRS 102 s1A for small entities', () => {
      const fw = getDefaultFramework('small')
      expect(fw).toBeTruthy()
      expect(fw.label).toBe('FRS 102 s1A')
    })

    it('should return IFRS for listed entities', () => {
      const fw = getDefaultFramework('listed')
      expect(fw).toBeTruthy()
      expect(fw.label).toBe('IFRS')
    })

    it('should return null for invalid size', () => {
      expect(getDefaultFramework('nonexistent')).toBeNull()
    })
  })
})
