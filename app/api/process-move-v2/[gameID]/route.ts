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

export async function POST(request: NextRequest) {
    //read the body of the request into json
    const requestBody = await request.json()
    //test for valid move
    if (requestBody.TargetSpaceID > 80 || requestBody.TargetSpaceID < 0) {
        //bad request
        return NextResponse.json({ error: 'Index out of Range (above 80 or below 0)' }, { status: 500 })
    }
    const gameID = parseId(request.nextUrl.pathname)
    if (gameID == null) {
        //no ID found, empty array returned
        console.log("SERVER: INVALID REQUEST")
        return NextResponse.json({ error: 'move failed to process' }, { status: 500 })
    }
    //search for the gameID in the Games database
    const newGameData = await Game.find({ _id: gameID })
    //check for a length returned
    if (newGameData.length < 0) {
        //empty array returned means no ID found
        console.log("SERVER: NO GAME ID FOUND")
        return NextResponse.json({ error: 'move failed to process' }, { status: 500 })
    }
    //cast our query result into the shape of Gameboard
    const newGame: Gameboard = newGameData[0]
    //create move (checks if returns true)
    if (processMove(requestBody.TargetSpaceID, requestBody.Player, requestBody.MoveType)) {
        //returns updated game if true
        return NextResponse.json({
            gameData: newGame
        })
    }

    //WORKHORSE FUNCTION
    //process move from raw input
    function processMove(location: number, player: number, moveType: string): boolean {
        //check valid turn for player
        if (player != newGame.PlayerTurn) {
            //not your turn
            console.log("NOT YOUR TURN")
            console.log('TURN: ' + newGame.PlayerTurn + " INPUT: " + player)
            return false;
        }
        //check if location is outside the game array
        else if (location >= (newGame.boardWidth * newGame.boardWidth)) {
            //location outside the board
            console.log("LOCATION OUTSIDE THE BOARD: " + location)
            return false
        }
        //check for valid input type : "M" "K" "S" "D"
        else if (!checkMoveTypeInput(moveType.toUpperCase())) {
            //not a valid input
            console.log("MOVE INPUT INVALID: " + moveType)
            return false
        }
        //confirmed valid player, location, and input : "M" "K" "S" "D"
        else {
            //DEV VARIABLE FOR SKIPPING PRE-GAME LOGIC
            //I just wrapped this first set of if/if else statements into an if statement
            //to undo, just remove the last else and return statement and delete the
            // if (pregame) {} wrapper OR...just set this variable to true

            //checks for pregame phases
            //first 4 moves must be deserts 'D'
            if (newGame.GameHistory.length < 4) {
                //first four moves of the game! Must be deserts
                if (moveType.toUpperCase() != 'D') {
                    //invalid
                    console.log('INVALID MOVE')
                    console.log('EACH PLAYERS FIRST 2 MOVES MUST BE DESERTS')
                    console.log(newGame.GameHistory)
                    return false
                }
                //adds our deserts
                if (newGame.PlayerTurn == 1) {
                    //adds a desert on the board!
                    if (newGame.Spaces[location].addPiece(newGame.P1DesertStack[0])) {
                        //remove one desert for player 1
                        newGame.P1DesertStack.pop()
                    }
                    else return false;
                }
                //remove one desert for player 2
                else {
                    if (newGame.Spaces[location].addPiece(newGame.P2DesertStack[0])) {
                        //remove one desert for player 2
                        newGame.P2DesertStack.pop()
                    }
                    else return false;
                }
                //create a move and add it to the game history
                newGame.GameHistory.push(new Move(player, moveType.toUpperCase(), location, newGame.Scoreboard))
                //sets player turn to length+1 mod 2
                newGame.PlayerTurn = (newGame.GameHistory.length + 1) % 2
                return true;
            }
            //player 1's first seed (heading into turn 5)
            else if (newGame.GameHistory.length == 4) {
                //P1's first move must be a seed
                if (moveType.toUpperCase() != 'S') {
                    //invalid
                    console.log('INVALID MOVE -- P1 MUST PLACE A SEED')
                    return false
                }
                else if (newGame.Spaces[location].addPiece(newGame.P1SeedStack[0])) {
                    //create a move and add it to the game history
                    newGame.GameHistory.push(new Move(player, moveType.toUpperCase(), location, newGame.Scoreboard))
                    //remove one seed for player 1
                    newGame.P1SeedStack.pop()
                    //update neighbors
                    updateNeighborBranches(location, 1)
                    //sets player turn to length+1 mod 2
                    newGame.PlayerTurn = (newGame.GameHistory.length + 1) % 2
                    return true;
                }
                else return false;
            }
            //Player 2's first seed (heading into turn 6)
            else if (newGame.GameHistory.length == 5) {
                //P2's first move must be a seed
                if (moveType.toUpperCase() != 'S') {
                    //invalid
                    console.log('INVALID MOVE -- P2 MUST PLACE A SEED')
                    return false
                }
                //adds a seed on the board!
                else if (newGame.Spaces[location].addPiece(newGame.P2SeedStack[0])) {
                    //create a move and add it to the game history
                    newGame.GameHistory.push(new Move(player, moveType.toUpperCase(), location, newGame.Scoreboard))
                    //remove one seed for player 2
                    newGame.P2SeedStack.pop()
                    //update neighbors
                    updateNeighborBranches(location, 0)
                    //SKIP CHANGE PLAYER!! P2 get to go AGAIN!
                    console.log("GO AGAIN PLAYER 2 -- YOUR NEXT SEED IS THE KOYA")
                    return true;
                }
                else return false;

            }
            //Player 2's SECOND move...THE KOYA!
            else if (newGame.GameHistory.length == 6) {
                //P2's second move must be THE KOYA!
                if (moveType.toUpperCase() != 'S') {
                    //invalid
                    console.log('INVALID MOVE')
                    console.log("PlAYER 2 MUST NOW PLACE A SEED AS THE KOYA")
                    return false
                }
                else if (newGame.Spaces[location].addPiece(newGame.Koya)) {
                    //places the koya piece!
                    //create the koya move and add it to the game history
                    newGame.GameHistory.push(new Move(player, "K", location, newGame.Scoreboard))
                    //update neighbors
                    updateNeighborBranches(location, 3)//the only time a 3 is passed in
                    //sets player turn to normal after skipped turn
                    newGame.PlayerTurn = (newGame.GameHistory.length) % 2
                    console.log("vvv GAME LENGTH SHOULD NOW BE 7")
                    console.log(newGame.GameHistory.length)
                    return true;
                }
                else return false;

            }
            //out of pre-game phase!
            //LIVE GAME MODE
            else {
                //check if the game is over! (no more pieces for current player)
                if (newGame.PlayerTurn == 1 && (newGame.P1SeedStack.length == 0 && newGame.P1DesertStack.length == 0)) {
                    //Player 1 is out of pieces
                    console.log("GAME OVER -- PLAYER 1 OUT OF PIECES")
                    return false;
                }
                else if (newGame.PlayerTurn != 1 && (newGame.P2SeedStack.length == 0 && newGame.P2DesertStack.length == 0)) {
                    //Player 1 is out of pieces
                    console.log("GAME OVER -- PLAYER 2 OUT OF PIECES")
                    return false;
                }
                //key off of move type -- sanity checks
                switch (moveType.toUpperCase()) {
                    //move pieces?? geez...not yet lol
                    case "M":
                        console.log("CAN'T MOVE PIECES YET...SORRY!")
                        return false;
                    //cannot place the koya twice!
                    case "K":
                        console.log("THE KOYA IS ALREADY PLACED!")
                        return false;
                    //valid player, placing a seed piece
                    case "S":
                        //place seed for player 1
                        if (newGame.PlayerTurn == 1) {
                            //check supply
                            if (newGame.P1SeedStack.length == 0) {
                                //out of seeds!
                                console.log("PLAYER 1 OUT OF SEEDS")
                                return false
                            }
                            //adds a seed on the board!
                            else if (newGame.Spaces[location].addPiece(newGame.P1SeedStack[0])) {
                                //create a move and add it to the game history
                                newGame.GameHistory.push(new Move(player, moveType.toUpperCase(), location, newGame.Scoreboard))
                                //remove one seed for player 1
                                newGame.P1SeedStack.pop()
                                //update neighbors
                                updateNeighborBranches(location, 1)
                            }
                            else {
                                console.log("PLACE SEED ERROR")
                                return false;
                            }
                        }
                        //place seed for player 2
                        else {
                            //check supply
                            if (newGame.P2SeedStack.length == 0) {
                                //out of seeds!
                                console.log("PLAYER 2 OUT OF SEEDS")
                                return false
                            }
                            //adds a seed on the board!
                            else if (newGame.Spaces[location].addPiece(newGame.P2SeedStack[0])) {
                                //create a move and add it to the game history
                                newGame.GameHistory.push(new Move(player, moveType.toUpperCase(), location, newGame.Scoreboard))
                                //remove one seed for player 2
                                newGame.P2SeedStack.pop()
                                //update neighbors
                                updateNeighborBranches(location, 0)
                            }
                            else {
                                console.log("PLACE SEED ERROR")
                                return false;
                            }
                        }
                        //check for koyas an all spaces
                        newGame.Spaces.forEach(space => {
                            let found = false;
                            const createdKoya = space.checkKoya();
                            //if we find a koya, the return position is greater than 0
                            if (createdKoya.Position > 0) {
                                //extract koyaID
                                const koyaID = createdKoya.Position
                                //CHECK IF THIS KOYA HAS ALREADY BEEN RECORDED
                                newGame.allTrunks.forEach((index) => {
                                    if (index == koyaID) {
                                        console.log("KOYA FOUND ALREADY AT INDEX: " + index)
                                        //this koya has been found already
                                        found = true;
                                    }
                                })
                                if (found) {
                                    //do nothing!
                                }
                                else {
                                    //updates all required branches with the id
                                    updateNeighborBranches(koyaID, -1)
                                    //need to add a piece to the location
                                    if (space.Pieces[0].isP1) {
                                        //add a player 1 seed piece to the stack
                                        newGame.Spaces[koyaID].addPiece(newGame.P1SeedStack[0], true)
                                        //remove one seed for player 1
                                        newGame.P1SeedStack.pop()
                                    }
                                    else {
                                        //add a player 2 seed piece to the stack
                                        newGame.Spaces[koyaID].addPiece(newGame.P2SeedStack[0], true)
                                        //remove one seed for player 2
                                        newGame.P2SeedStack.pop()
                                    }
                                    //updates roots according to shape
                                    flipRoots(createdKoya)
                                    //created koya trunk ID gets added to allTrunks array
                                    newGame.allTrunks.push(createdKoya.Position)
                                }
                            }
                            else {
                                //checkKoya returned -1 so do nothing.
                            }

                        })
                        //check for more roots...?
                        //this is where we run the additional checks to see
                        //if doubles, triples, and quad, etc koyas have been built 

                        //sets player turn to length mod 2
                        newGame.PlayerTurn = (newGame.GameHistory.length) % 2
                        return true;
                    //valid player, placing a desert piece
                    case "D":
                        //place desert for player 1
                        if (newGame.PlayerTurn == 1) {
                            //check supply
                            if (newGame.P1DesertStack.length == 0) {
                                //out of deserts
                                console.log("P1 OUT OF DESERTS")
                                return false
                            }
                            //create a move and add it to the game history
                            newGame.GameHistory.push(new Move(player, moveType.toUpperCase(), location, newGame.Scoreboard))
                            //adds a desert on the board!
                            newGame.Spaces[location].addPiece(newGame.P1DesertStack[0])
                            //remove one desert for player 1
                            newGame.P1DesertStack.pop()
                            //needs to update the neighborStates!

                        }
                        //place desert for player 2
                        else {
                            //check supply
                            if (newGame.P2DesertStack.length == 0) {
                                //out of deserts
                                console.log("P2 OUT OF DESERTS")
                                return false
                            }
                            //create a move and add it to the game history
                            newGame.GameHistory.push(new Move(player, moveType.toUpperCase(), location, newGame.Scoreboard))
                            //adds a desert on the board!
                            newGame.Spaces[location].addPiece(newGame.P2DesertStack[0])
                            //remove one desert for player 2
                            newGame.P2DesertStack.pop()
                        }
                        //sets player turn to mod 2
                        newGame.PlayerTurn = (newGame.GameHistory.length) % 2
                        return true;
                    //catch all
                    default: return false
                }
            }
        }
    }//end processMove

    //method designed to execute when Koya is created to flip required roots 
    //CREATING AN ERROR? every seed is a root now...why??
    function flipRoots(koya: CreateKoya) {
        const w = newGame.boardWidth;
        const q = w + 1; //diagonal down
        const p = w - 1; //digonal up
        const W = w * 2 // step up
        let i = koya.Position
        let f = 0; //floating index
        //flips according to the shape of the koya
        //needs relative positioning in Spaces[]
        const koyaShape = koya.Shape.toUpperCase()
        console.log("Koya at index: " + i + " shape: " + koyaShape)
        switch (koyaShape) {
            case 'PLUS':
                //handle roots for PLUS
                f = i + 1
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + w
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - w
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - 1
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'X':
                //handle roots for X
                f = i + q
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + p
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - q
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - p
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'FIVER-VERTICAL':
                //handle roots for vertical fiver
                f = i + W
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + w
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - W
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - w
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'FIVER-HORIZONTAL':
                //handle roots for horizontal fiver
                f = i + 1
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + 2
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - 1
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - 2
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'FIVER-DIAGONAL-UP':
                //handle roots for diagonal fiver up /
                f = i + q
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + (2 * q)
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - q
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - (2 * q)
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'FIVER-DIAGONAL-DOWN':
                //handle roots for diagonal fiver down
                f = i + p
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + (2 * p)
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - p
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - (2 * p)
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'SQUIGGLE-HORIZONTAL-DOWN':
                //handle roots for squiggle '-.
                f = i + q
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - q
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + 1
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - 1
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'SQUIGGLE-HORIZONTAL-UP':
                //handle roots for squiggle .-'
                f = i + p
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - p
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + 1
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - 1
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'SQUIGGLE-VERTICAL-UP':
                //handle roots for squiggle .|'
                f = i + p
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - p
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + w
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - w
                newGame.Spaces[f].Pieces[0].root(f)
                break;
            case 'SQUIGGLE-VERTICAL-DOWN':
                //handle roots for squiggle '|.
                f = i + q
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - q
                newGame.Spaces[f].Pieces[0].root(f)
                f = i + w
                newGame.Spaces[f].Pieces[0].root(f)
                f = i - w
                newGame.Spaces[f].Pieces[0].root(f)
                break;

            default: console.log("no shape match for: " + koyaShape)

        }
    }
    //add root pairs to increase score
    function addRootPair(trunkIndexes: number[]) {
        //takes in an array of numbers for ID's of where trunks are

        //itterates through that array of numbers, checks for new branches on every axis

        //updates the game score using Space[id].getScore
    }
    //Function to update the neighborBranch array when a seed or root is placed
    /*
      visually, the relative indexes map this way in the neighborBranch array:
      where w is the width of the board
    
      relative positions
    
            [i-2(w+1)]            [ i-2w  ]           [i-2(w-1)]
                      [ i-(w+1) ] [  i-w  ] [ i-(w-1) ]
           [   i-2  ] [   i-1   ] [   i   ] [  i+1  ] [   i+2   ]
                      [ i+(w-1) ] [  i+w  ] [ i+(w+1) ]
            [i+2(w-1)]            [  i+2w ]           [ i+2(w+1) ]
    
    possible to set two additional variables for diagonal routes
      q = w + 1
      p = w - 1
    
            [ i-2q ]         [ i-2w ]        [ i-2p ]
                     [ i-q ] [ i-w ] [ i-p ]
            [ i-2  ] [ i-1 ] [  i  ] [ i+1 ] [  i+2  ]
                     [ i+p ] [ i+w ] [ i+q ]
            [ i+2p ]         [ i+2w ]        [ i+2q ]
    
    Within NeighborStates of each space, an array of length 16 exists
              [15]    [08]   [09]
                  [07][00][01]
              [14][06][XX][02][10]
                  [05][04][03]
              [13]    [12]   [11]
    
    to map updated neighbors when XX changes, find relative index on the board above
    and change the matching neibhor state for the neighbors
    for example: if a p1 seed gets added to index 22 on the board, index [22-w] directly
    above will need to update it's neighbor spaces array and have index [04] of 
    neighborBranches set to p1
     
    */
    function helperUpdateNeighborBranches(relativePosition: number, neighborPosition: number, player: number) {
        if (relativePosition >= 0 && relativePosition < (newGame.boardWidth * newGame.boardWidth)) {
            //use spaces native function -- needs to change for server!
            newGame.Spaces[relativePosition].updateBranch(neighborPosition, player)
        }
        else console.log("Relative Array Position Out of Range: " + relativePosition)

    }
    //works really well!
    function updateNeighborBranches(targetSpaceID: number, player: number) {
        //check for skip protocol from checkKoya (returns -1)
        if (targetSpaceID < 0) {
            //skip
        }
        else {
            //Set the initial variables to play with
            let i = targetSpaceID; //easier to manipulate
            const w = newGame.boardWidth;
            //saved constants for diagonals 
            const q = w + 1; //down to the right
            const p = w - 1; //up to the right

            let f; //floating index relative position
            let t; //floating index neighborBranch position (between 0-16)
            //print my state 
            //console.log(newGame.Spaces[targetSpaceID].myState.printType())
            // method inside Space updateBranch(index: number, newBranchState: number)
            //CHECKS FOR INDEX OUT OF RANGE WITH HELPER METHOD
            switch (player) {
                //player 2
                case 0:
                    //setPlayer2 for all the opposite indexes 
                    //set one above, two above, one below, two below

                    f = i - w//relative position one above
                    t = 4; //neighbor position one below
                    helperUpdateNeighborBranches(f, t, 0)

                    f = i - (2 * w)//relative position two above 
                    t = 12; //neighbor position two below
                    helperUpdateNeighborBranches(f, t, 0)

                    f = i + w//relative position one below
                    t = 0; //neighbor position one above
                    helperUpdateNeighborBranches(f, t, 0)

                    f = i + (2 * w)//relative position two below 
                    t = 8; //neighbor position two above
                    helperUpdateNeighborBranches(f, t, 0)


                    //set one left, two left, one right, two right

                    f = i - 1 //relative position one left  
                    t = 2; //neighbor position one right
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i - 2 //relative position two left  
                    t = 10; //neighbor position two right
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i + 1 //relative position one right  
                    t = 6; //neighbor position one left
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i + 2 //relative position two right  
                    t = 14; //neighbor position two left
                    helperUpdateNeighborBranches(f, t, 0)

                    //set \ diagonal one left, two left, one right, two right

                    f = i - q //relative position \ up one left  
                    t = 3; //neighbor position \ down one right
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i - (2 * q) //relative position \ up two left  
                    t = 11; //neighbor position \ down two right
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i + q //relative position \ down one left  
                    t = 7; //neighbor position \ up one right
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i + (2 * q) //relative position \ down two left  
                    t = 15; //neighbor position \ up two right
                    helperUpdateNeighborBranches(f, t, 0)

                    //set / diagonal one left, two left, one right, two right

                    f = i - p //relative position / up one right 
                    t = 5; //neighbor position / down one left
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i - (2 * p) //relative position / up two right 
                    t = 13; //neighbor position / down two left
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i + p //relative position / down one left 
                    t = 1; //neighbor position / up one right
                    helperUpdateNeighborBranches(f, t, 0)
                    f = i + (2 * p) //relative position / down two left 
                    t = 9; //neighbor position / up two right
                    helperUpdateNeighborBranches(f, t, 0)

                    break;
                //player 1
                case 1:
                    //setPlayer1 for all the opposite indexes 
                    //set one above, two above, one below, two below

                    f = i - w//relative position one above
                    t = 4; //neighbor position one below
                    helperUpdateNeighborBranches(f, t, 1)

                    f = i - (2 * w)//relative position two above 
                    t = 12; //neighbor position two below
                    helperUpdateNeighborBranches(f, t, 1)

                    f = i + w//relative position one below
                    t = 0; //neighbor position one above
                    helperUpdateNeighborBranches(f, t, 1)

                    f = i + (2 * w)//relative position two below 
                    t = 8; //neighbor position two above
                    helperUpdateNeighborBranches(f, t, 1)


                    //set one left, two left, one right, two right

                    f = i - 1 //relative position one left  
                    t = 2; //neighbor position one right
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i - 2 //relative position two left  
                    t = 10; //neighbor position two right
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i + 1 //relative position one right  
                    t = 6; //neighbor position one left
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i + 2 //relative position two right  
                    t = 14; //neighbor position two left
                    helperUpdateNeighborBranches(f, t, 1)

                    //set \ diagonal one left, two left, one right, two right

                    f = i - q //relative position \ up one left  
                    t = 3; //neighbor position \ down one right
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i - (2 * q) //relative position \ up two left  
                    t = 11; //neighbor position \ down two right
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i + q //relative position \ down one left  
                    t = 7; //neighbor position \ up one right
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i + (2 * q) //relative position \ down two left  
                    t = 15; //neighbor position \ up two right
                    helperUpdateNeighborBranches(f, t, 1)

                    //set / diagonal one left, two left, one right, two right

                    f = i - p //relative position / up one right 
                    t = 5; //neighbor position / down one left
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i - (2 * p) //relative position / up two right 
                    t = 13; //neighbor position / down two left
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i + p //relative position / down one left 
                    t = 1; //neighbor position / up one right
                    helperUpdateNeighborBranches(f, t, 1)
                    f = i + (2 * p) //relative position / down two left 
                    t = 9; //neighbor position / up two right
                    helperUpdateNeighborBranches(f, t, 1)
                    break;
                //koya piece!
                case 3:
                    //setKoya for all the opposite indexes 
                    //set one above, two above, one below, two below

                    f = i - w//relative position one above
                    t = 4; //neighbor position one below
                    helperUpdateNeighborBranches(f, t, 3)

                    f = i - (2 * w)//relative position two above 
                    t = 12; //neighbor position two below
                    helperUpdateNeighborBranches(f, t, 3)

                    f = i + w//relative position one below
                    t = 0; //neighbor position one above
                    helperUpdateNeighborBranches(f, t, 3)

                    f = i + (2 * w)//relative position two below 
                    t = 8; //neighbor position two above
                    helperUpdateNeighborBranches(f, t, 3)

                    //set one left, two left, one right, two right

                    f = i - 1 //relative position one left  
                    t = 2; //neighbor position one right
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i - 2 //relative position two left  
                    t = 10; //neighbor position two right
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i + 1 //relative position one right  
                    t = 6; //neighbor position one left
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i + 2 //relative position two right  
                    t = 14; //neighbor position two left
                    helperUpdateNeighborBranches(f, t, 3)

                    //set \ diagonal one left, two left, one right, two right

                    f = i - q //relative position \ up one left  
                    t = 3; //neighbor position \ down one right
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i - (2 * q) //relative position \ up two left  
                    t = 11; //neighbor position \ down two right
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i + q //relative position \ down one left  
                    t = 7; //neighbor position \ up one right
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i + (2 * q) //relative position \ down two left  
                    t = 15; //neighbor position \ up two right
                    helperUpdateNeighborBranches(f, t, 3)

                    //set / diagonal one left, two left, one right, two right

                    f = i - p //relative position / up one right 
                    t = 5; //neighbor position / down one left
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i - (2 * p) //relative position / up two right 
                    t = 13; //neighbor position / down two left
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i + p //relative position / down one left 
                    t = 1; //neighbor position / up one right
                    helperUpdateNeighborBranches(f, t, 3)
                    f = i + (2 * p) //relative position / down two left 
                    t = 9; //neighbor position / up two right
                    helperUpdateNeighborBranches(f, t, 3)
                    break;
                //trunk created,  Koya created
                case -1:
                    console.log("UPDATE_NEIGHBOR_BRANCHES: TRUNK")
                    //setTrunk for all the opposite indexes 
                    //set one above, two above, one below, two below

                    f = i - w//relative position one above
                    t = 4; //neighbor position one below
                    helperUpdateNeighborBranches(f, t, -1)

                    f = i - (2 * w)//relative position two above 
                    t = 12; //neighbor position two below
                    helperUpdateNeighborBranches(f, t, -1)

                    f = i + w//relative position one below
                    t = 0; //neighbor position one above
                    helperUpdateNeighborBranches(f, t, -1)

                    f = i + (2 * w)//relative position two below 
                    t = 8; //neighbor position two above
                    helperUpdateNeighborBranches(f, t, -1)


                    //set one left, two left, one right, two right

                    f = i - 1 //relative position one left  
                    t = 2; //neighbor position one right
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i - 2 //relative position two left  
                    t = 10; //neighbor position two right
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i + 1 //relative position one right  
                    t = 6; //neighbor position one left
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i + 2 //relative position two right  
                    t = 14; //neighbor position two left
                    helperUpdateNeighborBranches(f, t, -1)

                    //set \ diagonal one left, two left, one right, two right

                    f = i - q //relative position \ up one left  
                    t = 3; //neighbor position \ down one right
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i - (2 * q) //relative position \ up two left  
                    t = 11; //neighbor position \ down two right
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i + q //relative position \ down one left  
                    t = 7; //neighbor position \ up one right
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i + (2 * q) //relative position \ down two left  
                    t = 15; //neighbor position \ up two right
                    helperUpdateNeighborBranches(f, t, -1)

                    //set / diagonal one left, two left, one right, two right

                    f = i - p //relative position / up one right 
                    t = 5; //neighbor position / down one left
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i - (2 * p) //relative position / up two right 
                    t = 13; //neighbor position / down two left
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i + p //relative position / down one left 
                    t = 1; //neighbor position / up one right
                    helperUpdateNeighborBranches(f, t, -1)
                    f = i + (2 * p) //relative position / down two left 
                    t = 9; //neighbor position / up two right
                    helperUpdateNeighborBranches(f, t, -1)
                    break;
                default: console.log("ERROR UPDATE NEIGHBOR BRANCHES")
            }

        }

    }
    //simple sanity check to prevent invalid inputs from user
    function checkMoveTypeInput(userInput: string): boolean {
        switch (userInput) {
            case "M": //move pieces
                return true
            case "S": //place seed
                return true
            case "D": //place desert
                return true
            case "K": //place koya
                return true
            default: return false
        }
    }//end checkMoveTypeInput

}//end POST route
