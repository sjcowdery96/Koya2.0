'use client'
//displays the user information -- need to add useEffect to grab details from DB

import React from 'react'
import Link from 'next/link'
import { Session } from 'next-auth'

//keeps typscript from yelling at us
interface Props {
    session: Session
}

const NewGoogleLogin = ({ session }: Props) => {

    return (
        <div className="flex p-5 m-3 align-middle justify-center">
            <div className='max-h-window'>
                <div style={{ width: "30rem" }}>
                    <div className="hero min-h-30 bg-base-100 bg-opacity-25">
                        <div className="hero-content flex-col lg:flex-row-reverse">
                            <img src={session.user!.image || ''} alt='user pic' className="max-w-sm rounded-lg shadow-2xl" />
                            <div>
                                <h1 className="text-5xl font-bold">Welcome</h1>
                                <h2 className="text-2xl font-bold">{session.user!.name}</h2>
                                <p className="py-6">A trunk is not a root, but you know that already.</p>
                                <div>
                                    <span className='m-2'><Link className="btn btn-primary" href='/create-game'> Join a Game</Link></span>
                                    <span className='m-2'><Link className="btn btn-accent" href='/api/auth/signout'> Sign Out</Link></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewGoogleLogin