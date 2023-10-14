class bucket extends Item {
	constructor(content = block("air")) { super(); this.content = content }
	static canuse = true
	static stack = 1
	static useonce = true
	set tID(t) {
		switch (t) {
			case 0: {
				this.content = block("air")
				break
			}
			case 1: {
				this.content = block("water")
				break
			}
			case 2: {
				this.content = block("lava")
				break
			}
		}
	}
	onuse() {
		if (Number.isNaN(mousex) || Number.isNaN(mousey)) return
		let t = pos_by_showpos(mousex, mousey)
		let b = ndim.blk(t.a, t.b)
		if (isair(this.content)) {
			if (oftype(b, "water") || oftype(b, "lava")) {
				if (!localsetting["inf-use"])
					this.content = b
				removeblk(t.a, t.b)
			}
		}
		else if (isair(b) && ply.reachable(t.a, t.b)) {
			setblk(t.a, t.b, this.content)
			if (!localsetting["inf-use"])
				this.content = block("air")
		}
	}
}
