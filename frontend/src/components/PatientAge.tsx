import type { AgeRange, StepProps } from "../types";
import styles from "./PatientAge.module.css";
import { RadioTile } from "./RadioTile";

export function PatientAge({ answers, setAnswer }: StepProps) {
  const value = answers["patient-age"];
  const ageRanges: AgeRange[] = [
    "18-25",
    "26-35",
    "36-45",
    "46-55",
    "56-65",
    "65+",
  ];

  return (
    <div className={styles.container}>
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
