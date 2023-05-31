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

  const updateBoard = (row, column, player) => {
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

  return { getBoard, updateBoard, printBoard };
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
    let name = input.question(`Player ${i+1} Name: `);
    let token = input.question(`Player ${i+1} Token: `);

    let player = Player(name, token);
    players.push(player);
  }

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;

  

//   board.printBoard();
}

PlayGame();
