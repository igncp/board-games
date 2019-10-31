import { Player } from "./types";

export const getLeftPlayer = (
  players: Player["id"][],
  fromPlayerId: Player["id"]
): Player["id"] => {
  const idx = players.indexOf(fromPlayerId);

  return idx === 0 ? players[players.length - 1] : players[idx - 1];
};

export const getRandomItem = <A extends unknown>(
  items: A[]
): { index: number; item: A; newItems: A[] } => {
  const index = Math.floor(Math.random() * items.length);
  const item = items[index];
  const newItems = items.slice(0);

  newItems.splice(index, 1);

  return { index, item, newItems };
};
