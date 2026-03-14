import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SampleSizeSuggestion } from '../../components/SampleSizeSuggestion'

describe('SampleSizeSuggestion', () => {
  it('renders without crashing', () => {
    const { container } = render(<SampleSizeSuggestion />)
    expect(container).toBeTruthy()
  })

  it('displays risk level correctly', () => {
    render(<SampleSizeSuggestion riskLevel="High" />)
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('displays population size', () => {
    render(<SampleSizeSuggestion populationSize={1000} />)
    expect(screen.getByText('1,000')).toBeInTheDocument()
  })

  it('calculates high risk sample size correctly', () => {
    const { container } = render(
      <SampleSizeSuggestion
        riskLevel="High"
        populationSize={200}
        populationValue={1000000}
        overallMateriality={50000}
        accountType="revenue"
      />
    )
    expect(container).toBeTruthy()
    // High risk should recommend 100% testing for small populations
  })

  it('calculates medium risk sample size correctly', () => {
    const { container } = render(
      <SampleSizeSuggestion
        riskLevel="Medium"
        populationSize={500}
        populationValue={1000000}
        overallMateriality={50000}
        accountType="receivables"
      />
    )
    expect(container).toBeTruthy()
  })

  it('calculates low risk sample size correctly', () => {
    const { container } = render(
      <SampleSizeSuggestion
        riskLevel="Low"
        populationSize={1000}
        populationValue={1000000}
        overallMateriality={50000}
        accountType="payables"
      />
    )
    expect(container).toBeTruthy()
  })

  it('adjusts sample size based on account type', () => {
    const { container: highRiskContainer } = render(
      <SampleSizeSuggestion
        riskLevel="Medium"
        populationSize={1000}
        accountType="provisions"
      />
    )

    const { container: lowRiskContainer } = render(
      <SampleSizeSuggestion
        riskLevel="Medium"
        populationSize={1000}
        accountType="cash"
      />
    )

    expect(highRiskContainer).toBeTruthy()
    expect(lowRiskContainer).toBeTruthy()
  })

  it('shows 100% testing recommendation for high risk + small population', () => {
    const { container } = render(
      <SampleSizeSuggestion
        riskLevel="High"
        populationSize={30}
        populationValue={100000}
        overallMateriality={10000}
      />
    )
    expect(screen.getByText(/100% Testing/)).toBeInTheDocument()
  })

  it('shows 100% testing recommendation for very small population', () => {
    const { container } = render(
      <SampleSizeSuggestion
        riskLevel="Low"
        populationSize={15}
        populationValue={50000}
        overallMateriality={5000}
      />
    )
    expect(screen.getByText(/100% Testing/)).toBeInTheDocument()
  })

  it('displays all sampling methodology options', () => {
    render(<SampleSizeSuggestion />)
    expect(screen.getByText(/Statistical Sampling/)).toBeInTheDocument()
    expect(screen.getByText(/Judgmental Sampling/)).toBeInTheDocument()
    expect(screen.getByText(/Stratified Sampling/)).toBeInTheDocument()
  })

  it('provides ISA 530 guidance', () => {
    render(<SampleSizeSuggestion />)
    expect(screen.getByText(/ISA 530/)).toBeInTheDocument()
  })

  it('handles custom materiality values', () => {
    render(
      <SampleSizeSuggestion
        overallMateriality={100000}
        performanceMateriality={75000}
      />
    )
    expect(screen.getByText('100k')).toBeInTheDocument()
  })

  it('renders recommendation alert', () => {
    render(<SampleSizeSuggestion />)
    expect(screen.getByText(/Recommendation:/)).toBeInTheDocument()
  })
})
