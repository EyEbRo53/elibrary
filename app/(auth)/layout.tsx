import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await auth();
  if (isUserAuthenticated) redirect("/");

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
