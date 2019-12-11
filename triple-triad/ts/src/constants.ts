type PlayerId = number;

type CardId = number;

type Card = {
  id: CardId;
};

type Player = {
  allCardsIds: Card["id"][];
  gameCards: Card["id"][];
  id: PlayerId;
};

type Board = {};

type Game = {
  board: Board;
  usedCards: Card[];
  players: Player[];
};

export { Game, Player };
