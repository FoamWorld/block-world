function menu_load(par){ // 主菜单
    let div = document.createElement("div")
    div.id = "fw_title"
    let span = document.createElement("span")
    span.innerText = "Foam World"
    div.appendChild(span)
    let but1 = document.createElement("button")
    but1.innerText = "设置"
    but1.className = "menu_button"
    but1.onclick = function(){gui_to("setting")}
    let but2 = document.createElement("button")
    but2.innerText = "创建新世界"
    but2.className = "menu_button"
    but2.onclick = function(){gui_to("intend_new_game")}
    let but3 = document.createElement("button")
    but3.innerText = "打开存档"
    but3.className = "menu_button"
    but3.onclick = function(){gui_to("intend_open")}
    par.replaceChildren(div, but1, document.createElement("br"), but2, document.createElement("br"), but3)
}
function setting_load(par){ // 设置
    let span = document.createElement("span")
    span.innerText = "设置用户名"
    let input = document.createElement("input")
    input.type = "text"
    input.id = "set-username"
    input.size = "8"
    input.value = "匿名"
    // <button onclick="setting['username']=gid('set-username').value">确认</button><br />
    let div = document.createElement("div")
    div.id = "checker"
    for(let i of setting_chs){
        let t = setting[i[1]]
        let desc = document.createElement("span")
        desc.innerText = i[0]
        let _d = document.createElement("div")
        _d.className = "d_check"
        let _o = document.createElement("button")
        _o.id = `${i[1]}%o`
        _o.className = "o_check"
        _o.onclick = function(){setting_checkbox(i[1])}
        _o.style.backgroundColor = t ? "#0078D4" : "#FFFFFF"
        let _i = document.createElement("span")
        _i.id = `${i[1]}%i`
        _i.className = "i_check"
        _i.style.left = t ? "25px" : "5px"
        _i.style.backgroundColor = t ? "#FFFFFF" : "#929292"
        _d.append(_o, _i)
        div.append(desc, _d, document.createElement("br"))
    }
    par.replaceChildren(span, input, div)
}
function intend_new_game_load(par){// 新世界设置
    par.innerHTML = `
<span>输入世界名</span><input type="text" id="set-worldname" size="8" value="未命名"><br />
<span>模式</span><select id="mode">
<option value="s" selected="selected">正常</option>
<option value="c">神性</option>
</select>
<span>输入种子</span><input type="number" id="set-worldseed" size="8" value="0"><br />
<span>地形</span><select id="generator">
<option value="debug" selected="selected">默认</option>
<option value="_infmaze">无限迷宫</option>
</select>
<button onclick="new_game()" type="submit" form="newgame">创建新世界</button><br />
`}
function intend_open_load(par){ // 打开存档
    let table = document.createElement("table")
    table.id = "savedlist"
    par.replaceChildren(table)
}
function game_load(par){ // 主界面
    let cvs = document.createElement("canvas")
    cvs.id = "draw"
    cvs.width = cvs.height = 480
    cvs.onmousemove = function(event){mousemove(event)}
    cvs.onmousedown = function(event){mousedown(event)}
    cvs.onmouseup = function(event){mouseup(event)}
    cvs.onmouseleave = function(event){mouseleave(event)}
    let info = document.createElement("div")
    info.id = "info"
    let event = document.createElement("div")
    event.id = "event"
    let input = document.createElement("input")
    input.id = "command"
    input.type = "text"
    input.size = 1
    info.disabled = true
    info.append(event, input)
    let gui = document.createElement("div")
    gui.id = "gui"
    let itms = document.createElement("div")
    itms.id = "itms"
    par.replaceChildren(cvs, info, gui, itms)
}
function gui_to(s){
    let divbody = document.getElementById("body")
    globalThis[s+"_load"].call(null, divbody)
    divbody.className=s+"_page"
    curpage=s
    let t=globalThis[s+"_onload"]
    if(t!=undefined)t.call()
}
