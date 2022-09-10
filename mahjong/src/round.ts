import { Player } from "./player";

export enum GamePhase {
  Beginning = "beginning",
  End = "end",
  Playing = "playing",
}

export enum RoundType {
  East = "east",
  North = "north",
  South = "south",
  West = "west",
}

// Note that this order is reversed to the compass directions, since it is
// counter-clockwise
const windsRoundsOrder = [
  RoundType.East,
  RoundType.South,
  RoundType.West,
  RoundType.North,
];

export type Round = {
  dealerPlayerIndex: number;
  playerIndex: number;
  tileClaimedBy: Player["id"] | null;
  type: RoundType;
  wallTileDrawn: boolean;
};

// This assumes that the players array is sorted
export const createRound = (): Round => {
  return {
    dealerPlayerIndex: 0,
    playerIndex: 0,
    tileClaimedBy: null,
    type: RoundType.East,
    wallTileDrawn: false,
  };
};

export const continueRound = (round: Round) => {
  if (!round.wallTileDrawn) {
    return false;
  }

  round.wallTileDrawn = false;
  round.tileClaimedBy = null;

  round.playerIndex += 1;
  if (round.playerIndex === 4) {
    round.playerIndex = 0;
  }
};

export const moveRoundAfterWin = (subGame: {
  round: Round;
  phase: GamePhase;
}) => {
  const { round } = subGame;

  round.wallTileDrawn = false;
  round.tileClaimedBy = null;

  round.dealerPlayerIndex += 1;
  if (round.dealerPlayerIndex === 4) {
    round.dealerPlayerIndex = 0;
  }

  const currentWindIndex = windsRoundsOrder.indexOf(round.type);

  if (round.dealerPlayerIndex === currentWindIndex) {
    if (currentWindIndex === windsRoundsOrder.length - 1) {
      subGame.phase = GamePhase.End;
    } else {
      round.type = windsRoundsOrder[currentWindIndex + 1];
      round.dealerPlayerIndex = currentWindIndex + 1;
    }
  }

  round.playerIndex = round.dealerPlayerIndex;
};
