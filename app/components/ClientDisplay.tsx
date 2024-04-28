'use client'
import UserMoveInput from './UserMoveInput'
import DisplayBoard from './DisplayBoard'
import ClientMoveProvider from '../contexts/ClientMoveContext'
import ScoreBoard from './ScoreBoard'
import React, { useState, useEffect } from 'react';

interface Props {
    gameID: string
}

const ClientDisplay = ({ gameID }: Props) => {
    //grabs the game data
    const fetchdata = async () => {
        const response = await fetch(`http://localhost:3000/api/process-move-v2/${gameID}`);
        //extract gameData from the database
        const { gameData } = await response.json()
    }

    useEffect(() => {
        fetchdata()
    }, [])

    return (
        <div>
            <ClientMoveProvider>
                <h3>{gameID}</h3>
                <div>
                    <UserMoveInput gameID={gameID} />
                </div>
                <br />
                <div>
                    <DisplayBoard gameID={gameID} />
                </div>
                <div>
                    <ScoreBoard gameID={gameID} />
                </div>
            </ClientMoveProvider>
        </div>
    )
}

export default ClientDisplay