import React from 'react'
import ActiveGame from '../components/createGameComponents/ActiveGame'
import OpenGame from '../components/createGameComponents/OpenGame'
import GameList from '../components/createGameComponents/GameList'
import { games } from '../DummyData/Games'
import JoinGameList from '../components/createGameComponents/JoinGameList'


const GameSignon = () => {
    //fetch games from Database:
    return (
        <div className='container mx-auto flex flex-row gap-20 justify-center items-top h-screen' >
            <div className='text-center p-3'>
                <h2 className='text-2xl'>Active Games</h2>
                <GameList data={games} />
            </div>
            <div className='text-center p-3'>
                <h2 className='text-2xl'>Opponents</h2>
                <JoinGameList data={games} />
            </div>
        </div>
    )
}

export default GameSignon