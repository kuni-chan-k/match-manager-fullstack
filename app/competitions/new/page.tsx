"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, Card } from "@/components/ui";

export default function NewCompetitionPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [sportType, setSportType] = useState<"football" | "tabletennis" | "other">("football");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sportType,
          season: season || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create");
      }

      router.push("/competitions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">大会の新規作成</h1>

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
            placeholder="例: 春季フットサルリーグ 2024"
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
            placeholder="例: 2024春"
          />

          <div className="flex gap-2 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "作成中..." : "作成"}
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
