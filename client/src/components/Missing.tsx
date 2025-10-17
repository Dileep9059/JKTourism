import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "./ui/button";

const Missing = () => {


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
          <Link to={"/"} className="bg-gray-900 text-white rounded-md py-1 px-3 hover:bg-black/80"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Missing;
