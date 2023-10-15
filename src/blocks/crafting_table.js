class crafting_table extends Solid {
    get hard() { return 25 }
    static hasgui = true
    get isBurnable() { return true }
    onguiopen() {
        let gui = zbox_gui2()
        localtemp.i = new IB(10)
        localtemp.i.html(gui, 0, "it0", function (par, i) {
            if (i == 2 || i == 5) par.appendChild(document.createElement("br"))
            else if (i == 8) {
                let but = document.createElement("button")
                but.innerText = "合成"
                but.onclick = () => {
                    ndim.blk(guix, guiy).work()
                }
                par.append(document.createElement("br"), but)
            }
        })
        this.updategui()
    }
    onguiclose(x, y) { throwits(x, y) }
    updategui() {
        localtemp.i.updategui(0, "localtemp.i", () => { }, function (i) { return (i == 9) ? "r" : "c" })
    }
    work() {
        if (!(localtemp.i.i[9] instanceof EI)) {
            info_help("请先移走生成物")
            return
        }
        let tr = inner_craft(localtemp.i.i)
        if (tr === null) {
            info_help("无法合成")
            return
        }
        let it = guess_object(tr.first)
        let mh = Math.floor(it.constructor.stack / tr.second)
        if (mh == 0) {
            info_log(`发现设计问题，请告知开发者`)
            return
        }
        for (let i = 0; i < 9; i++)if (!(localtemp.i.i[i] instanceof EI)) mh = Math.min(mh, localtemp.i.getn(i))
        for (let i = 0; i < 9; i++)localtemp.i.reduce(i, mh)
        localtemp.i.i[9] = it
        localtemp.i.setn(9, tr.second * mh)
        this.updategui()
    }
}

function inner_craft(its, lin = 3, col = 3) {
    // 载入
    let ar = arrayof(lin, () => [])
    for (let i = 0; i < lin; i++) {
        for (let j = 0; j < col; j++) {
            ar[i][j] = its[i * col + j].id()
        }
    }
    // 移到左上角
    let fl = false, mov_lin = 0, mov_col = 0
    while (mov_lin < lin) {
        for (let j = 0; j < col; j++) {
            if (ar[mov_lin][j] != "") {
                fl = true
                break
            }
        }
        if (fl) break
        mov_lin++
    }
    fl = false
    while (mov_col < col) {
        for (let i = mov_lin; i < lin; i++) {
            if (ar[i][mov_col] != "") {
                fl = true
                break
            }
        }
        if (fl) break
        mov_col++
    }
    if (mov_lin != 0 || mov_col != 0) {
        for (let i = mov_lin; i < lin; i++) {
            for (let j = mov_col; j < lin; j++) {
                let ts = ar[i][j]
                ar[i][j] = ""
                ar[i - mov_lin][j - mov_col] = ts
            }
        }
    }
    // 依次检查
    for (let c of crafts_nor) {
        let pat = c[0], co = 0, fl = false, prev
        let patl = pat.length
        if (patl > lin) continue
        for (let i = 0; i < patl; i++) {
            let l = pat[i]
            if (l >> col) {
                fl = true
                break
            }
            for (le = 0; le < col; le++) {
                if (l >> le & 1) {
                    if (c[1][co] != "!") prev = c[1][co]
                    if (ar[i][le] != prev) {
                        fl = true
                        break
                    }
                    co++
                }
                else if (ar[i][le] != "") {
                    fl = true
                    break
                }
            }
        }
        if (fl) continue
        return pair(c[2], c[3] === undefined ? 1 : c[3])
    }
    return null
}
