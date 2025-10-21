
import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";

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
  WordCount
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import "./ckeditor.css";
import { CKEditor } from "@ckeditor/ckeditor5-react"

import { Check, Info, Plus, Trash2, Upload } from "lucide-react";
import { type ActivitySchema, activitySchema } from "./activity/ActivitySchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { d, e } from '../utils/crypto';
import { axiosPrivate } from '@/axios/axios';


const LICENSE_KEY = 'GPL'

const ContentForm = ({ addUrl, type }: { addUrl: string, type: string }) => {

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
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'code',
            'removeFormat',
            '|',
            'specialCharacters',
            'horizontalLine',
            'link',
            'insertTable',
            'blockQuote',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            'outdent',
            'indent'
          ],
          shouldNotGroupWhenFull: false
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
          WordCount
        ],
        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph'
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1'
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2'
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3'
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4'
            },
            {
              model: 'heading5',
              view: 'h5',
              title: 'Heading 5',
              class: 'ck-heading_heading5'
            },
            {
              model: 'heading6',
              view: 'h6',
              title: 'Heading 6',
              class: 'ck-heading_heading6'
            }
          ]
        },
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          decorators: {
            toggleDownloadable: {
              mode: 'manual',
              label: 'Downloadable',
              attributes: {
                download: 'file'
              }
            }
          }
        },
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true
          }
        },
        placeholder: 'Type or paste your content here!',
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
      }
    };
  }, [isLayoutReady]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ActivitySchema>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      images: [{ id: Date.now().toString(), file: null, preview: "" }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "images",
  });

  const watchImages = watch("images");

  const handleImageChange = (index: number, file: File | null) => {
    const newPreview = file ? URL.createObjectURL(file) : undefined;
    update(index, {
      ...watchImages[index],
      file,
      preview: newPreview,
    });
  };

  const onSubmit = async (data: ActivitySchema) => {
    // You can now send `data` to backend
    try {
      const fd = new FormData();

      const { images, ...formDataWithoutImages } = data;
      const encdestination = await e(JSON.stringify(formDataWithoutImages));

      fd.append("data", encdestination);

      images.forEach(async (img, index) => {
        if (img.file) {
          fd.append(`files`, img.file); // all files under the same name (Spring Boot handles this well)
        }
      });

      // sending data to backend
      const resp = await axiosPrivate.post(addUrl, fd);

      if (resp?.status === 200) {
        const result = JSON.parse(await d(resp?.data));
        reset();
        toast("Success!", {
          description: result,
          icon: <Check className="text-green-500 w-4 h-4" />,
        });
      }
    } catch (error: any) {
      toast("Error!", {
        description: "Unable to add activity. Please try again later.",
        icon: <Info className="text-red-500 w-4 h-4" />,
      });
    }
  };

  // if (!Editor) return <p>Loading editor...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
        {errors.images && <p>{errors.images.message}</p>}
      </div>

      {/* Description Field */}
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          {...register("description")}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* CKEditor */}
      <div>
        <label className="block font-semibold mb-1">Content</label>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <>
              <div className="main-container">
                <div className="editor-container editor-container_classic-editor editor-container_include-word-count" ref={editorContainerRef}>
                  <div className="editor-container__editor">
                    <div ref={editorRef}>
                      {editorConfig && (
                        <CKEditor
                          onReady={editor => {
                            const wordCount = editor.plugins.get('WordCount');
                            editorWordCountRef?.current.appendChild(wordCount.wordCountContainer);
                          }}
                          data={field.value}
                          onChange={(_, editor) => {
                            field.onChange(editor.getData());
                          }}
                          onAfterDestroy={() => {
                            Array.from(editorWordCountRef?.current.children).forEach(child => child.remove());
                          }}
                          editor={ClassicEditor}
                          config={editorConfig}
                        />
                      )}
                    </div>
                  </div>
                  <div className="editor_container__word-count" ref={editorWordCountRef}></div>
                </div>
              </div>
            </>
          )}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Image Uploads */}
      <div className="py-4">
        <div className="flex justify-between">
          <h2>Add Images for {type}</h2>

          {/* Add More Images */}
          <Button
            type="button"
            className="bg-[#eecba0] hover:bg-[#ddb57c] font-semibold px-4 py-2 rounded-lg"
            onClick={() =>
              append({ id: Date.now().toString(), file: null, preview: "" })
            }
          >
            <Plus />
            Add Image
          </Button>
        </div>
        <div className="py-4 flex gap-4 flex-wrap">
          {fields.map((item, index) => (
            <div key={item.id}>
              {/* File input + preview */}
              <div className="relative w-40">
                <div
                  className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() =>
                    document.getElementById(`file-${index}`)?.click()
                  }
                >
                  <input
                    type="file"
                    id={`file-${index}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files?.[0] || null)
                    }
                  />

                  {watchImages[index]?.preview ? (
                    <img
                      src={watchImages[index].preview!}
                      alt="Preview"
                      width={150}
                      height={150}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                      <span className="block text-xs">Choose image</span>
                    </div>
                  )}
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute -top-2 -right-2 h-6 w-6"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="bg-[#2b5f60] hover:bg-[#073738] font-semibold px-4 py-2 rounded-lg cursor-pointer"
      >
        Add {type}
      </Button>
    </form>
  );
};

export default ContentForm;
