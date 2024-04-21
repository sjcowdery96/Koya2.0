//imports
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import Piece from '../classes/Piece';
import Move from '../classes/Move';
import Space from '../classes/Space';

//define GameData
interface GameData {
    Initialized: Boolean, //runs our pseudo constructor
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
    // Other game properties
    Players: String[]; // Array of player userNames
}

const gameDataSchema = new Schema<GameData>({
    Initialized: { type: Boolean, default: false },
    //holds array of spaces
    Spaces: { type: [Object] },
    //holds the supply for each player
    P1SeedStack: { type: [Object], },
    P2SeedStack: { type: [Object], },
    P1DesertStack: { type: [Object], },
    P2DesertStack: { type: [Object], },
    //then the koya
    Koya: { type: Object, default: new Piece("KOYA") },
    //whose turn is it anyway?
    PlayerTurn: { type: Number, default: 1 },
    //holds the scoreboard
    Scoreboard: { type: [Number], default: [0, 0, 0, 0] },
    //all the moves
    GameHistory: { type: [Object], },
    //set witdth of the board
    boardWidth: { type: Number, default: 9 },
    //location of trunks
    allTrunks: { type: [Number] },
    //players involved
    Players: { type: [String], required: true },
});

// Apply custom type transformation to ensure data matches Move interface
gameDataSchema.pre('save', async function (next) {
    if (!this.Initialized) {
        //run constructor logic
        //fixed boardwith at 9 for now...
        this.boardWidth = 9;
        //turns start with player 1
        this.PlayerTurn = 1;
        //initialize the koya piece!
        this.Koya = new Piece("KOYA")
        //initialize empty supply for both players
        this.P1SeedStack = []
        this.P2SeedStack = []
        this.P1DesertStack = []
        this.P2DesertStack = []
        //fill supply for each player
        for (let i = 0; i < 36; i++) {
            //will run 4 times to add deserts to each player
            if (i % 9 == 0) {
                this.P1DesertStack.push(new Piece('XX'))
                this.P2DesertStack.push(new Piece('XX'))
            }
            //runs 36 times to add seeds to player supply
            this.P1SeedStack.push(new Piece('P1'))
            this.P2SeedStack.push(new Piece('P2'))
        }
        //initialize empty array of spaces
        this.Spaces = []
        //creates a gameboard with dimentions width*width
        for (let i = 0; i < (this.boardWidth * this.boardWidth); i++) {
            //creates new gameboard spaces
            this.Spaces.push(new Space(i))
        }
        //no seedbank, no score at the beginnning
        this.Scoreboard = [0, 0, 0, 0]
        //no moves initially
        this.GameHistory = []
        //no trunks initialls
        this.allTrunks = []
        //finish initializing
        this.Initialized = true;
    }
    const game = this as GameData;
    game.GameHistory = game.GameHistory.map((move) => ({ ...move } as Move));
    next();
});


export default mongoose.models.GameData || mongoose.model('GameData', gameDataSchema);

