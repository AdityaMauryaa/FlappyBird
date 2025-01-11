let board;
let boardwidth=360;
let boardheight=640;
let context;
let birdheight=24;
let birdwidth=34;
let birdx=boardwidth/8;
let birdy=boardheight/2;
let birdImg;
//bird
let bird={
    x: birdx,
    y: birdy,
    height:birdheight,
    width:birdwidth,
}

//pipes
let pipearray=[];
let pipewidth=64;
let pipeheight=512;

let pipex=boardwidth;
let pipey=0;

let topPipeImg;
let bottomPipeImg;

//Game Physics
let velocityx=-2;
let velocity=0;
let gravity=0.4;

let gameOver=false;
let score=0;


window.onload=function(){
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");// used for drawing on the board

    //load images
    birdImg=new Image();
    birdImg.src="./flappybird.png";
    birdImg.onload=function(){

        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height)
    }

    topPipeImg=new Image();
    topPipeImg.src="./toppipe.png"
    
    
    bottomPipeImg=new Image();
    bottomPipeImg.src="./bottompipe.png"
    
    requestAnimationFrame(update);
    setInterval(placePipe,1500);
    document.addEventListener("keydown",moveBird);
}
function placePipe(){
    if(gameOver){
        return ;
    }
    let randompipey=pipey-(pipeheight/4)-Math.random()*(pipeheight/2);
    let openingspace=board.height/4;
    let toppipe={
        img:topPipeImg,
        x:pipex,
        y:randompipey,
        width:pipewidth,
        height:pipeheight,
        passed:false,
    }

    pipearray.push(toppipe);

    let bottompipe={
        img:bottomPipeImg,
        x:pipex,
        y:randompipey+pipeheight+openingspace,
        width:pipewidth,
        height:pipeheight,
        passed:false,
    }
    pipearray.push(bottompipe);
}
function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return ;
    }
    context.clearRect(0,0,board.width,board.height);
    velocity+=gravity;
    bird.y=Math.max(bird.y+velocity,1);
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    if(bird.y>=board.height){
        gameOver=true;
    }
    for(let i=0;i<pipearray.length;i++){
        let pipe=pipearray[i];
        pipe.x=pipe.x+velocityx;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);


        if(!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5;
           pipe.passed=true;
        }

        if(detectCollision(bird,pipe)){
            gameOver=true;
        }
    }
    while(pipearray.length>0  && pipearray[0].x<(-pipewidth)){
        pipearray.shift();
    }
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(score,5,45);
if(gameOver){

    context.fillText("GAME OVER ",50,350);
}
}
function moveBird(e){
    if(e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX"){
        //jump
        velocity=-6;
    }
}
function detectCollision(a,b){
    return a.x<b.x+b.width && 
            a.x+a.width>b.x &&
            a.y<b.y+b.height &&
            a.y+a.height>b.y;
}