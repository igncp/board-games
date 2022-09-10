// https://en.wikipedia.org/wiki/Mahjong#Concealed_vs._revealed_meld_and_hand

import {
  Deck,
  HandTile,
  SuitTile,
  Tile,
  getIsBonusTile,
  getIsHonorTile,
  getIsSuitTile,
} from "./tiles";
import { Round } from "./round";
import { Player } from "./player";

type SetCheckOpts = {
  deck: Deck;
  subHand: Tile["id"][];
  boardTilePlayerDiff: number | null;
};

// - Pung: http://mahjong.wikidot.com/pung
export const getIsPung = ({ subHand, deck }: SetCheckOpts) => {
  if (subHand?.length !== 3) return false;

  let lastTileId = subHand[0];
  for (let tileIndex = 1; tileIndex < 3; tileIndex += 1) {
    const tileId = subHand[tileIndex];
    const lastTile = deck[lastTileId];
    const tile = deck[tileId];

    if (!tile) return false;

    if (
      getIsSuitTile(tile) &&
      getIsSuitTile(lastTile) &&
      (lastTile.suit !== tile.suit || lastTile.value !== tile.value)
    ) {
      return false;
    }

    if (
      getIsHonorTile(tile) &&
      (lastTile.value !== tile.value || lastTile.type !== tile.type)
    ) {
      return false;
    }

    if (getIsBonusTile(tile)) {
      return false;
    }

    lastTileId = tile.id;
  }

  return true;
};

// - Chow: http://mahjong.wikidot.com/chow
export const getIsChow = ({
  subHand,
  deck,
  boardTilePlayerDiff,
}: SetCheckOpts) => {
  if (subHand?.length !== 3) return false;

  if (typeof boardTilePlayerDiff === "number" && boardTilePlayerDiff !== -1)
    return false;

  let lastTileId = subHand[0];
  for (let tileIndex = 1; tileIndex < 3; tileIndex += 1) {
    const tileId = subHand[tileIndex];
    const lastTile = deck[lastTileId] as SuitTile;
    const tile = deck[tileId];

    if (
      !tile ||
      !("suit" in tile) ||
      lastTile.suit !== tile.suit ||
      lastTile.value + 1 !== tile.value
    ) {
      return false;
    }

    lastTileId = tile.id;
  }

  return true;
};

// - Kong: http://mahjong.wikidot.com/kong
export const getIsKong = ({ subHand }: SetCheckOpts) => {
  if (subHand?.length !== 4) return false;

  // @TODO
  return false;
};

const getRandomUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createMeld = ({
  deck,
  round,
  subHand,
  players,
  playerId,
}: {
  deck: Deck;
  playerId: string;
  players: Player[];
  round: Round;
  subHand: HandTile[];
}) => {
  if (subHand.some((tile) => tile.setId)) {
    return;
  }

  const boardTilePlayerDiff = (() => {
    if (round.tileClaimedBy) {
      const playerIndex = players.findIndex((p) => p.id === playerId);
      const otherPlayerIndex = players.findIndex(
        (p) => p.id === round.tileClaimedBy
      );

      return playerIndex - otherPlayerIndex;
    }
    return null;
  })();

  const opts = {
    boardTilePlayerDiff,
    deck,
    round,
    subHand: subHand.map((tile) => tile.id),
  };

  if (getIsPung(opts) || getIsChow(opts)) {
    const setId = getRandomUUID();
    const concealed = boardTilePlayerDiff === null;

    subHand.forEach((tile) => {
      tile.setId = setId;
      tile.concealed = concealed;
    });
  }
};

export const removeMeld = ({ subHand }: { subHand: HandTile[] }) => {
  if (subHand.some((h) => !h.concealed)) {
    return false;
  }

  subHand.forEach((h) => {
    h.setId = null;
  });
};

export const getHandMelds = ({ hand }: { hand: HandTile[] }) => {
  const obj: Record<string, true | undefined> = {};
  let tilesWithoutMeld = 0;

  hand.reduce((acc, handTile) => {
    if (!handTile.setId) {
      tilesWithoutMeld += 1;

      return acc;
    }
    acc[handTile.setId] = true;
    return acc;
  }, obj);

  return { melds: Object.keys(hand).length, tilesWithoutMeld };
};
