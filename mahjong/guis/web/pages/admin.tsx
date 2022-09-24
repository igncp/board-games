import Head from "next/head";
import { useState } from "react";
import GameSummaryComp from "../components/game-summary";
import { getGamesSummaries } from "../lib/api/db";
import { GameSummary } from "../lib/types";

type Props = {
  games: GameSummary[];
};

const AdminPage = ({ games }: Props) => {
  const [cachedGames, setCachedGames] = useState(games);

  return (
    <div className="container">
      <Head>
        <title>Mahjong Admin</title>
      </Head>

      <main>
        <h1>
          Mahjong Admin - <a href="/">Home</a>
        </h1>
        <ul>
          {cachedGames.map((game) => {
            return (
              <GameSummaryComp
                key={game.id}
                game={game}
                onGameUpdate={(newGame) => {
                  setCachedGames(
                    cachedGames.map((cachedGame) => {
                      return cachedGame.id === newGame.id
                        ? newGame
                        : cachedGame;
                    })
                  );
                }}
              />
            );
          })}
        </ul>
      </main>
    </div>
  );
};

export const getServerSideProps = async () => {
  const games = await getGamesSummaries();

  const props: Props = { games };

  return { props };
};

export default AdminPage;
