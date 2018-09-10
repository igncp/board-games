// @flow

import * as utilsMod from "../../Utils"

import {createGame, placeCityForPlayer, placeRoadForPlayer} from "../Game"

jest.spyOn(utilsMod, "getRandomItem")

describe("Game", () => {
  beforeEach(() => {
    (utilsMod.getRandomItem: any).mockImplementation((arr) => arr[0])
  })

  describe("createGame", () => {
    it("returns the expected data", () => {
      (utilsMod.getRandomItem: any).mockImplementation((arr) => arr[0])

      const result = createGame({
        playersNumber: 4,
      })

      expect(result).toMatchSnapshot()
    })
  })

  describe("placeCityForPlayer", () => {
    it("updates the board with expected values", () => {
      const game = createGame({
        playersNumber: 4,
      })

      placeCityForPlayer({
        game,
        cityPosition: ["06", "01", "02"],
        player: game.players[0],
      })

      expect(game.board.positionToCityMap).toMatchSnapshot()
    })
  })

  describe("placeRoadForPlayer", () => {
    it("errors if position is in water", () => {
      const game = createGame({
        playersNumber: 4,
      })

      const fn = () => placeRoadForPlayer({
        game,
        roadPosition: ["00", "01"],
        player: game.players[0],
      })

      expect(fn).toThrow("The road can not be placed in water")
    })
  })
})
