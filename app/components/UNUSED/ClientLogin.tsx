'use client'
//UNUSED COMPONENT --> replaced by Google Sign In
import React from 'react'
import AddPlayerContext from '../../contexts/AddPlayerContext'
import MyLogin from './MyLogin'

//Wrap context around the right components
const ClientLogin = () => {
    return (
        <AddPlayerContext>
            <MyLogin />
        </AddPlayerContext>
    )
}

export default ClientLogin