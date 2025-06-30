"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/global/FormField";
import Socials from "./Socials";
import { signUp } from "@/actions/auth";
import { rateLimit } from "@/actions/rateLimit";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await rateLimit();
      if (type === "sign-up") {
        const values = {
          fullName: data.name!,
          email: data.email,
          password: data.password,
        };
        const signup = await signUp(values);
        if (signup.success) {
          toast.success("Account created successfully. Please sign in.");
          router.push("/sign-in");
        }
      } else {
        try {
          const login = await signIn("credentials", {
            email: data.email,
            password: data.password,
            callbackUrl: "/",
          });
          if (login?.ok) {
            toast.success("Signed in successfully.");
          }
          if (login?.error) {
            toast.error("Something Went Wrong. Please try again");
          }
        } catch (error) {
          toast.error("Something Went Wrong. Please try again");
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-4 card py-8 px-10">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image src="/favicon.ico" alt="logo" height={50} width={50} />
          <h2 className="text-primary font-bold text-4xl">E-Library</h2>
        </div>
        <h2 className="capitalize font-bold text-xl">{type}</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="w-full text-lg font-bold" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <Socials />
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold"
          >
            {!isSignIn ? " Sign In" : " Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
