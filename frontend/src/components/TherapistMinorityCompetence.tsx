import type { OnboardingStepId, StepProps } from "../types";

const KEY: OnboardingStepId = "therapist-minority-competence";

export function TherapistMinorityCompetence({ answers, setAnswer }: StepProps) {
  const value = answers[KEY];
  return (
    <div>
      <button
        style={{ outline: value === "lgbtq+" ? "2px solid blue" : "none" }}
        onClick={() => setAnswer(KEY, "lgbtq+")}
      >
        LGBTQ+
      </button>
      <button
        style={{
          outline: value === "minority-stress" ? "2px solid blue" : "none",
        }}
        onClick={() => setAnswer(KEY, "minority-stress")}
      >
        Minority Stress
      </button>
      {/* TODO: Add all steps */}
    </div>
  );
}
