function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];
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
