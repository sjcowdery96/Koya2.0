//NEW LOGIN EXPERIENCE

//imports
import React from 'react'
import ClientLogin from '../components/playerLoginComponents/ClientLogin'
import TestingSocket from '../components/playerLoginComponents/TestingSocket'

const Login = () => {
    return (
        <div>
            <div>
                <div>
                    <ClientLogin />
                </div>
            </div>
            <TestingSocket />
        </div>
    )
}

export default Login