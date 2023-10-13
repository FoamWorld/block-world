class carving_table extends Solid {
    get hard() { return 25 }
    static hasgui = true
    onguiopen() {
        let gui = zbox_gui2()
        localtemp.i = new IB(2)
        localtemp.i.html(gui, 0, "it0", function (par, i) {
            if (i == 0)
				par.append(document.createTextNode(" => "))
            else
                par.innerHTML += `<select id="guo"></select><button onclick="ndim.blk(${guix},${guiy}).work()">刻制</button>`
        })
        this.updategui()
    }
    onguiclose(x, y) { throwits(x, y) }
    updategui() {
        localtemp.i.updategui(0, "localtemp.i", function () { }, function (i) { return (i == 0) ? "c" : "r" })
        let it = localtemp.i.i[0]
        let li = carves_nor[it.id]
        if (li !== undefined) {
            let s = ""
            for (let i of li)
                s += `<option value="${i}">${textof(localsetting["l"], i)}</option>`
            gid("guo").innerHTML = s
        }
        else
            gid("guo").innerHTML = ""
    }
    work() {
        if (!(localtemp.i.i[1] instanceof EI)) { info_help("请先移走生成物"); return }
        let v = gid("guo").value
        let it = guess_itm(v)
        localtemp.i.i[1] = it
        let inn = localtemp.i.getn(0)
        let oun = Math.min(inn, it.constructor.stack)
        localtemp.i.setn(1, oun)
        if (inn == oun) localtemp.i.i[0] = new EI()
        localtemp.i.setn(0, inn - oun)
        this.updategui()
    }
}
