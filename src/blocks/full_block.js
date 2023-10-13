class full_block extends Solid {
    constructor(mat) { super(); this.mat = mat }
    get hard() { return this.mat.constructor.hard }
    get id() { return this.mat.constructor.name + "_block" }
    amount() { return 1 }
    show(x, y) {
        let im = bimgs[this.id]
        if (im === undefined) {
            let theme = this.mat.constructor.theme
            draw.fillStyle = `rgb(${theme[0]},${theme[1]},${theme[2]})`
            draw.fillRect(x, y, bsz, bsz)
        }
        else draw.drawImage(im, x, y, bsz, bsz)
    }
    showita(d) {
        let im = bimgs[this.id]
        if (im === undefined) {
            let theme = this.mat.constructor.theme
            d.fillStyle = `rgb(${theme[0]},${theme[1]},${theme[2]})`
            d.fillRect(0, 0, bsz, bsz)
        }
        else d.drawImage(im, 0, 0, bsz, bsz)
    }
}
