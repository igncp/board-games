import { Game } from "mahjong/dist/src/core";
import { UIGame } from "../types";

export const getUIGame = (game: Game, playerId: string): UIGame => {
  const isCurrentPlayer = playerId === game.players[game.round.playerIndex].id;

  return {
    board: game.table.board,
    hand: game.table.hands[playerId],
    id: game.id,
    round: {
      ...game.round,
      wallTileDrawn: isCurrentPlayer
        ? game.round.wallTileDrawn
        : !!game.round.wallTileDrawn,
    },
  };
};
