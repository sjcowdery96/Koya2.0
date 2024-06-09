import React from 'react'
import ActiveGame from './ActiveGame';

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

const ActiveGameList = ({ data }: Props) => {
    return (
        <div>
            {data.map((game) => (
                game.Active ? <ActiveGame gameData={game} /> : null
            ))}
        </div>
    )
}

export default ActiveGameList