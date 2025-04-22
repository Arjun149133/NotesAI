"use client";
import React, { useState } from "react";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotes } from "@/hooks/useNotes";
import { Book, Plus, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MainLayout } from "@/components/layout/Mainlayout";
import Link from "next/link";

export default function Journal() {
  const { notes, isLoading, deleteNote, toggleFavorite } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // For demonstration, we'll just show all notes in a different layout
  // In a real app, we might have a dedicated journal category
  const journalNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNote = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteNote.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    await toggleFavorite.mutateAsync({ id, isFavorite });
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glow mb-2 flex items-center">
          <Book className="h-6 w-6 mr-2" />
          Journal
        </h1>
        <p className="text-muted-foreground">
          Track your daily thoughts and ideas
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search journal..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="space-gradient w-full sm:w-auto" asChild>
          <Link href="/new-note">
            <Plus className="mr-2 h-4 w-4" />
            New Journal Entry
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse text-primary">
            Loading journal entries...
          </div>
        </div>
      ) : journalNotes.length > 0 ? (
        <div className="space-y-6">
          {journalNotes.map((note) => (
            <Link
              href={`/view-note/${note.id}`}
              key={note.id}
              className="block"
            >
              <NoteCard
                note={note}
                onDelete={handleDeleteNote}
                onToggleFavorite={handleToggleFavorite}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Book className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">Your journal is empty</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "No journal entries match your search."
              : "Start writing your thoughts and ideas."}
          </p>
          <Button className="space-gradient mt-2" asChild>
            <Link href="/new-note">
              <Plus className="mr-2 h-4 w-4" />
              Create Entry
            </Link>
          </Button>
        </div>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              journal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
