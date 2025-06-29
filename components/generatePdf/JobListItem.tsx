"use client";

import { Copy, DownloadIcon } from "lucide-react";
import Moment from "react-moment";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FaFilePdf } from "react-icons/fa";
import { createPdfHTML } from "@/inngest/pdfServices";
import { uploadGeneratePDF } from "@/actions/Uploadthing";

const JobListItem = ({ job }: { job: Job }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const shimmerMessages = [
    "Thinking....",
    "Generating PDF...",
    "Processing your request...",
    "Almost there, hang tight!",
    "Your PDF is being created...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % shimmerMessages.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [shimmerMessages.length]);

  const copyFunction = (url: string) => {
    navigator.clipboard.writeText(url || "");
    toast.success(`${job.topic} PDF URL was Copied to the Clipboard`);
    return;
  };

  const downloadFunction = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${job.topic.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${job.topic} PDF was Downloaded Successfully`);
    return;
  };

  const onclick = async (copy: boolean) => {
    if (job.pdfUrl && copy) {
      copyFunction(job.pdfUrl);
    }

    if (job.pdfUrl && !copy) {
      downloadFunction(job.pdfUrl || "");
    }

    if (!job.pdfUrl) {
      const PDFURL = await createPdfHTML(job.html!, job.customCss!);
      // const uploadedPDFURL = await uploadGeneratePDF(PDFURL, job.topic, job.id);
      if (PDFURL && copy) {
        copyFunction(PDFURL || "");
      }
      if (PDFURL && !copy) {
        downloadFunction(PDFURL || "");
      }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="bg-indigo-500/20 p-2 rounded-full mt-1 flex-shrink-0">
          <FaFilePdf className="h-6 w-6 text-indigo-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-gray-100 line-clamp-2"
            title={job.topic}
          >
            {job.topic}
          </p>
          <Moment className="text-sm text-gray-400">
            {job?.createdAt || ""}
          </Moment>
        </div>
      </div>
      <div className="text-right">
        {job.status === "completed" ? (
          <div className="flex gap-2">
            <Button onClick={() => onclick(true)} className="flex items-center">
              <Copy className="size-6" />
              <span className="hidden md:block">Copy URL</span>
            </Button>
            <Button
              className="flex items-center"
              onClick={() => onclick(false)}
            >
              <DownloadIcon className="size-6" />
              <span className="hidden md:block md:ml-2">Download</span>
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground animate-pulse">
            {shimmerMessages[currentMessageIndex]}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobListItem;
