import { Game, GamePhase, Wind } from "../../src/core";
import { getDefaultDeck } from "../../src/tiles";

export const chowGame01: Game = {
  id: "c712f0bb-9e1c-4d0b-92ca-341f2817c688",
  score: {
    "6-742c-4a90-9194-8c31e9085ad8": 0,
    "6-f044-47b9-8edc-09d0a110644e": 0,
    "a-6643-4dd4-abb8-a2ae650cf194": 0,
    "5-1ed1-4f6d-9777-897fe2fd102a": 0,
  },
  phase: GamePhase.Playing,
  deck: getDefaultDeck(),
  players: [
    {
      id: "6-742c-4a90-9194-8c31e9085ad8",
      name: "Player 0",
    },
    {
      id: "6-f044-47b9-8edc-09d0a110644e",
      name: "Player 1",
    },
    {
      id: "a-6643-4dd4-abb8-a2ae650cf194",
      name: "Player 2",
    },
    {
      id: "5-1ed1-4f6d-9777-897fe2fd102a",
      name: "Player 3",
    },
  ],
  round: {
    dealerPlayerIndex: 0,
    playerIndex: 0,
    tileClaimed: {
      id: 121,
      by: null,
      from: "5-1ed1-4f6d-9777-897fe2fd102a",
    },
    type: Wind.East,
    wallTileDrawn: 73,
  },
  table: {
    board: [33, 64, 120, 108, 135, 66, 128, 111, 121],
    drawWall: [
      92, 87, 105, 104, 8, 89, 4, 5, 23, 27, 123, 141, 36, 7, 28, 35, 21, 2,
      131, 54, 30, 110, 0, 9, 65, 60, 130, 55, 76, 32, 17, 109, 70, 94, 98, 129,
      25, 38, 72, 136, 126, 20, 138, 103, 85, 117, 11, 19, 56, 97, 133, 83, 95,
      122, 81, 15, 59, 40, 134, 115, 51, 132, 63, 142, 88, 82, 75, 22, 29, 124,
      140, 67, 96, 127, 18, 3, 101, 143, 37, 53, 31, 10,
    ],
    hands: {
      "6-742c-4a90-9194-8c31e9085ad8": [
        {
          id: 116,
          setId: null,
          concealed: true,
        },
        {
          id: 137,
          setId: null,
          concealed: true,
        },
        {
          id: 86,
          setId: null,
          concealed: true,
        },
        {
          id: 99,
          setId: null,
          concealed: true,
        },
        {
          id: 73,
          setId: null,
          concealed: true,
        },
        {
          id: 74,
          setId: null,
          concealed: true,
        },
        {
          id: 24,
          setId: "9cb857f7-55f9-4269-ad09-2c088480320a",
          concealed: true,
        },
        {
          id: 79,
          setId: "9cb857f7-55f9-4269-ad09-2c088480320a",
          concealed: true,
        },
        {
          id: 26,
          setId: "9cb857f7-55f9-4269-ad09-2c088480320a",
          concealed: true,
        },
        {
          id: 80,
          setId: null,
          concealed: true,
        },
        {
          id: 91,
          setId: null,
          concealed: true,
        },
        {
          id: 69,
          setId: "53968331-e1ff-45ed-94a8-e4ce04c322b8",
          concealed: true,
        },
        {
          id: 16,
          setId: "53968331-e1ff-45ed-94a8-e4ce04c322b8",
          concealed: true,
        },
        {
          id: 71,
          setId: "53968331-e1ff-45ed-94a8-e4ce04c322b8",
          concealed: true,
        },
      ],
      "6-f044-47b9-8edc-09d0a110644e": [
        {
          id: 118,
          setId: "76b3eb81-cce9-4da0-b221-f7768efa3235",
          concealed: false,
        },
        {
          id: 125,
          setId: "76b3eb81-cce9-4da0-b221-f7768efa3235",
          concealed: false,
        },
        {
          id: 62,
          setId: null,
          concealed: true,
        },
        {
          id: 100,
          setId: "c77ea86d-d5f8-4cfd-a081-97840ec43f04",
          concealed: false,
        },
        {
          id: 47,
          setId: "c77ea86d-d5f8-4cfd-a081-97840ec43f04",
          concealed: false,
        },
        {
          id: 102,
          setId: "c77ea86d-d5f8-4cfd-a081-97840ec43f04",
          concealed: false,
        },
        {
          id: 77,
          setId: null,
          concealed: true,
        },
        {
          id: 52,
          setId: null,
          concealed: true,
        },
        {
          id: 106,
          setId: null,
          concealed: true,
        },
        {
          id: 42,
          setId: "68825f2e-17bf-437b-aa27-de04913065d2",
          concealed: true,
        },
        {
          id: 43,
          setId: "68825f2e-17bf-437b-aa27-de04913065d2",
          concealed: true,
        },
        {
          id: 44,
          setId: "68825f2e-17bf-437b-aa27-de04913065d2",
          concealed: true,
        },
        {
          id: 139,
          setId: "76b3eb81-cce9-4da0-b221-f7768efa3235",
          concealed: false,
        },
      ],
      "a-6643-4dd4-abb8-a2ae650cf194": [
        {
          id: 114,
          setId: null,
          concealed: true,
        },
        {
          id: 1,
          setId: null,
          concealed: true,
        },
        {
          id: 58,
          setId: null,
          concealed: true,
        },
        {
          id: 6,
          setId: null,
          concealed: true,
        },
        {
          id: 46,
          setId: null,
          concealed: true,
        },
        {
          id: 48,
          setId: null,
          concealed: true,
        },
        {
          id: 93,
          setId: "954e4949-c193-48c9-bdb2-2d9ab228676f",
          concealed: true,
        },
        {
          id: 12,
          setId: "954e4949-c193-48c9-bdb2-2d9ab228676f",
          concealed: true,
        },
        {
          id: 39,
          setId: "954e4949-c193-48c9-bdb2-2d9ab228676f",
          concealed: true,
        },
        {
          id: 68,
          setId: "f4bc5262-fccf-4460-8626-98cf77a77702",
          concealed: false,
        },
        {
          id: 41,
          setId: "f4bc5262-fccf-4460-8626-98cf77a77702",
          concealed: false,
        },
        {
          id: 107,
          setId: null,
          concealed: true,
        },
        {
          id: 14,
          setId: "f4bc5262-fccf-4460-8626-98cf77a77702",
          concealed: false,
        },
      ],
      "5-1ed1-4f6d-9777-897fe2fd102a": [
        {
          id: 112,
          setId: null,
          concealed: true,
        },
        {
          id: 113,
          setId: null,
          concealed: true,
        },
        {
          id: 119,
          setId: null,
          concealed: true,
        },
        {
          id: 84,
          setId: null,
          concealed: true,
        },
        {
          id: 61,
          setId: null,
          concealed: true,
        },
        {
          id: 34,
          setId: null,
          concealed: true,
        },
        {
          id: 45,
          setId: null,
          concealed: true,
        },
        {
          id: 49,
          setId: "ba835bbd-5d31-4305-b3ab-b8177fa4d9eb",
          concealed: false,
        },
        {
          id: 50,
          setId: "ba835bbd-5d31-4305-b3ab-b8177fa4d9eb",
          concealed: false,
        },
        {
          id: 78,
          setId: "ba835bbd-5d31-4305-b3ab-b8177fa4d9eb",
          concealed: false,
        },
        {
          id: 90,
          setId: null,
          concealed: true,
        },
        {
          id: 13,
          setId: null,
          concealed: true,
        },
        {
          id: 57,
          setId: null,
          concealed: true,
        },
      ],
    },
  },
};
