import { extractArrayNItemsOrLess } from "../utils";

describe("extractArrayNItemsOrLess", () => {
  it("returns the expected values", () => {
    expect(extractArrayNItemsOrLess([0, 1, 2], 2)).toEqual({
      newArray: [0],
      items: [1, 2]
    });

    expect(extractArrayNItemsOrLess([0], 2)).toEqual({
      newArray: [],
      items: [0]
    });

    expect(extractArrayNItemsOrLess([], 2)).toEqual({
      newArray: [],
      items: []
    });
  });
});
