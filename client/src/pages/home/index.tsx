import {LoginForm} from "@/features/auth/login";
import {LogoutButton} from "@/features/auth/logout";
import {UserBadge, useSession} from "@/entities/session";
import {Card} from "@/shared/ui";
import styles from "./styles.module.css";

export const HomePage = () => {
    const { session, isInitialized } = useSession();

    if (!isInitialized) return null;

    return (
        <main className={styles.screen}>
            <Card>
                {session ? (
                    <>
                        <div className={styles.authedHeader}>
                            <h2 className={styles.authedTitle}>Личный кабинет</h2>
                            <LogoutButton/>
                        </div>
                        <UserBadge email={session.email}/>
                    </>
                ) : (
                    <LoginForm/>
                )}
            </Card>
        </main>
    );
};
