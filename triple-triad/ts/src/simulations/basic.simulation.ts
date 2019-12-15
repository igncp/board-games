import { createGame, playTurn, GamePhase } from "..";
import { Game, Board } from "../constants";

import { getBoardStr } from '../helpers/debug'

const RUNS_NUM = 10 * 1000;

type GetBreakCondition = (g: Game) => boolean;

const getBreakCondition: GetBreakCondition = () => {
  return false;
};

type RunStat = () => Promise<{ winnerIdx: number }>;

const runStat: RunStat = async () => {
  let game = await createGame();

  game.usedCards = game.usedCards.slice(0);

  game.usedCards[0] = { ...game.usedCards[0], ranks: [1, 2, 1, 1] };
  game.usedCards[1] = { ...game.usedCards[1], ranks: [1, 2, 2, 2] };

  game.players[0].gameCards.forEach(gameCard => {
    gameCard.cardId = game.usedCards[0].id;
  });

  game.players[1].gameCards.forEach(gameCard => {
    gameCard.cardId = game.usedCards[1].id;
  });

  const boards: string[] = [getBoardStr(game.board)];

  while (game.phase !== GamePhase.End) {
    game = await playTurn(game);
    boards.push(getBoardStr(game.board));
  }

  const winnerIdx = game.players[0].wonCards.length > 0 ? 0 : 1;

  if (getBreakCondition(game)) {
    boards.forEach(b => {
      console.log("");
      console.log(b);
    });

    throw new Error("Condition was truthy");
  }

  return { winnerIdx };
};

type Main = () => Promise<void>;

const main: Main = async () => {
  const results: { [k: string]: number } = {};

  for (let _ = 0; _ < RUNS_NUM; _ += 1) {
    const { winnerIdx } = await runStat();

    results[winnerIdx] = (results[winnerIdx] || 0) + 1;
  }

  console.log("results", results);
};

main().catch((e: Error) => console.log(e));
