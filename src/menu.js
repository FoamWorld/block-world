function back_to_menu() {
    if (curpage == "game") end_game()
    else if (curpage != "menu") container_to("menu")
}
// setting
const setting_chs = [
    ["显示事件", "show-event"],
    ["显示帮助", "show-help"],
]
function setting_checkbox(id) {
    setting[id] = !setting[id]
    let t = setting[id]
    gid(id + "%o").style.background = t ? "#0078D4" : "#FFFFFF"
    gid(id + "%i").style.left = t ? "25px" : "5px"
    gid(id + "%i").style.background = t ? "#FFFFFF" : "#929292"
}
// intend_open
var saved_li
function intend_open_onload() {
    saved_li = []
    let l = localStorage.length
    for (let i = 0; i < l; i++) {
        var s = localStorage.key(i)
        if (s.endsWith("%v")) {
            saved_li.push(s.slice(0, -2))
        }
    }
    intend_open_sl_upd()
}
function intend_open_sl_upd() {
    let list = gid("savedlist")
    for (let i of saved_li) {
        let tr = createQElement("tr", { id: `${i}%r` })
        tr.append(
            createQElement("td", { innerText: i }),
            createQElement("td", { innerText: "载入", className: "tech-clickable", onclick: () => { load_saved(i) } }),
            createQElement("td", {
                innerText: "重命名", className: "tech-clickable", onclick: () => {
                    // todo
                }
            }),
            createQElement("td", { innerText: "删除", className: "tech-clickable", onclick: () => { intend_open_sl_del(i) } }),
        )
        list.append(tr)
    }
}
function intend_open_sl_del(id) {
    gid(id + "%r").remove()
    saved_li.splice(saved_li.indexOf(id), 1)
    eraseworld(id)
}
// game
function game_onload() {
    resize()
}
