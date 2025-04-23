import { Session } from "next-auth";

import Search from "@/components/admin/Search";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div>
        <h2 className="text-2xl font-semibold">
          {session?.user?.name} Benson Raro
        </h2>
        <p className="text-base text-slate-400">
          Monitor all of your E-Library here
        </p>
      </div>

      <Search />
    </header>
  );
};
export default Header;
