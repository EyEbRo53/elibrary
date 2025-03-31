"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

const Header = () => {
  const session = useSession();
  return (
    <div className="w-full my-4 h-[70px] place-content-center">
      <div className="flex justify-between">
        <Link href={"/"}>
          <Image
            src={"/favicon.ico"}
            alt="Logo"
            width="50"
            height="40"
            className="object-contain"
          />
        </Link>

        <ul className="flex items-center">
          {session.status === "authenticated" ? (
            <>
              <li className="mr-5 xl:mr-[20px]">
                <Button size={"lg"} asChild>
                  <Link href={`/Dashboard/${session.data.user?.id}`}>
                    Dashboard
                  </Link>
                </Button>
              </li>
              <li>
                <img
                  src={session?.data?.user?.image || ""}
                  alt="avatar"
                  onClick={() => signOut()}
                  className="rounded-full cursor-pointer"
                  width={"54"}
                  height={"54"}
                  loading="eager"
                />
              </li>
            </>
          ) : (
            <li>
              <Button size={"lg"} onClick={() => {}}>
                Login
              </Button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
