import Piece from './Piece'
import Branch from './Branch'
import CreateKoya from './CreateKoya'

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
            this.neighborBranches.push(new Branch())
        }
        //empty pieces array for now
        this.Pieces = []
        //every space is empty to begin with
        this.myState = new Branch()
        //no score to begin with
        this.score = 0;
        //set id of this space
        this.spaceID = id;
        //set player to -1 for now (ONLY USED FOR SCORING!)
        this.spacePlayer = -1;
    }

    //This Method is used by the Gameboard to update branches
    updateBranch(index: number, newBranchState: number) {
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
        if (index < 16 && index >= 0) {
            //assuming we are using the Branches[] array
            //assign new Branch value
            //I DON'T THINK WE SHOULD BE ASSIGNING BRANCHES
            //WE SHOULD BE CHANGING THE BRANCH STATE VIA BRANCH METHODS
            // example this.neighborBranches[index].makeKoya or .setPlayer1
            switch (newBranchState) {
                case 1:
                    //player 1
                    this.neighborBranches[index].setPlayer1()
                    break;
                case 0:
                    //player 2
                    this.neighborBranches[index].setPlayer2()
                    break;
                case 3:
                    //koya!
                    this.neighborBranches[index].makeKoya()
                    break;
                case -1:
                    //make trunks
                    this.neighborBranches[index].makeTrunk()
                    break;
                default: console.log("UPDATEBRANCH: BAD BRANCH STATE")
            }
        }
        else console.log("updateBranch failed -- index out of range: " + index)

    }
    //returns a -1 OR the index of the new Trunk (i.e. this index)

    //NEEDS TO PASS DATA TO CONVERT SEEDS TO ROOTS!! 
    //run that command out of each individual shape check
    checkKoya(): CreateKoya {
        //create the koyaCreated details to be returned
        let returnedKoya = new CreateKoya(-1, '')
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
            return returnedKoya
        }
        else if ((this.myState.checkPlayer1() == false) && (this.myState.checkPlayer2() == false)) {
            //this space is empty, a trunk, or a desert
            return returnedKoya
        }
        //these methods below return a CreateKoya object OR a false boolean
        else {
            //set returned koya to checkPlus
            returnedKoya = this.checkPlus()
            if (returnedKoya.Position != -1) {
                //we found the koya shape
                return returnedKoya;
            }
            //set returned koya to checkX
            returnedKoya = this.checkX()
            if (returnedKoya.Position != -1) {
                //we found the koya shape
                return returnedKoya;
            }
            //set returned koya to checkFivers
            returnedKoya = this.checkFivers()
            if (returnedKoya.Position != -1) {
                //we found the koya shape
                return returnedKoya;
            }
            //set returned koya to checkSquiggles
            returnedKoya = this.checkSquiggles()
            if (returnedKoya.Position != -1) {
                //we found the koya shape
                return returnedKoya;
            }
        }
        return returnedKoya;
    }
    checkPlus(): CreateKoya {
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
                return new CreateKoya(this.spaceID, "plus")
            }
            //no plus shape, return "dead" koya shape
            else return new CreateKoya(-1, "")
        }
        else if (this.myState.checkPlayer2()) {
            //Plus shape is indexes 0, 2, 4, 6
            if ((this.neighborBranches[0].checkPlayer2() && this.neighborBranches[2].checkPlayer2()) &&
                (this.neighborBranches[4].checkPlayer2() && this.neighborBranches[6].checkPlayer2())) {
                //verified this is a plus + shape
                return new CreateKoya(this.spaceID, "plus")
            }
            //no plus shape, return "dead" koya shape
            else return new CreateKoya(-1, "")
        }
        //neither player, return "dead" koya shape
        else return new CreateKoya(-1, "")
    }
    checkX(): CreateKoya {
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
                return new CreateKoya(this.spaceID, "x")
            }
            //no X shape, return "dead" koya shape
            else return new CreateKoya(-1, "")
        }
        else if (this.myState.checkPlayer2()) {
            //X shape is indexes 7, 1, 3, 5
            if ((this.neighborBranches[7].checkPlayer2() && this.neighborBranches[1].checkPlayer2()) &&
                (this.neighborBranches[3].checkPlayer2() && this.neighborBranches[5].checkPlayer2())) {
                //verified this is an X shape
                return new CreateKoya(this.spaceID, "x")
            }
            //no X shape, return "dead" koya shape
            else return new CreateKoya(-1, "")
        }
        //neither player, return "dead" koya shape
        else return new CreateKoya(-1, "")
    }
    checkSquiggles(): CreateKoya {
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
                return new CreateKoya(this.spaceID, "squiggle-horizontal-down")

            }
            //horizontal right squiggle shape is indexes 1, 2, 6, 5
            else if ((this.neighborBranches[1].checkPlayer1() && this.neighborBranches[6].checkPlayer1()) &&
                (this.neighborBranches[2].checkPlayer1() && this.neighborBranches[5].checkPlayer1())) {
                //verified this is a squiggle shape
                return new CreateKoya(this.spaceID, "squiggle-horizontal-up")
            }
            //vertical left squiggle shape is indexes 7, 0, 4, 3
            else if ((this.neighborBranches[7].checkPlayer1() && this.neighborBranches[0].checkPlayer1()) &&
                (this.neighborBranches[4].checkPlayer1() && this.neighborBranches[3].checkPlayer1())) {
                //verified this is a squiggle shape
                return new CreateKoya(this.spaceID, "squiggle-vertical-down")
            }
            //vertical right squiggle shape is indexes 1, 0, 4, 5
            else if ((this.neighborBranches[1].checkPlayer1() && this.neighborBranches[0].checkPlayer1()) &&
                (this.neighborBranches[4].checkPlayer1() && this.neighborBranches[5].checkPlayer1())) {
                //verified this is a squiggle shape
                return new CreateKoya(this.spaceID, "squiggle-vertical-up")
            }
            //did not get perfect matches on fiver branches == NO KOYAS!
            return new CreateKoya(-1, "")
        }
        else if (this.myState.checkPlayer2()) {
            //horizontal left squiggle shape is indexes 7, 6, 2, 3
            if ((this.neighborBranches[7].checkPlayer2() && this.neighborBranches[6].checkPlayer2()) &&
                (this.neighborBranches[2].checkPlayer2() && this.neighborBranches[3].checkPlayer2())) {
                //verified this is a squiggle shape
                return new CreateKoya(this.spaceID, "squiggle-horizontal-down")

            }
            //horizontal right squiggle shape is indexes 1, 2, 6, 5
            else if ((this.neighborBranches[1].checkPlayer2() && this.neighborBranches[6].checkPlayer2()) &&
                (this.neighborBranches[2].checkPlayer2() && this.neighborBranches[5].checkPlayer2())) {
                //verified this is a squiggle shape
                return new CreateKoya(this.spaceID, "squiggle-horizontal-up")
            }
            //vertical left squiggle shape is indexes 7, 0, 4, 3
            else if ((this.neighborBranches[7].checkPlayer2() && this.neighborBranches[0].checkPlayer2()) &&
                (this.neighborBranches[4].checkPlayer2() && this.neighborBranches[3].checkPlayer2())) {
                //verified this is a squiggle shape
                return new CreateKoya(this.spaceID, "squiggle-vertical-down")
            }
            //vertical right squiggle shape is indexes 1, 0, 4, 5
            else if ((this.neighborBranches[1].checkPlayer2() && this.neighborBranches[0].checkPlayer2()) &&
                (this.neighborBranches[4].checkPlayer2() && this.neighborBranches[5].checkPlayer2())) {
                //verified this is a squiggle shape
                return new CreateKoya(this.spaceID, "squiggle-vertical-up")
            }
            //did not get perfect matches on fiver branches == NO KOYAS!
            return new CreateKoya(-1, "")
        }
        //this space is not either player, return dead koya shape
        else return new CreateKoya(-1, "")
    }
    checkFivers(): CreateKoya {
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
                return new CreateKoya(this.spaceID, "fiver-vertical")

            }
            //horizontal fiver is indexes 2, 6, 10, 14
            else if ((this.neighborBranches[2].checkPlayer1() && this.neighborBranches[6].checkPlayer1()) &&
                (this.neighborBranches[10].checkPlayer1() && this.neighborBranches[14].checkPlayer1())) {
                //verified this is a horizontal fiver!
                return new CreateKoya(this.spaceID, "fiver-horizontal")
            }
            //diagonal left fiver is indexes 3, 7, 11, 15
            else if ((this.neighborBranches[3].checkPlayer1() && this.neighborBranches[7].checkPlayer1()) &&
                (this.neighborBranches[11].checkPlayer1() && this.neighborBranches[15].checkPlayer1())) {
                //verified this is a diagonal left fiver!
                return new CreateKoya(this.spaceID, "fiver-diagonal-down")
            }
            //diagonal right fiver is indexes 1, 5, 9, 13
            else if ((this.neighborBranches[1].checkPlayer1() && this.neighborBranches[5].checkPlayer1()) &&
                (this.neighborBranches[9].checkPlayer1() && this.neighborBranches[13].checkPlayer1())) {
                //verified this is a diagonal right fiver!
                return new CreateKoya(this.spaceID, "fiver-diagonal-up")
            }
            //did not get perfect matches on fiver branches == NO KOYAS!
            return new CreateKoya(-1, "")
        }
        else if (this.myState.checkPlayer2()) {
            //vertical fiver is indexes 0, 4, 8, 12
            if ((this.neighborBranches[0].checkPlayer2() && this.neighborBranches[4].checkPlayer2()) &&
                (this.neighborBranches[8].checkPlayer2() && this.neighborBranches[12].checkPlayer2())) {
                //verified this is a vertical fiver!
                return new CreateKoya(this.spaceID, "fiver-vertical")

            }
            //horizontal fiver is indexes 2, 6, 10, 14
            else if ((this.neighborBranches[2].checkPlayer2() && this.neighborBranches[6].checkPlayer2()) &&
                (this.neighborBranches[10].checkPlayer2() && this.neighborBranches[14].checkPlayer2())) {
                //verified this is a horizontal fiver!
                return new CreateKoya(this.spaceID, "fiver-horizontal")
            }
            //diagonal left fiver is indexes 3, 7, 11, 15
            else if ((this.neighborBranches[3].checkPlayer2() && this.neighborBranches[7].checkPlayer2()) &&
                (this.neighborBranches[11].checkPlayer2() && this.neighborBranches[15].checkPlayer2())) {
                //verified this is a diagonal left fiver!
                return new CreateKoya(this.spaceID, "fiver-diagonal-down")
            }
            //diagonal right fiver is indexes 1, 5, 9, 13
            else if ((this.neighborBranches[1].checkPlayer2() && this.neighborBranches[5].checkPlayer2()) &&
                (this.neighborBranches[9].checkPlayer2() && this.neighborBranches[13].checkPlayer2())) {
                //verified this is a diagonal right fiver!
                return new CreateKoya(this.spaceID, "fiver-diagonal-up")
            }
            //did not get perfect matches on fiver branches == NO KOYAS!
            return new CreateKoya(-1, "")
        }
        else return new CreateKoya(-1, "")
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
    addPiece(addedPiece: Piece, koya?: boolean): boolean {
        //sanity check for (not empty) and (isBurst) i.e. koya, desert, dead trunk
        //MINDFUL HERE --> The INDEX chosen to decide if tree is burst is index 0

        //check for stack (length > 0)
        if (this.Pieces.length > 0) {
            //check for bursted top piece
            //THIS MAY POSE A PROBLEM FOR CHECKING THE 'TOP' OF A STACK
            //consider using Array.unshift() to add items
            if (this.Pieces[0].isBurst) {
                //cannot place a piece on a burst trunk or koya or desert
                console.log("CANNOT ADD PIECE TO BURST TRUNK, DESERT, OR KOYA PIECE")
                return false
            }
            else if (koya) {
                //creating a koya, always clear
                console.log("ADDING TO KOYA STACK AT INDEX: " + this.spaceID)
                //need to check for if koya is created --> otherwise double pieces same spot!
                //adding to the stack stack is not burst
                this.Pieces.push(addedPiece)
                if (this.Pieces.length == 2) {
                    //koya just built, ensure this state is a trunk
                    this.myState.makeTrunk
                }
                //increment score value for this space
                this.setScore(this.Pieces.length)
                return true
            }
            else {
                //cannot add a piece on an occupied space!
                console.log("space occupied! try again")
                return false;
            }
        }
        //empty space, totally fine to add a piece
        else {
            console.log("SPACE -- EMPTY AT INDEX: " + this.spaceID)
            //EMPTY SPACE
            //add the new piece to the stack of pieces
            this.Pieces.push(addedPiece)
            //updates branch assigned to this space
            if (addedPiece.isSeed) {
                //console.log(addedPiece)
                if (addedPiece.isP1 && addedPiece.isP2) {
                    //koya
                    this.myState.makeKoya()
                }
                //check if P1
                else if (addedPiece.isP1) {
                    this.myState.setPlayer1()
                }
                //must be p2
                else {
                    this.myState.setPlayer2()
                }
            }
            //always return true for empty space
            return true;
        }
    }
    setScore(stackSize: number) {
        //exponentials at work
        if (stackSize == 1) {
            this.score = 1;
        }
        else if (stackSize == 2) {
            this.score = 2;
        }
        //cheap exponential function
        // needs to be 1, 2, 4, 8, 16, 32, etc.
        else {
            this.score = 2;
            for (let i = 2; i > stackSize; i++) {
                this.score += this.score
            }
        }
    }

}
export default Space