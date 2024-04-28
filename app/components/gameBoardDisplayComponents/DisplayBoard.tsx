'use client'
import React, { useEffect, useState, useContext } from 'react'
import DisplaySpace from './DisplaySpace'
import Space from '../../classes/Space';
import { clientContext } from '../../contexts/ClientMoveContext';
//props to know what type is incoming
interface BoardDatas {
    gameData: {
        Spaces: Space[];
    }
}
interface Props {
    gameID: string
}
//pass in spaces array from gameboard
const DisplayBoard = ({ gameID }: Props) => {
    //use context refresher to trigger re-render of the board
    const { Refresher } = useContext(clientContext)
    //create a variable to hold the render state of the board
    const [boardData, setBoardData] = useState<BoardDatas>()
    //method for fetching boardData
    const fetchData = async () => {
        const response = await fetch(`http://localhost:3000/api/process-move-v2/${gameID}`);
        const gameData = await response.json()
        setBoardData(gameData)
        //console.log(gameData.gameData)
    }

    //runs twice
    useEffect(() => {
        fetchData()
    }, [Refresher])

    //check for data before rendering
    if (boardData) {
        //use map function to define new display
        const mappedBoard = boardData.gameData.Spaces.map((space) => {
            return (
                <DisplaySpace key={space.spaceID} pieces={space.Pieces} id={space.spaceID} />
            )
        })
        return (
            <div className={"grid gap-1 grid-cols-9" + " bg-slate-600"}>
                {mappedBoard}
            </div>
        )
    }
    else {
        return (
            <div className={"grid gap-1 grid-cols-" + 9 + " bg-slate-600"}>
                <h1>Loading...</h1>
            </div>
        )
    }

}

export default DisplayBoard