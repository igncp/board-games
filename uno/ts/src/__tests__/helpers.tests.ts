import { getLeftPlayer, getRandomItem } from "../helpers";

describe("getLeftPlayer", () => {
  it("returns the expected value", () => {
    expect(getLeftPlayer([3, 4, 5], 4)).toEqual(3);
    expect(getLeftPlayer([3, 4, 5], 3)).toEqual(5);
    expect(getLeftPlayer([3, 4, 5], 5)).toEqual(4);
  });
});

describe("getRandomItem", () => {
  it("returns the expected value", () => {
    const items = ["A", "B", "C"];
    const { newItems, index, item } = getRandomItem(items);

    expect(index > -1).toEqual(true);
    expect(index < 3).toEqual(true);
    expect(newItems.length).toEqual(2);
    expect(newItems.includes(item)).toEqual(false);
  });
});
