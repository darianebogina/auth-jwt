import {HomePage} from "@/pages/home";
import {SessionProvider} from "@/entities/session";

export const App = () => {
    return (
        <SessionProvider>
            <HomePage />
        </SessionProvider>
    );
};
