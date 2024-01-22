class wooden_sign extends NotSolid {
    constructor() { super(); this.word = ""; this.color = "#000" }
    get hard() { return 25 }
    static hasgui = true
    static hastrans = true
    get isBurnable() { return true }
    show(x, y) {
        draw.drawImage(bimgs["wooden_sign"], x, y, bsz, bsz)
        show_after.push(function () {
            draw.fillStyle = this.color
            draw.font = "16px"
            draw.fillText(this.word, x + 2, y + 18)
        })
    }
    onguiopen() {
        let gui = zbox_gui2()
        gui.append(
            createQElement("input", { id: "gus", type: "text", size: "8", placeholder: "文字" }),
            createQElement("input", { id: "guc", type: "color" }),
            createQElement("button", {
                innerText: "设置", onclick: () => {
                    this.word = gid("gus").value
                    this.color = gid("guc").value
                }
            })
        )
        this.updategui()
        inputting2 = true
    }
    updategui() { gid("gus").value = this.word; gid("guc").value = this.color }
}
