'use client'
//displays the user information in Dashboard

import React from 'react'
import { Session } from 'next-auth'
import PlayerDashboard from './PlayerDashboard'

//keeps typscript from yelling at us
interface Props {
    session: Session
}

const NewGoogleLogin = ({ session }: Props) => {
    //here is where we could use a useEffect hook to query the DB for the player data
    return (
        <div className="flex p-5 m-3 align-middle justify-center">
            <div className='max-h-window'>
                <PlayerDashboard playerImage={session.user!.image} playerEmail={session.user!.email} playerUserName={session.user!.name} />
            </div>
        </div>
    )
}

export default NewGoogleLogin