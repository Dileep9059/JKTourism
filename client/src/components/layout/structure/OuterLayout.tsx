// src/layouts/OuterLayout.jsx
import OuterFooter from "@/components/layout/structure/OuterFooter";
import OuterHeader from "@/components/layout/structure/OuterHeader";
import { Outlet, useLocation } from "react-router-dom";
// import NotificationsTenders from "./NotificationsTenders";
// import NewsUpdates from "./NewsUpdates";
import DepartmentOfRevenue from "./DepartmentOfRevenue";

const OuterLayout = () => {
        const { pathname } = useLocation();
    const base = import.meta.env.VITE_BASE || "/";

    const isValidPath = (pathname + base).replace('//', '/') === base;
    return (
        <>
            <main className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-foreground">
                {/* <OuterHeader /> */}
                <Outlet />
                 {isValidPath && (
                <>
                    {/* <NotificationsTenders /> */}
                    {/* <NewsUpdates /> */}
                    {/* <DepartmentOfRevenue /> */}
                </>
            )}
                <OuterFooter />
            </main>
        </>
    );
};

export default OuterLayout;
