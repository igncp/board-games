import {
  convertToHandTile,
  createGame,
  drawTileFromWall,
  getCurrentPlayer,
} from "../src/game";

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
    const drawnTile = drawTileFromWall({
      hands,
      playerId: "playerA",
      drawWall,
    });

    expect(drawWall).toEqual([3, 4]);
    expect(hands).toEqual({
      playerA: [1, 5].map(convertToHandTile),
      playerB: [2].map(convertToHandTile),
    });
    expect(drawnTile).toEqual(5);
  });

  test("Returns null when the wall is empty", () => {
    const drawWall = [] as number[];
    const hands = {
      playerA: [1].map(convertToHandTile),
      playerB: [2].map(convertToHandTile),
    };
    const drawnTile = drawTileFromWall({
      hands,
      playerId: "playerA",
      drawWall,
    });

    expect(drawWall).toEqual([]);
    expect(hands).toEqual({
      playerA: [1].map(convertToHandTile),
      playerB: [2].map(convertToHandTile),
    });
    expect(drawnTile).toEqual(null);
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
