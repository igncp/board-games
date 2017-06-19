// @flow

import type {
  Axis,
  Intersection,
} from "./types"
import {
  adjacentTerrainsIndexForTerrainIndexMap,
} from "./values"
import {
  anyInTupleIsPositiveOrZero,
} from "./utils"

export function getDiceRoll(): number {
  const minimum: number = 1
  const maximum: number = 6

  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
}

function getIntersectionTerrainsOfAxis(axis: Axis): number[] {
  const [terrainIndexA, terrainIndexB]: [number, number] = axis
  const adjacentTerrainsForA: number[] = adjacentTerrainsIndexForTerrainIndexMap.get(terrainIndexA) || []
  const adjacentTerrainsForB: number[] = adjacentTerrainsIndexForTerrainIndexMap.get(terrainIndexB) || []
  const intersectionTerrains: number[] = adjacentTerrainsForA.filter((terrain: number): boolean => {
    return adjacentTerrainsForB.indexOf(terrain) !== -1
  })

  return intersectionTerrains
}

export function getAdjacentAxisForAxis(axis: Axis): Axis[] {
  const [terrainIndexA, terrainIndexB]: [number, number] = axis
  const intersectionTerrains: number[] = getIntersectionTerrainsOfAxis(axis)

  return intersectionTerrains
    .map((terrain: number): Axis[] => [[terrain, terrainIndexA], [terrain, terrainIndexB]])
    .reduce((acc: Axis[], axisGroup: Axis[]): Axis[] => {
      axisGroup.forEach((a: Axis) => {
        acc.push(a)
      })

      return acc
    }, [])
  .filter(anyInTupleIsPositiveOrZero)
}

export function getAdjacentIntersectionsForAxis(axis: Axis): Intersection[] {
  const [terrainIndexA, terrainIndexB]: [number, number] = axis
  const intersectionTerrains: number[] = getIntersectionTerrainsOfAxis(axis)

  return intersectionTerrains
    .map((terrain: number): Intersection => [terrain, terrainIndexA, terrainIndexB])
    .filter(anyInTupleIsPositiveOrZero)
}

export function getAdjacentAxisForIntersection(intersection: Intersection): Axis[] {
  const [terrainIndexA, terrainIndexB, terrainIndexC]: [number, number, number] = intersection

  return [
    [terrainIndexA, terrainIndexB],
    [terrainIndexB, terrainIndexC],
    [terrainIndexC, terrainIndexA],
  ].filter(anyInTupleIsPositiveOrZero)
}
