import React from 'react'
import CreateGame from '../components/playerLoginComponents/CreateGame'

interface Player {
    _id: string,
    username: string,
    wins: number,
    losses: number,
    ties: number
    rating: number,
    global_rank: number
}

interface Props {
    loggedInPlayer: Player
}

const GameSignon = ({ loggedInPlayer }: Props) => {
    return (
        <div>
            <CreateGame loggedInPlayer={loggedInPlayer} />
        </div>
    )
}

export default GameSignon