import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";

const Socials = () => {
  const [loading, setLoading] = useState(false);

  const onProviderSignUp = async (provider: "github" | "google") => {
    setLoading(true);
    signIn(provider, { redirectTo: "/" });
    setLoading(false);
  };
  return (
    <div className="flex justify-between gap-2">
      <Button
        variant={"outline"}
        className="w-1/2 h-[40px]"
        onClick={() => onProviderSignUp("google")}
        disabled={loading}
      >
        <FcGoogle className="size-6" />
      </Button>
      <Button
        variant={"outline"}
        className="w-1/2 h-[40px]"
        onClick={() => onProviderSignUp("github")}
        disabled={loading}
      >
        <IoLogoGithub className="size-6" />
      </Button>
    </div>
  );
};

export default Socials;
