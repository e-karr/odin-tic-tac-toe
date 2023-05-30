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
}

function Cell() {
  let value = ' ';

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
