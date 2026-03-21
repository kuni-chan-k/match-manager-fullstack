"use client";

import { useState, useEffect, useCallback } from "react";
import { Competition } from "@/lib/types";

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/competitions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCompetitions(data);
      setError(null);
    } catch (err) {
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  return { competitions, loading, error, refetch: fetchCompetitions };
}
