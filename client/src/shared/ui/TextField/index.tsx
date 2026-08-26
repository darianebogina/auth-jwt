import {useId} from "react";
import type {InputHTMLAttributes} from "react";
import styles from "./styles.module.css";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export const TextField = ({label, error, id, className, ...rest}: TextFieldProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={inputId}>
                {label}
            </label>
            <input
                id={inputId}
                className={[styles.input, error && styles.invalid, className].filter(Boolean).join(" ")}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
                {...rest}
            />
            {error && (
                <span id={`${inputId}-error`} className={styles.error}>
          {error}
        </span>
            )}
        </div>
    );
};
