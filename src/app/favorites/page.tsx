"use client";
import React, { useState } from "react";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotes } from "@/hooks/useNotes";
import { Search, Star } from "lucide-react";
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

export default function Favorites() {
  const { notes, isLoading, deleteNote, toggleFavorite } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter for favorites only
  const favoriteNotes = notes.filter(
    (note) =>
      note.is_favorite &&
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Star className="h-6 w-6 mr-2 fill-primary text-primary" />
          Favorite Notes
        </h1>
        <p className="text-muted-foreground">
          Your most important notes, all in one place
        </p>
      </div>

      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search favorites..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse text-primary">Loading favorites...</div>
        </div>
      ) : favoriteNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteNotes.map((note) => (
            <Link
              href={`/view-note/${note.id}`}
              key={note.id}
              className="block h-full"
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
            <Star className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No favorites yet</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "No favorite notes match your search."
              : "Star your favorite notes to see them here."}
          </p>
          <Button className="space-gradient mt-2" asChild>
            <Link href="/">Browse all notes</Link>
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
              note.
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
