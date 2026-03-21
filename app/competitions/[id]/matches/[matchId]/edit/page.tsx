"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Match, Team } from "@/lib/types";
import { Button, Input, Select, Card } from "@/components/ui";
import { formatDateTimeForInput } from "@/lib/utils";

export default function EditMatchPage() {
  const router = useRouter();
  const params = useParams();
  const competitionId = params.id as string;
  const matchId = params.matchId as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeScore, setHomeScore] = useState<string>("");
  const [awayScore, setAwayScore] = useState<string>("");
  const [status, setStatus] = useState<"scheduled" | "finished">("scheduled");
  const [startAt, setStartAt] = useState("");
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [matchRes, teamsRes] = await Promise.all([
          fetch(`/api/matches/${matchId}`),
          fetch("/api/teams"),
        ]);

        const matchData = await matchRes.json();
        const teamsData = await teamsRes.json();

        if (matchData) {
          setMatch(matchData);
          setHomeScore(matchData.homeScore?.toString() || "");
          setAwayScore(matchData.awayScore?.toString() || "");
          setStatus(matchData.status);
          setStartAt(formatDateTimeForInput(matchData.startAt));
          setVenue(matchData.venue || "");
        }

        setTeams(teamsData);
      } catch {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [matchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const homeScoreNum = homeScore === "" ? null : parseInt(homeScore, 10);
    const awayScoreNum = awayScore === "" ? null : parseInt(awayScore, 10);

    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeScore: homeScoreNum,
          awayScore: awayScoreNum,
          status,
          startAt: new Date(startAt).toISOString(),
          venue: venue || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      router.push(`/competitions/${competitionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!match) {
    return <div>試合が見つかりません</div>;
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.name || "不明";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">試合の編集</h1>

      <Card>
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <div className="text-center">
            <span className="font-bold">{getTeamName(match.homeTeamId)}</span>
            <span className="mx-4">vs</span>
            <span className="font-bold">{getTeamName(match.awayTeamId)}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={`${getTeamName(match.homeTeamId)} の得点`}
              name="homeScore"
              type="number"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              placeholder="0"
            />

            <Input
              label={`${getTeamName(match.awayTeamId)} の得点`}
              name="awayScore"
              type="number"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              placeholder="0"
            />
          </div>

          <Select
            label="試合状態"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            options={[
              { value: "scheduled", label: "予定" },
              { value: "finished", label: "終了" },
            ]}
          />

          <Input
            label="試合日時"
            name="startAt"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />

          <Input
            label="会場"
            name="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />

          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={saving}>
              {saving ? "保存中..." : "保存"}
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
