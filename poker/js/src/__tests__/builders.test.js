const mockUtils = {
  createShuffledArray: jest.fn(),
  getArrOfLen: jest.fn(),
}

jest.mock("../utils.js", () => mockUtils)

describe("builders", () => {
  const {
    createGame,
    createRound,
  } = require("../builders")

  describe("createGame", () => {
    it("returns the expected object", () => {
      mockUtils.createShuffledArray.mockImplementation(() => ["shuffledArrayValue"])
      mockUtils.getArrOfLen.mockReturnValue(["arrayOfLenValue"])

      const result = createGame({
        maxRounds: 1,
        playersNum: 1,
        moneyPerPlayer: 50,
      })

      expect(result).toEqual({
        deck: ["shuffledArrayValue"],
        rounds: [],
        maxRounds: 1,
        players: [
          {
            chips: [
              {
                type: "Green",
              },
            ],
            id: "arrayOfLenValue",
          },
        ],
      })
    })
  })

  describe("createRound", () => {
    it("returns the expected object", () => {
      const result = createRound({
        players: [{
          id: "playerIdValue",
        }],
      })

      expect(result).toEqual({
        dealer: {
          id: "playerIdValue",
        },
        playerToBets: {
          playerIdValue: [],
        },
        step: "Blind",
      })
    })
  })
})
