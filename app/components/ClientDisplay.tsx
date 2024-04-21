'use client'
import UserMoveInput from './UserMoveInput'
import DisplayBoard from './DisplayBoard'
import ClientMoveProvider from '../contexts/ClientMoveContext'
import ScoreBoard from './ScoreBoard'
import React, { useState, useEffect } from 'react';
import { ObjectId } from 'mongoose'; // For handling ObjectIds
import GameResult from '../models/GameResult'
import axios from 'axios'

interface Props {
    gameID: string

}

const ClientDisplay = ({ gameID }: Props) => {
    const [liveGame, setLiveGame] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //need to figure out how to pull gamedata from mongoDB
    //useEffect ---> gameData

    useEffect(() => {
        //use Axios to fetch all data for that gameID
        //then render that data as needed
    })

    return (
        <div>
            <ClientMoveProvider>
                <h3 className='text-center'>Game: {gameID}</h3>
                <div>
                    <UserMoveInput />
                </div>
                <br />
                <div>
                    <DisplayBoard />
                </div>
                <div>
                    <ScoreBoard />
                </div>
            </ClientMoveProvider>
        </div>
    )
}

export default ClientDisplay