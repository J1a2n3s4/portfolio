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

class Ray {
  x1; x2; y1; y2;
}

var map = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1,
  1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1,
  1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];
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
          player01.angle -= Math.PI * 2
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
  //draw map
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 8; j++) {
      if (map[j * 12 + i] == 1) {
        topCntxt.beginPath()
        topCntxt.rect(i * 40, j * 40, 40, 40);
        topCntxt.stroke();
      }
    }
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

function drawRays() {
  let directionX = Math.cos(-player01.angle);
  let directionY = Math.sin(-player01.angle);

  for (let i = 0; i < 1; i++) {

    //calculating rays

    let camA = -player01.angle+Math.PI*1.5 - 0.5 + i/resolution

    //player's grid position

    let rayHitX;
    let rayHitY;

    let rayOffsetY;
    let rayOffsetX;

    hit = 0;

    if (camA > Math.PI) {
      rayHitY = Math.floor(player01.yPos / 40);
      rayHitX = (player01.yPos - rayHitY) * Math.atan(camA);
      rayOffsetY = -40;
      rayOffsetX = -rayOffsetY * Math.atan(camA)
    }
    else if (camA < Math.PI) {
      //check later if not working

      rayHitY = Math.floor(player01.yPos / 40);
      rayHitX = (player01.yPos - rayHitY) * Math.atan(camA);
      rayOffsetY = 40;
      rayOffsetX = -rayOffsetY * Math.atan(camA)
    }

    while (hit < 8) {
      let mx = rayHitX / 40;
      let my = rayHitY / 40;

      let mp = my * 12 + mx;

      if (mp < 96 && map[mp] > 0) {
        hit = 8;
      } else {
        rayHitX += rayOffsetX;
        rayHitY += rayOffsetY;
        hit += 1;
      }

      

    }
    topCntxt.beginPath();
    topCntxt.moveTo(player01.xPos, player01.yPos);
    topCntxt.lineTo(rayHitX,rayHitY);
    topCntxt.stroke();

  }
}

function gameLoop() {
  draw();
  drawRays();
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 8; j++) {
      if (map[j * 12 + i] == 1) {

        //check player's collision for singular block
        let distX = 0;
        let distY = 0;

        let left = false;
        let right = false;
        let top = false;
        let bottom = false;

        if (player01.xPos > i * 40 + 40) {
          distX = player01.xPos - (i * 40 + 40);

          right = true;
        } else if (player01.xPos < i * 40) {
          distX = player01.xPos - (i * 40);
          left = true;

        }
        if (player01.yPos > j * 40 + 40) {
          distY = player01.yPos - (j * 40 + 40);
          bottom = true;

        } else if (player01.yPos < j * 40) {
          distY = player01.yPos - (j * 40);
          top = true;

        }

        if (((distX * distX) + (distY * distY)) <= 25) {

          if (right) {
            player01.xPos += 1;

          } else if (left) {
            player01.xPos -= 1;

          }
          if (bottom) {
            player01.yPos += 1;

          } else if (top) {
            player01.yPos -= 1;

          }
        }

      }
    }
  }
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