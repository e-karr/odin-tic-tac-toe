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

  // print board to console
  const printBoard = () => {
    const boardWithCellValues = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        boardWithCellValues.push(board[i][j].getValue());
      }
    }
    console.log(boardWithCellValues);
  };

  return { getBoard, updateCell, printBoard, rows, columns };
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

function PlayGame(
  playerOneName = 'Player One',
  playerOneToken = 'X',
  playerTwoName = 'Player Two',
  playerTwoToken = 'O'
) {
  let board = Gameboard();

  const players = [
    Player(playerOneName, playerOneToken),
    Player(playerTwoName, playerTwoToken),
  ];

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().getName()}'s turn.`);
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
        return true;
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
        return true;
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
      return true;
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

    if (winner) {
      board.printBoard();
      console.log(`${getActivePlayer().getName()} wins!`);
      return true;
    }

    // switch player turn
    switchPlayerTurn();
    printNewRound();

    return false;
  };

  // initial play game message
  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenControler() {
  const game = PlayGame();
  const boardDiv = document.querySelector('.board');

  const updateBoard = () => {
    //clear the board
    boardDiv.textContent = '';

    //newest version of the board
    const board = game.getBoard();

    //render board
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');

        cellButton.dataset.column = columnIndex;
        cellButton.dataset.row = rowIndex;

        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  updateBoard();
}

ScreenControler();

// const game = PlayGame();

// while (true) {
//   let winner = game.playRound();

//   if (winner) {
//     break;
//   }
// }
