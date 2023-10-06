class lava extends NotSolid {
	constructor() { super(); this.tmp = 3 }
	get brightness() { return 14 }
	show(x, y) {
		draw.fillStyle = "#ffff" + ["a0", "f0", "fe", "ff"][this.tmp]
		draw.fillRect(x, y, bsz, bsz)
	}
	update(x, y) {
		let m = 0, nw = false, nr = false
		for (let i = 0; i < 4; i++) {
			let t = ndim.blk(x + direx[i], y + direy[i])
			let id = t.id
			if (id == "water")
				nw = true
			else if (id == "lava") {
				m = Math.max(m, t.tmp)
				t.tmp = Math.max(t.tmp, this.tmp - 1)
			}
			else if (t.isRock)
				nr = true
			else if (this.tmp != 0 && id == "air")
				makeblk(x + direx[i], y + direy[i], block("lava", { tmp: this.tmp - 1 }))
		}
		if (nw) {
			if (nr) // 推测生成侵入岩
				makeblk(x, y, block("granite"))
			else
				makeblk(x, y, block(grand() % 2 == 0 ? "andesite" : "basalt")) // 推测生成火成岩
		}
		else if (this.tmp != 3 && m <= this.tmp)
			setblk(x, y)
	}
}
