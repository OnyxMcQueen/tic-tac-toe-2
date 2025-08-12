// Create and return a game board object that is invoked using the module pattern.

const gameBoardModule = (function() {
  let gameBoard = ["", "", "", "", "", "", "", "", ""];

  function getBoard(){
    return [...gameBoard];
  }

  function placeMark(index, mark){
    if(index < 0 || index > 8){
      console.log('Error: index out of bounds');
      return false;
    }

    if(gameBoard[index] === ""){
      gameBoard[index] = mark;
      return true;
    } else {
      return false;
    }
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