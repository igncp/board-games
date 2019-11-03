import { CardColor, Game } from "./types";
import { ALL_CARDS } from "./constants";
import { createGame, playTurn } from "./gameHelpers";
import { getShuffledArray } from "./utils";

type GameConfig = { playersNum: number };

const simulateSetupGame = (config: GameConfig): Game => {
  const deck = getShuffledArray(ALL_CARDS);

  return createGame({ ...config, originalDeck: deck });
};

const simulatePlayTurn = (game: Game): Game => {
  return playTurn({
    game,
    onChoosePlayedCard: ({ possibleCards }) => possibleCards[0]!,
    onDeclareNextColor: () => CardColor.Green
  });
};

export { simulateSetupGame, simulatePlayTurn };
