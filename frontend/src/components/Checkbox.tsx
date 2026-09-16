import styles from "./Checkbox.module.css";

export function Checkbox({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
}) {
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
