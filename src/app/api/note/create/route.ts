import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const user = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { title, content, type } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
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

    const note = await prisma.note.create({
      data: {
        title,
        content,
        type: type ?? "NOTE",
        userId: userInDb.id,
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Failed to create note" },
        { status: 500 }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/summarize`,
      {
        content: note.content,
        id: note.id,
      }
    );

    return NextResponse.json(
      {
        message: "Note created successfully",
        note,
        summarized: response.status === 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
