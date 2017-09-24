// @flow

import type {
  Chip,
  Game,
  GameResult,
  Player,
  Round,
} from "./static"

import {
  minChipValue,
  chipTypeToValue,
} from "./static"
import {
  createRound,
} from "./builders"
import {
  calculateMoneyFromChips,
  getNextPlayerToPlayer,
} from "./derivates"

function getGameWinner(game: Game): ?Player {
  return game.players[0]
}

// at the moment, all of the chips are of the smallest amount
function extractChipsFromPlayer(moneyAmount: number, player: Player): Chip[] | false {
  const playerChips: Chip[] = player.chips
  const requiredChips: Chip[] = []
  let requiredChipsMoneyAmount: number = 0

  for (let i:number = playerChips.length - 1; i >= 0; i--) {
    if (requiredChipsMoneyAmount === moneyAmount) {
      break
    }

    const chip: Chip = playerChips[i]

    requiredChips.push(chip)
    playerChips.splice(i, 1)
    requiredChipsMoneyAmount += chipTypeToValue[chip.type]
  }

  if (requiredChipsMoneyAmount < moneyAmount) {
    return false
  }

  return requiredChips
}

function addBetOfChips(round: Round, moneyAmount: number, player: Player) {
  const chips: Chip[] | false = extractChipsFromPlayer(moneyAmount, player)

  if (chips) {
    round.playerToBets[player.id] = (round.playerToBets[player.id] || []).concat(chips)
  }
}

function processRound(round: Round, game: Game) {
  const {dealer}: {dealer: Player} = round
  const smallBlind: Player = getNextPlayerToPlayer(dealer, game.players)
  const bigBlind: Player = getNextPlayerToPlayer(smallBlind, game.players)

  addBetOfChips(round, minChipValue, smallBlind)
  addBetOfChips(round, minChipValue * 2, bigBlind)

  console.log(round)
}

export function processGame(game: Game): GameResult {
  let winner: ?Player

  while (!winner) {
    const round: Round = createRound(game)

    processRound(round, game)

    winner = getGameWinner(game)
  }

  return {
    game,
    stats: {
      winner,
      winnerMoney: calculateMoneyFromChips(winner.chips),
    },
  }
}

// istanbul ignore else
if (__TEST__) {
  module.exports._test = {}
}
