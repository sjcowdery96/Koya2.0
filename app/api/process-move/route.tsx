//holds our route handlers
import { NextRequest, NextResponse } from "next/server";
import Gameboard from "@/app/models/Gameboard";
//create game
const newGame = new Gameboard
//get function just fetches the gameboard data
export async function GET() {
    //return game
    return NextResponse.json({
        gameData: newGame
    })
}

export async function POST(request: NextRequest) {
    //read the body of the request into json
    const requestBody = await request.json()
    //test for valid move
    if (requestBody.TargetSpaceID > 80 || requestBody.TargetSpaceID < 0) {
        //bad request
        return NextResponse.json({ error: 'Index out of Range (above 80 or below 0)' }, { status: 500 })
    }
    //create move
    if (newGame.processMove(requestBody.TargetSpaceID, requestBody.Player, requestBody.MoveType)) {
        //return game
        //console.log(newGame)
        return NextResponse.json({
            gameData: newGame
        })
    }
    else {
        console.log("SERVER: NO MOVE PROCESSED")
        return NextResponse.json({ error: 'move failed to process' }, { status: 500 })
    }

}
