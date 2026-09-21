(() => {
  const screen = document.getElementById('memory-match-screen');
  const boardElement = document.getElementById('memory-board');
  const movesElement = document.getElementById('memory-moves');
  const timeElement = document.getElementById('memory-time');
  const statusElement = document.getElementById('memory-status');
  const symbols = ['&#127822;', '&#127819;', '&#127818;', '&#127826;', '&#127827;', '&#127815;', '&#127825;', '&#127817;'];
  let cards = [];
  let first = null;
  let second = null;
  let locked = false;
  let moves = 0;
  let seconds = 0;
  let timer = null;

  const formatTime = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  function render() {
    boardElement.innerHTML = '';
    cards.forEach((card, index) => { const button = document.createElement('button'); button.className = `memory-card ${card.flipped || card.matched ? 'is-open' : ''} ${card.matched ? 'is-matched' : ''}`; button.type = 'button'; button.innerHTML = card.flipped || card.matched ? card.symbol : '?'; button.setAttribute('aria-label', card.flipped || card.matched ? `Card ${card.symbol.replace(/<[^>]*>/g, '')}` : 'Hidden memory card'); button.addEventListener('click', () => flip(index)); boardElement.appendChild(button); });
    movesElement.textContent = moves; timeElement.textContent = formatTime(seconds);
  }
  function flip(index) {
    const card = cards[index];
    if (locked || card.flipped || card.matched || screen.classList.contains('screen-hidden')) return;
    if (!timer) timer = window.setInterval(() => { seconds += 1; timeElement.textContent = formatTime(seconds); }, 1000);
    card.flipped = true;
    if (!first) { first = index; render(); return; }
    second = index; moves += 1; locked = true; render();
    if (cards[first].symbol === cards[second].symbol) { cards[first].matched = true; cards[second].matched = true; first = null; second = null; locked = false; statusElement.textContent = cards.every(item => item.matched) ? `Complete in ${moves} moves.` : 'Pair found. Keep going.'; render(); }
    else window.setTimeout(() => { cards[first].flipped = false; cards[second].flipped = false; first = null; second = null; locked = false; statusElement.textContent = 'Try another pair.'; render(); }, 700);
  }
  function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
  function newGame() { window.clearInterval(timer); timer = null; cards = shuffle([...symbols, ...symbols]).map(symbol => ({ symbol, flipped: false, matched: false })); first = null; second = null; locked = false; moves = 0; seconds = 0; statusElement.textContent = 'Find every pair.'; render(); }
  document.getElementById('memory-new').addEventListener('click', newGame);
  newGame();
})();
