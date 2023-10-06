class sponge extends Solid {
    constructor() { super(); this.life = 0 }
    get hard() { return 5 }
    update(x, y) {
        const limit = 50
        if (this.life < limit) {
            let chance = this.life * 10000 / limit + 500
            for (let rx = -1; rx <= 1; rx++) {
                for (let ry = -1; ry <= 1; ry++) {
                    if (rx == 0 && ry == 0) continue
                    let b = ndim.blk(x + rx, y + ry)
                    if (is_water_origin(b) && grand() % chance < 500) {
                        this.life++
                        setblk(x + rx, y + ry)
                    }
                }
            }
        }
    }
}
