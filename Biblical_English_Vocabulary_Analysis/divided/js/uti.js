
function gen_division_obj(consolidObj, Vocab_All) {
    var obj = { "Digi": {}, "Name": {}, "Word": {}, "Extr": {} }
    Object.keys(consolidObj).forEach(function (skey, i) {
        var mat0 = skey.match(/^[\d]/)
        var mat1 = skey.match(/^[A-Z]/)
        var mat2 = skey.match(/^[a-z]/)
        var cat = ""
        if (mat0) {
            cat = "Digi"
        } else if (mat1) {
            cat = "Name"
        }
        else if (mat2) {
            cat = "Word"
        }
        else {
            cat = "Extr"
            //console.error("Tatal Error.", skey)
        }
        /////////////////
        try {
            obj[cat][skey] = consolidObj[skey]
        } catch {
            console.error("OOPs: ", cat, skey)
        }
    })
    var str = JSON.stringify(obj, null, 4)
    $("body").html(`<textarea>${str}</textarea>`)
    return obj;
}

function gen_tabs(consObj, Vocab_All) {
    var trsObj = {
        Digi: "",
        Name: "",
        Word: "",
        Extr: ""
    }

    Object.keys(consObj).forEach(function (skey, i) {
        var mat0 = skey.match(/^[\d]/)
        var mat1 = skey.match(/^[A-Z]/)
        var mat2 = skey.match(/^[a-z]/)
        var cat = "Extra"
        if (mat0) {
            cat = "Digi"
        } else if (mat1) {
            cat = "Name"
        }
        else if (mat2) {
            cat = "Word"
        }
        else {
            cat = "Extr"
            //console.error("Tatal Error.", skey)
        }

        trsObj[cat] += `<tr><td>${i}</td><td>${skey}</td><td>${consObj[skey].length}</td>`
        for (const vsn in (Vocab_All)) {
            //console.log(vsn)
            var frq = Vocab_All[vsn][skey], clname = ""
            if (undefined === frq) {
                frq = ''
                clname = "class='vsname'"
            }
            trsObj[cat] += `<td ${clname}>${frq}</td>`
        }
        trsObj[cat] += `</tr>`
    })


    var ths = `<tr><th>#</th><th>Vocab</th><th>ar</th>`
    for (const vsn in Vocab_All) {
        ths += `<th>${vsn}</th>`
    }
    ths += "</tr>"
    $("body").html("")
    Object.keys(trsObj).forEach(function (key, i) {
        var tab = `<table id="tab${i}" border="1"><caption>${key}</caption><tbody style="height:200px;overflow-y: scroll;display: block;">${ths}${trsObj[key]}</tbody></table>`
        $("body").append(tab)
    })
}


function sort_obj_desc_by_val_ary_length(obj) {
    const sorted_obj = Object.fromEntries(
        Object.entries(obj).sort(([k1, ar1], [k2, ar2]) => ar1.length > ar2.length ? -1 : 1) //descend. 
    )
    return sorted_obj
}

function merge_all(Vocab_All) {
    var obj = {}
    for (const vsn in (Vocab_All)) {
        console.log(vsn)
        for (const key in (Vocab_All[vsn])) {
            if (undefined === obj[key]) {
                obj[key] = []
            }
            obj[key].push(Vocab_All[vsn][key])
        }
    }
    return obj;//  sort_obj_desc_by_val_ary_length(obj)
}



function gen_tab1(cap, consObj, Vocab_All) {
    var trs = ""
    Object.keys(consObj).forEach(function (skey, i) {
        trs += `<tr><td>${i}</td><td>${skey}</td><td>${consObj[skey].length}</td>`
        for (const vsn in (Vocab_All)) {
            //console.log(vsn)
            var frq = Vocab_All[vsn][skey], clname = ""
            if (undefined === frq) {
                frq = ''
                clname = "class='vsname'"
            }
            trs += `<td ${clname}>${frq}</td>`
        }
        trs += `</tr>`
    })
    ///
    var ths = `<tr class='trheader'><th>#</th><th>Vocab</th><th>ar</th>`
    for (const vsn in Vocab_All) {
        ths += `<th>${vsn}</th>`

    }
    ths += "</tr>"



    var tab = `<table id="tab" border="1"><caption>${cap}</caption><tbody style="height:200px;overflow-y: scroll;display: block;">${ths}${trs}</tbody></table>`
    $("body").append(tab)


    return trs
}


function verify_obj(catObj, Vocab_All) {
    $("body").html("")
    Object.keys(catObj).forEach(function (cat) {
        gen_tab1(cat, catObj[[cat]], Vocab_All)
    })
    post_gen()
}
function post_gen() {
    ////Fixed TH
    setTimeout(function () {
        $("tr.trheader").each(function () {
            var THIS = this
            var dup = $(this).clone().removeClass("trheader").addClass("cloned").css("background-color", "grey").insertBefore(this)
                .css("position", "absolute");
            $(dup).find("th").each(function (i) {
                var width = $(THIS).find(`th:eq(${i})`).width()
                $(this).css("width", width + "px")
            })

            //Sort_Table("tab") //busy
        })

    }, 1000)

}


function Name_Table_sort(cat, catObj, Vocab_All) {
    var obj = sort_obj_desc_by_val_ary_length(catObj)
    gen_tab1(cat, obj, Vocab_All)
    post_gen()

}



function divide_ary_obj_by_ary_len(obj, Vocab_All) {
    var aryOb = []
    for (var i = 0; i <= Object.keys(Vocab_All).length; i++) {
        aryOb.push({})
    }
    for (var wkey in obj) {
        var nlen = obj[wkey].length
        aryOb[nlen][wkey] = obj[wkey]
    }
    return aryOb;
}
function Name_Table_Divided(cat, catObj, Vocab_All) {
    var aryOb = divide_ary_obj_by_ary_len(catObj, Vocab_All)
    for (var i = 1; i <= aryOb.length; i++) {
        var obj = aryOb[i]
        //gen_tab1(cat, obj, Vocab_All)
        gen_tab1(`${cat}(${i})`, obj, Vocab_All)
    }
    post_gen()
}