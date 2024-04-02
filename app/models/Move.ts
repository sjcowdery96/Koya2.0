//should leverage this class to establish game history/stats

class Move {
    //all attributes are read only -- cannot alter a move when it is submitted 
    readonly MoveType: string; //options: move pieces, place piece seed, place piece desert, place piece koya
    readonly Player: number; //options: 1 or 2
    readonly TargetSpaceID: number; //options between 0 to (gameboard width)^2
    //embelishments for later
    readonly P1Score: number;
    readonly P2Score: number;
    readonly P1SeedBank: number;
    readonly P2SeedBank: number;

    constructor(player: number, MoveType: string, TargetSpaceID: number, scoreBoard: number[]) {
        //once these are constructed, they are fixed
        this.Player = player;
        this.MoveType = MoveType
        this.TargetSpaceID = TargetSpaceID
        //working "memory" of the board for stats purposes
        this.P1Score = scoreBoard[0]
        this.P2Score = scoreBoard[1]
        this.P1SeedBank = scoreBoard[2]
        this.P2SeedBank = scoreBoard[3]
    }
    printMove(): string {
        return "P" + this.Player + ' ' + this.TargetSpaceID + ' ' + this.MoveType + ' ' + `\n`
            + "P1: " + this.P1Score + " points " + this.P1SeedBank + " seedbank" + `\n`
            + "P2: " + this.P2Score + " points " + this.P2SeedBank + " seedbank" + `\n`
    }

}

export default Move