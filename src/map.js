var dims = [], ndim, ndimid
var ply
var saved = {}
function pushsave(lx, ly, tx, ty, o) { // 需强调：保存的是引用，会“自动更新”
    let t = wpos(lx, ly)
    if (saved[t] == undefined) saved[t] = {}
    saved[t][tx * 64 + ty] = o
}
var show_after_reg // 注册显示后处理
var show_after // 显示后处理
/*
saved[区块号][相对坐标号] = 方块数据（引用）
*/
function wpos(x, y) { return x + "," + y }
function antiwpos(s) {
    let l = s.length
    let x = 0, y = 0
    let i, c, neg
    if (s.charCodeAt(0) == 45) { i = 1; neg = true }
    else { i = 0; neg = false }
    while (i < l) {
        c = s.charCodeAt(i)
        if (c == 44) break
        x = x * 10 + (c - 48)
        i++
    }
    i++
    if (neg) x = -x
    if (s.charCodeAt(i) == 45) { i++; neg = true }
    else neg = false
    for (; i < l; i++) {
        c = s.charCodeAt(i)
        y = y * 10 + (c - 48)
    }
    if (neg) y = -y
    return new Pair(x, y)
}

class Chunk { // 区块：64x64
    constructor() {
        this.blk = arrayof(64, function () { return [] })
        this.lig = new Uint8Array(2048) // 压缩空间
        this.tm = 0 // 记录离开时间
    }
    getlig(x, y) {
        let id = (x << 5) | (y >> 1);
        return (y & 1) == 0 ? this.lig[id] >> 4 : this.lig[id] & 15
    }
    setlig(x, y, v) {
        let id = (x << 5) | (y >> 1);
        (y & 1) == 0 ? this.lig[id] = this.lig[id] & 15 | (v << 4) : this.lig[id] = this.lig[id] & 240 | v
    }
    generate_debug(x, y) { // 调试用生成器
        for (let i = 0; i < 64; i++) {
            for (let j = 0; j < 64; j++)this.blk[i][j] = new 空气()
        }
    }
    generate(x, y) {
        eval(`this.generate_${localsetting["type"]}(${x},${y})`)
        var t = saved[wpos(x, y)]
        if (t !== undefined) {
            for (let i in t) {
                let y0 = i & 63, x0 = (i - y0) / 64
                this.blk[x0][y0] = t[i]
            }
        }
    }
    show(lx, ly, px, py) { // (lx, ly) 显示到 (px, py)
        var rx = Math.min(lx + 15 - px, 63), ry = Math.min(ly + 15 - py, 63)
        let el = envlight()
        for (let i = lx; i <= rx; ++i) {
            for (let j = ly; j <= ry; ++j) {
                let tl = this.getlig(i, j)
                if (tl < el) tl = el
                let x0 = Math.round((i - lx + px) * bsz), y0 = Math.round((j - ly + py) * bsz)
                let b = this.blk[i][j]
                if (tl == 0) {
                    draw.fillStyle = "#000000"
                    draw.fillRect(x0, y0, bsz, bsz)
                    continue
                }
                if (b.constructor.hastrans) {
                    draw.fillStyle = `#fefeef`
                    draw.fillRect(x0, y0, bsz, bsz)
                }
                b.show(x0, y0)
                draw.save()
                if (tl != 15) {
                    draw.fillStyle = `rgba(0,0,0,${(15 - tl) / 16})`
                    draw.fillRect(x0, y0, bsz, bsz)
                }
                draw.restore()
            }
        }
    }
    update(x, y) {
        for (let i = 0; i < 64; i++)for (let j = 0; j < 64; j++)this.blk[i][j].update(x + i, y + j)
    }
    clight() {
        this.lig.fill(0)
    }
}
class Dimension {
    constructor() {
        this.dim = {}
    }
    chk(x, y) { return this.dim[wpos(x, y)] }
    blk(x, y) {
        var tx = x & 63, ty = y & 63
        var lx = x - tx, ly = y - ty
        return this.chk(lx, ly).blk[tx][ty]
    }
    getlig(x, y) {
        var tx = x & 63, ty = y & 63
        var lx = x - tx, ly = y - ty
        return this.chk(lx, ly).getlig(tx, ty)
    }
    setlig(x, y, v) {
        var tx = x & 63, ty = y & 63
        var lx = x - tx, ly = y - ty
        return this.chk(lx, ly).setlig(tx, ty, v)
    }
    save(x, y) {
        var tx = x & 63, ty = y & 63
        var lx = x - tx, ly = y - ty
        pushsave(lx, ly, tx, ty, this.chk(lx, ly).blk[tx][ty])
    }
    generate(x, y) {
        let c = new Chunk()
        c.generate(x, y)
        this.dim[x + "," + y] = c
    }
    show(x, y) { // 显示 (0, 0) 的对应坐标
        /*
        区块坐标（此处假设 x 行 y 列）
        (x, y)-----+---------+
          |    A   |    B    |
          +--(lx+64, ly+64)--+
          |    C   |    D    |
          +--------+---(x+15, y+15)
        lx+64-x=64-tx
        lx+64<x+15 <=> tx>49 <=> 额外区块需渲染
        需渲染区块左上角相对自己
            坐标     取整后   不取整显示坐标/32 显示坐标/32
        A: (tx,ty) (tx1,ty1) (0,0)             (tx1-tx,ty1-ty)
        B: (tx, 0) (tx1, 0 ) (0,64-ty)         (tx1-tx,64-ty)
        C: (0, ty) ( 0 ,ty1) (64-tx,0)         (64-tx,ty1-ty)
        D: (0 , 0) ( 0 , 0 ) (64-tx,64-ty)     (64-tx,64-ty)
        */
        var tx = rem(x, 64), ty = rem(y, 64) // 区块相对坐标
        var lx = x - tx, ly = y - ty // 区块标识
        var tx1 = Math.floor(tx), ty1 = Math.floor(ty)
        // A
        this.chk(lx, ly).show(tx1, ty1, tx1 - tx, ty1 - ty)
        if (ty > 49) {// B
            ly += 64
            this.chk(lx, ly).show(tx1, 0, tx1 - tx, 64 - ty)
            ly -= 64
        }
        if (tx > 49) {// C
            lx += 64
            this.chk(lx, ly).show(0, ty1, 64 - tx, ty1 - ty)
            if (ty > 49) {// D
                ly += 64
                this.chk(lx, ly).show(0, 0, 64 - tx, 64 - ty)
            }
        }
    }
}
function pos_by_showpos(x, y) {
    return new Pair(Math.floor(x / bsz - 7.5 + ply.x), Math.floor(y / bsz - 7.5 + ply.y))
}
function blk_by_showpos(x, y) {
    return ndim.blk(Math.floor(x / bsz - 7.5 + ply.x), Math.floor(y / bsz - 7.5 + ply.y))
}
function showpos_by_pos(x, y) {
    return new Pair(Math.floor((x - ply.x + 7.5) * bsz), Math.floor((y - ply.y + 7.5) * bsz))
}

function initdim() {
    dims[0] = new Dimension()
    ndim = dims[0] // 引用
    ndimid = 0
}
function initgenerator() {
    globalThis["initgen_" + localsetting["type"]].call()
}
function initgen_debug() { ply = new Player(0, 0) }
function pregenerate() {
    var px = 64 * Math.floor(ply.x / 64), py = 64 * Math.floor(ply.y / 64)
    for (let i = px - 128; i <= px + 128; i += 64) {
        for (let j = py - 128; j <= py + 128; j += 64) {
            if (ndim.chk(i, j) == undefined) ndim.generate(i, j)
        }
    }
}
function showgame() {
    var lx = ply.x - 7.5, ly = ply.y - 7.5
    ndim.show(lx, ly)
    for (let f of show_after) {
        eval(f)
    }
    for (let i in show_after_reg) {
        eval(show_after_reg[i])
    }
    show_after = []
    ply.show()
}
function updategame() {
    for (let i = plybx - 64; i <= plybx + 64; i += 64) { // 更新范围比生成范围小qwq
        for (let j = plyby - 64; j <= plyby + 64; j += 64) {
            ndim.chk(i, j).update(i, j)
            ndim.chk(i, j).clight()
        }
    }
    for (let i = plylx - 28; i <= plylx + 28; i++) {
        for (let j = plyly - 28; j <= plyly + 28; j++) {
            ndim.blk(i, j).onlighton(i, j)
        }
    }
}
function makeblk(x, y, o, pue = false) {
    var tx = x & 63, ty = y & 63
    var lx = x - tx, ly = y - ty
    let ch = ndim.chk(lx, ly)
    ch.blk[tx][ty].onend(x, y)
    ch.blk[tx][ty] = o
    ch.blk[tx][ty].onbegin(x, y)
    if (pue) ch.blk[tx][ty].putextra(x, y)
    pushsave(lx, ly, tx, ty, o)
}
function issurrounded(x, y) {
    for (let rx = -1; rx <= 1; rx++) {
        for (let ry = -1; ry <= 1; ry++) {
            if (rx == 0 && ry == 0) continue
            if (ndim.blk[x + rx, y + ry] instanceof 空气) return false
        }
    }
    return true
}
