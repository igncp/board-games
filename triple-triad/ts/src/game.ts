import { Game, Player } from "./constants";

type CreateGameOpts = {};

type CreateGame = (o?: CreateGameOpts) => Promise<Game>;

const createGame: CreateGame = () => {
  const players: Player[] = [];

  for (let playerId = 0; playerId < 2; playerId += 1) {
    players.push({
      id: playerId,
      gameCards: [],
      allCardsIds: []
    });
  }

  const game = {
    board: {},
    usedCards: [],
    players
  };

  return Promise.resolve(game);
};

export { createGame };
