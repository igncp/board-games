import { Tile } from "mahjong/dist/src/core";
import { getTileImage } from "../lib/images";

type Props = {
  tile: Tile;
};

const Tile = ({ tile }: Props) => {
  const src = getTileImage(tile);

  return <img style={{ maxHeight: 80 }} src={src} />;
};

export default Tile;
