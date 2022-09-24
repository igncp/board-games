import React from "react";
import { Deck, Tile } from "mahjong/dist/src/core";
import TileComponent from "./tile";

type Props = {
  tiles: Tile["id"][];
  deck: Deck;
};

const TilesList = ({ tiles, deck }: Props) => {
  return (
    <ul>
      {tiles.map((tileId) => {
        const tile = deck[tileId];

        return (
          <li key={tile.id} style={{ display: "inline-flex", width: 60 }}>
            <TileComponent tile={tile} />
          </li>
        );
      })}
    </ul>
  );
};

export default TilesList;
