'use client'
import React, { useContext, useEffect, useState } from 'react'
import { clientContext } from '../contexts/ClientMoveContext';

interface Move {
    MoveType: string; //options: move pieces, place piece seed, place piece desert, place piece koya
    Player: number; //options: 1 or 2
    TargetSpaceID: number; //options between 0 to (gameboard width)^2
}
interface Props {
    gameID: string
}

const UserMoveInput = ({ gameID }: Props) => {
    //useState for string or null
    const [selectedValue, setSelectedValue] = useState<string>("seed");
    const [selectedPlayer, setSelectedPlayer] = useState<string>('');

    //using Context
    const { ClientMove, setClientMove, setRefresher } = useContext(clientContext)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        setClientMove({ MoveType: event.target.value, Player: ClientMove.Player, TargetSpaceID: ClientMove.TargetSpaceID })
    };
    const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPlayer(event.target.value);
        setClientMove({ MoveType: ClientMove.MoveType, Player: parseInt(event.target.value), TargetSpaceID: ClientMove.TargetSpaceID })
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //prevents silly things
        event.preventDefault();
        //matches the inputs to the correct format for the move API
        const newMove = {
            MoveType: selectedValue,
            Player: parseInt(selectedPlayer),//need to convert to int
            TargetSpaceID: ClientMove.TargetSpaceID
        }
        //only updates relevant data feilds
        setClientMove({ MoveType: newMove.MoveType, Player: newMove.Player, TargetSpaceID: ClientMove.TargetSpaceID })
        event.preventDefault();
        //send move to the API (MOVE TO ClientDisplay component?)
        const response = await fetch(`http://localhost:3000/api/process-move-v2/${gameID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMove),
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
            <div id='move-display' className="flex flex-row justify-center gap-20">
                <form onSubmit={handleSubmit} className="flex align-middle flex-row gap-2">
                    <div>
                        <span className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Desert 🪨</span>
                                <input onChange={handleChange} type="radio" name="radio-10" value="D" className="radio checked:bg-orange-900" checked={selectedValue === 'D'} />
                            </label>
                        </span>
                        <span className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Seed 🌱</span>
                                <input onChange={handleChange} type="radio" name="radio-10" value="S" className="radio checked:bg-green-900" checked={selectedValue === 'S'} />
                            </label>
                        </span>
                    </div>
                    <div>
                        <span className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Player 1 🌳</span>
                                <input onChange={handleChange3} type="radio" name="radio-11" value={1} className="radio checked:bg-orange-300" checked={selectedPlayer === '1'} />
                            </label>
                        </span>
                        <span className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Player 2 🌲</span>
                                <input onChange={handleChange3} type="radio" name="radio-11" value={0} className="radio checked:bg-green-500" checked={selectedPlayer === '0'} />
                            </label>
                        </span>
                    </div>
                    <div className='align-middle'>
                        <button className='btn btn-primary btn-lg' type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserMoveInput