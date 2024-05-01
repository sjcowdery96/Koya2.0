//NEW LOGIN EXPERIENCE with Google!

//imports
import React from 'react'
import Link from "next/link"
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import NewGoogleLogin from './components/playerLoginComponents/NewGoogleLogin'

export default async function Home() {
  //allows us to access the JWT created by NextAuth on the SERVER!ß
  const session = await getServerSession(authOptions)
  return (
    <div className="hero min-h-screen" style={{ backgroundImage: 'url(https://images.squarespace-cdn.com/content/v1/5efa6fb96aa65d6effb76352/1599092838714-F6DPAXE4OXEVL7NE5QNQ/Koya+Board+Game-15.jpg)' }}>
      <div className="hero-overlay bg-opacity-30"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md bg-opacity-10">
          <div>
            <h1 className="mb-5 text-5xl font-bold">🌲 Virtual Koya 🌳</h1>
            {session ?
              <NewGoogleLogin session={session} /> :
              <div>
                <p className="mb-5">Join the worldwide community of tree loving strategy game enthusaists.</p>
                <Link className='btn btn-primary' href="/api/auth/signin" >Sign In</Link>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
