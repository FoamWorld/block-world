class mould extends Item {
    constructor(sh, mat) { super(); this.sh = sh; this.mat = mat }
    id() { return `${this.mat.constructor.name}质${this.sh}模具` }
    amount() { return 1 - amountof[this.sh] }
    showita(d) {
        let id = this.id()
        let c = bcaches[id]
        if (c === undefined) {
            c = inner_load_mouldof(this.sh, this.mat)
            bcaches[id] = c
        }
        d.putImageData(c, 0, 0)
    }
}
