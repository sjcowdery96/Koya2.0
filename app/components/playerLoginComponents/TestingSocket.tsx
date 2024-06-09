'use client'
import React, { useState, useEffect } from 'react'
import { io } from "socket.io-client"
//creates ONE instance of the socket (never put inside a component to prevent re-rendering)
const socket = io('http://localhost:5003')

const TestingSocket = () => {
    const [buttonText, setButtonText] = useState('button not clicked')
    //construct the socket
    useEffect(() => {
        console.log("useEffect + " + socket.id)
        //when component mounts, connect socket
        socket.on('connect', () => {
            console.log(socket.id + " Connected")
        })
        //listening inside useEffect to prevent over-renders
        socket.on("someEvent", (data) => {
            console.log('recieved from server: ' + data)
            setButtonText(data)
        })
        // unsubscribe from event for preventing memory leaks
        return () => {
            socket.off();
        };
        //most tutorials call for a "cleanup" function here, but our server handles
        //closing and disconnecting all listeners

        //challenge -- when we are changing routes and rendering new pages, this
        //socket doesn't disconnect until entire client closes...maybe bad?
    }, [])

    //emits an event to the server called "buttonClicked"
    const sendEvent = () => {
        //builds a basic bit of data to send to the server
        const emitData = {
            socketID: socket.id,
            message: "my shopping cart is full of eels"
        }
        //emits the event called "buttonClicked"
        socket.emit("buttonClicked", emitData)
    }

    return (
        <div>
            <button className='btn btn-primary' onClick={sendEvent}>{buttonText}</button>
        </div>
    )
}

export default TestingSocket