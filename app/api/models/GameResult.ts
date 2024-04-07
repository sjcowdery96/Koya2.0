//mongoDB model for GameResult
// require mongoose 
import mongoose from "mongoose"
// creating shorthand for the Schema constructor 
const { Schema } = mongoose

// GameResults schema 
const gameResultSchema = new Schema({
    //scores
    Player1Score: { type: Number },
    Player2Score: { type: Number },
    //reference the player schema
    Player1: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    Player2: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    },
    //might have a winnner, might be a tie!
    Winner: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
        required: false
    },
})

// model and export
export default mongoose.models.GameResult || mongoose.model('GameResult', gameResultSchema)

/*
const GameResult = mongoose.model('Game', gameResultSchema)
module.exports = GameResult
*/

