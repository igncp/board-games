import {
  Card,
  CardColor,
  CardType,
  Game,
  GameConfig,
  GamePhase,
  Player
} from "./types";
import { INITIAL_CARDS_NUM, ALL_CARDS } from "./constants";
import { getLeftPlayer, getRandomItem } from "./helpers";

const setupGame = (config: GameConfig): Game => {
  if (config.playersNum < 2 || config.playersNum > 10) {
    throw new Error("Wrong number of players");
  }

  const deck = ALL_CARDS.slice(0);
  let deckIds: Card["id"][] = deck.map(c => c.id);
  const players: Player[] = [];

  for (var i = 0; i < config.playersNum; i++) {
    players.push({
      id: i,
      cards: []
    });
  }

  players.forEach(player => {
    for (var i = 0; i < INITIAL_CARDS_NUM; i++) {
      const { item, newItems } = getRandomItem(deckIds);
      player.cards.push(item);
      deckIds = newItems;
    }
  });

  const dealerPlayerIdx = 0;

  return {
    dealer: players[dealerPlayerIdx].id,
    players,
    phase: GamePhase.Setup,
    turn: {
      player: getLeftPlayer(players.map(p => p.id), dealerPlayerIdx)
    },
    board: {
      discardPile: deckIds
    }
  };
};

export { setupGame };
