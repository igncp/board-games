// @flow

import type {
  NumberToken,
  PlayerColor,
  ResourceType,
  TerrainType,
} from "./types"

export const possibleColors: Set<PlayerColor> = new Set(["Red", "Blue", "White", "Orange"])
export const TerrainTypeToNumberMap: Map<TerrainType, number> = new Map([
  ["Desert", 1],
  ["Fields", 4],
  ["Forest", 4],
  ["Hills", 3],
  ["Mountains", 3],
  ["Pasture", 4],
])
export const NumberTokenValueToNumberMap: Map<NumberToken, number> = new Map([
  [10, 2],
  [11, 2],
  [12, 1],
  [2, 1],
  [3, 2],
  [4, 2],
  [5, 2],
  [6, 2],
  [8, 2],
  [9, 2],
])

export const TerrainTypeToResourceTypeMap: {[TerrainType]: ResourceType} = {
  Hills: "Brick",
  Pasture: "Wool",
  Mountains: "Ore",
  Fields: "Grain",
  Forest: "Lumber",
  Desert: "Nothing",
}

export const terrainsNumberToPlace: number = Array.from(TerrainTypeToNumberMap.values())
  .reduce((acc: number, value: number):number => acc + value, 0) // 19

// This variable represents the topology of the terrains boards. The negative index represents a sea
// terrain, (from top left, first to right and then down). This allows to define intersections and
// axis just using a terrain index array. For example:
//     a intersection can be defined deterministically as: [0, 1, -2] (order not important)
//     a axis can be defined deterministically as: [0, 1] (order not important)
// This variable allow to easily know adjacent intersections and axis relative to others.
// Look at the tests for more information.
export const adjacentTerrainsIndexForTerrainIndexMap: Map<number, number[]> = new Map([
  [0, [1, 3, 4, -1, -2, -5]],
  [1, [0, 4, 2, 5, -2, -3]],
  [2, [1, 5, 6, -3, -4, -6]],
  [3, [7, 8, 4, 0, -5, -7]],
  [4, [0, 1, 3, 5, 8, 9]],
  [5, [1, 2, 4, 6, 9, 10]],
  [6, [2, 5, 10, 11, -8, -6]],
  [7, [3, 8, 12, -7, -9, -11]],
  [8, [3, 4, 7, 9, 12, 13]],
  [9, [4, 5, 8, 10, 13, 14]],
  [10, [5, 6, 9, 11, 14, 15]],
  [11, [6, 10, 15, -8, -10, -12]],
  [12, [7, 8, 13, 16, -11, -13]],
  [13, [8, 9, 12, 14, 16, 17]],
  [14, [9, 10, 13, 15, 17, 18]],
  [15, [10, 11, 14, 18, -12, -14]],
  [16, [12, 13, 17, -13, -15, -16]],
  [17, [16, 13, 14, 18, -16, -17]],
  [18, [17, 14, 15, -17, -18, -14]],
  [-1, [0, -2]],
  [-2, [0, 1, -1, -3]],
  [-3, [2, 1, -2, -4]],
  [-4, [2, -3, -6]],
  [-5, [-1, -7, 0, 3]],
  [-6, [-4, -8, 2, 6]],
  [-7, [-9, -5, 7, 3]],
  [-8, [6, 11, -6, -10]],
  [-9, [-7, -11, 7]],
  [-10, [11, -8, -12]],
  [-11, [7, 12, -9, -13]],
  [-12, [-10, -14, 11, 15]],
  [-13, [-11, -15, 12, 16]],
  [-14, [-12, -18, 18, 15]],
  [-15, [-13, -16, 16]],
  [-16, [16, 17, -15, -17]],
  [-17, [17, 18, -16, -18]],
  [-18, [18, -17, -14]],
])

