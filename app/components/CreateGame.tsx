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
    console.log('loggedin player: ' + loggedInPlayer.username)
    // our list of players from the database
    const [players, setPlayers] = useState<Player[]>([]);
    const [newGame, setNewGame] = useState<Game>()
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
        console.log("GAME SET: " + SelectedOpponent.username + " vs " + SelectedPlayer.username)
        //matches the inputs to the correct format for the move API
        setNewGame({
            Player1: SelectedPlayer,
            Player2: SelectedOpponent
        })
        //only updates relevant data feilds
        event.preventDefault();
        console.log(newGame)
        //send move to the API (MOVE TO ClientDisplay component?)
        const response = await fetch('http://localhost:3000/api/create-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGame),
        });
        if (!response.ok) {
            //bad response
        }
        else {
            // Handle successful response --> hit the refresher
            setRefresher((Math.random() * 50000))
        }

    };
    const handleChange = async (event: React.FormEvent<HTMLFormElement>) => {
        setNewGame({
            Player1: SelectedPlayer,
            Player2: SelectedOpponent
        })

    }

    return (
        <div>

            <div className='p-10'>
                <h1 className='text-2xl font-bold'>Select Opponent</h1>
                <form onSubmit={handleSubmit} onChange={handleChange}>
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