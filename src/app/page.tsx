"use client";
import React, { useEffect, useState } from "react";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotes } from "@/hooks/useNotes";
import { FileText, Plus, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MainLayout } from "@/components/layout/Mainlayout";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { Note } from "@/lib/api";

export default function Page() {
  const { data, isFetching, isLoading, deleteNote, toggleFavorite } =
    useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const supabase = createClient();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(data.notes);
  }, [isFetching]);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/create-user`,
            {
              email: data.user?.email,
            }
          );

          if (res.status === 200) {
            res.data.message;
          }
        } catch (error) {
          console.error("Error in useEffect:11", error);
        }
      }
    };

    try {
      getUser();
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

  useEffect(() => {
    if (!notes) return;

    const filteredNotes = notes.filter(
      (note: Note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredNotes(filteredNotes);
  }, [searchTerm, notes]);

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-primary">Loading notes...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glow mb-2">Your Notes</h1>
        <p className="text-muted-foreground">
          Create, manage, and organize your thoughts across the cosmos
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="space-gradient w-full sm:w-auto" asChild>
          <Link href="/new-note">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-pulse text-primary">Loading notes...</div>
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note: Note) => (
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
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium">No notes found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No notes match your search. Try different keywords."
                  : "Get started by creating your first note."}
              </p>
              {!searchTerm && (
                <Button className="space-gradient mt-2" asChild>
                  <Link href="/new-note">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Note
                  </Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-pulse text-primary">
                Loading favorites...
              </div>
            </div>
          ) : filteredNotes.filter((note: Note) => note.favorite).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes
                .filter((note: Note) => note.favorite)
                .map((note: Note) => (
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
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium">No favorites yet</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No favorite notes match your search."
                  : "Mark notes as favorites to see them here."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
