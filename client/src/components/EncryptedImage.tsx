import { useEffect, useState } from "react";

export default function EncryptedImage({ imagePath }: { imagePath: string }) {
  const [encryptedPath, setEncryptedPath] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setEncryptedPath(imagePath);
  }, [imagePath]);

  if (!encryptedPath) return <span>Loading...</span>;

  return (
    <>
      <img
        src={`${import.meta.env.VITE_APP_API_BASE_URL
          }/files/load-file-by-path?path=${encryptedPath}`}
        alt="Preview"
        width={100}
        height={50}
        className="max-w-[80px] cursor-pointer border rounded"
        onClick={() => setIsModalOpen(true)}
        loading="lazy"
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-80 z-50 flex items-center justify-center">
          <div className="relative max-w-full max-h-full p-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-8 text-white text-3xl cursor-pointer"
            >
              &times;
            </button>
            <img
              src={`${import.meta.env.VITE_APP_API_BASE_URL
                }/files/load-file-by-path?path=${encryptedPath}`}
              alt="Full preview"
              className="max-h-[90vh] max-w-[90vw] object-contain"
              width={1024}
              height={700}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
}
