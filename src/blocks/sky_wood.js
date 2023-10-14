class sky_log extends Solid {
	get hard() { return 25 }
	get isBurnable() { return true }
	get isWood() { return true }
}
class sky_leaf extends NotSolid {
	static bk = false
	get hard() { return 15 }
	get isBurnable() { return true }
	drop() { return [pair(new IFB(new sky_sapling()), grand() % 2)] }
}
class sky_plank extends Solid {
    get hard() { return 25 }
    get isBurnable() { return true }
    t_mat() { if (this.t == 0) return new 苍穹木() }
}
class sky_sapling extends NotSolid {
	static bk = false
	static hastrans = true
	get hard() { return 15 }
	get isBurnable() { return true }
	get isWood() { return true }
	update(x, y) {
		let rndstore = grand()
		if (rndstore < 8)
			this._grow(x, y)
	}
	_grow(x, y) {
		let cx1 = isair(ndim.blk(x + 1, y)) && isair(ndim.blk(x + 2, y)),
			cx2 = isair(ndim.blk(x - 1, y)) && isair(ndim.blk(x - 2, y)),
			cx = cx1 && cx2
		let cy1 = isair(ndim.blk(x, y + 1)) && isair(ndim.blk(x, y + 2)),
			cy2 = isair(ndim.blk(x, y - 1)) && isair(ndim.blk(x, y - 2)),
			cy = cy1 && cy2
		if (!cx && !cy) return
		let d = (cx && cy) ? grand() % 2 : cx ? 0 : 1
		let l = 0, r = 0
		if (d == 0) { // 横
			if (cx1) {
				makeblk(x + 1, y, block("sky_log"))
				makeblk(x + 2, y, block("sky_log"))
				for (r = 3; r <= 6; r++)
					if (isair(ndim.blk(x + r, y)))
						makeblk(x + r, y, block("sky_log"))
					else
						break
			}
			if (cx2) {
				makeblk(x - 1, y, block("sky_log"))
				makeblk(x - 2, y, block("sky_log"))
				for (l = 3; l <= 6; l++)
					if (isair(ndim.blk(x - l, y)))
						makeblk(x - l, y, block("sky_log"))
					else
						break
			}
			for (let i = -l; i <= r; i++) {
				if (isair(ndim.blk(x + i, y - 1)) && gchance(1, 3))
					makeblk(x + i, y - 1, block("sky_leaf"))
				if (isair(ndim.blk(x + i, y + 1)) && gchance(1, 3))
					makeblk(x + i, y + 1, block("sky_leaf"))
			}
		}
		else { // 纵
			if (cy1) {
				makeblk(x, y + 1, block("sky_log"))
				makeblk(x, y + 2, block("sky_log"))
				for (r = 3; r <= 6; r++)
					if (isair(ndim.blk(x, y + r)))
						makeblk(x, y + r, block("sky_log"))
					else
						break
			}
			if (cy2) {
				makeblk(x, y - 1, block("sky_log"))
				makeblk(x, y - 2, block("sky_log"))
				for (l = 3; l <= 6; l++)
					if (isair(ndim.blk(x, y - l)))
						makeblk(x, y - l, block("sky_log"))
					else
						break
			}
			for (let i = -l; i <= r; i++) {
				if (isair(ndim.blk(x - 1, y + i)) && gchance(1, 3))
					makeblk(x - 1, y + i, block("sky_leaf"))
				if (isair(ndim.blk(x + 1, y + i)) && gchance(1, 3))
					makeblk(x + 1, y + i, block("sky_leaf"))
			}
		}
		makeblk(x, y, block("sky_log"))
	}
}
