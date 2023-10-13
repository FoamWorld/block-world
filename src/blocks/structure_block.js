class structure_block extends Solid {
    constructor(n = "", x = 0, y = 0, le = NaN, wi = NaN) { super(); this.n = n; this.x = x; this.y = y; this.le = le; this.wi = wi; }
    get hard() { return 3200 }
    static hasgui = true
    putextra(x, y) {
        this.x = x; this.y = y;
    }
    onguiopen() {
        let gui = zbox_gui2()
        gui.innerHTML = `<input id="gun" type="text" size="8"><button onclick="ndim.blk(${guix},${guiy})._i()">保存</button><button onclick="ndim.blk(${guix},${guiy})._o()">放置</button><br /><span>(</span><input id="gux" type="text" size="2"><span>,</span><input id="guy" type="text" size="2"><span>)[</span><input id="gul" type="text" size="2" placeholder="长度"><span>,</span><input id="guw" type="text" size="2" placeholder="宽度"><span>]</span>`
        this.updategui()
        inputting2 = true
    }
    updategui() {
        gid("gun").value = this.n; gid("gux").value = this.x; gid("guy").value = this.y; gid("gul").value = this.le; gid("guw").value = this.wi
    }
    _i() {
        let tn = gid("gun").value
        if (tn == "") { info_help("名称不能为空"); return }
        let x = Number.parseInt(gid("gux").value), y = Number.parseInt(gid("guy").value), le = Number.parseInt(gid("gul").value), wi = Number.parseInt(gid("guw").value)
        if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(le) || Number.isNaN(wi)) {
            info_help("请输入整数")
            this.updategui()
            return
        }
        if (le <= 0 || wi <= 0) { info_help("边长需为正"); return }
        this.x = x; this.y = y; this.le = le; this.wi = wi; this.n = tn
        let s = "["
        for (let i = 0; i < this.le; i++) {
            for (let j = 0; j < this.wi; j++) {
                s += `${encode(ndim.blk(i + this.x, j + this.y))},`
            }
        }
        setting["st"][tn + "%l"] = this.le
        setting["st"][tn + "%w"] = this.wi
        setting["st"][tn + "%d"] = s + "]"
    }
    _o() {
        let x = Number.parseInt(gid("gux").value), y = Number.parseInt(gid("guy").value)
        if (Number.isNaN(x) || Number.isNaN(y)) {
            info_help("请输入整数")
            this.updategui()
            return
        }
        this.x = x
        this.y = y
        let n = gid("gun").value
        let td = setting["st"][n + "%d"]
        if (td === undefined) { info_help("结构不存在"); return }
        let t = decode(td)
        this.n = n
        this.le = Number.parseInt(setting["st"][n + "%l"])
        this.wi = Number.parseInt(setting["st"][n + "%w"])
        this.updategui()
        for (let i = 0; i < this.le; i++) {
            for (let j = 0; j < this.wi; j++) {
                makeblk(i + this.x, j + this.y, t[i * this.wi + j])
            }
        }
    }
}
