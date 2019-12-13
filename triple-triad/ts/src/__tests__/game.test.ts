import { createGame, defaultCards, playTurn, GamePhase } from "..";
import { Game, Player } from "../constants";
import { OnChoosePlayerCard } from "../game";

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

        slot.cardReference = {
          cardId: 1,
          cardCopyUid: "123"
        };
      });
    });

    game.board.slots[0][0].cardPlayer = null;

    const newGameTwo = await playTurn(game);

    expect(newGameTwo.phase).toEqual(GamePhase.End);
  });

  it("can pass a custom card to the game", async () => {
    const game = await createGame();
    const cardReference = {
      cardId: 1,
      cardCopyUid: "cardCopyUidValue"
    };

    const onChoosePlayerCard: OnChoosePlayerCard = () => {
      return Promise.resolve({
        position: {
          row: 1,
          column: 1
        },
        cardReference
      });
    };

    const newGame = await playTurn(game, {
      onChoosePlayerCard
    });

    expect(newGame.board.slots[1][1].cardReference).toEqual(cardReference);
  });

  it("converts the card of the opposite player when necessary", async () => {
    const game = await createGame();

    game.usedCards = game.usedCards.slice(0);
    game.usedCards[0] = { ...game.usedCards[0], ranks: [1, 1, 1, 1] };
    game.usedCards[1] = { ...game.usedCards[1], ranks: [2, 2, 2, 2] };

    game.players[0].gameCards[0].cardId = game.usedCards[0].id;
    game.players[1].gameCards[0].cardId = game.usedCards[1].id;

    game.board.slots[1][1].cardReference = game.players[0].gameCards[0];
    game.board.slots[1][1].cardPlayer = game.players[0].id;

    game.turn.playerId = game.players[1].id;

    await Promise.all(
      [
        { row: 1, column: 0 },
        { row: 2, column: 1 },
        { row: 1, column: 2 }
      ].map(async position => {
        const onChoosePlayerCard: OnChoosePlayerCard = () => {
          return Promise.resolve({
            position,
            cardReference: game.players[1].gameCards[0]
          });
        };

        const newGame = await playTurn(game, {
          onChoosePlayerCard
        });

        expect(game.board.slots[1][1].cardPlayer).toEqual(game.players[0].id);

        expect(newGame.board.slots[1][1].cardPlayer).toEqual(
          newGame.players[1].id
        );
      })
    );
  });
});
