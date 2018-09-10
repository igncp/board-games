// @flow

import * as utilsMod from "../../Utils"

import {
  createGame,
  placeSettlementForPlayer,
  placeRoadForPlayer,
} from "../Game"
import {advanceInitialSetupPhase} from "../Timeline"

jest.spyOn(utilsMod, "getRandomItem")

describe("Timeline", () => {
  beforeEach(() => {
    (utilsMod.getRandomItem: any).mockImplementation((arr) => arr[0])
  })

  describe("advanceInitialSetupPhase", () => {
    it("works when expected", () => {
      (utilsMod.getRandomItem: any).mockImplementation((arr) => arr[0])

      const game = createGame({
        playersNumber: 2,
      })

      const placeRoadForPlayerAlias = (player, roadPosition) => placeRoadForPlayer({
        game,
        player,
        roadPosition,
      })
      const placeSettlementForPlayerAlias = (player, settlementPosition) => placeSettlementForPlayer({
        game,
        player,
        settlementPosition,
      })

      placeRoadForPlayerAlias(game.players[0], ["05", "10"])
      placeRoadForPlayerAlias(game.players[0], ["06", "11"])

      placeSettlementForPlayerAlias(game.players[0], ["00", "01", "05"])
      placeSettlementForPlayerAlias(game.players[0], ["06", "01", "05"])

      placeRoadForPlayerAlias(game.players[1], ["23", "29"])
      placeRoadForPlayerAlias(game.players[1], ["24", "30"])

      placeSettlementForPlayerAlias(game.players[1], ["23", "29", "28"])
      placeSettlementForPlayerAlias(game.players[1], ["24", "30", "25"])

      advanceInitialSetupPhase({game})

      expect(game.timeline.phase).toEqual("ROUNDS")
    })
  })
})
