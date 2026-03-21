"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Team, Competition } from "@/lib/types";
import { Button, Input, Select, Card } from "@/components/ui";
import { formatDateTimeForInput, getCurrentTimestamp } from "@/lib/utils";

export default function NewMatchPage() {
  const router = useRouter();
  const params = useParams();
  const competitionId = params.id as string;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [startAt, setStartAt] = useState(formatDateTimeForInput(getCurrentTimestamp()));
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [compRes, teamsRes] = await Promise.all([
          fetch(`/api/competitions/${competitionId}`),
          fetch("/api/teams"),
        ]);
        const compData = await compRes.json();
        const teamsData = await teamsRes.json();
        setCompetition(compData);
        setTeams(teamsData);
      } catch {
        // エラー処理
      }
    }
    fetchData();
  }, [competitionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (homeTeamId === awayTeamId) {
      alert("ホームとアウェイには異なるチームを選択してください");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitionId,
          homeTeamId,
          awayTeamId,
          startAt: new Date(startAt).toISOString(),
          venue: venue || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create");
      }

      router.push(`/competitions/${competitionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  if (!competition) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">試合の登録</h1>
      <p className="text-gray-600 mb-6">{competition.name}</p>

      <Card>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Select
            label="ホームチーム"
            name="homeTeamId"
            value={homeTeamId}
            onChange={(e) => setHomeTeamId(e.target.value)}
            options={teamOptions}
            required
          />

          <Select
            label="アウェイチーム"
            name="awayTeamId"
            value={awayTeamId}
            onChange={(e) => setAwayTeamId(e.target.value)}
            options={teamOptions}
            required
          />

          <Input
            label="試合日時"
            name="startAt"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
          />

          <Input
            label="会場"
            name="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="例: 市民体育館"
          />

          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "登録中..." : "登録"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
