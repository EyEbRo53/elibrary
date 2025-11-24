"use client";

import JobListItem from "./JobListItem";
import Loading from "@/components/global/Loading";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const JobsList = () => {
  const { data: jobs, isLoading } = useSWR("/api/jobs", fetcher, {
    refreshInterval: 3000, // poll every 3 seconds
    refreshWhenHidden: false, // stop polling when tab is hidden or page is not visible
  });

  if (isLoading) return <Loading />;
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white/5 rounded-lg border border-dashed border-gray-500/30">
        <h3 className="text-lg font-medium text-gray-200">No Jobs Yet</h3>
        <p className="mt-1 text-sm text-gray-400">
          Your generated PDFs will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job: Job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobsList;
