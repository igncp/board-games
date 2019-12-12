import { createGame, defaultCards, playTurn, GamePhase } from "..";
import { Game, Player } from "../constants";

import { getFlatSlots } from "../helpers/board";

describe("createGame", () => {
  it("returns a game with expected features", async () => {
    const game = await createGame();

    expect(game.players.length).toEqual(2);
    expect(game.phase).toEqual(GamePhase.Playing);
    expect(game.usedCards).toEqual(defaultCards);
    expect(game.players.map(p => p.gameCards.length)).toEqual([5, 5]);

    game.players.forEach(player => {
      player.gameCards.forEach(gameCard => {
        expect(
          !!player.allCards.find(c => c.cardId === gameCard.cardId)
        ).toEqual(true);
      });
    });
  });

  it("returns 3x3 board slots with expected config by default", async () => {
    const game = await createGame();

    const totalSlots = game.board.slots.reduce((acc, boardSlotsRow) => {
      return (
        acc +
        boardSlotsRow.reduce((acc2, boardSlot) => {
          expect(boardSlot.cardReference).toEqual(null);
          expect(boardSlot.cardPlayer).toEqual(null);

          return acc2 + 1;
        }, 0)
      );
    }, 0);

    expect(totalSlots).toEqual(9);
  });
});

describe("playTurn", () => {
  it("drops a user card after turn", async () => {
    const game = await createGame();

    const getPlayerCardsInBoardNum = (playerId: Player["id"], g: Game) => {
      return getFlatSlots(g.board.slots).filter(
        flatSlot => flatSlot.slot.cardPlayer === playerId
      ).length;
    };

    const playerPlaying = game.turn.playerId;

    expect(getPlayerCardsInBoardNum(playerPlaying, game)).toEqual(0);

    const newGame = await playTurn(game);

    expect(getPlayerCardsInBoardNum(playerPlaying, newGame)).toEqual(1);
  });

  it("does not change the cards of the player after a turn", async () => {
    /**
     * It is important to keep the player cards so at the end it is clear the
     * original state
     */
    const game = await createGame();

    const getPlayerGameCardsNum = (playerId: Player["id"], g: Game) => {
      return g.players.find(p => p.id === playerId)!.gameCards.length;
    };

    const playersIds = game.players.map(p => p.id);

    expect(playersIds.map(pId => getPlayerGameCardsNum(pId, game))).toEqual([
      5,
      5
    ]);

    const newGame = await playTurn(game);

    expect(playersIds.map(pId => getPlayerGameCardsNum(pId, newGame))).toEqual([
      5,
      5
    ]);
  });

  it("updates the game turn", async () => {
    const game = await createGame();

    expect(typeof game.turn.playerId).toEqual("number");

    const oppositePlayerId = game.players.find(
      p => p.id !== game.turn.playerId
    )!.id;

    const newGame = await playTurn(game);

    expect(newGame.turn.playerId).not.toEqual(game.turn.playerId);
    expect(newGame.turn.playerId).toEqual(oppositePlayerId);
  });

  it("updates the game phase when slots full", async () => {
    const game = await createGame();

    const newGame = await playTurn(game);

    expect(newGame.phase).toEqual(GamePhase.Playing);

    game.board.slots.forEach(slotsRow => {
      slotsRow.forEach(slot => {
        slot.cardPlayer = 1;
      });
    });

    const newGameTwo = await playTurn(game);

    expect(newGameTwo.phase).toEqual(GamePhase.End);
  });

  it("updates the game phase when last card", async () => {
    const game = await createGame();

    const newGame = await playTurn(game);

    expect(newGame.phase).toEqual(GamePhase.Playing);

    game.board.slots.forEach(slotsRow => {
      slotsRow.forEach(slot => {
        slot.cardPlayer = 1;
      });
    });

    game.board.slots[0][0].cardPlayer = null;

    const newGameTwo = await playTurn(game);

    expect(newGameTwo.phase).toEqual(GamePhase.End);
  });
});
