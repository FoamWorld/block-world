/* 文字数据 */
function textof(lang, id) {
    let la = globalThis[lang + "_spec"]
    let tr = la[id]
    return tr === undefined ? id : tr
}
var zh_CN_spec = {
    "石头0": "花岗岩", "石头1": "玄武岩", "石头2": "安山岩", "石头3": "石头",
    "树叶0": "苍穹树叶", "木板0": "苍穹木板", "树苗0": "苍穹树苗", "原木0": "苍穹原木",
}
/* 称谓数据 */
function getblkbystr(s) {
    let t = jump2blk[s]
    if (t != undefined) { s = t }
    t = name2blk[s]
    if (t == undefined) return decode(`(${s})`)
    else return decode(`(${t})`)
}
const name2blk = {
    "安山岩": "石头,2",
    "玄武岩": "石头,1",
    "陶瓷块": "块,(陶瓷)",
    "黏土块": "块,(黏土)",
    "铜块": "块,(铜)",
    "铜锭": "锭,(铜)",
    "金块": "块,(金)",
    "金锭": "锭,(金)",
    "花岗岩": "石头,0",
    "铁块": "块,(铁)",
    "铁锭": "锭,(铁)",
    "苍穹木薄板": "薄板,(苍穹木)",
    "苍穹树叶": "树叶,0",
    "苍穹木板": "木板,0",
    "苍穹树苗": "树苗,0",
    "苍穹原木": "原木,0",
    "石头": "石头,3",
}
const jump2blk = {
    "air": "空气",
    "andesite": "安山岩",
    "assemble_table": "组装台",
    "basalt": "玄武岩",
    "bomb": "Bomb",
    "carving_table": "刻制台",
    "ceramic_block": "陶瓷块",
    "chest": "箱子",
    "clay_block": "黏土块",
    "copper_block": "铜块",
    "copper_ingot": "铜锭",
    "crafting_table": "合成台",
    "fluorite": "萤石",
    "furnace": "熔炉",
    "glass": "玻璃",
    "gold_block": "金块",
    "gold_ingot": "金锭",
    "granite": "花岗岩",
    "ice": "冰",
    "iron_block": "铁块",
    "iron_ingot": "铁锭",
    "lava": "岩浆",
    "mould_table": "模具台",
    "sand": "沙子",
    "sky_lamina": "苍穹木薄板",
    "sky_leaf": "苍穹树叶",
    "sky_plank": "苍穹木板",
    "sky_sapling": "苍穹树苗",
    "sky_wood": "苍穹原木",
    "star_rock": "星岩",
    "stone": "石头",
    "structure_block": "结构方块",
    "vine": "藤蔓",
    "water": "水",
}
const name2itm = {
    "空桶": "桶,0",
    "水桶": "桶,1",
    "岩浆桶": "桶,2",
}
const jump2itm = {
    "book": "书",
    "empty_bucket": "空桶",
    "lava_bucket": "岩浆桶",
    "water_backet": "水桶",
}
/* 材质数据 */
var bimgn = [
    // 方块材质
    "星岩", "箱子", "萤石",
    "石头0", "石头1", "石头2", "石头3",
    "木板0", "树苗0", "原木0", "树叶0",
    "结构方块", "玻璃", "合成台",
    "沙子", "告示牌", "刻制台", "模具台", "组装台", "熔炉", "高炉壁", "高炉控制器", "铁块", "金块",
    "电池块", "导线0", "导线1", "N核心", "O核心", "P核心",
    // 物品
    "书", "桶0", "桶1", "桶2",
    "木棍",
]
for (let i of bimgn) bimgs[i] = srcimg(`${i}.png`)
var bcaches = {}
/* 无限物品物品栏数据 */
var inf_item_names = {
    "自然": ["冰", "石头", "花岗岩", "玄武岩", "安山岩", "沙子", "萤石",],
    "装饰": ["苍穹原木", "苍穹树叶", "苍穹树苗", "藤蔓", "藤蔓核心"],
    "材料": ["木棍", "玻璃",
        "苍穹木板", "铁块", "金块", "铜块", "黏土块", "陶瓷块",
        "苍穹木薄板", "铁锭", "金锭", "铜锭",
    ],
    "工作台": ["合成台", "刻制台", "模具台", "组装台", "熔炉", "箱子", "高炉壁", "高炉控制器",],
    "工具": ["空桶", "水桶", "岩浆桶", "书",],
    "电路": ["电池块"],
    "权限": ["星岩", "结构方块", "Bomb"],
}
