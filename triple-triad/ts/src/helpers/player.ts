import { Game, Player } from "../constants";

type GetOppositePlayer = (game: Game, p: Player["id"]) => Player;

const getOppositePlayer: GetOppositePlayer = (game, playerId) => {
  return game.players.find(p => p.id !== playerId)!;
};

export { getOppositePlayer };
