document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  const platformCount = 5;
  const platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;

    doodler.style.left = `${doodlerLeftSpace}px`;
    doodler.style.bottom = `${doodlerBottomSpace}px`;
  }

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const {visual} = this;
      visual.classList.add('platform');
      visual.style.left = `${this.left}px`;
      visual.style.bottom = `${this.bottom}px`;
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      const platGap = 600 / platformCount;
      const newPlatBottom = 100 + i * platGap;
      const newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        const {visual} = platform;
        visual.style.bottom = `${platform.bottom}px`;

        if (platform.bottom < 10) {
          const firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          const newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 20;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if ((doodlerBottomSpace > startPoint + 200)
                || (doodlerBottomSpace > 610)) {
        fall();
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          (doodlerBottomSpace >= platform.bottom)
                    && (doodlerBottomSpace <= platform.bottom + 15)
                    && ((doodlerLeftSpace + 60) >= platform.left)
                    && (doodlerLeftSpace <= (platform.left + 85))
                    && !isJumping
        ) {
          console.log('Landed');
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  }

  function gameOver() {
    console.log('Game Over!');
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = `${score}\nNice Try!`;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function control(e) {
    if (e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveStraight();
    }
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = `${doodlerLeftSpace}px`;
      } else moveRight();
    }, 20);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace <= 315) {
        doodlerLeftSpace += 5;
        doodler.style.left = `${doodlerLeftSpace}px`;
      } else moveLeft();
    }, 20);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener('keyup', control);
    }
  }
  start();
});