// @flow
import type {
  Chip,
  Player,
} from "./static"

import {
  chipTypeToValue,
} from "./static"

export function calculateMoneyFromChips(chips: Chip[]): number {
  return chips.reduce((acc: number, chip: Chip): number => {
    return acc + chipTypeToValue[chip.type]
  }, 0)
}

export function getNextPlayerToPlayer(player: Player, players: Player[]): Player {
  const idx: number = players.indexOf(player)

  if (idx === players.length - 1) {
    return players[0]
  }

  return players[idx + 1]
}
