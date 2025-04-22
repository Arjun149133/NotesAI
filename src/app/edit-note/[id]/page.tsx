"use client";
import React from "react";
import { NoteForm } from "@/components/notes/NoteForm";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/Mainlayout";
import { useParams, useRouter } from "next/navigation";

export default function EditNote() {
  const { id } = useParams();
  const { useNote, updateNote } = useNotes();
  const { data: note, isLoading, isError } = useNote(id as string);
  const router = useRouter();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-primary">Loading note...</div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !note) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-bold">Note not found</h2>
          <p className="text-muted-foreground">
            The note you're trying to edit doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push("/")}>Go back to notes</Button>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = async (data: { title: string; content: string }) => {
    return await updateNote.mutateAsync({
      id: note.id,
      ...data,
    });
  };

  return (
    <MainLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-glow">Edit Note</h1>

      <div className="glass-card p-6">
        <NoteForm
          initialData={note}
          onSubmit={handleSubmit}
          isLoading={updateNote.isPending}
        />
      </div>
    </MainLayout>
  );
}
