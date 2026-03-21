import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get("competitionId");

    const where = competitionId ? { competitionId } : {};

    const matches = await prisma.match.findMany({
      where,
      orderBy: { startAt: "asc" },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { competitionId, homeTeamId, awayTeamId, startAt, venue } = await request.json();

    if (!competitionId || !homeTeamId || !awayTeamId || !startAt) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    if (homeTeamId === awayTeamId) {
      return NextResponse.json(
        { error: "Home and away teams must be different" },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: {
        competitionId,
        homeTeamId,
        awayTeamId,
        startAt: new Date(startAt),
        venue,
        status: "scheduled",
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error("Error creating match:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}
