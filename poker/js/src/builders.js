// @flow

import {
  getArrOfLen,
  createShuffledArray,
} from "./utils"
import {
  deck,
  minChipValue,
  chipValueToType,
} from "./static"
import {
  getNextPlayerToPlayer,
} from "./derivates"

import type {
  Chip,
  Deck,
  Game,
  GameOpts,
  Player,
  Round,
} from "./static"

export function createPlayers(playersNumber: number): Player[] {
  return getArrOfLen(playersNumber).map((idx: number): Player => ({
    id: idx,
    chips: [],
  }))
}

function getShuffledDeck(): Deck {
  return createShuffledArray(deck)
}

function getChips(moneyAmmount: number): Chip[] {
  const chipsNumber: number = moneyAmmount / minChipValue

  return getArrOfLen(chipsNumber).map((): Chip => ({
    type: chipValueToType[minChipValue],
  }))
}

export function createGame(opts: GameOpts): Game {
  const players: Player[] = createPlayers(opts.playersNum)
  const gameDeck: Deck = getShuffledDeck()

  players.forEach((player: Player) => {
    player.chips = getChips(opts.moneyPerPlayer)
  })

  return {
    deck: gameDeck,
    maxRounds: opts.maxRounds,
    players,
    rounds: [],
  }
}

export function createRound(game: Game): Round {
  const lastRound: ?Round = game.rounds && game.rounds.length > 0
    ? game.rounds[game.rounds.length - 1]
    : null
  const lastDealer: ?Player = lastRound
    ? lastRound.dealer
    : null
  const dealer: Player = lastDealer
    ? getNextPlayerToPlayer(lastDealer, game.players)
    : game.players[0]

  return {
    step: "Blind",
    dealer,
    playerToBets: game.players.reduce((acc, player) => Object.assign(acc, {
      [player.id]: [],
    }), {}),
  }
}
