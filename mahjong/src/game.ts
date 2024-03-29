// https://www.mahjongtime.com/hong-kong-mahjong-rules.html
// http://mahjong.wikidot.com/
// https://en.wikipedia.org/wiki/Mahjong_tiles

import {
  Deck,
  Game,
  GamePhase,
  HandTile,
  Player,
  Round,
  Table,
  Tile,
} from "./core";
import {
  getBoardTilePlayerDiff,
  getIsPair,
  getPossibleMelds,
  getTileClaimed,
} from "./melds";
import { createRound, moveRoundAfterWin } from "./round";
import { calculateHandScore } from "./score";
import { getDefaultDeck } from "./tiles";
import { getShuffledArray } from "./util";

const defaultCreatePlayer = (_: unknown, index: number): Player => {
  const id = Math.random().toString();
  return { id, name: "Player " + index };
};

export const convertToHandTile = (id: Tile["id"]) => {
  return {
    concealed: true,
    id,
    setId: null,
  };
};

export const createTable = (deck: Deck, players: Player[]): Game["table"] => {
  const shuffledDeck = getShuffledArray(Object.keys(deck).map(Number));
  const hands = players.reduce((handsAcc, player) => {
    handsAcc[player.id] = shuffledDeck.splice(0, 13).map(convertToHandTile);

    return handsAcc;
  }, {} as Game["table"]["hands"]);

  return {
    drawWall: shuffledDeck,
    board: [],
    hands,
  };
};

export const createGame = (
  opts: Partial<{
    deck: Deck;
    gameId: Game["id"];
    name: Game["id"];
    players: Player[];
  }> = {}
): Game => {
  const players =
    opts.players || Array.from({ length: 4 }).map(defaultCreatePlayer);

  const deck = opts.deck || getDefaultDeck();
  const table = createTable(deck, players);

  const score = players.reduce((scoreAcc, player) => {
    scoreAcc[player.id] = 0;

    return scoreAcc;
  }, {} as Game["score"]);

  const phase = GamePhase.Beginning;

  const round = createRound();

  return {
    deck,
    id: opts.gameId || Math.random().toString(),
    name: opts.name || "",
    phase,
    players,
    round,
    score,
    table,
  };
};

export const drawTileFromWall = ({
  drawWall,
  hands,
  round,
  playerId,
}: {
  drawWall: Table["drawWall"];
  hands: Table["hands"];
  round: Round;
  playerId: Player["id"];
}) => {
  if (!drawWall.length || round.wallTileDrawn !== null) {
    return null;
  }

  const tileId = drawWall.pop() as number;

  round.wallTileDrawn = tileId;
  hands[playerId].push(convertToHandTile(tileId));

  return tileId;
};

export const discardTileToBoard = ({
  board,
  hands,
  playerId,
  tileId,
  round,
}: {
  board: Table["board"];
  hands: Table["hands"];
  playerId: Player["id"];
  tileId: Tile["id"];
  round: Round;
}) => {
  const playerHand = hands[playerId];

  if (playerHand.length !== 14) return null;

  const tileIndex = playerHand.findIndex((t) => t.id === tileId);
  const tile = playerHand[tileIndex];

  if (!tile) return null;
  if (!tile.concealed) return null;

  const { tileClaimed } = round;

  if (
    playerId === round.tileClaimed?.by &&
    tile.id !== tileClaimed!.id &&
    !playerHand.find((t) => t.id === tileClaimed!.id)!.setId
  )
    return null;

  playerHand.splice(tileIndex, 1);

  board.push(tile.id);
  round.tileClaimed = { from: playerId, id: tile.id, by: null };

  return tile.id;
};

export const claimTile = ({
  board,
  hands,
  playerId,
  players,
  round,
}: {
  board: Table["board"];
  hands: Table["hands"];
  playerId: Player["id"];
  players: Game["players"];
  round: Round;
}) => {
  const playerHand = hands[playerId];

  if (playerHand.length !== 13 || !round.tileClaimed) return null;

  const tile = board.pop();

  if (!tile) return null;

  round.tileClaimed.by = playerId;
  round.playerIndex = players.findIndex((p) => p.id === playerId);

  playerHand.push({
    concealed: true,
    id: tile,
    setId: null,
  });

  return true;
};

export const startGame = (game: Game) => {
  game.phase = GamePhase.Playing;
};

const canSayMahjong = (playerHand: HandTile[], deck: Deck) => {
  if (playerHand.length !== 14) return false;

  const tilesWithoutMeld = playerHand
    .filter((t) => !t.setId)
    .map((t) => deck[t.id]);

  return getIsPair({ hand: tilesWithoutMeld });
};

export const sayMahjong = (playerId: Player["id"], game: Game) => {
  if (!canSayMahjong(game.table.hands[playerId], game.deck)) return null;

  const { deck } = game;
  const hand = game.table.hands[playerId];

  const { round, score } = game;

  calculateHandScore({
    deck,
    hand,
    round,
    score,
    winnerPlayer: playerId,
  });

  moveRoundAfterWin(game);

  game.table = createTable(game.deck, game.players);

  return true;
};

export const getPossibleMeldsInGame = (game: Game) => {
  const melds: Array<{
    playerId: Player["id"];
    tiles: Tile["id"][];
    discardTile: Tile["id"] | null;
  }> = [];

  game.players.forEach((player) => {
    const {
      deck,
      round,
      table: { hands },
    } = game;
    const { tileClaimed } = round;
    const playerHands = hands[player.id];
    const canClaimTile =
      tileClaimed &&
      tileClaimed.by === null &&
      tileClaimed.from !== player.id &&
      playerHands.length === 13;

    const hand = playerHands.concat(
      canClaimTile
        ? [
            {
              concealed: true,
              id: tileClaimed.id,
              setId: null,
            },
          ]
        : []
    );

    const boardTilePlayerDiff = getBoardTilePlayerDiff({
      hand,
      playerId: player.id,
      players: game.players,
      round: canClaimTile
        ? ({
            ...round,
            tileClaimed: {
              ...round.tileClaimed,
              by: player.id,
            },
          } as Round)
        : round,
    });

    const possibleMelds = getPossibleMelds({
      boardTilePlayerDiff,
      claimedTile: getTileClaimed(player.id, round.tileClaimed),
      deck,
      hand,
      round,
    });

    if (canSayMahjong(hand, game.deck)) {
      melds.push({
        discardTile: null,
        playerId: player.id,
        tiles: hand.filter((t) => !t.setId).map((t) => t.id),
      });
    }

    if (possibleMelds.length) {
      possibleMelds.forEach((tiles) => {
        melds.push({
          discardTile: null,
          playerId: player.id,
          tiles,
        });
      });
    }
  });

  return melds;
};

export const getPossibleMeldsInGameByDiscard = (game: Game) => {
  const melds = getPossibleMeldsInGame(game);

  const playerIndex = game.players.findIndex(
    (player) => game.table.hands[player.id].length === 14
  );

  if (playerIndex === -1) {
    return melds;
  }

  const playerId = game.players[playerIndex].id;

  const playerHand = game.table.hands[game.players[playerIndex].id].filter(
    (h) => !h.setId
  );

  playerHand.forEach((handTile) => {
    const gameCopy = JSON.parse(JSON.stringify(game));

    discardTileToBoard({
      board: gameCopy.table.board,
      hands: gameCopy.table.hands,
      playerId,
      tileId: handTile.id,
      round: gameCopy.round,
    });

    const newMelds = getPossibleMeldsInGame(gameCopy);

    newMelds
      .filter((m) => m.playerId !== playerId)
      .forEach((meld) => {
        melds.push({
          ...meld,
          discardTile: handTile.id,
        });
      });
  });

  return melds;
};
