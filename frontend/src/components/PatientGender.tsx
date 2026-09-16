import { genderSchema, type StepProps } from "../types";
import { QUESTION_ID } from "./OnboardingForm";
import styles from "./PatientGender.module.css";
import { RadioTile } from "./RadioTile";

export function PatientGender({ setAnswer, answers }: StepProps) {
  const value = answers["patient-gender"];
  const genderOptions = genderSchema.options;

  return (
    <div
      role="radiogroup"
      aria-labelledby={QUESTION_ID}
      className={styles.container}
    >
      {genderOptions.map((gender) => (
        <RadioTile
          name="patient-gender"
          key={gender}
          label={gender.charAt(0).toUpperCase() + gender.slice(1)}
          isSelected={value === gender}
          onSelectChange={() => setAnswer("patient-gender", gender)}
        />
      ))}
    </div>
  );
}
