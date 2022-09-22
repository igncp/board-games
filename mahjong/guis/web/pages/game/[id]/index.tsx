import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import hotkeys from "hotkeys-js";

import io from "socket.io-client";
import {
  SMClaimBoardTilePayload,
  SMCreateMeldPayload,
  SMDiscardTilePayload,
  SMDrawTilePayload,
  SMGameStartedPayload,
  SMMoveTurnPayload,
  SMNewPlayerPayload,
  SMPlayersNumPayload,
  SMSayMahjongPayload,
  SMSortHandPayload,
  SMStartGamePayload,
  SocketMessage,
} from "../../../lib/socketMessages";
import Tile from "../../../components/tile";
import { useUserId } from "../../../components/hooks/useUserId";

enum GameStatus {
  WAITING = "WAITING",
  STARTED = "STARTED",
}

// Temp workaround to handle HMR
let connected = false;

type ButtonProps = () => {
  onClick: () => void;
  disabled: boolean;
};
type PropsRef = {
  getDiscardProps: ButtonProps;
  getDrawProps: ButtonProps;
};

const Game = () => {
  const router = useRouter();
  const propsRef = useRef<PropsRef>({} as PropsRef);
  const [playersNum, setPlayersNum] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.WAITING);
  const [userId, setUserId] = useState<string | null>(null);
  const [playData, setPlayData] = useState<SMGameStartedPayload | null>(null);
  const [selectedHandTiles, setSelectedHandTiles] = useState<
    Record<string, boolean>
  >({});

  const socket = useRef(null);
  const gameId = router.query.id as string;

  useEffect(() => {
    if (playersNum === 4 && gameStatus === GameStatus.WAITING) {
      setGameStatus(GameStatus.STARTED);
      const payload: SMStartGamePayload = { gameId };
      socket.current.emit(SocketMessage.StartGame, payload);
    }
  }, [playersNum]);

  useUserId(setUserId);

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
      socket.current.emit(SocketMessage.DiscardTile, payload);
      setSelectedHandTiles({});
    },
  });
  propsRef.current.getDrawProps = () => ({
    disabled: !getIsCurrentRoundPlayer(),
    onClick: () => {
      const payload: SMDrawTilePayload = { gameId };
      socket.current.emit(SocketMessage.DrawTile, payload);
    },
  });

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

      return () => {
        hotkeys.unbind("d");
      };
    }
  }, [playData]);

  useEffect(() => {
    if (!gameId || !userId || connected) return;

    (async () => {
      connected = true;
      await fetch("/api/socket");

      socket.current = io();

      socket.current.on(
        SocketMessage.PlayersNum,
        ({ num }: SMPlayersNumPayload) => {
          setPlayersNum(num);
        }
      );

      socket.current.on(
        SocketMessage.GameStarted,
        (data: SMGameStartedPayload) => {
          console.log("[id].tsx: data", data);
          setPlayData(data);
        }
      );

      const payload: SMNewPlayerPayload = { gameId, userId };
      socket.current.emit(SocketMessage.NewPlayer, payload);
    })();
  }, [gameId]);

  return (
    <div className="container">
      <Head>
        <title>Mahjong - Game</title>
      </Head>
      <main>
        <h1>Mahjong</h1>
        {playersNum !== null && <p>Connected players: {playersNum} / 4</p>}
        {playData &&
          (() => {
            const playerIndex = getPlayerIndex();
            const isCurrentRoundPlayer = getIsCurrentRoundPlayer();

            const getPlayerTableName = (offset) => {
              const index = (playerIndex + offset) % 4;
              const name = offset === 0 ? "You" : playData.players[index].name;

              return [
                index === playData.game.round.playerIndex ? "*" : "",
                name,
              ]
                .filter(Boolean)
                .join(" ");
            };

            const setIdsSet = playData.game.hand.reduce((set, tile) => {
              if (tile.setId) set.add(tile.setId);
              return set;
            }, new Set<string>());
            const setIds = Array.from(setIdsSet);

            const discardProps = propsRef.current.getDiscardProps();
            const drawProps = propsRef.current.getDrawProps();

            return (
              <div>
                <p>
                  You are on index:{" "}
                  {playData.players.findIndex((p) => p.id === userId)}
                </p>
                <p>Score:</p>
                <ul>
                  {playData.players.map((p) => (
                    <li key={p.id}>
                      {p.name}: {playData.game.score[p.id]}
                    </li>
                  ))}
                </ul>
                {isCurrentRoundPlayer && (
                  <p>
                    <b>It is your turn</b>
                  </p>
                )}
                <div>
                  <table style={{ textAlign: "center" }}>
                    <tbody>
                      <tr>
                        <td></td>
                        <td>{getPlayerTableName(2)}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>{getPlayerTableName(3)}</td>
                        <td></td>
                        <td>{getPlayerTableName(1)}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>{getPlayerTableName(0)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <p>The board:</p>
                  <ul>
                    {playData.game.board.map((tileId) => {
                      const tile = playData.deck[tileId];

                      return (
                        <li
                          key={tile.id}
                          style={{ display: "inline-flex", width: 60 }}
                        >
                          <Tile tile={tile} />
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div style={{ border: "1px solid black" }}>
                  <p>Your hand: ({playData.game.hand.length})</p>
                  <ul>
                    {playData.game.hand
                      .filter((t) => !t.setId)
                      .map((handTile) => {
                        const tile = playData.deck[handTile.id];
                        return (
                          <li
                            key={tile.id}
                            style={{
                              display: "inline-flex",
                              width: 80,
                            }}
                            onClick={() => {
                              setSelectedHandTiles({
                                ...selectedHandTiles,
                                [tile.id]: !selectedHandTiles[tile.id],
                              });
                            }}
                          >
                            <Tile
                              tile={tile}
                              interactive
                              style={{
                                outline:
                                  "5px solid " +
                                  (selectedHandTiles[tile.id]
                                    ? "red"
                                    : "transparent"),
                              }}
                            />
                          </li>
                        );
                      })}
                  </ul>
                  {!!setIds.length && <p>Melds:</p>}
                  {setIds.map((setId) => {
                    const subHand = playData.game.hand.filter(
                      (t) => t.setId === setId
                    );
                    const tileStyle = {
                      display: "inline-flex",
                      width: 60,
                    };
                    return (
                      <ul key={setId}>
                        {subHand.map((handTile) => {
                          const tile = playData.deck[handTile.id];
                          return (
                            <li
                              key={tile.id}
                              style={{
                                ...tileStyle,
                                border:
                                  "5px solid " +
                                  (selectedHandTiles[tile.id]
                                    ? "red"
                                    : "transparent"),
                              }}
                            >
                              <Tile tile={tile} />
                            </li>
                          );
                        })}
                        <li style={tileStyle}>
                          {subHand[0].concealed ? "Concealed" : "Visible"}
                        </li>
                      </ul>
                    );
                  })}
                </div>
                <div>
                  <button
                    onClick={drawProps.onClick}
                    disabled={drawProps.disabled}
                  >
                    Draw
                  </button>
                  <button
                    disabled={discardProps.disabled}
                    onClick={discardProps.onClick}
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => {
                      const payload: SMSortHandPayload = { gameId };
                      socket.current.emit(SocketMessage.SortHand, payload);
                    }}
                  >
                    Sort hand
                  </button>
                  {isCurrentRoundPlayer && (
                    <button
                      onClick={() => {
                        const payload: SMMoveTurnPayload = { gameId };
                        socket.current.emit(SocketMessage.MoveTurn, payload);
                      }}
                    >
                      Move turn
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const payload: SMClaimBoardTilePayload = { gameId };
                      socket.current.emit(
                        SocketMessage.ClaimBoardTile,
                        payload
                      );
                    }}
                  >
                    Claim last tile
                  </button>
                  <button
                    disabled={Object.values(selectedHandTiles).length <= 2}
                    onClick={() => {
                      setSelectedHandTiles({});
                      const payload: SMCreateMeldPayload = {
                        gameId,
                        tilesIds: Object.keys(selectedHandTiles).map(Number),
                      };
                      socket.current.emit(SocketMessage.CreateMeld, payload);
                    }}
                  >
                    Create meld
                  </button>
                  <button
                    disabled={
                      playData.game.hand.filter((t) => !t.setId).length !== 2
                    }
                    onClick={() => {
                      setSelectedHandTiles({});
                      const payload: SMSayMahjongPayload = {
                        gameId,
                      };
                      socket.current.emit(SocketMessage.SayMahjong, payload);
                    }}
                  >
                    Say Mahjong
                  </button>
                </div>
              </div>
            );
          })()}
      </main>
    </div>
  );
};

export default Game;
