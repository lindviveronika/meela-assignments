import styles from "./Checkbox.module.css";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
}

export function Checkbox({ checked, onCheckedChange, label }: CheckboxProps) {
  return (
    <label className={styles.label}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        onChange={onCheckedChange}
      />
      {label}
    </label>
  );
}
