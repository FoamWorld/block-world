class bomb extends Item {
    showita(d) {
        d.fillStyle = "#fff"
        d.fillRect(0, 0, 1, 1)
    }
    onunuse() {
        if (Number.isNaN(mousex) || Number.isNaN(mousey)) return
        let t = pos_by_showpos(mousex, mousey)
        let x = t.a, y = t.b
        for (let rx = -2; rx <= 2; rx++) {
            for (let ry = -2; ry <= 2; ry++) {
                if (rx == 0 && ry == 0) continue
                let b = ndim.blk(x + rx, y + ry)
                if (!isair(b) && b.hard < 3200)
                    makeblk(x + rx, y + ry)
            }
        }
        setblk(x, y)
    }
}
