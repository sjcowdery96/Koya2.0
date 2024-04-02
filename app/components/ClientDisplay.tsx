'use client'
import UserMoveInput from './UserMoveInput'
import DisplayBoard from './DisplayBoard'
import ClientMoveProvider from '../contexts/ClientMoveContext'
import ScoreBoard from './ScoreBoard'

const ClientDisplay = () => {
    return (
        <div>
            <ClientMoveProvider>
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