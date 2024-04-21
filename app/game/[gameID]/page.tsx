import ClientDisplay from "../../components/ClientDisplay";

//interface for the ID passing in through URL
interface Props {
    params: { gameID: string }
}

export default function Game({ params: { gameID } }: Props) {
    return (
        <main>
            <h1 className="text-4xl text-center">🌲 Virtual Koya 2.0 🌳</h1>
            <ClientDisplay gameID={gameID} />

        </main>
    );
}