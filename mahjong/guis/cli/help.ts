import { Game, GamePhase } from "../../src/core";

export const getHelpStr = (game: Game) =>
  [
    "e: Exports the game state",
    "h: Print this help",
    "i: Imports the game state",
    "p: Print game short summary",
    "s: Stop the game",
    ...(game.phase === GamePhase.Beginning ? ["b: Begin the game"] : []),
    ...(game.phase === GamePhase.Playing
      ? [
          "bo: List the last tile in the board",
          "claim <player-index>: Claim the last tile from the board",
          "cm <player-index> <tile-1> <tile-2> <tile-3> [tile-4]: Create a meld for tiles",
          "di <player-index> <tile-index>: Discard a tile for the player when having 14",
          "draw: Draw a tile for the player from the tiles wall",
          "hand [player-index]: List the hand of a player (by default current)",
          "hd [player-index]: Pretty-print the hand of a player (by default all)",
          "mah: Say Mahjong for the player with 14 tiles",
          "n: Move to the next player",
          "nds: Combines 'n', 'draw', 'ss' for the next player and 'hd'",
          "player: Get the current player",
          "pm: Get possible melds for each player included the discarded tile",
          "pmd: Get possible melds for each player including the not-yet discarded tile",
          "ss [player-index]: Sort hand of player by suit",
        ]
      : []),
  ]
    .map((l) => "- " + l)
    .sort()
    .join("\n");
