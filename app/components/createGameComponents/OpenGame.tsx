import React from 'react'
import Link from 'next/link'
import Rating from './Rating'

interface Props {
    gameData: {
        Player_1_name: string,
        Player_1_Rating: number,
        Player_2_name: string,
        Player_2_Rating: number,
        Active: boolean
    }
}

const OpenGame = ({ gameData }: Props) => {
    //placeholder
    let gameID = Math.random() * 300
    return (
        <div className='p-3 bg-slate-700 m-2'>
            <div className='row flex'>
                <div className='w-1/2 px-4 py-2 rounded-md'>
                    <div className="w-24 rounded">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                        <div className='text-center'>
                            <p>{gameData.Player_1_name}</p>
                            <Rating rating={gameData.Player_1_Rating} />
                        </div>
                    </div>
                </div>
            </div>
            <Link className='btn w-full btn-primary' href={`/join-game/${gameID}`}>Start Game</Link>
        </div>
    )
}

export default OpenGame