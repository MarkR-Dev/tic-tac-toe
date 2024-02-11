const gameboard = (function() {
    const board = [];

    // Loops to populate 2D array of cells representing rows/cols,
    // each cell has a property holding its row/col position
    for(let i = 0; i < 3; i++){
        board[i] = [];
        for(let j = 0; j < 3; j++){
            board[i].push(createCell(i, j));
        }
    }

    const getBoard = () => board;

    // Look into each row, look into each cell in that row, and get the value of that cell
    const printBoard = () => {
        const boardCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardCellValues);
    }

    const isBoardFull = () => {
        // Check if the board is full by searching for an empty cell
        const isBoardFull = !board.some(row => row.some(cell => cell.getValue() === 0));
        return isBoardFull;
    }

    const isCellTaken = cell => cell.getValue() !== 0;
    
    const placeToken = (cell, player) => cell.addToken(player);
    
    return {
        getBoard, printBoard, isBoardFull, isCellTaken, placeToken,
    }
})();

function createCell(row, col){
    let value = 0;

    // Closures retain access to the value variable of each cell object created
    const getValue = () => value;

    const getPosition = () => {
        return {row, col};
    }

    const addToken = player => value = player.getPlayerToken();

    return {
        getValue, addToken, getPosition,
    }
}

function createPlayer(name, tokenSymbol){
    const getPlayerName = () => name;
    const getPlayerToken = () => tokenSymbol;

    return {
        getPlayerName, getPlayerToken,
    }
}

const gameController = (function(){
    // Row, column and diagonal winning combos
    const winningCombos = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],

        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]], 
        [[0, 2], [1, 2], [2, 2]], 
        
        [[0, 0], [1, 1], [2, 2]], 
        [[0, 2], [1, 1], [2, 0]], 
    ];

    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
    const playersArray = [player1, player2];
    
    let activePlayer = playersArray[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => activePlayer = activePlayer === playersArray[0] ? playersArray[1] : playersArray[0];
        
    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`${getActivePlayer().getPlayerName()}'s Turn!`);
    }

    const playRound = (cell) => {
        if(gameboard.isCellTaken(cell)){
           return 
        }

        console.log(`Setting token ${getActivePlayer().getPlayerToken()}`);
        gameboard.placeToken(cell, getActivePlayer());

        if(isWinner()){
            gameboard.printBoard();
            console.log(`Game over, ${getActivePlayer().getPlayerName()} Wins!`);
            return
        }else if(isTie()){
            gameboard.printBoard();
            console.log("TIE");
            return
        }
        
        switchPlayerTurn();
        printNewRound();
    }

    // Look through the winning combos and see if any match the active players token
    const isWinner = () => {
        return winningCombos.some(combo => {
            return combo.every(cellValue => {
               return gameboard.getBoard()[cellValue[0]][cellValue[1]].getValue() === getActivePlayer().getPlayerToken(); 
            })
        });
    }

    const isTie = () => gameboard.isBoardFull();

    printNewRound()

    return {
        getActivePlayer, playRound,
    }
})();

const screenController = (function () {
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = gameboard.getBoard();
        board.forEach(row => {
            row.forEach(cell => {
                // Destructuring the returned obj to use for setting data-attributes
                const {row, col} = cell.getPosition();
                const cellButton = document.createElement("button");

                cellButton.classList.add("cell");
                cellButton.setAttribute("data-row", row);
                cellButton.setAttribute("data-col", col);
                cellButton.textContent = cell.getValue();

                boardDiv.appendChild(cellButton);
            })
        })
    }

    updateScreen();

    return {
        updateScreen,
    }
})();


