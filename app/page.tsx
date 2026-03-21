"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [stats, setStats] = useState({
    competitions: 0,
    teams: 0,
    matches: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [compRes, teamRes, matchRes] = await Promise.all([
          fetch("/api/competitions"),
          fetch("/api/teams"),
          fetch("/api/matches"),
        ]);
        const competitions = await compRes.json();
        const teams = await teamRes.json();
        const matches = await matchRes.json();

        setStats({
          competitions: Array.isArray(competitions) ? competitions.length : 0,
          teams: Array.isArray(teams) ? teams.length : 0,
          matches: Array.isArray(matches) ? matches.length : 0,
        });
      } catch {
        // エラー時はデフォルト値のまま
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">大会数</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.competitions}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">チーム数</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.teams}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">試合数</h2>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {stats.matches}
          </p>
        </div>
      </div>
    </div>
  );
}
