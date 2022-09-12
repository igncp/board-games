import { Player } from "./player";

// http://mahjongtime.com/Chinese-Official-Mahjong-Scoring.html
export type Score = Record<Player["id"], number>;

export const calculateHandScore = ({
  score,
  winnerPlayer,
}: {
  score: Score;
  winnerPlayer: Player["id"];
}) => {
  score[winnerPlayer] = (score[winnerPlayer] || 0) + 1;
};
