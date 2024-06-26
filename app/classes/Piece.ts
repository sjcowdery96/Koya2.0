class Piece {
    //immutable data...?
    isP1: boolean
    isP2: boolean
    //isRoot and isSeed can be changed to make roots and trunks
    isSeed: boolean // (false means desert or trunk)
    isRoot: boolean // (false means seed)
    isBurst: boolean // (true means dead trunk or koya or desert)
    //easy to print
    data: string;

    constructor(pieceType: string) {
        //build a switch statement
        switch (pieceType) {
            case 'P1':
                this.isP1 = true
                this.isP2 = false
                //assign basics
                this.isSeed = true;
                this.isRoot = false;
                this.isBurst = false;
                break
            case 'P2':
                this.isP1 = false
                this.isP2 = true
                //assign basics
                this.isSeed = true;
                this.isRoot = false;
                this.isBurst = false;
                break
            case 'KOYA':
                this.isP1 = true
                this.isP2 = true
                //assign basics
                this.isSeed = true;
                this.isRoot = true;
                this.isBurst = true;
                break;
            default: //desert
                this.isP1 = false
                this.isP2 = false
                this.isSeed = false;
                this.isRoot = false;
                this.isBurst = true;

        }
        this.data = this.display()
    }

    root(debugIndex: number): void {
        if (!this.isSeed || this.isRoot) {
            //not a seed or already a root
            //do nothing
            console.log("SKIPPED ROOTS: " + debugIndex + " -- " + this.data)
        }
        else {
            //update display to root
            this.isRoot = true;
            this.data = this.display()
            console.log("SET ROOTS: " + this.data + ' ' + debugIndex)
        }
    }
    //Displays a string for this piece
    display(): string {
        if (this.isP1 && this.isP2) {
            //Koya!
            return "KK"
        }
        else if (!this.isSeed) {
            //not a seed
            if (this.isP1) {
                //is P1 Trunk (need to calc score at space level)
                return "1"
            }
            else if (this.isP2) {
                //is P2 Trunk (need to calc score at space level)
                return "2"
            }
            else {
                //this is a desert
                return "XX"
            }

        }
        else if (!this.isRoot) {
            if (this.isP1) {
                //P1 Seed Piece
                return "10"
            }
            else {
                //P2 Seed Piece
                return "20"
            }
        }
        else if (!this.isP1) {
            //is a P2 root
            return "2R"
        }
        //P1 root
        else return "1R"
    }
}

export default Piece