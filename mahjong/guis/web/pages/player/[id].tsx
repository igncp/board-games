import Head from "next/head";
import { useRouter } from "next/router";
import { useSetUserId } from "../../components/hooks/useUserId";
import { getGamesSummaries } from "../../lib/api/db";
import { GameSummary } from "../../lib/types";
import { v4 as uuid } from "uuid";

type Props = {
  games: GameSummary[];
  newGameId: string;
};

const Player = ({ games, newGameId }: Props) => {
  const { id } = useRouter().query;

  useSetUserId(id as string);

  const playerName =
    games[0]?.players.find((player) => player.id === id)?.name || "Not found";

  return (
    <div className="container">
      <Head>
        <title>Mahjong Player</title>
      </Head>

      <main>
        <h1>
          Mahjong Player - <a href="/">Home</a>
        </h1>
        <p>Player: {playerName}</p>
        <ul>
          {games.map((game) => {
            return (
              <li key={game.id}>
                {game.name} -{" "}
                <a href={`/game/${game.id}`}>
                  <span>{game.id}</span>
                </a>
              </li>
            );
          })}
          <li>
            <a href={"/game/" + newGameId}>
              <span>New Game</span>
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
};

export const getServerSideProps = async ({ query }) => {
  const games = await getGamesSummaries(query.id);
  const newGameId = uuid();

  const props: Props = { games, newGameId };

  return { props };
};

export default Player;
