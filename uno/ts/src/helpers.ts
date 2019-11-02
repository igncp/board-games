import { Player, Card, CardType, Game } from "./types";
import { CARD_ID_TO_CARD_MAP } from "./constants";

export const getLeftPlayer = (
  players: Player["id"][],
  fromPlayerId: Player["id"]
): Player["id"] => {
  const idx = players.indexOf(fromPlayerId);

  return idx === 0 ? players[players.length - 1] : players[idx - 1];
};

export const getRandomItem = <A extends unknown>(
  items: A[]
): { index: number; item: A; newItems: A[] } => {
  const index = Math.floor(Math.random() * items.length);
  const item = items[index];
  const newItems = items.slice(0);

  newItems.splice(index, 1);

  return { index, item, newItems };
};

export const getShuffledArray = <A extends unknown>(items: A[]): A[] => {
  let prevItems = items.slice(0);
  const newItems = [];

  for (let i = 0; i < items.length; i += 1) {
    const { newItems: itemsWithoutRandomItem, item } = getRandomItem(prevItems);

    newItems.push(item);
    prevItems = itemsWithoutRandomItem;
  }

  return newItems;
};

export const isCard = (opts: Partial<Card>) => (card: Card): boolean => {
  return Object.keys(opts).every((key: string) => {
    return card[key as keyof Card] === opts[key as keyof Card];
  });
};

type GetPossibleCardsToPlay = (o: {
  cardOnDiscardPile: Card["id"] | null;
  cardsOnHand: Card["id"][];
}) => Card["id"][];

export const getPossibleCardsToPlay: GetPossibleCardsToPlay = ({
  cardOnDiscardPile,
  cardsOnHand
}) => {
  if (!cardOnDiscardPile) {
    return cardsOnHand;
  }

  const cardOnPileObj = CARD_ID_TO_CARD_MAP[cardOnDiscardPile];
  const cardsOnHandObjs = cardsOnHand.map(c => CARD_ID_TO_CARD_MAP[c]);
  const validCards: Card["id"][] = [];

  const isNumberSameColorGreater = (c: Card) => {
    return (
      c.type === CardType.Number &&
      c.color === cardOnPileObj.color &&
      c.value! >= cardOnPileObj.value!
    );
  };

  const isSameNumberDifferentColor = (c: Card) => {
    return (
      c.type === CardType.Number &&
      c.color !== cardOnPileObj.color &&
      c.value === cardOnPileObj.value!
    );
  };

  const isWildType = (c: Card) => {
    return c.type === CardType.WildNormal || c.type === CardType.WildDrawFour;
  };

  const addCard = (c: Card) => validCards.push(c.id);

  cardsOnHandObjs
    .filter(c => {
      return isWildType(c);
    })
    .forEach(addCard);

  if (cardOnPileObj.type === CardType.Number) {
    cardsOnHandObjs
      .filter(c => {
        return isNumberSameColorGreater(c) || isSameNumberDifferentColor(c);
      })
      .forEach(addCard);
  } else if (!isWildType(cardOnPileObj)) {
    cardsOnHandObjs
      .filter(c => {
        // here it should be a non-wild symbol card
        return c.type === cardOnPileObj.type || c.color === cardOnPileObj.color;
      })
      .forEach(addCard);
  }

  return validCards;
};

export const getGameCurrentPlayer = (game: Game): Player => {
  return game.players.find(p => p.id === game.turn.player)!;
};
