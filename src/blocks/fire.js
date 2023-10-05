class fire extends NotSolid {
	constructor(life = 8) { this.life = life }
	update(x, y) {
		if (this.life == 0)
			makeblk(x, y)
		for (let rx = -1; rx <= 1; rx++)
			for (let ry = -1; ry <= 1; ry++)
				if (rx != 0 || ry != 0)
					if (ndim.blk(x + rx, y + ry).isBurnable)
						makeblk(x + rx, y + ry, new fire())
		this.life--
	}
}
