/* 文字数据 */
function text_translate(...args) {
    // localsetting["lang"]
    return ""
}
/* 材质数据 */
var bimgn = [
    "andesite", "basalt", "book", "carving_table", "chest", "crafting_table", "empty_bucket", "fluorite", "glass", "gold_block", "granite", "iron_block", "lava_bucket", "mould_table", "sand", "sky_leaf", "sky_log", "sky_plank", "sky_sapling", "stick", "stone", "structure_block", "vine", "wall", "water_bucket", "wooden_sign",
]
for (let i of bimgn) bimgs[i] = srcimg(`${i}.png`)
var bcaches = {}
