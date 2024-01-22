class Entity {
    constructor(x, y, vx, vy) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
    }
}
var pimg = srcimg("skin_default.png")
var plylx, plyly, plybx, plyby
class Player {
    constructor(x, y, θ = 0, h = 20, its = new IB(8)) {
        this.x = x
        this.y = y
        plylx = Math.floor(x)
        plyly = Math.floor(y)
        plybx = (plylx >> 6) << 6
        plyby = (plyly >> 6) << 6
        this.θ = θ
        this.h = h
        this.its = its
    }
    initgui() {
        this.its.html(gid("itms"), -8, "it")
        this.updategui()
    }
    changechosen(to) {
        if (localsetting["choose-id"] == to) return
        gid(localsetting["choose-id"] - 8).style.border = "1px solid silver"
        gid(to - 8).style.border = "2px solid lightcyan"
        localsetting["choose-id"] = to
    }
    updategui() {
        this.its.updategui(-8, "ply.its", function (i) {
            if (i == localsetting["choose-id"]) gid(i - 8).style.border = "2px solid lightcyan"
            else gid(i - 8).style.border = "1px solid silver"
        })
    }
    show() { drawRot(draw, pimg, 226, 226, 28, 28, this.θ) }
    stepl() { return localsetting["step"] }
    move(x, y) {
        var v = new CircleCollisionBox(this.x, this.y, 0.4375).move_to_blks(ndim, x, y)
        this.x += v.first
        this.y += v.second
        if (Math.hypot(this.x - guix, this.y - guiy) > 3) {
            closebgui()
            info_help("你远离了打开的交互方块")
        }
        plylx = Math.floor(this.x)
        plyly = Math.floor(this.y)
        plybx = (plylx >> 6) << 6
        plyby = (plyly >> 6) << 6
        for (let k of Object.keys(ndim.dim)) {
            let pa = antiwpos(k)
            if (Math.abs(pa.first - plybx) <= 128 && Math.abs(pa.second - plyby) <= 128) {
                ndim.dim[k].tm = 0
            }
            else {
                let nowtime = new Date().getTime()
                let tm = ndim.dim[k].tm
                if (tm == 0) ndim.dim[k].tm = nowtime
                else if (nowtime - tm > 60) delete ndim.dim[k]
            }
        }
    }
    give(i, n = 1) {
        this.its.give(i, n)
    }
    reachable(x, y) {
        if (localsetting["reach-all"]) return true
        if (Math.hypot(this.x - x, this.y - y) > 4) {
            info_help("离得太远了")
            return false
        }
        let c = new SegCollisionBox(x, y, this.x, this.y)
        let fx = Math.floor(x), fy = Math.floor(y)
        let lx = Math.min(fx, Math.floor(this.x)), rx = Math.max(fx, Math.floor(this.x))
        let ly = Math.min(fy, Math.floor(this.y)), ry = Math.max(fy, Math.floor(this.y))
        for (let i = lx; i <= rx; i++) {
            for (let j = ly; j <= ry; j++) {
                if (i == fx && j == fy) continue
                if (c.collide_with_blk(ndim.blk(i, j).colbox(i, j))) {
                    info_help("被挡住了")
                    return false
                }
            }
        }
        return true
    }
}