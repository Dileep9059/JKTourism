import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "./ui/button";
import useAuth from "@/hooks/useAuth";
import type { AuthType } from "@/context/AuthProvider";

const Missing = () => {
  const navigate = useNavigate();

  const { auth } = useAuth() as { auth: AuthType };

  // Optional: Change document title
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">404</h1>
        <span className="font-medium">Oops! Page Not Found!</span>
        <p className="text-muted-foreground text-center">
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button
            onClick={() =>
              navigate(auth?.roles?.includes("ROLE_USER") ? "/user" : "/admin")
            }
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Missing;
