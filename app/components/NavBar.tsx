//not client component
import React from 'react'
import Link from 'next/link';
import SubNavBar from './SubNavBar';
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import NewGoogleLogin from '../components/playerLoginComponents/NewGoogleLogin'
import AuthProvider from '../api/auth/Provider'

const NavBar = async () => {
    //allows us to access the JWT created by NextAuth on the SERVER!
    const session = await getServerSession(authOptions)
    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <Link href='/' className="btn btn-ghost text-xl">Koya</Link>
            </div>
            <AuthProvider>
                <div className="flex-none gap-3">
                    {session ?
                        <SubNavBar session={session} /> :
                        <Link className='btn btn-primary' href="/api/auth/signin" >Sign In</Link>
                    }
                </div>
            </AuthProvider>
        </div>
    )
}

export default NavBar