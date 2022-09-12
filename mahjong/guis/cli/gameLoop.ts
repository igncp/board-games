import { Prompt } from "./utils";
import { createGame } from "../../src/game";
import {
  handleClaimTile,
  handleCreateMeld,
  handleDiscardTile,
  handleDisplayBoard,
  handleDrawTile,
  handleExportGame,
  handleGetPlayer,
  handleImportGame,
  handleListHand,
  handleMovePlayer,
  handleNextCombined,
  handlePossibleMelds,
  handlePossibleMeldsByDiscard,
  handleSayMahjong,
  handleShowGameSummary,
  handleSortHand,
  handleStartGame,
} from "./handlers";
import { GamePhase } from "../../src/round";
import { getHelpStr } from "./help";

export const startCLIGame = async (useExported: string) => {
  const game = createGame();

  const prompt = new Prompt(() => {
    handleExportGame("e /tmp/auto-save.json", game);
    process.exit(0);
  });

  if (useExported) {
    handleImportGame(
      ["e"]
        .concat(typeof useExported === "string" ? [useExported] : [])
        .join(" "),
      game
    );
  }

  while (true) {
    const input = (await prompt.prompt(
      "\n\nWhat to do next? Input 'h' to show options.\n"
    )) as string;
    console.clear();
    const [nextStep] = input.split(" ");

    let breakLoop = false;
    let unhandled = false;

    switch (nextStep) {
      case "e": {
        handleExportGame(input, game);
        break;
      }
      case "i": {
        handleImportGame(input, game);
        break;
      }
      case "h": {
        const gameHelp = getHelpStr(game);
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
              case "bo": {
                handleDisplayBoard(game);
                break;
              }
              case "claim": {
                handleClaimTile(input, game);
                break;
              }
              case "cm": {
                handleCreateMeld(input, game);
                break;
              }
              case "di": {
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
              case "mah": {
                handleSayMahjong(game);
              }
              case "n": {
                handleMovePlayer(game);
                break;
              }
              case "nds": {
                handleNextCombined(game);
                break;
              }
              case "player": {
                handleGetPlayer(game);
                break;
              }
              case "pm": {
                handlePossibleMelds(game);
                break;
              }
              case "pmd": {
                handlePossibleMeldsByDiscard(game);
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
