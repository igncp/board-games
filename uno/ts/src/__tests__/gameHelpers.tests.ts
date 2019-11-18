import {
  _test as helpersTest,
  createGame,
  getGameCurrentPlayer,
  getNextPlayer,
  getOppositeDirection,
  getPossibleCardsToPlay,
  isCard,
  playTurn
} from "../gameHelpers";
import { getShuffledArray, _test as utilsTest } from "../utils";
import { CardType, CardColor, GameDirection, GamePhase } from "../types";
import { ALL_CARDS, INITIAL_CARDS_NUM } from "../constants";
import { runNTimes } from "../testUtils";

const getRandomItem = utilsTest.getRandomItem!;

const cardReverse = ALL_CARDS.find(isCard({ type: CardType.Reverse }))!;
const cardSkip = ALL_CARDS.find(isCard({ type: CardType.Skip }))!;
const cardDrawTwo = ALL_CARDS.find(isCard({ type: CardType.DrawTwo }))!;
const cardWildNormal = ALL_CARDS.find(isCard({ type: CardType.WildNormal }))!;
const cardWildDrawFour = ALL_CARDS.find(
  isCard({ type: CardType.WildDrawFour })
)!;

describe("createGame", () => {
  it("returns the expected number of players", () => {
    const game = createGame({ playersNum: 3 });

    expect(game.players.length).toEqual(3);
  });

  it("throws when passing the wrong number of players", () =>
    runNTimes(100, () => {
      expect(() => createGame({ playersNum: 2 })).not.toThrow();
      expect(() => createGame({ playersNum: 10 })).not.toThrow();

      expect(() => createGame({ playersNum: 11 })).toThrow();
      expect(() => createGame({ playersNum: 1 })).toThrow();
    }));

  it("can setup a game", () =>
    runNTimes(100, () => {
      const config = {
        playersNum: 3
      };
      const game = createGame(config);

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
    }));
});

describe("getGameCurrentPlayer", () => {
  it("returns the expected value", () => {
    const playersNum = 10;
    const game = createGame({ playersNum });

    expect(getGameCurrentPlayer(game)).toEqual(
      game.players.find(p => p.id === playersNum - 1)
    );

    for (let playerId = 0; playerId < playersNum; playerId += 1) {
      game.turn.player = playerId;

      expect(getGameCurrentPlayer(game)).toEqual(
        game.players.find(p => p.id === playerId)
      );
    }
  });
});

describe("getNextPlayer", () => {
  it("returns the expected value", () => {
    expect(
      getNextPlayer({
        playersIds: [3, 4, 5],
        fromPlayerId: 4
      })
    ).toEqual(3);
    expect(
      getNextPlayer({
        playersIds: [3, 4, 5],
        fromPlayerId: 3,
        direction: GameDirection.Clockwise
      })
    ).toEqual(5);
    expect(
      getNextPlayer({
        playersIds: [3, 4, 5],
        fromPlayerId: 5,
        direction: GameDirection.Clockwise
      })
    ).toEqual(4);
    expect(
      getNextPlayer({
        playersIds: [3, 4, 5],
        fromPlayerId: 5,
        positions: 2,
        direction: GameDirection.Counterclockwise
      })
    ).toEqual(4);
  });
});

describe("getOppositeDirection", () => {
  it("returns the expected values", () => {
    expect(getOppositeDirection(GameDirection.Counterclockwise)).toEqual(
      GameDirection.Clockwise
    );
    expect(getOppositeDirection(GameDirection.Clockwise)).toEqual(
      GameDirection.Counterclockwise
    );
  });
});

describe("getRandomItem", () => {
  it("returns the expected value", () => {
    const items = ["A", "B", "C"];
    const { newItems, index, item } = getRandomItem(items);

    expect(index > -1).toEqual(true);
    expect(index < 3).toEqual(true);
    expect(newItems.length).toEqual(2);
    expect(newItems.includes(item)).toEqual(false);
  });
});

describe("getShuffledArray", () => {
  it("returns the expected value", () => {
    const items = ["A", "B", "C"];
    const newItems = getShuffledArray(items);

    expect(items).toEqual(["A", "B", "C"]);
    expect(newItems.length).toEqual(items.length);
  });
});

describe("getPossibleCardsToPlay", () => {
  it("returns all cards when no card on draw pile", () => {
    return runNTimes(100, () => {
      const deck = getShuffledArray(ALL_CARDS);
      const cardsOnHand = [deck[0], deck[1], deck[2]].map(c => c.id);

      expect(
        getPossibleCardsToPlay({ cardOnDiscardPile: null, cardsOnHand })
      ).toEqual(cardsOnHand);
    });
  });

  it("returns expected cards for numbers", () => {
    const card3Green = ALL_CARDS.find(
      isCard({ type: CardType.Number, color: CardColor.Green, value: 3 })
    );
    const card4Green = ALL_CARDS.find(
      isCard({ type: CardType.Number, color: CardColor.Green, value: 4 })
    );
    const card5Green = ALL_CARDS.find(
      isCard({ type: CardType.Number, color: CardColor.Green, value: 5 })
    );

    expect(
      getPossibleCardsToPlay({
        cardOnDiscardPile: card4Green!.id,
        cardsOnHand: [card3Green!.id, card5Green!.id]
      })
    ).toEqual([card3Green!.id, card5Green!.id]);
  });

  it("returns expected cards for symbols and colors", () => {
    const cardGreenReverse = ALL_CARDS.find(
      isCard({ type: CardType.Reverse, color: CardColor.Green })
    );
    const cardYellowReverse = ALL_CARDS.find(
      isCard({ type: CardType.Reverse, color: CardColor.Yellow })
    );
    const cardGreenSkip = ALL_CARDS.find(
      isCard({ type: CardType.Skip, color: CardColor.Green })
    );
    const cardYellowSkip = ALL_CARDS.find(
      isCard({ type: CardType.Skip, color: CardColor.Yellow })
    );

    expect(
      getPossibleCardsToPlay({
        cardOnDiscardPile: cardGreenReverse!.id,
        cardsOnHand: [
          cardYellowReverse!.id,
          cardGreenSkip!.id,
          cardYellowSkip!.id
        ]
      })
    ).toEqual([cardYellowReverse!.id, cardGreenSkip!.id]);
  });
});

describe("playTurn", () => {
  it("has the expected result on first turn", () =>
    runNTimes(100, async () => {
      const game = createGame({ playersNum: 10 });
      const newGame = await playTurn({
        game,
        onChoosePlayedCard: async ({ possibleCards }) => possibleCards[0]!
      });

      // this is only true because of the number of players
      expect(newGame.turn.player).not.toEqual(game.turn.player);
      expect(newGame.board.discardPile.length).not.toBeGreaterThan(2);
    }));

  it("has the expected result on first turn (if player had no cards)", () =>
    runNTimes(100, async () => {
      const game = createGame({ playersNum: 10 });
      const player = getGameCurrentPlayer(game);

      // if this is not valid in the future, set it up to have a card that can't
      // be used
      player.cards = [];

      const newGame = await playTurn({
        game,
        onChoosePlayedCard: async ({ possibleCards }) => possibleCards[0]!,
        onDeclareNextColor: async () => CardColor.Green
      });

      // this is only true because of the number of players
      expect(newGame.turn.player).not.toEqual(game.turn.player);
      expect(newGame.board.drawPile.length).toBeGreaterThan(
        game.board.drawPile.length - 6
      );
      expect(newGame.board.discardPile.length).not.toBeGreaterThan(2);
    }));
});

describe("helpersTest", () => {
  const applyEffectOfCardIntoGame = helpersTest.applyEffectOfCardIntoGame!;
  const defaultOnDeclareNextColor = helpersTest.defaultOnDeclareNextColor!;
  const endGameRound = helpersTest.endGameRound!;
  const getCardPoints = helpersTest.getCardPoints!;

  describe("applyEffectOfCardIntoGame", () => {
    it("sets the next color on the board on number", async () => {
      const cardGreen2 = ALL_CARDS.find(
        isCard({ type: CardType.Number, color: CardColor.Green, value: 2 })
      );
      const game = createGame({ playersNum: 5 });

      expect(game.board.nextColorFromWildCard).toEqual(null);

      const newGame = await applyEffectOfCardIntoGame({
        game,
        onDeclareNextColor: async () => CardColor.Green,
        playedCard: cardGreen2!.id
      });

      expect(newGame.board.nextColorFromWildCard).toEqual(null);
    });

    it("sets the next color on the board on wild", () =>
      runNTimes(100, async () => {
        const { item: color } = getRandomItem([
          CardColor.Green,
          CardColor.Red,
          CardColor.Yellow,
          CardColor.Blue
        ]);
        const { item: cardType } = getRandomItem([
          CardType.WildNormal,
          CardType.WildDrawFour
        ]);
        const cardWild = ALL_CARDS.find(isCard({ type: cardType }));
        const game = createGame({ playersNum: 5 });

        expect(game.board.nextColorFromWildCard).toEqual(null);

        const newGame = await applyEffectOfCardIntoGame({
          game,
          onDeclareNextColor: async () => color,
          playedCard: cardWild!.id
        });

        expect(game.board.nextColorFromWildCard).toEqual(null);
        expect(newGame.board.nextColorFromWildCard).toEqual(color);
      }));

    it("correctly uses reverse when two players", () =>
      runNTimes(100, async () => {
        const cardReverse = ALL_CARDS.find(isCard({ type: CardType.Reverse }));
        const game = createGame({ playersNum: 2 });
        game.turn.player = 0;

        expect(game.turn.player).toEqual(0);

        const newGame = await applyEffectOfCardIntoGame({
          game,
          playedCard: cardReverse!.id
        });

        expect(newGame.turn.player).toEqual(0);
      }));
  });

  describe("defaultOnDeclareNextColor", () => {
    it("always returns a color", () => {
      return runNTimes(100, async () => {
        const game = createGame({ playersNum: 3 });
        const result = await defaultOnDeclareNextColor(game);

        expect(
          [
            CardColor.Green,
            CardColor.Red,
            CardColor.Yellow,
            CardColor.Blue
          ].includes(result)
        ).toEqual(true);
      });
    });
  });

  describe("endGameRound", () => {
    it("sets the expected values when game does not finish", () => {
      const game = createGame({ playersNum: 3 });
      game.players[0]!.cards = [];
      const newGame = endGameRound(game);

      expect(game.phase).not.toEqual(GamePhase.EndOfRound);
      expect(newGame.phase).toEqual(GamePhase.EndOfRound);
    });

    it("sets the expected values when game finishes", () => {
      const game = createGame({ playersNum: 10 });

      game.players[0]!.cards = [];
      game.players[0]!.points = 499;

      const newGame = endGameRound(game);

      expect(game.phase).not.toEqual(GamePhase.EndOfRound);
      expect(newGame.phase).toEqual(GamePhase.Finish);
    });

    it("throws when no winner player", () => {
      const game = createGame({ playersNum: 10 });

      expect(() => endGameRound(game)).toThrow();
    });
  });

  describe("getCardPoints", () => {
    it("returns the expected values", () => {
      for (let cardVal = 0; cardVal < 10; cardVal += 1) {
        const card = ALL_CARDS.find(
          isCard({ type: CardType.Number, value: cardVal })
        )!;

        expect(getCardPoints(card.id)).toEqual(cardVal);
      }

      expect(getCardPoints(cardReverse.id)).toEqual(20);
      expect(getCardPoints(cardDrawTwo.id)).toEqual(20);
      expect(getCardPoints(cardSkip.id)).toEqual(20);

      expect(getCardPoints(cardWildNormal.id)).toEqual(50);
      expect(getCardPoints(cardWildDrawFour.id)).toEqual(50);
    });
  });
});
