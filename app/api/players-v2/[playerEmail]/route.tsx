import { NextRequest, NextResponse } from "next/server";
//holds our route handlers
import Player from '../../../models/Player'
import mongoose from "mongoose";
require('dotenv').config()
//Connect Mongoose 
mongoose.connect(process.env.MONGO_URL || '').then(() => {
    console.log("Database Connection successful!")
})

interface Props {
    params: { playerEmail: string }
}

//CLEVER but DOESN"T WORK!!
export async function GET({ params: { playerEmail } }: Props, request: NextRequest) {
    console.log(playerEmail)
    //this logic finds one player with this email
    const foundPlayer = await Player.findOne({ email: playerEmail }, { username: 1, wins: 1, rating: 1, global_rank: 1, losses: 1, ties: 1, })
    if (foundPlayer) {
        //returns the found player data
        return NextResponse.json({ players: foundPlayer }, { status: 200 })
    }
    else return NextResponse.json({
        error: 'no username or email',
        loginSuccess: false
    }, { status: 500 })

}