import { useEffect, useState } from "react";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Eye, Info, PlusCircle, Trash2, Upload } from "lucide-react";
import axiosInstance, { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";

type FormData = {
  images: Array<{
    id: string;
    file: File | null;
    title: string;
    description: string;
    preview?: string;
  }>;
  videos: Array<{
    id: string;
    file: File | null;
    title: string;
    description: string;
    preview?: string;
  }>;
  brochures: Array<{
    id: string;
    file: File | null;
    title: string;
    description: string;
    preview?: string;
  }>;
};

const UploadDestinationData = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");

  const [formData, setFormData] = useState<FormData>({
    images: [{ id: "1", title: "", description: "", file: null }],
    videos: [{ id: "1", title: "", description: "", file: null }],
    brochures: [{ id: "1", title: "", description: "", file: null }],
  });

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(() => value);
  };

  const addItem = (field: string) => {
    const id = Date.now().toString();
    const defaultItemMap: Record<string, any> = {
      images: { id, title: "", description: "", file: null },
      default: { id, title: "", description: "" },
    };
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...(prev as any)[field],
        defaultItemMap[field] || defaultItemMap.default,
      ],
    }));
  };

  const removeItem = (field: string, id: string) => {
    setFormData((prev) => {
      const items = (prev as any)[field];
      if (!Array.isArray(items) || items.length <= 1) return prev;

      return {
        ...prev,
        [field]: items.filter((item: any) => item.id !== id),
      };
    });
  };

  const handleFileChange = (
    field: "images" | "videos" | "brochures",
    id: string,
    file: File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item: any) =>
        item.id === id
          ? {
            ...item,
            file,
            preview: file ? URL.createObjectURL(file) : undefined,
          }
          : item
      ),
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedDestination === "") {
      toast("Error!", {
        description: "Please select a destination",
        icon: <Info className="text-red-500 w-4 h-4" />,
      });
      return;
    }
    let params = {
      destination: selectedDestination,
    };

    const formDataToSend = new FormData();
    // formDataToSend.append("destination", selectedDestination);

    // get title and description from formData for each field
    const fields = ["images", "videos", "brochures"];
    fields.forEach((field: string) => {
      (formData as any)[field].forEach((item: any, index: number) => {
        if (item.file) {
          let key = `${field}[${index}][title]` as string;
          (params as any)[key] = item.title;
          let keyTwo = `${field}[${index}][description]` as string;
          (params as any)[keyTwo] = item.description;
          formDataToSend.append(field, item.file);
        }
      });
    });
    formDataToSend.append("data", await e(JSON.stringify(params)));
    try {
      const response = await axiosPrivate.post(
        "/api/admin/upload-files",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast("Success!", {
        description: "Your file has been uploaded successfully.",
        icon: <Info className="text-green-500 w-4 h-4" />,
      });
      setFormData({
        images: [{ id: "1", title: "", description: "", file: null }],
        videos: [{ id: "1", title: "", description: "", file: null }],
        brochures: [{ id: "1", title: "", description: "", file: null }],
      });
    } catch {
      toast("Error!", {
        description: "Please try again later.",
        icon: <Info className="text-red-500 w-4 h-4" />,
      });
      return;
    }
  };

  async function fetchDestinations() {
    try {
      const response = await axiosInstance.get(
        "/api/destination/get-destinations-groupby-category"
      );
      const data = JSON.parse(await d(response.data));
      setDestinations(data);
    } catch {
      toast("Error fetching destinations", {
        description: "Please try again later.",
        icon: <Info className="text-red-500 w-4 h-4" />,
      });
    }
  }

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleFormSubmit}>
          <h1 className="text-2xl font-bold text-[#2b5f60]">
            Upload data for selected destination
          </h1>
          <div className="h-auto my-5">
            <Select onValueChange={handleDestinationChange}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((destination: any) => (
                  <SelectGroup key={destination.category}>
                    <SelectLabel>{destination.category}</SelectLabel>
                    {destination.destinations.map((destination: any) => (
                      <SelectItem value={destination[1]} key={destination[1]}>
                        {destination[0]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Gallery Images */}
          <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
            <div className="flex items-center justify-between">
              <Label className="text-[#2b5f60] text-md font-semibold">
                Gallery Images
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem("images")}
                className="flex items-center gap-1 bg-[#eecba0]"
              >
                <PlusCircle className="h-4 w-4" />
                Add Image
              </Button>
            </div>

            {formData.images.map((image, index) => (
              <div key={image.id}>
                <div className="flex gap-5 flex-col md:flex-row mb-5">
                  {/* Images Title */}
                  <div className="w-full">
                    <label
                      htmlFor="Gallery Images"
                      className="text-sm font-medium text-black"
                    >
                      Title
                    </label>
                    <Input
                      value={image.title}
                      onChange={(e) => {
                        const newimage = [...formData.images];
                        newimage[index].title = e.target.value;
                        setFormData({ ...formData, images: newimage });
                      }}
                      placeholder="Image title"
                    />
                  </div>
                  {/* Images Description */}
                  <div className="w-full">
                    <label
                      htmlFor="Gallery Images"
                      className="text-sm font-medium text-black"
                    >
                      Description
                    </label>
                    <Input
                      value={image.description}
                      onChange={(e) => {
                        const newimages = [...formData.images];
                        newimages[index].description = e.target.value;
                        setFormData({
                          ...formData,
                          images: newimages,
                        });
                      }}
                      placeholder="Image description"
                    />
                  </div>
                </div>

                <div key={image.id} className="relative group w-30">
                  <div
                    className={cn(
                      "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden",
                      "transition-colors duration-200",
                      image.file
                        ? "border-[#1d2029] bg-green-500/10 dark:border-[#1d2029] dark:bg-green-400/10"
                        : "border-[#1d2029] hover:border-[#1d2029] dark:border-[#ffffff]"
                    )}
                    onClick={() =>
                      document.getElementById(`file-${image.id}`)?.click()
                    }
                  >
                    <input
                      type="file"
                      id={`file-${image.id}`}
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={(e) =>
                        handleFileChange(
                          "images",
                          image.id,
                          e.target.files?.[0] || null
                        )
                      }
                    />

                    {image.preview ? (
                      <img
                        src={image.preview}
                        width={20}
                        height={20}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                        <span className="mt-2 block text-xs text-muted-foreground">
                          Choose image
                        </span>
                      </div>
                    )}
                  </div>

                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem("images", image.id)}
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {/* </div> */}
          </div>
          {/* Gallery Videos */}
          <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
            <div className="flex items-center justify-between">
              <Label className="text-[#2b5f60] text-md font-semibold">
                Videos
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem("videos")}
                className="flex items-center gap-1 bg-[#eecba0]"
              >
                <PlusCircle className="h-4 w-4" />
                Add Video
              </Button>
            </div>

            {formData.videos.map((video, index) => (
              <div key={video.id}>
                <div className="flex gap-5 flex-col md:flex-row mb-5">
                  <div className="w-full">
                    <label className="text-sm font-medium text-black">
                      Title
                    </label>
                    <Input
                      value={video.title}
                      onChange={(e) => {
                        const updatedVideos = [...formData.videos];
                        updatedVideos[index].title = e.target.value;
                        setFormData({ ...formData, videos: updatedVideos });
                      }}
                      placeholder="Video title"
                    />
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-medium text-black">
                      Description
                    </label>
                    <Input
                      value={video.description}
                      onChange={(e) => {
                        const updatedVideos = [...formData.videos];
                        updatedVideos[index].description = e.target.value;
                        setFormData({ ...formData, videos: updatedVideos });
                      }}
                      placeholder="Video description"
                    />
                  </div>
                </div>

                <div className="relative group w-30">
                  <div
                    className={cn(
                      "aspect-video rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden",
                      "transition-colors duration-200",
                      video.file
                        ? "border-[#1d2029] bg-green-500/10"
                        : "border-[#1d2029] hover:border-[#1d2029]"
                    )}
                    onClick={() =>
                      document
                        .getElementById(`file-videos-${video.id}`)
                        ?.click()
                    }
                  >
                    <input
                      type="file"
                      id={`file-videos-${video.id}`}
                      className="hidden"
                      accept="video/mp4"
                      onChange={(e) =>
                        handleFileChange(
                          "videos",
                          video.id,
                          e.target.files?.[0] || null
                        )
                      }
                    />

                    {video.preview ? (
                      <video
                        controls
                        className="h-full w-full object-cover"
                        src={video.preview}
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                        <span className="mt-2 block text-xs text-muted-foreground">
                          Choose Video
                        </span>
                      </div>
                    )}
                  </div>

                  {formData.videos.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem("videos", video.id)}
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* </div> */}
          </div>
          {/* Gallery Brochures */}
          <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
            <div className="flex items-center justify-between">
              <Label className="text-[#2b5f60] text-md font-semibold">
                Brochures (PDF)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem("brochures")}
                className="flex items-center gap-1 bg-[#eecba0]"
              >
                <PlusCircle className="h-4 w-4" />
                Add PDF
              </Button>
            </div>

            {formData.brochures.map((item, index) => (
              <div key={item.id}>
                <div className="flex gap-5 flex-col md:flex-row mb-5">
                  {/* Title */}
                  <div className="w-full">
                    <label className="text-sm font-medium text-black">
                      Title
                    </label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...formData.brochures];
                        updated[index].title = e.target.value;
                        setFormData({ ...formData, brochures: updated });
                      }}
                      placeholder="PDF title"
                    />
                  </div>

                  {/* Description */}
                  <div className="w-full">
                    <label className="text-sm font-medium text-black">
                      Description
                    </label>
                    <Input
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...formData.brochures];
                        updated[index].description = e.target.value;
                        setFormData({ ...formData, brochures: updated });
                      }}
                      placeholder="PDF description"
                    />
                  </div>
                </div>

                {/* PDF Upload Section */}
                <div className="relative group w-30">
                  <div
                    className={cn(
                      "aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden px-4 py-6 text-center",
                      "transition-colors duration-200",
                      item.file
                        ? "border-[#1d2029] bg-green-500/10"
                        : "border-[#1d2029] hover:border-[#1d2029]"
                    )}
                    onClick={() =>
                      document
                        .getElementById(`file-brochures-${item.id}`)
                        ?.click()
                    }
                  >
                    <input
                      type="file"
                      id={`file-brochures-${item.id}`}
                      className="hidden"
                      accept="application/pdf"
                      onChange={(e) =>
                        handleFileChange(
                          "brochures",
                          item.id,
                          e.target.files?.[0] || null
                        )
                      }
                    />

                    <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                    <span className="mt-2 text-xs text-muted-foreground">
                      Choose PDF
                    </span>

                    {item.preview && (
                      <a
                        href={item.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-xs text-blue-600 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View PDF
                      </a>
                    )}
                  </div>

                  {formData.brochures.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem("brochures", item.id)}
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>
            <Button type="submit" className="bg-[#2b5f60]">
              Add Files
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadDestinationData;
