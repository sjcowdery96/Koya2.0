import { NextRequest, NextResponse } from "next/server"
import Game from '../../../models/Game'
//ERRORS HERE
//need to "un-class" the functions here. The database can't run these object functions.
import Space from "@/app/classes/Space";
import Piece from "@/app/classes/Piece";
import Move from "@/app/classes/Move";
///
import CreateKoya from "@/app/classes/CreateKoya";
import mongoose from "mongoose";
require('dotenv').config()
//Connect Mongoose 
mongoose.connect(process.env.MONGO_URL || '').then(() => {
    console.log("Database Connection successful!")
})

interface Gameboard {
    //all spaces
    Spaces: Space[]
    //player seed supply
    P1SeedStack: Piece[]
    P2SeedStack: Piece[]
    //player desert supply
    P1DesertStack: Piece[]
    P2DesertStack: Piece[]
    //the koya piece!
    Koya: Piece
    //current player turn (alternates between 1 and 0) in processMove
    PlayerTurn: number;
    //scoreboard [p1Score, p2Score, p1SeedBank, p2SeedBank]
    Scoreboard: number[]
    //move history
    GameHistory: Move[]
    //board width
    boardWidth: number;
    //space ID's of all active trunks
    allTrunks: number[]
}

//get request includes the [gameID]
export async function GET(request: NextRequest) {
    //parse the [gameID] slug from the request
    const gameID = parseId(request.nextUrl.pathname)
    if (gameID == null) {
        //no ID found, empty array returned
        console.log("SERVER: INVALID REQUEST")
        return NextResponse.json({ error: 'move failed to process' }, { status: 500 })
    }
    //search for the gameID in the Games database
    const newGame = await Game.find({ _id: gameID })
    //check to ensure newGame has depth ie found a game
    if (newGame.length > 0) {
        //returns the one game matching that ID
        return NextResponse.json({
            gameData: newGame[0]
        })
    }
    //no ID found, empty array returned
    console.log("SERVER: NO GAME ID FOUND")
    return NextResponse.json({ error: 'move failed to process' }, { status: 500 })

}//end GET route

//helper function to parase gameID via the NextJS urlpath
function parseId(url: string) {
    // Split the URL by '/' (path separators)
    const parts = url.split('/');
    // Check if there are at least 3 parts (valid format)
    if (parts.length >= 3 && parts[2] === "process-move-v2") {
        // Extract the part after "process-move-v2" 
        return parts[3];
    } else {
        // Not a valid format, return null
        return null;
    }
}

//object incoming is shape:
/*
    {
     TargetSpaceID: Number,
     MoveType: String, 
     Player: Number
    }
*/
export async function POST(request: NextRequest) {
    //read the body of the request into json
    const requestBody = await request.json()
    //test for valid move
    if (requestBody.TargetSpaceID > 80 || requestBody.TargetSpaceID < 0) {
        //bad request
        return NextResponse.json({ error: 'Index out of Range (above 80 or below 0)' }, { status: 500 })
    }
    //grabs the id from the URL
    const gameID = parseId(request.nextUrl.pathname)
    if (gameID == null) {
        //no ID found, empty array returned
        console.log("SERVER: INVALID REQUEST")
        return NextResponse.json({ error: 'move failed to process' }, { status: 500 })
    }
    //search for the gameID in the Games database -- returns an array
    const newGameData = await Game.find({ _id: gameID })
    //check for a length returned
    if (newGameData.length < 0) {
        //empty array returned means no ID found
        console.log("SERVER: NO GAME ID FOUND")
        return NextResponse.json({ error: 'move failed to process' }, { status: 500 })
    }
    //cast our query result into the shape of Gameboard
    //use this to compare the incoming move
    const newGame: Gameboard = newGameData[0]
    //Check for correct player
    if (checkPlayer()) {
        //correct player
        //check for valid move

        //attempts to push new game details 
        await saveMove(requestBody.TargetSpaceID, requestBody.Player, requestBody.MoveType)
        return NextResponse.json({
            gameData: newGame
        }, { status: 200 })
    }
    else {
        console.log("WRONG PLAYER")
        return NextResponse.json({ error: 'wrong player' }, { status: 500 })
    }
    //checks move to be valid
    async function checkMove() {

    }
    //simple helper function to change the player
    async function changePlayer() {
        try {
            //find the game
            const myGame = await Game.findById(gameID);
            if (myGame) {
                //sets player turn to length+1 mod 2
                myGame.PlayerTurn = (myGame.PlayerTurn + 1) % 2
                myGame.save()
            }
        } catch (error) {
            console.error('Error changing Player:', error);
        }
    }
    //helper function to send valid moves to be saved
    async function saveMove(Location: number, Player: number, MoveType: string) {
        console.log(Location)
        try {
            //find the game
            const myGame = await Game.findById(gameID);
            if (myGame) {
                //find the space
                console.log("FOUND THE GAME")
                const matchingSpace = myGame.Spaces[Location]
                if (matchingSpace) {
                    console.log("FOUND THE SPACE")
                    //add the Piece
                    matchingSpace.Pieces.push(new Piece(MoveType));
                    console.log(matchingSpace.Pieces)
                    myGame.markModified('Spaces');
                    //this is not saving the new Piece in the array!!!
                    await myGame.save();
                    console.log(myGame.Spaces[Location])
                    console.log('Piece added successfully!');
                } else {
                    console.error('Space not found');
                }
            } else {
                console.error('Game not found');
            }
        } catch (error) {
            console.error('Error adding Piece:', error);
        }
        //good move means change player
        await changePlayer()
    }
    //helper function validates current player
    function checkPlayer() {
        if (requestBody.Player != newGame.PlayerTurn) {
            return false;
        }
        else return true;
    }

}//end post route
