enum GamePhase {
  Setup,
  Play,
  Finish
}

enum CardType {
  DrawTwo,
  Number,
  Reverse,
  Skip,
  Wild,
  WildDrawFour
}

enum CardColor {
  Blue,
  Green,
  Red,
  Yellow,
  None
}

interface Card {
  color: CardColor;
  id: number;
  type: CardType;
  value: number | null;
}

interface Player {
  id: number;
  cards: Card["id"][];
}

interface Board {
  discardPile: Card["id"][];
}

interface GameConfig {
  playersNum: number;
}

interface Turn {
  player: Player["id"];
}

interface Game {
  board: Board;
  dealer: Player["id"];
  phase: GamePhase;
  players: Player[];
  turn: Turn;
}

export {
  Board,
  Card,
  CardColor,
  CardType,
  Game,
  GameConfig,
  GamePhase,
  Player
};
