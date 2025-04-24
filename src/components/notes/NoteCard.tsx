import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Star, Trash2, Edit, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Note } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Note } from "@/lib/api";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export function NoteCard({ note, onDelete, onToggleFavorite }: NoteCardProps) {
  const formattedDate = new Date(note.updatedAt!).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Truncate content for display
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Card
      className={cn(
        "h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md",
        "glass-card border-white/10",
        note.favorite && "ring-1 ring-primary/50"
      )}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-xl font-semibold truncate flex items-center gap-2">
          {note.favorite && (
            <Star className="h-4 w-4 fill-primary text-primary" />
          )}
          <span className="truncate">{note.title}</span>
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className=" z-50">
            <DropdownMenuItem asChild>
              <Link
                href={`/edit-note/${note.id}`}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onToggleFavorite(note.id, !note.favorite)}
              className="flex items-center"
            >
              <Star className="mr-2 h-4 w-4" />
              {note.favorite ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(note.id)}
              className="text-destructive flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="py-4 flex-grow flex flex-col">
        {note.aiSummary && (
          <div className="mb-3 text-sm bg-primary/10 p-2 rounded-md border border-primary/20">
            <div className="font-medium text-xs text-primary mb-1 flex items-center">
              <FileText className="h-3 w-3 mr-1" /> AI aiSummary
            </div>
            <p className="text-muted-foreground">{note.aiSummary}</p>
          </div>
        )}
        <p className="text-muted-foreground line-clamp-4">
          {truncateContent(note.content)}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between text-xs text-muted-foreground">
        <span>Updated {formattedDate}</span>
      </CardFooter>
    </Card>
  );
}
