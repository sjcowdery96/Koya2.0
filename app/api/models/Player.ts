//mongoDB model for Player
// require mongoose 
import mongoose from "mongoose";
// creating shorthand for the Schema constructor 
const { Schema } = mongoose

const playerSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    record: {
        wins: { type: Number },
        losses: { type: Number },
        ties: { type: Number },
    },
    rating: { type: Number, required: false }
})


// model and export
export default mongoose.models.Player || mongoose.model('Player', playerSchema);

/*
 - Player 
        - _ID
        - Name
        - Password
        - Rating (fun to calculate)
        - Record (win/loss/tie)
        - Games_Played (linked)

*/

