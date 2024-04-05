import { useState } from 'react';


function Square({value, onSquareClick, highlighted}){

  return <button 
            className={`square ${highlighted ? 'highlighted' : ''}`}
            onClick={onSquareClick}
          >
            {value}
          </button>;
}


function Board({xIsNext, squares, onPlay}) {


  function handleClick(index){

    //already filled squares shouldn't be modified
    if (squares[index] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner){
    status = 'Winner: ' + winner.player;
  }
  else if (squares.every(square => square !== null)){
    status = 'Draw';
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  
  /* Hard-coded squares
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
  */

  
  const dim = 3;
  const myBoard = [];
  const winningLine = winner ? winner.line : [];

  for (let row=0; row < dim; row++){
    const myRow = [];
    for (let col=0; col < dim; col++){
      const index = row*dim+col;
      const isWinningSquare = winningLine.includes(index);
      const square = <Square 
      value={squares[index]} 
      onSquareClick={() => handleClick(index)} 
      highlighted={isWinningSquare}
      />;
      myRow.push(square);
    }
    myBoard.push(<div className="board-row">{myRow}</div>);
  };

  return (
    <>
      <div className="status">{status}</div>
      {myBoard}      
    </>
  );
}


export default function Game(){

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares){

    const nextHistory = [...history.slice(0,currentMove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares,move) => {
    let description;

    if (move>0){
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  return (
    <div classname="game">
      <div classname="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div classname="game-info">
        <ol>{moves}</ol>
      </div>
      <div> You are currently at move #{currentMove} </div>
    </div>
  );
}


function calculateWinner(squares){

  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  for (let i=0; i<lines.length; i++){
    const [a,b,c] = lines[i];
    if( squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){

      return {player: squares[a], line: [a,b,c]};
    }
  }

  return null;

}
