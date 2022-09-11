import {
  convertToHandTile,
  createGame,
  discardTileToBoard,
  drawTileFromWall,
  getCurrentPlayer,
} from "../src/game";
import { createRound } from "../src/round";

describe("createGame", () => {
  test("Has 4 players", () => {
    const game = createGame();
    expect(game.players.length).toEqual(4);
  });

  test("Has a deck with 144 tiles", () => {
    const game = createGame();
    expect(Object.keys(game.deck).length).toEqual(144);
  });

  test("Each player has 13 tiles initially", () => {
    const game = createGame();

    game.players.forEach((player) => {
      const hand = game.table.hands[player.id];

      expect(hand.length).toEqual(13);
    });
  });

  test("The drawWall has the rest of the tiles initially", () => {
    const game = createGame();

    expect(game.table.drawWall.length).toEqual(144 - 4 * 13);
  });

  test("There are no tiles in the board initially", () => {
    const game = createGame();

    expect(game.table.board.length).toEqual(0);
  });

  test("Each player starts with '0' points", () => {
    const game = createGame();

    game.players.forEach((player) => {
      expect(game.score[player.id]).toEqual(0);
    });
  });
});

describe("drawTileFromWall", () => {
  test("Moves the last tile into the expected hand", () => {
    const drawWall = [3, 4, 5];
    const hands = {
      playerA: [1].map(convertToHandTile),
      playerB: [2].map(convertToHandTile),
    };
    const round = createRound();
    const drawnTile = drawTileFromWall({
      hands,
      round,
      playerId: "playerA",
      drawWall,
    });

    expect(drawWall).toEqual([3, 4]);
    expect(hands).toEqual({
      playerA: [1, 5].map(convertToHandTile),
      playerB: [2].map(convertToHandTile),
    });
    expect(drawnTile).toEqual(5);
    expect(round.wallTileDrawn).toEqual(5);
  });

  test("Returns null when the wall is empty", () => {
    const drawWall = [] as number[];
    const hands = {
      playerA: [1].map(convertToHandTile),
      playerB: [2].map(convertToHandTile),
    };
    const round = createRound();
    const drawnTile = drawTileFromWall({
      drawWall,
      hands,
      playerId: "playerA",
      round,
    });

    expect(drawWall).toEqual([]);
    expect(hands).toEqual({
      playerA: [1].map(convertToHandTile),
      playerB: [2].map(convertToHandTile),
    });
    expect(drawnTile).toEqual(null);
    expect(round.wallTileDrawn).toEqual(null);
  });
});

describe("discardTileToBoard", () => {
  test("Moves the selected tile into the board", () => {
    const board = [16, 17, 18];
    const round = createRound();
    const hands = {
      playerA: Array.from({ length: 14 })
        .map((_, index) => index + 1)
        .map(convertToHandTile),
      playerB: [15].map(convertToHandTile),
    };

    const discardedTile = discardTileToBoard({
      board,
      hands,
      playerId: "playerA",
      round,
      tileId: 2,
    });

    expect(board).toEqual([16, 17, 18, 2]);
    expect(hands).toEqual({
      playerA: Array.from({ length: 14 })
        .map((_, index) => index + 1)
        .filter((id) => id !== 2)
        .map(convertToHandTile),
      playerB: [15].map(convertToHandTile),
    });
    expect(discardedTile).toEqual(2);
    expect(round.tileClaimed).toEqual({ by: null, from: "playerA", id: 2 });
  });
});

describe("getCurrentPlayer", () => {
  test("Returns the expected player object", () => {
    const game = createGame();
    game.round.playerIndex = 2;
    const player = getCurrentPlayer(game);
    expect(player.name).toEqual("Player 3");
  });
});
