let board;
let boardwidth = 360;
let boardheight = 640;
let context;
let birdheight = 24;
let birdwidth = 34;
let birdx = boardwidth / 8;
let birdy = boardheight / 2;
let birdImg;

// Bird object
let bird = {
    x: birdx,
    y: birdy,
    height: birdheight,
    width: birdwidth,
};

// Pipes
let pipearray = [];
let pipewidth = 64;
let pipeheight = 512;

let pipex = boardwidth;
let pipey = 0;

let topPipeImg;
let bottomPipeImg;

// Game physics
let velocityx = -2;
let velocity = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d"); // Used for drawing on the board

    // Load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Start game
    requestAnimationFrame(update);
    setInterval(placePipe, 1500);

    // Event listeners
    document.addEventListener("keydown", moveBird);
    board.addEventListener("touchstart", jump);
    board.addEventListener("click", jump); 

      board.addEventListener("touchstart", function (e) {
        e.preventDefault();
    });
};

// place pipes
function placePipe() {
    if (gameOver) {
        return;
    }
    let randompipey = pipey - (pipeheight / 4) - Math.random() * (pipeheight / 2);
    let openingspace = board.height / 4;

    // Top pipe
    let toppipe = {
        img: topPipeImg,
        x: pipex,
        y: randompipey,
        width: pipewidth,
        height: pipeheight,
        passed: false,
    };
    pipearray.push(toppipe);

    // Bottom pipe
    let bottompipe = {
        img: bottomPipeImg,
        x: pipex,
        y: randompipey + pipeheight + openingspace,
        width: pipewidth,
        height: pipeheight,
        passed: false,
    };
    pipearray.push(bottompipe);
}

// Update function
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Bird physics
    velocity += gravity;
    bird.y = Math.max(bird.y + velocity, 1);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Check if bird hits the ground
    if (bird.y >= board.height) {
        gameOver = true;
    }

    // Update pipes
    for (let i = 0; i < pipearray.length; i++) {
        let pipe = pipearray[i];
        pipe.x += velocityx;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Check if bird passed a pipe
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        // Detect collision
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Remove off-screen pipes
    while (pipearray.length > 0 && pipearray[0].x < -pipewidth) {
        pipearray.shift();
    }

    // Draw score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // Display "Game Over" if the game ends
    if (gameOver) {
        context.fillText("GAME OVER", 50, 300);
    }
}

// Keyboard event for bird jump
function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        jump();
    }
}

// Touch/click event for bird jump
function jump() {
    velocity = -6;

    // Reset game if it's over
    if (gameOver) {
        bird.y = birdy;
        pipearray = [];
        score = 0;
        gameOver = false;
    }
}

// Collision detection
function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
