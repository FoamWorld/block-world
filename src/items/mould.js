class mould extends Item {
    constructor(sh, mat) { super(); this.sh = sh; this.mat = mat }
    get amount() { return 1 - amountof[this.sh] }
    get id() { return `${this.sh}_mould [${this.mat}]` }
    get text() { return text_translate(this.sh, "mould", "[", this.mat, "]") }
    showita(d) {
        let id = this.id
        let c = bcaches[id]
        if (c === undefined) {
            c = inner_load_mouldof(this.sh, this.mat)
            bcaches[id] = c
        }
        d.putImageData(c, 0, 0)
    }
}
