function lighten() {
    var articles = document.querySelectorAll("article");
    var header = document.querySelector("header")

    header.style.backgroundColor = "lightgray";
    header.style.color = "black";
    aritcles.forEach(element => {
        element.style.backgroundColor = "whitesmoke";
        element.style.color = "black";
    });
}