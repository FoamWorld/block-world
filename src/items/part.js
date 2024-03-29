class Part extends Item {
    constructor(mat) { super(); this.mat = mat }
    get id() { return this.mat + this.constructor.name }
    get text() { return text_translate(this.mat, this.constructor.name) }
    showita(d) {
        let id = this.id
        let c = bcaches[id]
        if (c === undefined) {
            c = inner_load_mould(this.constructor.name, this.mat)
            bcaches[id] = c
        }
        d.putImageData(c, 0, 0)
    }
}
class ingot extends Part {
    get amount() { return 0.125 }
}
class lamina extends Part {
    get amount() { return 0.25 }
    showita(d) {
        let t = materials[this.mat]["theme"]
        d.fillStyle = `rgb(${t[0]},${t[1]},${t[2]})`
        d.fillRect(0, 0, 32, 32)
    }
}
