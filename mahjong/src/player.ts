import { Player, Round } from "./core";

export const getCurrentPlayer = ({
  round,
  players,
}: {
  round: Round;
  players: Player[];
}) => {
  return players[round.playerIndex] as Player;
};
