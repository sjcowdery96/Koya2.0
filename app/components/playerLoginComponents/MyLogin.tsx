'use client'
//building a context wrapper around all components
import React, { useState, useEffect, useContext } from 'react'
import { playerContext } from '../../contexts/AddPlayerContext'
import CreateGame from './CreateGame'

interface LoginForm {
    username: string;
    password: string;
}
interface Player {
    _id: string,
    username: string,
    wins: number,
    losses: number,
    ties: number
    rating: number,
    global_rank: number
}

const MyLogin = () => {
    //states for handling good logins
    const [LoggedIn, setLoggedIn] = useState(false)
    const [badLogin, setBadLogin] = useState(false)
    //using Context
    const { SelectedPlayer, setSelectedPlayer, setRefresher, setSelectedPlayerUsername } = useContext(playerContext)
    const [formData, setFormData] = useState<LoginForm>({
        username: '',
        password: '',
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch('http://localhost:3000/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        //
        const loginResult = await response.json()
        //if we have login success
        if (loginResult.loginSuccess) {
            console.log('successful login')
            setBadLogin(false)
            //sets the logged in display
            setLoggedIn(true)
            const lp: Player = loginResult.returnedPlayer
            console.log("LOGGED IN PLAYER: " + lp.username)
            //Set context for selected player
            setSelectedPlayer({ username: lp.username, _id: lp._id, global_rank: lp.global_rank, wins: lp.wins, losses: lp.losses, ties: lp.ties, rating: lp.rating })
        }
        else {
            console.log('failed login')
            setBadLogin(true)

        }

        // Clear form after submission (optional)
        //setFormData({ username: '', password: '' });
    };
    //display login to collect "loggedInPlayer"
    return (
        <div>
            <div>
                {!LoggedIn && <div>
                    <div className="flex p-5 m-3 align-middle justify-center">
                        <div>
                            <div className='flex items-center gap-2'>
                                <h1>Sign In / Sign Up</h1>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                                    <input onChange={handleChange} value={formData.username} name='username' type="text" className="grow" placeholder="Username" />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                    <input onChange={handleChange} value={formData.password} name='password' type="password" className="grow" placeholder="Password" />
                                </label>
                                <button className="btn btn-accent" type="submit">Submit</button>
                            </form>
                            <br />
                            {badLogin && <div role="alert" className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Incorrect Password!</span>
                            </div>}
                        </div>
                    </div>
                </div>}
            </div>
            <div>
                {LoggedIn && <CreateGame loggedInPlayer={SelectedPlayer} />}
            </div>
        </div>
    )
}

export default MyLogin