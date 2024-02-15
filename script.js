const gameboard = (function() {
    const board = [];

    // Loops to populate 2D array of cells representing rows/cols,
    // each cell has a property holding its row/col position
    for(let row = 0; row < 3; row++){
        board[row] = [];
        for(let col = 0; col < 3; col++){
            board[row].push(createCell(row, col));
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

    const resetValue = () => value = 0;

    const getPosition = () => {
        return {row, col};
    }

    const addToken = player => value = player.getPlayerToken();

    return {
        getValue, resetValue, getPosition, addToken, 
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
    
    const playersArray = [];
    let activePlayer = null;
    let isGameOver = false;
    
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

    // Look through the winning combos and find any where all cells match the active players token
    const isWinner = () => {
        return winningCombos.some(combo => {
            return combo.every(cellPosition => {
               return gameboard.getBoard()[cellPosition[0]][cellPosition[1]].getValue() === getActivePlayer().getPlayerToken(); 
            });
        });
    }

    const isTie = () => gameboard.isBoardFull();

    const resetGame = () => {
        activePlayer = playersArray[0];
        isGameOver = false;
        const board = gameboard.getBoard();
        board.forEach(row => row.forEach(cell => cell.resetValue()));
    }

    const startGame = (player1, player2) => {
        // Reset the player array
        playersArray.length = 0;
        const playerOne = createPlayer(player1, "X");
        const playerTwo = createPlayer(player2, "O");
        playersArray.push(playerOne);
        playersArray.push(playerTwo);
        activePlayer = playersArray[0];
    }

    return {
        getActivePlayer, playRound, resetGame, startGame,
    }
})();

const screenController = (function () {
    const setupButton = document.querySelector(".setup");
    const startButton = document.querySelector(".start");
    const resetButton = document.querySelector(".reset");
    const playerNameInputs = document.querySelectorAll("input");
    const gameStatusMsg = document.querySelector(".game-status");
    const boardDiv = document.querySelector(".board");
    
    const updateScreen = () => {
        gameStatusMsg.textContent = "";
        gameStatusMsg.textContent = `${gameController.getActivePlayer().getPlayerName()} (${gameController.getActivePlayer().getPlayerToken()}) Turn!`;
        
        updateGrid();
    }

    const updateGrid = () => {
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
    }

    const displayWinner = (player) => {
        gameStatusMsg.textContent = "";
        gameStatusMsg.textContent = `Game Over! ${player.getPlayerName()} (${player.getPlayerToken()}) Wins!!`;
    }

    const displayTie = () => {
        gameStatusMsg.textContent = "";
        gameStatusMsg.textContent = "Game Over! It's a Tie!!";
    }
    
    const placeTokenHandler = (event) => {
        const selectedRow = event.target.dataset.row;
        const selectedCol = event.target.dataset.col;

        if(!selectedRow) return;

        gameController.playRound(gameboard.getBoard()[selectedRow][selectedCol]);
    }

    const setupGameHandler = () => {
        boardDiv.removeEventListener("click", placeTokenHandler);
        gameController.resetGame();
        updateGrid();
        gameStatusMsg.textContent = "Enter Player Names!";
        playerNameInputs.forEach(input => input.style.visibility = "visible");
        startButton.addEventListener("click", startGameHandler);
        resetButton.removeEventListener("click", resetGameHandler);
      }

    const startGameHandler = () => {
        boardDiv.addEventListener("click", placeTokenHandler);
        const playerOneName = playerNameInputs[0].value;
        const playerTwoName = playerNameInputs[1].value;
        playerNameInputs.forEach(input => {
            input.style.visibility = "hidden";
            input.value = "";
        });
        gameController.startGame(playerOneName, playerTwoName);
        startButton.removeEventListener("click", startGameHandler);
        resetButton.addEventListener("click", resetGameHandler);
        updateScreen();
      }

    const resetGameHandler = () => {
        gameController.resetGame();
        updateScreen();
    }

    setupButton.addEventListener("click", setupGameHandler);
    startButton.addEventListener("click", startGameHandler);

    setupGameHandler();

    return {
        updateScreen, displayWinner, displayTie,
    }
})();



