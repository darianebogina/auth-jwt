import type {HTMLAttributes} from "react";
import styles from "./styles.module.css";

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({className, children, ...rest}: CardProps) => (
    <div className={[styles.card, className].filter(Boolean).join(" ")} {...rest}>
        {children}
    </div>
);
