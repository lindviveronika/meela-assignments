import type { Gender, StepProps } from "../types";
import styles from "./PatientGender.module.css";
import { RadioTile } from "./RadioTile";

export function PatientGender({ setAnswer, answers }: StepProps) {
  const value = answers["patient-gender"];
  const genderOptions: Gender[] = ["male", "female", "non-binary"];

  return (
    <div className={styles.container}>
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
