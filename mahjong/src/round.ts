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
  handPlayerIndex: number;
  playerIndex: number;
  type: RoundType;
  wallTileDrawn: boolean;
};

// This assumes that the players array is sorted
export const createRound = (): Round => {
  return {
    handPlayerIndex: 0,
    playerIndex: 0,
    type: RoundType.East,
    wallTileDrawn: false,
  };
};

export const continueRound = ({ round }: { round: Round }) => {
  round.playerIndex += 1;
  round.wallTileDrawn = false;

  if (round.playerIndex === 4) {
    round.playerIndex = 0;
  }
};

export const moveRoundAfterWin = (subGame: {
  round: Round;
  phase: GamePhase;
}) => {
  const { round } = subGame;

  const currentWindIndex = windsRoundsOrder.indexOf(round.type);

  round.handIndex += 1;
  round.wallTileDrawn = false;

  if (round.handIndex === 4) {
    if (currentWindIndex === windsRoundsOrder.length - 1) {
      subGame.phase = GamePhase.End;
    } else {
      round.type = windsRoundsOrder[currentWindIndex + 1];
    }

    round.playerIndex = 0;
  }

  round.playerIndex = round.handIndex;
};
