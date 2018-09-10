// @flow

import {createPlayer} from "../Player"
import type {T_Player} from "../Player"
import {
  createBoard,
  assignCitiesToPlayer,
  assignSettlementsToPlayer,
  assignRoadsToPlayer,
  placeCityForPlayer as placeCityForPlayerInBoard,
  placeSettlementForPlayer as placeSettlementForPlayerInBoard,
  placeRoadForPlayer as placeRoadForPlayerInBoard,
} from "../Board"
import type {T_CityPosition, T_SettlementPosition, T_RoadPosition} from "../Board"

import type {T_Game} from "./GameCore"
import {createTimeline} from "./Timeline"

type T_createGame = ({|
  playersNumber: number
|}) => T_Game

const createPlayers = (playersNumber) => {
  const players = []

  for (let i = 0; i < playersNumber; i++) {
    const newPlayer = createPlayer({
      id: i.toString(),
      excludedColors: players.map((p) => p.color),
    })

    players.push(newPlayer)
  }

  return players
}

const CITIES_PER_PLAYER = 4
const SETTLEMENTS_PER_PLAYER = 5
const ROADS_PER_PLAYER = 15

const assignPiecesToPlayers = (players, board) => {
  players.forEach((player) => {
    const commonOpts = {
      playerReference: player.id,
      board,
    }

    assignCitiesToPlayer({
      ...commonOpts,
      citiesNumber: CITIES_PER_PLAYER,
    })

    assignSettlementsToPlayer({
      ...commonOpts,
      settlementsNumber: SETTLEMENTS_PER_PLAYER,
    })

    assignRoadsToPlayer({
      ...commonOpts,
      roadsNumber: ROADS_PER_PLAYER,
    })
  })
}

export const createGame: T_createGame = ({playersNumber}) => {
  const timeline = createTimeline()
  const players = createPlayers(playersNumber)
  const board = createBoard({
    playersNumber: players.length,
    roadsPerPlayer: ROADS_PER_PLAYER,
    settlementsPerPlayer: SETTLEMENTS_PER_PLAYER,
    citiesPerPlayer: CITIES_PER_PLAYER,
  })

  assignPiecesToPlayers(players, board)

  return {
    board,
    players,
    timeline,
  }
}

type T_placeCityForPlayer = ({|
  cityPosition: T_CityPosition,
  game: T_Game,
  player: T_Player,
|}) => void

export const placeCityForPlayer: T_placeCityForPlayer = ({game, player, cityPosition}) => {
  placeCityForPlayerInBoard({
    board: game.board,
    playerReference: player.id,
    cityPosition,
  })
}

type T_placeSettlementForPlayer = ({|
  game: T_Game,
  player: T_Player,
  settlementPosition: T_SettlementPosition,
|}) => void

export const placeSettlementForPlayer: T_placeSettlementForPlayer = ({game, player, settlementPosition}) => {
  placeSettlementForPlayerInBoard({
    board: game.board,
    playerReference: player.id,
    settlementPosition,
  })
}

type T_placeRoadForPlayer = ({|
  game: T_Game,
  player: T_Player,
  roadPosition: T_RoadPosition,
|}) => void

export const placeRoadForPlayer: T_placeRoadForPlayer = ({game, player, roadPosition}) => {
  placeRoadForPlayerInBoard({
    board: game.board,
    playerReference: player.id,
    roadPosition,
  })
}
