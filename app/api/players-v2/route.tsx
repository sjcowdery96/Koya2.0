//handles creating new player or password/username checking for existing players
//handles returning all known players in the DB
//linked to local MongoDB database via mongoose

//holds our route handlers
import { NextRequest, NextResponse } from "next/server";
import Player from '../../models/Player'
import mongoose from "mongoose";
const bcrypt = require('bcryptjs')
require('dotenv').config()
let bullshit_duplicate_entry_preventor = true;
//Connect Mongoose 
mongoose.connect(process.env.MONGO_URL || '').then(() => {
    console.log("Database Connection successful!")
})

//Get Route to return just ONE player with email...no bueno
export async function GET(request: NextRequest) {
    console.log(request)
    return NextResponse.json({
        error: 'no get requests allowed',
        loginSuccess: false
    }, { status: 500 })
}
//Post Route to create player or check for login
export async function POST(request: NextRequest) {
    //read the body of the request into json
    const requestBody = await request.json()
    //check for proper inputs
    if (!requestBody.email || !requestBody.username) {
        //bad request
        return NextResponse.json({
            error: 'no username or email',
            loginSuccess: false
        }, { status: 500 })
    }
    else {
        //check for existing username and return without password
        const existing = await Player.findOne({ username: requestBody.username }, { password: 0 });
        console.log("searching DB for: " + requestBody.username)
        //existing username, try to match email
        if (existing) {
            if (existing.email !== requestBody.email) {
                console.log("Username exists but email does not match")
                return NextResponse.json({
                    error: 'email does not match username',
                    loginSuccess: false
                }, { status: 500 })
            }
            else {
                console.log("Username exists and email match")
                return NextResponse.json({
                    loginSuccess: true,
                    returnedPlayer: existing
                }, { status: 200 })
            }
        }
        //new user sign-on!
        else {
            //hand wavy bullshit fix to duplicate entries...might bite me in the ass later
            if (bullshit_duplicate_entry_preventor) {
                bullshit_duplicate_entry_preventor = false;
                console.log(`duplicate prevention protocol! \n`)
                return NextResponse.json({
                    loginSuccess: false,
                }, { status: 500 })
            }
            else {
                //attempts to create a default new player
                const newPlayer = {
                    email: requestBody.email,
                    username: requestBody.username,
                    //create initial rank based on total Player count
                    global_rank: (await Player.countDocuments({})) + 1
                }
                //testing upsert logic to prevent duplicate entries
                //if we don't find that email, create entry of new player
                const newDocument = await Player.findOneAndUpdate(
                    { email: requestBody.email }, newPlayer, { new: true, upsert: true })
                //end testing upsert
                /*
                //creates the new Player document
                const newDocument = new Player(newPlayer);
                //saves it to the database
                await newDocument.save();
                //returns the document
                */
                console.log(`new player created! \n` + newDocument)
                return NextResponse.json({
                    loginSuccess: true,
                    returnedPlayer: newDocument
                }, { status: 200 })
            }

        }
    }
}