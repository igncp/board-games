const mockUtils = {
  getRandomInt: jest.fn(),
}
const mockBuilders = {
  createGame: jest.fn(),
}
const mockGameLoop = {
  processGame: jest.fn(),
}

jest.mock("../game-loop", () => mockGameLoop)
jest.mock("../utils", () => mockUtils)
jest.mock("../builders", () => mockBuilders)

beforeEach(() => {
  mockGameLoop.processGame.mockImplementation(() => ({}))

  global.console = {
    log: () => null,
  }
})

describe("main", () => {
  const mainM = require("../main")
  const main = mainM.default

  it("calls getRandomInt", () => {
    main()

    expect(mockUtils.getRandomInt.mock.calls).toEqual([
      mainM._test.PLAYERS_NUMBER_RANGE,
      mainM._test.MONEY_PER_PLAYER_RANGE,
      mainM._test.MAX_ROUNDS_RANGE,
    ])
  })

  it("calls createGame", () => {
    mockUtils.getRandomInt.mockReturnValueOnce("playersNumValue")
    mockUtils.getRandomInt.mockReturnValueOnce(100)
    mockUtils.getRandomInt.mockReturnValueOnce("maxRoundsValue")

    main()

    expect(mockBuilders.createGame.mock.calls).toEqual([[{
      maxRounds: "maxRoundsValue",
      moneyPerPlayer: 100,
      playersNum: "playersNumValue",
    }]])
  })

  it("calls processGame", () => {
    mockBuilders.createGame.mockReturnValue("gameValue")

    main()

    expect(mockGameLoop.processGame.mock.calls).toEqual([["gameValue"]])
  })
})
