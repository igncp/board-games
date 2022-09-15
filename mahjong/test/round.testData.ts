import { GamePhase, Round, Wind } from "../src/core";

export const moveRoundFixture = [
  [
    {
      dealerPlayerIndex: 2,
      playerIndex: 2,
      tileClaimed: null,
      type: Wind.West,
      wallTileDrawn: 2,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimed: null,
      type: Wind.West,
      wallTileDrawn: null,
    },
    GamePhase.Playing,
  ],
  [
    {
      dealerPlayerIndex: 0,
      playerIndex: 3,
      type: Wind.South,
      tileClaimed: null,
      wallTileDrawn: 2,
    },
    {
      dealerPlayerIndex: 2,
      tileClaimed: null,
      playerIndex: 2,
      type: Wind.West,
      wallTileDrawn: null,
    },
    GamePhase.Playing,
  ],
  [
    {
      dealerPlayerIndex: 2,
      playerIndex: 1,
      tileClaimed: null,
      type: Wind.North,
      wallTileDrawn: 1,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimed: null,
      type: Wind.North,
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
      type: Wind.West,
      wallTileDrawn: 3,
    },
    {
      dealerPlayerIndex: 2,
      playerIndex: 3,
      tileClaimed: null,
      type: Wind.West,
      wallTileDrawn: null,
    },
  ],
  [
    {
      dealerPlayerIndex: 3,
      playerIndex: 3,
      tileClaimed: null,
      type: Wind.West,
      wallTileDrawn: 3,
    },
    {
      dealerPlayerIndex: 3,
      playerIndex: 0,
      tileClaimed: null,
      type: Wind.West,
      wallTileDrawn: null,
    },
  ],
] as [Round, Round][];
