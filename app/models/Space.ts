import Piece from './Piece'
import Branch from './Branch'

class Space {
    //branches array
    neighborBranches: Branch[]
    //need to hold my own branch state
    myState: Branch
    //array to hold pieces stack in this space
    Pieces: Piece[]
    //score to quickly calculate who wins!
    score: number
    //id of this space
    spaceID: number
    //player ownership (ONLY USED FOR SCORING)
    spacePlayer: number

    constructor(id: number) {
        //set all Branches
        this.neighborBranches = []
        //run 16 times to create empty neighbor states
        for (let i = 0; i < 16; i++) {
            this.neighborBranches.push(new Branch(false, false))
        }
        //empty pieces array for now
        this.Pieces = []
        //every space is empty to begin with
        this.myState = new Branch(false, false)
        //no score to begin with
        this.score = 0;
        //set id of this space
        this.spaceID = id;
        //set player to 0 for now (ONLY USED FOR SCORING!)
        this.spacePlayer = 0;
    }

    //This Method is used by the Gameboard to update branches
    updateBranch(index: number, newBranch: Branch) {
        //Branches are used for verifying root channels
        /*
                   visually, the neighborBranches map this way in the array:

                                   [15]    [08]    [09]
                                       [07][00][01]
                                   [14][06][  ][02][10]
                                       [05][04][03]
                                   [13]    [12]   [11]
        */
        //common sense checks for array sizes
        if (index < 16 && index > 0) {
            //assuming we are using the Branches[] array
            //assign new Branch value
            this.neighborBranches[index] = newBranch
        }
        else console.log("updateBranch failed -- index out of range")

    }
    //returns a false OR the index of the new Trunk (i.e. this index)
    checkKoya(): boolean | number {
        //Branches are used for verifying root channels
        /*
                   visually, the neighborBranches map this way in the array:
                   
                                   [15]    [08]    [09]
                                       [07][00][01]
                                   [14][06][  ][02][10]
                                       [05][04][03]
                                   [13]    [12]   [11]
        */
        //check if this space plays for both players
        if (this.myState.checkPlayer1() && this.myState.checkPlayer2()) {
            //This is the koya piece. It cannot become a trunk.
            return false
        }
        else if ((this.myState.checkPlayer1() == false) && (this.myState.checkPlayer2() == false)) {
            //this space is empty, a trunk, or a desert
            return false
        }
        else if (this.checkPlus()) {
            //I am a plus
            this.myState.makeTrunk
            return this.spaceID
        }
        else if (this.checkX()) {
            //I am an X shape
            this.myState.makeTrunk
            return this.spaceID
        }
        else if (this.checkSquiggles()) {
            //I am a squigle 
            this.myState.makeTrunk
            return this.spaceID
        }
        else if (this.checkFivers()) {
            //I am a fiver
            this.myState.makeTrunk
            return this.spaceID
        }
        //found nothing
        else return false
    }
    checkPlus(): boolean {
        //Branches are used for verifying root channels
        /*
                   visually, the neighborBranches map this way in the array:

                                   [15]    [08]    [09]
                                       [07][00][01]
                                   [14][06][  ][02][10]
                                       [05][04][03]
                                   [13]    [12]   [11]
        */
        //split into checking for Player1 or Player2
        if (this.myState.checkPlayer1()) {
            //Plus shape is indexes 0, 2, 4, 6
            if ((this.neighborBranches[0].checkPlayer1() && this.neighborBranches[2].checkPlayer1()) &&
                (this.neighborBranches[4].checkPlayer1() && this.neighborBranches[6].checkPlayer1())) {
                //verified this is a plus + shape
                return true
            }
            //no plus shape
            else return false
        }
        else if (this.myState.checkPlayer2()) {
            //Plus shape is indexes 0, 2, 4, 6
            if ((this.neighborBranches[0].checkPlayer2() && this.neighborBranches[2].checkPlayer2()) &&
                (this.neighborBranches[4].checkPlayer2() && this.neighborBranches[6].checkPlayer2())) {
                //verified this is a plus + shape
                return true
            }
            //no plus shape
            else return false
        }
        //neither player
        else return false
    }
    checkX(): boolean {
        //Branches are used for verifying root channels
        /*
                   visually, the neighborBranches map this way in the array:

                                   [15]    [08]    [09]
                                       [07][00][01]
                                   [14][06][  ][02][10]
                                       [05][04][03]
                                   [13]    [12]   [11]
        */
        //split into checking for Player1 or Player2
        if (this.myState.checkPlayer1()) {
            //X shape is indexes 7, 1, 3, 5
            if ((this.neighborBranches[7].checkPlayer1() && this.neighborBranches[1].checkPlayer1()) &&
                (this.neighborBranches[3].checkPlayer1() && this.neighborBranches[5].checkPlayer1())) {
                //verified this is an X shape
                return true
            }
            //no X shape
            else return false
        }
        else if (this.myState.checkPlayer2()) {
            //X shape is indexes 7, 1, 3, 5
            if ((this.neighborBranches[7].checkPlayer2() && this.neighborBranches[1].checkPlayer2()) &&
                (this.neighborBranches[3].checkPlayer2() && this.neighborBranches[5].checkPlayer2())) {
                //verified this is an X shape
                return true
            }
            //no X shape
            else return false
        }
        //neither player
        else return false
    }
    checkSquiggles(): boolean {
        //Branches are used for verifying root channels
        /*
                   visually, the neighborBranches map this way in the array:

                                   [15]    [08]    [09]
                                       [07][00][01]
                                   [14][06][  ][02][10]
                                       [05][04][03]
                                   [13]    [12]   [11]
        */
        //split into checking for Player1 or Player2
        if (this.myState.checkPlayer1()) {
            //horizontal left squiggle shape is indexes 7, 6, 2, 3
            if ((this.neighborBranches[7].checkPlayer1() && this.neighborBranches[6].checkPlayer1()) &&
                (this.neighborBranches[2].checkPlayer1() && this.neighborBranches[3].checkPlayer1())) {
                //verified this is a squiggle shape
                return true

            }
            //horizontal right squiggle shape is indexes 1, 2, 6, 5
            else if ((this.neighborBranches[1].checkPlayer1() && this.neighborBranches[6].checkPlayer1()) &&
                (this.neighborBranches[2].checkPlayer1() && this.neighborBranches[5].checkPlayer1())) {
                //verified this is a squiggle shape
                return true
            }
            //vertical left squiggle shape is indexes 7, 0, 4, 3
            else if ((this.neighborBranches[7].checkPlayer1() && this.neighborBranches[0].checkPlayer1()) &&
                (this.neighborBranches[4].checkPlayer1() && this.neighborBranches[3].checkPlayer1())) {
                //verified this is a squiggle shape
                return true
            }
            //vertical right squiggle shape is indexes 1, 0, 4, 5
            else if ((this.neighborBranches[1].checkPlayer1() && this.neighborBranches[0].checkPlayer1()) &&
                (this.neighborBranches[4].checkPlayer1() && this.neighborBranches[5].checkPlayer1())) {
                //verified this is a squiggle shape
                return true
            }
            //did not get perfect matches on fiver branches == NO KOYAS!
            return false
        }
        else if (this.myState.checkPlayer2()) {
            //horizontal left squiggle shape is indexes 7, 6, 2, 3
            if ((this.neighborBranches[7].checkPlayer2() && this.neighborBranches[6].checkPlayer2()) &&
                (this.neighborBranches[2].checkPlayer2() && this.neighborBranches[3].checkPlayer2())) {
                //verified this is a squiggle shape
                return true

            }
            //horizontal right squiggle shape is indexes 1, 2, 6, 5
            else if ((this.neighborBranches[1].checkPlayer2() && this.neighborBranches[6].checkPlayer2()) &&
                (this.neighborBranches[2].checkPlayer2() && this.neighborBranches[5].checkPlayer2())) {
                //verified this is a squiggle shape
                return true
            }
            //vertical left squiggle shape is indexes 7, 0, 4, 3
            else if ((this.neighborBranches[7].checkPlayer2() && this.neighborBranches[0].checkPlayer2()) &&
                (this.neighborBranches[4].checkPlayer2() && this.neighborBranches[3].checkPlayer2())) {
                //verified this is a squiggle shape
                return true
            }
            //vertical right squiggle shape is indexes 1, 0, 4, 5
            else if ((this.neighborBranches[1].checkPlayer2() && this.neighborBranches[0].checkPlayer2()) &&
                (this.neighborBranches[4].checkPlayer2() && this.neighborBranches[5].checkPlayer2())) {
                //verified this is a squiggle shape
                return true
            }
            //did not get perfect matches on fiver branches == NO KOYAS!
            return false
        }
        //this space is not either player
        else return false
    }
    checkFivers(): boolean {
        //Branches are used for verifying root channels
        /*
                   visually, the neighborBranches map this way in the array:
                   
                                   [15]    [08]    [09]
                                       [07][00][01]
                                   [14][06][  ][02][10]
                                       [05][04][03]
                                   [13]    [12]   [11]
        */
        //split into checking for Player1 or Player2
        if (this.myState.checkPlayer1()) {
            //vertical fiver is indexes 0, 4, 8, 12
            if ((this.neighborBranches[0].checkPlayer1() && this.neighborBranches[4].checkPlayer1()) &&
                (this.neighborBranches[8].checkPlayer1() && this.neighborBranches[12].checkPlayer1())) {
                //verified this is a vertical fiver!
                return true

            }
            //horizontal fiver is indexes 2, 6, 10, 14
            else if ((this.neighborBranches[2].checkPlayer1() && this.neighborBranches[6].checkPlayer1()) &&
                (this.neighborBranches[10].checkPlayer1() && this.neighborBranches[14].checkPlayer1())) {
                //verified this is a horizontal fiver!
                return true
            }
            //diagonal left fiver is indexes 3, 7, 11, 15
            else if ((this.neighborBranches[3].checkPlayer1() && this.neighborBranches[7].checkPlayer1()) &&
                (this.neighborBranches[11].checkPlayer1() && this.neighborBranches[15].checkPlayer1())) {
                //verified this is a diagonal left fiver!
                return true
            }
            //diagonal right fiver is indexes 1, 5, 9, 13
            else if ((this.neighborBranches[1].checkPlayer1() && this.neighborBranches[5].checkPlayer1()) &&
                (this.neighborBranches[9].checkPlayer1() && this.neighborBranches[13].checkPlayer1())) {
                //verified this is a diagonal right fiver!
                return true
            }
            //did not get perfect matches on fiver branches == NO KOYAS!
            return false
        }
        else if (this.myState.checkPlayer2()) {
            //vertical fiver is indexes 0, 4, 8, 12
            if ((this.neighborBranches[0].checkPlayer2() && this.neighborBranches[4].checkPlayer2()) &&
                (this.neighborBranches[8].checkPlayer2() && this.neighborBranches[12].checkPlayer2())) {
                //verified this is a vertical fiver!
                return true

            }
            //horizontal fiver is indexes 2, 6, 10, 14
            else if ((this.neighborBranches[2].checkPlayer2() && this.neighborBranches[6].checkPlayer2()) &&
                (this.neighborBranches[10].checkPlayer2() && this.neighborBranches[14].checkPlayer2())) {
                //verified this is a horizontal fiver!
                return true
            }
            //diagonal left fiver is indexes 3, 7, 11, 15
            else if ((this.neighborBranches[3].checkPlayer2() && this.neighborBranches[7].checkPlayer2()) &&
                (this.neighborBranches[11].checkPlayer2() && this.neighborBranches[15].checkPlayer2())) {
                //verified this is a diagonal left fiver!
                return true
            }
            //diagonal right fiver is indexes 1, 5, 9, 13
            else if ((this.neighborBranches[1].checkPlayer2() && this.neighborBranches[5].checkPlayer2()) &&
                (this.neighborBranches[9].checkPlayer2() && this.neighborBranches[13].checkPlayer2())) {
                //verified this is a diagonal right fiver!
                return true
            }
            //did not get perfect matches on fiver branches == NO KOYAS!
            return false
        }
        else return false
    }

    //NEED TO MOVE TO GAMEBOARD
    sendBranchState() {
        //need to tell all the branches near me that I have changed myState
        //read what I wrote using (index+4)%8 to map indexes for Branch[]
        //Need to send this branchState up to Gameboard level to access/alter neighbor spaces
    }

    getScore(): number {
        if (this.Pieces.length < 2) {
            //score remains 0 for empty space or single piece.
        }
        else if (this.Pieces.length > 2) {
            //if we have more than a 2 stack, set score to 1
            this.score = 1;
            //loop for exponential score calculation
            for (let i = 3; i < this.Pieces.length; i++) {
                //multiply by 2 beginning with index 2
                this.score * 2; //2, 4, 8, etc.
            }
        }
        else {
            //not empty, stack less than 3 = single koya
            this.score = 1;
        }
        return this.score;
    }

    //NOTE: this will need to work with GAME level logic to ensure
    // popping pieces out of your player supply Piece[]
    addPiece(addedPiece: Piece): boolean {
        //sanity check for (not empty) and (isBurst) i.e. koya, desert, dead trunk
        if (this.Pieces.length != 0 && this.Pieces[0].isBurst == true) {
            //not an empty space
            console.log("CANNOT ADD PIECE")
            return false
        }
        else {
            //add the new piece to the stack of pieces
            this.Pieces.push(addedPiece)
            return true
        }
    }

}
export default Space