import {
  createGame,
  getNextPlayer,
  getOppositeDirection,
  getPossibleCardsToPlay,
  isCard,
  _test as helpersTest
} from "../gameHelpers";
import { getShuffledArray, _test as utilsTest } from "../utils";
import { CardType, CardColor, GameDirection, GamePhase } from "../types";
import { ALL_CARDS } from "../constants";
import { runTestNTimes } from "../testUtils";

const getRandomItem = utilsTest.getRandomItem!;

const applyEffectOfCardIntoGame = helpersTest.applyEffectOfCardIntoGame!;
const endGameRound = helpersTest.endGameRound!;
const getCardPoints = helpersTest.getCardPoints!;

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
    for (let i = 0; i < 100; i += 1) {
      const deck = getShuffledArray(ALL_CARDS);
      const cardsOnHand = [deck[0], deck[1], deck[2]].map(c => c.id);

      expect(
        getPossibleCardsToPlay({ cardOnDiscardPile: null, cardsOnHand })
      ).toEqual(cardsOnHand);
    }
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

describe("applyEffectOfCardIntoGame", () => {
  it("sets the next color on the board on number", () => {
    const cardGreen2 = ALL_CARDS.find(
      isCard({ type: CardType.Number, color: CardColor.Green, value: 2 })
    );
    const game = createGame({ playersNum: 5 });

    expect(game.board.nextColorFromWildCard).toEqual(null);

    const newGame = applyEffectOfCardIntoGame({
      game,
      onDeclareNextColor: () => CardColor.Green,
      playedCard: cardGreen2!.id
    });

    expect(newGame.board.nextColorFromWildCard).toEqual(null);
  });

  it(
    "sets the next color on the board on wild",
    runTestNTimes(100, () => {
      const { item: color } = getRandomItem([
        CardColor.Green,
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

      const newGame = applyEffectOfCardIntoGame({
        game,
        onDeclareNextColor: () => color,
        playedCard: cardWild!.id
      });

      expect(game.board.nextColorFromWildCard).toEqual(null);
      expect(newGame.board.nextColorFromWildCard).toEqual(color);
    })
  );

  it(
    "correctly uses reverse when two players",
    runTestNTimes(100, () => {
      const cardReverse = ALL_CARDS.find(isCard({ type: CardType.Reverse }));
      const game = createGame({ playersNum: 2 });
      game.turn.player = 0;

      expect(game.turn.player).toEqual(0);

      const newGame = applyEffectOfCardIntoGame({
        game,
        onDeclareNextColor: () => CardColor.Blue,
        playedCard: cardReverse!.id
      });

      expect(newGame.turn.player).toEqual(0);
    })
  );
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
    const card1 = ALL_CARDS.find(isCard({ type: CardType.Number, value: 1 }))!;
    const card3 = ALL_CARDS.find(isCard({ type: CardType.Number, value: 3 }))!;
    const cardReverse = ALL_CARDS.find(isCard({ type: CardType.Reverse }))!;
    const cardSkip = ALL_CARDS.find(isCard({ type: CardType.Skip }))!;
    const cardDrawTwo = ALL_CARDS.find(isCard({ type: CardType.DrawTwo }))!;
    const cardWildNormal = ALL_CARDS.find(
      isCard({ type: CardType.WildNormal })
    )!;
    const cardWildDrawFour = ALL_CARDS.find(
      isCard({ type: CardType.WildDrawFour })
    )!;

    expect(getCardPoints(card1.id)).toEqual(1);
    expect(getCardPoints(card3.id)).toEqual(3);

    expect(getCardPoints(cardReverse.id)).toEqual(20);
    expect(getCardPoints(cardDrawTwo.id)).toEqual(20);
    expect(getCardPoints(cardSkip.id)).toEqual(20);

    expect(getCardPoints(cardWildNormal.id)).toEqual(50);
    expect(getCardPoints(cardWildDrawFour.id)).toEqual(50);
  });
});
