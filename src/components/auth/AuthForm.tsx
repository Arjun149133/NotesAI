"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Lock, Mail, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export function AuthForm({ text }: { text?: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Handle form submission
    try {
      const supabase = await createClient();

      const formData = {
        email: data.email as string,
        password: data.password as string,
      };

      if (text === "Sign Up") {
        // Check if the user already exists
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/create-user`,
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (res.status === 200 && res.data.message === "User already exists") {
          toast.error("User already exists. Please sign in.");
          return;
        }

        if (res.status !== 200) {
          toast.error("User creation failed. Please try again.");
          return;
        }

        const { error } = await supabase.auth.signUp(formData);

        if (error) {
          console.error("Error signing up:", error);
          toast.error(
            "Error signing up. Please check your email and password."
          );
          return;
        }

        toast.success("Sign up successful! ");
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/login-user`,
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (res.status === 200 && res.data.message === "User does not exist") {
          toast.error("User does not exist. Please sign up.");
          return;
        }

        if (res.status === 200 && res.data.message === "Invalid password") {
          toast.error("Invalid password. Please try again.");
          return;
        }

        if (res.status !== 200) {
          toast.error("User authentication failed. Please try again.");
          return;
        }

        const { error } = await supabase.auth.signInWithPassword(formData);

        if (error) {
          console.error("Error signing in:", error);
          toast.error(
            "Error signing in. Please check your email and password."
          );
          return;
        }

        router.push("/");
        toast.success("Sign in successful!");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                {/* <FormLabel>Email</FormLabel> */}
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Mail size={18} />
                    </span>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      className="pl-10 pr-3 py-2 rounded-lg w-full bg-[#23273C] text-white border border-gray-700 focus:border-[#884dff] outline-none transition-all"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Lock size={18} />
                    </span>
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      className="pl-10 pr-3 py-2 rounded-lg w-full bg-[#23273C] text-white border border-gray-700 focus:border-[#884dff] outline-none transition-all"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className=" flex items-center justify-center">
          <Button type="submit" className=" cursor-pointer min-w-28">
            {text}
          </Button>
        </div>
      </form>
    </Form>
  );
}
