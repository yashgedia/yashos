
import React, { useState } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

type Player = 'X' | 'O' | null;

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player>(null);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const isDraw = !winner && board.every((square) => square !== null);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      
      {/* Status Header */}
      <div className="mb-6 text-center">
        {winner ? (
          <div className="flex items-center space-x-2 text-2xl font-bold text-yellow-500 animate-bounce">
            <Trophy size={28} />
            <span>Player {winner} Wins!</span>
          </div>
        ) : isDraw ? (
          <div className="text-xl font-semibold text-gray-500">It's a Draw!</div>
        ) : (
          <div className="flex items-center space-x-2 text-lg font-medium text-gray-600 dark:text-gray-300">
            <span>Player</span>
            <span className={`font-bold ${isXNext ? 'text-blue-500' : 'text-red-500'}`}>
              {isXNext ? 'X' : 'O'}
            </span>
            <span>'s Turn</span>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-inner">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!square || !!winner}
            className={`
              w-20 h-20 sm:w-24 sm:h-24 rounded-lg text-4xl font-bold shadow-sm transition-all duration-200
              flex items-center justify-center
              ${!square && !winner ? 'hover:bg-gray-100 dark:hover:bg-gray-600' : ''}
              ${square === 'X' ? 'text-blue-500 bg-white dark:bg-gray-800' : ''}
              ${square === 'O' ? 'text-red-500 bg-white dark:bg-gray-800' : ''}
              ${!square ? 'bg-white/50 dark:bg-gray-800/50' : ''}
            `}
          >
            {square}
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <button
        onClick={resetGame}
        className="mt-8 flex items-center space-x-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors shadow-lg active:scale-95"
      >
        <RotateCcw size={16} />
        <span>Restart Game</span>
      </button>
    </div>
  );
};
