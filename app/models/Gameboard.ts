//Branches are used for verifying root channels
//if I wanted to use an array to hold these 16 values...
//could use index and modular to map internal and external indexes?
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

class Gameboard {
    //player seed supply
    P1SeedStack: Piece[]
    P2SeedStack: Piece[]
    //player desert supply
    P1DesertStack: Piece[]
    P2DesertStack: Piece[]
    //the koya piece!
    Koya: Piece

    constructor() {
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

    }

}

export default Gameboard