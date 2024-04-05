//imports
import Gameboard from "./classes/Gameboard";
import ClientDisplay from "./components/ClientDisplay";

export default function Home() {
  //in future versions, this could live in our database
  const mainBoard = new Gameboard()

  return (
    <main>
      <h1 className="text-4xl text-center">🌲 Virtual Koya 2.0 🌳</h1>
      <ClientDisplay />
    </main>
  );
}
