//import statments for models
import { NextRequest, NextResponse } from "next/server";
import GameResult from '../../models/GameResult'
import mongoose from "mongoose";
require('dotenv').config()
//Connect Mongoose 
mongoose.connect(process.env.MONGO_URL || '').then(() => {
    console.log("Database Connection successful!")
})

//player model
interface Player {
    _id: string,
    username: string,
    wins: number,
    losses: number,
    ties: number
    rating: number,
    global_rank: number
}

interface Game {
    Player1: Player,
    Player2: Player
}

//Post Route to create game 
export async function POST(request: NextRequest) {
    //read the body of the request into json
    const requestBody = await request.json()
    console.log(requestBody)
    //check for proper inputs
    if (!requestBody.Player1 || !requestBody.Player2) {
        //bad request
        console.log("no players")
        return NextResponse.json({
            error: 'no players',
            gameCreated: false
        }, { status: 500 })
    }
    else {
        //create game in the database
        console.log("players!")
        console.log(requestBody)
        return NextResponse.json({
            gameCreated: true
        }, { status: 200 })
        //return gameID to redirect client
    }
}

/*
handle login/signup to join players to game
    - use two forms to collect username, pw, first name from both players
    - handle user lookup and sign-up
    - use Bcrypt to set and check passwords --> https://www.youtube.com/watch?v=AzA_LTDoFqY
*/



/*
create game
    - create game with added players
    - send gameBoard to "process-move" route
*/