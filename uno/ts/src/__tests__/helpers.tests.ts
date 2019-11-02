import {
  getLeftPlayer,
  getPossibleCardsToPlay,
  getRandomItem,
  getShuffledArray,
  isCard
} from "../helpers";
import { CardType, CardColor } from "../types";
import { ALL_CARDS } from "../constants";

describe("getLeftPlayer", () => {
  it("returns the expected value", () => {
    expect(getLeftPlayer([3, 4, 5], 4)).toEqual(3);
    expect(getLeftPlayer([3, 4, 5], 3)).toEqual(5);
    expect(getLeftPlayer([3, 4, 5], 5)).toEqual(4);
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
    const card3Green  = ALL_CARDS.find(
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
    ).toEqual([card5Green!.id]);
  });

  it("returns expected cards for symbols and colors", () => {
    const cardGreenReverse  = ALL_CARDS.find(
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
        cardsOnHand: [cardYellowReverse!.id, cardGreenSkip!.id, cardYellowSkip!.id]
      })
    ).toEqual([cardYellowReverse!.id, cardGreenSkip!.id]);
  });
});
