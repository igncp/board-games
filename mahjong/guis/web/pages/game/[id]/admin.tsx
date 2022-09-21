import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  SMGameStartedAdminPayload,
  SMNewAdminPayload,
  SMPlayersNumPayload,
  SocketMessage,
} from "../../../lib/socketMessages";
import { getPossibleMeldsInGameByDiscard } from "mahjong/dist/src/game";
import Tile from "../../../components/tile";

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

      socket.current = io();

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

      const payload: SMNewAdminPayload = { gameId };
      socket.current.emit(SocketMessage.NewAdmin, payload);
    })();
  }, [gameId]);

  return (
    <div>
      <div>This is the admin view</div>
      {playData && (
        <>
          <div>Players num: {playersNum}</div>
          <div>Player index: {playData.round.playerIndex}</div>
          <div style={{ border: "1px solid black" }}>
            <div>Possible melds:</div>
            <div>
              <div>
                {(() => {
                  const melds = getPossibleMeldsInGameByDiscard(playData);

                  return (
                    <div>
                      {melds?.map((meld, index) => (
                        <Fragment key={index}>
                          <div>
                            {
                              playData.players.find(
                                (p) => p.id === meld.playerId
                              ).name
                            }{" "}
                            {meld.discardTile && (
                              <span>
                                When discarding the tile:{" "}
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
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GameAdmin;
