class mould_table extends Solid {
    get hard() { return 25 }
    static hasgui = true
    onguiopen() {
        let gui = zbox_gui2()
        localtemp.i = new IB(2)
        localtemp.i.html(gui, 0, "it0", function (par, i) {
            if (i == 0)
                par.append(document.createTextNode(" => "))
            else
                par.innerHTML += `<select id="guo"></select><button onclick="ndim.blk(${guix},${guiy}).work()">制作</button>`
        })
        let s = ""
        for (let i of Object.keys(mould_dat))
            s += `<option value="${i}">${i}</option>`
        gid("guo").innerHTML = s
        this.updategui()
    }
    onguiclose(x, y) { throwits(x, y) }
    updategui() {
        localtemp.i.updategui(0, "localtemp.i", function () { }, function (i) { return (i == 0) ? "c" : "r" })
    }
    work() {
        if (!(localtemp.i.i[1] instanceof EI)) { info_help("请先移走生成物"); return }
        let ini = localtemp.i.i[0]
        if (!(ini instanceof 薄板)) { info_help("请使用薄板"); return }
        if (ini.mat.constructor.hard > 35) { info_help("材质太硬"); return }
        let mater = ini.t_mat()
        let v = gid("guo").value
        let it = new 模具(v, mater)
        localtemp.i.i[1] = it
        let inn = localtemp.i.getn(0)
        let oun = Math.min(inn, it.constructor.stack)
        localtemp.i.setn(1, oun)
        if (inn == oun) localtemp.i.i[0] = new EI()
        localtemp.i.setn(0, inn - oun)
        this.updategui()
    }
}
