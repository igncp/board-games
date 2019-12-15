import defaultCards from "./defaultCards";
import { createGame, playTurn } from "./game";
import {
  CardElement,
  GamePhase,
  Region,
  SpecialRule,
  TradeRule,
  regionToSpecialRulesMap
} from "./constants";

import { getFlatSlots } from "./helpers/board";

const boardHelpers = { getFlatSlots };

export {
  CardElement,
  GamePhase,
  Region,
  SpecialRule,
  TradeRule,
  boardHelpers,
  createGame,
  defaultCards,
  playTurn,
  regionToSpecialRulesMap
};
