import { Prompt } from "./utils";
import { createGame } from "../../src/game";
import {
  handleClaimTile,
  handleDiscardTile,
  handleDisplayBoard,
  handleDrawTile,
  handleExportGame,
  handleGetPlayer,
  handleImportGame,
  handleListHand,
  handleMovePlayer,
  handleShowGameSummary,
  handleSortHand,
  handleStartGame,
} from "./handlers";
import { GamePhase } from "../../src/round";

export const startCLIGame = async () => {
  const prompt = new Prompt();
  const game = createGame();

  while (true) {
    const input = (await prompt.prompt(
      "\nWhat to do next? Input 'h' to show options.\n"
    )) as string;
    const [nextStep] = input.split(" ");

    let breakLoop = false;
    let unhandled = false;

    switch (nextStep) {
      case "e": {
        handleExportGame(game);
        break;
      }
      case "i": {
        handleImportGame(game);
        break;
      }
      case "h": {
        const gameHelp = [
          "e: Exports the game state",
          "h: Print this help",
          "i: Imports the game state",
          "p: Print game short summary",
          "s: Stop the game",
          ...(game.phase === GamePhase.Beginning ? ["b: Begin the game"] : []),
          ...(game.phase === GamePhase.Playing
            ? [
                "board: List the tiles in the board",
                "claim <player-index>: Claim the last tile from the board",
                "discard <tile-index>: Discard a tile for the player when having 14",
                "draw: Draw a tile for the player from the tiles wall",
                "hand [player-index]: List the hand of a player (by default current)",
                "hd [player-index]: Pretty-print the hand of a player (by default current)",
                "n: Move to the next player",
                "player: Get the current player",
                "ss [player-index]: Sort hand of player by suit",
              ]
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
              case "board": {
                handleDisplayBoard(game);
                break;
              }
              case "claim": {
                handleClaimTile(input, game);
                break;
              }
              case "discard": {
                handleDiscardTile(input, game);
                break;
              }
              case "draw": {
                handleDrawTile(game);
                break;
              }
              case "hand": {
                handleListHand(input, game, false);
                break;
              }
              case "hd": {
                handleListHand(input, game, true);
                break;
              }
              case "n": {
                handleMovePlayer(game);
                break;
              }
              case "player": {
                handleGetPlayer(game);
                break;
              }
              case "ss": {
                handleSortHand(input, game, "suit");
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
