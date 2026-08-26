import type {ButtonHTMLAttributes, ReactNode} from "react";
import styles from "./styles.module.css";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
    children: ReactNode;
};

export const Button = ({
                           variant = "primary",
                           fullWidth = false,
                           className,
                           children,
                           ...rest
                       }: ButtonProps) => {
    const classes = [styles.button, styles[variant], fullWidth && styles.fullWidth, className]
        .filter(Boolean)
        .join(" ");

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    );
};
