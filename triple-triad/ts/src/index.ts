import defaultCards from "./defaultCards";
import { createGame, playTurn } from "./game";
import { GamePhase, TradeRule, SpecialRule, CardElement } from "./constants";

import { getFlatSlots } from "./helpers/board";

const boardHelpers = { getFlatSlots };

export {
  CardElement,
  GamePhase,
  SpecialRule,
  TradeRule,
  boardHelpers,
  createGame,
  defaultCards,
  playTurn
};
