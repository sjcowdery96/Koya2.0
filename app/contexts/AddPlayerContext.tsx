import React, { ReactNode, useState, createContext, Dispatch, SetStateAction } from 'react'

interface Player {
    _id: string,
    username: string,
    wins: number,
    losses: number,
    ties: number,
    rating: number,
    global_rank: number
}

export interface PlayerContextInterface {
    SelectedPlayer: Player,
    SelectedOpponent: Player,
    Refresher: number,
    setSelectedPlayer: Dispatch<SetStateAction<Player>>,
    setSelectedOpponent: Dispatch<SetStateAction<Player>>,
    setSelectedOpponentUsername: Dispatch<SetStateAction<string>>,
    setSelectedPlayerUsername: Dispatch<SetStateAction<string>>,
    setRefresher: Dispatch<SetStateAction<number>>

}
//empty default state
const defaultState = {
    SelectedPlayer: {
        _id: 'DEFAULT-P',
        username: 'default-player',
        wins: 0,
        losses: 0,
        ties: 0,
        rating: 0,
        global_rank: -1,
    },
    SelectedOpponent: {
        _id: 'DEFAULT-O',
        username: 'default-opponent',
        wins: 0,
        losses: 0,
        ties: 0,
        rating: 0,
        global_rank: -1,
    },
    Refresher: 0,
    setSelectedPlayer: (selectedPlayer: Player) => {
    },
    setSelectedOpponent: (selectedOpponent: Player) => {
    },
    setSelectedOpponentUsername: (selctedOpponentUsername: string) => {
    },
    setSelectedPlayerUsername: (selctedPlayerUsername: string) => {
    },
    setRefresher: (refresh: number) => {
    }

} as PlayerContextInterface
//creates the whole referenceable context for holding all functions and variables
export const playerContext = createContext(defaultState);

type UserProvideProps = {
    children: ReactNode
}

export default function SetPlayer({ children }: UserProvideProps) {
    const [Refresher, setRefresher] = useState<number>(0)
    const [SelectedOpponentUsername, setSelectedOpponentUsername] = useState<string>('')
    const [SelectedPlayerUsername, setSelectedPlayerUsername] = useState<string>('')
    const [SelectedPlayer, setSelectedPlayer] = useState<Player>({
        _id: '',
        username: '',
        wins: 0,
        losses: 0,
        ties: 0,
        rating: -1,
        global_rank: -1
    })
    const [SelectedOpponent, setSelectedOpponent] = useState<Player>({
        _id: '',
        username: '',
        wins: 0,
        losses: 0,
        ties: 0,
        rating: -1,
        global_rank: -1
    })

    return (
        <playerContext.Provider value={{ SelectedOpponent, setSelectedPlayerUsername, setSelectedOpponentUsername, setSelectedOpponent, SelectedPlayer, Refresher, setSelectedPlayer, setRefresher }}>
            {children}
        </playerContext.Provider>
    )
}


