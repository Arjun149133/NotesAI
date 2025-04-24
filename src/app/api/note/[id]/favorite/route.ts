import { prisma } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { favorite } = await req.json();

    if (typeof favorite !== "boolean") {
      return NextResponse.json(
        { error: "Invalid favorite value" },
        { status: 400 }
      );
    }

    const note = await prisma.note.findFirst({
      where: {
        id: id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const updateNote = await prisma.note.update({
      where: {
        id: id,
      },
      data: {
        favorite: favorite,
      },
    });

    return NextResponse.json(
      {
        message: "Note updated successfully",
        note: updateNote,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}
