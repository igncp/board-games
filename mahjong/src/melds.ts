// https://en.wikipedia.org/wiki/Mahjong#Concealed_vs._revealed_meld_and_hand

import {
  getIsBonusTile,
  getIsHonorTile,
  getIsSuitTile,
  sortTileByValue,
} from "./tiles";
import { Deck, HandTile, SuitTile, Tile, Player, Round } from "./core";

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
      (!getIsSuitTile(lastTile) ||
        lastTile.suit !== tile.suit ||
        lastTile.value !== tile.value)
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

  if (typeof boardTilePlayerDiff === "number" && boardTilePlayerDiff !== 1)
    return false;

  const subHandSorted = subHand.map((h) => deck[h]).sort(sortTileByValue);

  let lastTileId = subHandSorted[0].id;
  for (let tileIndex = 1; tileIndex < 3; tileIndex += 1) {
    const lastTile = deck[lastTileId] as SuitTile;
    const tile = subHandSorted[tileIndex];

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
export const getIsKong = ({ subHand, deck }: SetCheckOpts) => {
  if (subHand?.length !== 4) return false;

  let lastTileId = subHand[0];
  for (let tileIndex = 1; tileIndex < 4; tileIndex += 1) {
    const tileId = subHand[tileIndex];
    const lastTile = deck[lastTileId];
    const tile = deck[tileId];

    if (!tile) return false;

    if (
      getIsSuitTile(tile) &&
      (!getIsSuitTile(lastTile) ||
        lastTile.suit !== tile.suit ||
        lastTile.value !== tile.value)
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

const getRandomUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getBoardTilePlayerDiff = ({
  hand,
  players,
  round,
  playerId,
}: {
  hand: HandTile[];
  playerId: Player["id"];
  players: Player[];
  round: Round;
}) => {
  const { tileClaimed } = round;
  if (tileClaimed?.by) {
    if (!hand.some((h) => h.id === tileClaimed.id)) return null;

    const playerIndex = players.findIndex((p) => p.id === playerId);
    const otherPlayerIndex = players.findIndex(
      (p) => p.id === tileClaimed.from
    );

    return playerIndex - otherPlayerIndex;
  }
  return null;
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
  if (subHand.some((tile) => tile.setId || !tile.concealed)) {
    return;
  }

  const boardTilePlayerDiff = getBoardTilePlayerDiff({
    hand: subHand,
    playerId,
    players,
    round,
  });

  const opts = {
    boardTilePlayerDiff,
    deck,
    round,
    subHand: subHand.map((tile) => tile.id),
  };

  if (getIsPung(opts) || getIsChow(opts) || getIsKong(opts)) {
    const setId = getRandomUUID();
    const concealed = boardTilePlayerDiff === null;

    subHand.forEach((tile) => {
      tile.setId = setId;
      tile.concealed = concealed;
    });

    return true;
  }
};

export const removeMeld = ({
  hand,
  setId,
}: {
  hand: HandTile[];
  setId: string;
}) => {
  const meldTiles = hand.filter((h) => h.setId === setId);

  if (meldTiles.some((h) => !h.concealed)) {
    return false;
  }

  meldTiles.forEach((h) => {
    h.setId = null;
  });
};

export const getHandMelds = ({ hand }: { hand: HandTile[] }) => {
  const melds: Record<string, undefined | Array<HandTile>> = {};
  let tilesWithoutMeld = 0;

  hand.reduce((acc, handTile) => {
    if (!handTile.setId) {
      tilesWithoutMeld += 1;

      return acc;
    }
    acc[handTile.setId] = acc[handTile.setId] || [];
    acc[handTile.setId]!.push(handTile);
    return acc;
  }, melds);

  return { melds, tilesWithoutMeld };
};

export const getPossibleMelds = ({
  boardTilePlayerDiff,
  deck,
  hand,
  round,
}: {
  boardTilePlayerDiff: number | null;
  deck: Deck;
  hand: HandTile[];
  round: Round;
}) => {
  const handFiltered = hand.filter((h) => !h.setId);
  const melds: Tile["id"][][] = [];

  for (
    let firstTileIndex = 0;
    firstTileIndex < handFiltered.length;
    firstTileIndex++
  ) {
    for (
      let secondTileIndex = firstTileIndex + 1;
      secondTileIndex < handFiltered.length;
      secondTileIndex++
    ) {
      for (
        let thirdTileIndex = secondTileIndex + 1;
        thirdTileIndex < handFiltered.length;
        thirdTileIndex++
      ) {
        const firstTile = handFiltered[firstTileIndex];
        const secondTile = handFiltered[secondTileIndex];
        const thirdTile = handFiltered[thirdTileIndex];

        const subHand = [firstTile, secondTile, thirdTile].map((t) => t.id);

        const opts = {
          boardTilePlayerDiff,
          deck,
          round,
          subHand,
        };

        if (getIsPung(opts) || getIsChow(opts)) {
          melds.push(subHand);
        }

        for (
          let forthTileIndex = thirdTileIndex + 1;
          forthTileIndex < handFiltered.length;
          forthTileIndex++
        ) {
          const forthTile = handFiltered[forthTileIndex];
          const fullSubHand = subHand.concat([forthTile.id]);

          const optsKong = {
            ...opts,
            subHand: fullSubHand,
          };

          if (getIsKong(optsKong)) {
            melds.push(fullSubHand);
          }
        }
      }
    }
  }

  return melds;
};

export const getIsPair = ({ hand }: { hand: Tile[] }) => {
  if (hand.length !== 2) return false;

  if (hand[0].type !== hand[1].type) return false;
  if (hand[0].value !== hand[1].value) return false;
  if ("suit" in hand[0] && "suit" in hand[1] && hand[0].suit !== hand[1].suit)
    return false;

  return true;
};
