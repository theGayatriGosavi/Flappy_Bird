let board;
let boardwidth=360;
let boardheight=640;
let context;

let birdwidth=40;
let birdheight=40;
let birdx=boardwidth/8;
let birdy=boardheight/2;
//console.log(birdY);
let birdimg;
let bird={
    x : birdx,
    y : birdy,
    width : birdwidth,
    height : birdheight
}

let pipearray=[];
let pipewidth=64;
let pipeheight=512;
let pipex=boardwidth;
let pipey=0;

let toppipeimg;
let bottompipeimg;

let velocityx = -2;
let velocityy = 0;
let gravity = 0.4;

let gameover=false;

let score=0;

window.onload=function()
{
   board = document.getElementById("board");
   board.height = boardheight;
   board.width = boardwidth;
   context = board.getContext("2d");

   birdimg=new Image();
   birdimg.src="flappybird.png";
   birdimg.onload=function(){
       context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
   }

   toppipeimg=new Image();
   toppipeimg.src="toppipe.png";
   bottompipeimg=new Image();
   bottompipeimg.src="bottompipe.png";

   requestAnimationFrame(update);
   setInterval(placepipes,1500);

   document.addEventListener("keydown", movebird);
}
function update()
{
    requestAnimationFrame(update);
    if(gameover)
    {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityy +=gravity;
    bird.y = Math.max((bird.y+velocityy),0);
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameover = true;
    }

    for(let i=0; i<pipearray.length; i++)
    {
        let pipe = pipearray[i];
        pipe.x += velocityx;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width)
        {
            score += 1;
            pipe.passed = true;
        }

        if(detectCollission(bird,pipe)){
            gameover=true;
        }
    }

    while(pipearray.length>0 && pipearray[0].x < -pipewidth)
    {
        pipearray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameover)
    {
        context.fillText("Game Over", 5, 90);
    }
}

function placepipes() {

    if(gameover)
    {
        return;
    }

    let randompipey=pipey-pipeheight/4 - Math.random()*(pipeheight/2);

    let openingSpace=board.height/4;

    let toppipe={
        img : toppipeimg,
        x : pipex, 
        y : randompipey,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipearray.push(toppipe);

    let bottompipe={
        img : bottompipeimg,
        x : pipex,
        y : randompipey + pipeheight + openingSpace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipearray.push(bottompipe);
}

function movebird(e){
    if(e.code=="Space" || e.code=="ArrowUp" || e.code=="KeyX")
    {
        velocityy=-6;
        
        if(gameover)
        {
            bird.y = birdy;
            pipearray = [];
            score = 0;
            gameover = false;
        }
    }
}

function detectCollission(a,b)
{
    return a.x < b.x + b.width &&   
    a.x + a.width > b.x &&   
    a.y < b.y + b.height &&  
    a.y + a.height > b.y;   
}