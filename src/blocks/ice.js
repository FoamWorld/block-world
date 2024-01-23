class ice extends Solid {
    get hard() { return 20 }
    show(x, y) { draw.fillStyle = `#A0C0FF`; draw.fillRect(x, y, bsz, bsz) }
    showita(d) { d.fillStyle = "#A0C0FF"; d.fillRect(0, 0, bsz, bsz) }
    update(x, y) {
        for (let i = 0; i < 4; i++) {
            if (ndim.blk(x + direx[i], y + direy[i]).brightness > 8)
                setblk(x, y, block("water"))
        }
    }
    onbroken(x, y, args) {
        setblk(x, y, block("water"))
        return false
    }
}
