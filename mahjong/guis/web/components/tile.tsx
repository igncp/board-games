import { Tile } from "mahjong/dist/src/core";
import { CSSProperties } from "react";
import { getTileImage } from "../lib/images";
import { useHover } from "./hooks/useHover";

type Props = {
  interactive?: boolean;
  style?: CSSProperties;
  tile: Tile;
};

const Tile = ({ tile, interactive, style = {} }: Props) => {
  const src = getTileImage(tile);
  const [ref, isHovered] = useHover<HTMLImageElement>();

  return (
    <img
      style={{
        maxHeight: 80,
        ...(interactive && isHovered && { transform: "translateY(-10px)" }),
        transition: "transform 0.2s ease-in-out",
        ...style,
      }}
      ref={ref}
      src={src}
    />
  );
};

export default Tile;
