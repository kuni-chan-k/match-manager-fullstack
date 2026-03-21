// 大会
export type Competition = {
  id: string;
  name: string;
  sportType: "football" | "tabletennis" | "other";
  season?: string;
  createdAt: string;
  updatedAt: string;
};

// チーム
export type Team = {
  id: string;
  name: string;
  shortName?: string;
  createdAt: string;
  updatedAt: string;
};

// 試合
export type Match = {
  id: string;
  competitionId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "finished";
  startAt: string;
  venue?: string;
  createdAt: string;
  updatedAt: string;
};

// ユーザーロール
export type UserRole = "user" | "organizer" | "admin";

export const PERMISSIONS = {
  // 大会関連
  "competition:create": ["organizer", "admin"],
  "competition:edit": ["organizer", "admin"],
  "competition:delete": ["admin"],

  // 試合関連
  "match:create": ["organizer", "admin"],
  "match:edit": ["organizer", "admin"],
  "match:delete": ["admin"],
} as const;

// 順位表の1行
export type Standing = {
  teamId: string;
  teamName: string;
  played: number;       // 試合数
  won: number;          // 勝利
  drawn: number;        // 引分
  lost: number;         // 敗北
  goalsFor: number;     // 得点
  goalsAgainst: number; // 失点
  goalDiff: number;     // 得失点差
  points: number;       // 勝点
  rank: number;         // 順位
};
