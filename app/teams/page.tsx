"use client";

import Link from "next/link";
import { useTeams } from "@/lib/hooks/use-teams";
import { Button, Card, Table } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { Team } from "@/lib/types";

export default function TeamsPage() {
  const { teams, loading, error, refetch } = useTeams();

  const handleDelete = async (id: string) => {
    if (!confirm("このチームを削除しますか？")) return;

    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      refetch();
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
    { key: "name", header: "チーム名" },
    { key: "shortName", header: "略称" },
    {
      key: "createdAt",
      header: "登録日",
      render: (item: Team) => formatDate(item.createdAt),
    },
    {
      key: "actions",
      header: "操作",
      render: (item: Team) => (
        <div className="flex gap-2">
          <Link href={`/teams/${item.id}/edit`}>
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
        <h1 className="text-2xl font-bold">チーム一覧</h1>
        <Link href="/teams/new">
          <Button>新規作成</Button>
        </Link>
      </div>

      <Card>
        <Table
          columns={columns}
          data={teams}
          emptyMessage="チームがありません"
        />
      </Card>
    </div>
  );
}
