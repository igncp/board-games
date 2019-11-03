import {
  applyEffectOfCardIntoGame,
  createGame,
  getNextPlayer,
  getOppositeDirection,
  getPossibleCardsToPlay,
  isCard
} from "../gameHelpers";
import { getShuffledArray, _test } from "../utils";
import { CardType, CardColor, GameDirection } from "../types";
import { ALL_CARDS } from "../constants";
import { runTestNTimes } from "../testUtils";

const getRandomItem = _test.getRandomItem!;

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

      expect(newGame.board.nextColorFromWildCard).toEqual(color);
    })
  );
});
