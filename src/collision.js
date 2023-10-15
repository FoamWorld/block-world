// 碰撞检测
class EmptyCollisionBox { }
class BCollisionBox { // 横平竖直的矩形
    constructor(lx, ly, rx, ry) {
        this.lx = lx
        this.ly = ly
        this.rx = rx
        this.ry = ry
    }
}
class SegCollisionBox {
    constructor(lx, ly, rx, ry) {
        this.lx = lx
        this.ly = ly
        this.rx = rx
        this.ry = ry
    }
    collide_with_blk(t) {
        if (t instanceof EmptyCollisionBox)
            return false
        else {
            // 上下水平线段
            if (this.ly == this.ry) { // 线段水平
                let y = this.ly
                if (((y == t.ly || y == t.ry) && ((t.lx < this.lx && this.lx < t.rx) || (t.lx < this.rx && this.rx < t.rx)))) return true
            }
            let x = (t.ly * (this.rx - this.lx) + this.lx * this.ry - this.ly * this.rx) / (this.ry - this.ly)
            if (t.lx < x && x < t.rx) return true
            x = (t.ry * (this.rx - this.lx) + this.lx * this.ry - this.ly * this.rx) / (this.ry - this.ly)
            if (t.lx < x && x < t.rx) return true
            // 左右数值线段（交换上面的x,y（）
            if (this.lx == this.rx) { // 线段水平
                let x = this.lx
                if (((x == t.lx || x == t.rx) && ((t.ly < this.ly && this.ly < t.ry) || (t.ly < this.ry && this.ry < t.ry)))) return true
            }
            let y = (t.lx * (this.ry - this.ly) + this.ly * this.rx - this.lx * this.ry) / (this.rx - this.lx)
            if (t.ly < y && y < t.ry) return true
            y = (t.rx * (this.ry - this.ly) + this.ly * this.rx - this.lx * this.ry) / (this.rx - this.lx)
            if (t.ly < y && y < t.ry) return true
            return false
        }
    }
}
class CircleCollisionBox {
    static shape = "circle"
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
    }
    collide_with_line(a, b, c) { // line: ax+by+c=0
        return Math.abs(a * this.x + b * this.y + c) < Math.hypot(a, b) * this.r
    }
    collide_with_blk(t) {
        if (t instanceof EmptyCollisionBox)
            return false
        else { // 判定：圆心在圆角矩形内，可分为 2 个矩形，4 个圆
            if (t.lx - this.r < this.x && this.x < t.rx + this.r && t.ly < this.y && this.y < t.ry)
                return true
            if (t.lx < this.x && this.x < t.rx && t.ly - this.r < this.y && this.y < t.ry + this.r)
                return true
            if (Math.hypot(this.x - t.lx, this.y - t.ly) < this.r || Math.hypot(this.x - t.lx, this.y - t.ry) < this.r || Math.hypot(this.x - t.rx, this.y - t.ly) < this.r || Math.hypot(this.x - t.rx, this.y - t.ry) < this.r) 
                return true
            return false
        }
    }
    collide_with_blks(s) {
        let lx = Math.floor(this.x - this.r), ly = Math.floor(this.y - this.r)
        let rx = Math.floor(this.x + this.r), ry = Math.floor(this.y + this.r)
        for (var i = lx; i <= rx; i++) {
            for (var j = ly; j <= ry; j++) {
                if (this.collide_with_blk(s.blk(i, j).colbox(i, j))) return true
            }
        }
        return false
    }
    move_to_blks(s, vx, vy, max_depth = 8) {
        let lx = 0, ly = 0, rx = vx, ry = vy, mx, my
        var anx = 0, any = 0
        while (true) {
            mx = (lx + rx) / 2
            my = (ly + ry) / 2
            let t = new CircleCollisionBox(this.x + mx, this.y + my, this.r)
            // 原则：保证不碰撞（总碰撞则不动）
            if (t.collide_with_blks(s)) {
                if (max_depth == 0) {
                    if (anx == 0 && any == 0)
                        return pair(0, 0) // 一直碰撞
                    else
                        return pair(anx, any) // 回退到上一次不碰撞
                }
                rx = mx
                ry = my
            }
            else {
                if (max_depth == 0)
                    return pair(mx, my)
                anx = mx
                any = my
                lx = mx
                ly = my
            }
            max_depth--
        }
    }
}
