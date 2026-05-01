import { useState, useCallback } from "react";
import { TOUR_STEPS } from "./tourSteps";
import TourStep from "./TourStep"; // eslint-disable-line no-unused-vars
import AgentShowcase from "./AgentShowcase"; // eslint-disable-line no-unused-vars

/**
 * DemoTour — orchestrates the guided demo walkthrough.
 * Manages step state, auto-advance toggle, and renders the current step.
 *
 * Usage: <DemoTour active={true} onComplete={() => setTourActive(false)} />
 */
export default function DemoTour({ active, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const step = TOUR_STEPS[currentStep];

  const handleNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onComplete?.();
    }
  }, [currentStep, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    setCurrentStep(0);
    setAutoAdvance(false);
    onComplete?.();
  }, [onComplete]);

  const handleToggleAuto = useCallback(() => {
    setAutoAdvance((a) => !a);
  }, []);

  if (!active || !step) return null;

  return (
    <TourStep
      step={step}
      stepIndex={currentStep}
      totalSteps={TOUR_STEPS.length}
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
      autoAdvance={autoAdvance}
      onToggleAuto={handleToggleAuto}
    >
      {step.showAgentDemo && <AgentShowcase />}
    </TourStep>
  );
}
