import { Player } from "./player";
import { HandTile, Tile, Wind } from "./tiles";

export enum GamePhase {
  Beginning = "beginning",
  End = "end",
  Playing = "playing",
}

// Note that this order is reversed to the compass directions, since it is
// counter-clockwise
export const windsRoundsOrder = [Wind.East, Wind.South, Wind.West, Wind.North];

export type Round = {
  dealerPlayerIndex: number;
  playerIndex: number;
  tileClaimed: {
    by: Player["id"] | null;
    from: Player["id"];
    id: Tile["id"];
  } | null;
  type: Wind;
  wallTileDrawn: null | Tile["id"];
};

// This assumes that the players array is sorted
export const createRound = (): Round => {
  return {
    dealerPlayerIndex: 0,
    playerIndex: 0,
    tileClaimed: null,
    type: Wind.East,
    wallTileDrawn: null,
  };
};

export const continueRound = (round: Round, hands: HandTile[][]) => {
  if (round.wallTileDrawn === null) {
    return false;
  }

  if (hands.some((hand) => hand.length !== 13)) {
    return false;
  }

  round.wallTileDrawn = null;
  round.tileClaimed = null;

  round.playerIndex += 1;
  if (round.playerIndex === 4) {
    round.playerIndex = 0;
  }

  return true;
};

export const moveRoundAfterWin = (subGame: {
  round: Round;
  phase: GamePhase;
}) => {
  const { round } = subGame;

  round.wallTileDrawn = null;
  round.tileClaimed = null;

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
