import React from 'react'

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
    player: Player
}

const PlayerItemDisplay = ({ player }: Props) => {
    return (
        < tr >
            <th>
                <label>
                    <input type="checkbox" className="checkbox" />
                </label>
            </th>
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcWYPmrkFbuZtUaULMonVtKBkygj7WXWU-_H3qgjWT-FlpQxPj9pLqcbbxETTFSVrpVGc&usqp=CAU" alt="Avatar Tailwind CSS Component" />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{player.username}</div>
                        <div className="text-sm opacity-50">{player.rating}</div>
                    </div>
                </div>
            </td>
            <td>
                {player.wins} / {player.losses} / {player.ties}
                <br />
                <span className="badge badge-ghost badge-sm">#{player.global_rank} Worldwide</span>
            </td>
        </tr >
    )
}

export default PlayerItemDisplay