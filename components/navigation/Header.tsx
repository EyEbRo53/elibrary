"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import DashboardButton from "./DashboardButton";

const Header = ({
  publisher,
  isPublisher,
}: {
  publisher: publisher | undefined;
  isPublisher: boolean;
}) => {
  const session = useSession();
  return (
    <div className="w-full my-4 h-[70px] place-content-center">
      <div className="flex justify-between">
        <Link href={"/"}>
          <Image
            src={"/favicon.ico"}
            alt="Logo"
            width="70"
            height="70"
            className="object-contain"
          />
        </Link>

        <ul className="flex items-center">
          {session.status === "authenticated" ? (
            <>
              <li className="mr-5 xl:mr-[20px]">
                <DashboardButton
                  isPublisher={isPublisher}
                  publisher={publisher}
                />
              </li>
              <li>
                <Avatar
                  onClick={() => signOut()}
                  className="cursor-pointer size-10"
                >
                  <AvatarImage
                    alt={session?.data?.user?.name || ""}
                    src={session?.data?.user?.image || ""}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple">
                    {getInitials(session?.data?.user?.name || "IN")}
                  </AvatarFallback>
                </Avatar>
              </li>
            </>
          ) : (
            <li className="flex gap-2">
              <Button size={"lg"} asChild>
                <Link href={"/sign-up"}>Sign up</Link>
              </Button>
              <Button size={"lg"} asChild>
                <Link href={"/sign-in"}>Sign in</Link>
              </Button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
