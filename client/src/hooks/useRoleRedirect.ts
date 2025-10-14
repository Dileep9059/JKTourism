import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import type { AuthType } from "@/context/AuthProvider";
import { d } from "@/components/utils/crypto";

const RESTRICTED_ROLES = [
    "ROLE_MASTER_ADMIN",
    "ROLE_SUPER_ADMIN",
    "ROLE_DISTRICT_ADMIN",
    "ROLE_TEHSILDAR",
    "ROLE_NAIB_TEHSILDAR",
    "ROLE_PATWARI"
];

export function useRoleRedirect() {
    const { auth } = useAuth() as { auth: AuthType };
    const navigate = useNavigate();
    useEffect(() => {
        const redirectToPreviousPage = async () => {
            if (auth?.user) {
                // Check if the auth user has one of the RESTRICTED_ROLES
                const hasRestrictedRole = auth?.roles?.some(role =>
                    RESTRICTED_ROLES.some(restrictedRole =>
                        role.toUpperCase() === restrictedRole.toUpperCase()
                    )
                );
                if (hasRestrictedRole) {
                    // Redirect to previously visited page or fallback
                    const previousPage = localStorage.getItem("_|_");
                    if (previousPage) {
                        try {
                            const decryptedPreviousPage = await d(previousPage);
                            navigate(decryptedPreviousPage || "/default", { replace: true });
                        } catch (error) {
                            console.error("Error decrypting the previous page:", error);
                            navigate("/default", { replace: true });
                        }
                    } else {
                        navigate("/default", { replace: true });
                    }
                }
            } else {
                localStorage.removeItem("_|_");
            }
        };
        redirectToPreviousPage();
    }, [auth, navigate]);
}
