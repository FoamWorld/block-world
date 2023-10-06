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
                but.onclick = function () {
                    ndim.blk(guix, guiy).work()
                }
                par.append(document.createElement("br"), but)
            }
        })
        this.updategui()
    }
    onguiclose(x, y) { throwits(x, y) }
    updategui() {
        localtemp.i.updategui(0, "localtemp.i", function () { }, function (i) { return (i == 9) ? "r" : "c" })
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
        let it = guess_itm(tr.a)
        let mh = Math.floor(it.constructor.stack / tr.b)
        if (mh == 0) {
            info_log(`发现设计问题，请告知开发者`)
            return
        }
        for (let i = 0; i < 9; i++)if (!(localtemp.i.i[i] instanceof EI)) mh = Math.min(mh, localtemp.i.getn(i))
        for (let i = 0; i < 9; i++)localtemp.i.reduce(i, mh)
        localtemp.i.i[9] = it
        localtemp.i.setn(9, tr.b * mh)
        this.updategui()
    }
}
