import { RankIndex, Card } from "../constants";

const oppositeRankIndexMap = {
  [RankIndex.Up]: RankIndex.Down,
  [RankIndex.Down]: RankIndex.Up,
  [RankIndex.Left]: RankIndex.Right,
  [RankIndex.Right]: RankIndex.Left
};

type CardIdToCardMap = { [k: string]: Card };

type GetCardIdToCardMap = (c: Card[]) => CardIdToCardMap;

const getCardIdToCardMap: GetCardIdToCardMap = usedCards => {
  return usedCards.reduce((acc: CardIdToCardMap, card) => {
    acc[card.id] = card;

    return acc;
  }, {});
};

export { oppositeRankIndexMap, getCardIdToCardMap };
