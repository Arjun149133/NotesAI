import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/lib/supabase";
import { Note, summarizeText } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// Note: In a real implementation, these functions would make actual Supabase calls
// This is a simplified version for demonstration purposes

export function useNotes() {
  const queryClient = useQueryClient();

  // Get all notes for the current user
  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: async (): Promise<Note[]> => {
      // In a real app, this would be:
      // const { data, error } = await supabase
      //   .from('notes')
      //   .select('*')
      //   .order('updated_at', { ascending: false });

      // if (error) throw error;
      // return data || [];

      // Mock data for demonstration
      return mockNotes;
    },
  });

  // Get a single note by ID
  const useNote = (id?: string) => {
    return useQuery({
      queryKey: ["notes", id],
      queryFn: async (): Promise<Note | undefined> => {
        if (!id) return undefined;

        // In a real app, this would be:
        // const { data, error } = await supabase
        //   .from('notes')
        //   .select('*')
        //   .eq('id', id)
        //   .single();

        // if (error) throw error;
        // return data;

        // Mock data for demonstration
        return mockNotes.find((note) => note.id === id);
      },
      enabled: !!id,
    });
  };

  // Create a new note
  const createNote = useMutation({
    mutationFn: async (note: { title: string; content: string }) => {
      // In a real app, this would be:
      // const { data, error } = await supabase
      //   .from('notes')
      //   .insert({
      //     ...note,
      //     is_favorite: false,
      //     user_id: (await supabase.auth.getUser()).data.user?.id,
      //   })
      //   .select()
      //   .single();

      // if (error) throw error;
      // return data;

      // Mock implementation
      const newNote: Note = {
        id: Date.now().toString(),
        title: note.title,
        content: note.content,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "current-user-id",
      };

      // Generate AI summary if content is substantial
      if (note.content && note.content.length > 50) {
        try {
          newNote.summary = await summarizeText(note.content);
        } catch (error) {
          console.error("Failed to generate summary:", error);
        }
      }

      return newNote;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      //   toast({
      //     title: "Note created",
      //     description: "Your note has been saved successfully",
      //   });
      return data;
    },
    onError: (error) => {
      //   toast({
      //     title: "Failed to create note",
      //     description:
      //       error instanceof Error ? error.message : "An unknown error occurred",
      //     variant: "destructive",
      //   });
    },
  });

  // Update an existing note
  const updateNote = useMutation({
    mutationFn: async (note: Partial<Note> & { id: string }) => {
      // In a real app, this would be:
      // const { data, error } = await supabase
      //   .from('notes')
      //   .update({
      //     ...note,
      //     updated_at: new Date().toISOString(),
      //   })
      //   .eq('id', note.id)
      //   .select()
      //   .single();

      // if (error) throw error;
      // return data;

      // Mock implementation
      const existingNote = mockNotes.find((n) => n.id === note.id);
      if (!existingNote) throw new Error("Note not found");

      const updatedNote = {
        ...existingNote,
        ...note,
        updated_at: new Date().toISOString(),
      };

      // Generate AI summary if content was updated and is substantial
      if (
        note.content &&
        note.content !== existingNote.content &&
        note.content.length > 50
      ) {
        try {
          updatedNote.summary = await summarizeText(note.content);
        } catch (error) {
          console.error("Failed to update summary:", error);
        }
      }

      return updatedNote;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", data.id] });
      //   toast({
      //     title: "Note updated",
      //     description: "Your note has been updated successfully",
      //   });
      return data;
    },
    onError: (error) => {
      //   toast({
      //     title: "Failed to update note",
      //     description:
      //       error instanceof Error ? error.message : "An unknown error occurred",
      //     variant: "destructive",
      //   });
    },
  });

  // Delete a note
  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      // In a real app, this would be:
      // const { error } = await supabase
      //   .from('notes')
      //   .delete()
      //   .eq('id', id);

      // if (error) throw error;
      // return id;

      // Mock implementation
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      //   toast({
      //     title: "Note deleted",
      //     description: "Your note has been deleted successfully",
      //   });
      return id;
    },
    onError: (error) => {
      //   toast({
      //     title: "Failed to delete note",
      //     description:
      //       error instanceof Error ? error.message : "An unknown error occurred",
      //     variant: "destructive",
      //   });
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
      // In a real app, this would be:
      // const { data, error } = await supabase
      //   .from('notes')
      //   .update({ is_favorite: isFavorite })
      //   .eq('id', id)
      //   .select()
      //   .single();

      // if (error) throw error;
      // return data;

      // Mock implementation
      const existingNote = mockNotes.find((n) => n.id === id);
      if (!existingNote) throw new Error("Note not found");

      return {
        ...existingNote,
        is_favorite: isFavorite,
        updated_at: new Date().toISOString(),
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", data.id] });
      //   toast({
      //     title: data.is_favorite
      //       ? "Added to favorites"
      //       : "Removed from favorites",
      //     description: data.is_favorite
      //       ? "Note has been added to favorites"
      //       : "Note has been removed from favorites",
      //   });
      return data;
    },
    onError: (error) => {
      //   toast({
      //     title: "Failed to update favorites",
      //     description:
      //       error instanceof Error ? error.message : "An unknown error occurred",
      //     variant: "destructive",
      //   });
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    isError: notesQuery.isError,
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
    is_favorite: true,
    created_at: "2023-04-21T10:00:00.000Z",
    updated_at: "2023-04-21T10:00:00.000Z",
    user_id: "current-user-id",
    summary:
      "Introduction to NotesAI app with AI-powered features. Instructions to get started by creating a new note.",
  },
  {
    id: "2",
    title: "AI Summarization Feature",
    content:
      "NotesAI uses AI to automatically summarize your longer notes. This helps you quickly understand the content of a note without reading the entire text. The summary is generated when you create or update a note with substantial content.\n\nThe AI analyzes your text and extracts the most important points to create a concise summary.",
    is_favorite: false,
    created_at: "2023-04-21T11:30:00.000Z",
    updated_at: "2023-04-21T11:30:00.000Z",
    user_id: "current-user-id",
    summary:
      "Description of the AI summarization feature that automatically creates summaries of longer notes to help quickly understand content.",
  },
];
