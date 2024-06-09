//UNUSED COMPONENT --> replaced by Google Sign In
//Might be useful for "leaderboard"

import React from 'react'
import PlayerItemDisplay from './PlayerItemDisplay'
//player model
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
    data: Player[]
}


const DisplayPlayerList = ({ data: playerData }: Props) => {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th>
                        </th>
                        <th>Username</th>
                        <th>Record</th>
                    </tr>
                </thead>
                <tbody>
                    {playerData ?
                        playerData.map((player) => {
                            return (
                                <PlayerItemDisplay key={player._id} player={player} />
                            )
                        }) :
                        <p>Players...</p>}
                </tbody>
                {/* foot */}
                <tfoot>
                    <tr>
                        <th></th>
                        <th>Username</th>
                        <th>Record</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default DisplayPlayerList