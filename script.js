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
        const boardCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardCellValues);
    }

    const isBoardFull = () => {
        // const isBoardFull = board.every(row => row.every(cell => cell.getValue() !== 0));
        // return isBoardFull;
        const isBoardFull = !board.some(row => row.some(cell => cell.getValue() === 0));
        return isBoardFull;
    }

    const placeToken = (cell, player) => {
        const isCellEmpty = cell.getValue();
        if(isCellEmpty){
            return
        }else{
            cell.addToken(player);
        }
    }

    return {
        getBoard, printBoard, isBoardFull, placeToken,
    }
    
})();

function createCell(){
    let value = 0;

    // Closures
    const getValue = () => value;

    const addToken = player => value = player.getPlayerToken();

    return {
        getValue, addToken, 
    }
}

function createPlayer(name, tokenSymbol){
    const getPlayerName = () => name;
    const getPlayerToken = () => tokenSymbol;

    return {
        getPlayerName, getPlayerToken,
    }
}

