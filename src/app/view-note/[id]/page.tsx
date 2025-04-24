"use client";
import React, { useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowLeft, Edit, Trash2, Star, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/Mainlayout";
import Link from "next/link";
import { Note } from "@/lib/api";

export default function ViewNote() {
  const { id } = useParams();
  const { useNote, deleteNote, toggleFavorite } = useNotes();
  const { data, isLoading, isError, isFetching } = useNote(id as string);
  const router = useRouter();

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [formattedDate, setFormattedDate] = React.useState("");
  const [formattedContent, setFormattedContent] = React.useState("");
  const [note, setNote] = React.useState<Note | null>(null);

  useEffect(() => {
    if (!data) return;

    setNote(data.note);

    const formattedDate = new Date(data.note.updatedAt!).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    setFormattedDate(formattedDate);

    // Format content with proper line breaks
    const formattedContent = data.note.content
      .split("\n")
      .map((line: string, i: number) => (
        <React.Fragment key={i}>
          {line}
          <br />
        </React.Fragment>
      ));
    setFormattedContent(formattedContent);
  }, [isFetching, data]);

  const handleDelete = async () => {
    if (!note) return;
    try {
      await deleteNote.mutateAsync(note.id);
      router.push("/");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async () => {
    // if (!note) return;
    // await toggleFavorite.mutateAsync({
    //   id: note.id,
    //   isFavorite: !note.favorite,
    // });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-primary">Loading note...</div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !data) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-bold">Note not found</h2>
          <p className="text-muted-foreground">
            The note you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/">Go back to notes</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!note) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-primary">Loading note...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleFavorite}
          className={note.favorite ? "text-primary" : ""}
        >
          <Star
            className={`h-4 w-4 mr-2 ${note.favorite ? "fill-primary" : ""}`}
          />
          {note.favorite ? "Favorited" : "Add to favorites"}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/edit-note/${note.id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
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
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-glow">{note.title}</h1>

      {note.aiSummary && (
        <Card className="mb-6 glass-card border-primary/20">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center text-primary">
              <FileText className="h-4 w-4 mr-2" />
              AI SUMMARY
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-muted-foreground">{note.aiSummary}</p>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card">
        <CardContent className="pt-6 whitespace-pre-line">
          {formattedContent}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t border-border/30 mt-4">
          Last updated: {formattedDate}
        </CardFooter>
      </Card>
    </MainLayout>
  );
}
