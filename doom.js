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

class Player {
  xPos;
  yPos;
  zPos;
  angle;
  constructor(x, y, z, a) {
    this.xPos = x;
    this.yPos = y;
    this.zPos = z;
    this.angle = a;
  }
}

class Point{
  x;
  y;
  z;

  constructor(xa,ya,za){
    this.x=xa;
    this.y=ya;
    this.z=za;

  }
}

class block{

  origin;
  w;
  h;
  len;

  constructor(origin,width, height, length){
    this.origin = origin
    this.w = width
    this.h = height
    this.len = length

  }

}

var topCanvas;
var topCntxt;
var FPCanvas;
var FPCntxt;

var blocks = [new block(new Point(200,0,0),20,20,100), new block(new Point(100,0,0),20,20,60)]

var player01 = new Player(50,0 ,100, 0);
var SPEED = 0.5;
var locked = false

document.addEventListener("DOMContentLoaded", function (arg) {
  topCanvas = document.getElementById("TOPView");
  topCntxt = topCanvas.getContext("2d");
  FPCanvas = document.getElementById("FPView");
  FPCntxt = FPCanvas.getContext("2d");
  FPCanvas.addEventListener("click", async () => {
    if (locked) {
      document.exitPointerLock();
      locked = false;
    } else {
      FPCanvas.requestPointerLock();
      document.addEventListener("mousemove", e => {
        const { movementX, movementY } = e;

        player01.angle -= movementX * 0.003;
        if (player01.angle > Math.PI * 2) {
          player01.angle -= Math.PI * 4
        } else if (player01.angle < 0) {
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

function draw() {

  //clear
  topCntxt.clearRect(0, 0, 480, 320);
  FPCntxt.clearRect(0, 0, 480, 320);

  //Top
  topCntxt.fillStyle = "rgb(10,10,10)";
  topCntxt.fillRect(0, 0, 480, 320);
  //draw player
  topCntxt.beginPath();
  topCntxt.arc(player01.xPos, player01.zPos, 5, 0, 2 * Math.PI);
  topCntxt.fillStyle = "rgb(200,200,200)";
  topCntxt.strokeStyle = "rgb(200,200,200)";
  topCntxt.fill();

  for(let i=0; i<blocks.length; i++){
    topCntxt.beginPath()
    topCntxt.rect(blocks[i].origin.x, blocks[i].origin.z, blocks[i].w, blocks[i].len);
    topCntxt.stroke()
  }

  //FP
  FPCntxt.fillStyle = "rgb(10,10,10)";
  FPCntxt.fillRect(0, 0, 480, 320);
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



function gameLoop() {
  draw();

  for (let j = 0; j < blocks.length; j++) {
      //check player's collision for singular block

      let distX = 0;
      let distY = 0;
      let left = false;
      let right = false;
      let top = false;
      let bottom = false;
      if (player01.xPos > blocks[j].origin.x + blocks[j].w) {
        distX = player01.xPos - (blocks[j].origin.x + blocks[j].w);
        right = true;
      } else if (player01.xPos < blocks[j].origin.x) {
        
        distX = player01.xPos - (blocks[j].origin.x);
        left = true;
      }
      if (player01.zPos >  blocks[j].origin.z + blocks[j].len) {
        distY = player01.zPos - (blocks[j].origin.z + blocks[j].len);
        bottom = true;
      } else if (player01.zPos < blocks[j].origin.z) {
        distY = player01.zPos - (blocks[j].origin.z);
        top = true;
      }

      
      if (((distX * distX) + (distY * distY)) <= 25) {
        if((player01.yPos+0.05)<(blocks[j].origin.y + blocks[j].h)){
          if (right) {
          player01.xPos += 1;
          } else if (left) {
            player01.xPos -= 1;
          }
          if (bottom) {
            player01.zPos += 1;
          } else if (top) {
            player01.zPos -= 1;
          }
        }else if((player01.yPos-0.05)<(blocks[j].origin.y + blocks[j].h)){
          player01.yPos = blocks[j].origin.y + blocks[j].h
        }
        


      }





  }

  if (W) {
    player01.xPos -= Math.sin(player01.angle) * SPEED;
    player01.zPos -= Math.cos(player01.angle) * SPEED;
  }
  if (A) {
    player01.xPos -= Math.sin(player01.angle + (Math.PI * 0.5)) * SPEED;
    player01.zPos -= Math.cos(player01.angle + (Math.PI * 0.5)) * SPEED;
  }
  if (S) {
    player01.xPos -= Math.sin(player01.angle + Math.PI) * SPEED;
    player01.zPos -= Math.cos(player01.angle + Math.PI) * SPEED;
  }
  if (D) {
    player01.xPos -= Math.sin(player01.angle - (Math.PI * 0.5)) * SPEED;
    player01.zPos -= Math.cos(player01.angle - (Math.PI * 0.5)) * SPEED;
  }

  window.requestAnimationFrame(gameLoop);
}