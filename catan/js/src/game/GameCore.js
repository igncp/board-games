// @flow

import type {T_Player} from "../Player"
import type {T_Board} from "../Board"

type T_TimelinePhases = {|
  INITIAL_SETUP: 0,
  ROUNDS: 1,
|}

type T_TimelinePhase = $Keys<T_TimelinePhases>

export type T_Timeline = {|
  phase: T_TimelinePhase
|}

export type T_Game = {|
  board: T_Board,
  players: T_Player[],
  timeline: T_Timeline,
|}
