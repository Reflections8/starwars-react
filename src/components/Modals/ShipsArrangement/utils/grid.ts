export const letterToNumber = (letter) => {
  const letters = "abcdefghij";
  return letters.indexOf(letter);
};

export const getCellClassName = (x, y) => {
  const letters = "abcdefghij";
  return `${letters[y]}${x}`;
};

export const initializeGrid = () => {
  const grid = [];
  const letters = "abcdefghij";

  for (let y = 0; y < letters.length; y++) {
    for (let x = 0; x <= 10; x++) {
      grid.push({
        className: `battleships__cell ${getCellClassName(x, y)}`,
        isShip: false,
        x: letters[x],
        y: y,
      });
    }
  }

  return grid;
};
