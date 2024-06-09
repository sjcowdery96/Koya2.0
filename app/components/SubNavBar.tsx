
'use client'
import React from 'react'
import { useSession } from "next-auth/react";
import Link from 'next/link'
import { Session } from 'next-auth'
import Rating from './createGameComponents/Rating';

interface Props {
    session: Session
}

const SubNavBar = ({ session }: Props) => {
    const { status } = useSession()
    return (
        <div className="flex flex-row justify-end">
            {status === 'loading' &&
                <div> Loading... </div>
            }
            {status === 'authenticated' &&
                <div className="flex space-x-1 rounded">
                    <img src={session.user?.image!} alt="avatar" className="rounded-xl w-10" />
                    <Link className='btn btn-secondary' href='/api/auth/signout'>Sign Out</Link>
                </div>
            }
        </div>
    )
}

export default SubNavBar