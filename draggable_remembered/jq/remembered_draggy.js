

var basic_draggy_kits = `
<style>
.draggy {
    position: absolute;
    top: 0px;
    left: 0px;

    border: 1px solid black;
    padding-top: 10px;

    width: 30px;
}

#draggy_container {
    position: relative;
    border: 1px solid gray;

    height: 1000px;
    width: 800px;
    left: 10px;
    top: 10px;
    margin-top: 0px;

    background-color:lightgray;
}
</style>
<div id="draggy_container" contenteditable="true">

    </div>
`
function remembered_draggy() {
    $("body").prepend(basic_draggy_kits)

}
remembered_draggy.prototype.create_draggy = function (positions) {
    var divs = ""
    for (let [pid, obj] of Object.entries(positions)) {
        if (pid.length === 0) continue
        divs += `<div contenteditable='true' class='draggy' pid='${pid}'>${obj.text}</div>`;
    }
    $("#draggy_container").prepend(divs)
    //$(".fixed_draggy").addClass("draggy").removeClass("fixed_draggy")
}

remembered_draggy.prototype.remember_draggy_positions = function () {
    ////
    var positions = this.get_positions()
    ////
    for (let [pid, obj] of Object.entries(positions)) {
        if (obj.top < 0) obj.top = 0
        if (obj.left < 0) obj.left = 0
        $(`.draggy[pid='${pid}']`).css("left", obj.left + "px").css("top", obj.top + "px").css("width", obj.width).css("height", obj.height).text(obj.text)
    }
}
remembered_draggy.prototype.delete_position = function (pid) {
    var pos = this.get_positions()
    delete pos[pid]
    localStorage.positions = JSON.stringify(pos)
    $(`.draggy[pid='${pid}']`).remove()
}
remembered_draggy.prototype.get_positions = function () {
    var positions = localStorage.positions
    if (!positions) {
        positions = {}
    }
    else {
        positions = JSON.parse(positions)
    }
    return positions
}
remembered_draggy.prototype.enable_draggy = function () {
    //var tot_draggy = $(".draggy").length
    var _THIS = this
    $(".draggy").each(function (i) {
        if ($(this).hasClass("draggy_enabled")) return
        $(this).addClass("draggy_enabled")
        //$(this).removeClass("newelement")
        //$(this).attr('pid', tot_draggy + i)
        $(this).draggable({
            disabled: false,
            stop: function (event, ui) {
                var pid = $(this).attr('pid')
                var positions = _THIS.get_positions()
                positions[pid] = ui.position
                positions[pid].width = $(this).css("width")
                positions[pid].height = $(this).css("height")
                positions[pid].text = $(this).text()

                localStorage.positions = JSON.stringify(positions)
            }
        });
        $(this).on("click", function () {
            var pid = $(this).attr('pid')
            $("#deleter").text(pid)
            $(this).toggleClass("draggable_disableed")
            var draggable_disableed = $(this).hasClass("draggable_disableed")
            $(this).draggable({
                disabled: draggable_disableed,
            });

        })
    })
    //return positions
}

remembered_draggy.prototype.createnew =  function() {
    var pid = -1
    var positions = this.get_positions()
    while (1) {
        pid++
        if (!positions[pid]) {
            positions[pid] = { text: pid }
            break
        }
    }
    var pos = {}
    pos[pid] = positions[pid]
    this.create_draggy(pos)
    this.enable_draggy()
    localStorage.positions = JSON.stringify(positions)
}