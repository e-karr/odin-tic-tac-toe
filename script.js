function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // create 2d array that will represent state of the gameboard
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const updateCell = (row, column, player) => {
    board[row][column].addToken(player);
  };

  return { getBoard, updateCell, rows, columns };
}

function Cell() {
  let value = '';

  // accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // get current value of cell
  const getValue = () => value;

  return { addToken, getValue };
}

const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;

  return { getName, getToken };
};

function PlayGame(playerOneName = 'Player One', playerTwoName = 'Player Two') {
  let board = Gameboard();

  const players = [Player(playerOneName, 'X'), Player(playerTwoName, 'O')];

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const winGame = (token, rows, columns, currentBoard) => {
    // check for win in columns
    for (let i = 0; i < rows; i++) {
      let tokenCounter = 0;

      for (let j = 0; j < columns; j++) {
        if (currentBoard[j][i].getValue() === token) {
          tokenCounter++;
        } else {
          break;
        }
      }

      if (tokenCounter === columns) {
        return 'winner';
      }
    }

    // check for win in rows
    for (let i = 0; i < rows; i++) {
      let tokenCounter = 0;

      for (let j = 0; j < columns; j++) {
        if (currentBoard[i][j].getValue() === token) {
          tokenCounter++;
        } else {
          break;
        }
      }

      if (tokenCounter === rows) {
        return 'winner';
      }
    }

    // check for win in diagonals
    if (
      (currentBoard[0][2].getValue() === token &&
        currentBoard[1][1].getValue() === token &&
        currentBoard[2][0].getValue() === token) ||
      (currentBoard[0][0].getValue() === token &&
        currentBoard[1][1].getValue() === token &&
        currentBoard[2][2].getValue() === token)
    ) {
      return 'winner';
    }

    // check for tie
    const tokens = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        tokens.push(currentBoard[i][j].getValue());
      }
    }

    if (!tokens.includes('')) {
      return 'tie';
    }

    return false;
  };

  const playRound = (row, column) => {
    board.updateCell(row, column, getActivePlayer().getToken());

    //check for winner
    const winner = winGame(
      getActivePlayer().getToken(),
      board.rows,
      board.columns,
      board.getBoard()
    );

    if (winner === 'winner') {
      return `${getActivePlayer().getName()} wins!`;
    } else if (winner === 'tie') {
      return "It's a tie";
    }

    // switch player turn
    switchPlayerTurn();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    rows: board.rows,
    columns: board.columns,
  };
}

function ScreenControler() {
  let playerOneName = document.querySelector('#player1name');
  let playerTwoName = document.querySelector('#player2name');
  let game = PlayGame(playerOneName, playerTwoName);
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const winnerDiv = document.querySelector('.winner');
  const resetBoardButton = document.querySelector('#resetBoard');
  const newGameButton = document.querySelector('#newGame');
  const gameDiv = document.querySelector('.game');
  const playersDiv = document.querySelector('.players');
  let againstComputer = false;

  const getPlayerNames = () => {
    let playerOne = playerOneName.value;
    let playerTwo = playerTwoName.value;
    playersDiv.style.visibility = 'hidden';
    gameDiv.style.visibility = 'visible';
    game = PlayGame(playerOne, playerTwo);

    updateBoard();
  };

  const playAgainstComputer = () => {
    let playerOne = playerOneName.value;
    let playerTwo = 'Computer';
    againstComputer = true;

    playersDiv.style.visibility = 'hidden';
    gameDiv.style.visibility = 'visible';
    game = PlayGame(playerOne, playerTwo);

    updateBoard();
  }

  const resetBoard = () => {
    game = PlayGame(playerOneName.value, playerTwoName.value);
    winnerDiv.textContent = '';
    updateBoard();
  };

  const newGame = () => {
    playersDiv.style.visibility = 'visible';
    gameDiv.style.visibility = 'hidden';
    playerOneName.value = '';
    playerTwoName.value = '';
    winnerDiv.textContent = '';
    game = PlayGame(playerOneName.value, playerTwoName.value);
    updateBoard();
  };

  const updateBoard = () => {
    //clear the board
    boardDiv.textContent = '';

    //newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    //displayer player's turn
    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;

    //render board
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');

        cellButton.dataset.column = columnIndex;
        cellButton.dataset.row = rowIndex;

        cellButton.textContent = cell.getValue();

        if (cellButton.textContent === 'X') {
          cellButton.classList.add('playerOne');
        } else if (cellButton.textContent === 'O') {
          cellButton.classList.add('playerTwo');
        }

        if (cellButton.textContent !== '' || winnerDiv.textContent) {
          cellButton.disabled = true;
        }

        boardDiv.appendChild(cellButton);
      });
    });
  };

  const  computerTurn = () => {
    let selectedColumn;
    let selectedRow;

    const board = game.getBoard();

    while (board[selectedRow][selectedColumn].getValue() !== '') {
      selectedColumn = Math.floor(Math.random() * game.columns);
      selectedRow = Math.floor(Math.random() * game.rows);
    }

    const winner = game.playRound(selectedRow, selectedColumn);

    if (winner) {
      winnerDiv.textContent = winner;
    }

    updateBoard();
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;

    const winner = game.playRound(selectedRow, selectedColumn);

    if (winner) {
      winnerDiv.textContent = winner;
    }

    updateBoard();

    if (againstComputer) {
      setTimeout(computerTurn, 2000);
    }
  }

  // add event listeners
  playersDiv.addEventListener('submit', (e) => {
    getPlayerNames();
    e.preventDefault();
  });

  resetBoardButton.addEventListener('click', resetBoard);
  newGameButton.addEventListener('click', newGame);
  boardDiv.addEventListener('click', clickHandlerBoard);

  // initial board
  updateBoard();
}

ScreenControler();
