const gameboard = (function() {
    const board = [];

    // Loops to populate 2D array of cells representing rows/cols
    for(let i = 0; i < 3; i++){
        board[i] = [];
        for(let j = 0; j < 3; j++){
            board[i].push(createCell());
        }
    }

    const getBoard = () => board;

    // Look into each row, look into each cell in that row, and get the value of that cell
    const printBoard = () => {
        const boardCellValues = board.map((row) => row.map(cell => cell.getValue()));
        console.log(boardCellValues);
    }

    const placeToken = () => {}

    return {
        getBoard, printBoard, placeToken
    }
    
})();

function createCell(){
    let value = 0;

    // Closure
    const getValue = () => value;

    return {
        getValue,
    }
}

function createPlayer(name, tokenSymbol){
    const getPlayerName = () => name;
    const getPlayerToken = () => tokenSymbol;

    return {
        getPlayerName, getPlayerToken,
    }
}

