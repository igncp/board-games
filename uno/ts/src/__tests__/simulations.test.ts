import { GamePhase } from "../types";
import { setupGame } from "../simulations";
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
      }, 0) + game.board.discardPile.length;

    expect(totalCards).toEqual(ALL_CARDS.length);
  });

  it("throws when passing the wrong number of players", () => {
    expect(() => setupGame({ playersNum: 2 })).not.toThrow();
    expect(() => setupGame({ playersNum: 10 })).not.toThrow();

    expect(() => setupGame({ playersNum: 11 })).toThrow();
    expect(() => setupGame({ playersNum: 1 })).toThrow();
  });
});
