import React, { useContext, useState } from 'react'
import { playerContext } from '../contexts/AddPlayerContext';

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

interface FormPlayer {
    selectedValue: string;
}

const PlayerItemDisplay = ({ player }: Props) => {
    //const [formPlayerUsername, setFormPlayer] = useState<Player>(player);
    //using Context
    const { SelectedPlayer, SelectedOpponent, setSelectedOpponent } = useContext(playerContext)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //set local state and global context
        //setFormPlayer({ ...formPlayerUsername, Player: event.target.value });
        setSelectedOpponent({ username: player.username, _id: player._id, rating: player.rating, wins: player.wins, losses: player.losses, ties: player.ties, global_rank: player.global_rank })
        console.log("player: " + SelectedPlayer.username)
        console.log("opponent: " + SelectedOpponent.username)

    };

    return (
        < tr >
            <th>
                <label>
                    <input onChange={handleChange} type="radio" className="radio radio-primary" value={player.username} checked={SelectedOpponent.username === player.username} />
                </label>
            </th>
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Avatar Tailwind CSS Component" />
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