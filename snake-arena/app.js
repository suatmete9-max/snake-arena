(() => {
  const canvas = document.getElementById('game-canvas');
  const context = canvas.getContext('2d');
  const game = new SnakeGame();
  const cells = { width: canvas.width / game.columns, height: canvas.height / game.rows };
  const scoreElement = document.getElementById('score');
  const bestElement = document.getElementById('best-score');
  const timerElement = document.getElementById('game-timer');
  const livesElement = document.getElementById('lives');
  const overlay = document.getElementById('game-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayMessage = document.getElementById('overlay-message');
  const overlayAction = document.getElementById('overlay-action');
  const rewardButton = document.getElementById('reward-button');
  const rewardConfirmation = document.getElementById('reward-confirmation');
  const rewardContinue = document.getElementById('reward-continue');
  const rewardCancel = document.getElementById('reward-cancel');
  const bestKey = 'snake-arena-best-score';
  let bestScore = Number(localStorage.getItem(bestKey)) || 0;
  let lives = 1;
  let running = false;
  let paused = false;
  let elapsed = 0;
  let lastTick = 0;
  let timerHandle;
  let touchStart = null;
  let rewardAttempted = false;
  let rewardCompletionHandled = false;

  bestElement.textContent = bestScore;

  function drawBoard() {
    context.fillStyle = '#173942';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(182, 239, 200, 0.08)';
    context.lineWidth = 1;
    for (let x = 0; x <= game.columns; x += 1) { context.beginPath(); context.moveTo(x * cells.width, 0); context.lineTo(x * cells.width, canvas.height); context.stroke(); }
    for (let y = 0; y <= game.rows; y += 1) { context.beginPath(); context.moveTo(0, y * cells.height); context.lineTo(canvas.width, y * cells.height); context.stroke(); }
    context.fillStyle = '#f6c95d';
    context.beginPath();
    context.arc((game.food.x + 0.5) * cells.width, (game.food.y + 0.5) * cells.height, cells.width * 0.27, 0, Math.PI * 2);
    context.fill();
    game.snake.forEach((segment, index) => {
      context.fillStyle = index === 0 ? '#d1f6db' : '#45c98a';
      const inset = index === 0 ? 2 : 3;
      context.fillRect(segment.x * cells.width + inset, segment.y * cells.height + inset, cells.width - inset * 2, cells.height - inset * 2);
    });
  }

  function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
  function updateStats() { scoreElement.textContent = game.score; bestElement.textContent = bestScore; livesElement.textContent = lives; timerElement.textContent = formatTime(elapsed); }
  function setOverlay(title, message, actionText, visible = true, showReward = false) { overlayTitle.textContent = title; overlayMessage.textContent = message; rewardButton.hidden = !showReward; rewardButton.disabled = false; rewardButton.textContent = 'Optional: Watch one ad for +1 extra life'; rewardConfirmation.hidden = true; rewardContinue.disabled = false; overlay.classList.toggle('is-hidden', !visible); }

  function startGame() {
    if (running && !paused) return;
    if (game.gameOver) { game.reset(); lives = 1; elapsed = 0; }
    running = true; game.running = true; paused = false; setOverlay('', '', '', false); lastTick = performance.now();
    window.cancelAnimationFrame(timerHandle); timerHandle = window.requestAnimationFrame(loop);
  }

  function pauseGame() {
    if (!running || game.gameOver) return;
    paused = !paused;
    if (paused) { game.running = false; setOverlay('Run paused', 'Take a breath. Your board is waiting.', 'Resume'); }
    else { game.running = true; setOverlay('', '', '', false); lastTick = performance.now(); timerHandle = window.requestAnimationFrame(loop); }
  }

  function restartGame() { game.reset(); game.running = false; lives = 1; elapsed = 0; running = false; paused = false; updateStats(); drawBoard(); setOverlay('Ready for another run?', 'Your best score is saved locally on this device.', 'Start game'); }

  function finishGame() {
    running = false; game.running = false; game.gameOver = true;
    rewardAttempted = false;
    rewardCompletionHandled = false;
    if (game.score > bestScore) { bestScore = game.score; localStorage.setItem(bestKey, String(bestScore)); }
    const storedSurvival = Number(localStorage.getItem('snake-arena-best-survival')) || 0;
    if (elapsed > storedSurvival) localStorage.setItem('snake-arena-best-survival', String(elapsed));
    if (window.snakeArenaDailyChallenge) {
      const storedDaily = Number(localStorage.getItem('snake-arena-daily-score')) || 0;
      if (game.score > storedDaily) localStorage.setItem('snake-arena-daily-score', String(game.score));
    }
    updateLeaderboard();
    updateStats(); setOverlay('Run complete', `You scored ${game.score} points in ${formatTime(elapsed)}.`, 'Play again', true, true);
    AdSlots.showDevelopmentInterstitial();
  }

  function updateLeaderboard() {
    document.getElementById('leaderboard-snake-score').textContent = localStorage.getItem('snake-arena-best-score') || '0';
    document.getElementById('leaderboard-survival').textContent = formatTime(Number(localStorage.getItem('snake-arena-best-survival')) || 0);
    document.getElementById('leaderboard-daily').textContent = localStorage.getItem('snake-arena-daily-score') || '0';
  }

  function loop(timestamp) {
    if (!running || paused) return;
    if (timestamp - lastTick >= 145) { const result = game.step(); lastTick = timestamp; if (result.dead) { lives -= 1; if (lives > 0) { const score = game.score; game.reset(); game.score = score; drawBoard(); updateStats(); } else { finishGame(); return; } } else { drawBoard(); updateStats(); } }
    elapsed = Math.floor((Date.now() - startTime) / 1000); updateStats(); timerHandle = window.requestAnimationFrame(loop);
  }

  function directStart() { startTime = Date.now() - elapsed * 1000; startGame(); }
  let startTime = Date.now();
  function handleDirection(direction) { if (!running || paused || game.gameOver) return; game.setDirection(direction); }
  document.getElementById('start-button').addEventListener('click', directStart);
  document.getElementById('pause-button').addEventListener('click', pauseGame);
  document.getElementById('restart-button').addEventListener('click', restartGame);
  overlayAction.addEventListener('click', directStart);
  rewardButton.addEventListener('click', () => {
    if (rewardAttempted) return;
    rewardButton.hidden = true;
    rewardConfirmation.hidden = false;
  });
  rewardCancel.addEventListener('click', () => { if (rewardAttempted) return; rewardConfirmation.hidden = true; rewardButton.hidden = false; });
  rewardContinue.addEventListener('click', () => {
    if (rewardAttempted) return;
    rewardAttempted = true;
    rewardCompletionHandled = false;
    rewardContinue.disabled = true;
    rewardContinue.textContent = 'Waiting for completion...';
    AdSlots.requestRewardedLife({ onComplete: () => {
      if (rewardCompletionHandled) return;
      rewardCompletionHandled = true;
      lives = 1;
      const score = game.score;
      game.reset();
      game.score = score;
      rewardConfirmation.hidden = true;
      elapsed = 0;
      updateStats();
      directStart();
    } });
  });

  document.querySelectorAll('.direction-button').forEach(button => button.addEventListener('click', () => handleDirection(button.dataset.direction)));
  canvas.addEventListener('touchstart', event => { const touch = event.changedTouches[0]; touchStart = { x: touch.clientX, y: touch.clientY }; }, { passive: true });
  canvas.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0]; const dx = touch.clientX - touchStart.x; const dy = touch.clientY - touchStart.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) handleDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    touchStart = null;
  }, { passive: true });

  window.addEventListener('game-screen-change', event => {
    if (event.detail.screenId !== 'snake-game-screen') {
      running = false;
      paused = false;
      game.running = false;
      window.cancelAnimationFrame(timerHandle);
    }
  });

  drawBoard();
  updateStats();
  updateLeaderboard();
  setOverlay('Start your run', 'Use the arrow keys, WASD, or swipe the board.', 'Start game');
})();
