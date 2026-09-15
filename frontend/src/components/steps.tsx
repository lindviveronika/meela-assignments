import type { OnboardingStep } from "../types";
import { PatientAge } from "./PatientAge";
import { PatientGender } from "./PatientGender";
import { TherapistMinorityCompetence } from "./TherapistMinorityCompetence";

export const onboardingSteps: OnboardingStep[] = [
  { stepId: "patient-age", question: "How old are you?", element: PatientAge },
  {
    stepId: "patient-gender",
    question: "What gender do you identify as?",
    element: PatientGender,
  },
  {
    stepId: "therapist-minority-competence",
    question:
      "Do you want your therapist to have knowledge in any of these areas?",
    element: TherapistMinorityCompetence,
  },
];

export const firstOnboardingStepId = onboardingSteps[0].stepId;

export function getOnboardingStepById(
  stepId: string | undefined,
): OnboardingStep | undefined {
  return onboardingSteps.find((step) => step.stepId === stepId);
}
