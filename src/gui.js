function createQElement(tagname, deco) {
    let tag = document.createElement(tagname)
    for (let k of Object.keys(deco)) tag[k] = deco[k]
    return tag
}

function menu_load(par) { // 主菜单
    let div = createQElement("div", { id: "fw_title" })
    let span = createQElement("span", { innerText: "Foam World" })
    div.appendChild(span)
    let but1 = document.createElement("button")
    but1.innerText = "设置"
    but1.className = "menu_button"
    but1.onclick = function () { container_to("setting") }
    let but2 = document.createElement("button")
    but2.innerText = "创建新世界"
    but2.className = "menu_button"
    but2.onclick = function () { container_to("intend_new_game") }
    let but3 = document.createElement("button")
    but3.innerText = "打开存档"
    but3.className = "menu_button"
    but3.onclick = function () { container_to("intend_open") }
    par.replaceChildren(div, but1, document.createElement("br"), but2, document.createElement("br"), but3)
}
function setting_load(par) { // 设置
    let div = createQElement("div", {id: "checker", className : "textarea-ink"})
    div.append(
        createQElement("span", {innerText:"设置用户名"}),
        createQElement("input", {type: "text", id: "set-username", size: "10", value: "Anonymous"})
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
        _o.onclick = function () { setting_checkbox(i[1]) }
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
        createQElement("span", { innerText: "输入世界名" }),
        createQElement("input", { type: "text", id: "set-worldname", size: "8", value: "未命名" }),
        document.createElement("br"),
        createQElement("span", { innerText: "设置模式" }),
        createQElement("select", { id: "mode", innerHTML: `<option value="s" selected="selected">正常</option><option value="c">神性</option>` }),
        document.createElement("br"),
        createQElement("span", { innerText: "输入种子" }),
        createQElement("input", { type: "number", id: "set-worldseed", size: "8", value: "0" }),
        document.createElement("br"),
        createQElement("span", { innerText: "设置地形" }),
        createQElement("select", { id: "generator", innerHTML: `<option value="debug" selected="selected">默认</option><option value="_infmaze">无限迷宫</option>` }),
        document.createElement("br"),
        createQElement("button", { type: "submit", form: "newgame", innerText: "创建新世界", onclick: function () { new_game() } })
    )
    par.replaceChildren(div)
}
function intend_open_load(par) { // 打开存档
    let table = createQElement("table", { id: "savedlist", className: "textarea-ink" })
    par.replaceChildren(table)
}
function game_load(par) { // 主界面
    let cvs = createQElement("canvas", {
        id: "draw",
        width: 480,
        height: 480,
        onmousemove: function (event) { mousemove(event) },
        onmousedown: function (event) { mousedown(event) },
        onmouseup: function (event) { mouseup(event) },
        onmouseleave: function (event) { mouseleave(event) },
    })
    let itms = createQElement("div", { id: "itms" })
    let over = createQElement("div", { id: "zbox", className: "box-over status-hidden" })
    par.replaceChildren(cvs, itms, over)
}
function container_to(s, force = false) {
    if (s == curpage && !force) return
    let divbody = gid("container")
    globalThis[s + "_load"].call(null, divbody)
    divbody.classList.replace(curpage + "_page", s + "_page")
    curpage = s
    let t = globalThis[s + "_onload"]
    if (t != undefined) t.call()
}
function zbox_gui2(){
    inputting2 = true
    let zbox = gid("zbox")
    zbox.classList.replace("status-hidden", "status-gui")
    zbox.replaceChildren()
    gid("append").innerText = "-"
    return zbox
}
