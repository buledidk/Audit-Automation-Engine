import { describe, it, expect } from 'vitest';
import {
  IPVEngine, ipvEngine,
  IPV_REFERENCE_SOURCES, IFRS13_HIERARCHY,
  CREDIT_RATING_PD_MAP, IPV_CONTROLS, ISA_620_CHECKLIST
} from '../../services/ipvEngine.js';

describe('IPVEngine', () => {
  describe('exports', () => {
    it('should export IPVEngine class and singleton', () => {
      expect(IPVEngine).toBeTruthy();
      expect(ipvEngine).toBeInstanceOf(IPVEngine);
    });

    it('should export reference sources with URLs', () => {
      expect(Object.keys(IPV_REFERENCE_SOURCES).length).toBeGreaterThanOrEqual(10);
      expect(IPV_REFERENCE_SOURCES.lse.url).toContain('londonstockexchange');
      expect(IPV_REFERENCE_SOURCES.boeYield.url).toContain('bankofengland');
      expect(IPV_REFERENCE_SOURCES.fcaRegister.url).toContain('fca.org.uk');
      expect(IPV_REFERENCE_SOURCES.landRegistry.url).toContain('gov.uk');
    });

    it('should export IFRS 13 hierarchy with 3 levels', () => {
      expect(IFRS13_HIERARCHY[1].level).toBe(1);
      expect(IFRS13_HIERARCHY[2].level).toBe(2);
      expect(IFRS13_HIERARCHY[3].level).toBe(3);
    });

    it('should export credit rating PD map from AAA to D', () => {
      expect(CREDIT_RATING_PD_MAP.AAA.pd).toBeLessThan(CREDIT_RATING_PD_MAP.D.pd);
      expect(CREDIT_RATING_PD_MAP.D.pd).toBe(1.0);
      expect(Object.keys(CREDIT_RATING_PD_MAP)).toContain('BBB');
    });

    it('should export 6 IPV controls', () => {
      expect(IPV_CONTROLS.length).toBe(6);
      IPV_CONTROLS.forEach(c => {
        expect(c.id).toBeTruthy();
        expect(c.risk).toBeTruthy();
        expect(c.control).toBeTruthy();
        expect(c.isa).toBeTruthy();
      });
    });

    it('should export 10-item ISA 620 checklist', () => {
      expect(ISA_620_CHECKLIST.length).toBe(10);
      ISA_620_CHECKLIST.forEach(c => {
        expect(c.id).toMatch(/^isa620_/);
        expect(c.item).toBeTruthy();
        expect(c.isa).toContain('ISA 620');
      });
    });
  });

  describe('verifyListedSecurity', () => {
    it('should flag >1% variance as exception', () => {
      const result = ipvEngine.verifyListedSecurity({
        isin: 'GB0000000001', ticker: 'TEST.L', exchange: 'LSE',
        name: 'Test PLC', clientPrice: 100, independentPrice: 98, quantity: 1000
      });
      expect(result.ifrs13Level).toBe(1);
      expect(result.status).toBe('exception');
      expect(result.variancePct).toBeGreaterThan(1);
      expect(result.clientValue).toBe(100000);
      expect(result.independentValue).toBe(98000);
    });

    it('should mark <1% variance as agreed', () => {
      const result = ipvEngine.verifyListedSecurity({
        ticker: 'SAFE.L', exchange: 'LSE', name: 'Safe PLC',
        clientPrice: 100, independentPrice: 99.5, quantity: 100
      });
      expect(result.status).toBe('agreed');
      expect(result.variancePct).toBeLessThan(1);
    });
  });

  describe('verifySemiListedSecurity', () => {
    it('should flag inactive market (>30 days since last trade)', () => {
      const result = ipvEngine.verifySemiListedSecurity({
        name: 'Thinly Traded Bond', clientValue: 100000,
        lastTradeDate: new Date(Date.now() - 45 * 86400000).toISOString(),
        bidPrice: 98, askPrice: 102, quantity: 1000
      });
      expect(result.ifrs13Level).toBe(2);
      expect(result.isInactiveMarket).toBe(true);
      expect(result.status).toBe('exception');
    });

    it('should use broker quote average when available', () => {
      const result = ipvEngine.verifySemiListedSecurity({
        name: 'OTC Bond', clientValue: 100000,
        lastTradeDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        brokerQuotes: [{ value: 99000 }, { value: 101000 }]
      });
      expect(result.independentValue).toBe(100000);
      expect(result.methodology).toContain('broker quotes');
    });
  });

  describe('verifyUnlistedInvestment', () => {
    it('should return Level 3 with sensitivity analysis', () => {
      const result = ipvEngine.verifyUnlistedInvestment({
        name: 'PE Fund', clientValue: 500000,
        valuationMethod: 'DCF',
        assumptions: { discountRate: 0.12 }
      });
      expect(result.ifrs13Level).toBe(3);
      expect(result.sensitivityAnalysis.scenarios).toHaveLength(5);
      expect(result.sensitivityAnalysis.range).toBeGreaterThan(0);
      expect(result.isa620Checklist).toHaveLength(10);
    });
  });

  describe('verifyLoanReceivable', () => {
    it('should calculate amortised cost and ECL', () => {
      const result = ipvEngine.verifyLoanReceivable({
        name: 'Term Loan', principal: 100000, rate: 0.05,
        termMonths: 12, clientValue: 105000, creditRating: 'BBB'
      });
      expect(result.type).toBe('loan_receivable');
      expect(result.effectiveRate).toBeTruthy();
      expect(result.eclAssessment.creditRating).toBe('BBB');
      expect(result.eclAssessment.eclAmount).toBeGreaterThan(0);
    });
  });

  describe('verifyDerivative', () => {
    it('should verify interest rate swap', () => {
      const result = ipvEngine.verifyDerivative({
        name: 'IRS 5yr', type: 'interest_rate_swap',
        notional: 1000000, clientValue: 25000,
        fixedRate: 0.04, maturityDate: '2028-06-30',
        counterparty: 'Barclays', creditRating: 'A'
      });
      expect(result.ifrs13Level).toBe(2);
      expect(result.methodology).toContain('fixed');
      expect(result.cvaAdjustment).toBeGreaterThanOrEqual(0);
    });

    it('should verify FX forward', () => {
      const result = ipvEngine.verifyDerivative({
        name: 'GBP/EUR Fwd', type: 'fx_forward',
        notional: 500000, clientValue: 15000,
        spotRate: 1.17, contractRate: 1.15, termMonths: 6,
        counterparty: 'HSBC', creditRating: 'AA'
      });
      expect(result.methodology).toContain('Forward rate');
    });
  });

  describe('verifyInvestmentProperty', () => {
    it('should use yield-based valuation', () => {
      const result = ipvEngine.verifyInvestmentProperty({
        name: '42 Chancery Lane', clientValue: 2000000,
        rentalIncome: 120000, marketYield: 0.06
      });
      expect(result.ifrs13Level).toBe(3);
      expect(result.independentValue).toBe(2000000); // 120k / 6%
      expect(result.methodology).toContain('Yield');
    });

    it('should use comparable average', () => {
      const result = ipvEngine.verifyInvestmentProperty({
        name: 'Office Unit', clientValue: 500000,
        comparables: [{ value: 480000 }, { value: 520000 }, { value: 490000 }]
      });
      expect(result.independentValue).toBeCloseTo(496667, -1);
    });
  });

  describe('verifyPortfolio', () => {
    it('should aggregate portfolio results', () => {
      const result = ipvEngine.verifyPortfolio([
        { type: 'listed_security', ticker: 'A', name: 'A', clientPrice: 100, independentPrice: 99.5, quantity: 100, exchange: 'LSE' },
        { type: 'listed_security', ticker: 'B', name: 'B', clientPrice: 100, independentPrice: 95, quantity: 100, exchange: 'LSE' },
      ]);
      expect(result.summary.totalPositions).toBe(2);
      expect(result.summary.agreed).toBe(1);
      expect(result.summary.exceptions).toBe(1);
      expect(result.summary.coveragePct).toBe(100);
      expect(result.hierarchy.counts[1]).toBe(2);
    });
  });

  describe('assessCounterpartyCredit', () => {
    it('should map credit rating to PD/LGD', () => {
      const result = ipvEngine.assessCounterpartyCredit({
        name: 'Barclays', creditRating: 'A', exposure: 1000000
      });
      expect(result.investmentGrade).toBe(true);
      expect(result.pd).toBe(0.005);
      expect(result.expectedLoss).toBeGreaterThan(0);
    });

    it('should flag non-investment grade', () => {
      const result = ipvEngine.assessCounterpartyCredit({
        name: 'RiskyCo', creditRating: 'BB', exposure: 500000
      });
      expect(result.investmentGrade).toBe(false);
    });
  });

  describe('generateIPVWorkPaper', () => {
    it('should produce audit-ready work paper', () => {
      const portfolio = ipvEngine.verifyPortfolio([
        { type: 'listed_security', ticker: 'X', name: 'X', clientPrice: 10, independentPrice: 10, quantity: 100, exchange: 'LSE' },
      ]);
      const wp = ipvEngine.generateIPVWorkPaper(portfolio);
      expect(wp.title).toContain('Independent Price Verification');
      expect(wp.summary.totalPositions).toBe(1);
      expect(wp.controls).toHaveLength(6);
      expect(wp.isa620Checklist).toHaveLength(10);
      expect(wp.conclusion).toContain('independently verified');
    });
  });
});
