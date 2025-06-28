"use client";

import { Copy, DownloadIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";
import Moment from "react-moment";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import Loading from "@/components/global/Loading";

const JobListItem = ({ job }: { job: Job }) => {
  const OnCopy = () => {
    navigator.clipboard.writeText(job.pdfUrl || "");
    toast.success(`${job.topic} PDF URL was Copied to the Clipboard`);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="bg-indigo-500/20 p-2 rounded-full mt-1 flex-shrink-0">
          <FileTextIcon className="h-6 w-6 text-indigo-300" />
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
        {job.status === "completed" && job.pdfUrl ? (
          <div className="flex gap-2">
            <Button onClick={OnCopy} className="flex items-center">
              <Copy className="size-6" />
              <span className="hidden md:block">Copy URL</span>
            </Button>
            <Button>
              <Link
                href={job.pdfUrl}
                download={`generated-pdf-${job.topic}.pdf`}
                className="flex items-center"
              >
                <DownloadIcon className="size-6" />
                <span className="hidden md:block md:ml-2">Download</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="p-2 border border-dark-400 rounded-md">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListItem;
