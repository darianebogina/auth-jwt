import {useState} from "react";
import {Button} from "@/shared/ui";
import {useSession} from "@/entities/session";

type LogoutButtonProps = {
    onLogout?: () => void;
};

export const LogoutButton = ({onLogout}: LogoutButtonProps) => {
    const { logout } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await logout();
        } finally {
            setIsLoading(false);
            onLogout?.();
        }
    };

    return (
        <Button type="button" variant="secondary" onClick={handleClick} disabled={isLoading}>
            Выйти
        </Button>
    );
};
