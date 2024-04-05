//Branches are used for verifying root channels
//that just means I am my left neighbor's right neighbor, etc.
/*
    visually, the relative indexes map this way in the array:

         [i-2(w+1)]           [ i-2w ]         [i-2(w-1)]
                    [ i-w-1 ] [ i-w ] [ i-w+1 ]
          [  i-2  ] [  i-1  ] [  i  ] [  i+1  ] [  i+2  ]
                    [ i+w-1 ] [ i+w ] [ i+w+1 ]
         [i+2(w-1)]           [ i+2w ]         [i+2(w+1)]
*/
import Piece from "./Piece"
import Space from "./Space"
import Move from "./Move"
import CreateKoya from "./CreateKoya"

class Gameboard {
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

    constructor() {
        //fixed boardwith at 9 for now.
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
    }//end constructor

    //process move from raw input
    processMove(location: number, player: number, moveType: string): boolean {
        //check valid turn for player
        if (player != this.PlayerTurn) {
            //not your turn
            console.log("NOT YOUR TURN")
            console.log('TURN: ' + this.PlayerTurn + " INPUT: " + player)
            return false;
        }
        //check if location is outside the game array
        else if (location >= (this.boardWidth * this.boardWidth)) {
            //location outside the board
            console.log("LOCATION OUTSIDE THE BOARD: " + location)
            return false
        }
        //check for valid input type : "M" "K" "S" "D"
        else if (!this.checkMoveTypeInput(moveType.toUpperCase())) {
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
            if (this.GameHistory.length < 4) {
                //first four moves of the game! Must be deserts
                if (moveType.toUpperCase() != 'D') {
                    //invalid
                    console.log('INVALID MOVE')
                    console.log('EACH PLAYERS FIRST 2 MOVES MUST BE DESERTS')
                    console.log(this.GameHistory)
                    return false
                }
                //adds our deserts
                if (this.PlayerTurn == 1) {
                    //adds a desert on the board!
                    if (this.Spaces[location].addPiece(this.P1DesertStack[0])) {
                        //remove one desert for player 1
                        this.P1DesertStack.pop()
                    }
                    else return false;
                }
                //remove one desert for player 2
                else {
                    if (this.Spaces[location].addPiece(this.P2DesertStack[0])) {
                        //remove one desert for player 2
                        this.P2DesertStack.pop()
                    }
                    else return false;
                }
                //create a move and add it to the game history
                this.GameHistory.push(new Move(player, moveType.toUpperCase(), location, this.Scoreboard))
                //sets player turn to length+1 mod 2
                this.PlayerTurn = (this.GameHistory.length + 1) % 2
                return true;
            }
            //player 1's first seed (heading into turn 5)
            else if (this.GameHistory.length == 4) {
                //P1's first move must be a seed
                if (moveType.toUpperCase() != 'S') {
                    //invalid
                    console.log('INVALID MOVE -- P1 MUST PLACE A SEED')
                    return false
                }
                else if (this.Spaces[location].addPiece(this.P1SeedStack[0])) {
                    //create a move and add it to the game history
                    this.GameHistory.push(new Move(player, moveType.toUpperCase(), location, this.Scoreboard))
                    //remove one seed for player 1
                    this.P1SeedStack.pop()
                    //update neighbors
                    this.updateNeighborBranches(location, 1)
                    //sets player turn to length+1 mod 2
                    this.PlayerTurn = (this.GameHistory.length + 1) % 2
                    return true;
                }
                else return false;
            }
            //Player 2's first seed (heading into turn 6)
            else if (this.GameHistory.length == 5) {
                //P2's first move must be a seed
                if (moveType.toUpperCase() != 'S') {
                    //invalid
                    console.log('INVALID MOVE -- P2 MUST PLACE A SEED')
                    return false
                }
                //adds a seed on the board!
                else if (this.Spaces[location].addPiece(this.P2SeedStack[0])) {
                    //create a move and add it to the game history
                    this.GameHistory.push(new Move(player, moveType.toUpperCase(), location, this.Scoreboard))
                    //remove one seed for player 2
                    this.P2SeedStack.pop()
                    //update neighbors
                    this.updateNeighborBranches(location, 0)
                    //SKIP CHANGE PLAYER!! P2 get to go AGAIN!
                    console.log("GO AGAIN PLAYER 2 -- YOUR NEXT SEED IS THE KOYA")
                    return true;
                }
                else return false;

            }
            //Player 2's SECOND move...THE KOYA!
            else if (this.GameHistory.length == 6) {
                //P2's second move must be THE KOYA!
                if (moveType.toUpperCase() != 'S') {
                    //invalid
                    console.log('INVALID MOVE')
                    console.log("PlAYER 2 MUST NOW PLACE A SEED AS THE KOYA")
                    return false
                }
                else if (this.Spaces[location].addPiece(this.Koya)) {
                    //places the koya piece!
                    //create the koya move and add it to the game history
                    this.GameHistory.push(new Move(player, "K", location, this.Scoreboard))
                    //update neighbors
                    this.updateNeighborBranches(location, 3)//the only time a 3 is passed in
                    //sets player turn to normal after skipped turn
                    this.PlayerTurn = (this.GameHistory.length) % 2
                    console.log("vvv GAME LENGTH SHOULD NOW BE 7")
                    console.log(this.GameHistory.length)
                    return true;
                }
                else return false;

            }
            //out of pre-game phase!
            //LIVE GAME MODE
            else {
                //check if the game is over! (no more pieces for current player)
                if (this.PlayerTurn == 1 && (this.P1SeedStack.length == 0 && this.P1DesertStack.length == 0)) {
                    //Player 1 is out of pieces
                    console.log("GAME OVER -- PLAYER 1 OUT OF PIECES")
                    return false;
                }
                else if (this.PlayerTurn != 1 && (this.P2SeedStack.length == 0 && this.P2DesertStack.length == 0)) {
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
                        if (this.PlayerTurn == 1) {
                            //check supply
                            if (this.P1SeedStack.length == 0) {
                                //out of seeds!
                                console.log("PLAYER 1 OUT OF SEEDS")
                                return false
                            }
                            //adds a seed on the board!
                            else if (this.Spaces[location].addPiece(this.P1SeedStack[0])) {
                                //create a move and add it to the game history
                                this.GameHistory.push(new Move(player, moveType.toUpperCase(), location, this.Scoreboard))
                                //remove one seed for player 1
                                this.P1SeedStack.pop()
                                //update neighbors
                                this.updateNeighborBranches(location, 1)
                            }
                            else {
                                console.log("PLACE SEED ERROR")
                                return false;
                            }
                        }
                        //place seed for player 2
                        else {
                            //check supply
                            if (this.P2SeedStack.length == 0) {
                                //out of seeds!
                                console.log("PLAYER 2 OUT OF SEEDS")
                                return false
                            }
                            //adds a seed on the board!
                            else if (this.Spaces[location].addPiece(this.P2SeedStack[0])) {
                                //create a move and add it to the game history
                                this.GameHistory.push(new Move(player, moveType.toUpperCase(), location, this.Scoreboard))
                                //remove one seed for player 2
                                this.P2SeedStack.pop()
                                //update neighbors
                                this.updateNeighborBranches(location, 0)
                            }
                            else {
                                console.log("PLACE SEED ERROR")
                                return false;
                            }
                        }
                        //check for koyas an all spaces
                        this.Spaces.forEach(space => {
                            let found = false;
                            const createdKoya = space.checkKoya();
                            //if we find a koya, the return position is greater than 0
                            if (createdKoya.Position > 0) {
                                //extract koyaID
                                const koyaID = createdKoya.Position
                                //CHECK IF THIS KOYA HAS ALREADY BEEN RECORDED
                                this.allTrunks.forEach((index) => {
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
                                    this.updateNeighborBranches(koyaID, -1)
                                    //need to add a piece to the location
                                    if (space.Pieces[0].isP1) {
                                        //add a player 1 seed piece to the stack
                                        this.Spaces[koyaID].addPiece(this.P1SeedStack[0], true)
                                        //remove one seed for player 1
                                        this.P1SeedStack.pop()
                                    }
                                    else {
                                        //add a player 2 seed piece to the stack
                                        this.Spaces[koyaID].addPiece(this.P2SeedStack[0], true)
                                        //remove one seed for player 2
                                        this.P2SeedStack.pop()
                                    }
                                    //updates roots according to shape
                                    this.flipRoots(createdKoya)
                                    //created koya trunk ID gets added to allTrunks array
                                    this.allTrunks.push(createdKoya.Position)
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
                        this.PlayerTurn = (this.GameHistory.length) % 2
                        return true;
                    //valid player, placing a desert piece
                    case "D":
                        //place desert for player 1
                        if (this.PlayerTurn == 1) {
                            //check supply
                            if (this.P1DesertStack.length == 0) {
                                //out of deserts
                                console.log("P1 OUT OF DESERTS")
                                return false
                            }
                            //create a move and add it to the game history
                            this.GameHistory.push(new Move(player, moveType.toUpperCase(), location, this.Scoreboard))
                            //adds a desert on the board!
                            this.Spaces[location].addPiece(this.P1DesertStack[0])
                            //remove one desert for player 1
                            this.P1DesertStack.pop()
                            //needs to update the neighborStates!

                        }
                        //place desert for player 2
                        else {
                            //check supply
                            if (this.P2DesertStack.length == 0) {
                                //out of deserts
                                console.log("P2 OUT OF DESERTS")
                                return false
                            }
                            //create a move and add it to the game history
                            this.GameHistory.push(new Move(player, moveType.toUpperCase(), location, this.Scoreboard))
                            //adds a desert on the board!
                            this.Spaces[location].addPiece(this.P2DesertStack[0])
                            //remove one desert for player 2
                            this.P2DesertStack.pop()
                        }
                        //sets player turn to mod 2
                        this.PlayerTurn = (this.GameHistory.length) % 2
                        return true;
                    //catch all
                    default: return false
                }
            }
        }
    }//end processMove

    //method designed to execute when Koya is created to flip required roots 
    //CREATING AN ERROR? every seed is a root now...why??
    flipRoots(koya: CreateKoya) {
        const w = this.boardWidth;
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
                this.Spaces[f].Pieces[0].root(f)
                f = i + w
                this.Spaces[f].Pieces[0].root(f)
                f = i - w
                this.Spaces[f].Pieces[0].root(f)
                f = i - 1
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'X':
                //handle roots for X
                f = i + q
                this.Spaces[f].Pieces[0].root(f)
                f = i + p
                this.Spaces[f].Pieces[0].root(f)
                f = i - q
                this.Spaces[f].Pieces[0].root(f)
                f = i - p
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'FIVER-VERTICAL':
                //handle roots for vertical fiver
                f = i + W
                this.Spaces[f].Pieces[0].root(f)
                f = i + w
                this.Spaces[f].Pieces[0].root(f)
                f = i - W
                this.Spaces[f].Pieces[0].root(f)
                f = i - w
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'FIVER-HORIZONTAL':
                //handle roots for horizontal fiver
                f = i + 1
                this.Spaces[f].Pieces[0].root(f)
                f = i + 2
                this.Spaces[f].Pieces[0].root(f)
                f = i - 1
                this.Spaces[f].Pieces[0].root(f)
                f = i - 2
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'FIVER-DIAGONAL-UP':
                //handle roots for diagonal fiver up /
                f = i + q
                this.Spaces[f].Pieces[0].root(f)
                f = i + (2 * q)
                this.Spaces[f].Pieces[0].root(f)
                f = i - q
                this.Spaces[f].Pieces[0].root(f)
                f = i - (2 * q)
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'FIVER-DIAGONAL-DOWN':
                //handle roots for diagonal fiver down
                f = i + p
                this.Spaces[f].Pieces[0].root(f)
                f = i + (2 * p)
                this.Spaces[f].Pieces[0].root(f)
                f = i - p
                this.Spaces[f].Pieces[0].root(f)
                f = i - (2 * p)
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'SQUIGGLE-HORIZONTAL-DOWN':
                //handle roots for squiggle '-.
                f = i + q
                this.Spaces[f].Pieces[0].root(f)
                f = i - q
                this.Spaces[f].Pieces[0].root(f)
                f = i + 1
                this.Spaces[f].Pieces[0].root(f)
                f = i - 1
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'SQUIGGLE-HORIZONTAL-UP':
                //handle roots for squiggle .-'
                f = i + p
                this.Spaces[f].Pieces[0].root(f)
                f = i - p
                this.Spaces[f].Pieces[0].root(f)
                f = i + 1
                this.Spaces[f].Pieces[0].root(f)
                f = i - 1
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'SQUIGGLE-VERTICAL-UP':
                //handle roots for squiggle .|'
                f = i + p
                this.Spaces[f].Pieces[0].root(f)
                f = i - p
                this.Spaces[f].Pieces[0].root(f)
                f = i + w
                this.Spaces[f].Pieces[0].root(f)
                f = i - w
                this.Spaces[f].Pieces[0].root(f)
                break;
            case 'SQUIGGLE-VERTICAL-DOWN':
                //handle roots for squiggle '|.
                f = i + q
                this.Spaces[f].Pieces[0].root(f)
                f = i - q
                this.Spaces[f].Pieces[0].root(f)
                f = i + w
                this.Spaces[f].Pieces[0].root(f)
                f = i - w
                this.Spaces[f].Pieces[0].root(f)
                break;

            default: console.log("no shape match for: " + koyaShape)

        }
    }
    //add root pairs to increase score
    addRootPair(trunkIndexes: number[]) {
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
    helperUpdateNeighborBranches(relativePosition: number, neighborPosition: number, player: number) {
        if (relativePosition >= 0 && relativePosition < (this.boardWidth * this.boardWidth)) {
            //use spaces native function
            this.Spaces[relativePosition].updateBranch(neighborPosition, player)
        }
        else console.log("Relative Array Position Out of Range: " + relativePosition)

    }
    //works really well!
    updateNeighborBranches(targetSpaceID: number, player: number) {
        //check for skip protocol from checkKoya (returns -1)
        if (targetSpaceID < 0) {
            //skip
        }
        else {
            //Set the initial variables to play with
            let i = targetSpaceID; //easier to manipulate
            const w = this.boardWidth;
            //saved constants for diagonals 
            const q = w + 1; //down to the right
            const p = w - 1; //up to the right

            let f; //floating index relative position
            let t; //floating index neighborBranch position (between 0-16)
            //print my state 
            //console.log(this.Spaces[targetSpaceID].myState.printType())
            // method inside Space updateBranch(index: number, newBranchState: number)
            //CHECKS FOR INDEX OUT OF RANGE WITH HELPER METHOD
            switch (player) {
                //player 2
                case 0:
                    //setPlayer2 for all the opposite indexes 
                    //set one above, two above, one below, two below

                    f = i - w//relative position one above
                    t = 4; //neighbor position one below
                    this.helperUpdateNeighborBranches(f, t, 0)

                    f = i - (2 * w)//relative position two above 
                    t = 12; //neighbor position two below
                    this.helperUpdateNeighborBranches(f, t, 0)

                    f = i + w//relative position one below
                    t = 0; //neighbor position one above
                    this.helperUpdateNeighborBranches(f, t, 0)

                    f = i + (2 * w)//relative position two below 
                    t = 8; //neighbor position two above
                    this.helperUpdateNeighborBranches(f, t, 0)


                    //set one left, two left, one right, two right

                    f = i - 1 //relative position one left  
                    t = 2; //neighbor position one right
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i - 2 //relative position two left  
                    t = 10; //neighbor position two right
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i + 1 //relative position one right  
                    t = 6; //neighbor position one left
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i + 2 //relative position two right  
                    t = 14; //neighbor position two left
                    this.helperUpdateNeighborBranches(f, t, 0)

                    //set \ diagonal one left, two left, one right, two right

                    f = i - q //relative position \ up one left  
                    t = 3; //neighbor position \ down one right
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i - (2 * q) //relative position \ up two left  
                    t = 11; //neighbor position \ down two right
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i + q //relative position \ down one left  
                    t = 7; //neighbor position \ up one right
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i + (2 * q) //relative position \ down two left  
                    t = 15; //neighbor position \ up two right
                    this.helperUpdateNeighborBranches(f, t, 0)

                    //set / diagonal one left, two left, one right, two right

                    f = i - p //relative position / up one right 
                    t = 5; //neighbor position / down one left
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i - (2 * p) //relative position / up two right 
                    t = 13; //neighbor position / down two left
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i + p //relative position / down one left 
                    t = 1; //neighbor position / up one right
                    this.helperUpdateNeighborBranches(f, t, 0)
                    f = i + (2 * p) //relative position / down two left 
                    t = 9; //neighbor position / up two right
                    this.helperUpdateNeighborBranches(f, t, 0)

                    break;
                //player 1
                case 1:
                    //setPlayer1 for all the opposite indexes 
                    //set one above, two above, one below, two below

                    f = i - w//relative position one above
                    t = 4; //neighbor position one below
                    this.helperUpdateNeighborBranches(f, t, 1)

                    f = i - (2 * w)//relative position two above 
                    t = 12; //neighbor position two below
                    this.helperUpdateNeighborBranches(f, t, 1)

                    f = i + w//relative position one below
                    t = 0; //neighbor position one above
                    this.helperUpdateNeighborBranches(f, t, 1)

                    f = i + (2 * w)//relative position two below 
                    t = 8; //neighbor position two above
                    this.helperUpdateNeighborBranches(f, t, 1)


                    //set one left, two left, one right, two right

                    f = i - 1 //relative position one left  
                    t = 2; //neighbor position one right
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i - 2 //relative position two left  
                    t = 10; //neighbor position two right
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i + 1 //relative position one right  
                    t = 6; //neighbor position one left
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i + 2 //relative position two right  
                    t = 14; //neighbor position two left
                    this.helperUpdateNeighborBranches(f, t, 1)

                    //set \ diagonal one left, two left, one right, two right

                    f = i - q //relative position \ up one left  
                    t = 3; //neighbor position \ down one right
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i - (2 * q) //relative position \ up two left  
                    t = 11; //neighbor position \ down two right
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i + q //relative position \ down one left  
                    t = 7; //neighbor position \ up one right
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i + (2 * q) //relative position \ down two left  
                    t = 15; //neighbor position \ up two right
                    this.helperUpdateNeighborBranches(f, t, 1)

                    //set / diagonal one left, two left, one right, two right

                    f = i - p //relative position / up one right 
                    t = 5; //neighbor position / down one left
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i - (2 * p) //relative position / up two right 
                    t = 13; //neighbor position / down two left
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i + p //relative position / down one left 
                    t = 1; //neighbor position / up one right
                    this.helperUpdateNeighborBranches(f, t, 1)
                    f = i + (2 * p) //relative position / down two left 
                    t = 9; //neighbor position / up two right
                    this.helperUpdateNeighborBranches(f, t, 1)
                    break;
                //koya piece!
                case 3:
                    //setKoya for all the opposite indexes 
                    //set one above, two above, one below, two below

                    f = i - w//relative position one above
                    t = 4; //neighbor position one below
                    this.helperUpdateNeighborBranches(f, t, 3)

                    f = i - (2 * w)//relative position two above 
                    t = 12; //neighbor position two below
                    this.helperUpdateNeighborBranches(f, t, 3)

                    f = i + w//relative position one below
                    t = 0; //neighbor position one above
                    this.helperUpdateNeighborBranches(f, t, 3)

                    f = i + (2 * w)//relative position two below 
                    t = 8; //neighbor position two above
                    this.helperUpdateNeighborBranches(f, t, 3)

                    //set one left, two left, one right, two right

                    f = i - 1 //relative position one left  
                    t = 2; //neighbor position one right
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i - 2 //relative position two left  
                    t = 10; //neighbor position two right
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i + 1 //relative position one right  
                    t = 6; //neighbor position one left
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i + 2 //relative position two right  
                    t = 14; //neighbor position two left
                    this.helperUpdateNeighborBranches(f, t, 3)

                    //set \ diagonal one left, two left, one right, two right

                    f = i - q //relative position \ up one left  
                    t = 3; //neighbor position \ down one right
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i - (2 * q) //relative position \ up two left  
                    t = 11; //neighbor position \ down two right
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i + q //relative position \ down one left  
                    t = 7; //neighbor position \ up one right
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i + (2 * q) //relative position \ down two left  
                    t = 15; //neighbor position \ up two right
                    this.helperUpdateNeighborBranches(f, t, 3)

                    //set / diagonal one left, two left, one right, two right

                    f = i - p //relative position / up one right 
                    t = 5; //neighbor position / down one left
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i - (2 * p) //relative position / up two right 
                    t = 13; //neighbor position / down two left
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i + p //relative position / down one left 
                    t = 1; //neighbor position / up one right
                    this.helperUpdateNeighborBranches(f, t, 3)
                    f = i + (2 * p) //relative position / down two left 
                    t = 9; //neighbor position / up two right
                    this.helperUpdateNeighborBranches(f, t, 3)
                    break;
                //trunk created,  Koya created
                case -1:
                    console.log("UPDATE_NEIGHBOR_BRANCHES: TRUNK")
                    //setTrunk for all the opposite indexes 
                    //set one above, two above, one below, two below

                    f = i - w//relative position one above
                    t = 4; //neighbor position one below
                    this.helperUpdateNeighborBranches(f, t, -1)

                    f = i - (2 * w)//relative position two above 
                    t = 12; //neighbor position two below
                    this.helperUpdateNeighborBranches(f, t, -1)

                    f = i + w//relative position one below
                    t = 0; //neighbor position one above
                    this.helperUpdateNeighborBranches(f, t, -1)

                    f = i + (2 * w)//relative position two below 
                    t = 8; //neighbor position two above
                    this.helperUpdateNeighborBranches(f, t, -1)


                    //set one left, two left, one right, two right

                    f = i - 1 //relative position one left  
                    t = 2; //neighbor position one right
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i - 2 //relative position two left  
                    t = 10; //neighbor position two right
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i + 1 //relative position one right  
                    t = 6; //neighbor position one left
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i + 2 //relative position two right  
                    t = 14; //neighbor position two left
                    this.helperUpdateNeighborBranches(f, t, -1)

                    //set \ diagonal one left, two left, one right, two right

                    f = i - q //relative position \ up one left  
                    t = 3; //neighbor position \ down one right
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i - (2 * q) //relative position \ up two left  
                    t = 11; //neighbor position \ down two right
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i + q //relative position \ down one left  
                    t = 7; //neighbor position \ up one right
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i + (2 * q) //relative position \ down two left  
                    t = 15; //neighbor position \ up two right
                    this.helperUpdateNeighborBranches(f, t, -1)

                    //set / diagonal one left, two left, one right, two right

                    f = i - p //relative position / up one right 
                    t = 5; //neighbor position / down one left
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i - (2 * p) //relative position / up two right 
                    t = 13; //neighbor position / down two left
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i + p //relative position / down one left 
                    t = 1; //neighbor position / up one right
                    this.helperUpdateNeighborBranches(f, t, -1)
                    f = i + (2 * p) //relative position / down two left 
                    t = 9; //neighbor position / up two right
                    this.helperUpdateNeighborBranches(f, t, -1)
                    break;
                default: console.log("ERROR UPDATE NEIGHBOR BRANCHES")
            }

        }

    }
    //simple sanity check to prevent invalid inputs from user
    checkMoveTypeInput(userInput: string): boolean {
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

}//end Gameboard class

export default Gameboard