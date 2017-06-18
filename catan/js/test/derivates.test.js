// @flow

import {
  getAdjacentAxisForAxis,
  getAdjacentIntersectionsForAxis,
} from "../src/derivates"

import type {
  Axis,
  Intersection,
} from "../src/types"

describe("derivates", () => {
  describe("getAdjacentAxisForAxis", () => {
    function getAxisGroupSortedRepresentation(axisGroup: Axis[]): string[] {
      const arr: string[] = axisGroup.map((a: Axis): string => {
        return Array.from(a).sort().join(",")
      })

      arr.sort()

      return arr
    }

    function expectSorted(axis: Axis, expectedAdjacentAxis: Axis[]) {
      const realAdjacentAxis: Axis[] = getAdjacentAxisForAxis(axis)

      expect(getAxisGroupSortedRepresentation(realAdjacentAxis))
        .toEqual(getAxisGroupSortedRepresentation(expectedAdjacentAxis))
    }

    it("gets expected result (1)", () => {
      expectSorted([0, 4], [[0, 3], [3, 4], [4, 1], [1, 0]])
    })

    it("gets expected result (2)", () => {
      expectSorted([0, 3], [[0, 4], [3, 4], [3, -5], [-5, 0]])
    })

    it("gets expected result (3)", () => {
      expectSorted([2, -4], [[2, -6], [2, -3]])
    })

    it("gets expected result (4)", () => {
      expectSorted([16, 17], [[16, 13], [13, 17], [16, -16], [17, -16]])
    })
  })

  describe("getAdjacentIntersectionsForAxis", () => {
    function getGroupSortedRepresentation(intersectionGroup: Intersection[]): string[] {
      const arr: string[] = intersectionGroup.map((a: Intersection): string => {
        return Array.from(a).sort().join(",")
      })

      arr.sort()

      return arr
    }

    function expectSorted(axis: Axis, expectedAdjacentIntersections: Intersection[]) {
      const realAdjacentIntersections: Intersection[] = getAdjacentIntersectionsForAxis(axis)

      expect(getGroupSortedRepresentation(realAdjacentIntersections))
        .toEqual(getGroupSortedRepresentation(expectedAdjacentIntersections))
    }

    it("gets expected result (1)", () => {
      expectSorted([0, 4], [[0, 3, 4], [0, 1, 4]])
    })

    it("gets expected result (2)", () => {
      expectSorted([6, -6], [[6, -6, 2], [6, -6, -8]])
    })
  })
})
