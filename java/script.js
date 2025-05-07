(() => {
  const canvas = document.getElementById('flappyCanvas');
  const context = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const message = document.getElementById('message');

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  let frames = 0;
  let gameState = 'start'; 
  let score = 0;

  // Bird properties
  const bird = {
      x: 60,
      y: 60,
      width: 15,
      height: 34,
      gravity: 0.3,
      lift: -10,


      draw() {
          context.save();
          context.translate(this.x + this.width / 2, this.y + this.height / 2);
          context.rotate(this.rotation);
          context.fillStyle = 'black';
          context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
          context.restore();
      },

      update() {
          this.velocity += this.gravity;
          this.velocity *= 0.9;
          this.y += this.velocity;

          if (this.y + this.height >= HEIGHT || this.y <= 0) {
              gameState = 'gameover';
              message.style.display = 'block';
              message.textContent = 'Game Over! Tap to Restart';
          }
      },

      flap() {
          this.velocity = this.lift;
      }
  };

  // Pipe properties and variables
  const pipeWidth = 50;
  const pipeGap = 140;
  const pipeSpeed = 2;
  let pipes = [];

  function createPipe() {
      const topPipeHeight = Math.floor(Math.random() * (HEIGHT - pipeGap - 120)) + 40;
      return {
          x: WIDTH,
          top: topPipeHeight,
          bottom: HEIGHT - (topPipeHeight + pipeGap),
          width: pipeWidth,
          passed: false
      };
  }

  function drawPipe(pipe) {
      context.fillStyle = '#228B22';
      context.fillRect(pipe.x, 0, pipe.width/2, pipe.top);
      context.fillRect(pipe.x, HEIGHT - pipe.bottom, pipe.width/2, pipe.bottom);
  }

  function updatePipes() {
      if (frames % 100 === 0) {
          pipes.push(createPipe());
      }
      pipes.forEach(pipe => {
          pipe.x -= pipeSpeed;

          if (!pipe.passed && pipe.x + pipe.width/2 < bird.x) {
              pipe.passed = true;
              score++;
              scoreDisplay.textContent = score;
          }
      });

      pipes = pipes.filter(pipe => pipe.x + pipe.width/2 > 0);
  }

  function collisionDetection() {
      for (let pipe of pipes) {
          if (
              bird.x < pipe.x + pipe.width &&
              bird.x + bird.width > pipe.x &&
              (bird.y < pipe.top || bird.y + bird.height > HEIGHT - pipe.bottom)
          ) {
              return true;
          }
      }
      return false;
  }

  function resetGame() {
      score = 0;
      scoreDisplay.textContent = score;
      pipes = [];
      bird.y = HEIGHT / 2;
      bird.velocity = 0;
      bird.rotation = 0;
      gameState = 'start';
      message.style.display = 'block';
      message.textContent = 'Tap to Start';
  }

  function drawBackground() {
      context.fillStyle = 'green';
      context.fillRect(0, HEIGHT -10, WIDTH, 100);
  }

  function draw() {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      drawBackground();
      pipes.forEach(drawPipe);
      bird.draw();
  }

  function update() {
      if (gameState === 'playing') {
          bird.update();
          updatePipes();

          if (collisionDetection()) {
              gameState = 'gameover';
              message.style.display = 'block';
              message.textContent = 'Game Over! Tap to Restart';
          }
      }
  }

  function loop() {
      frames++;
      update();
      draw();
      requestAnimationFrame(loop);
  }

  function flapHandler(e) {
      e.preventDefault();
      if (gameState === 'start') {
          gameState = 'playing';
          message.style.display = 'none';
          bird.flap();
      } else if (gameState === 'playing') {
          bird.flap();
      } else if (gameState === 'gameover') {
          resetGame();
      }
  }

  window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
          flapHandler(e);
      }
  });

  window.addEventListener('mousedown', flapHandler);
  window.addEventListener('touchstart', flapHandler, { passive: false });

  resetGame();
  loop();
})();
