import { auth } from "@/auth";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/drizzle";

import { redirect } from "next/navigation";

const DashboadLayout = async ({
  params,
  children,
}: {
  params: Promise<{ userId: string }>;
  children: React.ReactNode;
}) => {
  const session = await auth();
  if (!session) redirect("/");

  const id = (await params).userId;

  const publisher = await db.query.publisher.findFirst({
    where: (user, { eq }) => eq(user.userId, id),
  });

  if (!publisher) redirect("/");
  return (
    <main className="dashboard-layout dark-gradient">
      <Sidebar publisher={publisher} />
      <div className="admin-container">
        <Header session={session!} />
        {children}
      </div>
    </main>
  );
};

export default DashboadLayout;
