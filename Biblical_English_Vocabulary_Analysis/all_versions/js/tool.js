

var tool = {
    gen_obj: function () {
        var obj = {}
        $("td").each(function () {
            var txt = $(this).text().replace(/\s/g, "")
            var mat = txt.match(/([A-Za-z\'\-\,0-9]+)[\(](\d+)[\)]/)
            if (mat) {
                obj[mat[1]] = mat[2]
            }
        })
        //var str = JSON.stringify(obj, null, 4)

        return obj;
    },
    gen_tab() {
        var obj = this.gen_obj(), trs = ""
        Object.keys(obj).forEach(function (key, i) {
            trs += `<tr><td>${i}</td><td>${key}</td><td>${obj[key]}</td></tr>`
        })
        trs = `<div id='xtholder'><table border='1' id='tab'><tbody style='height:200px;display:block;overflow:scroll;background-color:#ffffff;'><tr><th>#</th><th>vocab</th><th>frq</th></tr>${trs}</tbody></table></div>`

        trs += `<textarea value='s'>${JSON.stringify(obj, null, 4)}</textarea>`
        $("body").append(trs)
        Sort_Table("tab")
    }

}