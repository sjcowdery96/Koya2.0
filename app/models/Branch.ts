//the branch class is used for recursive search to match koya root pairs

class Branch {
    player1: boolean //true for P1 and koya, false for empty, XX, P2, and TRUNKS
    player2: boolean //true for P2 and koya, false for empty, XX, P1, and TRUNKS
    //initialize as both false to begin with
    constructor() {
        this.player1 = false;
        this.player2 = false;
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
    //this method sets this branch to both true  (i.e. KOYA)
    makeKoya() {
        this.player1 = true;
        this.player2 = true;
    }
    //this method sets this branch to Player1
    setPlayer1() {
        this.player1 = true;
        this.player2 = false;
    }
    //this method sets this branch to Player2
    setPlayer2() {
        this.player1 = false;
        this.player2 = true;
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