//holds our route handlers
import { NextRequest, NextResponse } from "next/server";
import Game from '../../models/Game'
import mongoose from "mongoose";
require('dotenv').config()
//Connect Mongoose 
mongoose.connect(process.env.MONGO_URL || '').then(() => {
    console.log("Database Connection successful!")
})


//get function fetches the gameboard data
export async function GET() {
    //not sure what to put here...
    return NextResponse.json({
        gameData: "none"
    })
}

export async function POST(request: NextRequest) {
    //read the body of the request into json
    const requestBody = await request.json()
    if (!requestBody.gameID) {
        console.log("SERVER: NO GAME ID PROVIDED")
        return NextResponse.json({ error: 'move failed to process' }, { status: 500 })

    }
    else {
        //this logic finds the GameResult
        const newGame = await Game.find({ _id: requestBody.gameID })
        if (newGame.length > 0) {
            //no ID found, empty array returned
            console.log("SERVER: NO GAME ID FOUND")
            return NextResponse.json({ error: 'move failed to process' }, { status: 500 })
        }
        //test for valid move
        if (requestBody.TargetSpaceID > 80 || requestBody.TargetSpaceID < 0) {
            //bad request
            return NextResponse.json({ error: 'Index out of Range (above 80 or below 0)' }, { status: 500 })
        }
        //CHANGE TO LOGIC TO CHECK MOVES AS VALID!
        if (!true) {
            //return game
            return NextResponse.json({
                gameData: newGame
            })
        }
        else {
            console.log("SERVER: NO MOVE PROCESSED")
            return NextResponse.json({ error: 'move failed to process' }, { status: 500 })
        }
    }


}
