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

function PlayGame() {
  let board = Gameboard();

  let input = require('readline-sync');

  const players = [];

  // get player names and tokens
  for (let i = 0; i < 2; i++) {
    let name = input.question(`Player ${i + 1} Name: `);
    let token = input.question(`Player ${i + 1} Token: `);

    let player = Player(name, token);
    players.push(player);
  }

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

  const playRound = () => {
    //get selected cell
    const row = input.question(`Select row: `);
    const column = input.question('Select column: ');

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

  return { playRound, getActivePlayer };
}

const game = PlayGame();

while (!game.playRound()) {
  game.playRound();
}
