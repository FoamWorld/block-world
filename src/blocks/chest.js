class chest extends Solid {
    constructor(its = new IB(16)) { super(); this.its = its }
    get hard() { return 25 }
    static hasgui = true
    onguiopen() {
        let gui = zbox_gui2()
        this.its.html(gui, 0, "it0", function (par, i) {
            if (i == 7) par.appendChild(document.createElement("br"))
        })
        this.updategui()
    }
    updategui() {
        this.its.updategui()
    }
    give(it, n) {
        this.its.give(it, n)
    }
	give2(blk, n) {
		this.its.give(new IFB(blk), n)
	}
}
