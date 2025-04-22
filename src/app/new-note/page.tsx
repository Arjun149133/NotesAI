"use client";
import React from "react";
import { NoteForm } from "@/components/notes/NoteForm";
import { useNotes } from "@/hooks/useNotes";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/Mainlayout";
import { useRouter } from "next/navigation";

export default function CreateNote() {
  const { createNote } = useNotes();
  const router = useRouter();

  return (
    <MainLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-glow">Create New Note</h1>

      <div className="glass-card p-6">
        <NoteForm
          onSubmit={createNote.mutateAsync}
          isLoading={createNote.isPending}
        />
      </div>
    </MainLayout>
  );
}
