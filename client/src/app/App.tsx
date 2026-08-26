import {useEffect} from "react";
import {HomePage} from "@/pages/home";
import {sessionModel} from "@/entities/session";

export const App = () => {
    const { isInitialized } = sessionModel.useSession();

    useEffect(() => {
        sessionModel.init();
    }, []);

    if (!isInitialized) return null;

    return <HomePage />;
};
