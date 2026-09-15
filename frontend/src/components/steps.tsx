import type { OnboardingStep } from "../types";
import { PatientAge } from "./PatientAge";
import { PatientGender } from "./PatientGender";
import { TherapistMinorityCompetence } from "./TherapistMinorityCompetence";

export const onboardingSteps: OnboardingStep[] = [
  { stepId: "patient-age", label: "Patient Age", element: PatientAge },
  {
    stepId: "patient-gender",
    label: "Patient Gender",
    element: PatientGender,
  },
  {
    stepId: "therapist-minority-competence",
    label: "Therapist Minority Competence",
    element: TherapistMinorityCompetence,
  },
];

export const firstOnboardingStepId = onboardingSteps[0].stepId;

export function getOnboardingStepById(
  stepId: string | undefined,
): OnboardingStep | undefined {
  return onboardingSteps.find((step) => step.stepId === stepId);
}
