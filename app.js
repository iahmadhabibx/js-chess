const Constans = {
  gameBoard: "game-board",
  player: "player",
  infoDisplay: "info-display",
  width: 8,
  // Classes
  square: "square",
  beige: "beige",
  brown: "brown",
  black: "black",
  white: "white",
};

const gameBoard = document.querySelector(`#${Constans.gameBoard}`);
const playerDisplay = document.querySelector(`#${Constans.player}`);
const infoDisplay = document.querySelector(`#${Constans.infoDisplay}`);
const width = Constans.width;
let startPositionId;
let draggedElement;

// prettier-ignore
const startPieces = [
  rook, knight, bishop, queen, king, bishop, knight, rook,
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
  rook, knight, bishop, queen, king, bishop, knight, rook,
];

const createBoard = () => {
  startPieces.forEach((piece, i) => {
    const square = document.createElement("div");
    square.classList.add(Constans.square);
    square.innerHTML = piece;
    square.firstChild?.setAttribute("draggable", true);
    square.setAttribute("square-id", i);
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0)
      square.classList.add(i % 2 === 0 ? Constans.beige : Constans.brown);
    else square.classList.add(i % 2 === 0 ? Constans.brown : Constans.beige);

    if (i <= 15) square.firstChild.firstChild.classList.add(Constans.black);
    if (i >= 48) square.firstChild.firstChild.classList.add(Constans.white);

    gameBoard.append(square);
  });
};

createBoard();

const allSquares = document.querySelectorAll(
  `div#${Constans.gameBoard} .${Constans.square}`
);

allSquares.forEach((square) => {
  document.addEventListener("dragstart", dragStart);
  document.addEventListener("dragover", dragOver);
  document.addEventListener("drop", dragDrop);
});

const dragStart = (event) => {
  startPositionId = event.target.parentNode.getAttribute("square-id");
  draggedElement = event.target;
};

const dragOver = (event) => {};

const dragDrop = (event) => {};
