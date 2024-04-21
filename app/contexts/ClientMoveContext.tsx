import React, { ReactNode, useState, createContext, Dispatch, SetStateAction } from 'react'

interface Move {
    MoveType: string; //options: move pieces, place piece seed, place piece desert, place piece koya
    Player: number; //options: 1 or 2
    TargetSpaceID: number; //options between 0 to (gameboard width)^2
}

export interface MoveContextInterface {
    ClientMove: Move,
    Refresher: number,
    setClientMove: Dispatch<SetStateAction<Move>>,
    setClientMoveType: Dispatch<SetStateAction<string>>,
    setClientPlayer: Dispatch<SetStateAction<number>>,
    setClientSpaceID: Dispatch<SetStateAction<number>>,
    setRefresher: Dispatch<SetStateAction<number>>

}

const defaultState = {
    ClientMove: {
        MoveType: '',
        Player: -1,
        TargetSpaceID: -1
    },
    Refresher: 0,
    setClientMove: (move: Move) => {
    },
    setClientMoveType: (moveType: string) => {
    },
    setClientPlayer: (player: number) => {
    },
    setClientSpaceID: (spaceID: number) => {
    },
    setRefresher: (refresh: number) => {
    }

} as MoveContextInterface
//creates the whole referenceable context for holding all functions and variables
export const clientContext = createContext(defaultState);

type UserProvideProps = {
    children: ReactNode
}

export default function ClientDisplay({ children }: UserProvideProps) {
    const [clientMoveType, setClientMoveType] = useState<string>('')
    const [clientPlayer, setClientPlayer] = useState<number>(-1)
    const [clientSpaceID, setClientSpaceID] = useState<number>(-1)
    const [Refresher, setRefresher] = useState<number>(0)

    const [ClientMove, setClientMove] = useState<Move>({
        MoveType: '',
        Player: -1,
        TargetSpaceID: -1
    })

    return (
        <clientContext.Provider value={{ ClientMove, Refresher, setClientMove, setClientMoveType, setClientPlayer, setClientSpaceID, setRefresher }}>
            {children}
        </clientContext.Provider>
    )
}


