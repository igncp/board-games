import { useEffect, useRef, useState } from "react";
import hotkeys from "hotkeys-js";

import {
  SMBreakMeldPayload,
  SMClaimBoardTilePayload,
  SMCreateMeldPayload,
  SMDiscardTilePayload,
  SMDrawTilePayload,
  SMGameStartedPayload,
  SMMoveTurnPayload,
  SMSayMahjongPayload,
  SMSortHandPayload,
  SocketMessage,
} from "../../lib/socketMessages";
import { Game, HandTile, Tile } from "mahjong/dist/src/core";
import { Socket } from "socket.io";

type ButtonProps = () => {
  onClick: () => void;
  disabled: boolean;
};

type PropsRef = {
  getClaimTileProps: ButtonProps;
  getCreateMeldProps: ButtonProps;
  getDiscardProps: ButtonProps;
  getDrawProps: ButtonProps;
  getNextTurnProps: ButtonProps;
  getSayMahjongProps: ButtonProps;
  getSortHandProps: ButtonProps;
  onBreakMeld: (setId: HandTile["setId"]) => void;
  onTileClick: (tileId: Tile["id"]) => void;
};

export const selectTileKeys = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "w",
  "e",
  "r",
];

export const useGameControls = ({
  gameId,
  playData,
  userId,
  socket,
}: {
  gameId: Game["id"];
  playData: SMGameStartedPayload | null;
  userId: string | null;
  socket: Socket;
}) => {
  const propsRef = useRef<PropsRef>({} as PropsRef);
  const [selectedHandTiles, setSelectedHandTiles] = useState<
    Record<string, boolean>
  >({});

  const getPlayerIndex = () =>
    playData.players.findIndex((p) => p.id === userId);
  const getIsCurrentRoundPlayer = () =>
    playData.game.round.playerIndex === getPlayerIndex();

  propsRef.current.getDiscardProps = () => ({
    disabled:
      Object.keys(selectedHandTiles).filter((tileId) => {
        return selectedHandTiles[tileId];
      }).length !== 1 || playData.game.hand.length < 14,
    onClick: () => {
      const payload: SMDiscardTilePayload = {
        gameId,
        tileId: Number(
          Object.keys(selectedHandTiles).find((tileId) => {
            return selectedHandTiles[tileId];
          })
        ),
      };
      socket.emit(SocketMessage.DiscardTile, payload);
      setSelectedHandTiles({});
    },
  });

  propsRef.current.getDrawProps = () => ({
    disabled: !getIsCurrentRoundPlayer(),
    onClick: () => {
      const payload: SMDrawTilePayload = { gameId };
      socket.emit(SocketMessage.DrawTile, payload);
    },
  });

  propsRef.current.getNextTurnProps = () => ({
    disabled: false,
    onClick: () => {
      const payload: SMMoveTurnPayload = { gameId };
      socket.emit(SocketMessage.MoveTurn, payload);
    },
  });

  propsRef.current.getClaimTileProps = () => ({
    disabled: false,
    onClick: () => {
      const payload: SMClaimBoardTilePayload = { gameId };
      socket.emit(SocketMessage.ClaimBoardTile, payload);
    },
  });

  propsRef.current.getCreateMeldProps = () => ({
    disabled: Object.values(selectedHandTiles).length <= 2,
    onClick: () => {
      setSelectedHandTiles({});
      const payload: SMCreateMeldPayload = {
        gameId,
        tilesIds: Object.keys(selectedHandTiles).map(Number),
      };
      socket.emit(SocketMessage.CreateMeld, payload);
    },
  });

  propsRef.current.getSayMahjongProps = () => ({
    disabled: playData.game.hand.filter((t) => !t.setId).length !== 2,
    onClick: () => {
      setSelectedHandTiles({});
      const payload: SMSayMahjongPayload = {
        gameId,
      };
      socket.emit(SocketMessage.SayMahjong, payload);
    },
  });

  propsRef.current.getSortHandProps = () => ({
    disabled: false,
    onClick: () => {
      const payload: SMSortHandPayload = { gameId };
      socket.emit(SocketMessage.SortHand, payload);
    },
  });

  propsRef.current.onTileClick = (tileId: Tile["id"]) => {
    setSelectedHandTiles({
      ...selectedHandTiles,
      [tileId]: !selectedHandTiles[tileId],
    });
  };

  propsRef.current.onBreakMeld = (setId: HandTile["setId"]) => {
    const payload: SMBreakMeldPayload = { gameId, setId };
    socket.emit(SocketMessage.BreakMeld, payload);
  };

  useEffect(() => {
    if (playData) {
      hotkeys("d", () => {
        const discardProps = propsRef.current.getDiscardProps();
        if (!discardProps.disabled) {
          discardProps.onClick();
          return;
        }
        const drawProps = propsRef.current.getDrawProps();
        drawProps.onClick();
      });

      hotkeys("t", () => {
        const nextTurnProps = propsRef.current.getNextTurnProps();
        if (!nextTurnProps.disabled) {
          nextTurnProps.onClick();
        }
      });

      hotkeys("c", () => {
        const claimTileProps = propsRef.current.getClaimTileProps();
        if (!claimTileProps.disabled) {
          claimTileProps.onClick();
        }
      });

      hotkeys("m", () => {
        const sayMahjongProps = propsRef.current.getSayMahjongProps();
        if (!sayMahjongProps.disabled) {
          sayMahjongProps.onClick();
          return;
        }

        const createMeldProps = propsRef.current.getCreateMeldProps();
        if (!createMeldProps.disabled) {
          createMeldProps.onClick();
        }
      });

      hotkeys("s", () => {
        const sortHandProps = propsRef.current.getSortHandProps();

        if (!sortHandProps.disabled) {
          sortHandProps.onClick();
        }
      });

      selectTileKeys.forEach((key) => {
        hotkeys(key, () => {
          const keyIndex = selectTileKeys.indexOf(key);
          const tile = playData.game.hand.filter((h) => !h.setId)[keyIndex];
          if (tile) {
            propsRef.current.onTileClick(tile.id);
          }
        });
      });

      return () => {
        hotkeys.unbind("c");
        hotkeys.unbind("d");
        hotkeys.unbind("m");
        hotkeys.unbind("s");
        hotkeys.unbind("t");
        selectTileKeys.forEach((key) => {
          hotkeys.unbind(key);
        });
      };
    }
  }, [playData]);

  return {
    propsRef,
    getPlayerIndex,
    getIsCurrentRoundPlayer,
    selectedHandTiles,
  };
};
