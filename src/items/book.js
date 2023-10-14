class book extends Item {
    constructor(c = [""], p = 0) { super(); this.c = c; this.p = p }
    static stack = 1
    static canuse = true
    onuse() {
        let gui = zbox_gui2()
        let text_area = createQElement("textarea", { id: "book-page", className: "textarea-ink", type: "text", maxlength: "1000", rows: "15", cols: "80" })
        let num_area = createQElement("p", { id: "book-page-num" })
        gui.append(text_area, num_area)
        for (let vec of [["|&lt;", "first"], ["&lt;", "prev"], ["-", "del"], ["0", "clear"], ["+", "new"], ["&gt;", "next"], ["&gt;|", "last"]]) {
            gui.innerHTML += `<button onclick='nit._${vec[1]}()'>${vec[0]}</button>`
        }
        this.updategui()
    }
    onunuse() { this.c[this.p] = gid("book-page").value }
    updategui() {
        gid("book-page").value = this.c[this.p]
        gid("book-page-num").innerText = (this.p + 1) + "/" + this.c.length
    }
    _save() { this.c[this.p] = gid("book-page").value }
    _new() { this._save(); this.c.splice(this.p + 1, 0, ""); this.updategui() }
    _first() { this._save(); this.p = 0; this.updategui() }
    _last() { this._save(); this.p = this.c.length - 1; this.updategui() }
    _prev() { this._save(); this.p = (this.p == 0 ? 0 : this.p - 1); this.updategui() }
    _next() { this._save(); this.p = (this.p == this.c.length - 1 ? this.p : this.p + 1); this.updategui() }
    _clear() { this.c = [""]; this.p = 0; this.updategui() }
    _del() {
        if (this.c.length == 1) this.c[0] = ""
        else this.c.splice(this.p, 1)
        if (this.p == this.c.length) this.p--
        this.updategui()
    }
}
