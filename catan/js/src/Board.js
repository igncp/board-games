// @flow

import {
  createGrid,
  getAxisPositionKey,
  getIsSideInEarth,
  getSidePositionKey,
} from "./Grid"
import type {
  T_Grid,
  T_AxisPosition,
  T_SidePosition,
} from "./Grid"

export type T_Board = {|
  citiesToPlayerMap: { [string]: ?string },
  grid: T_Grid,
  positionToCityMap: { [string]: ?string },
  positionToRoadMap: {[string]: ?string},
  positionToSettlementMap: {[string]: ?string},
  roadToPlayerMap: { [string]: ?string },
  settlementToPlayerMap: { [string]: ?string }
|}

type T_createBoard = ({|
  citiesPerPlayer: number,
  playersNumber: number,
  roadsPerPlayer: number,
  settlementsPerPlayer: number,
|}) => T_Board

export const createBoard: T_createBoard = ({
  playersNumber,
  roadsPerPlayer,
  settlementsPerPlayer,
  citiesPerPlayer,
}) => {
  const grid = createGrid()
  const roadToPlayerMap = {}
  const settlementToPlayerMap = {}
  const citiesToPlayerMap = {}

  const positionToCityMap = {}
  const positionToRoadMap = {}
  const positionToSettlementMap = {}

  for (let i = 0; i < playersNumber; i++) {
    for (let j = 0; j < roadsPerPlayer; j++) {
      roadToPlayerMap[roadsPerPlayer * i + j] = null
    }

    for (let j = 0; j < settlementsPerPlayer; j++) {
      settlementToPlayerMap[settlementsPerPlayer * i + j] = null
    }

    for (let j = 0; j < citiesPerPlayer; j++) {
      citiesToPlayerMap[citiesPerPlayer * i + j] = null
    }
  }

  return {
    citiesToPlayerMap,
    grid,
    positionToCityMap,
    positionToRoadMap,
    positionToSettlementMap,
    roadToPlayerMap,
    settlementToPlayerMap,
  }
}

type T_AssignItemsInMapCommonOpts = {|
  board: T_Board,
  playerReference: string
|}

type T_assignItemToPlayer = ({|
  ...T_AssignItemsInMapCommonOpts,
  itemsNumber: number,
  mapName: 'citiesToPlayerMap' | 'settlementToPlayerMap' | 'roadToPlayerMap',
|}) => void

const assignItemToPlayer: T_assignItemToPlayer = ({
  playerReference,
  itemsNumber,
  board,
  mapName,
}) => {
  const mapKeys = Object.keys(board[mapName])

  for (let i = 0; i < itemsNumber; i++) {
    const unassignedItemId = mapKeys.find((k) => {
      return (typeof board[mapName][k] !== "string")
    })

    if (!unassignedItemId) {
      console.log("board[mapName]", board[mapName])
      throw new Error(`All items are assigned in ${mapName}`)
    }

    board[mapName][unassignedItemId] = playerReference
  }
}

type T_assignCitiesToPlayer = ({|
  ...T_AssignItemsInMapCommonOpts,
  citiesNumber: number,
|}) => void

export const assignCitiesToPlayer: T_assignCitiesToPlayer = ({citiesNumber, ...rest}) => {
  return assignItemToPlayer({
    ...rest,
    itemsNumber: citiesNumber,
    mapName: "citiesToPlayerMap",
  })
}

type T_assignSettlementsToPlayer = ({|
  ...T_AssignItemsInMapCommonOpts,
  settlementsNumber: number,
|}) => void

export const assignSettlementsToPlayer: T_assignSettlementsToPlayer = ({settlementsNumber, ...rest}) => {
  return assignItemToPlayer({
    ...rest,
    itemsNumber: settlementsNumber,
    mapName: "settlementToPlayerMap",
  })
}

type T_assignRoadsToPlayer = ({|
  ...T_AssignItemsInMapCommonOpts,
  roadsNumber: number,
|}) => void

export const assignRoadsToPlayer: T_assignRoadsToPlayer = ({roadsNumber, ...rest}) => {
  return assignItemToPlayer({
    ...rest,
    itemsNumber: roadsNumber,
    mapName: "roadToPlayerMap",
  })
}

type T_validateAxisPositionIsAvailable = ({|
  axisPositionKey: string,
  board: T_Board
|}) => void

const validateAxisPositionIsAvailable: T_validateAxisPositionIsAvailable = ({axisPositionKey, board}) => {
  const {positionToCityMap} = board

  if (positionToCityMap[axisPositionKey]) {
    throw new Error("There is already a city in this position")
  }
}

type T_validateSidePositionIsAvailable = ({|
  board: T_Board,
  sidePositionKey: string
|}) => void

const validateSidePositionIsAvailable: T_validateSidePositionIsAvailable = ({sidePositionKey, board}) => {
  const {positionToRoadMap} = board

  if (positionToRoadMap[sidePositionKey]) {
    throw new Error("There is already a road in this position")
  }
}

export type T_CityPosition = T_AxisPosition
export type T_SettlementPosition = T_AxisPosition
export type T_RoadPosition = T_SidePosition

type T_placeCityForPlayer = ({|
  board: T_Board,
  cityPosition: T_CityPosition,
  playerReference: string,
|}) => void

export const placeCityForPlayer: T_placeCityForPlayer = ({board, cityPosition, playerReference}) => {
  const positionKey = getAxisPositionKey(cityPosition)

  validateAxisPositionIsAvailable({
    board,
    axisPositionKey: positionKey,
  })

  const {positionToCityMap, citiesToPlayerMap} = board
  const placedCities = Object.keys(positionToCityMap)
    .map((key) => positionToCityMap[key])

  const availableCity = Object.keys(citiesToPlayerMap)
    .filter((cityKey) => citiesToPlayerMap[cityKey] === playerReference)
    .find((userCity) => !placedCities.includes(userCity))

  if (!availableCity) {
    throw new Error("There are no available cities for the player")
  }

  positionToCityMap[positionKey] = availableCity
}

type T_placeSettlementForPlayer = ({|
  board: T_Board,
  playerReference: string,
  settlementPosition: T_SettlementPosition,
|}) => void

export const placeSettlementForPlayer: T_placeSettlementForPlayer = ({board, settlementPosition, playerReference}) => {
  const positionKey = getAxisPositionKey(settlementPosition)

  validateAxisPositionIsAvailable({
    board,
    axisPositionKey: positionKey,
  })

  const {settlementToPlayerMap, positionToSettlementMap} = board
  const placedSettlements = Object.keys(positionToSettlementMap)
    .map((key) => settlementToPlayerMap[key])

  const availableSettlement = Object.keys(settlementToPlayerMap)
    .filter((settlementKey) => settlementToPlayerMap[settlementKey] === playerReference)
    .find((userSettlement) => !placedSettlements.includes(userSettlement))

  if (!availableSettlement) {
    throw new Error("There are no available settlements for the user")
  }

  positionToSettlementMap[positionKey] = availableSettlement
}

type T_placeRoadForPlayer = ({|
  board: T_Board,
  playerReference: string,
  roadPosition: T_RoadPosition,
|}) => void

export const placeRoadForPlayer: T_placeRoadForPlayer = ({board, roadPosition, playerReference}) => {
  const positionKey = getSidePositionKey(roadPosition)

  validateSidePositionIsAvailable({
    board,
    sidePositionKey: positionKey,
  })

  if (!getIsSideInEarth(positionKey)) {
    throw new Error("The road can not be placed in water")
  }

  const {roadToPlayerMap, positionToRoadMap} = board
  const placedRoads = Object.keys(positionToRoadMap)
    .map((key) => roadToPlayerMap[key])

  const availableRoad = Object.keys(roadToPlayerMap)
    .filter((roadKey) => roadToPlayerMap[roadKey] === playerReference)
    .find((userRoad) => !placedRoads.includes(userRoad))

  if (!availableRoad) {
    throw new Error("There are no available roads for the user")
  }

  positionToRoadMap[positionKey] = availableRoad
}

type T_getPlayerToPlacedPiecesMap = (T_Board) => ({[string]: {|
  cities: string[],
  roads: string[],
  settlements: string[],
|}})

export const getPlayerToPlacedPiecesMap: T_getPlayerToPlacedPiecesMap = (board) => {
  const obj = {}

  const useMap = ({
    itemName,
    itemToPlayerMap,
    positionMapName,
  }) => {
    Object.keys(board[positionMapName]).forEach((positionKey) => {
      const itemId = board[positionMapName][positionKey]

      if (!itemId) {
        return
      }

      const playerId = board[itemToPlayerMap][itemId]

      if (!playerId) {
        return
      }

      obj[playerId] = obj[playerId] || {}
      obj[playerId][itemName] = obj[playerId][itemName] || []
      obj[playerId][itemName].push(itemId)
    })
  }

  useMap({
    positionMapName: "positionToRoadMap",
    itemToPlayerMap: "roadToPlayerMap",
    itemName: "roads",
  })

  useMap({
    positionMapName: "positionToCityMap",
    itemToPlayerMap: "citiesToPlayerMap",
    itemName: "cities",
  })

  useMap({
    positionMapName: "positionToSettlementMap",
    itemToPlayerMap: "settlementToPlayerMap",
    itemName: "settlements",
  })

  return obj
}
