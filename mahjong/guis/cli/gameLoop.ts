import { Prompt } from "./utils";
import {
  createGame,
  Game,
  GamePhase,
  getCurrentPlayer,
  startGame,
} from "../../src/game";

type Texts = {
  phase: Record<GamePhase, string>;
};

const texts: Texts = {
  phase: {
    [GamePhase.Beginning]: "Beginning",
    [GamePhase.End]: "Finished",
    [GamePhase.Playing]: "During play",
  },
};

const getGameShortSummary = (game: Game) => {
  return ["Game Info", "=========", "Phase: " + texts.phase[game.phase]].join(
    "\n"
  );
};

export const startCLIGame = async () => {
  const prompt = new Prompt();
  const game = createGame();

  while (true) {
    const nextStep = await prompt.prompt(
      "\nWhat to do next? Input 'h' to show options.\n"
    );

    let breakLoop = false;
    let unhandled = false;

    switch (nextStep) {
      case "h": {
        const gameHelp = [
          "s: Stop the game.",
          "h: Print this help.",
          "p: Print game short summary",
          ...(game.phase === GamePhase.Beginning ? ["b: Begin the game"] : []),
          ...(game.phase === GamePhase.Playing
            ? ["player: Get the current player"]
            : []),
        ]
          .map((l) => "- " + l)
          .sort()
          .join("\n");

        console.log(gameHelp);
        break;
      }
      case "s": {
        breakLoop = true;
        break;
      }
      case "p": {
        console.log(getGameShortSummary(game));
        break;
      }
      default: {
        switch (game.phase) {
          case GamePhase.Beginning: {
            switch (nextStep) {
              case "b": {
                startGame(game);
                console.log("Game started");
                break;
              }
              default: {
                unhandled = true;
              }
            }

            break;
          }
          case GamePhase.Playing: {
            switch (nextStep) {
              case "player": {
                const player = getCurrentPlayer(game);
                console.log(
                  "The current player is: " +
                    player.name +
                    " (" +
                    player.id +
                    ")"
                );
                break;
              }
              default: {
                unhandled = true;
              }
            }

            break;
          }
          default: {
            unhandled = true;
          }
        }
      }
    }

    if (breakLoop) break;
    if (unhandled) console.log("Unknown command: " + nextStep);
  }

  prompt.close();
};
