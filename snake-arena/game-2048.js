(() => {
  const screen = document.getElementById('game-2048-screen');
  const boardElement = document.getElementById('twenty48-board');
  const scoreElement = document.getElementById('twenty48-score');
  const bestElement = document.getElementById('twenty48-best');
  const statusElement = document.getElementById('twenty48-status');
  const bestKey = 'snake-arena-2048-best';
  let board = [];
  let score = 0;
  let best = Number(localStorage.getItem(bestKey)) || 0;
  let touchStart = null;
  bestElement.textContent = best;

  const isActive = () => !screen.classList.contains('screen-hidden');
  const emptyCells = () => board.flatMap((row, y) => row.map((value, x) => value === 0 ? { x, y } : null).filter(Boolean));
  const addTile = () => { const cells = emptyCells(); if (!cells.length) return; const cell = cells[Math.floor(Math.random() * cells.length)]; board[cell.y][cell.x] = Math.random() < 0.9 ? 2 : 4; };
  const slideRow = row => {
    const values = row.filter(Boolean);
    const merged = [];
    for (let index = 0; index < values.length; index += 1) {
      if (values[index] === values[index + 1]) { const value = values[index] * 2; merged.push(value); score += value; index += 1; }
      else merged.push(values[index]);
    }
    while (merged.length < 4) merged.push(0);
    return merged;
  };
  const transpose = matrix => matrix[0].map((_, column) => matrix.map(row => row[column]));
  const reverse = matrix => matrix.map(row => [...row].reverse());
  const move = direction => {
    let next = board.map(row => [...row]);
    if (direction === 'left') next = next.map(slideRow);
    if (direction === 'right') next = reverse(next.map(row => slideRow([...row].reverse())));
    if (direction === 'up') next = transpose(transpose(next).map(slideRow));
    if (direction === 'down') next = transpose(reverse(transpose(next).map(row => slideRow([...row].reverse()))));
    const changed = JSON.stringify(next) !== JSON.stringify(board);
    if (!changed) { if (emptyCells().length === 0 && !hasMoves()) endGame(); return; }
    board = next; addTile(); render();
    if (!hasMoves()) endGame();
  };
  const hasMoves = () => emptyCells().length > 0 || board.some((row, y) => row.some((value, x) => value && ((x < 3 && value === board[y][x + 1]) || (y < 3 && value === board[y + 1][x]))));
  const endGame = () => { statusElement.textContent = 'Grid locked. Start a new game to play again.'; };
  function render() {
    boardElement.innerHTML = '';
    board.flat().forEach(value => { const tile = document.createElement('div'); tile.className = `tile tile-${value || 'empty'}`; tile.textContent = value || ''; tile.setAttribute('aria-label', value ? `Tile ${value}` : 'Empty tile'); boardElement.appendChild(tile); });
    scoreElement.textContent = score; bestElement.textContent = best;
    if (score > best) { best = score; localStorage.setItem(bestKey, String(best)); bestElement.textContent = best; }
  }
  function newGame() { board = Array.from({ length: 4 }, () => Array(4).fill(0)); score = 0; addTile(); addTile(); statusElement.textContent = 'Join the numbers.'; render(); }
  const handleKey = event => { if (!isActive()) return; const directions = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' }; if (!directions[event.key]) return; event.preventDefault(); move(directions[event.key]); };
  window.addEventListener('keydown', handleKey);
  boardElement.addEventListener('touchstart', event => { const touch = event.changedTouches[0]; touchStart = { x: touch.clientX, y: touch.clientY }; }, { passive: true });
  boardElement.addEventListener('touchend', event => { if (!touchStart) return; const touch = event.changedTouches[0]; const dx = touch.clientX - touchStart.x; const dy = touch.clientY - touchStart.y; if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')); touchStart = null; }, { passive: true });
  document.getElementById('twenty48-new').addEventListener('click', newGame);
  newGame();
})();
