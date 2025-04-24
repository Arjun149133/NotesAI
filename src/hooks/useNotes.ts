import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/lib/supabase";
import { Note, summarizeText } from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast";

// Note: In a real implementation, these functions would make actual Supabase calls
// This is a simplified version for demonstration purposes

export function useNotes() {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const notes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/note/getall`
      );

      console.log("notes data", notes.data);

      return notes.data;
    },
  });

  // Get a single note by ID
  const useNote = (id?: string) => {
    return useQuery({
      queryKey: ["notes", id],
      queryFn: async () => {
        if (!id) return undefined;

        const note = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/note/${id}`
        );

        return note.data;
      },
      enabled: !!id,
    });
  };

  // Create a new note
  const createNote = useMutation({
    mutationFn: async (note: {
      title: string;
      content: string;
      type?: string;
    }) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/note/create`, {
        title: note.title,
        content: note.content,
        type: note.type,
      });
    },
    onSuccess: (data) => {
      console.log("note data", data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast("Your note has been saved successfully");
      return data;
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to create note", {
        description: "An unknown error occurred",
      });
    },
  });

  // Update an existing note
  const updateNote = useMutation({
    mutationFn: async (note: Partial<Note> & { id: string }) => {
      const { id, ...rest } = note;

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/note/${id}`,
        {
          ...rest,
        }
      );

      if (res.status !== 200) {
        throw new Error("Failed to update note");
      }

      return res.data;
    },
    onSuccess: (data) => {
      console.log("updated note data", data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", data.note.id] });
      toast.success("Note updated");
      return data;
    },
    onError: (error) => {
      toast.error("Failed to update note");
    },
  });

  // Delete a note
  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/note/${id}`
      );

      if (res.status !== 200) {
        throw new Error("Failed to delete note");
      }

      return res.data;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully");
      return id;
    },
    onError: (error) => {
      toast.error("Failed to delete note", {
        description: "An unknown error occurred",
      });
    },
  });

  // Toggle favorite status
  const toggleFavorite = useMutation({
    mutationFn: async ({
      id,
      isFavorite,
    }: {
      id: string;
      isFavorite: boolean;
    }) => {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/note/${id}/favorite`,
        {
          favorite: isFavorite,
        }
      );

      if (res.status !== 200) {
        throw new Error("Failed to update favorite status");
      }

      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", data.id] });
      toast.success(
        data.note.favorite
          ? "Note added to favorites"
          : "Note removed from favorites"
      );
      return data;
    },
    onError: (error) => {
      toast.error("Failed to update favorite status", {
        description: "An unknown error occurred",
      });
    },
  });

  return {
    data: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    isError: notesQuery.isError,
    isFetching: notesQuery.isFetching,
    error: notesQuery.error,
    useNote,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
  };
}

// Mock data for demonstration purposes
const mockNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to NotesAI",
    content:
      'NotesAI is your AI-powered note-taking app with a space theme. Create, edit, and organize your notes with ease. The AI summarization feature helps you get the gist of long notes quickly.\n\nTo get started, click the "New Note" button in the sidebar to create your first note.',
    favorite: true,
    type: "NOTE",
    createdAt: "2023-04-21T10:00:00.000Z",
    updatedAt: "2023-04-21T10:00:00.000Z",
    userId: "current-user-id",
    aiSummary:
      "Introduction to NotesAI app with AI-powered features. Instructions to get started by creating a new note.",
  },
  {
    id: "2",
    title: "AI Summarization Feature",
    content:
      "NotesAI uses AI to automatically summarize your longer notes. This helps you quickly understand the content of a note without reading the entire text. The aiSummary is generated when you create or update a note with substantial content.\n\nThe AI analyzes your text and extracts the most important points to create a concise aiSummary.",
    favorite: false,
    type: "JOURNAL",
    createdAt: "2023-04-21T11:30:00.000Z",
    updatedAt: "2023-04-21T11:30:00.000Z",
    userId: "current-user-id",
    aiSummary:
      "Description of the AI summarization feature that automatically creates summaries of longer notes to help quickly understand content.",
  },
];
