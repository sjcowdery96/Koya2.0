import React from 'react'
import OpenGame from './OpenGame';

interface Game {
    Player_1_name: string,
    Player_1_Rating: number,
    Player_2_name: string,
    Player_2_Rating: number,
    Active: boolean;
}

interface Props {
    data: Game[]
}

const JoinGameList = ({ data }: Props) => {
    return (
        <div>
            {data.map((game) => (
                !game.Active ? <OpenGame gameData={game} /> : null
            ))}
        </div>
    )
}

export default JoinGameList