import React, { useContext, useEffect, useState } from 'react'
import { clientContext } from '../../contexts/ClientMoveContext'

interface GameDataDisplay {
    P1Score: number,
    P2Score: number,
    P1SeedBank: number,
    P2SeedBank: number,
    //supply
    P1SeedSupply: number,
    P2SeedSupply: number,
    P1DesertSupply: number,
    P2DesertSupply: number,

}
interface Props {
    gameID: string
}
const ScoreBoard = ({ gameID }: Props) => {
    //initialize scoreboard
    const [myGameData, setMyGameData] = useState<GameDataDisplay>({
        P1Score: 0,
        P2Score: 0,
        P1SeedBank: 0,
        P2SeedBank: 0,
        //supply
        P1SeedSupply: 36,
        P2SeedSupply: 36,
        P1DesertSupply: 4,
        P2DesertSupply: 4,
    })
    //use context refresher to trigger re-render of the board
    const { Refresher } = useContext(clientContext)
    //method for fetching boardData
    const fetchData = async () => {
        const response = await fetch(`http://localhost:3000/api/process-move-v2/${gameID}`);
        //extract scoreboard data and seed stack data from the response
        const { gameData } = await response.json()
        //assign variables 
        setMyGameData({
            P1DesertSupply: gameData.P1DesertStack.length,
            P2DesertSupply: gameData.P2DesertStack.length,
            P1SeedSupply: gameData.P1SeedStack.length,
            P2SeedSupply: gameData.P2SeedStack.length,
            P1Score: gameData.Scoreboard[0],
            P2Score: gameData.Scoreboard[1],
            P1SeedBank: gameData.Scoreboard[2],
            P2SeedBank: gameData.Scoreboard[3],
        })
    }
    //runs twice
    useEffect(() => {
        fetchData()
    }, [Refresher])

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Score</th>
                            <th>Seed Bank</th>
                            <th>Seeds</th>
                            <th>Deserts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr className="hover">
                            <th>Player 1</th>
                            <td>{myGameData.P1Score}</td>
                            <td>{myGameData.P1SeedBank}</td>
                            <td>{myGameData.P1SeedSupply}</td>
                            <td>{myGameData.P1DesertSupply}</td>
                        </tr>
                        {/* row 2 */}
                        <tr className="hover">
                            <th>Player 2</th>
                            <td>{myGameData.P2Score}</td>
                            <td>{myGameData.P2SeedBank}</td>
                            <td>{myGameData.P2SeedSupply}</td>
                            <td>{myGameData.P2DesertSupply}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default ScoreBoard