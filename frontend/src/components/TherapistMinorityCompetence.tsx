import {
  minorityCompetenceSchema,
  type MinorityCompetence,
  type StepProps,
} from "../types";
import { Checkbox } from "./Checkbox";
import styles from "./TherapistMinorityCompetence.module.css";

const LABELS: Record<MinorityCompetence, string> = {
  "lgbtq+": "LGBTQ+",
  "minority-stress": "Minority Stress",
  neurodivergent: "Neurodivergent",
  "polyamorous-relationships": "Polyamorous Relationships",
  rbts: "Race-Based Traumatic Stress (RBTS)",
  "transgender-knowledge": "Transgender Knowledge",
};

export function TherapistMinorityCompetence({ answers, setAnswer }: StepProps) {
  const value = answers["therapist-minority-competence"];
  const options = minorityCompetenceSchema.options;

  const removeOption = (option: MinorityCompetence) => {
    setAnswer(
      "therapist-minority-competence",
      value?.filter((v) => v !== option),
    );
  };

  const addOption = (option: MinorityCompetence) => {
    setAnswer("therapist-minority-competence", [...(value ?? []), option]);
  };

  const handleCheckedChange = (option: MinorityCompetence) => {
    if (value?.includes(option)) {
      removeOption(option);
      return;
    }

    addOption(option);
  };

  return (
    <div className={styles.container}>
      {options.map((option) => (
        <Checkbox
          label={LABELS[option] ?? option}
          key={option}
          checked={value?.includes(option) ?? false}
          onCheckedChange={() => handleCheckedChange(option)}
        />
      ))}
    </div>
  );
}
