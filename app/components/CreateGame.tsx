'use client'
import React, { useEffect, useState } from 'react'
import DisplayPlayerList from './DisplayPlayerList'

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

const CreateGame = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/players'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch players');
                }
                const data = await response.json();
                setPlayers(data.players as Player[]); // Type assertion for clarity
            } catch (error) {
                console.error('Error fetching players:', error);
                // Handle errors appropriately (e.g., display error message)
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className='p-10'>
                <h1 className='text-2xl font-bold'> Players</h1>
                <DisplayPlayerList data={players} />
            </div>
        </div>
    )
}

export default CreateGame