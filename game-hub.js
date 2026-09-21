(() => {
  const initialize = () => {
    const screens = [...document.querySelectorAll('.game-screen')];
    const showScreen = screenId => {
      screens.forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.add('screen-hidden');
      });
      const targetScreen = document.getElementById(screenId);
      if (!targetScreen) {
        console.error(`Missing screen element: #${screenId}`);
        return;
      }
      targetScreen.classList.remove('hidden');
      targetScreen.classList.remove('screen-hidden');
      window.dispatchEvent(new CustomEvent('game-screen-change', { detail: { screenId } }));
      targetScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

  document.querySelectorAll('[data-screen]').forEach(button => {
    button.addEventListener('click', () => {
      window.snakeArenaDailyChallenge = button.dataset.dailyChallenge === 'true';
      showScreen(button.dataset.screen);
    });
  });
  document.querySelectorAll('.back-to-games').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.screen)));

  const today = new Date();
  const dateKey = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  let seed = 17;
  for (const character of dateKey) seed = (seed * 31 + Number(character)) % 1000000;
  document.getElementById('daily-seed').textContent = String(seed).padStart(6, '0');
  document.getElementById('daily-title').textContent = `The daily grid awaits, ${dateKey.slice(4, 6)}/${dateKey.slice(6)}.`;
  document.getElementById('hub-snake-best').textContent = localStorage.getItem('snake-arena-best-score') || '0';
  document.getElementById('hub-2048-best').textContent = localStorage.getItem('snake-arena-2048-best') || '0';
  document.getElementById('leaderboard-snake-score').textContent = localStorage.getItem('snake-arena-best-score') || '0';
  document.getElementById('leaderboard-survival').textContent = formatTime(Number(localStorage.getItem('snake-arena-best-survival')) || 0);
  document.getElementById('leaderboard-daily').textContent = localStorage.getItem('snake-arena-daily-score') || '0';

  const themeToggle = document.getElementById('theme-toggle');
  const soundToggle = document.getElementById('sound-toggle');
  const storedTheme = localStorage.getItem('snake-arena-theme');
  if (storedTheme === 'light') document.body.classList.add('theme-light');
  themeToggle.addEventListener('click', () => {
    const light = document.body.classList.toggle('theme-light');
    localStorage.setItem('snake-arena-theme', light ? 'light' : 'dark');
  });
  soundToggle.addEventListener('click', () => {
    const enabled = soundToggle.getAttribute('aria-pressed') !== 'true';
    soundToggle.setAttribute('aria-pressed', String(enabled));
    soundToggle.setAttribute('aria-label', enabled ? 'Mute sound' : 'Toggle sound');
    soundToggle.classList.toggle('is-active', enabled);
  });

  function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }
  showScreen('games-home-screen');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
