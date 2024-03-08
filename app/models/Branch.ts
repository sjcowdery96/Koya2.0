//the branch class is used for recursive search to match koya root pairs

class Branch {
    player1: boolean //true for P1 and koya, false for empty, XX, P2, and TRUNKS
    player2: boolean //true for P2 and koya, false for empty, XX, P1, and TRUNKS
    //initialize as input values
    constructor(p1: boolean, p2: boolean) {
        this.player1 = p1;
        this.player2 = p2;
    }
    //checks if Player1
    checkPlayer1(): boolean {
        return this.player1
    }
    //checks if Player2
    checkPlayer2(): boolean {
        return this.player2
    }
    //this method sets this branch to a dead end (i.e. TRUNK)
    makeTrunk() {
        this.player1 = false;
        this.player2 = false;
    }
    //print type useful for debugging
    printType(): string {
        if (this.player1 && this.player2) {
            //koya
            console.log("THIS PIECE IS A KOYA")
            return "KOYA"
        }
        else if (this.player1 && !this.player2) {
            //P1
            console.log("THIS PIECE IS P1")
            return "P1"
        }
        else if (!this.player1 && this.player2) {
            //P2
            console.log("THIS PIECE IS P2")
            return "P2"
        }
        else {
            console.log("THIS PIECE IS A DESERT OR TRUNK")
            return "XX"
        }

    }
}
export default Branch