class vine extends Solid {
    constructor() { super(); this.tmp = 0 }
    get hard() { return 5 }
    get isBurnable() { return true }
    update(x, y) {
        if (this.tmp == 1 && issurrounded(x, y)) this.tmp == 0
        for (let rx = -1; rx <= 1; rx++) {
            for (let ry = -1; ry <= 1; ry++) {
                if (rx == 0 && ry == 0) continue
                let r = ndim.blk(x + rx, y + ry)
                if (oftype(r, "water")) {
                    if (grand() % 50 == 0)
                        setblk(x, y, block("vine", { tmp: 0 }))
                }
                else if (r.isWood) {
                    let rndstore = grand()
                    if (rndstore % 4 != 0 || this.tmp != 1) continue
                    rndstore >>= 3
                    let nnx = (rndstore % 3) - 1;
                    rndstore >>= 2;
                    let nny = (rndstore % 3) - 1;
                    if (nnx == 0 && nny == 0) continue
                    if (isair(ndim.blk(x + rx + nnx, y + ry + nny)))
                        setblk(x + rx + nnx, y + ry + nny, block("vine_grow", { tmp: 1 }))
                }
            }
        }
    }
}
class vine_grow extends Solid { // 藤蔓核心
    constructor() { super(); this.tmp = 1 }
    get hard() { return 5 }
    get isBurnable() { return true }
    show() { }
    update(x, y) {
        let rndstore = grand()
        let rx = (rndstore % 3) - 1;
        rndstore >>= 2;
        let ry = (rndstore % 3) - 1;
        rndstore >>= 2;
        if (rx == 0 && ry == 0) return
        let r = ndim.blk(x + rx, y + ry)
        if (rndstore % 15 == 0)
            setblk(x, y, block("vine", { tmp: this.tmp }))
        else if (isair(r)) {
            setblk(x + rx, y + ry, block("vine_grow", { tmp: this.tmp }))
            setblk(x, y, block("vine", { tmp: this.tmp }))
        }
    }
}
