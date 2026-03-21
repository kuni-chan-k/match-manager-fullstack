import { Match, Standing, Team } from "./types";

type StandingInput = {
  teams: Team[];
  matches: Match[];
};

export function calculateStandings({ teams, matches }: StandingInput): Standing[] {
  // 終了した試合のみを対象にする
  const finishedMatches = matches.filter((m) => m.status === "finished");

  // 各チームの成績を初期化
  const standingsMap = new Map<string, Standing>();

  teams.forEach((team) => {
    standingsMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      rank: 0,
    });
  });

  // 試合結果を集計
  finishedMatches.forEach((match) => {
    const homeStanding = standingsMap.get(match.homeTeamId);
    const awayStanding = standingsMap.get(match.awayTeamId);

    if (!homeStanding || !awayStanding) return;
    if (match.homeScore === null || match.awayScore === null) return;

    // 試合数を加算
    homeStanding.played += 1;
    awayStanding.played += 1;

    // 得点・失点を加算
    homeStanding.goalsFor += match.homeScore;
    homeStanding.goalsAgainst += match.awayScore;
    awayStanding.goalsFor += match.awayScore;
    awayStanding.goalsAgainst += match.homeScore;

    // 勝敗を判定
    if (match.homeScore > match.awayScore) {
      // ホーム勝利
      homeStanding.won += 1;
      homeStanding.points += 3;
      awayStanding.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      // アウェイ勝利
      awayStanding.won += 1;
      awayStanding.points += 3;
      homeStanding.lost += 1;
    } else {
      // 引分
      homeStanding.drawn += 1;
      homeStanding.points += 1;
      awayStanding.drawn += 1;
      awayStanding.points += 1;
    }
  });

  // 得失点差を計算
  standingsMap.forEach((standing) => {
    standing.goalDiff = standing.goalsFor - standing.goalsAgainst;
  });

  // 順位でソート
  const sortedStandings = Array.from(standingsMap.values()).sort((a, b) => {
    // 1. 勝点で比較（降順）
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // 2. 得失点差で比較（降順）
    if (b.goalDiff !== a.goalDiff) {
      return b.goalDiff - a.goalDiff;
    }
    // 3. 総得点で比較（降順）
    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }
    // 4. チーム名で比較（昇順）
    return a.teamName.localeCompare(b.teamName, "ja");
  });

  // 順位を付与
  sortedStandings.forEach((standing, index) => {
    standing.rank = index + 1;
  });

  return sortedStandings;
}
