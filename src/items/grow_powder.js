class grow_powder extends Item {
    static canuse = true
    onuse() {
        if (Number.isNaN(mousex) || Number.isNaN(mousey)) return
        let t = pos_by_showpos(mousex, mousey)
        let b = ndim.blk(t.first, t.second)
        if (oftype(b, "sky_sapling") && gchance(1, 3))
            b._grow(t.first, t.second)
    }
}
