var uti_englizer = {



    rsort_by_key_length: function (obj) {
        const sorted_obj = Object.fromEntries(
            Object.entries(obj).sort(([k1, ar1], [k2, ar2]) => k1.length > k2.length ? -1 : 1) //descend. 
        )
        return sorted_obj
    },
    sort_by_key_length: function (obj) {
        const sorted_obj = Object.fromEntries(
            Object.entries(obj).sort(([k1, ar1], [k2, ar2]) => k1.length < k2.length ? -1 : 1) //descend. 
        )
        return sorted_obj
    },



    gen_table: function (obj) {
        var ary = Object.keys(obj), idx = 0
        var tbs = `<table id='tab' border='1'><caption>${ary.length}</caption><tbody>`
        for (var i = 0; i < ary.length; i++) {
            var key = ary[i]
            tbs += `<tr><td>${i}</td><td id='_${idx++}' class='eWord0'>${key}</td><td>`
            for (var k = 0; k < obj[key].length; k++) {
                tbs += `<a id='_${idx++}'  class='eWord1'>${obj[key][k]}</a><br>`
            }
            tbs += `</td></tr>`
        }
        return tbs;
    },
    gen_table_event: function () {
        $(".eWord0, .eWord1").on("mouseover", function () {
            var THIS = this
            $("body.shiftBtn").each(function () {
                $(THIS).toggleClass("hili")
            })
        })
        ////

    },
    save_hili: function () {
        if (!confirm("Save?")) return;
        var idary = []
        $(".hili").each(function () {
            var id = $(this).attr("id")
            idary.push(id)
        })
        localStorage.setItem("hili", idary.join(","))
    },
    load_hili: function () {
        if (!confirm("Load?")) return;
        var idary = localStorage.getItem("hili").split(",")
        idary.forEach(function (id) {
            $(`#${id}`).addClass("hili")
        })
    },

    gen_root_variants: function (obj) {
        var lis = this.sort_by_key_length(obj)
        //var str = JSON.stringify(lis, null, 4)
        //$("body").html(`<pre>${str}</pre>`)


        const Spec2 = ["ox"]

        var ary = Object.keys(lis),
            out = {};
        for (var i = 0; i < ary.length; i++) {
            var key = ary[i];
            out[key] = []
            if (key.length <= 2) {
                if (Spec2.indexOf(key) < 0)
                    continue;
            }
            //if()
            for (var j = i + 1; j < ary.length; j++) {
                if (ary[j].indexOf(key) === 0) {
                    out[key].push(ary[j])
                    ary[j] = ""
                    continue;
                } else {
                    //i = j
                    //break;
                }
            }
        }
        return out
    },
    Find_root_variants: function (obj) {
        var out = this.gen_root_variants(obj)
        var str = this.gen_table(out)
        //var str = JSON.stringify(out, null, 4)
        $("body").append(`${Object.keys(out).length}<br>${str}`)
        this.gen_table_event()

    },


    Gen_Verb_Irregular: function () {
        var ret = {}
        $("#english-irregular-verbs-list tr").each(function () {
            var obj = {}
            var key = $(this).find("td:eq(0)").text().trim()
            var val1 = $(this).find("td:eq(1)").text().trim().replace("[?]", "")
            var val2 = $(this).find("td:eq(2)").text().trim().replace("[?]", "")
            if (key && val1 && val2) {
                var obj = {}
                val1.split("/").forEach(function (val) {
                    obj[val.trim()] = 1
                })
                val2.split("/").forEach(function (val) {
                    obj[val.trim()] = 0
                })
                ret[key] = (obj)
            }
        })


        console.log(JSON.stringify(ret, null, 4))
        for (verb in ret) {
            var ing = this.add_ing_rule1(verb, "ing")
            ret[verb][ing] = 0
        }
        $("body").prepend(`<textarea>${JSON.stringify(ret, null, 4)}</textarea>`)
    },
    add_ing_rule1: function (verb, ing) {
        if (verb === "be") return verb + ing

        var mat = verb.match(/ie$/)
        if (mat) {
            return verb.replace(/ie$/, "y" + ing)
        }
        var mat = verb.match(/ee$/)
        if (mat) {
            return verb + ing
        }

        var mat = verb.match(/[e]$/)
        if (mat) {
            return verb.replace(/[e]$/, ing)
        }

        var mat = verb.match(/[u][i]([^aeiouwxy])$/)
        if (mat) {
            return verb + mat[1] + ing
        }
        var mat = verb.match(/[^aeiou][aeiou]([^aeiouwxy])$/)
        if (mat) {
            return verb + mat[1] + ing
        }
        return verb + ing
    }


}


function enable_flipflap_shift() {
    $("body").on("keydown", function (evt) {
        if (evt.shiftKey) {
            console.log("shift")
            $(this).toggleClass("shiftBtn")
        }
    })
}
function save_hili() {
    $(".eWord")
}




$(function () {

    var verb = uti_englizer.Gen_Verb_Irregular()



})
