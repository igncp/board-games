import { RoundType, Round, GamePhase } from "../src/round";

export const moveRoundFixture = [
  [
    {
      dealerPlayerIndex: 2,
      playerIndex: 2,
      tileClaimed: null,
      type: RoundType.West,
      wallTileDrawn: 2,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimed: null,
      type: RoundType.West,
      wallTileDrawn: null,
    },
    GamePhase.Playing,
  ],
  [
    {
      dealerPlayerIndex: 0,
      playerIndex: 3,
      type: RoundType.South,
      tileClaimed: null,
      wallTileDrawn: 2,
    },
    {
      dealerPlayerIndex: 2,
      tileClaimed: null,
      playerIndex: 2,
      type: RoundType.West,
      wallTileDrawn: null,
    },
    GamePhase.Playing,
  ],
  [
    {
      dealerPlayerIndex: 2,
      playerIndex: 1,
      tileClaimed: null,
      type: RoundType.North,
      wallTileDrawn: 1,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimed: null,
      type: RoundType.North,
      wallTileDrawn: null,
    },
    GamePhase.End,
  ],
] as [Round, Round, GamePhase][];

export const continueRoundFixture = [
  [
    {
      dealerPlayerIndex: 2,
      playerIndex: 2,
      tileClaimed: null,
      type: RoundType.West,
      wallTileDrawn: 3,
    },
    {
      dealerPlayerIndex: 2,
      playerIndex: 3,
      tileClaimed: null,
      type: RoundType.West,
      wallTileDrawn: null,
    },
  ],
  [
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimed: null,
      type: RoundType.West,
      wallTileDrawn: 3,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 0,
      tileClaimed: null,
      type: RoundType.West,
      wallTileDrawn: null,
    },
  ],
] as [Round, Round][];
