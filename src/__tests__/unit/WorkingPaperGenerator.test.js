import { describe, it, expect } from 'vitest'
import WorkingPaperGenerator from '../../services/WorkingPaperGenerator.js'
import { WORKING_PAPERS } from '../../data/AuditFrameworks.js'
import { INDUSTRY_KEYS } from '../../data/IndustryWorkingPapers.js'

describe('WorkingPaperGenerator', () => {
  const defaultConfig = {
    industry: 'construction',
    framework: 'frs102',
    entitySize: 'medium',
    engagement: {
      name: 'Test Construction Ltd',
      fye: '31/12/2025',
      partner: 'J Smith',
      manager: 'A Jones',
      firm: 'Test & Co',
    },
  }

  describe('constructor', () => {
    it('should create generator with valid config', () => {
      const gen = new WorkingPaperGenerator(defaultConfig)
      expect(gen).toBeTruthy()
      expect(gen.industryKey).toBe('construction')
      expect(gen.industry.label).toBe('Construction & Infrastructure')
    })

    it('should throw for invalid industry', () => {
      expect(() => new WorkingPaperGenerator({
        ...defaultConfig,
        industry: 'nonexistent',
      })).toThrow('Unknown industry')
    })

    it('should work with all 8 industries', () => {
      for (const key of INDUSTRY_KEYS) {
        const gen = new WorkingPaperGenerator({ ...defaultConfig, industry: key })
        expect(gen.industry).toBeTruthy()
      }
    })

    it('should default framework from entity size when framework not specified', () => {
      const gen = new WorkingPaperGenerator({
        industry: 'construction',
        entitySize: 'micro',
        engagement: {},
      })
      expect(gen.framework.label).toBe('FRS 105')
    })
  })

  describe('generateAll', () => {
    it('should generate all 22 working papers', () => {
      const gen = new WorkingPaperGenerator(defaultConfig)
      const papers = gen.generateAll()
      expect(Object.keys(papers)).toHaveLength(WORKING_PAPERS.length)
    })

    it('every generated paper should have base fields', () => {
      const gen = new WorkingPaperGenerator(defaultConfig)
      const papers = gen.generateAll()
      for (const [id, paper] of Object.entries(papers)) {
        expect(paper.ref, `${id} missing ref`).toBeTruthy()
        expect(paper.title, `${id} missing title`).toBeTruthy()
        expect(paper.phase, `${id} missing phase`).toBeTruthy()
        expect(paper.industry, `${id} missing industry`).toBe('Construction & Infrastructure')
        expect(paper.framework, `${id} missing framework`).toBe('FRS 102')
        expect(paper.generatedAt, `${id} missing generatedAt`).toBeTruthy()
      }
    })
  })

  describe('generate — A5 Materiality', () => {
    it('should include benchmark and percentage for construction', () => {
      const gen = new WorkingPaperGenerator(defaultConfig)
      const a5 = gen.generate('a5')
      expect(a5.benchmark).toBe('Revenue')
      expect(a5.percentage).toBe('1-2%')
      expect(a5.rationale).toBeTruthy()
      expect(a5.alternatives.length).toBeGreaterThan(0)
      expect(a5.isaReferences).toContain('ISA 320.10')
    })
  })

  describe('generate — A7 Significant Risks', () => {
    it('should include significant risks', () => {
      const gen = new WorkingPaperGenerator(defaultConfig)
      const a7 = gen.generate('a7')
      expect(a7.significantRisks.length).toBeGreaterThanOrEqual(2)
      expect(a7.isaReferences).toContain('ISA 330.18')
    })
  })

  describe('generate — D6 Journal Testing', () => {
    it('should include ISA 240.32 requirements', () => {
      const gen = new WorkingPaperGenerator(defaultConfig)
      const d6 = gen.generate('d6')
      expect(d6.isaRequirements.length).toBe(4)
      expect(d6.riskCriteria.length).toBeGreaterThan(0)
      expect(d6.isaReferences).toContain('ISA 240.31-33 (irrebuttable)')
    })
  })

  describe('generate — F2 Audit Report', () => {
    it('should include report sections', () => {
      const gen = new WorkingPaperGenerator(defaultConfig)
      const f2 = gen.generate('f2')
      expect(f2.reportType).toBe('ISA 700 \u2014 Unmodified Opinion')
      expect(f2.sections.length).toBeGreaterThanOrEqual(7)
      expect(f2.framework).toBe('FRS 102')
    })
  })

  describe('cross-industry generation', () => {
    it('should generate complete papers for all 8 industries', () => {
      for (const key of INDUSTRY_KEYS) {
        const gen = new WorkingPaperGenerator({
          industry: key,
          framework: 'frs102',
          entitySize: 'medium',
          engagement: { name: `Test ${key}` },
        })
        const papers = gen.generateAll()
        expect(Object.keys(papers).length, `${key} papers count`).toBe(WORKING_PAPERS.length)
        const a5 = papers.a5
        expect(a5.benchmark, `${key} materiality benchmark`).toBeTruthy()
        const a7 = papers.a7
        expect(a7.significantRisks.length, `${key} sig risks`).toBeGreaterThanOrEqual(2)
      }
    })
  })
})
