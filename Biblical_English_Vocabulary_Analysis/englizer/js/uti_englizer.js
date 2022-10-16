var uti_englizer = {



    sort_by_key_length:function(obj){
        const sorted_obj = Object.fromEntries(
            Object.entries(obj).sort(([k1, ar1], [k2, ar2]) => k1.length > k2.length ? -1 : 1) //descend. 
        )
        return sorted_obj
    },
    find_root_variants: function (obj) {
        var lis = this.sort_by_key_length(obj)
        var str = JSON.stringify(lis,null, 4)
            $("body").html(`<pre>${str}</pre>`)

    }
}

function sort_obj_desc_by_val_ary_length(obj) {
    const sorted_obj = Object.fromEntries(
        Object.entries(obj).sort(([k1, ar1], [k2, ar2]) => ar1.length > ar2.length ? -1 : 1) //descend. 
    )

    return sorted_obj
}