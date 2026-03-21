import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// 大会一覧取得
export async function GET() {
  try {
    const competitions = await prisma.competition.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(competitions);
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return NextResponse.json(
      { error: "Failed to fetch competitions" },
      { status: 500 }
    );
  }
}

// 大会作成
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, sportType, season } = await request.json();

    if (!name || !sportType) {
      return NextResponse.json(
        { error: "Name and sportType are required" },
        { status: 400 }
      );
    }

    const competition = await prisma.competition.create({
      data: {
        name,
        sportType,
        season,
      },
    });

    return NextResponse.json(competition, { status: 201 });
  } catch (error) {
    console.error("Error creating competition:", error);
    return NextResponse.json(
      { error: "Failed to create competition" },
      { status: 500 }
    );
  }
}
