import { getGameCurrentPlayer } from "../gameHelpers";
import { GamePhase } from "../types";
import { simulateSetupGame, simulatePlayTurn } from "../simulations";
import { INITIAL_CARDS_NUM, ALL_CARDS } from "../constants";
import { runTestNTimes } from "../testUtils";

describe("simulateSetupGame", () => {
  it(
    "can setup a game",
    runTestNTimes(100, () => {
      const config = {
        playersNum: 3
      };
      const game = simulateSetupGame(config);

      expect(game.players.length).toEqual(config.playersNum);
      expect(game.phase).toEqual(GamePhase.Play);

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
    })
  );

  it(
    "throws when passing the wrong number of players",
    runTestNTimes(100, () => {
      expect(() => simulateSetupGame({ playersNum: 2 })).not.toThrow();
      expect(() => simulateSetupGame({ playersNum: 10 })).not.toThrow();

      expect(() => simulateSetupGame({ playersNum: 11 })).toThrow();
      expect(() => simulateSetupGame({ playersNum: 1 })).toThrow();
    })
  );
});

describe("simulatePlayTurn", () => {
  it(
    "has the expected result on first turn",
    runTestNTimes(100, () => {
      const game = simulateSetupGame({ playersNum: 10 });
      const newGame = simulatePlayTurn(game);

      // this is only true because of the number of players
      expect(newGame.turn.player).not.toEqual(game.turn.player);
      expect(newGame.board.discardPile.length).not.toBeGreaterThan(2);
    })
  );

  it(
    "has the expected result on first turn (if player had no cards)",
    runTestNTimes(100, () => {
      const game = simulateSetupGame({ playersNum: 10 });
      const player = getGameCurrentPlayer(game);

      // if this is not valid in the future, set it up to have a card that can't
      // be used
      player.cards = [];

      const newGame = simulatePlayTurn(game);

      // this is only true because of the number of players
      expect(newGame.turn.player).not.toEqual(game.turn.player);
      expect(newGame.board.drawPile.length).toBeGreaterThan(
        game.board.drawPile.length - 6
      );
      expect(newGame.board.discardPile.length).not.toBeGreaterThan(2);
    })
  );
});
