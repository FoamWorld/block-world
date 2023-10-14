class half_block extends Block {
    constructor(mat, dir = 0) {
        super()
        this.mat = mat
        this.dir = dir
    }
    get amount() { return 0.5 }
    get hard() { return materials[this.mat]["hard"] }
    get id() { return this.mat + "_half_block" }
    static hastrans = true
    show(x, y) {
        let t = materials[this.mat]["theme"]
        draw.fillStyle = `rgb(${t[0]},${t[1]},${t[2]})`
        if (this.dir == 0) draw.fillRect(x, y, bsz, bsz2)
        else if (this.dir == 1) draw.fillRect(x + bsz2, y, bsz2, bsz)
        else if (this.dir == 2) draw.fillRect(x, y + bsz2, bsz, bsz2)
        else draw.fillRect(x, y, bsz2, bsz)
    }
    showita(d) {
        let t = materials[this.mat]["theme"]
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
