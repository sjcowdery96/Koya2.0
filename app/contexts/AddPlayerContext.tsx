import React, { ReactNode, useState, createContext, Dispatch, SetStateAction } from 'react'

interface Player {
    _id: string,
    username: string,
    password: string,
    record: {
        wins: number,
        losses: number,
        ties: number
    },
    rating: number
}

export interface MoveContextInterface {
    SelectedPlayer: Player,
    SelectedOpponent: Player,
    Refresher: number,
    setSelectedPlayer: Dispatch<SetStateAction<Player>>
    setSelectedOpponent: Dispatch<SetStateAction<Player>>
    setRefresher: Dispatch<SetStateAction<number>>

}
//empty default state
const defaultState = {
    SelectedPlayer: {
        _id: 'anything',
        username: 'string',
        password: 'string',
        record: {
            wins: 0,
            losses: 0,
            ties: 0
        },
        rating: 0
    },
    Refresher: 0,
    setSelectedPlayer: (selectedPlayer: Player) => {
    },
    setSelectedOpponent: (selectedOpponent: Player) => {
    },
    setRefresher: (refresh: number) => {
    }

} as MoveContextInterface

export const playerContext = createContext(defaultState);

type UserProvideProps = {
    children: ReactNode
}

export default function ClientDisplay({ children }: UserProvideProps) {
    const [Refresher, setRefresher] = useState<number>(0)
    const [SelectedPlayer, setSelectedPlayer] = useState<Player>({
        _id: '',
        username: '',
        password: '',
        record: {
            wins: 0,
            losses: 0,
            ties: 0
        },
        rating: -1
    })
    const [SelectedOpponent, setSelectedOpponent] = useState<Player>({
        _id: '',
        username: '',
        password: '',
        record: {
            wins: 0,
            losses: 0,
            ties: 0
        },
        rating: -1
    })

    return (
        <playerContext.Provider value={{ SelectedOpponent, setSelectedOpponent, SelectedPlayer, Refresher, setSelectedPlayer, setRefresher }}>
            {children}
        </playerContext.Provider>
    )
}


