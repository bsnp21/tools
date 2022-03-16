
function init_obimg() {
    var clar = document.getElementsByClassName("obimg")
    var offx = 12.5, offy = 12.5
    for (var i = 0; i < clar.length; i++) {
        var iR = 9
        if (i < 6) iR = 11.5
        var clk = clar[i]
        var x = offx + iR * Math.cos(i * Math.PI / 3 - Math.PI / 2)
        var y = offy + iR * Math.sin(i * Math.PI / 3 - Math.PI / 2)
        console.log(x, y)
        clk.style.transform = `translate(${x}rem,${y}rem)`
        clk.style.opacity = 0.5 + 0.2 * (Math.sin(i * Math.PI / 6 - Math.PI / 2));//(i+1)/15/2
        clk.style.border = "2px solid #000000"


        if (isNowObi(i)) {
            var ring = document.getElementsByClassName("obimgRing")
            ring[0].style.transform = `translate(${x}rem,${y}rem)`
        }
    }
}

function isNowObi(idx1) {
    const now = new Date();
    var hour = now.getHours();
    hour = Math.floor(hour / 2) + hour % 2;
    hour = hour % 12
    if (hour !== idx1) return false
    return true
}

init_obimg()
setInterval(init_obimg, 10000);

