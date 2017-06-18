// @flow

export class Bank {}
export class BuildingCostCard {}
export class Harbour {}
export class Piece {}
export class Resource {}
export class ResourceCard {}
export class Robber {}
export class Turn {}

export type VictoryPoint = number
export type TerrainID = number
export type RoadID = number
export type SettlementID = number
export type CityID = number

export type GamePhaseType = 'BoardLayout' | 'Setup' | 'Play'
export type PlayPhaseType = 'Roll' | 'Trade' | 'Build'
export type DevelopmentCardType = 'Knight' | 'Progress' | 'VictoryPoint'
export type PieceType = 'House' | 'Church'
export type ResourceType = 'Lumber' | 'Brick' | 'Ore' | 'Grain' | 'Wool' | 'Nothing'
export type PlayerColor = 'Red' | 'Blue' | 'White' | 'Orange'
export type TerrainType = 'Hills' | 'Pasture' | 'Mountains' | 'Fields' | 'Forest' | 'Desert'

export type DevelopmentCard = {
  type: DevelopmentCardType,
}

export type Terrain = {|
  id: TerrainID,
  type: TerrainType,
|}

export type NumberToken = 2 | 3 | 4 | 5 | 6 | 8 | 9 | 10 | 11 | 12

export type RobberToken = 'Robber'

export type Chip = NumberToken | RobberToken

export type PlayerID = number

export type Placeable<A, T> = (T & A & {isPlaced: true}) | (A & {isPlaced: false})

export type Road = Placeable<{
  id: RoadID
}, {
  terrainsIds: TerrainID[],
}>

export type Settlement = Placeable<{
  id: SettlementID,
}, {
  terrainId: TerrainID
}>

export type City = Placeable<{
  id: CityID
}, {
  terrainId: TerrainID
}>

export type Player = {|
  color: PlayerColor,
  id: PlayerID,
  roads: Road[],
  cities: City[],
  settlements: Settlement[],
  victoryPoints: VictoryPoint[],
|}

export type Trade = {|
  players: [PlayerID, PlayerID],
|}

export type BoardMap = {|
  // the order is from top left corner, first left to right and then down: 0 to 18 = 19
  terrains: Terrain[],
  chips: Chip[],
  roadsIds: RoadID[],
  settlementsIds: SettlementID[],
|}

export type Board = {|
  boardMap: BoardMap,
|}

export type Round = {
  currentPlayer: PlayerID,
}

export type Game = {|
  board: Board,
  currentRound: Round,
  phase: GamePhaseType,
  players: Player[],
  previousRounds: Round[],
|}

export type TerrainIndex = number

export type Axis = [TerrainIndex, TerrainIndex]
export type Intersection = [TerrainIndex, TerrainIndex, TerrainIndex]
