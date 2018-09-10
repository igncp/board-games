// @flow

// 19 earth tiles
// 18 water tiles

// ids are from top left to bottom right in the reading direction, starting by 0:
//
//       00  01  02  03
//     04  05  06  07  08
//   09  10  11  12  13  14
// 15  16  17  18  19  20  21
//   22  23  24  25  26  27
//     28  29  30  31  32
//       33  34  35  36

import {
  getDoesArrayContainDuplicates,
  getRandomItem,
  padWithZeros,
  removeOneItemOfArr,
} from "./Utils"
import {
  POSSIBLE_SIDES_FOR_18_19,
  POSSIBLE_AXIS_FOR_18_19,
  POSSIBLE_EARTH_SIDES_FOR_18_19,
} from "./Grid.data"

type T_TileId = string

const ALL_TILES: T_TileId[] = [...Array(19 + 18).keys()].map((k) => padWithZeros(k, 2))
const WATER_TILES: T_TileId[] = [
  "00", "01", "02", "03", "04", "08", "09", "14", "15",
  "21", "22", "27", "28", "32", "33", "34", "35", "36",
]
const EARTH_TILES: T_TileId[] = ALL_TILES.filter((i) => WATER_TILES.indexOf(i) === -1)

const ROWS_ITEMS_COUNT = {
  "0": 4,
  "1": 5,
  "2": 6,
  "3": 7,
  "4": 6,
  "5": 5,
  "6": 4,
}

const ROWS_ITEMS_COUNT_ACC = Object.keys(ROWS_ITEMS_COUNT).reduce((acc, rowIdx) => {
  acc[rowIdx] = ROWS_ITEMS_COUNT[rowIdx]

  if (rowIdx !== "0") {
    acc[rowIdx] += acc[Number(rowIdx) - 1]
  }

  return acc
}, {})

const TILE_TO_ROW_COL_MAP: { [string]: {| column: number, row: number|} } = ALL_TILES.reduce((acc, tileId) => {
  const tileNum = Number(tileId)
  const tileRowCol = Object.keys(ROWS_ITEMS_COUNT_ACC).reduce((acc2, rowIdx) => {
    if (acc2) {
      return acc2
    }

    if (tileNum < ROWS_ITEMS_COUNT_ACC[rowIdx]) {
      const rowIdxNum = Number(rowIdx)

      return {
        row: rowIdxNum,
        column: rowIdxNum === 0
          ? tileNum
          : tileNum - ROWS_ITEMS_COUNT_ACC[rowIdxNum - 1],
      }
    }

    return acc2
  }, null)

  acc[tileId] = tileRowCol

  return acc
}, {})

const validateTile = (tile) => {
  const isInvalidTile = ALL_TILES.includes(tile) === false

  if (isInvalidTile) {
    throw new Error(`Passed invalid tile ID: ${tile}`)
  }
}

type T_getDoTilesShareSide = (string, string) => boolean

const getDoTilesShareSide: T_getDoTilesShareSide = (tileA, tileB) => {
  if (tileA === tileB) {
    throw new Error("Comparing the same tiles")
  }

  validateTile(tileA)
  validateTile(tileB)

  const tileARowCol = TILE_TO_ROW_COL_MAP[tileA]
  const tileBRowCol = TILE_TO_ROW_COL_MAP[tileB]

  const columnDiff = Math.abs(tileARowCol.column - tileBRowCol.column)
  const rowDiff = Math.abs(tileARowCol.row - tileBRowCol.row)

  if (rowDiff > 1 || columnDiff > 1) {
    return false
  }

  if (rowDiff === 0 && columnDiff === 1) {
    return true
  }

  if (rowDiff === 1 && columnDiff === 0) {
    return true
  }

  const colsOfTileA = ROWS_ITEMS_COUNT[tileARowCol.row]
  const colsOfTileB = ROWS_ITEMS_COUNT[tileBRowCol.row]

  if (colsOfTileA > colsOfTileB) {
    return tileARowCol.column > tileBRowCol.column
  }

  return tileARowCol.column < tileBRowCol.column
}

const TERRAIN_COUNT = {
  hill: 3,
  pasture: 4,
  mountain: 3,
  field: 4,
  forest: 4,
  desert: 1,
  water: 18,
}

type T_TerrainType = $Keys<typeof TERRAIN_COUNT>

const NUMBER_TOKEN_COUNT = {
  "02": 1,
  "03": 2,
  "04": 2,
  "05": 2,
  "06": 2,
  "08": 2,
  "09": 2,
  "10": 2,
  "11": 2,
  "12": 1,
}

type T_NumberToken = $Keys<typeof NUMBER_TOKEN_COUNT>

type T_Chit = T_NumberToken | 'robber'
type T_EdgePlaceable = number
type T_SidePlaceable = number

export type T_Grid = {
  chits: { [string]: T_Chit },
  edges: { [string]: T_EdgePlaceable },
  sides: { [string]: T_SidePlaceable },
  terrains: { [string]: T_TerrainType }
}

type T_createGrid = () => T_Grid

const getTerrainTypes = () => {
  const remainingEarthTiles = Object.keys(TERRAIN_COUNT).reduce((acc, key) => {
    if (key === "water") {
      return acc
    }

    for (let i = 0; i < TERRAIN_COUNT[key]; i++) {
      acc.push(key)
    }

    return acc
  }, [])

  return ALL_TILES.reduce((acc, tileId) => {
    if (WATER_TILES.includes(tileId)) {
      acc[tileId] = "water"
    } else {
      const newTile = getRandomItem(remainingEarthTiles)

      removeOneItemOfArr(newTile, remainingEarthTiles)

      acc[tileId] = newTile
    }

    return acc
  }, {})
}

const getChits = () => {
  const remainingChits = Object.keys(NUMBER_TOKEN_COUNT).reduce((acc, key) => {
    if (key === "water") {
      return acc
    }
    for (let i = 0; i < NUMBER_TOKEN_COUNT[key]; i++) {
      acc.push(key)
    }

    return acc
  }, ["robber"])

  return EARTH_TILES.reduce((acc, tileId) => {
    const newChit = getRandomItem(remainingChits)

    removeOneItemOfArr(newChit, remainingChits)

    acc[tileId] = newChit

    return acc
  }, {})
}

export const createGrid: T_createGrid = () => {
  const terrains = getTerrainTypes()
  const edges = {}
  const sides = {}
  const chits = getChits()

  return {
    chits,
    edges,
    sides,
    terrains,
  }
}

export type T_AxisPosition = [T_TileId, T_TileId, T_TileId]
export type T_SidePosition = [T_TileId, T_TileId]

type T_validateSidePosition = (T_SidePosition) => void

const validateSidePosition: T_validateSidePosition = (sidePosition) => {
  if (sidePosition.length !== 2) {
    throw new Error("Invalid side: invalid length")
  }

  if (getDoesArrayContainDuplicates(sidePosition)) {
    throw new Error("Invalid sidePosition position: item repeated")
  }

  sidePosition.forEach(validateTile)

  const doTilesShareSide = getDoTilesShareSide(sidePosition[0], sidePosition[1])

  if (!doTilesShareSide) {
    throw new Error("Side is not topologically possible")
  }
}

type T_validateAxisPosition = (T_AxisPosition) => void

const validateAxisPosition: T_validateAxisPosition = (axisPosition) => {
  if (axisPosition.length !== 3) {
    throw new Error("Invalid axis position: invalid length")
  }

  if (getDoesArrayContainDuplicates(axisPosition)) {
    throw new Error("Invalid axis position: item repeated")
  }

  axisPosition.forEach(validateTile)

  const validateSide = (tileA, tileB) => {
    const doShareSide = getDoTilesShareSide(tileA, tileB)

    if (!doShareSide) {
      throw new Error("Axis is not topologically possible")
    }
  }

  validateSide(axisPosition[0], axisPosition[1])
  validateSide(axisPosition[0], axisPosition[2])
  validateSide(axisPosition[1], axisPosition[2])
}

type T_getAxisPositionKey = (T_AxisPosition) => string

export const getAxisPositionKey: T_getAxisPositionKey = (axisPosition) => {
  validateAxisPosition(axisPosition)

  const newPosition = axisPosition.slice(0).sort()

  return newPosition.join("_")
}

type T_getSidePositionKey = (T_SidePosition) => string

export const getSidePositionKey: T_getSidePositionKey = (sidePosition) => {
  validateSidePosition(sidePosition)

  const newPosition = sidePosition.slice(0).sort()

  return newPosition.join("_")
}

const getAllPossibleSidesObj = () => {
  if (ALL_TILES.length === 18 + 19) {
    return POSSIBLE_SIDES_FOR_18_19
  }

  // this function can be optimized, but it will not be run as it will use the
  // cached data
  return ALL_TILES.reduce((acc, tile) => {
    const remainingTiles = ALL_TILES.filter((t) => t !== tile)

    remainingTiles.forEach((otherTile) => {
      try {
        const sidePositionKey = getSidePositionKey([tile, otherTile])

        acc[sidePositionKey] = true
      } catch (_) {}
    })

    return acc
  }, {})
}

const getEarthSidesObj = () => {
  if (ALL_TILES.length === 18 + 19) {
    return POSSIBLE_EARTH_SIDES_FOR_18_19
  }

  const allSidesObj = getAllPossibleSidesObj()

  return Object.keys(allSidesObj).reduce((acc, sideKey) => {
    const [tileA, tileB] = sideKey.split("_")

    if (EARTH_TILES.includes(tileA) || EARTH_TILES.includes(tileB)) {
      acc[sideKey] = true
    }

    return acc
  }, {})
}

const getAllPossibleAxisObj = () => {
  if (ALL_TILES.length === 18 + 19) {
    return POSSIBLE_AXIS_FOR_18_19
  }

  // this function can be optimized (a lot), but it will not be run as it will
  // use the cached data
  return ALL_TILES.reduce((acc, tileA) => {
    const remainingTilesB = ALL_TILES.filter((t) => t !== tileA)

    remainingTilesB.forEach((tileB) => {
      const remainingTilesC = ALL_TILES.filter((t) => t !== tileA || t !== tileB)

      remainingTilesC.forEach((tileC) => {
        try {
          const axisPositionKey = getAxisPositionKey([tileA, tileB, tileC])

          acc[axisPositionKey] = true
        } catch (_) {}
      })
    })

    return acc
  }, {})
}

type T_getIsSideInEarth = (string) => boolean

export const getIsSideInEarth: T_getIsSideInEarth = (sidePositionKey) => {
  const earthSidesObj = getEarthSidesObj()

  return Boolean(earthSidesObj[sidePositionKey])
}

if (__TEST__) {
  (module.exports: any)._test = {
    EARTH_TILES,
    NUMBER_TOKEN_COUNT,
    TERRAIN_COUNT,
    TILE_TO_ROW_COL_MAP,
    WATER_TILES,
    getAllPossibleAxisObj,
    getAllPossibleSidesObj,
    getDoTilesShareSide,
    getEarthSidesObj,
    validateAxisPosition,
  }
}
