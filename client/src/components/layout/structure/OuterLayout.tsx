
import OuterFooter from "@/components/layout/structure/OuterFooter";
import OuterHeader from "@/components/layout/structure/OuterHeader";
import { Outlet } from "react-router-dom";


const OuterLayout = () => {
    return (
        <>
            <main className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-foreground">
                <OuterHeader />
                <Outlet />
                <OuterFooter />
            </main>
        </>
    );
};

export default OuterLayout;
