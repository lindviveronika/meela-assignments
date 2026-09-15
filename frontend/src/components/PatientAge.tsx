import type { OnboardingStepId, StepProps } from "../types";

function ButtonWithOutline({
  value,
  buttonValue,
  onClick,
}: {
  value: string | undefined;
  buttonValue: string;
  onClick: () => void;
}) {
  return (
    <button
      style={{ outline: value === buttonValue ? "2px solid blue" : "none" }}
      onClick={onClick}
    >
      {buttonValue}
    </button>
  );
}

const KEY: OnboardingStepId = "patient-age";

export function PatientAge({ answers, setAnswer }: StepProps) {
  const value = answers[KEY];
  return (
    <div>
      <ButtonWithOutline
        value={value}
        buttonValue="18-25"
        onClick={() => setAnswer(KEY, "18-25")}
      />
      <ButtonWithOutline
        value={value}
        buttonValue="26-35"
        onClick={() => setAnswer(KEY, "26-35")}
      />
      <ButtonWithOutline
        value={value}
        buttonValue="36-45"
        onClick={() => setAnswer(KEY, "36-45")}
      />
      <ButtonWithOutline
        value={value}
        buttonValue="46-55"
        onClick={() => setAnswer(KEY, "46-55")}
      />
      <ButtonWithOutline
        value={value}
        buttonValue="56-65"
        onClick={() => setAnswer(KEY, "56-65")}
      />
      <ButtonWithOutline
        value={value}
        buttonValue="65+"
        onClick={() => setAnswer(KEY, "65+")}
      />
    </div>
  );
}
