//import statments for models
import { NextRequest, NextResponse } from "next/server";
import GameResult from '../models/GameResult'
import mongoose from "mongoose";
require('dotenv').config()
//Connect Mongoose 
mongoose.connect(process.env.MONGO_URL || '').then(() => {
    console.log("Database Connection successful!")
})

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