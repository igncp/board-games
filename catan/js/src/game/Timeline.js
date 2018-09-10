// @flow

import {getPlayerToPlacedPiecesMap} from "../Board"

import type {T_Game, T_Timeline} from "./GameCore"

type T_createTimeline = () => T_Timeline

export const createTimeline: T_createTimeline = () => {
  return {
    phase: "INITIAL_SETUP",
  }
}

type T_validateGameCanAdvanceInitialSetupPhase = ({|game: T_Game|}) => void

export const validateGameCanAdvanceInitialSetupPhase: T_validateGameCanAdvanceInitialSetupPhase = ({game}) => {
  if (game.timeline.phase !== "INITIAL_SETUP") {
    throw new Error("The game is not in initial setup phase")
  }

  const playerToPlacedPiecesMap = getPlayerToPlacedPiecesMap(game.board)

  game.players.forEach((player) => {
    const {roads = [], settlements = [], cities = []} = playerToPlacedPiecesMap[player.id] || {}

    if (roads.length !== 2) {
      throw new Error(`Invalid number of roads: ${roads.length} for player: ${player.id}`)
    }

    if (settlements.length !== 2) {
      throw new Error(`Invalid number of settlements: ${settlements.length} for player: ${player.id}`)
    }

    if (cities.length !== 0) {
      throw new Error(`Invalid number of cities: ${cities.length} for player: ${player.id}`)
    }
  })
}

type T_advanceInitialSetupPhase = ({|game: T_Game|}) => void

export const advanceInitialSetupPhase: T_advanceInitialSetupPhase = ({game}) => {
  validateGameCanAdvanceInitialSetupPhase({game})

  game.timeline.phase = "ROUNDS"
}
