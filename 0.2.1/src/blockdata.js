function getblkbystr(s){
    let t=jump2blk[s]
    if(t!=undefined){s=t}
    t=name2blk[s]
    if(t==undefined)return decode(`(${s})`)
    else return decode(`(${t})`)
}
const name2blk={
    "安山岩":"石头,2",
    "玄武岩":"石头,1",
    "花岗岩":"石头,0",
    "苍穹树叶":"树叶,0",
    "苍穹木板":"木板,0",
    "苍穹树苗":"树苗,0",
    "苍穹原木":"原木,0",
    "石头":"石头,3",
}
const jump2blk={
    "air":"空气",
    "andesite":"安山岩",
    "basalt":"玄武岩",
    "box":"箱子",
    "fluorite":"萤石",
    "granite":"花岗岩",
    "lava":"岩浆",
    "sky_leaf":"苍穹树叶",
    "sky_plank":"苍穹木板",
    "sky_sapling":"苍穹树苗",
    "sky_wood":"苍穹原木",
    "star_rock":"星岩",
    "stone":"石头",
    "water":"水",
}
const name2itm={
    "水桶":"桶,1",
    "岩浆桶":"桶,2",
}
const jump2itm={
    "book":"书",
    "bucket":"桶",
    "lava_bucket":"岩浆桶",
    "water_backet":"水桶",
}
var bimgn=[
    // 方块材质
    "星岩","箱子","萤石",
    "石头0","石头1","石头2","石头3",
    "木板0","树苗0","原木0","树叶0",
    "半砖0",
    // 物品
    "书","桶0","桶1","桶2",
]
for(let i of bimgn)bimgs[i]=srcimg("data/img/"+i+".png")
