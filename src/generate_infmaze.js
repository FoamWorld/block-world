/*
Chunk.prototype.setblk2 = function (x, y, sz, block) {
    for (let i = 0; i < sz; i++) {
        for (let j = 0; j < sz; j++) {
            this.blk[x * sz + i, y * sz + j] = block
        }
    }
}
*/
Chunk.prototype.generate_infmaze_4 = function (lx, ly, rx, ry) {// 递归分割（原因：直线多）
    let x0 = rx - lx, y0 = ry - ly
    if (x0 == 0 || y0 == 0) {
        for (let i = lx; i <= rx; i++) {
            for (let j = ly; j <= ry; j++)this.blk[i][j] = _air()
        }
        return
    }
    let mx = lx + 2 * (rand() % (x0 >> 1)) + 1, my = ly + 2 * (rand() % (y0 >> 1)) + 1
    for (let i = lx; i <= rx; i++)this.blk[i][my] = block("wall")
    for (let i = ly; i <= ry; i++)this.blk[mx][i] = block("wall")
    // 4个小区间
    this.generate__infmaze_4(lx, ly, mx - 1, my - 1)
    this.generate__infmaze_4(lx, my + 1, mx - 1, ry)
    this.generate__infmaze_4(mx + 1, ly, rx, my - 1)
    this.generate__infmaze_4(mx + 1, my + 1, rx, ry)
    // 3个出口
    let d = rand() % 4
    let myl = (my - ly + 1) >> 1, myr = (ry - my + 1) >> 1, mxl = (mx - lx + 1) >> 1, mxr = (rx - mx + 1) >> 1
    if (d == 0) {
        this.blk[rx - 2 * (rand() % mxr)][my] = _air()
        this.blk[mx][ly + 2 * (rand() % myl)] = _air()
        this.blk[mx][ry - 2 * (rand() % myr)] = _air()
    }
    else if (d == 1) {
        this.blk[lx + 2 * (rand() % mxl)][my] = _air()
        this.blk[mx][ly + 2 * (rand() % myl)] = _air()
        this.blk[mx][ry - 2 * (rand() % myr)] = _air()
    }
    else if (d == 2) {
        this.blk[lx + 2 * (rand() % mxl)][my] = _air()
        this.blk[rx - 2 * (rand() % mxr)][my] = _air()
        this.blk[mx][ry - 2 * (rand() % myr)] = _air()
    }
    else {
        this.blk[lx + 2 * (rand() % mxl)][my] = _air()
        this.blk[rx - 2 * (rand() % mxr)][my] = _air()
        this.blk[mx][ly + 2 * (rand() % myl)] = _air()
    }
}
Chunk.prototype.generate_infmaze = function (x, y) {
    for (let i = 0; i < 64; i++) {
        this.blk[i][0] = block("wall")
        this.blk[0][i] = block("wall")
    }
    srand = (x << 15 + y) ^ localsetting["seed"] << 3
    this.generate__infmaze_4(1, 1, 63, 63)
    // 区块相连
    let decision = localsetting["plain"] == true
    let content
    if (decision)
        content = _air()
    else {
        content = block("chest", { its: new IB(16) })
        let dist = x ^ 2 + y ^ 2
        if (dist <= 5) {
            content.give(block("sky_sapling"), Number(gchance(1, 3)) + 1)
            content.give(item("bucket", { tID: rand() % 3 }), 1)
            content.give(block("sky_plank"), rand() % 4 + 2)
            content.give(item("ingot", { mat: "iron" }), rand() % 5)
            content.give(item("ingot", { mat: "copper" }), Number(gchance(1, 7)))
        }
        else {
            content.give(block("vine_grow"), 1)
            content.give(block("fluorite"), rand() % 3)
        }
    }
    this.blk[2 * (rand() % 32) + 1][0] = content
    this.blk[0][2 * (rand() % 32) + 1] = _air()
}
function initgen_infmaze() { ply = new Player(1.5, 1.5) }
