import { auth } from "@/auth";
import Header from "@/components/navigation/Header";
import { db } from "@/drizzle";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, session?.user?.id || ""),
  });
  const isPublisher = user?.role === "publisher";

  const publisher = await db.query.publisher.findFirst({
    where: (user, { eq }) => eq(user.userId, session?.user?.id || ""),
  });
  return (
    <div className="root-layout">
      <div className="px-2 sticky z-30">
        <Header isPublisher={isPublisher} publisher={publisher} />
      </div>
      {children}
    </div>
  );
};

export default RootLayout;
