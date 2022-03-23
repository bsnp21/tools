

function init_obimg() {
    
    var imary = document.getElementsByClassName("obimg")
    for (var i = 0; i < imary.length; i++) {
        var pt = translate_obimg(imary[i], i)
        ////determine img in the hour to flash.
        blinkingBackground_for_current_time(imary[i], pt.x, pt.y)

    }
}
function translate_obimg(oimg, i){
    const offx = 12.5, offy = 12.5 //as decorating .clock padding: 2rem;
    var iR = 8.1  //for inner circle img position
    if (i < 6) iR = 11.1 //for outer circle img position
    //var oimg = imary[i]
    var x = offx + iR * Math.cos(i * Math.PI / 3 - Math.PI / 2)
    var y = offy + iR * Math.sin(i * Math.PI / 3 - Math.PI / 2)
    //console.log(x, y)
    oimg.style.transform = `translate(${x}rem,${y}rem)`
    //oimg.style.opacity = 0.5 + 0.2 * (Math.sin(i * Math.PI / 6 - Math.PI / 2));//(i+1)/15/2
    oimg.style.opacity = 0.5
    oimg.style.border = "2px solid #000000"

    return {x:x,y:y}
}
function blinkingBackground_for_current_time(oimg, x, y) {
    var ihour = oimg.getAttribute("ihour");
    var chour = (new Date()).getHours();
    if (chour === 0) chour = 24
    var dlt = chour - ihour
    if (dlt >= 0 && dlt < 2) {//found the current img and mov flash on it.
        var ring = document.getElementsByClassName("obimgRing")
        ring[0].style.transform = `translate(${x}rem,${y}rem)`
    }
}




init_obimg()
setInterval(init_obimg, 3000)




