enum GamePhase {
  Play = "play",
  EndOfRound = "endOfRound",
  Finish = "finish"
}

enum GameDirection {
  Clockwise = "clockwise",
  Counterclockwise = "counterclockwise"
}

enum CardType {
  DrawTwo = "drawTwo",
  Number = "number",
  Reverse = "reverse",
  Skip = "skip",
  WildNormal = "wildNormal",
  WildDrawFour = "wildDrawFour"
}

enum CardColor {
  Blue = "blue",
  Green = "green",
  Red = "red",
  Yellow = "yellow",
  None = "none"
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
  nextColorFromWildCard: CardColor | null;
}

interface Turn {
  player: Player["id"];
}

interface Game {
  board: Board;
  dealer: Player["id"];
  direction: GameDirection;
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
  GameDirection,
  GamePhase,
  Player
};
