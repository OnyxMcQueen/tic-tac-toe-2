// Game Board Module
const gameBoardModule = (function() {
  let gameBoard = ["", "", "", "", "", "", "", "", ""];

  function getBoard(){
    return [...gameBoard];
  }

  function placeMark(index, mark){
    if(index < 0 || index > 8){
      return false;
    }
    if(gameBoard[index] === ""){
      gameBoard[index] = mark;
      return true;
    }
    return false;
  }

  function resetBoard(){
    gameBoard = ["", "", "", "", "", "", "", "", ""];
  }

  return {
    getBoard,
    placeMark,
    resetBoard
  }
})();

//Player Factory

function createPlayer(name, mark){
  return { name, mark };
}

// Game Controller Module
const gameControllerModule = (function() {
  let players = [];
  let currentPlayerIndex = 0;
  let roundCount = 0;
  let gameOver;
  let winner = null;

  const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  function isWinner(playerMark){
    const board = gameBoardModule.getBoard();
    return winningCombinations.find(([a, b, c]) => {
      return board[a] === playerMark && board[b] === playerMark && board[c] === playerMark
    })
  }

  function checkGameStatus(playerMark){
    const combo = isWinner(playerMark);
    if(combo){
      winner = players[currentPlayerIndex];
      gameOver = true;
      return { status: 'win', data: { winner, combo } }
    }
    if(roundCount === 9){
      gameOver = true;
      return { status: 'tie' };
    }

    return { status: 'continue' };
  }

  function startGame(){
    players = [
      createPlayer('Player 1', 'X'), 
      createPlayer('Player 2', 'O')
    ];
    gameBoardModule.resetBoard();
    currentPlayerIndex = 0;
    roundCount = 0;
    winner = null;
    gameOver = false;
  }

  function playTurn(index){
    if(gameOver) return { status: 'game-over' };

    const currentPlayer = players[currentPlayerIndex];
    const isPlaced = gameBoardModule.placeMark(index, currentPlayer.mark);

    if(!isPlaced) return { status: "invalid" };

    roundCount++;
    const statusResult = checkGameStatus(currentPlayer.mark);
    if(statusResult.status !== "continue") return statusResult;

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    return { status: 'continue' };
  }

  function getCurrentPlayer(){
    return players[currentPlayerIndex];
  }

  function getWinner(){
    return winner;
  }


  return {
    startGame,
    playTurn,
    getCurrentPlayer,
    getWinner
  }
})();

// Display Controller Module
const displayControllerModule = (function() {
  // Private data and methods go here
  const board = document.querySelector("#board");
  const boardCells = document.querySelectorAll(".cell");
  const statusDisplay = document.querySelector("#status-display");
  const resetBtn = document.querySelector("#reset-btn");

  function handleCellClick(){
    boardCells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        const dataIndex = Number(e.target.dataset.index);

        const result = gameControllerModule.playTurn(dataIndex);

        if(result.status === 'game-over'){
          statusDisplay.textContent = 'It Looks Like The Game Is Over!'
        } else if(result.status === 'invalid'){
          statusDisplay.textContent = 'That Spot Seems To Be Taken! Try Again'
        } else if(result.status === 'win'){
          const winnerName = result.data.winner.name;
          statusDisplay.textContent = `${winnerName} has won the game! Congrats!`
        } else if(result.status === 'tie'){
          statusDisplay.textContent = `It's a tie! Well played.`;
        } else if(result.status === 'continue'){
          updateStatusDisplay();
        }

        render();
      })
    })
  }

  function render(){
    const gameBoard = gameBoardModule.getBoard();

    for(let i = 0; i < boardCells.length; i++){
      if(i < gameBoard.length){
        boardCells[i].textContent = gameBoard[i];
      }
    }
  }

  function handleReset(){
    gameControllerModule.startGame();
    render();
    updateStatusDisplay();
  }

  function updateStatusDisplay(){
    const player = gameControllerModule.getCurrentPlayer();
    statusDisplay.textContent = `${player.name}'s Turn`;
  }

  function init(){
    handleCellClick();
    render();
    updateStatusDisplay();

    resetBtn.addEventListener('click', (e) => {
      handleReset();
    })
  }

  return {
    // Public methods and object will be returned.
    render,
    init
  }
})();

// Initialize the Game
gameControllerModule.startGame();
displayControllerModule.init();