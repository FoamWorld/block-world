var chosen_tab = 0
var setting // 泛设置
var localsetting // 世界设置
var localtemp = { // 本地临时数据
    "gui": {},
    "i": null, // 当前 GUI 用物品表
}
function throwits(x, y, tar = localtemp.i) { } // 扔出 tar 中物品
const halfpi = Math.PI / 2
var bimgs = {}
// 方向
const direx = [0, 1, 0, -1, -1, 1, 1, -1]
const direy = [-1, 0, 1, 0, -1, -1, 1, 1]
/*
+-------x->
|
|  4 0 5
|  3   1
y  7 2 6
|
v
*/
function left_dir(d) { return d == 0 ? 3 : d - 1 }
function right_dir(d) { return d == 3 ? 0 : d + 1 }
function opposite(d) { return d < 2 ? d + 2 : d - 2 }
// 可设置种子的随机数（from C++）
var srand = 0
function rand() {
    srand = (srand * 1103515245 + 12345) & 0xffffffff
    return srand >> 16 & 32767
}
var gsrand = 0 // 宏用
function grand() {
    gsrand = (gsrand * 1103515245 + 12345) & 0xffffffff
    return gsrand >> 16 & 32767
}
function gchance(num, den) {
    return grand() % den < num
}
// 更好地求余
function rem(n, p) {
    var t = n % p
    return t < 0 ? t + p : t
}
// 快速生成数组
function arrayof(len, f) {
    let s = new Array(len)
    for (var i = 0; i < len; i++) {
        s[i] = f() // 不重复生成会变成引用
    }
    return s
}
function arraywith(len, x) {
    let s = new Array(len)
    for (var i = 0; i < len; i++) {
        s[i] = x
    }
    return s
}
// structuredClone 退钱！
function clone(obj) {
    if (obj == null || typeof (obj) != "object") return obj
    if (obj instanceof Array) {
        let copy = []
        let l = obj.length
        for (var i = 0; i < l; i++)copy[i] = clone(obj[i])
        return copy
    }
    if (obj instanceof Object) {
        let props = Object.getOwnPropertyDescriptors(obj)
        // let l = props.length
        for (let prop in props) {
            props[prop].value = clone(props[prop].value)
        }
        return Object.create(Object.getPrototypeOf(obj), props)
    }
    throw new Error("Failed To Clone")
}
// js 连这都没
class Pair {
    constructor(a, b) { this.a = a; this.b = b }
}
function gid(s) {
    return document.getElementById(s)
}
// 信息区 api
var eventstack = []
function info_alert(important) {
    // todo: number + color
}
function info_log(s, smode = "system") {
    let e = gid("events")
    if (e == null) {
        eventstack.push(new Pair(smode, s))
        info_alert(smode == "error")
        return
    }
    e.append(createQElement("div", { className: `message-box ${smode}-speak`, innerHTML: s }))
}
function info_help(s) {
    if (setting["show-help"]) info_log(s, "help")
}
function info_event(s) {
    if (setting["show-event"]) info_log(s)
}
function drawRot(ctx, img, x, y, w, h, rad) { // 画旋转的图片
    ctx.translate(x + w / 2, y + h / 2)
    ctx.rotate(rad)
    ctx.drawImage(img, -w / 2, -h / 2, w, h)
    ctx.rotate(-rad)
    ctx.translate(-x - w / 2, -y - h / 2)
}
function srcimg(s) {
    let i = new Image()
    i.src = `assets/images/${s}`
    return i
}
function insertsto(b, d) {
    for (let i in d) {
        b[i] = d[i]
    }
}
// 杂物
function envlight() {
    // 当前 0.1s 一帧，设计一昼夜 16384 帧，即 [27min 18.4s]
    let t = localsetting["t"] & 16383
    // round(sin(t/8192*π)*8+7.5)
    let te = (t > 8191) ? t - 8192 : t
    if (te < 327 || te > 7865) te = 0
    else if (te < 659 || te > 7533) te = 1
    else if (te < 1003 || te > 7189) te = 2
    else if (te < 1366 || te > 6826) te = 3
    else if (te < 1761 || te > 6431) te = 4
    else if (te < 2212 || te > 5980) te = 5
    else if (te < 2779 || te > 5413) te = 6
    else te = 7
    return (t > 8192) ? 7 - te : te + 8
}
function setgamemode(s) {
    if (s == "c") insertsto(localsetting, {
        "break-all": true,
        "inf-item": true,
        "inf-use": true,
        "reach-all": true,
    })
    else if (s == "s") insertsto(localsetting, {
        "break-all": false,
        "inf-item": false,
        "inf-use": false,
        "reach-all": false,
    })
}
class IB { // 简易物品栏管理器
    constructor(l, i, n) {// 长度 物品 计数
        this.l = l
        this.i = i === undefined ? arrayof(l, function () { return new EI() }) : i
        this.n = n === undefined ? new Uint8Array((l + 1) >> 1) : n // 最大允许堆叠 16
    }
    getn(id) {
        return (id & 1) == 0 ? this.n[id >> 1] >> 4 : this.n[id >> 1] & 15
    }
    setn(id, x) {
        (id & 1) == 0 ? this.n[id >> 1] = this.n[id >> 1] & 15 | (x << 4) : this.n[id >> 1] = this.n[id >> 1] & 240 | x
    }
    get(id) {
        return new Pair(this.i[id], this.getn(id))
    }
    set(id, v) {
        this.i[id] = v.a
        this.setn(id, v.b)
    }
    remove(id) {
        this.i[id] = new EI()
        this.setn(id, 0)
    }
    clear() {
        this.i = arrayof(this.l, function () { return new EI() })
        this.n = new Uint8Array((this.l + 1) >> 1)
    }
    html(par, e = 0, style = "it0", spec = function () { }) { // 偏移量
        for (let i = 0; i < this.l; i++) {
            par.appendChild(item_board(i + e, style, this.i[i].text()))
            spec(par, i)
        }
    }
    updategui(e = 0, access = "ndim.blk(guix,guiy).its", spec = function () { }, type = function () { return "c" }) {
        for (let i = 0; i < this.l; i++) {
            let d = gid(i + e).getContext("2d")
            this.i[i].showit(d)
            let inum = this.getn(i)
            if (inum != 1 && !(this.i[i] instanceof EI)) {
                d.fillStyle = "#FFF"
                d.font = "8px"
                let numl = inum < 10 ? 1 : 2
                d.fillText(inum, 32 - numl * 8, 32, numl * 8)
            }
            eval(`ref_get[i+e]=function(x){return ${access}.get(x-(${e}))}`) // 防止出现 x--8
            eval(`ref_set[i+e]=function(x,v){${access}.set(x-(${e}),v)}`)
            ref_type[i + e] = type(i)
            spec(i)
        }
    }
    reduce(id, n) {
        let orin = this.getn(id)
        if (n < orin) this.setn(id, orin - n)
        else this.i[id] = new EI()
    }
    give(it, n) {
        if (n == 0) return
        let last = n
        let st = it.constructor.stack
        let itid = it.id()
        for (let i = 0; i < this.l; i++) {
            if (last == 0) return 0
            if (this.i[i] instanceof EI) {
                this.i[i] = clone(it)
                if (last > st) {
                    last -= st
                    this.setn(i, st)
                }
                else {
                    this.setn(i, last)
                    return 0
                }
            }
            else if (st != 1 && this.i[i].id() == itid) {
                let orin = this.getn(i)
                if (orin == st) continue // 很有可能发生
                if (orin + last < st) {
                    this.setn(i, orin + last)
                    return 0
                }
                else {
                    this.setn(i, st)
                    last -= (st - orin)
                }
            }
        }
        return last
    }
}
