"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Competition, Match, Team, Standing } from "@/lib/types";
import { calculateStandings } from "@/lib/standings";
import { Button, Card, Table } from "@/components/ui";
import StandingsTable from "@/components/StandingsTable";
import { formatDate } from "@/lib/utils";

export default function CompetitionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [compRes, teamsRes] = await Promise.all([
          fetch(`/api/competitions/${id}`),
          fetch("/api/teams"),
        ]);

        if (!compRes.ok) throw new Error("Failed to fetch");

        const compData = await compRes.json();
        const teamsData = await teamsRes.json();

        setCompetition(compData);
        setMatches(compData.matches || []);
        setTeams(teamsData);

        // 順位表を計算
        if (teamsData.length > 0) {
          setStandings(calculateStandings({ teams: teamsData, matches: compData.matches || [] }));
        }
      } catch {
        // エラー処理
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!competition) {
    return <div>大会が見つかりません</div>;
  }

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.name || "不明";
  };

  const matchColumns = [
    {
      key: "match",
      header: "対戦",
      render: (item: Match) => (
        <span>
          {getTeamName(item.homeTeamId)} vs {getTeamName(item.awayTeamId)}
        </span>
      ),
    },
    {
      key: "score",
      header: "スコア",
      render: (item: Match) =>
        item.status === "finished"
          ? `${item.homeScore} - ${item.awayScore}`
          : "-",
    },
    {
      key: "status",
      header: "状態",
      render: (item: Match) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.status === "finished"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status === "finished" ? "終了" : "予定"}
        </span>
      ),
    },
    {
      key: "startAt",
      header: "日時",
      render: (item: Match) => formatDate(item.startAt),
    },
    {
      key: "actions",
      header: "操作",
      render: (item: Match) => (
        <Link href={`/competitions/${id}/matches/${item.id}/edit`}>
          <Button variant="secondary">編集</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{competition.name}</h1>
        <Link href={`/competitions/${id}/edit`}>
          <Button variant="secondary">大会を編集</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="基本情報">
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">競技</dt>
              <dd>
                {competition.sportType === "football" && "フットサル"}
                {competition.sportType === "tabletennis" && "卓球"}
                {competition.sportType === "other" && "その他"}
              </dd>
            </div>
            {competition.season && (
              <div>
                <dt className="text-sm text-gray-500">シーズン</dt>
                <dd>{competition.season}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card title="順位表">
          <StandingsTable standings={standings} />
        </Card>
      </div>

      <Card title="試合一覧">
        <div className="mb-4">
          <Link href={`/competitions/${id}/matches/new`}>
            <Button>試合を追加</Button>
          </Link>
        </div>
        <Table
          columns={matchColumns}
          data={matches}
          emptyMessage="試合がありません"
        />
      </Card>
    </div>
  );
}
