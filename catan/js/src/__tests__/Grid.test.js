// @flow

const gridModule = require("../Grid")

const {_test} = (gridModule: any)

const {
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
} = _test

describe("Grid", () => {
  describe("constants", () => {
    it("has the expected constants", () => {
      expect(WATER_TILES.length).toEqual(18)
      expect(EARTH_TILES.length).toEqual(19)

      const terrainTypesNum = Object.keys(TERRAIN_COUNT).reduce((acc, key) => {
        return acc + TERRAIN_COUNT[key]
      }, 0)

      expect(terrainTypesNum).toEqual(37)

      const numberTokenNum = Object.keys(NUMBER_TOKEN_COUNT).reduce((acc, key) => {
        return acc + NUMBER_TOKEN_COUNT[key]
      }, 0)

      expect(numberTokenNum).toEqual(18)
      expect(Object.keys(TILE_TO_ROW_COL_MAP).length).toEqual(37)
    })
  })

  describe("getDoTilesShareSide", () => {
    it("returns the expected values", () => {
      expect(getDoTilesShareSide("00", "01")).toEqual(true)
      expect(getDoTilesShareSide("04", "00")).toEqual(true)
      expect(getDoTilesShareSide("17", "23")).toEqual(true)

      expect(getDoTilesShareSide("09", "00")).toEqual(false)
      expect(getDoTilesShareSide("15", "25")).toEqual(false)
    })
  })

  describe("validateAxisPosition", () => {
    it("returns the expected value", () => {
      expect(() => validateAxisPosition(["00", "01", "02"])).toThrow("Axis is not topologically possible")
      expect(() => validateAxisPosition(["00", "01", "01"])).toThrow("Invalid axis position: item repeated")
      expect(() => validateAxisPosition(["00", "01"])).toThrow("Invalid axis position: invalid length")
      expect(() => validateAxisPosition(["00", "01", "04"])).toThrow("Axis is not topologically possible")

      expect(() => validateAxisPosition(["00", "01", "05"])).not.toThrow()
    })
  })

  describe("getAllPossibleSidesObj", () => {
    it("returns the expected value", () => {
      const sides = getAllPossibleSidesObj()

      expect(Object.keys(sides).length).toEqual(90)
    })
  })

  describe("getAllPossibleAxisObj", () => {
    it("returns the expected value", () => {
      const axis = getAllPossibleAxisObj()

      expect(Object.keys(axis).length).toEqual(54)
    })
  })

  describe("getEarthSidesObj", () => {
    it("returns the expected value", () => {
      const sides = getEarthSidesObj()

      expect(Object.keys(sides).length).toEqual(72)
    })
  })
})
