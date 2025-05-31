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
  angle;
  constructor(x, y, a) {
    this.xPos = x;
    this.yPos = y;
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

class Wall{

  p1;
  p2;
  p3;
  p4;

  constructor(point1,point2,point3, point4){
    this.p1 = point1;
    this.p2 = point2;
    this.p3 = point3;
    this.p4 = point4;

  }

}

var topCanvas;
var topCntxt;
var FPCanvas;
var FPCntxt;

var player01 = new Player(100, 100, 2);
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
  topCntxt.arc(player01.xPos, player01.yPos, 5, 0, 2 * Math.PI);
  topCntxt.fillStyle = "rgb(200,200,200)";
  topCntxt.strokeStyle = "rgb(200,200,200)";
  topCntxt.fill();

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
  if (W) {
    player01.xPos -= Math.sin(player01.angle) * SPEED;
    player01.yPos -= Math.cos(player01.angle) * SPEED;
  }
  if (A) {
    player01.xPos -= Math.sin(player01.angle + (Math.PI * 0.5)) * SPEED;
    player01.yPos -= Math.cos(player01.angle + (Math.PI * 0.5)) * SPEED;
  }
  if (S) {
    player01.xPos -= Math.sin(player01.angle + Math.PI) * SPEED;
    player01.yPos -= Math.cos(player01.angle + Math.PI) * SPEED;
  }
  if (D) {
    player01.xPos -= Math.sin(player01.angle - (Math.PI * 0.5)) * SPEED;
    player01.yPos -= Math.cos(player01.angle - (Math.PI * 0.5)) * SPEED;
  }

  window.requestAnimationFrame(gameLoop);
}