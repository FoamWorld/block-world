class lighter extends Item {
	static canuse = true
	onuse() {
		if (Number.isNaN(mousex) || Number.isNaN(mousey)) return
		let t = pos_by_showpos(mousex, mousey)
		let b = ndim.blk(t.a, t.b)
		if (b.isBurnable)
			makeblk(t.a, t.b, block("fire"))
	}
}
