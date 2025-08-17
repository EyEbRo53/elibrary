"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sort } from "@/constants";
import Search from "@/components/global/Search";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const createPageUrl = (sort: string) => {
    if (sort === "Clear") {
      params.delete("sort");
      replace(`${pathname}?${params.toString()}`);
    } else {
      params.set("sort", sort.toString());
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const sort = searchParams.get("sort");
  return (
    <div className="flex gap-2">
      <Search />
      <Select onValueChange={(e) => createPageUrl(e)} defaultValue={sort || ""}>
        <SelectTrigger>
          <SelectValue placeholder="Select Filter" />
        </SelectTrigger>
        <SelectContent className="border-zinc-800">
          <SelectItem value="Clear">Clear Sort</SelectItem>
          {Sort.map((sort, i) => (
            <SelectItem key={i} value={sort.sort}>
              {sort.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
