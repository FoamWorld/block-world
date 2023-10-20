/* 文字数据 */
fetch(`../assets/texts/zh.json`)
    .then(response => {
        if (!response.ok) {
            let msg = "HTTP error " + response.status
            throw new Error(msg)
        }
        return response.json()
    }).then(
        data => window["zh_translation_data"] = data
    )
function text_translate(...args) {
    let lang = localsetting["lang"]
    let sections = []
    if (lang === undefined)
        lang = "zh"
    for (let text of args) {
        let local
        if (lang == "en")
            local = text.replace('_', ' ')
        else if (lang == "zh") {
            for (let clas of ["blocks", "items", "materials", "miscs"]) {
                if (local !== undefined) break
                local = zh_translation_data[clas][text]
            }
            if (local === undefined)
                local = text.replace('_', ' ')
        }
        sections.push(local)
    }
    let str = ""
    let isFirst = true
    for (let text of sections) {
        if (isFirst)
            isFirst = false
        else if (lang == "en")
            str += " "
        str += text
    }
    return str
}
/* 材质数据 */
var bimgn = [
    "andesite", "basalt", "book", "carving_table", "chest", "crafting_table", "empty_bucket", "fluorite", "glass", "gold_block", "granite", "iron_block", "lava_bucket", "mould_table", "sand", "sky_leaf", "sky_log", "sky_plank", "sky_sapling", "stick", "stone", "structure_block", "vine", "wall", "water_bucket", "wooden_sign",
]
for (let i of bimgn) bimgs[i] = srcimg(`${i}.png`)
var bcaches = {}
