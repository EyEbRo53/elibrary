import { RiLoader2Fill } from "react-icons/ri";

const Loading = () => {
  return (
    <div className="flex gap-2">
      <RiLoader2Fill className="animate-spin size-8" />
      <span className="text-lg font-semibold">Please wait...</span>
    </div>
  );
};

export default Loading;
