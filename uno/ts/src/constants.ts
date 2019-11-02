import { Card, CardType, CardColor } from "./types";

export const INITIAL_CARDS_NUM = 7;

export const ALL_CARDS: Card[] = (() => {
  const cards: Card[] = [];
  let lastCardId = 0;

  type SemiCard = Omit<Card, "id">;
  const addCard = (semiCard: SemiCard): void => {
    cards.push({
      ...semiCard,
      id: lastCardId
    });

    lastCardId += 1;
  };

  const addNCards = (semiCard: SemiCard, n: number): void => {
    for (let i = 0; i < n; i += 1) {
      addCard(semiCard);
    }
  };

  const addTwoCards = (semiCard: SemiCard) => {
    addNCards(semiCard, 2);
  };
  const addFourCards = (semiCard: SemiCard) => {
    addNCards(semiCard, 4);
  };

  addFourCards({
    color: CardColor.None,
    type: CardType.WildNormal,
    value: null
  });

  addFourCards({
    color: CardColor.None,
    type: CardType.WildDrawFour,
    value: null
  });

  [CardColor.Red, CardColor.Blue, CardColor.Green, CardColor.Yellow].forEach(
    color => {
      addCard({
        color,
        type: CardType.Number,
        value: 0
      });

      for (let i = 1; i < 10; i++) {
        addTwoCards({
          color,
          type: CardType.Number,
          value: i
        });
      }

      addTwoCards({
        color,
        type: CardType.Skip,
        value: null
      });
      addTwoCards({
        color,
        type: CardType.DrawTwo,
        value: null
      });
      addTwoCards({
        color,
        type: CardType.Reverse,
        value: null
      });
    }
  );

  return cards;
})();

type CardMap = { [k: string]: Card };

export const CARD_ID_TO_CARD_MAP: CardMap = ALL_CARDS.reduce(
  (acc: CardMap, card) => {
    acc[card.id.toString()] = card;

    return acc;
  },
  {}
);
