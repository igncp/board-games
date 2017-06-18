// @flow

import {
  buildNewGame,
} from "./builders"

import {
  log,
} from "./utils"

import type {
  Game,
} from "./types"

export function main(): number {
  const game: Game = buildNewGame()

  log(game)

  return 0
}
