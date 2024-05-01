//mongoDB model for Player
// require mongoose 
import mongoose from "mongoose";
// creating shorthand for the Schema constructor 
const { Schema } = mongoose

const playerSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: false },
    wins: { type: Number, default: 0 },
    ties: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    rating: { type: Number, default: 0.5 },
    global_rank: { type: Number, default: -1, required: true },
    games_played: { type: Number, default: 0, required: true },
    points_scored: { type: Number, default: 0, required: true },
    points_allowed: { type: Number, default: 0, required: true },
    avg_moves_per_game: { type: Number, default: 0, required: true },
    points_per_trunk: { type: Number, default: 1, required: true },
    captures: { type: Number, default: 0, required: true },
    wins_as_p1: { type: Number, default: 0, required: true },
    wins_as_p2: { type: Number, default: 0, required: true },
    avg_center_nine_control: { type: Number, default: 0, required: true },
})

//checks we have our defaults present

playerSchema.pre('save', function (next) {
    //need to add logic to pre-fill default data

    next();
})


// model and export
export default mongoose.models.Player || mongoose.model('Player', playerSchema);

/*
 - Player 
        - id
        - username
        - password (HIDDEN)
        - record
            - wins
            - losses
            - ties 
        - rating (fun to calculate)
        - games_played
        - avg_points_scored
        - avg_points_allowed
        - moves_per_game
        - points_per_trunk
        - caputures 
        - wins_as_p1
        - wins_as_p2
        - avg_center_nine_control
        - global_rank

*/

