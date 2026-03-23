var mouseOn = false

var imgs

function load(){
    imgs = document.querySelectorAll("img")

    console.log(imgs)

    angle = -90

    imgs.forEach(element => {
        element.style.transform = "translate(-50%,-50%);";
        element.style.transform += "translateZ(500px)";
        element.style.transform += "rotateX("+angle+")";
        angle += 45;
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
    load()
});

function on(){
    mouseOn = true
}

function off(){
    mouseOn = false
}

function scroll() {
  let id = null;
  let pos = 0;
  clearInterval(id);
  id = setInterval(frame, 5);
  function frame() {
    if (pos == 350) {
      clearInterval(id);
    } else {
      pos++;

    }
  }
} 