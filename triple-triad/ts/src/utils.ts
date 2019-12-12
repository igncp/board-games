/**
 * These utils are intended to be mathematical or to operate with primitive
 * data types, and not related to the game business logic.
 */

type GetRandomItem = <A extends unknown>(
  items: A[]
) => { index: number; item: A; newItems: A[] };

const getRandomItem: GetRandomItem = items => {
  const index = Math.floor(Math.random() * items.length);
  const item = items[index];
  const newItems = items.slice(0);

  newItems.splice(index, 1);

  return { index, item, newItems };
};

export { getRandomItem };
