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
  WildNormal,
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
  cards: Card["id"][];
  id: number;
  points: number;
}

interface Board {
  discardPile: Card["id"][];
  drawPile: Card["id"][];
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
