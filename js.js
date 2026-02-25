var properties = [
    {imgSrc: 'portfolio_graphics/19_02.png', desc: "A simple poster of Porsche 959. I love this car.", imgName: "PORSCHE POSTER"},
    {imgSrc: 'portfolio_graphics/20_02.png', desc: "My attempt to make something more surreal.", imgName: "DEER POSTER"},
    {imgSrc: 'portfolio_graphics/21_02.png', desc: "Another try. This time it has a bit more character!", imgName: "DECISION POSTER"},
    {imgSrc: 'portfolio_graphics/22_02.png', desc: "A cover for an OLDTIME magazine. I got inspired by covers of the CLASSICAUTO paper.", imgName: "BUGATTI COVER"},
    {imgSrc: 'portfolio_graphics/24_02.png', desc: "My idea for Animal Farm book cover.", imgName: "BOOK COVER"},
    {imgSrc: 'portfolio_graphics/25_02.png', desc: "A poster for the school jam session.", imgName: "CONCERT POSTER"},
    
]

var viewer
var imger
var desc
var namet
var main

window.onload = init

function init(){
    viewer = document.getElementById("Viewer")
    main = document.querySelector("main")
    imger = document.getElementById("ImageView")
    desc = document.getElementById("desc")
    namet = document.querySelector("h3")

    
}




function show(propertyId){
    viewer.style.display = "flex"
    namet.innerHTML = properties[propertyId].imgName
    desc.innerHTML = properties[propertyId].desc
    imger.src = properties[propertyId].imgSrc

}

function closeView(){
    viewer.style.display = "none"
}