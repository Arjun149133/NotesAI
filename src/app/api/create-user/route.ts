import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let newPassword = password;
    if (!password) {
      newPassword = "";
    } else {
      newPassword = await bcrypt.hash(password, 10);
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    await prisma.user.create({
      data: {
        email: email,
        password: newPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
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
