import { useLoading } from "../../context/LoadingContext";
import FullScreenLoader from "./FullScreenLoader";

export const LoaderOverlay = () => {
    const { isLoading } = useLoading();
    return isLoading ? <FullScreenLoader /> : null;
};