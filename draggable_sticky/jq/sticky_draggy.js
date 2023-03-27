

var basic_draggy_kits = `
<style>
.draggy {
    position: absolute;
    top: 0px;
    left: 0px;

    border: 1px solid black;
    padding-top: 1px;

    width: 30px;
}
.draggable_disableed{
    resize: both;
    overflow: auto;
}

#draggy_container {
    position: relative;
    border: 1px solid gray;

    height: 1000px;
    width: 800px;
    left: 10px;
    top: 10px;
    margin-top: 0px;
    z-index:0;
}
</style>
<div id="draggy_container" __contenteditable="true">
</div>
`
function sticky_draggy(par) {
    $("body").prepend(basic_draggy_kits)
    this.m_deleterButtonID = par.deleterButtonID
}
sticky_draggy.prototype.create_draggy = function (positions) {
    var divs = ""
    for (let [pid, obj] of Object.entries(positions)) {
        if (pid.length === 0) continue
        divs += `<div contenteditable='true' class='draggy' pid='${pid}'>${pid}</div>`;
    }
    $("#draggy_container").append(divs)
    //$(".fixed_draggy").addClass("draggy").removeClass("fixed_draggy")
}

sticky_draggy.prototype.remember_draggy_positions = function () {
    ////
    var positions = this.get_positions()
    ////
    for (let [pid, obj] of Object.entries(positions)) {
        if (obj.top < 0) obj.top = 0
        if (obj.left < 0) obj.left = 0
        $(`.draggy[pid='${pid}']`).css("left", obj.left + "px").css("top", obj.top + "px").css("width", obj.width).css("height", obj.height).html(obj.html)
    }
}
sticky_draggy.prototype.delete_position = function (pid) {
    var pos = this.get_positions()
    delete pos[pid]
    localStorage.positions = JSON.stringify(pos)
    $(`.draggy[pid='${pid}']`).remove()
}
sticky_draggy.prototype.get_positions = function () {
    var positions = localStorage.positions
    if (!positions) {
        positions = {}
    }
    else {
        positions = JSON.parse(positions)
    }
    return positions
}
sticky_draggy.prototype.update_positions = function (elem, ui) {
    var positions = this.get_positions()
    var pid = $(elem).attr('pid')
    if (ui) {
        positions[pid] = ui.position
    }
    positions[pid].width = $(elem).css("width")
    positions[pid].height = $(elem).css("height")
    positions[pid].text = $(elem).text()
    positions[pid].html = $(elem).html()

    localStorage.positions = JSON.stringify(positions)
}
sticky_draggy.prototype.enable_draggy = function () {
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
                _THIS.update_positions(this, ui)
            }
        });
        $(this).on("click", function () {
            var pid = $(this).attr('pid')
            $(`#${_THIS.m_deleterButtonID}`).text(pid)
            $(this).toggleClass("draggable_disableed")
            var draggable_disableed = $(this).hasClass("draggable_disableed")
            $(this).draggable({
                disabled: draggable_disableed,
            });
            _THIS.update_positions(this)
        })
        $(this).on("keyup", function () {
            _THIS.update_positions(this)
        })
        $(`#${_THIS.m_deleterButtonID}`).on("click", function () {
            var pid = $(this).text()
            if (pid) {
                _THIS.delete_position(pid)
            }
        })


    })
    //return positions
}

sticky_draggy.prototype.createnew = function () {
    var pid = -1
    var positions = this.get_positions()
    while (1) {
        pid++
        if (!positions[pid]) {
            positions[pid] = { text: pid, html: pid }
            break;
        }
    }
    var pos = {}
    pos[pid] = positions[pid]
    this.create_draggy(pos)
    this.enable_draggy()
    localStorage.positions = JSON.stringify(positions)
}
sticky_draggy.prototype.z_back = function () {
    var pid = $(`#${this.m_deleterButtonID}`).text()
    var zindex = $(`.draggy[pid='${pid}']`).css("z-index")
    if (isNaN(zindex)) zindex = 1
    var zdx = parseInt(zindex) - 1
    $(`.draggy[pid='${pid}']`).css("z-index", zdx)
    //$(this).text(`z-idx:${zdx}`)
    return zdx
}

sticky_draggy.prototype.localstore_load = function () {
    var positions = this.get_positions()
    this.create_draggy(positions)
    this.enable_draggy()
    this.remember_draggy_positions(positions)
}
sticky_draggy.prototype.localstore_export = function (cbf) {
    var positions = this.get_positions()
    this.Donwload_Obj_to_Jsfile("localstore", positions, cbf)
}
sticky_draggy.prototype.localstore_import = function (txt) {
    var pstart = txt.indexOf("{")
    if (pstart < 0) return alert("not object string")
    var str = txt.slice(pstart)
    try {
        var obj = JSON.parse(str)
        localStorage.positions = JSON.stringify(obj)
    } catch (e) {
        alert(e)
    }
}

sticky_draggy.prototype.Donwload_Obj_to_Jsfile = function (oname, obj, cbf) {
    var text = `var ${oname} = \n` + JSON.stringify(obj, null, 4)
    var fname = `${oname}.json.js`
    this.Donwload_Text_to_Jsfile(fname, text)
    if (cbf) cbf(text)
}
sticky_draggy.prototype.Donwload_Text_to_Jsfile = function (dwnfname, dwntext) {
    //var obj = { "123": "abc" , "345":"fffff"}
    let link = document.createElement('a');
    link.download = dwnfname;///'welcome.txt';
    let blob = new Blob([dwntext], { type: 'text/plain;charset=utf-8' });
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
}
