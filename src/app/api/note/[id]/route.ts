import { prisma } from "@/db";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userInDb = await prisma.user.findUnique({
      where: {
        email: user.data.user?.email,
      },
    });

    if (!userInDb) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id: id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Note fetched successfully", note },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userInDb = await prisma.user.findUnique({
      where: {
        email: user.data.user?.email,
      },
    });

    if (!userInDb) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id: id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const { title, content, type } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const updatedNote = await prisma.note.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        type: type ?? "NOTE",
      },
    });

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/summarize`,
      {
        content: note.content,
        id: note.id,
      }
    );

    return NextResponse.json(
      {
        message: "Note updated successfully",
        note: updatedNote,
        summarized: response.status === 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notes:", error);
    return NextResponse.json(
      { error: "Failed to update notes" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userInDb = await prisma.user.findUnique({
      where: {
        email: user.data.user?.email,
      },
    });

    if (!userInDb) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id: id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await prisma.note.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notes:", error);
    return NextResponse.json(
      { error: "Failed to delete notes" },
      { status: 500 }
    );
  }
}
