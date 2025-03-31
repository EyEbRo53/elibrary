import { auth } from "@/auth";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { redirect } from "next/navigation";

const DashboadLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  // if (!session?.user?.id) redirect("/sign-in");

  return (
    <main className="dashboard-layout dark-gradient">
      <Sidebar session={session!} />

      <div className="admin-container">
        <Header session={session!} />
        {children}
      </div>
    </main>
  );
};

export default DashboadLayout;
