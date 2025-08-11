import PublisherDialog from "./PublisherDialog";

import { Button } from "@/components/ui/button";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardButton = ({
  publisher,
  isPublisher,
}: {
  publisher: publisher | undefined;
  isPublisher: boolean;
}) => {
  const session = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onClick = () => {
    if (isPublisher) {
      router.push(`/dashboard/${session?.data?.user?.id}`);
    } else {
      setOpen(true);
    }
  };
  return (
    <>
      {open && (
        <PublisherDialog open={open} setOpen={setOpen} publisher={publisher} />
      )}
      <Button size={"lg"} onClick={onClick}>
        <TbLayoutDashboardFilled className="size-6" />
        <span className="ml-2 hidden md:block">Dashboard</span>
      </Button>
    </>
  );
};

export default DashboardButton;
