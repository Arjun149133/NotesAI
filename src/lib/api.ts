export interface Note {
  id: string;
  title: string;
  content: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  summary?: string;
}

// Function to summarize text using DeepSeek API
export async function summarizeText(text: string): Promise<string> {
  try {
    // This is a placeholder. In a real implementation, you would:
    // 1. Set up proper API keys (ideally through environment variables or Supabase)
    // 2. Make an actual API call to DeepSeek or another AI service

    // Mock API call for demonstration purposes
    console.log("Summarizing text:", text.substring(0, 50) + "...");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return a mock summary
    const wordCount = text.split(" ").length;

    if (wordCount < 10) {
      return "Text is too short to summarize.";
    }

    // For demo purposes, return first 20 words + "..."
    const summary = text.split(" ").slice(0, 20).join(" ") + "...";
    return summary;
  } catch (error) {
    console.error("Error summarizing text:", error);
    return "Failed to generate summary.";
  }
}

// In a real implementation, you would use Supabase for data operations like this:
/*
  export async function createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        ...note,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();
  
    if (error) throw error;
    return data;
  }
  */
