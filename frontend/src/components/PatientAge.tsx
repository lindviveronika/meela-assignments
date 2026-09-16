import { ageRangeSchema, type StepProps } from "../types";
import { QUESTION_ID } from "./OnboardingForm";
import styles from "./PatientAge.module.css";
import { RadioTile } from "./RadioTile";

export function PatientAge({ answers, setAnswer }: StepProps) {
  const value = answers["patient-age"];
  const ageRanges = ageRangeSchema.options;

  return (
    <div
      role="radiogroup"
      aria-labelledby={QUESTION_ID}
      className={styles.container}
    >
      {ageRanges.map((ageRange) => (
        <RadioTile
          key={ageRange}
          label={ageRange}
          name="patient-age"
          isSelected={value === ageRange}
          onSelectChange={() => setAnswer("patient-age", ageRange)}
        />
      ))}
    </div>
  );
}
