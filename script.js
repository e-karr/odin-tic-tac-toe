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
  let value = '-';

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

      if (tokenCounter === 3) {
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

      if (tokenCounter === 3) {
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

    if (!tokens.includes('-')) {
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

  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenControler() {
  let playerOneName;
  let playerTwoName;
  let game = PlayGame(playerOneName, playerTwoName);
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const submitNamesButton = document.querySelector('#submitNames');
  const winnerDiv = document.querySelector('.winner');
  const resetBoardButton = document.querySelector('#resetBoard');
  const newGameButton = document.querySelector('#newGame');

  const getPlayerNames = () => {
    playerOneName = document.querySelector('#player1name').value;
    playerTwoName = document.querySelector('#player2name').value;
    game = PlayGame(playerOneName, playerTwoName);
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

        if (cellButton.textContent !== '-' || winnerDiv.textContent) {
          cellButton.disabled = true;
        }

        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;

    const winner = game.playRound(selectedRow, selectedColumn);

    if (winner) {
      winnerDiv.textContent = winner;
    }

    updateBoard();
  }

  submitNamesButton.addEventListener('click', getPlayerNames);
  boardDiv.addEventListener('click', clickHandlerBoard);

  updateBoard();
}

ScreenControler();
