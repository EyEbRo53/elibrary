"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MdBook, MdHome } from "react-icons/md";
import { useState } from "react";

import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PublisherDialog from "@/components/navigation/PublisherDialog";

const Sidebar = ({ publisher }: { publisher: publisher | undefined }) => {
  const pathname = usePathname();
  const session = useSession();
  const [open, setOpen] = useState(false);

  const isDashboard = pathname.includes("dashboard");

  const avatarClick = () => {
    if (isDashboard) {
      setOpen(true);
    }
  };

  const dashboardSideBarLinks = [
    {
      icon: MdHome,
      route: `/dashboard/${session.data?.user?.id}`,
      text: "Home",
    },
    {
      icon: MdBook,
      route: `/dashboard/${session.data?.user?.id}/books`,
      text: "All Books",
    },
    {
      icon: MdBook,
      route: `/dashboard/${session.data?.user?.id}/books/new`,
      text: "Add Books",
    },
  ];

  return (
    <>
      <div className="sidebar bg-dark-100 shadow-2xl">
        <div>
          <Link href={"/"} className="flex items-center">
            <Image
              src="/favicon.ico"
              alt="logo"
              height={50}
              width={50}
              className="size-16"
            />
            <h1 className="text-2xl font-bold text-primary hidden md:block">
              E-Library
            </h1>
          </Link>

          <div className="mt-10 flex flex-col gap-5">
            {dashboardSideBarLinks.map((link) => {
              const isSelected = pathname === link.route;

              return (
                <Link href={link.route} key={link.route}>
                  <div
                    className={cn(
                      "link",
                      isSelected &&
                        "bg-gradient-to-br from-primary to-blue shadow-sm"
                    )}
                  >
                    <link.icon className="size-6" />
                    <p
                      className={cn(
                        isSelected
                          ? "text-black text-lg font-bold"
                          : "text-dark"
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

        <div className="user cursor-pointer" onClick={avatarClick}>
          <Avatar className="size-10">
            <AvatarImage
              alt={session?.data?.user?.name || ""}
              src={session?.data?.user?.image || ""}
            />
            <AvatarFallback className="bg-gradient-to-br from-primary to-blue">
              {getInitials(session?.data?.user?.name || "IN")}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col max-md:hidden">
            <p className="font-semibold">{session?.data?.user?.name}</p>
            <p className="text-xs text-gray-300">
              {session?.data?.user?.email}
            </p>
          </div>
        </div>
      </div>
      {isDashboard && open && (
        <PublisherDialog open={open} setOpen={setOpen} publisher={publisher} />
      )}
    </>
  );
};

export default Sidebar;
