import { RoundType, Round, GamePhase } from "../src/round";

export const roundsFixture = [
  [
    {
      playerIndex: 2,
      type: RoundType.West,
      wallTileDrawn: true,
    },
    {
      playerIndex: 3,
      type: RoundType.West,
      wallTileDrawn: false,
    },
    GamePhase.Playing,
  ],
  [
    {
      playerIndex: 3,
      type: RoundType.West,
      wallTileDrawn: true,
    },
    {
      playerIndex: 0,
      type: RoundType.North,
      wallTileDrawn: false,
    },
    GamePhase.Playing,
  ],
  [
    {
      playerIndex: 3,
      type: RoundType.North,
      wallTileDrawn: false,
    },
    {
      playerIndex: 0,
      type: RoundType.North,
      wallTileDrawn: false,
    },
    GamePhase.End,
  ],
] as [Round, Round, GamePhase][];
