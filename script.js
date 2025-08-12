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

// Factory function that will create player objects with public methods that
// interact with name and mark private data

function createPlayer(name, mark){
  return {
    getName: () => name,
    getMark: () => mark
  }
}