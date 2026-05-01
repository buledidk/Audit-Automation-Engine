import { describe, it, expect } from 'vitest'
import I, {
  getIndustry,
  getIndustryRisks,
  getIndustryProcedures,
  getIndustryMateriality,
  getIndustryLabels,
  INDUSTRY_KEYS,
  INDUSTRY_COUNT,
} from '../../data/IndustryWorkingPapers.js'

describe('IndustryWorkingPapers', () => {
  describe('INDUSTRY_KEYS', () => {
    it('should have exactly 8 industries', () => {
      expect(INDUSTRY_KEYS).toHaveLength(8)
      expect(INDUSTRY_COUNT).toBe(8)
    })

    it('should include all expected industry keys', () => {
      const expected = [
        'construction', 'manufacturing', 'technology',
        'financial_services', 'retail', 'professional_services', 'property', 'charities'
      ]
      for (const key of expected) {
        expect(INDUSTRY_KEYS).toContain(key)
      }
    })
  })

  describe('getIndustry', () => {
    it('should return industry data for valid key', () => {
      const construction = getIndustry('construction')
      expect(construction).toBeTruthy()
      expect(construction.label).toBe('Construction & Infrastructure')
      expect(construction.sectors).toBeInstanceOf(Array)
      expect(construction.sectors.length).toBeGreaterThan(0)
    })

    it('should return null for invalid key', () => {
      expect(getIndustry('nonexistent')).toBeNull()
      expect(getIndustry('')).toBeNull()
      expect(getIndustry(null)).toBeNull()
    })

    it('each industry should have required fields', () => {
      for (const key of INDUSTRY_KEYS) {
        const ind = getIndustry(key)
        expect(ind, `${key} missing`).toBeTruthy()
        expect(ind.label, `${key}.label`).toBeTruthy()
        expect(ind.icon, `${key}.icon`).toBeTruthy()
        expect(ind.color, `${key}.color`).toMatch(/^#[0-9A-Fa-f]{6}$/)
        expect(ind.sectors, `${key}.sectors`).toBeInstanceOf(Array)
        expect(ind.acceptance, `${key}.acceptance`).toBeInstanceOf(Array)
        expect(ind.understanding, `${key}.understanding`).toBeInstanceOf(Array)
        expect(ind.fraud, `${key}.fraud`).toBeInstanceOf(Array)
        expect(ind.sigRisks, `${key}.sigRisks`).toBeInstanceOf(Array)
        expect(ind.risks, `${key}.risks`).toBeInstanceOf(Array)
        expect(ind.procs, `${key}.procs`).toBeInstanceOf(Array)
        expect(ind.leads, `${key}.leads`).toBeTruthy()
        expect(ind.kpis, `${key}.kpis`).toBeInstanceOf(Array)
        expect(ind.disc, `${key}.disc`).toBeTruthy()
        expect(ind.gc, `${key}.gc`).toBeInstanceOf(Array)
        expect(ind.ml, `${key}.ml`).toBeInstanceOf(Array)
      }
    })
  })

  describe('getIndustryRisks', () => {
    it('should return risks for construction', () => {
      const risks = getIndustryRisks('construction')
      expect(risks).toBeTruthy()
      expect(risks.significantRisks.length).toBeGreaterThanOrEqual(2)
      expect(risks.risks.length).toBeGreaterThanOrEqual(3)
      expect(risks.fraudRisks.length).toBeGreaterThanOrEqual(3)
    })

    it('significant risks should have required fields', () => {
      for (const key of INDUSTRY_KEYS) {
        const risks = getIndustryRisks(key)
        for (const sr of risks.significantRisks) {
          expect(sr.id, `${key} SR missing id`).toBeTruthy()
          expect(sr.risk, `${key} SR missing risk`).toBeTruthy()
          expect(sr.resp, `${key} SR missing resp`).toBeTruthy()
          expect(sr.isa, `${key} SR missing isa`).toBeTruthy()
        }
      }
    })

    it('detailed risks should have risk levels', () => {
      const validLevels = ['SIGNIFICANT', 'ELEVATED', 'NORMAL']
      for (const key of INDUSTRY_KEYS) {
        const risks = getIndustryRisks(key)
        for (const r of risks.risks) {
          expect(validLevels, `${key} risk ${r.id} invalid level: ${r.lv}`).toContain(r.lv)
        }
      }
    })

    it('should return null for invalid key', () => {
      expect(getIndustryRisks('nonexistent')).toBeNull()
    })
  })

  describe('ISA compliance', () => {
    it('every industry should have management override as irrebuttable significant risk', () => {
      for (const key of INDUSTRY_KEYS) {
        const risks = getIndustryRisks(key)
        const hasOverride = risks.significantRisks.some(
          sr => sr.isa && sr.isa.includes('240.31-33')
        )
        expect(hasOverride, `${key} missing ISA 240.31-33 irrebuttable risk`).toBe(true)
      }
    })

    it('industries without rebuttal should have revenue recognition as presumed significant risk', () => {
      const rebutted = ['financial_services', 'professional_services', 'charities']
      for (const key of INDUSTRY_KEYS) {
        if (rebutted.includes(key)) continue
        const risks = getIndustryRisks(key)
        const hasRevenue = risks.significantRisks.some(
          sr => sr.isa && sr.isa.includes('240.26')
        )
        expect(hasRevenue, `${key} missing ISA 240.26 revenue recognition risk`).toBe(true)
      }
    })
  })

  describe('default export', () => {
    it('should export the full industry data object', () => {
      expect(I).toBeTruthy()
      expect(typeof I).toBe('object')
      expect(Object.keys(I)).toHaveLength(8)
    })
  })
})
