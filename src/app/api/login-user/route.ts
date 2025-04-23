import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 200 }
      );
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password!
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "User authenticated successfully" },
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
