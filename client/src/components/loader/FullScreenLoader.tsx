import { useLoading } from "../../context/LoadingContext";

const FullScreenLoader = () => {
  const { isLoading } = useLoading(); // 💡 This connects it to context

  if (!isLoading) return null; // Only show if loading is true

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-sky-300 animate-ping"></div>

          <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-sky-100 border-t-sky-500">
          </div>

          <div className="absolute flex items-center justify-center text-sky-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-8 w-8 animate-pulse">
              <path d="M3 17l9-10 9 10H3zm9-3l-4 4h8l-4-4z" />
            </svg>
          </div>
        </div>

        <p className="text-sky-700 font-medium animate-pulse">
          Sailing through paradise...
        </p>
      </div>

    </>
  );
};

export default FullScreenLoader;
