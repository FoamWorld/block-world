class bucket extends Item {
	constructor(content = _air()) { super(); this.content = content }
	static canuse = true
	get id() {
		if (oftype(this.content, "air"))
			return "empty_bucket"
		else
			return this.content.id + "_bucket"
	}
	get text() {
		if (oftype(this.content, "air"))
			return text_translate("empty_bucket")
		else
			return text_translate(this.content.id, "bucket")
	}
	static stack = 1
	static useonce = true
	set tID(t) {
		switch (t) {
			case 0: {
				this.content = _air()
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
	showita(d) {
		let im = bimgs[this.id]
		if (im == undefined) im = bimgs["notexture"]
		d.drawImage(im, 0, 0, bsz, bsz)
	}
	onuse() {
		if (Number.isNaN(mousex) || Number.isNaN(mousey)) return
		let t = pos_by_showpos(mousex, mousey)
		let b = ndim.blk(t.first, t.second)
		if (isair(this.content)) {
			if ((oftype(b, "water") || oftype(b, "lava")) && b.tmp == 3) {
				if (!localsetting["inf-use"])
					this.content = b
				removeblk(t.first, t.second)
			}
		}
		else if (isair(b) && ply.reachable(t.first, t.second)) {
			setblk(t.first, t.second, this.content)
			if (!localsetting["inf-use"])
				this.content = _air()
		}
	}
}
