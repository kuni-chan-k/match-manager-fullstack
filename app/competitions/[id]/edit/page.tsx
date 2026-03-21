"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Select, Card } from "@/components/ui";

export default function EditCompetitionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [sportType, setSportType] = useState<"football" | "tabletennis" | "other">("football");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCompetition() {
      try {
        const res = await fetch(`/api/competitions/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setName(data.name);
        setSportType(data.sportType);
        setSeason(data.season || "");
      } catch {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
    fetchCompetition();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/competitions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sportType,
          season: season || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      router.push("/competitions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">大会の編集</h1>

      <Card>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="大会名"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="競技"
            name="sportType"
            value={sportType}
            onChange={(e) => setSportType(e.target.value as typeof sportType)}
            options={[
              { value: "football", label: "フットサル" },
              { value: "tabletennis", label: "卓球" },
              { value: "other", label: "その他" },
            ]}
            required
          />

          <Input
            label="シーズン"
            name="season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
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
