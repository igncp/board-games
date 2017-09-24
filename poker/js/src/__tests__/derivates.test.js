const mockStatic = {
  chipTypeToValue: {},
}

jest.mock("../static", () => mockStatic)

beforeEach(() => {
  mockStatic.chipTypeToValue = {
    foo: 100,
    bar: 200,
  }
})

describe("derivates", () => {
  const {
    calculateMoneyFromChips,
    getNextPlayerToPlayer,
  } = require("../derivates")

  describe("calculateMoneyFromChips", () => {
    it("returns the expected result", () => {
      const result = calculateMoneyFromChips([{
        type: "foo",
      }, {
        type: "foo",
      }, {
        type: "bar",
      }])

      expect(result).toEqual(400)
    })
  })

  describe("getNextPlayerToPlayer", () => {
    it("returns the expected player when not last", () => {
      const playerA = {name: "a"}
      const playerB = {name: "b"}
      const players = [{}, {}, playerA, playerB, {}]

      const result = getNextPlayerToPlayer(playerA, players)

      expect(result).toEqual(playerB)
    })

    it("returns the expected player when last", () => {
      const playerA = {name: "a"}
      const playerB = {name: "b"}
      const players = [playerB, {}, {}, {}, playerA]

      const result = getNextPlayerToPlayer(playerA, players)

      expect(result).toEqual(playerB)
    })
  })
})
