//imports
import ClientDisplay from "./components/ClientDisplay";
import UserLogin from "./components/UserLogin";

export default function Home() {
  return (
    <main>
      <h1 className="text-4xl text-center">🌲 Virtual Koya 2.0 🌳</h1>
      <UserLogin />
    </main>
  );
}
