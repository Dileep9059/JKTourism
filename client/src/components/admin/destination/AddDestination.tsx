import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Info,
  PlusCircle,
  Trash2,
  Upload,
} from "lucide-react";


import { toast } from "sonner";

import {
  ClassicEditor,
  Alignment,
  Autosave,
  BlockQuote,
  Bold,
  Code,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  ImageEditing,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  Paragraph,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  WordCount,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "@/components/admin/ckeditor.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import type { CategoryData } from "@/components/utils/types";
import axiosInstance, { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";

type FormData = {
  category: string;
  title: string;
  description: string;
  content: string;

  // whyVisits Array
  whyVisits: Array<{
    id: string;
    title: string;
    description: string;
  }>;

  nearByAttractions: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  destinationImages: Array<{
    id: string;
    file: File | null;
    // tittle & description of images
    title: string;
    description: string;
    preview?: string;
  }>;
  // transportation: {
  //     directions: string;
  //     parking: string;
  //     publicTransport: string;
  // };
  whichTime: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  travelTips: Array<{
    id: string;
    title: string;
    description: string;
  }>;

  travel: Array<{
    id: string;
    title: string;
    description: string;
  }>;

  accomodation: Array<{
    id: string;
    title: string;
    description: string;
  }>;
};

const LICENSE_KEY = "GPL";

export default function AddDestination() {
  const [categories, setCategories] = useState<CategoryData[]>([]);

  const [formData, setFormData] = useState<FormData>({
    category: "",
    title: "",
    description: "",
    content: "",
    whyVisits: [{ id: "1", title: "", description: "" }],
    nearByAttractions: [{ id: "1", title: "", description: "" }],
    destinationImages: [{ id: "1", title: "", description: "", file: null }],

    whichTime: [
      {
        id: "",
        title: "",
        description: "",
      },
    ],
    travelTips: [{ id: "1", title: "", description: "" }],
    travel: [{ id: "1", title: "", description: "" }],
    accomodation: [{ id: "1", title: "", description: "" }],
  });

  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const editorWordCountRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "code",
            "removeFormat",
            "|",
            "specialCharacters",
            "horizontalLine",
            "link",
            "insertTable",
            "blockQuote",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Alignment,
          Autosave,
          BlockQuote,
          Bold,
          Code,
          Essentials,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          GeneralHtmlSupport,
          Heading,
          HorizontalLine,
          ImageEditing,
          ImageUtils,
          Indent,
          IndentBlock,
          Italic,
          Link,
          List,
          ListProperties,
          Paragraph,
          RemoveFormat,
          SpecialCharacters,
          SpecialCharactersArrows,
          SpecialCharactersCurrency,
          SpecialCharactersEssentials,
          SpecialCharactersLatin,
          SpecialCharactersMathematical,
          SpecialCharactersText,
          Strikethrough,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableProperties,
          TableToolbar,
          TextTransformation,
          TodoList,
          Underline,
          WordCount,
        ],
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true,
          },
        },
        placeholder: "Type or paste your content here!",
        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableProperties",
            "tableCellProperties",
          ],
        },
      },
    };
  }, [isLayoutReady]);

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

  const handleImageChange = (id: string, file: File | null) => {
    setFormData({
      ...formData,
      destinationImages: formData.destinationImages.map((img) => {
        if (img.id === id) {
          return {
            ...img,
            file,
            preview: file ? URL.createObjectURL(file) : undefined,
          };
        }
        return img;
      }),
    });
  };

  const handleSubmit = async (p: React.FormEvent) => {
    p.preventDefault();
    // Here you would send the data to your Spring Boot API
    console.log("Form data to send:", formData);

    toast.info("Adding Destiation...");

    // extract destinationImages from formData
    const fd = new FormData();

    const { destinationImages, ...formDataWithoutImages } = formData;
    const encdestination = await e(JSON.stringify(formDataWithoutImages));

    fd.append("data", encdestination);

    destinationImages.forEach(async (img, index) => {
      if (img.file) {
        fd.append(`files`, img.file); // all files under the same name (Spring Boot handles this well)

        fd.append(
          `metadata[${index}][title]`,
          await e(JSON.stringify(img.title))
        );
        fd.append(
          `metadata[${index}][description]`,
          await e(JSON.stringify(img.description))
        );
      }
    });

    const response = await axiosPrivate.post("/api/admin/add-destination", fd);
    const dd = JSON.parse(await d(response.data.message));
    //  const ddd=JSON.parse(dd);
    //  console.log(ddd);
    if (dd === "Destination added successfully.") {
      toast.success(dd);
    } else {
      toast.info(dd);
    }
  };

  // fetch approved categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosInstance.post(`/api/category/getAllCategories`);

        if (response?.status === 200) {
          const res = JSON.parse(await d(response?.data));
          setCategories(res);
        }
      } catch {
        toast("Error", {
          description: "Unable to fetch categories.",
          icon: <Info className="text-red-600 w-4 h-4" />,
        });
      }
    }

    fetchCategories();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="p-2 space-y-6 text-card-foreground">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold mb-2 text-[#2b5f60]">
            Add New Destination
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to add a new travel destination.
          </p>
        </div>
        {/* Category, Title, Description */}
        <div className="flex gap-5 flex-col md:flex-row">
          <div className="w-full">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem value={category?.name} key={category?.name}>
                    {category?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter destination title"
            />
          </div>
        </div>

        <div className="main-container">
          <div
            className="w-full editor-container editor-container_classic-editor editor-container_include-word-count"
            ref={editorContainerRef}
          >
            <div className="editor-container__editor">
              <div ref={editorRef}>
                {editorConfig && (
                  <CKEditor
                    onReady={(editor: any) => {
                      const wordCount = editor.plugins.get("WordCount");
                      editorWordCountRef.current.appendChild(
                        wordCount.wordCountContainer
                      );
                    }}
                    data={formData.content}
                    onChange={(_, editor: any) => {
                      // field.onChange(editor.getData());
                      setFormData({ ...formData, content: editor.getData() });
                    }}
                    onAfterDestroy={() => {
                      Array.from(editorWordCountRef.current.children).forEach(
                        (child: any) => child.remove()
                      );
                    }}
                    editor={ClassicEditor}
                    config={editorConfig}
                  />
                )}
              </div>
            </div>
            <div
              className="editor_container__word-count"
              ref={editorWordCountRef}
            ></div>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the destination"
            className="h-24"
          />
        </div>

        {/* Why Visit */}
        <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
          <div className="flex items-center justify-between">
            <Label className="text-[#2b5f60] text-md font-semibold">
              Why Visit?
            </Label>
            {/* Add button to add more visits data */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("whyVisits")}
              className="flex items-center gap-1 bg-[#eecba0]"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          </div>

          {formData.whyVisits.map((whyVisit, index) => (
            <div
              key={whyVisit.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4"
            >
              {/* Why Visit Title */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="Why Visit"
                  className="text-sm font-medium text-black"
                >
                  Title
                </label>
                <Input
                  value={whyVisit.title}
                  onChange={(e) => {
                    const newwhyVisits = [...formData.whyVisits];
                    newwhyVisits[index].title = e.target.value;
                    setFormData({ ...formData, whyVisits: newwhyVisits });
                  }}
                  placeholder="Enter Visit title"
                />
              </div>
              {/* Why Visit Description */}
              <div className="sm:col-span-7">
                <label
                  htmlFor="Why Visit"
                  className="text-sm font-medium text-black"
                >
                  Description
                </label>
                <Input
                  value={whyVisit.description}
                  onChange={(e) => {
                    const newWhyVisits = [...formData.whyVisits];
                    newWhyVisits[index].description = e.target.value;
                    setFormData({ ...formData, whyVisits: newWhyVisits });
                  }}
                  placeholder="Enter visit description"
                />
              </div>
              {/* Remove Button */}
              <div className="sm:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem("whyVisits", whyVisit.id)}
                  className={cn(
                    "h-10 w-10",
                    formData.whyVisits.length === 1 &&
                    "opacity-50 cursor-not-allowed"
                  )}
                  disabled={formData.whyVisits.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Near By Attractions */}
        <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
          <div className="flex items-center justify-between">
            <Label className="text-[#2b5f60] text-md font-semibold">
              Near By Attractions
            </Label>
            {/* Add button to add more near by attractions data */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("nearByAttractions")}
              className="flex items-center gap-1 bg-[#eecba0]"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          </div>

          {formData.nearByAttractions.map((nearByAttractions, index) => (
            <div
              key={nearByAttractions.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4"
            >
              {/* Near By Attractions Title */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="Near By Attractions"
                  className="text-sm font-medium text-black"
                >
                  Title
                </label>
                <Input
                  value={nearByAttractions.title}
                  onChange={(e) => {
                    const newnearByAttractions = [
                      ...formData.nearByAttractions,
                    ];
                    newnearByAttractions[index].title = e.target.value;
                    setFormData({
                      ...formData,
                      nearByAttractions: newnearByAttractions,
                    });
                  }}
                  placeholder="Enter near by attractions title"
                />
              </div>
              {/* Near By Attractions Description */}
              <div className="sm:col-span-7">
                <label
                  htmlFor="Near By Attractions"
                  className="text-sm font-medium text-black"
                >
                  Description
                </label>
                <Input
                  value={nearByAttractions.description}
                  onChange={(e) => {
                    const newnearByAttractions = [
                      ...formData.nearByAttractions,
                    ];
                    newnearByAttractions[index].description = e.target.value;
                    setFormData({
                      ...formData,
                      nearByAttractions: newnearByAttractions,
                    });
                  }}
                  placeholder="Enter near by attractions description"
                />
              </div>
              <div className="sm:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() =>
                    removeItem("nearByAttractions", nearByAttractions.id)
                  }
                  className={cn(
                    "h-10 w-10",
                    formData.nearByAttractions.length === 1 &&
                    "opacity-50 cursor-not-allowed"
                  )}
                  disabled={formData.nearByAttractions.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
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
              onClick={() => addItem("destinationImages")}
              className="flex items-center gap-1 bg-[#eecba0]"
            >
              <PlusCircle className="h-4 w-4" />
              Add Image
            </Button>
          </div>

          {formData.destinationImages.map((image, index) => (
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
                      const newimage = [...formData.destinationImages];
                      newimage[index].title = e.target.value;
                      setFormData({ ...formData, destinationImages: newimage });
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
                      const newimages = [...formData.destinationImages];
                      newimages[index].description = e.target.value;
                      setFormData({
                        ...formData,
                        destinationImages: newimages,
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
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(image.id, e.target.files?.[0] || null)
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

                {formData.destinationImages.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem("destinationImages", image.id)}
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

        {/* Travel Tips */}
        <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
          <div className="flex items-center justify-between">
            <Label className="text-[#2b5f60] text-md font-semibold">
              Travel Tips
            </Label>
            {/* Add button to add more travelTips data */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("travelTips")}
              className="flex items-center gap-1 bg-[#eecba0]"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          </div>

          {formData.travelTips.map((travelTips, index) => (
            <div
              key={travelTips.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4"
            >
              {/* Travel Tips Title */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="Travel Tips"
                  className="text-sm font-medium text-black"
                >
                  Title
                </label>
                <Input
                  value={travelTips.title}
                  onChange={(e) => {
                    const newtravelTips = [...formData.travelTips];
                    newtravelTips[index].title = e.target.value;
                    setFormData({ ...formData, travelTips: newtravelTips });
                  }}
                  placeholder="Enter Visit title"
                />
              </div>
              {/* Travel Tips Description */}
              <div className="sm:col-span-7">
                <label
                  htmlFor="Travel Tips"
                  className="text-sm font-medium text-black"
                >
                  Description
                </label>
                <Input
                  value={travelTips.description}
                  onChange={(e) => {
                    const newtravelTips = [...formData.travelTips];
                    newtravelTips[index].description = e.target.value;
                    setFormData({ ...formData, travelTips: newtravelTips });
                  }}
                  placeholder="Enter activity description"
                />
              </div>
              {/* Remove Button */}
              <div className="sm:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem("travelTips", travelTips.id)}
                  className={cn(
                    "h-10 w-10",
                    formData.travelTips.length === 1 &&
                    "opacity-50 cursor-not-allowed"
                  )}
                  disabled={formData.travelTips.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Travel */}
        <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
          <div className="flex items-center justify-between">
            <Label className="text-[#2b5f60] text-md font-semibold">
              Travel
            </Label>
            {/* Add button to add more travel data */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("travel")}
              className="flex items-center gap-1 bg-[#eecba0]"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          </div>

          {formData.travel.map((travel, index) => (
            <div
              key={travel.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4"
            >
              {/* Travel  Title */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="Travel"
                  className="text-sm font-medium text-black"
                >
                  Title
                </label>
                <Input
                  value={travel.title}
                  onChange={(e) => {
                    const newtravel = [...formData.travel];
                    newtravel[index].title = e.target.value;
                    setFormData({ ...formData, travel: newtravel });
                  }}
                  placeholder="Enter Visit title"
                />
              </div>
              {/* Travel Description */}
              <div className="sm:col-span-7">
                <label
                  htmlFor="Travel"
                  className="text-sm font-medium text-black"
                >
                  Description
                </label>
                <Input
                  value={travel.description}
                  onChange={(e) => {
                    const newtravel = [...formData.travel];
                    newtravel[index].description = e.target.value;
                    setFormData({ ...formData, travel: newtravel });
                  }}
                  placeholder="Enter activity description"
                />
              </div>
              {/* Remove Button */}
              <div className="sm:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem("travel", travel.id)}
                  className={cn(
                    "h-10 w-10",
                    formData.travel.length === 1 &&
                    "opacity-50 cursor-not-allowed"
                  )}
                  disabled={formData.travel.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* which Time */}
        <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
          <div className="flex items-center justify-between">
            <Label className="text-[#2b5f60] text-md font-semibold">
              Best Time To Visit
            </Label>
            {/* Add button to add more travel data */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("whichTime")}
              className="flex items-center gap-1 bg-[#eecba0]"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          </div>

          {formData.whichTime.map((whichTime, index) => (
            <div
              key={whichTime.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4"
            >
              {/* Travel  Title */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="Travel"
                  className="text-sm font-medium text-black"
                >
                  Title
                </label>
                <Input
                  value={whichTime.title}
                  onChange={(e) => {
                    const newwhichTime = [...formData.whichTime];
                    newwhichTime[index].title = e.target.value;
                    setFormData({ ...formData, whichTime: newwhichTime });
                  }}
                  placeholder="Enter Month"
                />
              </div>
              {/* which Time Description */}
              <div className="sm:col-span-7">
                <label
                  htmlFor="whichTime"
                  className="text-sm font-medium text-black"
                >
                  Description
                </label>
                <Input
                  value={whichTime.description}
                  onChange={(e) => {
                    const newwhichTime = [...formData.whichTime];
                    newwhichTime[index].description = e.target.value;
                    setFormData({ ...formData, whichTime: newwhichTime });
                  }}
                  placeholder="Enter description"
                />
              </div>
              {/* Remove Button */}
              <div className="sm:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem("whichTime", whichTime.id)}
                  className={cn(
                    "h-10 w-10",
                    formData.whichTime.length === 1 &&
                    "opacity-50 cursor-not-allowed"
                  )}
                  disabled={formData.whichTime.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Accomodation */}
        <div className="space-y-4 border border-[#e1e1e1] bg-[#fcfcfc] p-4 rounded-md shadow-xs mb-5">
          <div className="flex items-center justify-between">
            <Label className="text-[#2b5f60] text-md font-semibold">
              Accomodation
            </Label>
            {/* Add button to add more Accomodation data */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addItem("accomodation")}
              className="flex items-center gap-1 bg-[#eecba0]"
            >
              <PlusCircle className="h-4 w-4" />
              Add
            </Button>
          </div>

          {formData.accomodation.map((accomodation, index) => (
            <div
              key={accomodation.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4"
            >
              {/* Travel  Title */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="Travel"
                  className="text-sm font-medium text-black"
                >
                  Title
                </label>
                <Input
                  value={accomodation.title}
                  onChange={(e) => {
                    const newaccomodation = [...formData.accomodation];
                    newaccomodation[index].title = e.target.value;
                    setFormData({ ...formData, accomodation: newaccomodation });
                  }}
                  placeholder="Enter Month"
                />
              </div>
              {/* which Time Description */}
              <div className="sm:col-span-7">
                <label
                  htmlFor="accomodation"
                  className="text-sm font-medium text-black"
                >
                  Description
                </label>
                <Input
                  value={accomodation.description}
                  onChange={(e) => {
                    const newaccomodation = [...formData.accomodation];
                    newaccomodation[index].description = e.target.value;
                    setFormData({ ...formData, accomodation: newaccomodation });
                  }}
                  placeholder="Enter description"
                />
              </div>
              {/* Remove Button */}
              <div className="sm:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem("accomodation", accomodation.id)}
                  className={cn(
                    "h-10 w-10 cursor-pointer",
                    formData.accomodation.length === 1 &&
                    "opacity-50 cursor-not-allowed"
                  )}
                  disabled={formData.accomodation.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            Save Destination
          </Button>
        </div>
      </div>
    </form>
  );
}
