const Constans = {
  gameBoard: "game-board",
  player: "player",
  infoDisplay: "info-display",
  width: 8,
  pawn: "pawn",
  knight: "knight",
  queen: "queen",
  bishop: "bishop",
  rook: "rook",
  // Classes
  piece: "piece",
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
let playerGo = "black";
playerDisplay.textContent = playerGo;

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

const allSquares = document.querySelectorAll(`.${Constans.square}`);

const dragStart = (event) => {
  startPositionId = event.target.parentNode.getAttribute("square-id");
  draggedElement = event.target;
};

const dragOver = (event) => {
  event.preventDefault();
};

const dragDrop = (event) => {
  event.stopPropagation();
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = event.target.classList.contains(Constans.piece);
  const valid = checkValidity(event.target);
  const opponentGo =
    playerGo === Constans.white ? Constans.black : Constans.white;
  const takenByOpponent =
    event.target.firstChild?.classList.contains(opponentGo);

  if (correctGo) {
    if (takenByOpponent && valid) {
      event.target.parentNode.append(draggedElement);
      event.target.remove();
      return changePlayer();
    }
    if (taken && !takenByOpponent) {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        infoDisplay.textContent = "This is not a valid move.";
      }, 2000);
      return;
    }
    if (valid) {
      event.target.append(draggedElement);
      return changePlayer();
    }
  }
};

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

const changePlayer = () => {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
  } else {
    revertIds();
    playerGo = "black";
  }
  playerDisplay.textContent = playerGo;
};

const reverseIds = () => {
  const allSquares = document.querySelectorAll(`.${Constans.square}`);
  allSquares.forEach((square, i) =>
    // prettier-ignore
    square.setAttribute("square-id", (width * width - 1) - i)
  );
};

const revertIds = () => {
  const allSquares = document.querySelectorAll(`.${Constans.square}`);
  allSquares.forEach((square, i) => square.setAttribute("square-id", i));
};

const checkValidity = (target) => {
  const targetId = Number(
    target.getAttribute("square-id") ||
      target.parentNode.getAttribute("square-id")
  );
  const startId = Number(startPositionId);
  const piece = draggedElement.id;

  switch (piece) {
    case Constans.pawn:
      const startRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        (startRow.includes(startId) && startId + width * 2 == targetId) ||
        startId + width === targetId ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild)
      )
        return true;
      break;

    case Constans.knight:
      if (
        startId + width * 2 - 1 === targetId ||
        startId + width * 2 + 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width * 2 + 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      )
        return true;
      break;

    case Constans.bishop:
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        //
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        //
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        //
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild)
      )
        break;

    case Constans.rook:
      if (
        startId + width === target ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`)) ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`)) ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`)) ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 3}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 4}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 5}"]`) &&
          !document.querySelector(`[square-id="${startId + width * 6}"]`)) ||
        //
        startId - width === target ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`)) ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`)) ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`)) ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 3}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 4}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 5}"]`) &&
          !document.querySelector(`[square-id="${startId - width * 6}"]`)) ||
        //
        startId + 1 === target ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`)) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`) &&
          !document.querySelector(`[square-id="${startId + 2}"]`)) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`) &&
          !document.querySelector(`[square-id="${startId + 2}"]`) &&
          !document.querySelector(`[square-id="${startId + 3}"]`)) ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`) &&
          !document.querySelector(`[square-id="${startId + 2}"]`) &&
          !document.querySelector(`[square-id="${startId + 3}"]`) &&
          !document.querySelector(`[square-id="${startId + 4}"]`)) ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`) &&
          !document.querySelector(`[square-id="${startId + 2}"]`) &&
          !document.querySelector(`[square-id="${startId + 3}"]`) &&
          !document.querySelector(`[square-id="${startId + 4}"]`) &&
          !document.querySelector(`[square-id="${startId + 5}"]`)) ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`) &&
          !document.querySelector(`[square-id="${startId + 2}"]`) &&
          !document.querySelector(`[square-id="${startId + 3}"]`) &&
          !document.querySelector(`[square-id="${startId + 4}"]`) &&
          !document.querySelector(`[square-id="${startId + 5}"]`) &&
          !document.querySelector(`[square-id="${startId + 6}"]`)) ||
        //
        startId - 1 === target ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`)) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`) &&
          !document.querySelector(`[square-id="${startId - 2}"]`)) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`) &&
          !document.querySelector(`[square-id="${startId - 2}"]`) &&
          !document.querySelector(`[square-id="${startId - 3}"]`)) ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`) &&
          !document.querySelector(`[square-id="${startId - 2}"]`) &&
          !document.querySelector(`[square-id="${startId - 3}"]`) &&
          !document.querySelector(`[square-id="${startId - 4}"]`)) ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`) &&
          !document.querySelector(`[square-id="${startId - 2}"]`) &&
          !document.querySelector(`[square-id="${startId - 3}"]`) &&
          !document.querySelector(`[square-id="${startId - 4}"]`) &&
          !document.querySelector(`[square-id="${startId - 5}"]`)) ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`) &&
          !document.querySelector(`[square-id="${startId - 2}"]`) &&
          !document.querySelector(`[square-id="${startId - 3}"]`) &&
          !document.querySelector(`[square-id="${startId - 4}"]`) &&
          !document.querySelector(`[square-id="${startId - 5}"]`) &&
          !document.querySelector(`[square-id="${startId - 6}"]`))
      )
        return true;
      break;
    default:
      break;
  }
};
