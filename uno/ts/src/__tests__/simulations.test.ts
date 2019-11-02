import { getGameCurrentPlayer } from "../helpers";
import { GamePhase } from "../types";
import { setupGame, playTurn } from "../simulations";
import { INITIAL_CARDS_NUM, ALL_CARDS } from "../constants";

describe("setupGame", () => {
  it("can setup a game", () => {
    const config = {
      playersNum: 3
    };
    const game = setupGame(config);

    expect(game.players.length).toEqual(config.playersNum);
    expect(game.phase).toEqual(GamePhase.Setup);

    game.players.forEach(player => {
      expect(player.cards.length).toEqual(INITIAL_CARDS_NUM);
    });

    const totalCards =
      game.players.reduce((acc, p) => {
        return acc + p.cards.length;
      }, 0) +
      game.board.drawPile.length +
      game.board.discardPile.length;

    expect(totalCards).toEqual(ALL_CARDS.length);
  });

  it("throws when passing the wrong number of players", () => {
    expect(() => setupGame({ playersNum: 2 })).not.toThrow();
    expect(() => setupGame({ playersNum: 10 })).not.toThrow();

    expect(() => setupGame({ playersNum: 11 })).toThrow();
    expect(() => setupGame({ playersNum: 1 })).toThrow();
  });
});

describe("playTurn", () => {
  it("has the expected result on first turn", () => {
    const game = setupGame({ playersNum: 5 });
    const newGame = playTurn(game)

    // this is only true because of the number of players
    expect(newGame.turn.player).not.toEqual(game.turn.player);
    expect(newGame.board.drawPile.length).toEqual(game.board.drawPile.length);
    expect(newGame.board.discardPile.length).toEqual(1);
  });

  it("has the expected result on first turn (if player had no cards)", () => {
    const game = setupGame({ playersNum: 5 });
    const player = getGameCurrentPlayer(game);

    // if this is not valid in the future, set it up to have a card that can't
    // be used
    player.cards = [];

    const newGame = playTurn(game)

    // this is only true because of the number of players
    expect(newGame.turn.player).not.toEqual(game.turn.player);
    expect(newGame.board.drawPile.length).toEqual(game.board.drawPile.length - 1);
    expect(newGame.board.discardPile.length).toEqual(1);
  });
});
