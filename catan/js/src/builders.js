// @flow

import type {
  Board,
  BoardMap,
  Chip,
  City,
  Game,
  GamePhaseType,
  NumberToken,
  Player,
  PlayerColor,
  Road,
  RoadID,
  Round,
  Settlement,
  SettlementID,
  Terrain,
  TerrainType,
} from "./types"

import {
  possibleColors,
  TerrainTypeToNumberMap,
  terrainsNumberToPlace,
  NumberTokenValueToNumberMap,
} from "./values"

import {
  getRandomItem,
  getArrOfLen,
  generateId,
} from "./utils"

function buildNewPlayers(playersNumber: number): Player[] {
  const players: Player[] = []
  let remainingColors: PlayerColor[] = [...possibleColors]

  for (let i:number = 0; i < playersNumber; i++) {
    const color: PlayerColor = getRandomItem(remainingColors)
    const roads: Road[] = getArrOfLen(15).map((): Road => ({
      id: generateId(),
      isPlaced: false,
    }))
    const settlements: Settlement[] = getArrOfLen(5).map((): Settlement => ({
      isPlaced: false,
      id: generateId(),
    }))
    const cities: City[] = getArrOfLen(4).map((): City => ({
      id: generateId(),
      isPlaced: false,
    }))

    players.push({
      cities,
      color,
      id: generateId(),
      roads,
      settlements,
      victoryPoints: [],
    })

    remainingColors = remainingColors.filter((c: PlayerColor): boolean => c !== color)
  }

  return players
}

function buildTerrains(): Terrain[] {
  const placedTerrains: Map<TerrainType, number> = new Map(
    Array.from(TerrainTypeToNumberMap.keys())
      .map((key: TerrainType): [TerrainType, number] => [key, 0])
  )
  const terrains: Terrain[] = []

  for (let terrainNumber: number = 0; terrainNumber < terrainsNumberToPlace; terrainNumber++) {
    const remainingTerrainTypes: TerrainType[] = Array.from(placedTerrains.keys())
      .filter((key: TerrainType): boolean => (placedTerrains.get(key) || 0) < (TerrainTypeToNumberMap.get(key) || 0))
    const terrain: Terrain = {
      id: generateId(),
      type: getRandomItem(remainingTerrainTypes),
    }

    placedTerrains.set(terrain.type, placedTerrains.get(terrain.type) + 1)

    terrains.push(terrain)
  }

  return terrains
}

function buildSortedChips(): Chip[] {
  const sortedChips: Chip[] = Array.from(NumberTokenValueToNumberMap.keys())
    .reduce((acc: Chip[], key: NumberToken): Chip[] => {
      const total: number = NumberTokenValueToNumberMap.get(key) || 0

      for (let i: number = 0; i < total; i++) {
        acc.push(key)
      }

      return acc
    }, []) || []

  if (sortedChips) {
    sortedChips.push("Robber")
  }

  return sortedChips
}

function buildChips(): Chip[] {
  const chips: Chip[] = []
  const sortedChips: Chip[] = buildSortedChips()
  const initialSortedChipsLength: number = sortedChips.length

  for (let i: number = 0; i < initialSortedChipsLength; i++) {
    const chip: Chip = getRandomItem(sortedChips)

    chips.push(chip)
    const index: number = sortedChips.indexOf(chip)

    sortedChips.splice(index, 1)
  }

  return chips
}

export function buildNewGame(): Game {
  const players: Player[] = buildNewPlayers(4)

  const currentRound: Round = {
    currentPlayer: players[0].id,
  }

  const previousRounds: Round[] = []

  const roadsIds: RoadID[] = []

  const settlementsIds: SettlementID[] = []

  const boardMap: BoardMap = {
    terrains: buildTerrains(),
    chips: buildChips(),
    roadsIds,
    settlementsIds,
  }

  const board: Board = {
    boardMap,
  }

  const phase: GamePhaseType = "Setup"

  const game: Game = {
    board,
    currentRound,
    phase,
    players,
    previousRounds,
  }

  return game
}
