import styles from "./Button.module.css";

export function Button({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
