import { ChangeEventHandler, useRef, useState, useTransition } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { DeleteImages } from "@/actions/Uploadthing";
import Link from "next/link";

const FileUpload = ({
  url,
  disabled,
  onChange,
  type,
  isUpload,
  setIsUpload,
}: {
  url: string;
  disabled: boolean;
  onChange: (image: string | string[]) => void;
  type: "image" | "pdf";
  isUpload?: boolean;
  setIsUpload?: (isUpload: boolean) => void;
}) => {
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [pending, startTransition] = useTransition();

  // upload image image
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadError: () => {
      toast.error("Something went wrong!");
    },
    onClientUploadComplete: (res) => {
      const url = res?.[0].ufsUrl;
      onChange(url);
      setIsUpload && setIsUpload(true);
      const message = `Uploaded Successfully!`;
      toast.success(message);
    },
  });
  const addItem: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if (!files) {
      toast.error("Please select your image");
      return;
    }

    const file = files?.[0];
    startUpload([file]);
  };
  // delete
  const Delete = async () => {
    startTransition(async () => {
      const deleted = await DeleteImages({ files: [url] });
      // console.log(deleted);
      if (deleted.success) {
        onChange("");
        setIsUpload && setIsUpload(false);
        toast.success("Deleted Successfully!");
      }
    });
  };

  // console.log(image);

  return (
    <div className="pb-4">
      {/* upload btn */}
      {url === "" && (
        <Button
          className="gap-2 w-full"
          type="button"
          variant="secondary"
          disabled={disabled || pending || isUploading}
          onClick={() => filePickerRef.current!.click()}
        >
          {isUploading ? (
            <p>Uploading....</p>
          ) : (
            <>
              <AiOutlineCloudUpload className="h-5 w-5" />
              <input
                type="file"
                ref={filePickerRef}
                hidden
                accept={type === "image" ? "image/*" : "application/pdf"}
                onChange={addItem}
              />
              Upload
            </>
          )}
        </Button>
      )}
      {/* File View */}
      {url !== "" && (
        <div className="flex items-start space-x-2 relative w-fit">
          <div className="absolute items-center justify-center right-0 top-2 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={pending || disabled}
              onClick={Delete}
            >
              <MdDelete className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-x-auto flex gap-1 scrollbar">
            {type === "image" && (
              <Image
                src={url}
                className="w-full h-[20%] rounded-md max-h-40 object-contain pb-2"
                alt={`Image ${url}`}
                height={500}
                width={500}
              />
            )}
            {type === "pdf" && (
              <Button
                variant="link"
                className="w-full rounded-xl h-40 border pb-2"
                asChild
                onClick={() => window?.open(url, "_blank")}
              >
                <Link href={url} target="_blank">
                  Open Book
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
