const bsz = 32
const bsz2 = 16

var tarray = []
class Block {
    static hasgui = false
    static hastrans = false
    static tr = false
    get isBurnable() { return false }
    get isConductable() { return false }
    get isWood() { return false }
    id() { return this.t === undefined ? this.constructor.name : this.constructor.name + this.t }
    text() { return textof(localsetting["l"], this.id()) }
    imgsource() {
        let im = bimgs[this.id()]
        if (im == undefined) im = bimgs["notexture"]
        return im
    }
    show(x, y) { draw.drawImage(this.imgsource(), x, y, bsz, bsz) }
    showita(d) {
        d.drawImage(this.imgsource(), 0, 0, bsz, bsz)
    }
    light() { return 0 }
    putextra() { }
    update() { }
    onguiclose() { }
    onbegin(x, y) { }
    drop(args) { return [pair(new IFB(this), 1)] }
    onbroken(x, y, args) {
        // todo: 掉落物
        let list = this.drop(args)
        for (let pa of list)
            ply.give(pa.a, pa.b)
    }
    onend(x, y) {
        if (this.hasgui && guix == x && guiy == y) {
            this.onguiclose(x, y)
            info_help("打开的交互方块被摧毁")
        }
    }
    onlighton(x, y, l = this.light()) { // BFS
        if (l == 0) return
        for (let i = -l; i <= l; i++)tarray[i] = []
        let xq = [0], yq = [0], lq = [l] // 任务队列
        while (lq.length != 0) {
            let xx = xq[0], yy = yq[0], l = lq[0]
            xq.shift(1)
            yq.shift(1)
            lq.shift(1)
            tarray[xx][yy] = true
            let tl = ndim.getlig(x + xx, y + yy)
            if (l <= tl) continue
            ndim.setlig(x + xx, y + yy, l)
            if ((!ndim.blk(x + xx, y + yy).constructor.tr && (xx != 0 || yy != 0)) || l == 1) continue
            let ll = l - 1
            for (let i = 0; i < 4; i++) {
                let x0 = xx + direx[i], y0 = yy + direy[i]
                if (!tarray[x0][y0]) {
                    xq.push(x0)
                    yq.push(y0)
                    lq.push(ll)
                }
            }
        }
    }
    t_mat() { return this.mat /* 无=>undefined */ }
}
/*
属性
    bk 挖掘时视作背景
    hasgui 具有gui
    hastrans 贴图具有透明部分
    isBurnable
    isConductable
    isWood
    tr 光照系统中可透光（应包括发光体）
变量
    t 一类中的编号
    dir 方向
    its 物品数组
    w 包裹
函数
    id() 辨识
    text() 文字显示
    imgsource() 图像资源
    show(x,y) canvas显示
    showita(d) 物品显示
    colbox(x,y) 碰撞箱
    hard() 硬度
    light() 亮度
    amount() 所含材质量
    isbackground() 是否视作背景
    updategui() 更新GUI
    update(x,y) 更新
    putextra(x,y) 放置时额外所为
事件属性
    onguiopen() 打开GUI
    updategui() GUI更新
    onguiclose() 关闭GUI
    onbegin(x,y) 产生时
    onend(x,y) 消失时
转化属性
    t_mat() 成为材料
*/
class Solid extends Block { // 【固体】，通常指碰撞箱为整的物质
    static bk = false
    colbox(x, y) { return new BCollisionBox(x, y, x + 1, y + 1) }
}
class NotSolid extends Block { // 【非固体】，通常指碰撞箱为0的物质
    static bk = true
    static tr = true
    colbox(x, y) { return new EmptyCollisionBox() }
    hard() { return 0 }
}

class 岩石 extends Solid { }
class 类导线 extends NotSolid {
    constructor(dat = 0) { this.dat = dat } // 表示4边的连接情况与当前信号强度
}
class 空气 extends NotSolid {
    static hastrans = true
    show() { }
    onlighton() { }
    onlightoff() { }
    onbegin() { }
    onend() { } // 加速，防止过多调用
}
function isair(x) { return (x instanceof 空气) }

class 星岩 extends Solid {
    hard() { return 3200 }
}
class 箱子 extends Solid {
    static hasgui = true
    constructor(its = new IB(16)) { super(); this.its = its }
    hard() { return 25 }
    onguiopen() {
        let gui = zbox_gui2()
        this.its.html(gui, 0, "it0", function (par, i) {
            if (i == 7) par.appendChild(document.createElement("br"))
        })
        this.updategui()
    }
    updategui() {
        this.its.updategui()
    }
    give(it, n) {
        this.its.give(it, n)
    }
}
class 萤石 extends 岩石 {
    static tr = true
    hard() { return 40 }
    light() { return 12 }
}
class 水 extends NotSolid {
    constructor(depth = 3) { // 0, 1, 2, 3
        super()
        this.depth = depth
    }
    show(x, y) {
        draw.fillStyle = `rgb(${64 - 16 * this.depth},${80 - 16 * this.depth},${240 - 16 * this.depth})`
        draw.fillRect(x, y, bsz, bsz)
    }
    update(x, y) {
        var m = 0
        for (let i = 0; i < 4; i++) {
            let t = ndim.blk(x + direx[i], y + direy[i])
            if (t instanceof 水) {
                m = Math.max(m, t.depth)
                t.depth = Math.max(t.depth, this.depth - 1)
            }
            else if (this.depth != 0 && isair(t)) { // 扩散
                makeblk(x + direx[i], y + direy[i], new 水(this.depth - 1))
            }
        }
        if (this.depth != 3 && m <= this.depth) makeblk(x, y, new 空气()) // 消逝
    }
}
class 岩浆 extends NotSolid { // 岩浆
    constructor(depth = 3) {
        super()
        this.depth = depth
    }
    show(x, y) {
        draw.fillStyle = ["#ffffa0", "#fffff0", "#fffffe", "#ffffff"][this.depth]
        draw.fillRect(x, y, bsz, bsz)
    }
    light() { return 14 }
    update(x, y) {
        var m = 0, nw = false, nr = false
        for (let i = 0; i < 4; i++) {
            let t = ndim.blk(x + direx[i], y + direy[i])
            if (t instanceof 水) {
                nw = true
            }
            else if (t instanceof 岩浆) {
                m = Math.max(m, t.depth)
                t.depth = Math.max(t.depth, this.depth - 1)
            }
            else if (this.depth != 0 && isair(t)) {
                makeblk(x + direx[i], y + direy[i], new 岩浆(this.depth - 1))
            }
            else if (t instanceof 岩石) {
                nr = true
            }
        }
        if (nw) {
            if (nr) makeblk(x, y, new 石头(0)) // 推测生成侵入岩
            else makeblk(x, y, new 石头(grand() < 16384 ? 1 : 2)) // 推测生成火成岩
        }
        else if (this.depth != 3 && m <= this.depth) makeblk(x, y, new 空气()) // 消逝
    }
}
class 石头 extends 岩石 {
    constructor(t = 3) {
        super()
        this.t = t
    }
    show(x, y) { draw.drawImage(bimgs["石头" + this.t], x, y, bsz, bsz) }
    hard() { return [65, 60, 55, 35][this.t] }
}
class 半砖 extends Block { // 0为上面那块，之后顺时针旋转
    static hastrans = true
    constructor(mat, dir = 0) {
        super()
        this.mat = mat
        this.dir = dir
    }
    id() { return `${this.mat}半砖` }
    hard() { return this.mat.constructor.hard }
    amount() { return 0.5 }
    show(x, y) {
        let t = this.mat.constructor.theme
        draw.fillStyle = `rgb(${t[0]},${t[1]},${t[2]})`
        if (this.dir == 0) draw.fillRect(x, y, bsz, bsz2)
        else if (this.dir == 1) draw.fillRect(x + bsz2, y, bsz2, bsz)
        else if (this.dir == 2) draw.fillRect(x, y + bsz2, bsz, bsz2)
        else draw.fillRect(x, y, bsz2, bsz)
    }
    showita(d) {
        let t = this.mat.constructor.theme
        d.fillStyle = `rgb(${t[0]},${t[1]},${t[2]})`
        if (this.dir == 0) d.fillRect(0, 0, bsz, bsz2)
        else if (this.dir == 1) d.fillRect(bsz2, 0, bsz2, bsz)
        else if (this.dir == 2) d.fillRect(0, bsz2, bsz, bsz2)
        else d.fillRect(0, 0, bsz2, bsz)
    }
    colbox(x, y) {
        if (this.dir == 0) return new BCollisionBox(x, y, x + 1, y + 0.5)
        else if (this.dir == 1) return new BCollisionBox(x + 0.5, y, x + 1, y + 1)
        else if (this.dir == 2) return new BCollisionBox(x, y + 0.5, x + 1, y + 1)
        else return new BCollisionBox(x, y, x + 0.5, y + 1)
    }
    putextra(x, y) {
        let x0 = x - ply.x, y0 = y - ply.y
        if (x0 > 0) {
            if (x0 < y0) this.dir = 2
            else if (x0 < -y0) this.dir = 0
            else this.dir = 1
        }
        else {
            if (x0 > y0) this.dir = 0
            else if (x0 > -y0) this.dir = 2
            else this.dir = 3
        }
    }
}
class 木板 extends Solid {
    constructor(t) { super(); this.t = t }
    get isBurnable() { return true }
    show(x, y) { draw.drawImage(bimgs["木板" + this.t], x, y, bsz, bsz) }
    hard() { return 25 }
    t_mat() { if (this.t == 0) return new 苍穹木() }
}
class 藤蔓 extends Solid {
    constructor(tmp = 0) { super(); this.tmp = tmp }
    hard() { return 5 }
    get isBurnable() { return true }
    update(x, y) {
        if (this.tmp == 1 && issurrounded(x, y)) this.tmp == 0
        for (let rx = -1; rx <= 1; rx++) {
            for (let ry = -1; ry <= 1; ry++) {
                if (rx == 0 && ry == 0) continue
                let r = ndim.blk(x + rx, y + ry)
                if (r instanceof 水) {
                    if (grand() % 50 == 0) makeblk(x, y, new 藤蔓(0))
                }
                else if (r.isWood) {
                    let rndstore = grand()
                    if (rndstore % 4 != 0 || this.tmp != 1) continue
                    rndstore >>= 3
                    let nnx = (rndstore % 3) - 1;
                    rndstore >>= 2;
                    let nny = (rndstore % 3) - 1;
                    if (nnx == 0 && nny == 0) continue
                    if (isair(ndim.blk(x + rx + nnx, y + ry + nny))) {
                        makeblk(x + rx + nnx, y + ry + nny, new 藤蔓核心())
                    }
                }
            }
        }
    }
}
class 藤蔓核心 extends Solid {
    constructor() { super(); this.tmp = 1 }
    hard() { return 5 }
    get isBurnable() { return true }
    show() { }
    update(x, y) {
        let rndstore = grand()
        let rx = (rndstore % 3) - 1;
        rndstore >>= 2;
        let ry = (rndstore % 3) - 1;
        rndstore >>= 2;
        if (rx != 0 || ry != 0) {
            let r = ndim.blk(x + rx, y + ry)
            if (rndstore % 15 == 0) {
                makeblk(x, y, new 藤蔓(this.tmp))
            }
            else if (isair(r)) {
                makeblk(x + rx, y + ry, new 藤蔓核心(this.tmp))
                makeblk(x, y, new 藤蔓(this.tmp))
            }
        }
    }
}
class Bomb extends Solid {
    show(x, y) {
        draw.fillStyle = "#fff"
        draw.fillRect(x, y, bsz, bsz)
    }
    update(x, y) {
        for (let rx = -2; rx <= 2; rx++) {
            for (let ry = -2; ry <= 2; ry++) {
                if (rx == 0 && ry == 0) continue
                let b = ndim.blk(x + rx, y + ry)
                if (!isair(b) && !(b instanceof 星岩)) {
                    makeblk(x + rx, y + ry)
                }
            }
        }
        makeblk(x, y)
    }
}
class 海绵 extends Solid {
    constructor() { super(); this.life = 0 }
    hard() { return 5 }
    update(x, y) {
        const limit = 50
        if (this.life < limit) {
            let chance = this.life * 10000 / limit + 500
            for (let rx = -1; rx <= 1; rx++) {
                for (let ry = -1; ry <= 1; ry++) {
                    if (rx == 0 && ry == 0) continue
                    let b = ndim.blk(x + rx, y + ry)
                    if ((b instanceof 水) && b.depth == 3 && grand() % chance < 500) {
                        this.life++
                        makeblk(x + rx, y + ry)
                    }
                }
            }
        }
    }
}
class 结构方块 extends Solid {
    static hasgui = true
    constructor(n = "", x = 0, y = 0, le = NaN, wi = NaN) { super(); this.n = n; this.x = x; this.y = y; this.le = le; this.wi = wi; }
    putextra(x, y) {
        this.x = x; this.y = y;
    }
    onguiopen() {
        let gui = zbox_gui2()
        gui.innerHTML = `<input id="gun" type="text" size="8"><button onclick="ndim.blk(${guix},${guiy}).i()">保存</button><button onclick="ndim.blk(${guix},${guiy}).o()">放置</button><br /><span>(</span><input id="gux" type="text" size="2"><span>,</span><input id="guy" type="text" size="2"><span>)[</span><input id="gul" type="text" size="2" placeholder="长度"><span>,</span><input id="guw" type="text" size="2" placeholder="宽度"><span>]</span>`
        this.updategui()
        inputting2 = true
    }
    updategui() {
        gid("gun").value = this.n; gid("gux").value = this.x; gid("guy").value = this.y; gid("gul").value = this.le; gid("guw").value = this.wi
    }
    i() {
        let tn = gid("gun").value
        if (tn == "") { info_help("名称不能为空"); return }
        let x = Number.parseInt(gid("gux").value), y = Number.parseInt(gid("guy").value), le = Number.parseInt(gid("gul").value), wi = Number.parseInt(gid("guw").value)
        if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(le) || Number.isNaN(wi)) {
            info_help("请输入整数")
            this.updategui()
            return
        }
        if (le <= 0 || wi <= 0) { info_help("边长需为正"); return }
        this.x = x; this.y = y; this.le = le; this.wi = wi; this.n = tn
        let s = "["
        for (let i = 0; i < this.le; i++) {
            for (let j = 0; j < this.wi; j++) {
                s += `${encode(ndim.blk(i + this.x, j + this.y))},`
            }
        }
        setting["st"][tn + "%l"] = this.le
        setting["st"][tn + "%w"] = this.wi
        setting["st"][tn + "%d"] = s + "]"
    }
    o() {
        let x = Number.parseInt(gid("gux").value), y = Number.parseInt(gid("guy").value)
        if (Number.isNaN(x) || Number.isNaN(y)) {
            info_help("请输入整数")
            this.updategui()
            return
        }
        this.x = x
        this.y = y
        let n = gid("gun").value
        let td = setting["st"][n + "%d"]
        if (td === undefined) { info_help("结构不存在"); return }
        let t = decode(td)
        this.n = n
        this.le = Number.parseInt(setting["st"][n + "%l"])
        this.wi = Number.parseInt(setting["st"][n + "%w"])
        this.updategui()
        for (let i = 0; i < this.le; i++) {
            for (let j = 0; j < this.wi; j++) {
                makeblk(i + this.x, j + this.y, t[i * this.wi + j])
            }
        }
    }
    hard() { return 3200 }
}
class 玻璃 extends Solid {
    static tr = true
    static hastrans = true
    hard() { return 65 }
}
class 冰 extends Solid {
    show(x, y) { draw.fillStyle = `#A0C0FF`; draw.fillRect(x, y, bsz, bsz) }
    showita(d) { d.fillStyle = "#A0C0FF"; d.fillRect(0, 0, bsz, bsz) }
    update(x, y) {
        for (let i = 0; i < 4; i++) {
            if (ndim.blk(x + direx[i], y + direy[i]).light() > 8) makeblk(x, y, new 水())
        }
    }
    hard() { return 20 }
}
class 沙子 extends Solid {
    hard() { return 10 }
}
class 告示牌 extends NotSolid {
    static hasgui = true
    static hastrans = true
    constructor(s = "", c = "#000") { super(); this.s = s; this.c = c }
    get isBurnable() { return true }
    show(x, y) {
        draw.drawImage(bimgs["告示牌"], x, y, bsz, bsz)
        show_after.push(`draw.fillStyle="${this.c}";draw.font="16px";draw.fillText("${this.s}",${x + 2},${y + 18})`)
    }
    hard() { return 25 }
    onguiopen() {
        let gui = zbox_gui2()
        gui.innerHTML = `<input id="gus" type="text" size="8" placeholder="内容"><input id="guc" type="color"><button onclick="ndim.blk(${guix},${guiy}).set()">设置</button>`
        this.updategui()
        inputting2 = true
    }
    updategui() { gid("gus").value = this.s; gid("guc").value = this.c }
    set() { this.s = gid("gus").value; this.c = gid("guc").value }
}
class 合成台 extends Solid {
    static hasgui = true
    hard() { return 25 }
    get isBurnable() { return true }
    onguiopen() {
        let gui = zbox_gui2()
        localtemp.i = new IB(10)
        localtemp.i.html(gui, 0, "it0", function (par, i) {
            if (i == 2 || i == 5) par.appendChild(document.createElement("br"))
            else if (i == 8) {
                let but = document.createElement("button")
                but.innerText = "合成"
                but.onclick = function () {
                    ndim.blk(guix, guiy).work()
                }
                par.append(document.createElement("br"), but)
            }
        })
        this.updategui()
    }
    onguiclose(x, y) { throwits(x, y) }
    updategui() {
        localtemp.i.updategui(0, "localtemp.i", function () { }, function (i) { return (i == 9) ? "r" : "c" })
    }
    work() {
        if (!(localtemp.i.i[9] instanceof EI)) {
            info_help("请先移走生成物")
            return
        }
        let tr = inner_craft(localtemp.i.i)
        if (tr === null) {
            info_help("无法合成")
            return
        }
        let it = guess_itm(tr.a)
        let mh = Math.floor(it.constructor.stack / tr.b)
        if (mh == 0) {
            info_log(`发现设计问题，请告知开发者`)
            return
        }
        for (let i = 0; i < 9; i++)if (!(localtemp.i.i[i] instanceof EI)) mh = Math.min(mh, localtemp.i.getn(i))
        for (let i = 0; i < 9; i++)localtemp.i.reduce(i, mh)
        localtemp.i.i[9] = it
        localtemp.i.setn(9, tr.b * mh)
        this.updategui()
    }
}
class 刻制台 extends Solid {
    static hasgui = true
    hard() { return 25 }
    onguiopen() {
        let gui = zbox_gui2()
        localtemp.i = new IB(2)
        localtemp.i.html(gui, 0, "it0", function (par, i) {
            if (i == 0) par.append(document.createTextNode(" => "))
            else {
                par.innerHTML += `<select id="guo"></select><button onclick="ndim.blk(${guix},${guiy}).work()">刻制</button>`
            }
        })
        this.updategui()
    }
    onguiclose(x, y) { throwits(x, y) }
    updategui() {
        localtemp.i.updategui(0, "localtemp.i", function () { }, function (i) { return (i == 0) ? "c" : "r" })
        let it = localtemp.i.i[0]
        let li = carves_nor[it.id()]
        if (li !== undefined) {
            let s = ""
            for (let i of li) {
                s += `<option value="${i}">${textof(localsetting["l"], i)}</option>`
            }
            gid("guo").innerHTML = s
        }
        else gid("guo").innerHTML = ""
    }
    work() {
        if (!(localtemp.i.i[1] instanceof EI)) { info_help("请先移走生成物"); return }
        let v = gid("guo").value
        let it = guess_itm(v)
        localtemp.i.i[1] = it
        let inn = localtemp.i.getn(0)
        let oun = Math.min(inn, it.constructor.stack)
        localtemp.i.setn(1, oun)
        if (inn == oun) localtemp.i.i[0] = new EI()
        localtemp.i.setn(0, inn - oun)
        this.updategui()
    }
}
class 模具台 extends Solid {
    static hasgui = true
    hard() { return 25 }
    onguiopen() {
        let gui = zbox_gui2()
        localtemp.i = new IB(2)
        localtemp.i.html(gui, 0, "it0", function (par, i) {
            if (i == 0) par.append(document.createTextNode(" => "))
            else {
                par.innerHTML += `<select id="guo"></select><button onclick="ndim.blk(${guix},${guiy}).work()">制作</button>`
            }
        })
        let s = ""
        for (let i of Object.keys(mould_dat)) {
            s += `<option value="${i}">${i}</option>`
        }
        gid("guo").innerHTML = s
        this.updategui()
    }
    onguiclose(x, y) { throwits(x, y) }
    updategui() {
        localtemp.i.updategui(0, "localtemp.i", function () { }, function (i) { return (i == 0) ? "c" : "r" })
    }
    work() {
        if (!(localtemp.i.i[1] instanceof EI)) { info_help("请先移走生成物"); return }
        let ini = localtemp.i.i[0]
        if (!(ini instanceof 薄板)) { info_help("请使用薄板"); return }
        if (ini.mat.constructor.hard > 35) { info_help("材质太硬"); return }
        let mater = ini.t_mat()
        let v = gid("guo").value
        let it = new 模具(v, mater)
        localtemp.i.i[1] = it
        let inn = localtemp.i.getn(0)
        let oun = Math.min(inn, it.constructor.stack)
        localtemp.i.setn(1, oun)
        if (inn == oun) localtemp.i.i[0] = new EI()
        localtemp.i.setn(0, inn - oun)
        this.updategui()
    }
}
class 组装台 extends Solid {
    static hasgui = true
    hard() { return 25 }
}
class 熔炉 extends Solid {
    static hasgui = true
    hard() { return 35 }
}
class 高炉壁 extends Solid {
    hard() { return 65 }
}
class 高炉控制器 extends Solid {
    static hasgui = true
    hard() { return 65 }
}
class 块 extends Solid {
    constructor(mat) { super(); this.mat = mat }
    hard() { return this.mat.constructor.hard }
    id() { return this.mat.constructor.name + "块" }
    amount() { return 1 }
    show(x, y) {
        let im = bimgs[this.id()]
        if (im === undefined) {
            let theme = this.mat.constructor.theme
            draw.fillStyle = `rgb(${theme[0]},${theme[1]},${theme[2]})`
            draw.fillRect(x, y, bsz, bsz)
        }
        else draw.drawImage(im, x, y, bsz, bsz)
    }
    showita(d) {
        let im = bimgs[this.id()]
        if (im === undefined) {
            let theme = this.mat.constructor.theme
            d.fillStyle = `rgb(${theme[0]},${theme[1]},${theme[2]})`
            d.fillRect(0, 0, bsz, bsz)
        }
        else d.drawImage(im, 0, 0, bsz, bsz)
    }
}
class 电池块 extends Solid {
    hard() { return 45 }
    update(x, y) {
    }
}
class 导线 extends 类导线 {
    hard() { return 35 }
}
class N型导线 extends 类导线 {
    hard() { return 35 }
}
class P型导线 extends 类导线 {
    hard() { return 35 }
}
