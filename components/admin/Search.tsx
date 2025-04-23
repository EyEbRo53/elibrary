import { MdSearch } from "react-icons/md";

const Search = () => {
  return (
    <div className="admin-search border-dark-400 bg-dark-100">
      <MdSearch className="size-8" />
      <input className="admin-search_input" placeholder="Search Book" />
    </div>
  );
};

export default Search;
