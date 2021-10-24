// 顶层数据
const VERSION="0.1.0"
var started=false
var pause=true
var inputting=false
var stuck=false
var draw
var manager_interval
var mousex,mousey
var mouseup_done=3,tempx,tempy // 0=待检测 3=无需检测 1=失败 2=成功
var guix=NaN,guiy=NaN // 当前GUI坐标
// 初始化
load_resources()
if(localStorage.getItem("%setting")!=null)setting=JSON.parse(localStorage.getItem("%setting"))
gui_to("menu")

// 顶层函数
function list_saved(){ // 载入intend_open_html时
    document.getElementById("body").className="intend_open_page"
    let l=localStorage.length,li=""
    for(let i=0;i<l;i++){
        var s=localStorage.key(i)
        if(s.endsWith("%v")){
            li+=`<div class="saved_list" onclick="load_saved('${s.slice(0,-2)}')">${s.slice(0,-2)} v${localStorage.getItem(s)}</div>`
        }
    }
    document.getElementById("body").innerHTML=li+intend_open_html
}
function load_saved(n){
    loadworld(n)
    started=true
    gui_to("game")
    draw=document.getElementById("draw").getContext("2d")
    initdim()
    ply.initgui()
    ply.updategui()
    pregenerate()
    showgame()
    info_help("按p开始")
}
function new_game(){ // 载入game_html时
    started=true
    localsetting["worldname"]=document.getElementById("set-worldname").value
    localsetting["seed"]=parseInt(document.getElementById("set-worldseed").value)
    if(isNaN(localsetting["seed"]))localsetting["seed"]=0
    gui_to("game")
    draw=document.getElementById("draw").getContext("2d")
    initdim()
    ply.initgui()
    ply.updategui()
    pregenerate()
    showgame()
    info_help("按p开始")
}
function end_game(){
    started=false
    saveworld()
    saved={}
    gui_to("menu")
}
// 流程
function tick(){
    pregenerate()
    showgame()
    updategame()
}
function tick_manager(){ // 一套防止卡住产生大量线程的机制
    if(stuck){
        pause=true
        force_stop()
        return
    }
    stuck=true
    tick()
    stuck=false
}
function force_stop(){
    clearInterval(manager_interval)
    document.getElementsByTagName("body").innerHTML="<h1>页面已强制停止</h1>"
}
// 各类顶层事件
function press(e){
    if(!started)return
    var k=e.key
    if(inputting){
        if(k=="Enter"){
            work_command(document.getElementById("command").value)
            document.getElementById("command").value=""
            inputting=false
            document.getElementById("command").disabled="disabled"
        }
        if(k=="/"){
            inputting=false
            document.getElementById("command").disabled="disabled"
        }
        return
    }
    if(k=="p"){
        if(pause){
            info_event("已取消暂停")
            pause=false
            manager_interval=setInterval(tick_manager,100)
        }
        else{
            info_event("已暂停")
            pause=true
            clearInterval(manager_interval)
        }
        return
    }
    if(k=="/"){
        inputting=true
        document.getElementById("command").removeAttribute("disabled")
        tab_to(2)
    }
    if(pause)return
    if(k=="w")ply.move(0,-localsetting["step"])
    else if(k=="a")ply.move(-localsetting["step"],0)
    else if(k=="s")ply.move(0,localsetting["step"])
    else if(k=="d")ply.move(localsetting["step"],0)
    else if(k>="1"&&k<="8")ply.changechosen(k)
    else if(k=="e"){
        var p=pos_by_showpos(mousex,mousey)
        var t=ndim.blk(p.a,p.b)
        if(!isNaN(guix)){
            ndim.blk(guix,guiy).onguiclose()
            guix=NaN
            guiy=NaN
        }
        if(t.gui!=undefined){
            if(Math.hypot(ply.x-t.a-0.5,ply.y-t.b-0.5)>3){
                info_help("够不到")
                return
            }
            guix=p.a
            guiy=p.b
            t.gui()
            tab_to(1)
        }
    }
}
function mousemove(e){
    mousex=e.layerX
    mousey=e.layerY
}
function mousedown(e){
    if(pause)return
    var t=pos_by_showpos(e.layerX,e.layerY)
    if(Math.hypot(ply.x-t.a-0.5,ply.y-t.b-0.5)>3){
        info_help("够不到")
        return
    }
    tempx=t.a
    tempy=t.b
    mouseup_done=0
    if(ndim.blk(t.a,t.b) instanceof NotSolid){
        var interval=setInterval(function(){
            if(mouseup_done!=0){
                clearInterval(interval);
                if(mouseup_done==2)userfill(t.a,t.b)
            }
        });
    }
    else{
        var te=ndim.blk(t.a,t.b).hard()
        var pe=ply.itms[localsetting["chosen_itm"]].v.digstrength()
        var time=1
        if(localsetting["mode"]!='c'){
            if(te==-1||te-pe>=40){
                mouseup_done=3
                info_help("无法摧毁")
            }
            time=(pe-te>=40) ? 1 : (te-pe+40)*5
        }
        var count=0
        var interval=setInterval(function(){
            count++
            if(mouseup_done!=0){
                clearInterval(interval);
                if(mouseup_done==2){
                    if(count>=time)userdestroy(t.a,t.b)
                    else info_help("挖掘时间不足")
                }
            }
        },10);
    }
}
function mouseup(e){
    if(mouseup_done==3)return
    var t=pos_by_showpos(e.layerX,e.layerY)
    if(t.a!=tempx||t.b!=tempy){ // 我看看谁会激活这玩意
        mouseup_done=1
        info_help("不要边点边移")
        return
    }
    mouseup_done=2
}
function userfill(x,y){
    var i=ply.itms[localsetting["chosen_itm"]].v
    if(i instanceof ItemFromBlock){
        ndim.setblk(x,y,i.b)
        if(localsetting["mode"]!="c"){
            ply.itms[localsetting["chosen_itm"]].v=new EmptyItem()
            ply.updategui()
        }
    }
    mouseup_done=3
}
function userdestroy(x,y){
    ndim.blk(x,y).ondestroy()
    ndim.setblk(x,y,new Air())
    mouseup_done=3
}
// UI
function tab_to(x){
    var t=chosen_tab
    if(x==t)return
    document.getElementById("ch_"+t).className="unselected"
    document.getElementById("ch_"+x).className="selected"
    document.getElementById(["setting","gui","info"][t]).style.display="none"
    document.getElementById(["setting","gui","info"][x]).style.display="block"
    chosen_tab=x
}
// 存储
function savegame(){
    localStorage.setItem("%setting",JSON.stringify(setting))
    if(setting["auto_save"]){
        if(saved!={})saveworld()
    }
}