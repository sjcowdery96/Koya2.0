'use client'
import React, { useEffect, useState, useContext } from 'react'
import DisplayPlayerList from './DisplayPlayerList'
import { playerContext } from '../contexts/AddPlayerContext';

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

interface Game {
    Player1: Player,
    Player2: Player
}
interface Props {
    loggedInPlayer: Player
}

const CreateGame = ({ loggedInPlayer }: Props) => {
    // our list of players from the database
    const [players, setPlayers] = useState<Player[]>([]);
    //using Context
    const { SelectedOpponent, SelectedPlayer, setSelectedPlayer, setSelectedOpponent, setRefresher, Refresher } = useContext(playerContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/players');
                if (!response.ok) {
                    throw new Error('Failed to fetch players');
                }
                const data = await response.json();
                //set default opponent
                const dp: Player = data.players[0]
                setSelectedOpponent({ _id: dp._id, username: dp.username, rating: dp.rating, wins: dp.wins, losses: dp.losses, ties: dp.ties, global_rank: dp.global_rank })
                //need to "filter" the actual input player from their opponent list
                const Opponents = data.players.filter((player: Player) => player.username !== loggedInPlayer.username)
                setPlayers(Opponents as Player[]); // Type assertion for clarity
            } catch (error) {
                console.error('Error fetching players:', error);
                // Handle errors appropriately (e.g., display error message)
            }
        };
        fetchData();
    }, [Refresher]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //prevents silly things
        event.preventDefault();
        //reads out players from context
        console.log("GAME SET: " + SelectedOpponent.username + " vs " + SelectedPlayer.username)
        //send game to API
        const response = await fetch('http://localhost:3000/api/create-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Player1: SelectedPlayer, Player2: SelectedOpponent }),
        });
        if (!response.ok) {
            //bad response
        }
        else {
            // Handle successful response --> hit the refresher
            setRefresher((Math.random() * 50000))
        }

    };

    return (
        <div>

            <div className='p-10'>
                <h1 className='text-3xl font-bold'>{SelectedPlayer.username}</h1>
                <h1 className='text-xl font-bold'> Selected Opponent: {SelectedOpponent.username}</h1>
                <form onSubmit={handleSubmit}>
                    <DisplayPlayerList data={players} />
                    <button type="submit" className="btn btn-active btn-primary">Submit</button>
                </form>
            </div>
            <div>

            </div>

        </div>
    )
}

export default CreateGame