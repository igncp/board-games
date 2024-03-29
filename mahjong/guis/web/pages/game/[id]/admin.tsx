import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  SMGameStartedAdminPayload,
  SMPlayersNumPayload,
  SocketMessage,
} from "../../../lib/socketMessages";
import { getPossibleMeldsInGameByDiscard } from "mahjong/dist/src/game";
import Tile from "../../../components/tile";
import TilesList from "../../../components/tiles-list";

// Temp workaround to handle HMR
let connected = false;

const GameAdmin = () => {
  const router = useRouter();
  const socket = useRef(null);
  const gameId = router.query.id as string;

  const [playersNum, setPlayersNum] = useState<number | null>(null);
  const [playData, setPlayData] = useState<SMGameStartedAdminPayload | null>(
    null
  );

  useEffect(() => {
    if (!gameId || connected) return;

    (async () => {
      connected = true;
      await fetch("/api/socket");

      socket.current = io({
        query: { gameId, isAdmin: true },
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 10,
      });

      socket.current.on(
        SocketMessage.PlayersNum,
        ({ num }: SMPlayersNumPayload) => {
          setPlayersNum(num);
        }
      );

      socket.current.on(
        SocketMessage.GameStartedAdmin,
        (data: SMGameStartedAdminPayload) => {
          console.log("[id].tsx: data", data);
          setPlayData(data);
        }
      );
    })();
  }, [gameId]);

  return (
    <div>
      <div>This is the admin view</div>
      {playData && (
        <>
          <div>Players num: {playersNum}</div>
          <div>Player index: {playData.round.playerIndex}</div>
          <details>
            <summary>Wall</summary>
            <TilesList
              tiles={playData.table.drawWall.slice().reverse()}
              deck={playData.deck}
            />
          </details>
          <div style={{ border: "1px solid black" }}>
            {(() => {
              const melds = getPossibleMeldsInGameByDiscard(playData);
              const playerWith14Tiles = playData.players.find(
                (p) => playData.table.hands[p.id].length === 14
              );

              return (
                <>
                  <div>{melds.length ? "Possible melds:" : "No melds"}</div>
                  <div>
                    {melds?.map((meld, index) => (
                      <Fragment key={index}>
                        <div>
                          {
                            playData.players.find((p) => p.id === meld.playerId)
                              .name
                          }{" "}
                          {meld.discardTile && (
                            <span>
                              when {playerWith14Tiles.name} discards the tile:{" "}
                              <Tile tile={playData.deck[meld.discardTile]} />
                            </span>
                          )}
                        </div>
                        <div>
                          {meld.tiles.map((t) => {
                            const tile = playData.deck[t];

                            return <Tile tile={tile} key={tile.id} />;
                          })}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
};

export default GameAdmin;
