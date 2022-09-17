import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import io from "socket.io-client";
import {
  SMDrawTilePayload,
  SMGameStartedPayload,
  SMNewPlayerPayload,
  SMPlayersNumPayload,
  SMSortHandPayload,
  SMStartGamePayload,
  SocketMessage,
} from "../../lib/socketMessages";
import { getTileImage } from "../../lib/images";

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
        {playData && (
          <div>
            <p>
              You are on index:{" "}
              {playData.players.findIndex((p) => p.id === userId)}
            </p>
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
              <button
                onClick={() => {
                  const payload: SMDrawTilePayload = { gameId };
                  socket.current.emit(SocketMessage.DrawTile, payload);
                }}
                disabled={
                  playData.game.round.playerIndex !==
                  playData.players.findIndex((p) => p.id === userId)
                }
              >
                Draw
              </button>
              <button
                onClick={() => {
                  const payload: SMSortHandPayload = { gameId };
                  socket.current.emit(SocketMessage.SortHand, payload);
                }}
              >
                Sort hand
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Game;
