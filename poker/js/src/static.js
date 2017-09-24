// @flow

/* eslint-disable quote-props */
const cardValueToOrder = { // eslint-disable-line flowtype/require-variable-type
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
}
/* eslint-enable quote-props */

const cardSuitToIndex = { // eslint-disable-line flowtype/require-variable-type
  Diamonds: 0,
  Clubs: 1,
  Hearts: 2,
  Spades: 3,
}

export const chipTypeToValue = { // eslint-disable-line flowtype/require-variable-type
  Black: 1000,
  Blue: 100,
  Green: 25,
  Red: 500,
}

type CardSuit = $Keys<typeof cardSuitToIndex>
type CardValue = $Keys<typeof cardValueToOrder>
type ChipType = $Keys<typeof chipTypeToValue>
export type Deck = Card[]

export type Card = {|
  id: number,
  suit: CardSuit,
  value: CardValue,
|}

type ChipValueToType = {[number]: ChipType}

const cardSuits: CardSuit[] = Object.keys(cardSuitToIndex)
const cardValues: CardValue[] = Object.keys(cardValueToOrder)
const chipTypes: ChipType[] = Object.keys(chipTypeToValue)

export const chipValues: number[] = chipTypes.map((t: ChipType): number => chipTypeToValue[t])
export const chipValueToType: ChipValueToType =
  chipTypes.reduce((acc: ChipValueToType, t: ChipType): ChipValueToType => Object.assign({}, acc, {
    [chipTypeToValue[t]]: t,
  }), {})
export const minChipValue: number = Math.min(...chipValues)

export const deck: Deck = cardSuits.reduce((accDeck: Card[], cardSuit: CardSuit, idxI: number): Card[] => {
  const suitCards: Card[] = cardValues.map((cardValue: CardValue, idxJ: number): Card => ({
    suit: cardSuit,
    value: cardValue,
    id: idxI * cardValues.length + idxJ,
  }))

  return accDeck.concat(suitCards)
}, [])

export type Chip = {|
  type: ChipType,
|}

export type PlayerId = number

export type Player = {|
  id: PlayerId,
  chips: Chip[],
|}

export type GameOpts = {|
  maxRounds: number,
  moneyPerPlayer: number,
  playersNum: number,
|}

const roundStepToOrder = { // eslint-disable-line flowtype/require-variable-type
  Blind: 0,
  First: 1,
  Flop: 2,
  Turn: 3,
  River: 4,
  Showdown: 5,
}

type RoundStep = $Keys<typeof roundStepToOrder>

export type Round = {|
  step: RoundStep,
  dealer: Player,
  playerToCards?: {|
    [PlayerId]: ?[Card, Card],
  |},
  playerToBets: {|
    [PlayerId]: Chip[],
  |},
|}

export type Game = {|
  deck: Deck,
  maxRounds: number,
  players: Player[],
  rounds: Round[],
|}

export type GameResult = {|
  game: Game,
  stats: {|
    winner: Player,
    winnerMoney: number,
  |},
|}
