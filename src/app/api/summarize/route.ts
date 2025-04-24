import { prisma } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // const supabase = await createClient();

    // const user = await supabase.auth.getUser();

    // if (!user) {
    //   return NextResponse.json(
    //     { error: "User not authenticated" },
    //     { status: 401 }
    //   );
    // }

    // console.log("user email::::", user.data.user?.email);

    // const userInDb = await prisma.user.findUnique({
    //   where: {
    //     email: user.data.user?.email,
    //   },
    // });

    // if (!userInDb) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    const { content, id } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: `Summarize the following text and give me brief content without any extra details the response should only contain the summary without any other text: ${content}`,
        },
      ],
    });

    const updatedNote = await prisma.note.update({
      where: {
        id: id,
      },
      data: {
        aiSummary: completion.choices[0].message.content,
      },
    });

    return NextResponse.json(
      {
        message: completion.choices[0].message,

        note: updatedNote,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
