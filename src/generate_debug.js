Chunk.prototype.generate_debug = function (x, y) {
	this.blk[0][0] = block("border")
	for (let i = 1; i < 64; i++) {
		this.blk[i][0] = block("border")
		this.blk[0][i] = block("border")
	}
	for (let i = 1; i < 64; i++)
		for (let j = 1; j < 64; j++)
			this.blk[i][j] = _air()
	if (x == 0 && y == 0) {
		let c = block("chest")
		c.give(new bucket(new water()))
		c.give(new bucket(new lava()))
		c.give(block("vine"), 15)
		c.give(block("sky_sapling"), 15)
		this.blk[1][1] = c
	}
}
