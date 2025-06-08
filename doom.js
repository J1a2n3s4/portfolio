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
  updown;
  velocity;

  constructor(x, y, z, a) {
    this.xPos = x;
    this.yPos = y;
    this.zPos = z;
    this.angle = a;
    this.updown = 0
    this.velocity = new Point(0,0,0);
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

class wall{
  a;
  b;
  c;
  d;
  constructor(a1,b1,c1,d1){
    this.a = a1
    this.b = b1
    this.c = c1
    this.d = d1
  }
}

class block{

  color
  origin;
  w;
  h;
  len;
  walls;
  distToPlayer
  middle;


  constructor(origin,width, height, length, color){
    this.origin = origin
    this.w = width
    this.h = height
    this.len = length
    this.walls = new Array;
    this.color = color

    this.middle = new Point(
      origin.x + (width/2),
      0,
      origin.z + (length/2),
    )

    this.walls.push(
      new wall(
        origin,
        new Point(origin.x + width, origin.y, origin.z),
        new Point(origin.x, origin.y+height, origin.z),
        new Point(origin.x + width, origin.y + height, origin.z)
      )
    )

    this.walls.push(
      new wall(
        origin,
        new Point(origin.x, origin.y, origin.z + length),
        new Point(origin.x, origin.y+height, origin.z),
        new Point(origin.x, origin.y + height, origin.z+length)
      )
    )

    this.walls.push(
      new wall(
        new Point(origin.x, origin.y, origin.z + length),
        new Point(origin.x + width, origin.y, origin.z + length),
        new Point(origin.x, origin.y+height, origin.z+length),
        new Point(origin.x + width, origin.y + height, origin.z+length)
      )
    )
    
    this.walls.push(
      new wall(
        new Point(origin.x + width, origin.y, origin.z ),
        new Point(origin.x + width, origin.y, origin.z + length),
        new Point(origin.x + width, origin.y+height, origin.z),
        new Point(origin.x + width, origin.y + height, origin.z+length)
      )
    )

    this.walls.push(
      new wall(
        new Point(origin.x + width, origin.y+height, origin.z ),
        new Point(origin.x + width, origin.y+height, origin.z + length),
        new Point(origin.x + width, origin.y+height, origin.z),
        new Point(origin.x + width, origin.y + height, origin.z+length)
      )
    )
    
    
    
    

  }

}


var topCanvas;
var topCntxt;
var FPCanvas;
var FPCntxt;

var blocks = [
  new block(new Point(200,0,0),20,20,80,"rgb(70,100,100)"),
  new block(new Point(240,0,0),20,40,80,"rgb(0,100,100)"),
  new block(new Point(280,0,0),20,60,80,"rgb(0,0,100)"),
  new block(new Point(280,20,100),10,40,10,"rgb(49, 49, 96)"),
  new block(new Point(280,20,130),10,20,10,"rgb(0,30,100)"),
  new block(new Point(230,20,130),50,20,10,"rgb(0,30,100)"),
  new block(new Point(230,20,90),20,20,40,"rgb(0,30,100)"),

  new block(new Point(280,20,160),10,40,10,"rgb(200,0,100)"),
]

var player01 = new Player(50,0 ,100, 0);
var SPEED = 0.3;
var locked = false


var onFloor = false

var debug

document.addEventListener("DOMContentLoaded", function (arg) {
  debug = document.querySelector("#debug");
  topCanvas = document.getElementById("TOPView");
  topCntxt = topCanvas.getContext("2d");
  FPCanvas = document.getElementById("FPView");
  FPCntxt = FPCanvas.getContext("2d");
  FPCntxt.lineWidth = 1;
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
        player01.updown -= movementY;
        if (player01.updown > 100) {
          player01.updown = 100
        } else if (player01.updown < -100) {
          player01.updown = -100
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

  topCntxt.beginPath();
  topCntxt.moveTo(player01.xPos, player01.zPos);
  topCntxt.lineTo(player01.xPos + 100*Math.cos(-player01.angle - Math.PI*0.5), player01.zPos + 100*Math.sin(-player01.angle- Math.PI*0.5));
  topCntxt.stroke()
  

  for(let i=0; i<blocks.length; i++){
    topCntxt.beginPath()
    topCntxt.rect(blocks[i].origin.x, blocks[i].origin.z, blocks[i].w, blocks[i].len);
    topCntxt.stroke()
  }

  //FP
  FPCntxt.fillStyle = "rgb(145, 202, 251)";
  FPCntxt.fillRect(0, 0, 600, 300);
  FPCntxt.fillStyle = "rgb(67, 56, 56)";
  FPCntxt.fillRect(0, 150 + player01.updown * 2, 600, 600);

  FPCntxt.fillStyle = "rgb(200,200,200)";
  for(let i=0; i<blocks.length; i++){
    blocks[i].distToPlayer = (player01.xPos-blocks[i].middle.x)*(player01.xPos-blocks[i].middle.x) + (player01.yPos-blocks[i].middle.y)*(player01.yPos-blocks[i].middle.y)
    
  }
  for(let i=0; i<blocks.length - 1; i++){
    if(blocks[i].distToPlayer < blocks[i+1].distToPlayer){
      let tmpBlock = blocks[i]
      blocks[i] = blocks[i+1]
      blocks[i+1] = tmpBlock
    }
  }

  for(let i=0; i<blocks.length; i++){
    let block = blocks[i];
    FPCntxt.fillStyle = block.color

    let playerCS = Math.cos(player01.angle);
    let playerSI = Math.sin(player01.angle);

    for(let j=0; j < block.walls.length; j++){
      let wallPoints = new Array
      let currentWall = block.walls[j]
      wallPoints[0] = new Point(player01.xPos-currentWall.a.x,player01.zPos-currentWall.a.z,currentWall.a.y-player01.yPos-10)
      wallPoints[1] = new Point(player01.xPos-currentWall.b.x,player01.zPos-currentWall.b.z,currentWall.b.y-player01.yPos-10)
      wallPoints[2] = new Point(player01.xPos-currentWall.c.x,player01.zPos-currentWall.c.z,currentWall.c.y-player01.yPos-10)
      wallPoints[3] = new Point(player01.xPos-currentWall.d.x,player01.zPos-currentWall.d.z,currentWall.d.y-player01.yPos-10)

      for(let k = 0; k < 4; k++){
        
        wallPoints[k] = new Point(
          wallPoints[k].x*playerCS - wallPoints[k].y * playerSI,
          wallPoints[k].y*playerCS + wallPoints[k].x * playerSI,
          wallPoints[k].z
        )
        
      }

      if(((wallPoints[0].y < 1) && (wallPoints[1].y < 1))||((wallPoints[2].y < 1) && (wallPoints[3].y < 1))){continue}
      

      if((wallPoints[0].y < 1)){
        let da = wallPoints[0].y 
        let db = wallPoints[1].y

        let d = da-db

        if (d==0){d=1}


        let intersectionF = da/(d)

        wallPoints[0].x = wallPoints[0].x + intersectionF * (wallPoints[1].x - wallPoints[0].x);
        wallPoints[0].y = wallPoints[0].y + intersectionF * (wallPoints[1].y - wallPoints[0].y);
        wallPoints[0].z = wallPoints[0].z + intersectionF * (wallPoints[1].z - wallPoints[0].z);
        if(wallPoints[0].y < 0.1 &&  wallPoints[0].y > -0.1){wallPoints[0].y = 1}
      }
      if((wallPoints[1].y < 1)){
        let da = wallPoints[1].y  
        let db = wallPoints[0].y
        
        let d = da-db

        if (d==0){d=1}


        let intersectionF = da/(d)

        wallPoints[1].x = wallPoints[1].x + intersectionF * (wallPoints[0].x - wallPoints[1].x);
        wallPoints[1].y = wallPoints[1].y + intersectionF * (wallPoints[0].y - wallPoints[1].y);
        wallPoints[1].z = wallPoints[1].z + intersectionF * (wallPoints[0].z - wallPoints[1].z);
        if(wallPoints[1].y < 0.1 &&  wallPoints[1].y > -0.1){wallPoints[1].y = 1}
      }

      if((wallPoints[2].y < 1)){
        let da = wallPoints[2].y 
        let db = wallPoints[3].y
        let d = da-db

        if (d==0){d=1}  
        let intersectionF = da/(d)

        wallPoints[2].x = wallPoints[2].x + intersectionF * (wallPoints[3].x - wallPoints[2].x);
        wallPoints[2].y = wallPoints[2].y + intersectionF * (wallPoints[3].y - wallPoints[2].y);
        wallPoints[2].z = wallPoints[2].z + intersectionF * (wallPoints[3].z - wallPoints[2].z);
        if(wallPoints[2].y < 0.1 &&  wallPoints[2].y > -0.1){wallPoints[2].y = 1}
      }
      if((wallPoints[3].y < 1)){
        let da = wallPoints[3].y  
        let db = wallPoints[2].y
        
        let d = da-db

        if (d==0){d=1}
        
        let intersectionF = da/(d)

        wallPoints[3].x = wallPoints[3].x + intersectionF * (wallPoints[2].x - wallPoints[3].x);
        wallPoints[3].y = wallPoints[3].y + intersectionF * (wallPoints[2].y - wallPoints[3].y);
        wallPoints[3].z = wallPoints[3].z + intersectionF * (wallPoints[2].z - wallPoints[3].z);
        if(wallPoints[3].y < 0.1 &&  wallPoints[3].y > -0.1){wallPoints[3].y = 1}
      }
      

      FPCntxt.beginPath();
      for(let k = 0; k < 4; k++){
        
        wallPoints[k].x = -wallPoints[k].x*300 / wallPoints[k].y + 300;
        wallPoints[k].y = -wallPoints[k].z*300 / wallPoints[k].y + 150 + player01.updown *2;
        
      }
      FPCntxt.moveTo(wallPoints[0].x,wallPoints[0].y);
      FPCntxt.lineTo(wallPoints[1].x,wallPoints[1].y);
      FPCntxt.lineTo(wallPoints[3].x,wallPoints[3].y);
      FPCntxt.lineTo(wallPoints[2].x,wallPoints[2].y);
      FPCntxt.closePath()
      FPCntxt.fill()

    }
    
    
  }


}



window.addEventListener("keydown", function (event) {
  

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
    case " ":
      if (onFloor){
        player01.velocity.y += 1;
        onFloor = false
      }
      
    default:
      return;
  }

}, true);


window.addEventListener("keyup", function (event) {
  

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


}, true);



function gameLoop() {
  draw();

  debug.innerHTML = player01.velocity.y;
  

  player01.velocity.y -= 0.01

  if(player01.velocity.y < -0.1){
    player01.velocity.y < -0.1
  }

  if (player01.yPos < 0 ){
    onFloor = true
    player01.yPos += 0.1
    player01.velocity.y = 0
    
  }

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
        if((player01.yPos+0.01)<(blocks[j].origin.y + blocks[j].h)){
          if (right) {
          player01.xPos += 1;
          player01.velocity.x = 0
          } else if (left) {
            player01.xPos -= 1;
            player01.velocity.x = 0
          }
          if (bottom) {
            player01.zPos += 1;
            player01.velocity.z = 0
          } else if (top) {
            player01.zPos -= 1;
            player01.velocity.z = 0
          }
          

        }else if((player01.yPos-1)<(blocks[j].origin.y + blocks[j].h)){
          if(player01.velocity.y < 0){
            player01.velocity.y = 0
          }
          onFloor = true
        }
        


      }





  }
  if(onFloor){
    if (W) {
      player01.velocity.x -= Math.sin(player01.angle) * SPEED*0.1;
      player01.velocity.z -= Math.cos(player01.angle) * SPEED*0.1;
    }
    if (A) {
      player01.velocity.x -= Math.sin(player01.angle + (Math.PI * 0.5)) * SPEED*0.1;
      player01.velocity.z  -= Math.cos(player01.angle + (Math.PI * 0.5)) * SPEED*0.1;
    }
    if (S) {
      player01.velocity.x -= Math.sin(player01.angle + Math.PI) * SPEED*0.1;
      player01.velocity.z  -= Math.cos(player01.angle + Math.PI) * SPEED*0.1;
    }
    if (D) {
      player01.velocity.x -= Math.sin(player01.angle - (Math.PI * 0.5)) * SPEED*0.1;
      player01.velocity.z -= Math.cos(player01.angle - (Math.PI * 0.5)) * SPEED*0.1;
    }
    if(player01.velocity.x > SPEED){
    player01.velocity.x = SPEED
    }
    else if(-player01.velocity.x < -SPEED){
      player01.velocity.x = -SPEED
    }else{
      player01.velocity.x /= 1.05;
    }

    if(player01.velocity.z > SPEED){
      player01.velocity.z = SPEED
    }
    else if(-player01.velocity.z < -SPEED){
      player01.velocity.z = -SPEED
    }else{
      player01.velocity.z /= 1.05;
    }
  }

  

  player01.xPos += player01.velocity.x
  player01.yPos += player01.velocity.y
  player01.zPos += player01.velocity.z

  

  window.requestAnimationFrame(gameLoop);
}