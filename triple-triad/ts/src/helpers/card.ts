import { RankIndex, Card, Game, SlotPosition, SpecialRule } from "../constants";

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

type GetCardRankOffset = (
  game: Game,
  card: Card,
  position: SlotPosition
) => number;

const getCardRankOffset: GetCardRankOffset = (game, card, position) => {
  if (!game.specialRules.includes(SpecialRule.Elemental)) {
    return 0;
  }

  const { element: slotElement } = game.board.slots[position.row][
    position.column
  ];

  if (!slotElement) {
    return 0;
  }

  return card.element === slotElement ? 1 : -1;
};

export { oppositeRankIndexMap, getCardIdToCardMap, getCardRankOffset };
