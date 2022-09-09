import { Game, getCurrentPlayer, startGame } from "../../src/game";
import { GamePhase } from "../../src/round";

export const handleGetPlayer = (game: Game) => {
  const player = getCurrentPlayer(game);
  console.log("The current player is: " + player.name + " (" + player.id + ")");
};

export const handleStartGame = (game: Game) => {
  startGame(game);
  console.log("Game started");
};

type Texts = {
  phase: Record<GamePhase, string>;
};

const texts: Texts = {
  phase: {
    [GamePhase.Beginning]: "Beginning",
    [GamePhase.End]: "Finished",
    [GamePhase.Playing]: "Playing",
  },
};

const getGameShortSummary = (game: Game) => {
  return ["Game Info", "=========", "Phase: " + texts.phase[game.phase]].join(
    "\n"
  );
};

export const handleShowGameSummary = (game: Game) => {
  console.log(getGameShortSummary(game));
};
