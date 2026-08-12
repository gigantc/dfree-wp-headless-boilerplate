import Link from "next/link";
import styles from "./Button.module.scss";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "text";
  target?: "_self" | "_blank";
  className?: string;
};

const Button = ({
  href,
  children,
  variant = "primary",
  target = "_self",
  className = "",
}: ButtonProps) => {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  return (
    <Link href={href} target={target} className={classes}>
      {children}
    </Link>
  );
};

export default Button;
