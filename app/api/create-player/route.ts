//handles creating new player or password/username checking for existing players
//linked to local MongoDB database via mongoose

//holds our route handlers
import { NextRequest, NextResponse } from "next/server";
import Player from '../models/Player'
import mongoose from "mongoose";
const bcrypt = require('bcryptjs')
require('dotenv').config()
//Connect Mongoose 
mongoose.connect(process.env.MONGO_URL || '').then(() => {
    console.log("Database Connection successful!")
})
//player model
interface PlayerModel {
    username: string,
    password: string,
    record: {
        wins: number,
        losses: number,
        ties: number
    },
    rating: number
}
//Post Route to create player or check for login
export async function POST(request: NextRequest) {
    //read the body of the request into json
    const requestBody = await request.json()
    //console.log(requestBody)
    //check for proper inputs
    if (!requestBody.username || !requestBody.password) {
        //bad request
        return NextResponse.json({
            error: 'no username or password',
            loginSuccess: false
        }, { status: 500 })
    }
    else {
        //check for existing username
        const existing = await Player.findOne({ username: requestBody.username });
        //existing username -- check password
        if (existing) {
            console.log("Username exists!")
            //try to match password
            const pwmatch = await bcrypt.compare(requestBody.password, existing.password)
            if (pwmatch) {
                //password mathces -- login success
                console.log("Login Success!")
                //need to add next steps for directing to game page

                return NextResponse.json({
                    loginSuccess: true
                }, { status: 200 })
            }
            //existing username -- password missmatch, failed login
            else {
                console.log("SERVER: USER SIGN IN FAILED")
                return NextResponse.json({
                    error: 'login failed',
                    loginSuccess: false
                }, { status: 500 })
            }
        }
        //new user sign-on
        else {
            //hash new password 
            const hashedPW = await bcrypt.hash(requestBody.password, 10)
            //attempts to create new player
            const newPlayer: PlayerModel = {
                username: requestBody.username,
                password: hashedPW,
                record: {
                    wins: 0,
                    losses: 0,
                    ties: 0
                },
                rating: 0.5
            }
            //creates the new Player document
            const newDocument = new Player(newPlayer);
            //saves it to the database
            await newDocument.save();
            //returns the document
            console.log(`new player created! \n` + newDocument)
            return NextResponse.json({
                loginSuccess: true
            }, { status: 200 })
        }
    }
}