function lighten() {

    var buttonlight = document.querySelector("#lightbutton");
    var buttondark = document.querySelector("#darkbutton");

    buttonlight.style.display = "none";
    buttondark.style.display = "block";

    var articles = document.querySelectorAll("article");
    var header = document.querySelector("header");
    var body = document.querySelector("body");
    header.style.backgroundColor = "lightgray";
    header.style.color = "#1a1d1a";
    body.style.backgroundImage = 'Url("bgpattern_light.png")';

    body.style.color = "#1a1d1a";

    for (let i = 0; i < articles.length; i++) {
        const element = articles[i];
        element.style.backgroundColor = "lightgray";
        element.style.color = "#1a1d1a";
    }
}

function darken() {

    var buttonlight = document.querySelector("#lightbutton");
    var buttondark = document.querySelector("#darkbutton");

    buttonlight.style.display = "block";
    buttondark.style.display = "none";

    var articles = document.querySelectorAll("article");
    var header = document.querySelector("header");
    var body = document.querySelector("body");
    header.style.backgroundColor = "#1a1d1a";
    header.style.color = "white";
    body.style.backgroundImage = 'Url("bgpattern.png")';

    body.style.color = "white";

    for (let i = 0; i < articles.length; i++) {
        const element = articles[i];
        element.style.backgroundColor = "rgba(20,20,20,0.5)";
        element.style.color = "white";
    }
}

class Player{
    xPos;
    yPos;
    angle;
    constructor(x,y,a){
        this.xPos = x;
        this.yPos = y;
        this.angle = a;
    }
}

class Ray{
    x1;x2;y1;y2;
}

var map = [
    1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,1,1,0,0,0,0,1,
    1,1,0,1,1,1,1,1,1,0,0,1,
    1,1,0,0,0,0,0,0,0,0,0,1,
    1,0,0,0,0,0,0,0,0,0,1,1,
    1,0,0,0,0,1,0,1,0,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,
];
var topCanvas;
var topCntxt;
var FPCanvas;
var FPCntxt;

var player01 = new Player(100,100,2);
var SPEED = 0.5;
var locked = false

document.addEventListener("DOMContentLoaded", function(arg) {
    topCanvas = document.getElementById("TOPView");
    topCntxt = topCanvas.getContext("2d");
    FPCanvas = document.getElementById("FPView");
    FPCntxt = FPCanvas.getContext("2d");
    FPCanvas.addEventListener("click", async () => {
        if (locked){
            document.exitPointerLock();
            locked = false;
        }else{
            FPCanvas.requestPointerLock();
            document.addEventListener("mousemove", e => {
                const {movementX, movementY }= e;

                player01.angle -= movementX * 0.003;
                if (player01.angle > Math.PI * 2){
                    player01.angle -= Math.PI * 2
                }else if (player01.angle < 0){
                    player01.angle += Math.PI * 2
                    
                }
                
            });
            locked = true;
        }
        
        
    });
    window.requestAnimationFrame(gameLoop);
});

var W = false;
var A = false;
var S = false;
var D = false;

var resolution = 240;

function draw(){

    //clear
    topCntxt.clearRect(0,0,480,320);
    FPCntxt.clearRect(0,0,480,320);

    //Top
    topCntxt.fillStyle = "rgb(10,10,10)";
    topCntxt.fillRect(0,0,480,320);
    //draw player
    topCntxt.beginPath();
    topCntxt.arc(player01.xPos, player01.yPos, 5, 0, 2 * Math.PI);
    topCntxt.fillStyle = "rgb(200,200,200)";
    topCntxt.strokeStyle = "rgb(200,200,200)";
    topCntxt.fill();
    topCntxt.beginPath();
    topCntxt.arc(player01.xPos, player01.yPos, 20, -player01.angle - 1 - 0.5*Math.PI,  -player01.angle + 1 - 0.5*Math.PI);
    topCntxt.stroke()
    //draw map
    for(let i = 0; i<12; i++){
        for(let j = 0; j<8; j++){
            if(map[j*12+i] == 1){
                topCntxt.beginPath()
                topCntxt.rect(i*40,j*40,40,40);
                topCntxt.stroke();
            }
        }
    }

    //FP
    FPCntxt.fillStyle = "rgb(10,10,10)";
    FPCntxt.fillRect(0,0,480,320);
}




window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case "w":
      W = true;
      break;
    case "a":
      A = true;
      
      break;
    case "s":
      S = true;
      
      break;
    case "d":
      D = true;
      break;
    default:
      return;
  }

  event.preventDefault();

}, true);


window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case "w":
      W = false;
      break;
    case "a":
      A = false;
      
      break;
    case "s":
      S = false;
      
      break;
    case "d":
      D = false;
      
      break;
    default:
      return;
  }

  event.preventDefault();

}, true);

function drawRays(){
  let directionX = Math.cos(player01.angle);
  let directionY = Math.sin(player01.angle);

  for(let i = 0; i < resolution; i++){

    //calculating rays

    let camX = 2 * i / (resolution) - 1;
    let planeX = 0;
    let planeY = 0.66;
    let rayDirX = directionX + planeX * camX;
    let rayDirY = directionY + planeY * camX;

    //player's grid position

    let gridX = Math.floor(player01.xPos / 40);
    let gridY = Math.floor(player01.yPos / 40);
    
    let deltaDistX = 1e30;
    let deltaDistY = 1e30;

    if(rayDirX != 0){
      deltaDistX = Math.abs(1/rayDirX);
    }
    if(rayDirY != 0){
      deltaDistY = Math.abs(1/rayDirY);
    }
    let perpWallDist;

    let stepX;
    let stepY;
    let side;

    if (rayDirX < 0){
        stepX = -1;
        sideDistX = (player01.xPos - gridX) * deltaDistX;
      }
    else{
        stepX = 1;
        sideDistX = (gridX + 1.0 - player01.xPos) * deltaDistX;
      }
    if (rayDirY < 0){
        stepY = -1;
        sideDistY = (player01.yPos - gridY) * deltaDistY;
      }
    else{
        stepY = 1;
        sideDistY = (gridY + 1.0 - player01.yPos) * deltaDistY;
      }
      //DDA checking

  var hit = false;

  while (hit == true)
      {
        //jump to next map square, either in x-direction, or in y-direction
        if (sideDistX < sideDistY)
        {
          sideDistX += deltaDistX;
          gridX += stepX;
          side = 0;

        }
        else
        {
          sideDistY += deltaDistY;
          gridY += stepY;
          side = 1;
        }
        //Check if ray has hit a wall
        if (map[gridX*12+gridY] > 0){
          hit = true;
          topCntxt.beginPath();
          topCntxt.moveTo(player01.xPos, player01.yPos);
          topCntxt.lineTo(gridX, gridY);
          topCntxt.stroke();
        }else{
          topCntxt.beginPath();
          topCntxt.moveTo(player01.xPos, player01.yPos);
          topCntxt.lineTo(planeX.xPos + cos(player01.angle)*10, planeX.yPos + sin(player01.angle)*10);
          topCntxt.stroke();
        }
    } 

    if(side == 0) perpWallDist = (sideDistX - deltaDistX);
      else          perpWallDist = (sideDistY - deltaDistY);


    }

  
}

function gameLoop() {
  draw();
  drawRays();
  for(let i = 0; i<12; i++){
        for(let j = 0; j<8; j++){
            if(map[j*12+i] == 1){
                
                //check player's collision for singular block
                let distX = 0;
                let distY = 0;

                let left = false;
                let right = false;
                let top = false;
                let bottom = false;

                if(player01.xPos > i*40 + 40){
                  distX = player01.xPos - (i*40+40);
                  
                  right = true;
                }else if(player01.xPos < i*40){
                  distX = player01.xPos - (i*40);
                  left = true;

                }
                if(player01.yPos > j*40 + 40){
                  distY = player01.yPos - (j*40+40);
                  bottom = true;

                }else if(player01.yPos < j*40){
                  distY = player01.yPos - (j*40);
                  top = true;
                  
                }

                if(((distX*distX)+(distY*distY)) <= 25){
                  
                  if(right){
                    player01.xPos += 1;

                  }else if(left){
                    player01.xPos -= 1;

                  }
                  if(bottom){
                    player01.yPos += 1;
                    
                  }else if(top){
                    player01.yPos -= 1;
                    
                  }
                }
                
            }
        }
    }
    if(W){
        player01.xPos -= Math.sin(player01.angle) * SPEED; 
        player01.yPos -= Math.cos(player01.angle) * SPEED; 
    }
    if(A){
        player01.xPos -= Math.sin(player01.angle + (Math.PI * 0.5)) * SPEED; 
        player01.yPos -= Math.cos(player01.angle + (Math.PI * 0.5)) * SPEED; 
    }
    if(S){
        player01.xPos -= Math.sin(player01.angle + Math.PI) * SPEED; 
        player01.yPos -= Math.cos(player01.angle + Math.PI) * SPEED; 
    }
    if(D){
        player01.xPos -= Math.sin(player01.angle - (Math.PI * 0.5)) * SPEED; 
        player01.yPos -= Math.cos(player01.angle - (Math.PI * 0.5)) * SPEED; 
    }
    
    window.requestAnimationFrame(gameLoop);
}