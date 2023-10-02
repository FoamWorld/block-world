Chunk.prototype.generate__infmaze_4 = function (lx, ly, rx, ry) {// 递归分割（原因：直线多）
    let x0 = rx - lx, y0 = ry - ly
    if (x0 == 0 || y0 == 0) {
        for (let i = lx; i <= rx; i++) {
            for (let j = ly; j <= ry; j++)this.blk[i][j] = new 空气()
        }
        return
    }
    let mx = lx + 2 * (rand() % (x0 >> 1)) + 1, my = ly + 2 * (rand() % (y0 >> 1)) + 1
    for (let i = lx; i <= rx; i++)this.blk[i][my] = new 星岩()
    for (let i = ly; i <= ry; i++)this.blk[mx][i] = new 星岩()
    // 4个小区间
    this.generate__infmaze_4(lx, ly, mx - 1, my - 1)
    this.generate__infmaze_4(lx, my + 1, mx - 1, ry)
    this.generate__infmaze_4(mx + 1, ly, rx, my - 1)
    this.generate__infmaze_4(mx + 1, my + 1, rx, ry)
    // 3个出口
    let d = rand() % 4
    let myl = (my - ly + 1) >> 1, myr = (ry - my + 1) >> 1, mxl = (mx - lx + 1) >> 1, mxr = (rx - mx + 1) >> 1
    if (d == 0) {
        this.blk[rx - 2 * (rand() % mxr)][my] = new 空气()
        this.blk[mx][ly + 2 * (rand() % myl)] = new 空气()
        this.blk[mx][ry - 2 * (rand() % myr)] = new 空气()
    }
    else if (d == 1) {
        this.blk[lx + 2 * (rand() % mxl)][my] = new 空气()
        this.blk[mx][ly + 2 * (rand() % myl)] = new 空气()
        this.blk[mx][ry - 2 * (rand() % myr)] = new 空气()
    }
    else if (d == 2) {
        this.blk[lx + 2 * (rand() % mxl)][my] = new 空气()
        this.blk[rx - 2 * (rand() % mxr)][my] = new 空气()
        this.blk[mx][ry - 2 * (rand() % myr)] = new 空气()
    }
    else {
        this.blk[lx + 2 * (rand() % mxl)][my] = new 空气()
        this.blk[rx - 2 * (rand() % mxr)][my] = new 空气()
        this.blk[mx][ly + 2 * (rand() % myl)] = new 空气()
    }
}
Chunk.prototype.generate__infmaze = function (x, y) {
    for (let i = 0; i < 64; i++) {
        this.blk[i][0] = new 星岩()
        this.blk[0][i] = new 星岩()
    }
    srand = (x << 15 + y) ^ localsetting["seed"] << 3
    this.generate__infmaze_4(1, 1, 63, 63)
    // 区块相连
    let r1 = rand() % 32
    let decision = r1 < 16 && (x ^ 2 + y ^ 2) > 25
    let content = decision ? new 空气() : new 箱子(new IB(16))
    if (!decision) {
        content.give(new IFB(new 树苗(0)), rand() % 4 + 1)
        content.give(new 桶(rand() % 3), 1)
    }
    this.blk[2 * (rand() % 32) + 1][0] = content
    this.blk[0][2 * (rand() % 32) + 1] = decision ? new 玻璃() : new 空气()
}
function initgen__infmaze() { ply = new Player(1.5, 1.5) }
