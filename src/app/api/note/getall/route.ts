import { prisma } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

    const notes = await prisma.note.findMany({
      where: {
        userId: userInDb.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { message: "Notes fetched successfully", notes },
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
