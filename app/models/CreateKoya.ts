//should leverage this class to pass koya created data to the board
class CreateKoya {
    Shape: string; //options: + x |  -  \   /  .-'  '-.  .|'  '|.
    Position: number; //options: 1 or 2

    constructor(position: number, shape: string) {
        //once these are constructed, they are fixed
        this.Position = position;
        this.Shape = shape
    }

    setPosition(newPosition: number) {
        this.Position = newPosition

    }
    setShape(newShape: string) {
        //sets logic for new shape
        this.Shape = newShape;
    }
}

export default CreateKoya