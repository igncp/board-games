import { createGame } from '../../game';
import { CardElement } from '../../constants';

import { getBoardStr } from '../debug'

describe("getBoardStr", () => {
  test("empty board", async () => {
    const game = await createGame();

    const boardStr = getBoardStr(game.board);

    expect(boardStr).toEqual(`
_|_|_
_|_|_
_|_|_
    `.trim());
  });

  test("board with some cards", async () => {
    const game = await createGame();

    game.board.slots[0][0] = {
      cardReference: game.players[0].gameCards[0],
      cardPlayer: game.players[0].id,
      element: null
    };
    game.board.slots[2][2] = {
      cardReference: game.players[0].gameCards[1],
      cardPlayer: game.players[0].id,
      element: null
    };

    game.board.slots[1][1] = {
      cardReference: game.players[0].gameCards[1],
      cardPlayer: game.players[1].id,
      element: null
    };

    const boardStr = getBoardStr(game.board);

    expect(boardStr).toEqual(`
0|_|_
_|1|_
_|_|0
    `.trim());
  });

  test("board with elements in slots and card", async () => {
    const game = await createGame();

    game.board.slots[0][0] = {
      cardReference: game.players[0].gameCards[0],
      cardPlayer: game.players[0].id,
      element: CardElement.Fire
    };
    game.board.slots[2][2] = {
      cardReference: null,
      cardPlayer: null,
      element: CardElement.Ice
    };

    const boardStr = getBoardStr(game.board);

    expect(boardStr).toEqual(`
0|_|_
_|_|_
_|_|_
    `.trim());
  });
});
