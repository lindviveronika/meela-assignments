import type { OnboardingStep } from "../../types";
import { PatientAge } from "./PatientAge";
import { PatientGender } from "./PatientGender";

export const onboardingSteps: OnboardingStep[] = [
  { stepId: "patient-age", label: "Patient Age", element: <PatientAge /> },
  {
    stepId: "patient-gender",
    label: "Patient Gender",
    element: <PatientGender />,
  },
];

export const firstOnboardingStepId = onboardingSteps[0].stepId;

export function getOnboardingStepById(
  stepId: string | undefined,
): OnboardingStep | undefined {
  return onboardingSteps.find((step) => step.stepId === stepId);
}
