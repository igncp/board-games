import {
  CardElement,
  GamePhase,
  Region,
  SpecialRule,
  TradeRule,
  boardHelpers,
  createGame,
  defaultCards,
  playTurn,
  regionToSpecialRulesMap
} from "..";
import { Game, Player, CardReference } from "../constants";
import {
  OnChoosePlayerCard,
  OnWinnerChooseCards,
  CreateGameOpts
} from "../game";
import { mockMathRandomAlternate } from "../testUtils";

const { getFlatSlots } = boardHelpers;

describe("createGame", () => {
  it("returns a game with expected features", async () => {
    const game = await createGame();

    expect(game.players.length).toEqual(2);
    expect(game.phase).toEqual(GamePhase.Playing);
    expect(game.usedCards).toEqual(defaultCards);
    expect(game.tradeRule).toEqual(TradeRule.One);
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
          cardCopyUid: "123",
          cardId: 1
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
      cardCopyUid: "cardCopyUidValue",
      cardId: 1
    };

    const onChoosePlayerCard: OnChoosePlayerCard = () => {
      return Promise.resolve({
        cardReference,
        position: {
          column: 1,
          row: 1
        }
      });
    };

    const newGame = await playTurn(game, {
      onChoosePlayerCard
    });

    expect(newGame.board.slots[1][1].cardReference).toEqual(cardReference);
  });

  [
    { converts: true, rank: 2 },
    { converts: false, rank: 1 }
  ].forEach(({ converts, rank }) => {
    it(`converts the card of the opposite player when necessary: ${converts}`, async () => {
      const game = await createGame();

      game.usedCards = game.usedCards.slice(0);
      game.usedCards[0] = { ...game.usedCards[0], ranks: [1, 1, 1, 1] };

      game.usedCards[1] = {
        ...game.usedCards[1],
        ranks: [rank, rank, rank, rank]
      };

      game.players[0].gameCards[0].cardId = game.usedCards[0].id;
      game.players[1].gameCards[0].cardId = game.usedCards[1].id;

      game.board.slots[1][1].cardReference = game.players[0].gameCards[0];
      game.board.slots[1][1].cardPlayer = game.players[0].id;

      game.turn.playerId = game.players[1].id;

      await Promise.all(
        [
          { column: 0, row: 1 },
          { column: 1, row: 0 },
          { column: 1, row: 2 },
          { column: 2, row: 1 }
        ].map(async position => {
          const onChoosePlayerCard: OnChoosePlayerCard = () => {
            return Promise.resolve({
              cardReference: game.players[1].gameCards[0],
              position
            });
          };

          const newGame = await playTurn(game, {
            onChoosePlayerCard
          });

          expect(game.board.slots[1][1].cardPlayer).toEqual(game.players[0].id);

          expect(newGame.board.slots[1][1].cardPlayer).toEqual(
            newGame.players[converts ? 1 : 0].id
          );
        })
      );
    });
  });

  [0, 1].forEach(playerIdx => {
    it(`calls onWinnerChooseCards with the expected player id for player: ${playerIdx}`, async () => {
      const game = await createGame();

      getFlatSlots(game.board.slots).forEach(flatSlot => {
        flatSlot.slot.cardPlayer = game.players[playerIdx].id;
      });

      const onWinnerChooseCards: OnWinnerChooseCards = (
        g,
        { winnerPlayerId }
      ) => {
        expect(winnerPlayerId).toEqual(g.players[playerIdx].id);

        return Promise.resolve({ loserCards: [], winnerCards: [] });
      };

      await playTurn(game, {
        onWinnerChooseCards
      });

      expect.assertions(1);
    });
  });

  describe("special rules", () => {
    describe("initial elemental", () => {
      mockMathRandomAlternate();

      const prepareTest = async (specialRules: SpecialRule[]) => {
        const game = await createGame({
          specialRules
        });

        return getFlatSlots(game.board.slots).filter(flatSlot => {
          return flatSlot.slot.element !== null;
        }).length;
      };

      it("adds elements to slots when passing Elemental", async () => {
        const slotsWithElements = await prepareTest([SpecialRule.Elemental]);

        expect(slotsWithElements).not.toEqual(0);
      });

      it("does not add elements to slots when not passing Elemental", async () => {
        const slotsWithElements = await prepareTest([]);

        expect(slotsWithElements).toEqual(0);
      });
    });

    describe("elemental rank", () => {
      [
        { current: CardElement.Fire, other: null },
        {
          current: null,
          other: CardElement.Ice
        }
      ].forEach(({ current, other }, idx) => {
        it(`can win a card with same rank on condition: ${idx}`, async () => {
          const game = await createGame();

          game.specialRules = [SpecialRule.Elemental];
          game.usedCards = game.usedCards.slice(0);

          game.usedCards[0] = {
            ...game.usedCards[0],
            element: CardElement.Fire,
            ranks: [1, 1, 1, 1]
          };
          game.turn.playerId = 0;

          game.board.slots[0][0].element = current;

          game.board.slots[0][1].element = other;
          game.board.slots[0][1].cardPlayer = game.players[1].id;

          game.board.slots[0][1].cardReference = {
            cardCopyUid: "234",
            cardId: game.usedCards[0].id
          };

          const onChoosePlayerCard: OnChoosePlayerCard = () => {
            return Promise.resolve({
              cardReference: {
                cardCopyUid: "123",
                cardId: game.usedCards[0].id
              },
              position: { column: 0, row: 0 }
            });
          };

          const newGame = await playTurn(game, {
            onChoosePlayerCard
          });

          expect(game.board.slots[0][1].cardPlayer).toEqual(game.players[1].id);

          expect(newGame.board.slots[0][1].cardPlayer).toEqual(
            newGame.players[0].id
          );
        });
      });
    });
  });

  describe("region", () => {
    it("can be used on game creation to setup the special rules (if not passed)", () => {
      const expectations: [CreateGameOpts, SpecialRule[]][] = [
        [{}, []],
        [{ specialRules: [SpecialRule.Open] }, [SpecialRule.Open]],
        [{ region: Region.Centra }, regionToSpecialRulesMap[Region.Centra]],
        [{ region: "unexisting-region" as Region }, []]
      ];

      return Promise.all(
        expectations.map(async ([opts, expectedSpecialRules]) => {
          const game = await createGame(opts);

          expect(game.specialRules).toEqual(expectedSpecialRules);
        })
      );
    });
  });

  describe("trade rules", () => {
    it("chooses the expected items for TradeRule.One", async () => {
      const game = await createGame();

      getFlatSlots(game.board.slots).forEach(flatSlot => {
        flatSlot.slot.cardPlayer = game.players[0].id;
      });

      const newGame = await playTurn(game);

      expect(newGame.tradeRule).toEqual(TradeRule.One);
      expect(newGame.players[0].wonCards.length).toEqual(1);
      expect(newGame.players[1].wonCards.length).toEqual(0);

      const findWonCard = (c: CardReference) =>
        c.cardCopyUid === newGame.players[0].wonCards[0];
      expect(!!newGame.players[1].gameCards.find(findWonCard)).toEqual(true);
      expect(!!newGame.players[0].gameCards.find(findWonCard)).toEqual(false);
    });

    it("chooses the expected items for TradeRule.All", async () => {
      const game = await createGame();

      getFlatSlots(game.board.slots).forEach(flatSlot => {
        flatSlot.slot.cardPlayer = game.players[0].id;
      });
      game.tradeRule = TradeRule.All;

      const newGame = await playTurn(game);

      expect(newGame.tradeRule).toEqual(TradeRule.All);
      expect(newGame.players[0].wonCards.length).toEqual(5);
      expect(newGame.players[1].wonCards.length).toEqual(0);

      const findWonCard = (c: CardReference) =>
        newGame.players[0].wonCards.includes(c.cardCopyUid);
      expect(!!newGame.players[1].gameCards.find(findWonCard)).toEqual(true);
      expect(!!newGame.players[0].gameCards.find(findWonCard)).toEqual(false);
    });

    it("chooses the expected items for TradeRule.Direct", async () => {
      const game = await createGame();

      getFlatSlots(game.board.slots).forEach((flatSlot, idx) => {
        flatSlot.slot.cardPlayer = game.players[0].id;

        flatSlot.slot.cardReference = {
          cardCopyUid: `a-${idx}`,
          cardId: 1
        };
      });
      game.board.slots[0][0].cardPlayer = game.players[1].id;
      game.tradeRule = TradeRule.Direct;

      const newGame = await playTurn(game);

      expect(newGame.tradeRule).toEqual(TradeRule.Direct);
      expect(newGame.players[0].wonCards.length).toEqual(8);
      expect(newGame.players[1].wonCards.length).toEqual(1);
    });

    it("chooses the expected items for TradeRule.Difference", async () => {
      const game = await createGame();

      getFlatSlots(game.board.slots).forEach((flatSlot, idx) => {
        flatSlot.slot.cardPlayer = game.players[0].id;

        flatSlot.slot.cardReference = {
          cardCopyUid: `a-${idx}`,
          cardId: 1
        };
      });
      game.board.slots[0][0].cardPlayer = game.players[1].id;
      game.tradeRule = TradeRule.Difference;

      const newGame = await playTurn(game);

      expect(newGame.tradeRule).toEqual(TradeRule.Difference);
      expect(newGame.players[0].wonCards.length).toEqual(4);
      expect(newGame.players[1].wonCards.length).toEqual(0);
    });

    it("does not choose any item when unknown TradeRule (unexpected)", async () => {
      const game = await createGame();

      getFlatSlots(game.board.slots).forEach(flatSlot => {
        flatSlot.slot.cardPlayer = game.players[0].id;
      });
      game.tradeRule = "foo" as TradeRule;

      const newGame = await playTurn(game);

      expect(newGame.tradeRule).toEqual("foo");
      expect(newGame.players[0].wonCards.length).toEqual(0);
      expect(newGame.players[1].wonCards.length).toEqual(0);
    });
  });
});
