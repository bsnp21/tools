var docDraw = {
    createPens:function(className, isize){
        var epen = document.getElementsByClassName(className)[0]
        var pens = []
        for (var i = 0; i < isize; i++) {
            var apen = epen.cloneNode(true)
            pens.push(apen)
            document.getElementsByTagName("body")[0].append(apen)
        }
        return pens
    },
    e2eCenterLine: function (id1, id2, edraw) {
        var ep1 = document.getElementById(id1)
        var rec1 = ep1.getBoundingClientRect();
        var ep2 = document.getElementById(id2)
        var rec2 = ep2.getBoundingClientRect();
        console.log("rec1", rec1)
        console.log("rec2", rec2)

        var ehr = edraw() //get elememt of drawer.
        var hrec = ehr.getBoundingClientRect();
        var x = rec1.x - hrec.x + rec1.width / 2;
        var y = rec1.y - hrec.y + rec1.height / 2;

        var dtx = (rec2.x + rec2.width / 2) - (rec1.x + rec1.width / 2);
        var dty = (rec2.y + rec2.height / 2) - (rec1.y + rec1.height / 2);
        var arc = Math.atan(dty / dtx)
        var deg = arc * 180 / Math.PI

        var r1 = (rec1.width + rec1.height) / 4 //avg radius.
        var r2 = (rec2.width + rec2.height) / 4 //avg radius.
        if (dtx < 0) {
            deg += 180
            x -= r1 * Math.cos(arc)
            y -= r1 * Math.sin(arc)
        } else {
            x += r1 * Math.cos(arc)
            y += r1 * Math.sin(arc)
        }


        console.log("deg", deg)

        var dist = Math.sqrt(dtx * dtx + dty * dty) - r1 - r2
        console.log("dist", dist)

        ehr.style.width = `${dist}px`
        ehr.style.transformOrigin = "0 0"

        var str = ` translate(${x}px,${y}px) rotate(${deg}deg)`
        ehr.style.transform = str

        console.log("hrec", hrec)
        console.log(str)

    },
    curveup: function (id1, id2, edraw) {
        var ep1 = document.getElementById(id1)
        var rec1 = ep1.getBoundingClientRect();
        var ep2 = document.getElementById(id2)
        var rec2 = ep2.getBoundingClientRect();
        console.log("rec1", rec1)
        console.log("rec2", rec2)

        var ehr = edraw() //get elememt of drawer.
        var hrec = ehr.getBoundingClientRect();
        var x = rec1.x - hrec.x + rec1.width / 2;
        var y = rec1.y - hrec.y + rec1.height / 2;

        var dtx = (rec2.x + rec2.width / 2) - (rec1.x + rec1.width / 2);
        var dty = (rec2.y + rec2.height / 2) - (rec1.y + rec1.height / 2);
        var arc = Math.atan(dty / dtx)
        var deg = arc * 180 / Math.PI

        var r1 = (rec1.width + rec1.height) / 8 //avg radius.
        var r2 = (rec2.width + rec2.height) / 4 //avg radius.
        if (dtx < 0) {
            deg += 180
            //x -= r1 * Math.cos(arc)
            //y -= r1 * Math.sin(arc)
        } else {
            //x -= r1 * Math.cos(arc)
            //y += r1 * Math.sin(arc)
        }
       


        console.log("deg", deg)

        var dist = Math.sqrt(dtx * dtx + dty * dty);// - r1 - r2
        console.log("dist", dist)

        ehr.style.width = `${dist}px`
        ehr.style.height = `${dist/2}px`
    
        ehr.style.transformOrigin = "0 0"

        y=rec1.y-rec1.height;//+dist/5

        var str = ` translate(${x}px,${y}px) rotate(${deg}deg)`
        ehr.style.transform = str

        console.log("hrec", hrec)
        console.log(str)

    }
}