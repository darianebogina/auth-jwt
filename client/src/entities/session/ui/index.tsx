import styles from "./styles.module.css";

type UserBadgeProps = {
    email: string;
};

export const UserBadge = ({email}: UserBadgeProps) => {
    const initial = email.trim().charAt(0).toUpperCase() || "?";

    return (
        <div className={styles.badge}>
            <div className={styles.avatar}>{initial}</div>
            <span className={styles.email}>{email}</span>
        </div>
    );
};
