/* 合成 */
function inner_craft(its, lin = 3, col = 3) {
    // 载入
    let ar = arrayof(lin, function () { return [] })
    for (let i = 0; i < lin; i++) {
        for (let j = 0; j < col; j++) {
            ar[i][j] = its[i * col + j].id()
        }
    }
    // 移到左上角
    let fl = false, mov_lin = 0, mov_col = 0
    while (mov_lin < lin) {
        for (let j = 0; j < col; j++) {
            if (ar[mov_lin][j] != "") {
                fl = true
                break
            }
        }
        if (fl) break
        mov_lin++
    }
    fl = false
    while (mov_col < col) {
        for (let i = mov_lin; i < lin; i++) {
            if (ar[i][mov_col] != "") {
                fl = true
                break
            }
        }
        if (fl) break
        mov_col++
    }
    if (mov_lin != 0 || mov_col != 0) {
        for (let i = mov_lin; i < lin; i++) {
            for (let j = mov_col; j < lin; j++) {
                let ts = ar[i][j]
                ar[i][j] = ""
                ar[i - mov_lin][j - mov_col] = ts
            }
        }
    }
    // 依次检查
    for (let c of crafts_nor) {
        let pat = c[0], co = 0, fl = false, prev
        let patl = pat.length
        if (patl > lin) continue
        for (let i = 0; i < patl; i++) {
            let l = pat[i]
            if (l >> col) {
                fl = true
                break
            }
            for (le = 0; le < col; le++) {
                if (l >> le & 1) {
                    if (c[1][co] != "!") prev = c[1][co]
                    if (ar[i][le] != prev) {
                        fl = true
                        break
                    }
                    co++
                }
                else if (ar[i][le] != "") {
                    fl = true
                    break
                }
            }
        }
        if (fl) continue
        return pair(c[2], c[3] === undefined ? 1 : c[3])
    }
    return null
}
var crafts_nor = [// 必须组成指定图形，不允许旋转，但允许平移
    [[1], ["sky_log"], "木板,0"],
    [[1], ["木板0"], "木棍", 9],
    [[3], ["木板0", "木板0"], "薄板,(苍穹木)", 4],
    [[3, 3], ["木板0", "!", "!", "!"], "合成台"],
    [[3, 3], ["木板0", "!", "薄板,(苍穹木)", "!"], "刻制台"],
    [[3, 3, 3], ["木板0", "!", "木棍", "!", "木板0", "!"], "箱子"],
]

/* 刻制 */
var carves_nor = {
    "木板0": ["模具台", "半砖,(苍穹木)"],
    "半砖,(苍穹木)": ["薄板,(苍穹木)"],
    "石头3": ["熔炉"],
    "陶瓷块": ["高炉壁", "高炉控制器"],
}

/* 模具 */
function inner_load_mouldof(n, mat) { // 模具
    let li = mould_dat[n]
    let ma = new ImageData(32, 32)
    for (let i = 0; i < 32; i++) {
        let n1 = li[i << 1]
        let n2 = li[i << 1 | 1]
        for (let j = 0; j < 32; j++) {
            let lig = (n1 >> j & 1) | ((n2 >> j & 1) << 1)
            let id = (i << 5 | j) << 2
            if (lig == 0) {
                ma.data[id] = mat.constructor.theme[0]
                ma.data[id | 1] = mat.constructor.theme[1]
                ma.data[id | 2] = mat.constructor.theme[2]
                ma.data[id | 3] = 0xff
            }
        }
    }
    return ma
}
function inner_load_mould(n, mat) { // 零件
    let li = mould_dat[n]
    let ma = new ImageData(32, 32)
    for (let i = 0; i < 32; i++) {
        let n1 = li[i << 1]
        let n2 = li[i << 1 | 1]
        for (let j = 0; j < 32; j++) {
            let lig = (n1 >> j & 1) | ((n2 >> j & 1) << 1)
            let id = (i << 5 | j) << 2
            if (lig != 0) ma.data[id + 3] = 0xff
            if (lig == 1) {
                ma.data[id] = mat.constructor.ltheme[0]
                ma.data[id | 1] = mat.constructor.ltheme[1]
                ma.data[id | 2] = mat.constructor.ltheme[2]
            }
            else if (lig == 2) {
                ma.data[id] = mat.constructor.theme[0]
                ma.data[id | 1] = mat.constructor.theme[1]
                ma.data[id | 2] = mat.constructor.theme[2]
            }
            else if (lig == 3) {
                ma.data[id] = mat.constructor.rtheme[0]
                ma.data[id | 1] = mat.constructor.rtheme[1]
                ma.data[id | 2] = mat.constructor.rtheme[2]
            }
        }
    }
    return ma
}
var mould_dat = { // 避免读取二进制文件
    "锭": [
        0, 0,
        0, 0,
        12582912, 0,
        33292288, 12582912,
        67092480, 33292288,
        268434432, 67092480,
        536870848, 268434432,
        2147483632, 268435392,
        1342177264, 813694912,
        1082130416, 1065877280,
        1074266104, 1073233136,
        1073758200, 1073726448,
        1073743864, 1073740784,
        1073743864, 1073740784,
        1073743868, 1073740792,
        1073743868, 1073740792,
        1073743868, 1073740792,
        2147485692, 2147482616,
        2147485694, 2147482620,
        2147487742, 2147481596,
        2147487742, 2147481596,
        2147487742, 2147481596,
        3221229567, 1073739774,
        1040191487, 33552380,
        33034236, 522176,
        511936, 13312,
        15360, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
    ],
}
var amountof = {
    "锭": 0.125,
}

/* 熔炉 */
function inner_furnace() { }
var furnace_nor = {}
