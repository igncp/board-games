import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import io from "socket.io-client";
import {
  SMClaimBoardTilePayload,
  SMDiscardTilePayload,
  SMDrawTilePayload,
  SMGameStartedPayload,
  SMMoveTurnPayload,
  SMNewPlayerPayload,
  SMPlayersNumPayload,
  SMSortHandPayload,
  SMStartGamePayload,
  SocketMessage,
} from "../../../lib/socketMessages";
import { getTileImage } from "../../../lib/images";

enum GameStatus {
  WAITING = "WAITING",
  STARTED = "STARTED",
}

// Temp workaround to handle HMR
let connected = false;

const Game = () => {
  const router = useRouter();
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

  useEffect(() => {
    const userId = (() => {
      const persited = sessionStorage.getItem("userId");
      if (persited) return persited;
      const newId = uuid().toString(36).substring(7);
      sessionStorage.setItem("userId", newId);
      return newId;
    })();

    setUserId(userId);
  }, []);

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
        <p>This is the game "{gameId}"</p>
        {playersNum !== null && <p>Connected players: {playersNum} / 4</p>}
        {userId !== null && <p>User: {userId}</p>}
        {playData &&
          (() => {
            const playerIndex = playData.players.findIndex(
              (p) => p.id === userId
            );

            const isCurrentRoundPlayer =
              playData.game.round.playerIndex === playerIndex;

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

            return (
              <div>
                <p>
                  You are on index:{" "}
                  {playData.players.findIndex((p) => p.id === userId)}
                </p>
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
                      const img = getTileImage(tile);

                      return (
                        <li
                          key={tile.id}
                          style={{ display: "inline-flex", width: 60 }}
                        >
                          {img ? (
                            <img
                              src={img}
                              style={{ maxWidth: 60 }}
                              title={JSON.stringify(tile)}
                            />
                          ) : (
                            JSON.stringify(tile)
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <p>Your hand: ({playData.game.hand.length})</p>
                  <ul>
                    {playData.game.hand.map((handTile) => {
                      const tile = playData.deck[handTile.id];
                      const img = getTileImage(tile);
                      return (
                        <li
                          key={tile.id}
                          style={{
                            display: "inline-flex",
                            width: 60,
                            border:
                              "5px solid " +
                              (selectedHandTiles[tile.id]
                                ? "red"
                                : "transparent"),
                          }}
                          onClick={() => {
                            setSelectedHandTiles({
                              ...selectedHandTiles,
                              [tile.id]: !selectedHandTiles[tile.id],
                            });
                          }}
                        >
                          {img ? (
                            <img
                              src={img}
                              style={{ maxWidth: 60 }}
                              title={JSON.stringify(tile)}
                            />
                          ) : (
                            JSON.stringify(tile)
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <button
                    onClick={() => {
                      const payload: SMDrawTilePayload = { gameId };
                      socket.current.emit(SocketMessage.DrawTile, payload);
                    }}
                    disabled={!isCurrentRoundPlayer}
                  >
                    Draw
                  </button>
                  <button
                    disabled={
                      Object.keys(selectedHandTiles).filter((tileId) => {
                        return selectedHandTiles[tileId];
                      }).length !== 1
                    }
                    onClick={() => {
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
                    }}
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
                </div>
              </div>
            );
          })()}
      </main>
    </div>
  );
};

export default Game;
