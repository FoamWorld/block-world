class water extends NotSolid {
	constructor() { super(); this.tmp = 3 }
	show(x, y) {
		draw.fillStyle = `rgb(${64 - 16 * this.tmp},${80 - 16 * this.tmp},${240 - 16 * this.tmp})`
		draw.fillRect(x, y, bsz, bsz)
	}
	update(x, y) {
		let m = 0
		for (let i = 0; i < 4; i++) {
			let t = ndim.blk(x + direx[i], y + direy[i])
			if (oftype(t, "water")) {
				if (m < t.tmp)
					m = t.tmp
				t.tmp = Math.max(t.tmp, this.tmp - 1)
			}
			else if (this.tmp != 0 && isair(t))
				setblk(x + direx[i], y + direy[i], block("water", { tmp: this.tmp - 1 }))
		}
		if (this.tmp != 3 && m <= this.tmp)
			setblk(x, y)
	}
}
is_water_origin = function (blk) { oftype(blk, "water") && blk.tmp == 3 }
