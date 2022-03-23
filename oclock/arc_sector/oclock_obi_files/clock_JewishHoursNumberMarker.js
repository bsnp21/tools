



function init_Jewish_Hour_number() {
    var imary = document.getElementsByClassName("Hour_Number_Marker")
    for (var i = 0; i < 12; i++) {
        var offx = -0.4, offy = -0.8 //offset font size;
        if (0 === i) offx -= 0.38 //adjust for 12.

        var iR = 15.8  //for  circle 
        var x = offx + iR * Math.cos(i * Math.PI / 6 - Math.PI - Math.PI / 2)
        var y = offy + iR * Math.sin(i * Math.PI / 6 - Math.PI - Math.PI / 2)
        console.log(x, y)

        var oimg = imary[i];
        oimg.innerHTML = (0 === i) ? 12 : i
        oimg.style.transform = `translate(${x}rem,${y}rem)`

    }
}
init_Jewish_Hour_number();