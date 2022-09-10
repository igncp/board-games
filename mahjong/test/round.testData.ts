import { RoundType, Round, GamePhase } from "../src/round";

export const moveRoundFixture = [
  [
    {
      dealerPlayerIndex: 2,
      playerIndex: 2,
      tileClaimedBy: null,
      type: RoundType.West,
      wallTileDrawn: true,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimedBy: null,
      type: RoundType.West,
      wallTileDrawn: false,
    },
    GamePhase.Playing,
  ],
  [
    {
      dealerPlayerIndex: 0,
      playerIndex: 3,
      type: RoundType.South,
      tileClaimedBy: null,
      wallTileDrawn: true,
    },
    {
      dealerPlayerIndex: 2,
      tileClaimedBy: null,
      playerIndex: 2,
      type: RoundType.West,
      wallTileDrawn: false,
    },
    GamePhase.Playing,
  ],
  [
    {
      dealerPlayerIndex: 2,
      playerIndex: 1,
      tileClaimedBy: null,
      type: RoundType.North,
      wallTileDrawn: false,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimedBy: null,
      type: RoundType.North,
      wallTileDrawn: false,
    },
    GamePhase.End,
  ],
] as [Round, Round, GamePhase][];

export const continueRoundFixture = [
  [
    {
      dealerPlayerIndex: 2,
      playerIndex: 2,
      tileClaimedBy: null,
      type: RoundType.West,
      wallTileDrawn: true,
    },
    {
      dealerPlayerIndex: 2,
      playerIndex: 3,
      tileClaimedBy: null,
      type: RoundType.West,
      wallTileDrawn: false,
    },
  ],
  [
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimedBy: null,
      type: RoundType.West,
      wallTileDrawn: true,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 0,
      tileClaimedBy: null,
      type: RoundType.West,
      wallTileDrawn: false,
    },
  ],
] as [Round, Round][];
