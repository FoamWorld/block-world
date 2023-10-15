class lighter extends Item {
	static canuse = true
	onuse() {
		if (Number.isNaN(mousex) || Number.isNaN(mousey)) return
		let t = pos_by_showpos(mousex, mousey)
		let b = ndim.blk(t.first, t.second)
		if (b.isBurnable)
			makeblk(t.first, t.second, block("fire"))
	}
}
