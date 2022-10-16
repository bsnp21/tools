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



    Find_root_variants: function (obj) {
        var lis = this.sort_by_key_length(obj)
        var str = JSON.stringify(lis, null, 4)
        $("body").html(`<pre>${str}</pre>`)

    }
}



