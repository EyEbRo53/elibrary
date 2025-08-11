const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex items-center p-4 bg-slate-100 dark:bg-slate-700 rounded-lg shadow-inner">
      <div className="p-3 mr-4 text-blue-500 bg-blue-100 dark:text-blue-100 dark:bg-blue-500 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </p>
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
