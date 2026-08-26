import {useState} from "react";
import {Button} from "@/shared/ui";
import {sessionModel} from "@/entities/session";

type LogoutButtonProps = {
    onLogout?: () => void;
};

export const LogoutButton = ({onLogout}: LogoutButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await sessionModel.logout();
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
