import styles from "./RadioTile.module.css";

interface RadioTileProps {
  label: string;
  isSelected: boolean;
  onSelectChange: () => void;
  name: string;
}

export function RadioTile({
  label,
  isSelected,
  onSelectChange,
  name,
}: RadioTileProps) {
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
