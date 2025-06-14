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

document.addEventListener("scroll", (event) => { 
    
    var articles = document.querySelectorAll("article");
    console.log(window.scrollY)
    console.log(articles[0].getBoundingClientRect.top)

    for (let i = 0; i < articles.length; i++) {
        if(window.scrollY > articles[i].getBoundingClientRect().top){
            console.log("in")
            articles[i].classList.add("show");
            articles[i].style.opacity = "1.0"
        }
    }
})