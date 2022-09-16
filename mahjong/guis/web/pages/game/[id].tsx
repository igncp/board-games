import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import io from "socket.io-client";
import {
  SMGameStartedPayload,
  SMNewPlayerPayload,
  SMPlayersNumPayload,
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
  const [initGameData, setInitGameData] = useState<SMGameStartedPayload | null>(
    null
  );

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
          setInitGameData(data);
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
        {initGameData && (
          <div>
            <p>
              You are on index:{" "}
              {initGameData.players.findIndex((p) => p.id === userId)}
            </p>
            <div>
              <p>Your hand:</p>
              <ul>
                {initGameData.game.hand.map((handTile) => {
                  const tile = initGameData.deck[handTile.id];
                  const img = getTileImage(tile);
                  return (
                    <li key={tile.id}>
                      {img ? (
                        <img src={img} style={{ maxWidth: 60 }} />
                      ) : (
                        JSON.stringify(tile)
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Game;
