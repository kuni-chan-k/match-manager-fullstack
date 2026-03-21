import { Standing } from "@/lib/types";

type StandingsTableProps = {
  standings: Standing[];
};

export default function StandingsTable({ standings }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        チームがありません
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 text-left">順位</th>
            <th className="px-3 py-2 text-left">チーム</th>
            <th className="px-3 py-2 text-center">試合</th>
            <th className="px-3 py-2 text-center">勝</th>
            <th className="px-3 py-2 text-center">分</th>
            <th className="px-3 py-2 text-center">負</th>
            <th className="px-3 py-2 text-center">得点</th>
            <th className="px-3 py-2 text-center">失点</th>
            <th className="px-3 py-2 text-center">得失</th>
            <th className="px-3 py-2 text-center font-bold">勝点</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr
              key={standing.teamId}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-3 py-2 font-bold">{standing.rank}</td>
              <td className="px-3 py-2">{standing.teamName}</td>
              <td className="px-3 py-2 text-center">{standing.played}</td>
              <td className="px-3 py-2 text-center">{standing.won}</td>
              <td className="px-3 py-2 text-center">{standing.drawn}</td>
              <td className="px-3 py-2 text-center">{standing.lost}</td>
              <td className="px-3 py-2 text-center">{standing.goalsFor}</td>
              <td className="px-3 py-2 text-center">{standing.goalsAgainst}</td>
              <td className="px-3 py-2 text-center">
                {standing.goalDiff > 0 && "+"}
                {standing.goalDiff}
              </td>
              <td className="px-3 py-2 text-center font-bold text-blue-600">
                {standing.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
