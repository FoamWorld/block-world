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
/*
    c : common
    r : read-only
    i : infinite
*/
function drop(e) {
    // 交换数据
    if (drag_from == drag_to) return
    let f1 = clone(ref_get[drag_from](drag_from))
    let f2 = clone(ref_get[drag_to](drag_to))
    if (f2.a instanceof EI) {
        if (ref_type[drag_from] == "i") {
            if (e.ctrlKey) ref_set[drag_to](drag_to, pair(f1.a, f1.a.constructor.stack))
            else ref_set[drag_to](drag_to, pair(f1.a, 1))
        }
        else {
            if (e.ctrlKey) { // 分半
                let mi = f1.b >> 1
                ref_set[drag_from](drag_from, pair(mi == 0 ? new EI() : f1.a, mi))
                ref_set[drag_to](drag_to, pair(clone(f1.a), f1.b - mi))
            }
            else if (e.shiftKey) { // 分一
                if (f1.b == 1) return
                ref_set[drag_from](drag_from, pair(f1.a, 1))
                ref_set[drag_to](drag_to, pair(clone(f1.a), f1.b - 1))
            }
            else { // 移动
                ref_set[drag_from](drag_from, pair(new EI(), 0))
                ref_set[drag_to](drag_to, pair(f1.a, f1.b))
            }
        }
    }
    else if (f1.a.id() == f2.a.id()) { // 相同叠加
        let st = f2.a.constructor.stack
        if (st == f2.b) return
        if (ref_type[drag_from] == "i") ref_set[drag_to](drag_to, pair(f2.a, f2.b + 1))
        else {
            let sum = f1.b + f2.b
            if (sum > st) {
                ref_set[drag_from](drag_from, pair(f1.a, sum - st))
                ref_set[drag_to](drag_to, pair(f2.a, st))
            }
            else {
                ref_set[drag_from](drag_from, pair(new EI(), 0))
                ref_set[drag_to](drag_to, pair(f1.a, sum))
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
    get id() { return this.constructor.name }
    get material() { return "" }
    static stack = 15
    get text() { return textof(localsetting["l"], this.id()) }
    static useonce = false
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
}
function item(className, args = {}) {
    let it = eval(`new ${className}()`)
    for (let key in args) {
        eval(`it.${key}=${args.key}`)
    }
    return it
}

class EI extends Item {
    get id() { return "" }
    get text() { return "" }
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
class stick extends Item { }
