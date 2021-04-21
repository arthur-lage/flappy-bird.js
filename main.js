const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector("#game-canvas")
const ctx = canvas.getContext("2d")

const hitSound = new Audio();
hitSound.src = 'soundEffects/hit.wav';

const skyColor = "#00B5D2";

function isColliding(player, objectToCollideWith){

    let playerVerticalPosition = player.y + player.height;
    let groundVerticalPosition = objectToCollideWith.y;

    if(playerVerticalPosition > groundVerticalPosition){
        return true;
    }

    return false;
}

function createFlappyBird(){
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        speed: 0,
        gravity: .1,
        jumpForce: 4.6,
        update(){
            if(isColliding(flappyBird, ground)){
                hitSound.play();
                setTimeout(() => {
                    changeScene(scenes.startScene);
                }, 500)
                return;
            }
    
            flappyBird.speed = flappyBird.speed + flappyBird.gravity;
            flappyBird.y += flappyBird.speed;
        },
        draw(){
            ctx.drawImage(
                sprites,
                flappyBird.spriteX, flappyBird.spriteY,
                flappyBird.width, flappyBird.height,
                flappyBird.x, flappyBird.y,
                flappyBird.width, flappyBird.height,
            )
        },
        jump(){
            flappyBird.speed -= flappyBird.jumpForce;
        }
    }
    return flappyBird;
}

const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    draw(){
        ctx.drawImage(
            sprites,
            ground.spriteX, ground.spriteY,
            ground.width, ground.height,
            ground.x, ground.y,
            ground.width, ground.height,
        )

        ctx.drawImage(
            sprites,
            ground.spriteX, ground.spriteY,
            ground.width, ground.height,
            (ground.x + ground.width), ground.y,
            ground.width, ground.height,
        )
    }
}

const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw(){
    
        ctx.fillStyle = skyColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        ctx.drawImage(
            sprites,
            background.spriteX, background.spriteY,
            background.width, background.height,
            background.x, background.y,
            background.width, background.height,
        )

        ctx.drawImage(
            sprites,
            background.spriteX, background.spriteY,
            background.width, background.height,
            (background.x + background.width), background.y,
            background.width, background.height,
        )
    }
}

const getReadyMessage = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    draw(){
        ctx.drawImage(
            sprites,
            getReadyMessage.spriteX, getReadyMessage.spriteY,
            getReadyMessage.width, getReadyMessage.height,
            getReadyMessage.x, getReadyMessage.y,
            getReadyMessage.width, getReadyMessage.height,
        )
    }
}

//
// Scenes
//

const globais = {};

let activeScene = {};
function changeScene(newScene){
    activeScene = newScene; 

    if(activeScene.initialize){
        activeScene.initialize();
    }
}

const scenes = {
    startScene:{
        initialize(){
            globais.flappyBird = createFlappyBird();
        },
        draw(){
            background.draw();
            ground.draw();
            globais.flappyBird.draw();
            getReadyMessage.draw();
        },
        click(){
            changeScene(scenes.gameScene);
        },
        update(){

        }
    }
}

scenes.gameScene = {
    draw(){
        background.draw();
        ground.draw();
        globais.flappyBird.draw();
    },
    click(){
        globais.flappyBird.jump();
    },
    update(){
        globais.flappyBird.update();
    }
}

function loop(){
    activeScene.draw();
    activeScene.update();
    
    requestAnimationFrame(loop);
}

window.addEventListener("click", () => {
    if(activeScene.click()){
        activeScene.click();
    }
})

changeScene(scenes.startScene)
loop();