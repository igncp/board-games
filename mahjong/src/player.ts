import { Round } from "./round";

export type Player = {
  id: string;
  name: string;
};

export const getCurrentPlayer = ({
  round,
  players,
}: {
  round: Round;
  players: Player[];
}) => {
  return players[round.playerIndex] as Player;
};
