function createQElement(tagname, deco) {
    let tag = document.createElement(tagname)
    for (let k of Object.keys(deco)) tag[k] = deco[k]
    return tag
}
function append_setting_input(guide, input_deco) {
    return [
        createQElement("span", { innerText: guide }),
        createQElement("input", input_deco),
        document.createElement("br")
    ]
}
function append_setting_selection(guide, select_deco, dict) {
    let select = createQElement("select", select_deco)
    let flag = true
    for (let key of Object.keys(dict)) {
        let option = createQElement("option", { value: key, innerText: dict[key] })
        if (flag) {
            option.selected = true
            flag = false
        }
        select.append(option)
    }
    return [
        createQElement("span", { innerText: guide }),
        select,
        document.createElement("br")
    ]
}
function append_setting_checkbox() { }

function menu_load(par) { // 主菜单
    let div = createQElement("div", { id: "fw_title" })
    let span = createQElement("span", { innerText: "Foam World" })
    div.appendChild(span)
    let but1 = document.createElement("button")
    but1.innerText = "设置"
    but1.className = "menu_button"
    but1.onclick = () => container_to("setting")
    let but2 = document.createElement("button")
    but2.innerText = "创建新世界"
    but2.className = "menu_button"
    but2.onclick = () => container_to("intend_new_game")
    let but3 = document.createElement("button")
    but3.innerText = "打开存档"
    but3.className = "menu_button"
    but3.onclick = () => container_to("intend_open")
    par.replaceChildren(div, but1, document.createElement("br"), but2, document.createElement("br"), but3)
}
function setting_load(par) { // 设置
    let div = createQElement("div", { id: "checker", className: "textarea-ink" })
    div.append(
        ...append_setting_input("设置用户名", { id: "set-username", type: "text", size: "10", value: "Anonymous" }),
        createQElement("button", {
            innerText: "确认", onclick: () => setting["username"] = gid("set-username").value
        })
    )
    for (let i of setting_chs) {
        let t = setting[i[1]]
        let desc = document.createElement("span")
        desc.innerText = i[0]
        let _d = document.createElement("div")
        _d.className = "d_check"
        let _o = document.createElement("button")
        _o.id = `${i[1]}%o`
        _o.className = "o_check"
        _o.onclick = () => setting_checkbox(i[1])
        _o.style.backgroundColor = t ? "#0078D4" : "#FFFFFF"
        let _i = document.createElement("span")
        _i.id = `${i[1]}%i`
        _i.className = "i_check"
        _i.style.left = t ? "25px" : "5px"
        _i.style.backgroundColor = t ? "#FFFFFF" : "#929292"
        _d.append(_o, _i)
        div.append(document.createElement("br"), desc, _d)
    }
    par.replaceChildren(div)
}
function intend_new_game_load(par) {// 新世界设置
    let div = createQElement("div", { className: "setting-box textarea-ink" })
    div.append(
        ...append_setting_input("输入世界名", { id: "set-worldname", type: "text", size: "8", value: "未命名世界" }),
        ...append_setting_selection("设置模式", { id: "set-mode" }, { "s": "生存", "c": "创造", }),
        ...append_setting_input("输入种子", { id: "set-worldseed", type: "number", size: "8", value: "0" }),
        ...append_setting_selection("设置地形", { id: "set-generator" }, { debug: "调试", _empty: "空", _infmaze: "无限迷宫" }),
        createQElement("button", { type: "submit", form: "newgame", innerText: "创建新世界", onclick: () => new_game() })
    )
    par.replaceChildren(div)
}
function intend_open_load(par) { // 打开存档
    let table = createQElement("table", { id: "savedlist", className: "textarea-ink" })
    par.replaceChildren(table)
}
function game_load(par) { // 主界面
    par.replaceChildren(
        createQElement("div", { id: "zbox", className: "status-hidden" }),
        createQElement("canvas", {
            id: "draw",
            width: 480,
            height: 480,
            onmousemove: function (event) { mousemove(event) },
            onmousedown: function (event) { mousedown(event) },
            onmouseup: function (event) { mouseup(event) },
            onmouseleave: function (event) { mouseleave(event) },
        }),
        createQElement("div", { id: "itms" })
    )
}
function container_to(s, force = false) {
    if (s == curpage && !force) return
    let divbody = gid("container")
    globalThis[s + "_load"].call(null, divbody)
    divbody.classList.replace(curpage + "-page", s + "-page")
    curpage = s
    let t = globalThis[s + "_onload"]
    if (t != undefined) t.call()
}
function zbox_gui2() {
    inputting2 = true
    let zbox = gid("zbox")
    zbox.classList.replace("status-hidden", "status-gui")
    zbox.replaceChildren()
    gid("append").innerText = "-"
    return zbox
}
