Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.toLocalY4MMDD = function () {
    var syear = this.getUTCFullYear().toString()
    var smonth = (1 + this.getMonth()).toString().padStart(2, "0")
    var sdate = this.getDate().toString().padStart(2, "0")
    return syear + smonth + sdate;
}
Date.prototype.toLocal_YY_MM_DD = function () {
    var syear = this.getUTCFullYear().toString().substr(2)
    var smonth = (1 + this.getMonth()).toString().padStart(2, "0")
    var sdate = this.getDate().toString().padStart(2, "0")
    return syear + "_" + smonth + "_" + sdate;
}




var storage = {
    save_notes: function () {
        var obj = uuti.export_notes()
        var str = JSON.stringify(obj)
        $("#info").text("size:" + str.length)
        localStorage.setItem("notes", str)
        var str = JSON.stringify(obj, null, 4)
        $("#outx").val(str)
    },
    load2ui: function () {
        var str = localStorage.getItem("notes")
        $("#outx").val(str)
        if (!str) return
        uuti.render2ui(str)
    },

    input_save: function () {
        var val = $("input").each(function () {
            var val = $(this).val()
            var id = $(this).attr("id")
            if (id) {
                localStorage.setItem(id, val)
            }
        })
    },
    input_load: function () {
        var val = $("input").each(function () {
            var id = $(this).attr("id")
            if (id) {
                var val = localStorage.getItem(id)
                $(this).val(val)
            }
        })
    },

}

var uuti = {
    export_notes: function () {
        var data = {}
        $(".notes").each(function () {
            var txt = $(this).html().trim()
            var sdate = $(this).attr("id")
            if (txt.length > 1 && txt != "<ol><li></li></ol>" && txt != "<ol type=\"a\"><li></li></ol>" && txt != "<ul><li></li></ul>") {
                data[sdate] = txt
            }
        })
        //var str = JSON.stringify(data, null, 4)
        return data
    },
    Clear: function () {
        if (confirm("Empty notes of Calendar?") == false) return
        $(".notes").html("")
        setTimeout(() => {
            if (confirm("Clear all notes data in local storage? (unrecoverable)") == false) return
            localStorage.setItem("notes", "")
        }, 1)
    },
    import_Notes: function () {
        var str = $("#outx").val().trim()
        if (str.length === 0 || str[0] !== "{") return alert("no data to table")
        uuti.render2ui(str)
    },
    render2ui: function (str) {
        var obj = JSON.parse(str)
        if (!obj) return alert("not obj:" + str)
        for (let [sdate, txt] of Object.entries(obj)) {
            $(`#${sdate}`).html(txt)
        }
    },
    Txa2uiCompare: function (str) {
        var uiObj = uuti.export_notes()
        var str = $("#outx").val().trim()
        var txObj = JSON.parse(str)
        if (!txObj) return alert("not obj:" + str)

        var allNotes = {}
        Object.keys(uiObj).forEach(key => allNotes[key] = 0)
        Object.keys(txObj).forEach(key => allNotes[key] = 0)

        var trs = ""
        Object.keys(allNotes).forEach(key => {
            var txt1 = uiObj[key], txt2 = txObj[key]
            if (!txt1) txt1 = " "
            if (!txt2) txt2 = " "
            if (txt1 !== txt2) {
                trs += `<tr><td>${key}</td><td><div class='cmpitm itm1'>${txt2}</div></td><td><div class='cmpitm itm2'>${txt1}</div></td></tr>`
            }
        })
        if (trs.length === 0) return alert("identical")
        $("#cmp").html(`<table border='1' class='cmp'><thead><tr><th>date</th><th>tx</th><th>ca</th></tr></thead><tbody>${trs}</tbody></table>`)
        $(".cmpitm").on("click", function () {
            $(this).toggleClass("Hili_cmp")
            var id = $(this).parentsUntil("tbody").find("td:eq(0)").text()
            var txt = $(this).html()
            $(`#${id}`).html(txt)
            storage.save_notes()
        })
    },

    increase_width: function (idlta) {
        var width = $("#tab1 td").width();
        width += idlta
        $("td").width(width)
        $(".notes").css({ "width": width })
    },

    format_obj_txa: function () {
        var val = $("#outx").val()
        if (!val) return
        var obj = JSON.parse(val)
        var str = JSON.stringify(obj, null, 4)
        $("#outx").val(str)

        var w = $("#outx").width(), h = $("#outx").height()
        w = (w >= 500) ? 300 : 510, h = (h >= 500) ? 50 : 510
        $("#outx").css({ width: w, height: h })
    },


}



var calendar3yr = {
    gen_tbody: function (eid, inext) {
        var today = new Date()
        var todayID = today.toLocal_YY_MM_DD()

        //var yr = prompt("enter year xxxx", );
        var yr = today.getUTCFullYear()
        yr += inext

        var date = new Date(yr, 0, 1);
        //var yearEnd = new Date(2019, 11, 1);
        var trs = "", weekidx = 0, idaycounter = 0
        for (var i = 0; i <= 3650; i++) {
            var sdat = date.addDays(i);
            var iweek = sdat.getDay()
            var iyear = sdat.getUTCFullYear()
            var imont = 1 + sdat.getMonth()
            var idate = sdat.getDate()
            var sdateID = sdat.toLocal_YY_MM_DD()
            var contenteditable = ""
            if (sdateID < todayID) contenteditable = ""

            var special = ""
            if (ReservedDays[sdateID]) {
                ReservedDays[sdateID].forEach((desc) => {
                    special = `<a class='ReservedDesc' title='${desc}' href='${Festival_Website[desc]}'>${desc.substr(0, 5)}</a><br>`
                })
            }

            if (idaycounter >= 364) break


            if (0 === iweek) {
                trs += `<tr><th class='thidx'>${++weekidx}<br><a class='month${imont} month_mark'>${imont}</a></th>`;
            }
            if (weekidx === 0) continue;
            idaycounter++

            trs += `<td class='month${imont}'><div class='sday' title=${sdateID}  iweek='${iweek}'>${idate}</div><div class='ReservedDay'>${special}</div><div id=${sdateID} y4md='${sdat.toLocalY4MMDD()}' title=${sdateID} class='notes' ${contenteditable}></div></td>`;

            if (6 === iweek) {
                trs += "</tr>";
            }
        }
        //$("#year").html(yr)
        $(`${eid} caption`).text(yr);
        $(`${eid} caption`).on("click", function () {
            $(this).parent().find("tbody").slideToggle()
        })
        $(`${eid} tbody`).html(trs)
            .find("td").on("click", function () {
                $(".hili_td").removeClass("hili_td")
                $(this).toggleClass("hili_td")
            })



        if (inext != 0) return $(`${eid} tbody`)


        $(`#${todayID}`).each(function () {
            $(this).parent().find(".sday").addClass("today");
            //$(this)[0].scrollIntoView() //run in post_gen
        })


        return $(`${eid} tbody`)
    },
    end: function () {
        setTimeout(function () {
            calendar3yr.post_gen()
        }, 500)
    },
    post_gen: function () {
        storage.load2ui()

        $(".notes").on("keyup", function () {
            storage.save_notes()
        })

        //set notes width
        var width = $("td").width()
        $(".notes").css({ "width": width - 2 })

        //
        $(".notes").on("click", function (evt) {
            evt.stopImmediatePropagation()
            var _This = this
            var display = $("#editorboard").css("display")

            var bhasHili = $(this).hasClass("hili_notes")
            $(".hili_notes").removeClass("hili_notes")
            if (!bhasHili) {
                $(this).addClass("hili_notes")
            }
            bhasHili = $(this).hasClass("hili_notes")
            if (!bhasHili) {
                $("#editorboard").hide("slow", on_editorboard_hide)
                return false
            }

            if (('none' == display) && bhasHili) {
                $("#editorboard").show("slow", on_editorboard_show)
            } else {
                //$("#editxt").hide()
            }

            var sWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            var iweek = $(this).parent().index() - 1;


            var htm = $(this).html()
            $("#editxt").html(htm)
            $("#edishowdate").text($(this).attr("id") + ", " + sWeek[iweek])

            $("#editorboard")
                .css({
                    position: 'absolute',
                    xxleft: evt.pageX,
                    top: 20 + evt.pageY,
                    "margin-left": "auto",
                    "margin-right": "auto",
                    display: 'block'
                })
                .focus()

        })
        $(".sday").on("click", function () {
            $(this).toggleClass("hili_day")
        })




        $("#LoadTxt").on("click", function (e) {
            e.stopImmediatePropagation()
            var id = $(".hili_notes").attr("id")
            var tx = $("#editxt").html()
            var y4md = $(".hili_notes").attr("y4md")
            var y4 = svrApi.getY4(y4md)
            var mmdd = svrApi.getMMDD(y4md)
            console.log(id, ":", y4md, tx)
            svrApi.MyBiblicalDiary_load(y4, mmdd, function (ret) {
                $("#dbug").text(JSON.stringify(ret, null, 4))
                $("#editxt").html(ret.out.data[y4][mmdd])
            })
        })
        $("#SaveTxt").on("click", function (e) {
            e.stopImmediatePropagation()
            var id = $(".hili_notes").attr("id")
            var tx = $("#editxt").html()
            var y4md = $(".hili_notes").attr("y4md")
            console.log(id, ":", y4md, tx)
            svrApi.MyBiblicalDiary_save(svrApi.getY4(y4md), svrApi.getMMDD(y4md), tx, function (ret) {
                $("#dbug").text(JSON.stringify(ret, null, 4))
            })
        })
        ///////////////////////////////
        //$("#editorboard").hide()
        function on_editorboard_hide(e) {
            console.log("on_editorboard_hide-------")
            //alert("saves")
        }
        function on_editorboard_show(e) {
            console.log("show-------")
            //alert("loades")
        }


        $("#editxt").off("keyup").on("keyup", function (evt) {
            if (evt.keyCode === 13) {
                // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
                //document.execCommand('insertLineBreak', true, '<br/>');
                // prevent the default behaviour of return key pressed
                //return true;
            }
            var htms = $(this).html()
            var id = $("#edishowdate").text()
            $(`#${id}`).html(htms)
            storage.save_notes()
        })
        $("#editxt").on("blur", function () {
            var htms = $(this).html()
            var id = $("#edishowdate").text()
            $(`#${id}`).html(htms)
            storage.save_notes()

            $("#editorboard").hide("slow", on_editorboard_hide)
        })
        $("#editxt").on("click", function (evt) {
            evt.stopImmediatePropagation()
            return false
        })

        var eid = "#tab1"
        var rect = $(eid)[0].getBoundingClientRect();
        var width = $(eid).width()
        $("#editorboard").css({
            "left": 30 + rect.left,
            "top": 1000,
            "width": width - 100
        })
        $("#editorboard").on("click", function () {
            $(this).hide("slow", on_editorboard_hide)
        })
        $("body").on("click", function () {
            $("#editorboard").hide("slow")
        })


        $("#ScrollToToday").on("click", function () {
            $(".today")[0].scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        })
        setTimeout(function () {
            $(".today")[0].scrollIntoView()
        }, 500)

    }
}

var svrApi = {

    getY4: function (y4mmdd) {
        return y4mmdd.substr(0, 4)
    },
    getMMDD: function (y4mmdd) {
        return y4mmdd.substr(4)
    },

    MyBiblicalDiary_save: function (y4, mmdd, txt, cbf) {
        var par = {
            "fnames": [
                "./dat/MyBiblicalDiary"
            ],
            "data": {
            }
        }
        par.data[y4] = {}
        par.data[y4][mmdd] = txt
        var api = new BsnpRestApi()
        api.ApiUsrDat_save(par, cbf)
    },
    MyBiblicalDiary_load: function (y4, mmdd, cbf) {
        var par = {
            "fnames": [
                "./dat/MyBiblicalDiary"
            ],
            "data": {
            }
        }
        par.data[y4] = {}
        par.data[y4][mmdd] = ""
        var api = new BsnpRestApi()
        api.ApiUsrDat_load(par, cbf)
    }
}
//{"22_09_02":"Seattle: arrived<div><br><div><br></div></div>","22_09_03":"hiking","22_09_04":"Moderna:Safeway<div>VitaminB</div><div>RoomTemp=90</div>","22_09_05":"Reaction: less food, more sleep","22_09_06":"normal<div>痰 phlegm/sputum/Spittle </div>","22_09_07":"throat sounds but no pain or uncomfort<div>hiking 3 hrs</div>","22_09_08":"hiking 3hr<div>RoomTemp=97</div>","22_09_09":"Timberlake Park, 5 hrs 5 mi.","22_09_10":"Golden Beach; Botanical Garden.&nbsp;","22_09_11":"crossroad church:Heb10:25","22_09_27":"flight 2 atlanta","22_11_09":"yty<div>af-op</div>"}