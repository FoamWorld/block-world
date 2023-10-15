/* 合成 */
var crafts_nor = [// 必须组成指定图形，不允许旋转，但允许平移
    [[1], ["sky_log"], "sky_plank"],
    [[1], ["sky_plank"], "木棍", 9],
    [[3], ["sky_plank", "sky_plank"], "薄板,(苍穹木)", 4],
    [[3, 3], ["sky_plank", "!", "!", "!"], "合成台"],
    [[3, 3], ["sky_plank", "!", "薄板,(苍穹木)", "!"], "刻制台"],
    [[3, 3, 3], ["sky_plank", "!", "木棍", "!", "sky_plank", "!"], "箱子"],
]

/* 刻制 */
var carves_nor = {
    "sky_plank": ["模具台", "半砖,(苍穹木)"],
    "sky_wood_half_block": ["薄板,(苍穹木)"],
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
