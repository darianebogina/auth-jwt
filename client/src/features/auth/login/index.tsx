import {useState} from "react";
import type {FormEvent} from "react";
import {Button, TextField} from "@/shared/ui";
import {useSession} from "@/entities/session";
import styles from "./styles.module.css";

export type LoginFormValues = {
    email: string;
    password: string;
};

type LoginFormProps = {
    onSubmit?: (values: LoginFormValues) => void;
};

export const LoginForm = ({onSubmit}: LoginFormProps) => {
    const { login } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const result = await login({ email, password });
            if (result.ok) {
                onSubmit?.({ email, password });
            } else {
                setError("Неверный email или пароль");
            }
        } catch {
            setError("Не удалось войти, попробуйте ещё раз");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div>
                <h1 className={styles.title}>Вход</h1>
                <p className={styles.subtitle}>Введите email и пароль</p>
            </div>

            <TextField
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isSubmitting}
            />

            <TextField
                label="Пароль"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={isSubmitting}
            />

            {error && <p className={styles.formError}>{error}</p>}

            <Button type="submit" fullWidth disabled={isSubmitting}>
                Войти
            </Button>
        </form>
    );
};
