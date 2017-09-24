// @flow

import {
  createGame,
} from "./builders"
import {
  getRandomInt,
} from "./utils"
import {
  minChipValue,
} from "./static"
import {
  processGame,
} from "./game-loop"

import type {
  Game,
  GameResult,
} from "./static"

const PLAYERS_NUMBER_RANGE = [3, 10]
const MONEY_PER_PLAYER_RANGE = [5000, 10000]
const MAX_ROUNDS_RANGE = [100, 200]

export default () => {
  const playersNum: number = getRandomInt(...PLAYERS_NUMBER_RANGE)
  const moneyPerPlayerRnd: number = getRandomInt(...MONEY_PER_PLAYER_RANGE)
  const maxRounds: number = getRandomInt(...MAX_ROUNDS_RANGE)
  const game: Game = createGame({
    maxRounds,
    moneyPerPlayer: moneyPerPlayerRnd - moneyPerPlayerRnd % minChipValue,
    playersNum,
  })

  const gameResult: GameResult = processGame(game)

  console.log("gameResult.stats", gameResult.stats)
}

// istanbul ignore else
if (__TEST__) {
  module.exports._test = {
    PLAYERS_NUMBER_RANGE,
    MONEY_PER_PLAYER_RANGE,
    MAX_ROUNDS_RANGE,
  }
}
