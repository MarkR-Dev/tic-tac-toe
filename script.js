const gameboard = (function() {
    const board = [];

    // Loops to populate 2D array of cells representing rows/cols,
    // each cell has a property holding its row(i)/col(j) position
    for(let i = 0; i < 3; i++){
        board[i] = [];
        for(let j = 0; j < 3; j++){
            board[i].push(createCell(i, j));
        }
    }

    const getBoard = () => board;

    const isBoardFull = () => {
        // Check if the board is full by searching for an empty cell
        const isBoardFull = !board.some(row => row.some(cell => cell.getValue() === 0));
        return isBoardFull;
    }

    const isCellTaken = cell => cell.getValue() !== 0;
    
    const placeToken = (cell, player) => cell.addToken(player);
    
    return {
        getBoard, isBoardFull, isCellTaken, placeToken,
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
    let isGameOver = false;
    
    let activePlayer = playersArray[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => activePlayer = activePlayer === playersArray[0] ? playersArray[1] : playersArray[0];
        
    const playRound = (cell) => {
        if(gameboard.isCellTaken(cell) || isGameOver){
           return 
        }

        gameboard.placeToken(cell, getActivePlayer());

        if(isWinner()){
            isGameOver = true;
            screenController.updateScreen();
            screenController.displayWinner(getActivePlayer())
            return
        }else if(isTie()){
            isGameOver = true;
            screenController.updateScreen();
            screenController.displayTie();
            return
        }
        
        switchPlayerTurn();
        screenController.updateScreen();
    }

    // Look through the winning combos and see if any match the active players token
    const isWinner = () => {
        return winningCombos.some(combo => {
            return combo.every(cellValue => {
               return gameboard.getBoard()[cellValue[0]][cellValue[1]].getValue() === getActivePlayer().getPlayerToken(); 
            });
        });
    }

    const isTie = () => gameboard.isBoardFull();

    return {
        getActivePlayer, playRound,
    }
})();

const screenController = (function () {
    const boardDiv = document.querySelector(".board");
    const gameStatusMsg = document.querySelector(".game-status");

    const updateScreen = () => {
        boardDiv.textContent = "";
        gameStatusMsg.textContent = "";

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

                if(cellButton.textContent === "0"){
                    cellButton.textContent = "";
                }else if(cellButton.textContent === "X"){
                    cellButton.classList.add("cross");
                }else if(cellButton.textContent === "O"){
                    cellButton.classList.add("nought");
                }

                boardDiv.appendChild(cellButton);
            });
        });

        gameStatusMsg.textContent = `${gameController.getActivePlayer().getPlayerName()} (${gameController.getActivePlayer().getPlayerToken()}) Turn!`;
    }

    const displayWinner = (player) => {
        gameStatusMsg.textContent = "";
        gameStatusMsg.textContent = `Game Over! ${player.getPlayerName()} (${player.getPlayerToken()}) Wins!!`;
    }

    const displayTie = () => {
        gameStatusMsg.textContent = "";
        gameStatusMsg.textContent = "Game Over! It's a Tie!!"
    }
    
    const clickHandlerBoard = (event) => {
        const selectedRow = event.target.dataset.row;
        const selectedCol = event.target.dataset.col;

        if(!selectedRow) return;

        gameController.playRound(gameboard.getBoard()[selectedRow][selectedCol]);
    }
    
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();

    return {
        updateScreen, displayWinner, displayTie,
    }
})();



