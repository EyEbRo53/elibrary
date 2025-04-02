"use client";

import Image from "next/image";
// import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { adminSideBarLinks } from "@/constants";

const Sidebar = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <div className="admin-sidebar bg-dark-100 shadow-2xl">
      <div>
        <div className="flex items-center">
          <Image
            src="/favicon.ico"
            alt="logo"
            height={50}
            width={50}
            className="size-16"
          />
          <h1 className="text-xl font-bold hidden md:block">E-Book</h1>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected = pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "link",
                    isSelected &&
                      "bg-gradient-to-br from-primary to-purple shadow-sm"
                  )}
                >
                  <link.icon className="size-6" />
                  <p
                    className={cn(
                      isSelected ? "text-black text-lg font-bold" : "text-dark"
                    )}
                  >
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="user">
        {/* <Avatar>
          <AvatarFallback className="bg-amber-100">
            {getInitials(session?.user?.name || "IN")}
          </AvatarFallback>
        </Avatar> */}

        <div className="flex flex-col max-md:hidden">
          <p className="font-semibold text-dark-200">{session?.user?.name}</p>
          <p className="text-xs text-light-500">{session?.user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
