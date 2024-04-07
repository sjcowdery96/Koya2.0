// Login.tsx
'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
const bcrypt = require('bcryptjs');

interface LoginForm {
    username: string;
    password: string;
}

const UserLogin: React.FC = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<LoginForm>({
        username: '',
        password: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //const hashedPassword = await bcrypt.hash(formData.password, 10); // Hash password with 10 rounds
        //attept login
        //console.log('Login attempted:', { username: formData.username, password: formData.password });
        const response = await fetch('http://localhost:3000/api/create-player', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        //
        const loginResult = await response.json()
        if (loginResult.loginSuccess) {
            console.log('successful login')
            //this is a very insecure way to handle an authentication. 
            //need to update before full deployment
            router.push('http://localhost:3000/game')
        }
        else {
            console.log('failed login')
        }

        // Clear form after submission (optional)
        //setFormData({ username: '', password: '' });
    };

    return (
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
            </div>
        </div>
    );
};

export default UserLogin;
