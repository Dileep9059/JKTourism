import { useLoading } from "../../context/LoadingContext";

const FullScreenLoader = () => {
  const { isLoading } = useLoading(); // 💡 This connects it to context

  if (!isLoading) return null; // Only show if loading is true

  return (
    <>
      <div className="fixed inset-0 z-50 flex w-full flex-col items-center justify-center gap-4 bg-white dark:bg-black">
        <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-blue-400 text-4xl text-blue-400">
          <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-red-400 text-2xl text-red-400"></div>
        </div>
      </div>
    </>
  );
};

export default FullScreenLoader;
