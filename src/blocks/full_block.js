class full_block extends Solid {
    constructor(mat) { super(); this.mat = mat }
    get amount() { return 1 }
    get hard() { return materials[this.mat]["hard"] }
    get id() { return this.mat + "_block" }
    show(x, y) {
        let im = bimgs[this.id]
        if (im === undefined) {
            let theme = materials[this.mat]["theme"]
            draw.fillStyle = `rgb(${theme[0]},${theme[1]},${theme[2]})`
            draw.fillRect(x, y, bsz, bsz)
        }
        else draw.drawImage(im, x, y, bsz, bsz)
    }
    showita(d) {
        let im = bimgs[this.id]
        if (im === undefined) {
            let theme = materials[this.mat]["theme"]
            d.fillStyle = `rgb(${theme[0]},${theme[1]},${theme[2]})`
            d.fillRect(0, 0, bsz, bsz)
        }
        else d.drawImage(im, 0, 0, bsz, bsz)
    }
}
