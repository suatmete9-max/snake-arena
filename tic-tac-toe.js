(() => {
  const screen = document.getElementById('tic-tac-toe-screen');
  const boardElement = document.getElementById('tic-board');
  const statusElement = document.getElementById('tic-status');
  const userScoreElement = document.getElementById('tic-score');
  const cpuScoreElement = document.getElementById('tic-cpu-score');
  const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let board = [];
  let locked = false;
  let userScore = 0;
  let cpuScore = 0;

  const winner = cells => wins.find(line => cells[line[0]] && cells[line[0]] === cells[line[1]] && cells[line[1]] === cells[line[2]]);
  const result = () => winner(board) ? board[winner(board)[0]] : board.every(Boolean) ? 'draw' : null;
  function render() {
    boardElement.innerHTML = '';
    board.forEach((value, index) => { const cell = document.createElement('button'); cell.className = `tic-cell ${value ? `tic-${value.toLowerCase()}` : ''}`; cell.textContent = value || ''; cell.type = 'button'; cell.dataset.index = index; cell.setAttribute('aria-label', value ? `Square ${index + 1}, ${value}` : `Empty square ${index + 1}`); cell.addEventListener('click', () => userMove(index)); boardElement.appendChild(cell); });
  }
  function finish(state) { locked = true; if (state === 'X') { userScore += 1; statusElement.textContent = 'You win. Nice line.'; } else if (state === 'O') { cpuScore += 1; statusElement.textContent = 'Computer wins this round.'; } else statusElement.textContent = 'Draw game. No open squares.'; userScoreElement.textContent = userScore; cpuScoreElement.textContent = cpuScore; }
  function chooseComputerMove() {
    const open = board.map((value, index) => value ? null : index).filter(index => index !== null);
    for (const mark of ['O', 'X']) for (const index of open) { board[index] = mark; if (winner(board)) { board[index] = null; return index; } board[index] = null; }
    if (open.includes(4)) return 4;
    return open[Math.floor(Math.random() * open.length)];
  }
  function computerMove() { const index = chooseComputerMove(); if (index === undefined) return; board[index] = 'O'; const state = result(); render(); if (state) finish(state); else { locked = false; statusElement.textContent = 'Your move. You are X.'; } }
  function userMove(index) { if (!screen.classList.contains('screen-hidden') && !locked && !board[index]) { board[index] = 'X'; const state = result(); render(); if (state) finish(state); else { locked = true; statusElement.textContent = 'Computer is thinking...'; window.setTimeout(computerMove, 350); } } }
  function newGame() { board = Array(9).fill(null); locked = false; statusElement.textContent = 'Your move. You are X.'; render(); }
  document.getElementById('tic-new').addEventListener('click', newGame);
  newGame();
})();
