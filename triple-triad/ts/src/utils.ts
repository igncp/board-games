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

type CreateUUId = () => string;

const createUUId: CreateUUId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
};

export { getRandomItem, createUUId };
