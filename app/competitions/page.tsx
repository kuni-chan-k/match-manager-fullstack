"use client";

import Link from "next/link";
import { useCompetitions } from "@/lib/hooks/use-competitions";
import { Button, Card, Table } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { Competition } from "@/lib/types";

export default function CompetitionsPage() {
  const { competitions, loading, error, refetch } = useCompetitions();

  const handleDelete = async (id: string) => {
    if (!confirm("この大会を削除しますか？")) return;

    try {
      const res = await fetch(`/api/competitions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      refetch(); // データを再取得
    } catch {
      alert("削除に失敗しました");
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const columns = [
    { key: "name", header: "大会名" },
    {
      key: "sportType",
      header: "競技",
      render: (item: Competition) => {
        const types: Record<string, string> = {
          football: "フットサル",
          tabletennis: "卓球",
          other: "その他",
        };
        return types[item.sportType];
      },
    },
    { key: "season", header: "シーズン" },
    {
      key: "createdAt",
      header: "作成日",
      render: (item: Competition) => formatDate(item.createdAt),
    },
    {
      key: "actions",
      header: "操作",
      render: (item: Competition) => (
        <div className="flex gap-2">
          <Link href={`/competitions/${item.id}`}>
            <Button variant="secondary">詳細</Button>
          </Link>
          <Link href={`/competitions/${item.id}/edit`}>
            <Button variant="secondary">編集</Button>
          </Link>
          <Button variant="danger" onClick={() => handleDelete(item.id)}>
            削除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">大会一覧</h1>
        <Link href="/competitions/new">
          <Button>新規作成</Button>
        </Link>
      </div>

      <Card>
        <Table
          columns={columns}
          data={competitions}
          emptyMessage="大会がありません"
        />
      </Card>
    </div>
  );
}
