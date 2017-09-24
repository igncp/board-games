import {
  createShuffledArray,
  generateId,
  getArrOfLen,
  getRandomInt,
} from "../utils"

const {_test} = require("../utils")

describe("utils", () => {
  describe("getArrOfLen", () => {
    it("returns the expected results", () => {
      expect(getArrOfLen(2)).toEqual([0, 1])
      expect(getArrOfLen(0)).toEqual([])
      expect(getArrOfLen(5)).toEqual([0, 1, 2, 3, 4])
    })
  })

  describe("getRandomInt", () => {
    it("returns the expected result (1)", () => {
      Math.random = () => 0

      expect(getRandomInt(1, 3)).toEqual(1)
    })

    it("returns the expected result (2)", () => {
      Math.random = () => 0.99

      expect(getRandomInt(1, 3)).toEqual(3)
    })
  })

  describe("generateId", () => {
    afterEach(() => {
      _test.setCurrentId(0)
    })

    it("returns the expected value", () => {
      expect(generateId()).toEqual(1)
      expect(generateId()).toEqual(2)
      expect(generateId()).toEqual(3)
    })
  })

  describe("createShuffledArray", () => {
    it("", () => {
      Math.random = () => 0
      const arr = [0, 1, 2]
      const newArr = createShuffledArray(arr)

      expect(newArr).toEqual([1, 2, 0])
    })
  })
})
