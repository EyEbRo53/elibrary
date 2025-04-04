import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { toast } from "sonner";
import { createPublisher, updatePublisher } from "@/actions/publisher";

const PublisherDialog = ({
  open,
  setOpen,
  publisher,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  publisher: publisher | undefined;
}) => {
  const session = useSession();
  const router = useRouter();
  const image = publisher ? publisher?.image : session.data?.user?.image;
  const name = publisher ? publisher?.name : session.data?.user?.name;
  const [value, setValue] = useState(name);
  const [loading, setLoading] = useState(false);

  const fixedImage = "/favicon.ico";
  const Create = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = {
      image: fixedImage,
      name: value,
    };
    setLoading(true);
    if (publisher) {
      const updateProfile = await updatePublisher(values);
      if (updateProfile.success) {
        toast.success("Publisher Profile Updated successfully");
        router.push(`/dashboard/${session.data?.user?.id}`);
        setOpen(false);
      } else {
        setLoading(false);
        toast.error(updateProfile.message);
      }
    } else {
      const createProfile = await createPublisher(values);
      if (createProfile.success) {
        toast.success("Publisher Profile Created successfully");
        router.push(`/dashboard/${session.data?.user?.id}`);
        setLoading(false);
        setOpen(false);
      } else {
        setLoading(false);
        toast.error(createProfile.message);
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dark-gradient border-zinc-700">
        <DialogTitle>
          {publisher
            ? "Update Your Publisher Profile"
            : "Craete Your Publisher Profile"}
        </DialogTitle>
        <form className="space-y-4" onSubmit={Create}>
          <div className="flex justify-center items-center p-4">
            <div className="flex justify-center items-center rounded-full relative hover:bg-dark-300 group size-30">
              <input accept="" className="hidden" />
              <MdEdit className="size-8 absolute z-10 text-green-400 opacity-0 group-hover:opacity-100 cursor-pointer" />
              <img
                src={image || "/favicon.ico"}
                alt=""
                className="size-20 cursor-pointer rounded-full"
              />
            </div>
          </div>
          <Input
            required
            disabled={loading}
            value={value!}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {publisher ? "Update" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PublisherDialog;
