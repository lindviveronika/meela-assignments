import styles from "./Button.module.css";

export function Button({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
