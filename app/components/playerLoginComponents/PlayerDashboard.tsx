'use client'
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import Rating from "../createGameComponents/Rating";

interface Props {
    playerEmail: string | null | undefined,
    playerUserName: string | null | undefined,
    playerImage: string | null | undefined,
}
interface Player {
    _id: string,
    username: string,
    wins: number,
    losses: number,
    ties: number
    rating: number,
    global_rank: number
}

const PlayerDashboard = ({ playerImage, playerEmail, playerUserName }: Props) => {
    const [playerData, setPlayerData] = useState<Player>()
    const { status, data: session } = useSession()

    useEffect(() => {
        console.log(session?.user)
        const player = {
            email: playerEmail,
            username: playerUserName
        }
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/players-v2', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(player),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch players');
                }
                const data = await response.json();
                console.log(data)
                //need to parse this data out to put it into a table.
                setPlayerData(data.returnedPlayer)

            } catch (error) {
                console.error('Error fetching players:', error);
                // Handle errors appropriately (e.g., display error message)
            }
        };
        //get the data
        fetchData();
    }, [])

    return (
        <div className="flex p-5 m-3 align-middle justify-center">
            {status === 'loading' &&
                <div> Loading... </div>
            }
            {status === 'authenticated' &&
                <div className="card w-96 bg-base-100 shadow-xl">
                    <figure className="px-10 pt-10">
                        <img src={session.user?.image!} alt="avatar" className="rounded-2xl" />
                    </figure>
                    <div className="card-body items-center text-center">
                        <h2 className="card-title">{playerUserName}</h2>
                        <div className="stats stats-vertical shadow">

                            <div className="stat">
                                <div className="stat-title">Global Rank</div>
                                <div className="stat-value">{playerData?.global_rank}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Record</div>
                                <div className="stat-value">{playerData?.wins}/{playerData?.losses}/{playerData?.ties}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Rating</div>
                                <Rating rating={playerData?.rating!} />
                            </div>

                        </div>
                        <div className="card-actions">
                            <span className='m-2'><Link className="btn btn-primary" href='/create-game'>View Active Games</Link></span>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default PlayerDashboard