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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Handle form submission
    console.log(data);
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
