function item_board(id, style, title) {
    let cvs = document.createElement("canvas")
    cvs.id = id
    cvs.className = style
    cvs.title = title
    cvs.width = 32
    cvs.height = 32
    cvs.draggable = true
    cvs.ondragstart = function (event) { dragstart(event) }
    cvs.ondragover = function (event) { dragover(event) }
    cvs.ondrop = function (event) { drop(event) }
    return cvs
}
var drag_from, drag_to // Pair{Class,Int}
function dragstart(e) { drag_from = Number.parseInt(e.target.id) }
function dragover(e) {
    drag_to = Number.parseInt(e.target.id)
    if (ref_type[drag_to] == "c") e.preventDefault()
}
var ref_get = [], ref_set = [], ref_type = []
/*c for common
r for read-only
i for infinite*/
function drop(e) {
    // 交换数据
    if (drag_from == drag_to) return
    let f1 = clone(ref_get[drag_from](drag_from))
    let f2 = clone(ref_get[drag_to](drag_to))
    if (f2.a instanceof EI) {
        if (ref_type[drag_from] == "i") {
            if (e.ctrlKey) ref_set[drag_to](drag_to, new Pair(f1.a, f1.a.constructor.stack))
            else ref_set[drag_to](drag_to, new Pair(f1.a, 1))
        }
        else {
            if (e.ctrlKey) { // 分半
                let mi = f1.b >> 1
                ref_set[drag_from](drag_from, new Pair(mi == 0 ? new EI() : f1.a, mi))
                ref_set[drag_to](drag_to, new Pair(clone(f1.a), f1.b - mi))
            }
            else if (e.shiftKey) { // 分一
                if (f1.b == 1) return
                ref_set[drag_from](drag_from, new Pair(f1.a, 1))
                ref_set[drag_to](drag_to, new Pair(clone(f1.a), f1.b - 1))
            }
            else { // 移动
                ref_set[drag_from](drag_from, new Pair(new EI(), 0))
                ref_set[drag_to](drag_to, new Pair(f1.a, f1.b))
            }
        }
    }
    else if (f1.a.id() == f2.a.id()) { // 相同叠加
        let st = f2.a.constructor.stack
        if (st == f2.b) return
        if (ref_type[drag_from] == "i") ref_set[drag_to](drag_to, new Pair(f2.a, f2.b + 1))
        else {
            let sum = f1.b + f2.b
            if (sum > st) {
                ref_set[drag_from](drag_from, new Pair(f1.a, sum - st))
                ref_set[drag_to](drag_to, new Pair(f2.a, st))
            }
            else {
                ref_set[drag_from](drag_from, new Pair(new EI(), 0))
                ref_set[drag_to](drag_to, new Pair(f1.a, sum))
            }
        }
    }
    else {
        if (ref_type[drag_from] != "c") return
        ref_set[drag_from](drag_from, f2) // 交换
        ref_set[drag_to](drag_to, f1)
    }
    // 显示
    if (drag_to < 0 || drag_from < 0) ply.updategui()
    if (drag_to >= 0 || drag_from >= 0) {
        if (nit !== null) nit.updategui()
        if (!Number.isNaN(guix)) ndim.blk(guix, guiy).updategui()
    }
}
class Item {
    static canuse = false
    static stack = 15
    static useonce = false
    id() { return this.t === undefined ? this.constructor.name : this.constructor.name + this.t }
    text() { return textof(localsetting["l"], this.id()) }
    strength() { return 15 }
    formblock() { return null }
    showit(d) {
        d.fillStyle = "slategray"
        d.clearRect(0, 0, 32, 32)
        this.showita(d)
    }
    showita(d) {
        let im = bimgs[this.t == undefined ? this.constructor.name : this.constructor.name + this.t]
        if (im == undefined) im = bimgs["notexture"]
        d.drawImage(im, 0, 0, 32, 32)
    }
    onunuse() { }
    t_mat() { return this.mat }
}
/*
属性
    stack 堆叠数
    canuse 能否使用
    useonce 是否只能单次使用
函数
    id() 辨识
    text() 文字显示
    amount() 所含材质量
    showit(d) 显示物品
    showita(d) 辅助showit
    formblock() 成块（若能）
    strength(tar) 强度
事件属性
    onuse() 使用开始
    onunuse() 使用停止（不适用useonce=true）
*/
class EI extends Item {
    id() { return "" }
    text() { return "" }
    showita() { }
}
class IFB extends Item {
    static stack = 4
    constructor(b) { super(); this.b = b }
    id() { return this.b.id() }
    text() { return this.b.text() }
    amount() { return this.b.amount() }
    show() { this.b.show() }
    showita(d) { return this.b.showita(d) }
    formblock() { return clone(this.b) }
    t_mat() { return this.b.t_mat() }
}
class 书 extends Item {
    static stack = 1
    static canuse = true
    constructor(c = [""], p = 0) { super(); this.c = c; this.p = p }
    onuse() {
        let gui = zbox_gui2()
        let text_area = createQElement("textarea", { id: "book-page", className: "textarea-ink", type: "text", maxlength: "1000", rows: "15", cols: "80" })
        let num_area = createQElement("p", { id: "book-page-num" })
        gui.append(text_area, num_area)
        for (let vec of [["|&lt;", "first"], ["&lt;", "prev"], ["-", "del"], ["0", "clear"], ["+", "new"], ["&gt;", "next"], ["&gt;|", "last"]]) {
            gui.innerHTML += `<button onclick='nit._${vec[1]}()'>${vec[0]}</button>`
        }
        this.updategui()
    }
    onunuse() { this.c[this.p] = gid("book-page").value }
    updategui() {
        gid("book-page").value = this.c[this.p]
        gid("book-page-num").innerText = (this.p + 1) + "/" + this.c.length
    }
    _save() { this.c[this.p] = gid("book-page").value }
    _new() { this._save(); this.c.splice(this.p + 1, 0, ""); this.updategui() }
    _first() { this._save(); this.p = 0; this.updategui() }
    _last() { this._save(); this.p = this.c.length - 1; this.updategui() }
    _prev() { this._save(); this.p = (this.p == 0 ? 0 : this.p - 1); this.updategui() }
    _next() { this._save(); this.p = (this.p == this.c.length - 1 ? this.p : this.p + 1); this.updategui() }
    _clear() { this.c = [""]; this.p = 0; this.updategui() }
    _del() {
        if (this.c.length == 1) this.c[0] = ""
        else this.c.splice(this.p, 1)
        if (this.p == this.c.length) this.p--
        this.updategui()
    }
}
class 桶 extends Item {
    static canuse = true
    static stack = 1
    static useonce = true
    constructor(t = 0) { super(); this.t = t }
    onuse() {
        if (Number.isNaN(mousex)) return
        let t = pos_by_showpos(mousex, mousey)
        let b = ndim.blk(t.a, t.b)
        if (this.t == 0) {
            if (b instanceof 水) {
                if (!localsetting["inf-use"]) {
                    this.t = 1
                    ply.updategui()
                }
                makeblk(t.a, t.b, new 空气())
            }
            else if (b instanceof 岩浆) {
                if (!localsetting["inf-use"]) {
                    this.t = 2
                    ply.updategui()
                }
                makeblk(t.a, t.b, new 空气())
            }
        }
        else if (b instanceof 空气 && ply.reachable(t.a, t.b)) {
            if (this.t == 1) makeblk(t.a, t.b, new 水())
            else if (this.t == 2) makeblk(t.a, t.b, new 岩浆())
            if (!localsetting["inf-use"]) {
                this.t = 0
                ply.updategui()
            }
        }
    }
}
class 木棍 extends Item { }
class 无限物品表 extends Item {
    static canuse = true
    static stack = 1
    onuse() {
        let inf_item_keys = Object.keys(inf_item_names)
        let gui = zbox_gui2()
        gui.innerHTML = `<div id="guch"></div><div id="guco"></div>`
        let s = ""
        for (let i of inf_item_keys) {
            s += `<button id="gu_${i}" class="unselected" onclick="nit.tab_to('${i}')">${i}</button>`
        }
        gid("guch").innerHTML = s
        localtemp["gui"]["ch"] = ""
        this.tab_to(inf_item_keys[0])
    }
    tab_to(x) {
        let t = localtemp["gui"]["ch"]
        if (x == t) return
        if (t != "") gid("gu_" + t).className = "unselected"
        localtemp["gui"]["ch"] = x
        gid("gu_" + x).className = "selected"
        let co = inf_item_names[x]
        let l = co.length
        let pre = []
        gid("guco").replaceChildren()
        for (let i = 0; i < l; i++) {
            let it = guess_itm(co[i])
            gid("guco").append(item_board(i, "it0", it.text()))
            if (i % 8 == 7) gid("guco").append(document.createElement("br"))
            pre.push(it)
        }
        localtemp["gui"]["l"] = l
        localtemp["gui"]["p"] = pre
        this.updategui()
    }
    updategui() {
        let l = localtemp["gui"]["l"]
        let pre = localtemp["gui"]["p"]
        for (let i = 0; i < l; i++) {
            let d = gid(i).getContext("2d")
            pre[i].showit(d)
            eval(`ref_get[i]=function(x){return new Pair(localtemp["gui"]["p"][x],1)}`)
            ref_type[i] = "i"
        }
    }
}
class 模具 extends Item {
    constructor(sh, mat) { super(); this.sh = sh; this.mat = mat }
    id() { return `${this.mat.constructor.name}质${this.sh}模具` }
    amount() { return 1 - amountof[this.sh] }
    showita(d) {
        let id = this.id()
        let c = bcaches[id]
        if (c === undefined) {
            c = inner_load_mouldof(this.sh, this.mat)
            bcaches[id] = c
        }
        d.putImageData(c, 0, 0)
    }
}
class 零件 extends Item {
    constructor(mat) { super(); this.mat = mat }
    id() { return this.mat.constructor.name + this.constructor.name }
    amount() { return amountof[this.mat.constructor.name] }
    showita(d) {
        let id = this.id()
        let c = bcaches[id]
        if (c === undefined) {
            c = inner_load_mould(this.constructor.name, this.mat)
            bcaches[id] = c
        }
        d.putImageData(c, 0, 0)
    }
}
class 锭 extends 零件 { }
class 薄板 extends 零件 {
    amount() { return 0.25 }
    showita(d) {
        let t = this.mat.constructor.theme
        d.fillStyle = `rgb(${t[0]},${t[1]},${t[2]})`
        d.fillRect(0, 0, 32, 32)
    }
}
