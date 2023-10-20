const bsz = 32
const bsz2 = 16

var tarray = []
class Block {
    get brightness() { return 0 }
    static hasgui = false
    static hastrans = false
    get isBurnable() { return false }
    get id() { return this.constructor.name }
    get isConductable() { return false }
    get isRock() { return false }
    get isWood() { return false }
    get material() { return "" }
    get text() { return text_translate(this.id) }
    static tr = false
    formblock() { return clone(this) }
    imgsource() {
        let im = bimgs[this.id]
        if (im == undefined) im = bimgs["notexture"]
        return im
    }
    show(x, y) { draw.drawImage(this.imgsource(), x, y, bsz, bsz) }
    showit(d) {
        d.fillStyle = "slategray"
        d.clearRect(0, 0, 32, 32)
        this.showita(d)
    }
    showita(d) {
        d.drawImage(this.imgsource(), 0, 0, bsz, bsz)
    }
    strength(tar) { return 15 }
    putextra() { }
    update(x, y) { }
    onguiclose() { }
    onbegin(x, y) { }
    drop(args) { return [pair(new IFB(this), 1)] }
    onbroken(x, y, args) {
        // todo: 掉落物
        let list = this.drop(args)
        for (let pa of list)
            ply.give(pa.first, pa.second)
    }
    onend(x, y) {
        if (this.hasgui && guix == x && guiy == y) {
            this.onguiclose(x, y)
            info_help("打开的交互方块被摧毁")
        }
    }
    onlighton(x, y, l = this.brightness) { // BFS
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
}
function block(className, args = {}) {
    let blk = eval(`new ${className}()`)
    for (let key in args) {
        eval(`blk.${key}=${args.key}`)
    }
    return blk
}

class Solid extends Block {
    static bk = false
    colbox(x, y) { return new BCollisionBox(x, y, x + 1, y + 1) }
}
class NotSolid extends Block {
    static bk = true
    get hard() { return 0 }
    static tr = true
    colbox(x, y) { return new EmptyCollisionBox() }
}
class air extends NotSolid {
    static hastrans = true
    show() { }
    onlighton() { }
    onlightoff() { }
    onbegin() { }
    onend() { } // 加速，防止过多调用
}
function _air() { return new air() }
function isair(x) { return (x instanceof air) }

class border extends Solid {
    get hard() { return Infinity }
    show(x, y) {
        draw.fillStyle = "#99d9ea"
        draw.fillRect(x, y, bsz, bsz)
    }
}
class glass extends Solid {
    get hard() { return 65 }
    static hastrans = true
    static tr = true
}
class sand extends Solid { get hard() { return 10 } }
class wall extends Solid { get hard() { return 3200 } }
