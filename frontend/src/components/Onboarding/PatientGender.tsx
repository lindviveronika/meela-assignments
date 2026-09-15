import type { OnboardingStepId, StepProps } from "../../types";

const KEY: OnboardingStepId = "patient-gender";

export function PatientGender({ setAnswer, answers }: StepProps) {
  const value = answers[KEY];

  return (
    <div>
      <button
        style={{ outline: value === "male" ? "2px solid blue" : "none" }}
        onClick={() => setAnswer(KEY, "male")}
      >
        Male
      </button>
      <button
        style={{
          outline: value === "female" ? "2px solid blue" : "none",
        }}
        onClick={() => setAnswer(KEY, "female")}
      >
        Female
      </button>
      <button
        style={{
          outline: value === "non-binary" ? "2px solid blue" : "none",
        }}
        onClick={() => setAnswer(KEY, "non-binary")}
      >
        Non-binary
      </button>
    </div>
  );
}
