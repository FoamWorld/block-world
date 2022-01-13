const menu_html=`
<div id="fw_title"><span>Foam World</span></div>
<button onclick="gui_to('setting')" class="menu_button">设置</button><br />
<button onclick="gui_to('intend_new_game')" class="menu_button">创建新世界</button><br />
<button onclick="gui_to('intend_open')" class="menu_button">打开存档</button>
` // 主菜单
const setting_html=`
<span>设置用户名</span><input type="text" id="set-username" size="8" value="匿名"><button onclick="setting['username']=gid('set-username').value">确认</button><br />
<div id="checker"></div>
` // 各种设置
const intend_new_game_html=`
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
` // 新世界设置
const intend_open_html=`
<table id="savedlist"></table>
` // 打开存档
const game_html=`
<canvas id="draw" width="480" height="480" onmousemove="mousemove(event)" onmousedown="mousedown(event)" onmouseup="mouseup(event)" onmouseleave="mouseleave()"></canvas>
<div id="info">
    <div id="event"></div>
    <input id="command" type="text" size="1" disabled="disabled"></input>
</div>
<div id="gui"></div>
<div id="itms"></div>
` // 主界面
function gui_to(s){
    gid("body").innerHTML=eval(s+"_html")
    gid("body").className=s+"_page"
    curpage=s
    let t=globalThis[s+"_onload"]
    if(t!=undefined)t.call()
}
