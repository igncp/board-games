// @flow

import {getRandomItem} from "./Utils"

const PLAYER_COLORS = Object.freeze({
  RED: true,
  BLUE: true,
  ORANGE: true,
  WHITE: true,
})

const PLAYER_COLORS_ARR = Object.keys(PLAYER_COLORS)

type T_PlayerColor = $Keys<typeof PLAYER_COLORS>

// using string as ID to ease using `Object.keys`
export type T_PlayerId = string

export type T_Player = {|
  color: T_PlayerColor,
  id: T_PlayerId
|}

type T_createPlayer = ({|
  excludedColors: T_PlayerColor[],
  id: T_PlayerId
|}) => T_Player

export const createPlayer: T_createPlayer = ({excludedColors, id}) => {
  const possibleColors = PLAYER_COLORS_ARR.filter((c) => !excludedColors.includes(c))

  if (possibleColors.length < 1) {
    throw new Error("No possible colors")
  }

  const color = getRandomItem(possibleColors)

  return {
    color,
    id,
  }
}
