class SnakeGame {
  constructor(columns = 24, rows = 18) {
    this.columns = columns;
    this.rows = rows;
    this.running = false;
    this.reset();
    window.addEventListener('keydown', event => {
      const snakeScreen = document.getElementById('snake-screen');
      if (!this.running || snakeScreen?.classList.contains('screen-hidden')) return;
      const directions = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        a: 'left',
        A: 'left',
        s: 'down',
        S: 'down',
        d: 'right',
        D: 'right'
      };
      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      this.setDirection(direction);
    });
  }

  reset() {
    const centerX = Math.floor(this.columns / 2);
    const centerY = Math.floor(this.rows / 2);
    this.snake = [{ x: centerX, y: centerY }, { x: centerX - 1, y: centerY }, { x: centerX - 2, y: centerY }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.food = this.createFood();
    this.score = 0;
    this.gameOver = false;
  }

  setDirection(direction) {
    const vectors = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const next = vectors[direction];
    if (!next || (next.x === -this.nextDirection.x && next.y === -this.nextDirection.y)) return;
    this.nextDirection = next;
  }

  step() {
    if (this.gameOver) return { ate: false, dead: true };
    this.direction = this.nextDirection;
    const head = this.snake[0];
    const nextHead = { x: head.x + this.direction.x, y: head.y + this.direction.y };
    const hitWall = nextHead.x < 0 || nextHead.x >= this.columns || nextHead.y < 0 || nextHead.y >= this.rows;
    const eating = nextHead.x === this.food.x && nextHead.y === this.food.y;
    const bodyToCheck = eating ? this.snake : this.snake.slice(0, -1);
    const hitSelf = bodyToCheck.some(segment => segment.x === nextHead.x && segment.y === nextHead.y);
    if (hitWall || hitSelf) {
      this.gameOver = true;
      return { ate: false, dead: true };
    }
    this.snake.unshift(nextHead);
    if (eating) {
      this.score += 10;
      this.food = this.createFood();
    } else {
      this.snake.pop();
    }
    return { ate: eating, dead: false };
  }

  createFood() {
    const openCells = [];
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.columns; x += 1) {
        if (!this.snake || !this.snake.some(segment => segment.x === x && segment.y === y)) openCells.push({ x, y });
      }
    }
    return openCells[Math.floor(Math.random() * openCells.length)] || { x: 0, y: 0 };
  }
}
