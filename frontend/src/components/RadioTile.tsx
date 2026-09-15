import styles from "./RadioTile.module.css";

export function RadioTile({
  label,
  isSelected,
  onSelectChange,
  name,
}: {
  label: string;
  isSelected: boolean;
  onSelectChange: () => void;
  name: string;
}) {
  return (
    <label className={styles.label}>
      <input
        className={styles.input}
        name={name}
        type="radio"
        onChange={onSelectChange}
        checked={isSelected}
      />
      {label}
    </label>
  );
}
