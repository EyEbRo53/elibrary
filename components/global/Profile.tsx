"use client";

import { BookIcon, DownloadIcon } from "lucide-react";
import StatCard from "./StatCard";

const Profile = ({
  publisherData,
  Books,
}: {
  publisherData: {
    name: string;
    imageUrl: string;
    description: string;
    stats: {
      books: number;
      downloads: number;
    };
  };
  Books: React.ReactNode;
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };
  return (
    <main className="p-4 font-sans">
      <div className="w-full bg-dark-100 rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300">
        <div className="h-32 bg-gradient-to-br from-primary to-blue-500"></div>
        <div className="p-6">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto -mt-20 md:-mt-24 border-8 border-white dark:border-slate-800 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-primary to-blue-500">
            <img
              className="object-cover w-full h-full"
              src={publisherData.imageUrl || "/placeholder.png"}
              alt={`Profile of ${publisherData.name}`}
            />
          </div>
          {/* <ProfileImage imageUrl={publisherData.imageUrl} name={publisherData.name} /> */}
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {publisherData.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              PDF Publisher & Content Creator
            </p>
          </div>
          <p className="text-center text-slate-700 dark:text-slate-300 mt-4 mx-auto max-w-xs">
            {publisherData.description}
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              icon={<BookIcon className="w-6 h-6" />}
              label="Books Published"
              value={formatNumber(publisherData.stats.books)}
            />
            <StatCard
              icon={<DownloadIcon className="w-6 h-6" />}
              label="Total Downloads"
              value={formatNumber(publisherData.stats.downloads)}
            />
          </div>
        </div>

        <div className="mt-2 w-full overflow-hidden p-3">{Books}</div>
      </div>
    </main>
  );
};

export default Profile;
