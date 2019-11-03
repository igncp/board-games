/**
 * These utils are intended to be mathematical or to operate with primitive
 * data types, and not related to the game business logic.
 */

type GetRandomItem = <A extends unknown>(
  items: A[]
) => { index: number; item: A; newItems: A[] };

export const getRandomItem: GetRandomItem = items => {
  const index = Math.floor(Math.random() * items.length);
  const item = items[index];
  const newItems = items.slice(0);

  newItems.splice(index, 1);

  return { index, item, newItems };
};

export const getShuffledArray = <A extends unknown>(items: A[]): A[] => {
  let prevItems = items.slice(0);
  const newItems: A[] = [];

  for (let i = 0; i < items.length; i += 1) {
    const { newItems: itemsWithoutRandomItem, item } = getRandomItem(prevItems);

    newItems.push(item);
    prevItems = itemsWithoutRandomItem;
  }

  return newItems;
};

export const extractArrayNItemsOrLess = <A extends unknown>(
  arr: A[],
  num: number
): { items: A[]; newArray: A[] } => {
  if (arr.length === 0) {
    return { items: [], newArray: arr };
  }

  const newArray = arr.slice(0);
  const idx = Math.max(newArray.length - num, 0);
  const items = newArray.splice(idx, num);

  return { items, newArray };
};

export const _test: {
  getRandomItem?: GetRandomItem;
} = {};

// istanbul ignore else
if (process.env.NODE_ENV === "test") {
  _test.getRandomItem = getRandomItem;
}
