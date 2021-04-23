const sprites = new Image();
sprites.src = "./sprites.png";

let frames = 0;
const hitSound = new Audio();
hitSound.src = "./soundEffects/hit.wav";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const skyColor = "#00B5D2";

function isColliding(player, objectToCollideWith) {
  const playerVerticalPosition = player.y + player.height;
  const groundVerticalPosition = objectToCollideWith.y;

  if (playerVerticalPosition > groundVerticalPosition - 10) {
    return true;
  }

  return false;
}

function createFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    speed: 0,
    gravity: 0.25,
    jumpForce: 4.6,
    update() {
      if (isColliding(flappyBird, globais.ground)) {
        hitSound.play();
        setTimeout(() => {
          changeScene(scenes.gameOver);
        }, 100);
        return;
      }

      flappyBird.speed = flappyBird.speed + flappyBird.gravity;
      flappyBird.y += flappyBird.speed;
    },
    animationSprites: [
      { spriteX: 0, spriteY: 0 },
      { spriteX: 0, spriteY: 26 },
      { spriteX: 0, spriteY: 52 },
      { spriteX: 0, spriteY: 26 },
    ],
    currentFrame: 0,
    updateFrame() {
      const framesInterval = 10;
      const reachedIntervalTime = frames % framesInterval === 0;

      if (reachedIntervalTime) {
        const valueToIncrement = 1;
        const increment = valueToIncrement + flappyBird.currentFrame;
        const timesToRepeat = flappyBird.animationSprites.length;
        flappyBird.currentFrame = increment % timesToRepeat;
      }
    },
    draw() {
      flappyBird.updateFrame();
      const { spriteX, spriteY } = flappyBird.animationSprites[
        flappyBird.currentFrame
      ];
      ctx.drawImage(
        sprites,
        spriteX,
        spriteY,
        flappyBird.width,
        flappyBird.height,
        flappyBird.x,
        flappyBird.y,
        flappyBird.width,
        flappyBird.height
      );
    },
    jump() {
      flappyBird.speed -= flappyBird.jumpForce;
    },
  };
  return flappyBird;
}

function createGround() {
  const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      const groundMovementSpeed = 1;
      const repeatIn = ground.width / 2;
      const movement = ground.x - groundMovementSpeed;

      ground.x = movement % repeatIn;
    },
    draw() {
      ctx.drawImage(
        sprites,
        ground.spriteX,
        ground.spriteY,
        ground.width,
        ground.height,
        ground.x,
        ground.y,
        ground.width,
        ground.height
      );

      ctx.drawImage(
        sprites,
        ground.spriteX,
        ground.spriteY,
        ground.width,
        ground.height,
        ground.x + ground.width,
        ground.y,
        ground.width,
        ground.height
      );
    },
  };
  return ground;
}

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x,
      background.y,
      background.width,
      background.height
    );

    ctx.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x + background.width,
      background.y,
      background.width,
      background.height
    );
  },
};

const getReadyMessage = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  draw() {
    ctx.drawImage(
      sprites,
      getReadyMessage.spriteX,
      getReadyMessage.spriteY,
      getReadyMessage.width,
      getReadyMessage.height,
      getReadyMessage.x,
      getReadyMessage.y,
      getReadyMessage.width,
      getReadyMessage.height
    );
  },
};

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function (par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;

        const canoCeuX = par.x;
        const canoCeuY = yRandom;

        // [Cano do Céu]
        ctx.drawImage(
          sprites,
          canos.ceu.spriteX,
          canos.ceu.spriteY,
          canos.largura,
          canos.altura,
          canoCeuX,
          canoCeuY,
          canos.largura,
          canos.altura
        );

        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        ctx.drawImage(
          sprites,
          canos.chao.spriteX,
          canos.chao.spriteY,
          canos.largura,
          canos.altura,
          canoChaoX,
          canoChaoY,
          canos.largura,
          canos.altura
        );

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY,
        };
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,
        };
      });
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.height;

      if (globais.flappyBird.x + globais.flappyBird.width - 5 >= par.x) {
        if (cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function (par) {
        par.x = par.x - 2;

        if (canos.temColisaoComOFlappyBird(par)) {
          hitSound.play();
          changeScene(scenes.gameOver);
        }

        if (par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });
    },
  };

  return canos;
}

function createScore(){
    const score = {
        scorePoints: 0,
        draw(){
            ctx.font = '35px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = "#FFF"
            ctx.fillText(score.scorePoints, canvas.width - 10, 35)
        },
        update(){
            const framesInterval = 10;
            const hasReachedFramesInterval = frames % framesInterval === 0;

            if(hasReachedFramesInterval){
                score.scorePoints++;
            }
        }
    }

    return score;
}
    
const gameOverMessage = {
    spriteX: 134,
    spriteY: 153,
    width: 226,
    height: 200,
    x: canvas.width / 2 - 226 / 2,
    y: 50,
    draw() {
        ctx.drawImage(
        sprites,
        gameOverMessage.spriteX,
        gameOverMessage.spriteY,
        gameOverMessage.width,
        gameOverMessage.height,
        gameOverMessage.x,
        gameOverMessage.y,
        gameOverMessage.width,
        gameOverMessage.height
        );
    },
}

//
// Scenes
//

const globais = {};

let activeScene = {};
function changeScene(newScene) {
  activeScene = newScene;

  if (activeScene.initialize) {
    activeScene.initialize();
  }
}

const scenes = {
  startScene: {
    initialize() {
      globais.flappyBird = createFlappyBird();
      globais.ground = createGround();
      globais.canos = criaCanos();
    },
    draw() {
      background.draw();
      globais.flappyBird.draw();

      globais.ground.draw();
      getReadyMessage.draw();
    },
    click() {
      changeScene(scenes.gameScene);
    },
    update() {
      globais.ground.update();
    },
  },
};

scenes.gameScene = {
  initialize() {
      globais.score = createScore();
  },
  draw() {
    background.draw();
    globais.canos.desenha();
    globais.ground.draw();
    globais.flappyBird.draw();
    globais.score.draw();
  },
  click() {
    globais.flappyBird.jump();
  },
  update() {
    globais.canos.atualiza();
    globais.ground.update();
    globais.flappyBird.update();
    globais.score.update();
  },
};

scenes.gameOver = {
    draw(){
        gameOverMessage.draw();
    },
    click(){
        changeScene(scenes.startScene);
    },
    update() {

    }
}

function loop() {
  activeScene.draw();
  activeScene.update();

  frames += 1;
  requestAnimationFrame(loop);
}

window.addEventListener("click", () => {
  if (activeScene.click()) {
    activeScene.click();
  }
});

window.addEventListener("keypress", (e) => {
  if (e.code === "Space") {
    activeScene.click();
  }
});

changeScene(scenes.startScene);
loop();
