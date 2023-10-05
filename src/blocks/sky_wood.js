class sky_log extends Solid {
	hard() { return 25 }
}
class sky_leaf extends NotSolid {
	static bk = false
	hard() { return 15 }
	drop() { return [pair(new IFB(new sky_sapling()), grand() % 2)] }
}
class sky_sapling extends NotSolid {
	static bk = false
	static hastrans = true
	hard() { return 15 }
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
				makeblk(x + 1, y, new sky_log())
				makeblk(x + 2, y, new sky_log())
				for (r = 3; r <= 6; r++)
					if (isair(ndim.blk(x + r, y)))
						makeblk(x + r, y, new sky_log())
					else
						break
			}
			if (cx2) {
				makeblk(x - 1, y, new sky_log())
				makeblk(x - 2, y, new sky_log())
				for (l = 3; l <= 6; l++)
					if (isair(ndim.blk(x - l, y)))
						makeblk(x - l, y, new sky_log())
					else
						break
			}
			for (let i = -l; i <= r; i++) {
				if (isair(ndim.blk(x + i, y - 1)) && gchance(1, 3))
					makeblk(x + i, y - 1, new sky_leaf())
				if (isair(ndim.blk(x + i, y + 1)) && gchance(1, 3))
					makeblk(x + i, y + 1, new sky_leaf())
			}
		}
		else { // 纵
			if (cy1) {
				makeblk(x, y + 1, new sky_log())
				makeblk(x, y + 2, new sky_log())
				for (r = 3; r <= 6; r++)
					if (isair(ndim.blk(x, y + r)))
						makeblk(x, y + r, new sky_log())
					else
						break
			}
			if (cy2) {
				makeblk(x, y - 1, new sky_log())
				makeblk(x, y - 2, new sky_log())
				for (l = 3; l <= 6; l++)
					if (isair(ndim.blk(x, y - l)))
						makeblk(x, y - l, new sky_log())
					else
						break
			}
			for (let i = -l; i <= r; i++) {
				if (isair(ndim.blk(x - 1, y + i)) && gchance(1, 3))
					makeblk(x - 1, y + i, new sky_leaf())
				if (isair(ndim.blk(x + 1, y + i)) && gchance(1, 3))
					makeblk(x + 1, y + i, new sky_leaf())
			}
		}
		makeblk(x, y, new sky_log())
	}
}
