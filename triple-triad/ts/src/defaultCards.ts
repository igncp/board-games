import { Card, CardElement } from "./constants";

const defaultCards: Card[] = [
  {
    element: CardElement.Neutral,
    id: 1,
    level: 1,
    name: "Geezard",
    ranks: [1, 5, 4, 1]
  },
  {
    element: CardElement.Neutral,
    id: 2,
    level: 1,
    name: "Funguar",
    ranks: [5, 3, 1, 1]
  },
  {
    element: CardElement.Neutral,
    id: 3,
    level: 1,
    name: "Bite Bug",
    ranks: [1, 5, 3, 3]
  },
  {
    element: CardElement.Neutral,
    id: 4,
    level: 1,
    name: "Red Bat",
    ranks: [6, 2, 1, 1]
  },
  {
    element: CardElement.Neutral,
    id: 5,
    level: 1,
    name: "Blobra",
    ranks: [2, 5, 3, 1]
  },
  {
    element: CardElement.Thunder,
    id: 6,
    level: 1,
    name: "Gayla",
    ranks: [2, 4, 1, 4]
  },
  {
    element: CardElement.Neutral,
    id: 7,
    level: 1,
    name: "Gesper",
    ranks: [1, 1, 5, 4]
  },
  {
    element: CardElement.Earth,
    id: 8,
    level: 1,
    name: "Fastitocalon-F",
    ranks: [3, 1, 5, 2]
  },
  {
    element: CardElement.Neutral,
    id: 9,
    level: 1,
    name: "Blood Soul",
    ranks: [2, 1, 1, 6]
  },
  {
    element: CardElement.Neutral,
    id: 10,
    level: 1,
    name: "Caterchipillar",
    ranks: [4, 3, 2, 4]
  },
  {
    element: CardElement.Thunder,
    id: 11,
    level: 1,
    name: "Cockatrice",
    ranks: [2, 6, 1, 2]
  },
  {
    element: CardElement.Neutral,
    id: 12,
    level: 2,
    name: "Grat",
    ranks: [7, 1, 1, 3]
  },
  {
    element: CardElement.Neutral,
    id: 13,
    level: 2,
    name: "Buel",
    ranks: [6, 3, 2, 2]
  },
  {
    element: CardElement.Neutral,
    id: 14,
    level: 2,
    name: "Mesmerize",
    ranks: [5, 4, 3, 3]
  },
  {
    element: CardElement.Ice,
    id: 15,
    level: 2,
    name: "Glacial Eye",
    ranks: [6, 3, 1, 4]
  },
  {
    element: CardElement.Neutral,
    id: 16,
    level: 2,
    name: "Belhelmel",
    ranks: [3, 3, 4, 5]
  },
  {
    element: CardElement.Wind,
    id: 17,
    level: 2,
    name: "Thrustaevis",
    ranks: [5, 5, 3, 2]
  },
  {
    element: CardElement.Poison,
    id: 18,
    level: 2,
    name: "Anacondaur",
    ranks: [5, 5, 1, 3]
  },
  {
    element: CardElement.Thunder,
    id: 19,
    level: 2,
    name: "Creeps",
    ranks: [5, 2, 2, 5]
  },
  {
    element: CardElement.Thunder,
    id: 20,
    level: 2,
    name: "Grendel",
    ranks: [4, 2, 4, 5]
  },
  {
    element: CardElement.Neutral,
    id: 21,
    level: 2,
    name: "Jelleye",
    ranks: [3, 7, 2, 1]
  },
  {
    element: CardElement.Neutral,
    id: 22,
    level: 2,
    name: "Grand Mantis",
    ranks: [5, 3, 2, 5]
  },
  {
    element: CardElement.Neutral,
    id: 23,
    level: 3,
    name: "Forbidden",
    ranks: [6, 2, 6, 3]
  },
  {
    element: CardElement.Earth,
    id: 24,
    level: 3,
    name: "Armadodo",
    ranks: [6, 6, 3, 1]
  },
  {
    element: CardElement.Poison,
    id: 25,
    level: 3,
    name: "Tri-Face",
    ranks: [3, 5, 5, 5]
  },
  {
    element: CardElement.Earth,
    id: 26,
    level: 3,
    name: "Fastitocalon",
    ranks: [7, 3, 5, 1]
  },
  {
    element: CardElement.Ice,
    id: 27,
    level: 3,
    name: "Snow Lion",
    ranks: [7, 3, 1, 5]
  },
  {
    element: CardElement.Neutral,
    id: 28,
    level: 3,
    name: "Ochu",
    ranks: [5, 3, 6, 3]
  },
  {
    element: CardElement.Fire,
    id: 29,
    level: 3,
    name: "SAM08G",
    ranks: [5, 4, 6, 2]
  },
  {
    element: CardElement.Fire,
    id: 30,
    level: 3,
    name: "Death Claw",
    ranks: [4, 2, 4, 7]
  },
  {
    element: CardElement.Neutral,
    id: 31,
    level: 3,
    name: "Cactuar",
    ranks: [6, 3, 2, 6]
  },
  {
    element: CardElement.Neutral,
    id: 32,
    level: 3,
    name: "Tonberry",
    ranks: [3, 4, 6, 4]
  },
  {
    element: CardElement.Earth,
    id: 33,
    level: 3,
    name: "Abyss Worm",
    ranks: [7, 5, 2, 3]
  },
  {
    element: CardElement.Neutral,
    id: 34,
    level: 4,
    name: "Turtapod",
    ranks: [2, 7, 3, 6]
  },
  {
    element: CardElement.Neutral,
    id: 35,
    level: 4,
    name: "Vysage",
    ranks: [6, 5, 5, 4]
  },
  {
    element: CardElement.Neutral,
    id: 36,
    level: 4,
    name: "T-Rexaur",
    ranks: [4, 7, 6, 2]
  },
  {
    element: CardElement.Fire,
    id: 37,
    level: 4,
    name: "Bomb",
    ranks: [2, 3, 7, 6]
  },
  {
    element: CardElement.Thunder,
    id: 38,
    level: 4,
    name: "Blitz",
    ranks: [1, 7, 6, 4]
  },
  {
    element: CardElement.Neutral,
    id: 39,
    level: 4,
    name: "Wendigo",
    ranks: [7, 6, 3, 1]
  },
  {
    element: CardElement.Neutral,
    id: 40,
    level: 4,
    name: "Torama",
    ranks: [7, 4, 4, 4]
  },
  {
    element: CardElement.Neutral,
    id: 41,
    level: 4,
    name: "Imp",
    ranks: [3, 6, 7, 3]
  },
  {
    element: CardElement.Poison,
    id: 42,
    level: 4,
    name: "Blue Dragon",
    ranks: [6, 3, 2, 7]
  },
  {
    element: CardElement.Earth,
    id: 43,
    level: 4,
    name: "Adamantoise",
    ranks: [4, 6, 5, 5]
  },
  {
    element: CardElement.Fire,
    id: 44,
    level: 4,
    name: "Hexadragon",
    ranks: [7, 3, 5, 4]
  },
  {
    element: CardElement.Neutral,
    id: 45,
    level: 5,
    name: "Iron Giant",
    ranks: [6, 5, 5, 6]
  },
  {
    element: CardElement.Neutral,
    id: 46,
    level: 5,
    name: "Behemoth",
    ranks: [3, 7, 6, 5]
  },
  {
    element: CardElement.Water,
    id: 47,
    level: 5,
    name: "Chimera",
    ranks: [7, 3, 6, 5]
  },
  {
    element: CardElement.Neutral,
    id: 48,
    level: 5,
    name: "PuPu",
    ranks: [3, 1, 10, 2]
  },
  {
    element: CardElement.Neutral,
    id: 49,
    level: 5,
    name: "Elastoid",
    ranks: [6, 7, 2, 6]
  },
  {
    element: CardElement.Neutral,
    id: 50,
    level: 5,
    name: "GIM47N",
    ranks: [5, 4, 5, 7]
  },
  {
    element: CardElement.Poison,
    id: 51,
    level: 5,
    name: "Malboro",
    ranks: [7, 2, 7, 4]
  },
  {
    element: CardElement.Fire,
    id: 52,
    level: 5,
    name: "Ruby Dragon",
    ranks: [7, 4, 2, 7]
  },
  {
    element: CardElement.Neutral,
    id: 53,
    level: 5,
    name: "Elnoyle",
    ranks: [5, 6, 3, 7]
  },
  {
    element: CardElement.Neutral,
    id: 54,
    level: 5,
    name: "Tonberry King",
    ranks: [4, 4, 6, 7]
  },
  {
    element: CardElement.Neutral,
    id: 55,
    level: 5,
    name: "Wedge, Biggs",
    ranks: [6, 7, 6, 2]
  },
  {
    element: CardElement.Neutral,
    id: 56,
    level: 6,
    name: "Fujin Raijin",
    ranks: [2, 4, 8, 8]
  },
  {
    element: CardElement.Wind,
    id: 57,
    level: 6,
    name: "Elvoret",
    ranks: [7, 4, 8, 3]
  },
  {
    element: CardElement.Neutral,
    id: 58,
    level: 6,
    name: "X-ATM092",
    ranks: [4, 3, 8, 7]
  },
  {
    element: CardElement.Neutral,
    id: 59,
    level: 6,
    name: "Granaldo",
    ranks: [7, 5, 2, 8]
  },
  {
    element: CardElement.Poison,
    id: 60,
    level: 6,
    name: "Gerogero",
    ranks: [1, 3, 8, 8]
  },
  {
    element: CardElement.Neutral,
    id: 61,
    level: 6,
    name: "Iguion",
    ranks: [8, 2, 2, 8]
  },
  {
    element: CardElement.Neutral,
    id: 62,
    level: 6,
    name: "Abadon",
    ranks: [6, 5, 8, 4]
  },
  {
    element: CardElement.Neutral,
    id: 63,
    level: 6,
    name: "Trauma",
    ranks: [4, 6, 8, 5]
  },
  {
    element: CardElement.Neutral,
    id: 64,
    level: 6,
    name: "Oilboyle",
    ranks: [1, 8, 8, 4]
  },
  {
    element: CardElement.Neutral,
    id: 65,
    level: 6,
    name: "Shumi",
    ranks: [6, 4, 5, 8]
  },
  {
    element: CardElement.Neutral,
    id: 66,
    level: 6,
    name: "Krysta",
    ranks: [7, 1, 5, 8]
  },
  {
    element: CardElement.Neutral,
    id: 67,
    level: 7,
    name: "Propagator",
    ranks: [8, 8, 4, 4]
  },
  {
    element: CardElement.Neutral,
    id: 68,
    level: 7,
    name: "Jumbo Cactuar",
    ranks: [8, 4, 8, 4]
  },
  {
    element: CardElement.Thunder,
    id: 69,
    level: 7,
    name: "Tri-Point",
    ranks: [8, 8, 5, 2]
  },
  {
    element: CardElement.Neutral,
    id: 70,
    level: 7,
    name: "Gargantua",
    ranks: [5, 8, 6, 6]
  },
  {
    element: CardElement.Neutral,
    id: 71,
    level: 7,
    name: "Mobile Type 8",
    ranks: [8, 3, 6, 7]
  },
  {
    element: CardElement.Neutral,
    id: 72,
    level: 7,
    name: "Sphinxara",
    ranks: [8, 8, 3, 5]
  },
  {
    element: CardElement.Neutral,
    id: 73,
    level: 7,
    name: "Tiamat",
    ranks: [8, 4, 8, 5]
  },
  {
    element: CardElement.Neutral,
    id: 74,
    level: 7,
    name: "BGH251F2",
    ranks: [5, 5, 7, 8]
  },
  {
    element: CardElement.Neutral,
    id: 75,
    level: 7,
    name: "Red Giant",
    ranks: [6, 7, 8, 4]
  },
  {
    element: CardElement.Neutral,
    id: 76,
    level: 7,
    name: "Catoblepas",
    ranks: [1, 7, 8, 7]
  },
  {
    element: CardElement.Neutral,
    id: 77,
    level: 7,
    name: "Ultima Weapon",
    ranks: [7, 8, 7, 2]
  },
  {
    element: CardElement.Neutral,
    id: 78,
    level: 8,
    name: "Chubby Chocobo",
    ranks: [4, 9, 4, 8]
  },
  {
    element: CardElement.Neutral,
    id: 79,
    level: 8,
    name: "Angelo",
    ranks: [9, 3, 6, 7]
  },
  {
    element: CardElement.Neutral,
    id: 80,
    level: 8,
    name: "Gilgamesh",
    ranks: [3, 6, 7, 9]
  },
  {
    element: CardElement.Neutral,
    id: 81,
    level: 8,
    name: "MiniMog",
    ranks: [9, 2, 3, 9]
  },
  {
    element: CardElement.Neutral,
    id: 82,
    level: 8,
    name: "Chicobo",
    ranks: [9, 4, 4, 8]
  },
  {
    element: CardElement.Thunder,
    id: 83,
    level: 8,
    name: "Quezacotl",
    ranks: [2, 4, 9, 9]
  },
  {
    element: CardElement.Ice,
    id: 84,
    level: 8,
    name: "Shiva",
    ranks: [6, 9, 7, 4]
  },
  {
    element: CardElement.Fire,
    id: 85,
    level: 8,
    name: "Ifrit",
    ranks: [9, 8, 6, 2]
  },
  {
    element: CardElement.Neutral,
    id: 86,
    level: 8,
    name: "Siren",
    ranks: [8, 2, 9, 6]
  },
  {
    element: CardElement.Earth,
    id: 87,
    level: 8,
    name: "Sacred",
    ranks: [5, 9, 1, 9]
  },
  {
    element: CardElement.Earth,
    id: 88,
    level: 8,
    name: "Minotaur",
    ranks: [9, 9, 5, 2]
  },
  {
    element: CardElement.Neutral,
    id: 89,
    level: 9,
    name: "Carbuncle",
    ranks: [8, 4, 4, 10]
  },
  {
    element: CardElement.Neutral,
    id: 90,
    level: 9,
    name: "Diablos",
    ranks: [5, 3, 10, 8]
  },
  {
    element: CardElement.Water,
    id: 91,
    level: 9,
    name: "Leviathan",
    ranks: [7, 7, 10, 1]
  },
  {
    element: CardElement.Neutral,
    id: 92,
    level: 9,
    name: "Odin",
    ranks: [8, 5, 10, 3]
  },
  {
    element: CardElement.Wind,
    id: 93,
    level: 9,
    name: "Pandemona",
    ranks: [10, 7, 1, 7]
  },
  {
    element: CardElement.Neutral,
    id: 94,
    level: 9,
    name: "Cerberus",
    ranks: [7, 10, 4, 6]
  },
  {
    element: CardElement.Holy,
    id: 95,
    level: 9,
    name: "Alexander",
    ranks: [9, 2, 10, 4]
  },
  {
    element: CardElement.Fire,
    id: 96,
    level: 9,
    name: "Phoenix",
    ranks: [7, 10, 2, 7]
  },
  {
    element: CardElement.Neutral,
    id: 97,
    level: 9,
    name: "Bahamut",
    ranks: [10, 6, 8, 2]
  },
  {
    element: CardElement.Poison,
    id: 98,
    level: 9,
    name: "Doomtrain",
    ranks: [3, 10, 1, 10]
  },
  {
    element: CardElement.Neutral,
    id: 99,
    level: 9,
    name: "Eden",
    ranks: [4, 10, 4, 9]
  },
  {
    element: CardElement.Neutral,
    id: 100,
    level: 10,
    name: "Ward",
    ranks: [10, 8, 7, 2]
  },
  {
    element: CardElement.Neutral,
    id: 101,
    level: 10,
    name: "Kiros",
    ranks: [6, 10, 7, 6]
  },
  {
    element: CardElement.Neutral,
    id: 102,
    level: 10,
    name: "Laguna",
    ranks: [5, 9, 10, 3]
  },
  {
    element: CardElement.Neutral,
    id: 103,
    level: 10,
    name: "Selphie",
    ranks: [10, 4, 8, 6]
  },
  {
    element: CardElement.Neutral,
    id: 104,
    level: 10,
    name: "Quistis",
    ranks: [9, 2, 6, 10]
  },
  {
    element: CardElement.Neutral,
    id: 105,
    level: 10,
    name: "Irvine",
    ranks: [2, 10, 6, 9]
  },
  {
    element: CardElement.Neutral,
    id: 106,
    level: 10,
    name: "Zell",
    ranks: [8, 6, 5, 10]
  },
  {
    element: CardElement.Neutral,
    id: 107,
    level: 10,
    name: "Rinoa",
    ranks: [4, 10, 10, 2]
  },
  {
    element: CardElement.Neutral,
    id: 108,
    level: 10,
    name: "Edea",
    ranks: [10, 3, 10, 3]
  },
  {
    element: CardElement.Neutral,
    id: 109,
    level: 10,
    name: "Seifer",
    ranks: [6, 4, 9, 10]
  },
  {
    element: CardElement.Neutral,
    id: 110,
    level: 10,
    name: "Squall",
    ranks: [10, 9, 4, 6]
  }
];

export default defaultCards;
