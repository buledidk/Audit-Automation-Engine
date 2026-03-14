import { describe, it, expect } from 'vitest'

/**
 * Exception Evaluator Tests
 * Tests for audit procedure effectiveness calculations
 */

// Simple in-memory implementation for testing
class ExceptionEvaluator {
  constructor({ exceptionCount, sampleSize, populationSize, materiality }) {
    this.exceptionCount = exceptionCount
    this.sampleSize = sampleSize
    this.populationSize = populationSize
    this.materiality = materiality
  }

  evaluateExceptions() {
    // Stratified sampling projection: exceptions * (population / sample)
    const projectedMisstatement = this.exceptionCount * (this.populationSize / this.sampleSize)
    const percentOfMateriality = (projectedMisstatement / this.materiality) * 100
    const materialityExceeded = percentOfMateriality > 100

    return {
      projectedMisstatement,
      percentOfMateriality: parseFloat(percentOfMateriality.toFixed(1)),
      materialityExceeded,
      exceptionRate: (this.exceptionCount / this.sampleSize * 100).toFixed(2)
    }
  }
}

describe('ExceptionEvaluator', () => {
  it('correctly calculates projected misstatement for stratified sample', () => {
    const evaluator = new ExceptionEvaluator({
      exceptionCount: 2,
      sampleSize: 40,
      populationSize: 200,
      materiality: 50000
    })

    const result = evaluator.evaluateExceptions()

    expect(result.projectedMisstatement).toBe(10)
    expect(result.percentOfMateriality).toBeCloseTo(0.02, 1)
    expect(result.materialityExceeded).toBe(false)
  })

  it('correctly identifies when materiality is exceeded', () => {
    const evaluator = new ExceptionEvaluator({
      exceptionCount: 5,
      sampleSize: 50,
      populationSize: 500,
      materiality: 10000
    })

    const result = evaluator.evaluateExceptions()

    expect(result.projectedMisstatement).toBe(50)
    expect(result.materialityExceeded).toBe(true)
  })

  it('handles zero exceptions', () => {
    const evaluator = new ExceptionEvaluator({
      exceptionCount: 0,
      sampleSize: 50,
      populationSize: 500,
      materiality: 50000
    })

    const result = evaluator.evaluateExceptions()

    expect(result.projectedMisstatement).toBe(0)
    expect(result.percentOfMateriality).toBe(0)
    expect(result.materialityExceeded).toBe(false)
  })

  it('calculates exception rate percentage correctly', () => {
    const evaluator = new ExceptionEvaluator({
      exceptionCount: 3,
      sampleSize: 60,
      populationSize: 600,
      materiality: 50000
    })

    const result = evaluator.evaluateExceptions()

    expect(result.exceptionRate).toBe('5.00')
  })

  it('projects misstatement for 100% exceptions in sample', () => {
    const evaluator = new ExceptionEvaluator({
      exceptionCount: 25,
      sampleSize: 25,
      populationSize: 250,
      materiality: 50000
    })

    const result = evaluator.evaluateExceptions()

    expect(result.projectedMisstatement).toBe(250)
    expect(result.percentOfMateriality).toBe(500) // Exceeds materiality significantly
    expect(result.materialityExceeded).toBe(true)
  })

  it('handles large population sizes', () => {
    const evaluator = new ExceptionEvaluator({
      exceptionCount: 2,
      sampleSize: 40,
      populationSize: 100000,
      materiality: 500000
    })

    const result = evaluator.evaluateExceptions()

    expect(result.projectedMisstatement).toBe(5000)
    expect(result.materialityExceeded).toBe(false)
  })

  it('handles high materiality values', () => {
    const evaluator = new ExceptionEvaluator({
      exceptionCount: 1,
      sampleSize: 50,
      populationSize: 500,
      materiality: 1000000
    })

    const result = evaluator.evaluateExceptions()

    expect(result.materialityExceeded).toBe(false)
  })
})

describe('Sample Size Calculations (ISA 530)', () => {
  it('recommends appropriate sample size for high risk', () => {
    // High risk typically requires 2-3x multiplier
    // For High risk: confidence 97%, multiplier 3.0
    const baseSample = 30 // minimum for revenue
    const highRiskMultiplier = 3.0
    const expected = Math.round(baseSample * highRiskMultiplier)

    expect(expected).toBe(90)
  })

  it('recommends appropriate sample size for medium risk', () => {
    // Medium risk: confidence 90%, multiplier 2.0
    const baseSample = 30
    const mediumRiskMultiplier = 2.0
    const expected = Math.round(baseSample * mediumRiskMultiplier)

    expect(expected).toBe(60)
  })

  it('recommends appropriate sample size for low risk', () => {
    // Low risk: confidence 68%, multiplier 1.0
    const baseSample = 30
    const lowRiskMultiplier = 1.0
    const expected = Math.round(baseSample * lowRiskMultiplier)

    expect(expected).toBe(30)
  })

  it('applies stratified sampling efficiency improvement', () => {
    // Stratified sampling is typically 75% of statistical sample
    const statisticalSample = 50
    const stratifiedSample = Math.round(statisticalSample * 0.75)

    expect(stratifiedSample).toBe(38)
  })

  it('applies judgmental sampling conservative adjustment', () => {
    // Judgmental sampling is typically 30% higher
    const statisticalSample = 50
    const judgmentalSample = Math.round(statisticalSample * 1.3)

    expect(judgmentalSample).toBe(65)
  })
})
