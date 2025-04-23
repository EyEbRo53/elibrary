import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Search = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const query = searchParams.get("q");
  const [value, setValue] = useState<string | null>(query);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) return;
    params.set("q", value.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const onClear = () => {
    if (query) {
      params.delete("q");
      replace(`${pathname}?${params.toString()}`);
    }
    setValue("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex border h-9 items-center gap-1 rounded-lg px-4 lg:max-w-md w-full border-dark-400"
    >
      <IoSearch className="absolute left-2 size-5 text-muted-foreground" />
      <input
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search Book"
        className="admin-search_input placeholder:text-sm placeholder:text-muted-foreground ml-5"
      />
      {value && (
        <IoMdClose
          className="absolute right-2 size-5 text-muted-foreground cursor-pointer hover:opacity-75 transition"
          onClick={onClear}
        />
      )}
    </form>
  );
};

export default Search;
