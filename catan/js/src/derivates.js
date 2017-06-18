// @flow

import type {
  Axis,
  Intersection,
} from "./types"
import {
  adjacentTerrainsIndexForTerrainIndexMap,
} from "./values"

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
  .filter((a: Axis): boolean => a[0] > -1 || a[1] > -1)
}

export function getAdjacentIntersectionsForAxis(axis: Axis): Intersection[] {
  const [terrainIndexA, terrainIndexB]: [number, number] = axis
  const intersectionTerrains: number[] = getIntersectionTerrainsOfAxis(axis)

  return intersectionTerrains
    .map((terrain: number): Intersection => [terrain, terrainIndexA, terrainIndexB])
    .filter((i: Intersection): boolean => i[0] > -1 || i[1] > -1 || i[2] > -1)
}
