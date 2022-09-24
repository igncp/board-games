import Head from "next/head";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";

const Home = () => {
  const router = useRouter();

  const onClick = () => {
    router.push("/game/" + uuid());
  };

  return (
    <div className="container">
      <Head>
        <title>Mahjong</title>
      </Head>

      <main>
        <h1>Mahjong</h1>
        <div>
          <div>
            <a href="/admin">Admin</a>
          </div>
          <div style={{ cursor: "pointer" }} onClick={onClick}>
            Create a custom game
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
