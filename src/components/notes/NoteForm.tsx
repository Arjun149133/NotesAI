import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Note } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

interface NoteFormProps {
  initialData?: Note;
  onSubmit: any;
  isLoading: boolean;
}

export function NoteForm({ initialData, onSubmit, isLoading }: NoteFormProps) {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        content: initialData.content,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSummarizing(true);
    try {
      const result = await onSubmit(values);
      router.push("/");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Note title"
                  {...field}
                  disabled={isLoading || isSummarizing}
                  className="text-lg font-medium"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your note here..."
                  {...field}
                  disabled={isLoading || isSummarizing}
                  className="min-h-[300px] resize-y font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            // onClick={() => navigate(-1)}
            disabled={isLoading || isSummarizing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="space-gradient"
            disabled={isLoading || isSummarizing}
          >
            {(isLoading || isSummarizing) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Update Note" : "Create Note"}
            {isSummarizing && " & Summarizing..."}
          </Button>
        </div>
      </form>
    </Form>
  );
}
