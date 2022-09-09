import { Prompt } from "./utils";
import { createGame, GamePhase } from "../../src/game";
import {
  handleGetPlayer,
  handleShowGameSummary,
  handleStartGame,
} from "./handlers";

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
          "s: Stop the game",
          "h: Print this help",
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
        handleShowGameSummary(game);
        break;
      }
      default: {
        switch (game.phase) {
          case GamePhase.Beginning: {
            switch (nextStep) {
              case "b": {
                handleStartGame(game);
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
                handleGetPlayer(game);
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
