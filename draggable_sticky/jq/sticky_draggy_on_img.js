

var Basic_Draggy_Doc = `
<style>
.draggy {
    position: absolute;
    top: 0px;
    left: 0px;

    padding-top: 1px;
    border: 1px solid black;
    border-width: 2;
    border-color: rgba(0,0,0,1);
    border-radius: 0%;

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
    this.m_storename = "positions"
    if (par) {
        this.draggy_set(par)
    }
}
sticky_draggy.prototype.draggy_set = function (par) {
    $("body").prepend(Basic_Draggy_Doc)
    if (par) {
        this.m_deleterButtonID = par.deleterButtonID
        if (par.storename) {
            this.m_storename = par.storename
        }
    }
}
sticky_draggy.prototype.create_draggy = function (positions) {
    var divs = ""
    for (let [pid, obj] of Object.entries(positions)) {
        if (pid.length === 0) continue
        divs += `<div contenteditable='true' class='draggy' pid='${pid}'>${pid}</div>`;
    }
    $("#draggy_container").append(divs)
}

sticky_draggy.prototype.remember_draggy_positions = function () {
    var positions = this.get_items()
    ////
    for (let [pid, obj] of Object.entries(positions)) {
        if (obj.top < 0) obj.top = 0
        if (obj.left < 0) obj.left = 0

        for (let [key, val] of Object.entries(obj)) {
            $(`.draggy[pid='${pid}']`).css(key, val)
        }
        $(`.draggy[pid='${pid}']`).css("left", obj.left + "px").css("top", obj.top + "px").css("width", obj.width).css("height", obj.height).html(obj.html)
    }
}


sticky_draggy.prototype.delete_item = function (pid) {
    var pos = this.get_items()
    delete pos[pid]
    localStorage[`${this.m_storename}`] = JSON.stringify(pos)
    $(`.draggy[pid='${pid}']`).remove()
}

sticky_draggy.prototype.get_items = function () {
    var positions = localStorage[`${this.m_storename}`]
    if (!positions) {
        positions = {}
    }
    else {
        positions = JSON.parse(positions)
    }
    return positions
}
sticky_draggy.prototype.update_item = function (elem, ui) {
    var positions = this.get_items()
    var pid = $(elem).attr('pid')
    if (ui) {
        positions[pid] = ui.position
    }
    ["width", "height", "border-radius","border-width", "border-color","z-index", "text-align", "font-size", "opacity", "background-color", "rotate", "writing-mode"].forEach(function (ckey) {
        positions[pid][ckey] = $(elem).css(ckey)
    })

    positions[pid].text = $(elem).text()
    positions[pid].html = $(elem).html()

    localStorage[`${this.m_storename}`] = JSON.stringify(positions)
}



sticky_draggy.prototype._______________disable_draggy = function () {
    $(".draggy").each(function (i) {
        $(this).attr("pid", null)
        $(this).draggable({
            disabled: true
        });
    })

}
sticky_draggy.prototype.init_draggy = function () {
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
                _THIS.update_item(this, ui)
            }
        });
        $(this).on("click", function () {
            var pid = $(this).attr('pid')
            if (!pid) return
            if (_THIS.m_deleterButtonID) {
                $(`#${_THIS.m_deleterButtonID}`).text(pid)
            }
            $(this).toggleClass("draggable_disableed")
            var draggable_disableed = $(this).hasClass("draggable_disableed")
            $(this).draggable({
                disabled: draggable_disableed,
            });
            _THIS.update_item(this)
            var items = _THIS.get_items()
            var itm = items[pid]
            var str = JSON.stringify(itm, null, 4)
            $("#txa").val(str)
        })
        $(this).on("keyup", function () {
            _THIS.update_item(this)
        })

        if (_THIS.m_deleterButtonID) {
            $(`#${_THIS.m_deleterButtonID}`).on("click", function () {
                var pid = $(this).text()
                if (pid) {
                    _THIS.delete_item(pid)
                }
            })
        }


    })
    //return positions
}

sticky_draggy.prototype.createnew = function () {
    var pid = -1
    var positions = this.get_items()
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
    this.init_draggy()
    localStorage[`${this.m_storename}`] = JSON.stringify(positions)
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
    $("#draggy_container").html("")
    var positions = this.get_items()
    this.create_draggy(positions)
    this.init_draggy()
    this.remember_draggy_positions(positions)
}
sticky_draggy.prototype.localstore_export = function (cbf) {
    var positions = this.get_items()
    this.Donwload_Obj_to_Jsfile("localstore", positions, cbf)
}
sticky_draggy.prototype.localstore_import = function (txt) {
    txt = txt.trim()
    var pstart = txt.indexOf("{")
    if (pstart < 0) return alert("not object string")
    var str = txt.slice(pstart)
    try {
        var obj = JSON.parse(str)
        if (txt.indexOf("var") === 0) {
            localStorage[`${this.m_storename}`] = JSON.stringify(obj)
        } else {
            var pid = $(`#${this.m_deleterButtonID}`).text()
            var itms = this.get_items()
            itms[pid] = obj
            localStorage[`${this.m_storename}`] = JSON.stringify(itms)
        }
    } catch (e) {
        alert(e)
    }

    this.localstore_load()
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
