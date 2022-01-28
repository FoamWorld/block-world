// 顶层数据
const VERSION="0.3.0-alert"
var manager_interval // 控制流程函数
var mousex,mousey // 当前鼠标canvas坐标
var tempx,tempy
var curpage="menu" // 当前页面

var started, // 已开始
pause, // 已暂停
inputting, // 指令正在输入
inputting2, // GUI正在输入
stuck, // 卡住
draw, // 绘图句柄
mouseup_done, // 0=待检测 3=无需检测 1=失败 2=成功
guix,guiy, // 当前GUI坐标 [无:guix=NaN]
nit // 打开的物品GUI [无:nit=null]
// 初始化
bimgs["dig0"]=srcimg("data/gui/dig0.png")
bimgs["dig1"]=srcimg("data/gui/dig1.png")
bimgs["dig2"]=srcimg("data/gui/dig2.png")
bimgs["notexture"]=srcimg("data/gui/notexture.png")
if(localStorage.getItem("%setting")!=null)setting=JSON.parse(localStorage.getItem("%setting"))
else setting={
    "auto_save":true,
    "show-event":true,
    "show-help":true,
    "st":{}, // 结构保存
    "username":"匿名",
}
gui_to("menu")
let inf_itemer=new 无限物品表()

// 顶层函数
function initgame(){
    gui_to("game")
    started=true
    pause=true
    inputting=false
    inputting2=false
    stuck=false
    draw=gid("draw").getContext("2d")
    mouseup_done=3
    guix=NaN
    nit=null
    initdim()
    ply.initgui()
    pregenerate()
    show_after_reg={}
    show_after=[]
    showgame()
    info_help("按p开始")
}
function load_saved(n){
    loadworld(n)
    initgame()
}
function new_game(){ // 载入game_html时
    saved={}
    var se=parseInt(gid("set-worldseed").value)
    localsetting={ // 世界设置
        "chosen_itm":0,
        "cmdf":{},
        "focus_mouse":true,
        "l":"zh_CN",
        "seed":Number.isNaN(se) ? 0 : se,
        "step":0.3,
        "t":0,
        "tmove":true,
        "type":gid("generator").value,
        "worldname":gid("set-worldname").value,
    }
    setgamemode(gid("mode").value)
    initgenerator()
    initgame()
}
function end_game(){
    clearInterval(manager_interval)
    saveworld()
    saved={}
    gui_to("menu")
}
function quit_game(){
    let t=window.confirm("确定不保存就退出？")
    if(!t)return
    clearInterval(manager_interval)
    saved={}
    gui_to("menu")
}
// 流程
function tick(){
    pregenerate()
    showgame()
    updategame()
    if(localsetting["tmove"])localsetting["t"]++
}
function tick_manager(){
    // todo:后台检测死循环
    tick()
}
// 各类顶层事件
function press(e){
    if(!started)return
    var c=e.ctrlKey
    if(inputting2){
        if(e.code=='KeyQ'&&c){
            if(nit!=null){nit.onunuse();nit=undefined}
            if(!Number.isNaN(guix))ndim.blk(guix,guiy).onguiclose()
            gid("gui").innerHTML=""
        }
        return
    }
    var k=e.key
    if(inputting){
        if(k=="Enter"){
            work_command(gid("command").value)
            gid("command").value=""
            inputting=false
            gid("command").disabled="disabled"
        }
        return
    }
    if(k=="p"||k=="P"){
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
        gid("command").removeAttribute("disabled")
    }
    if(pause)return
    if(k>="1"&&k<="8")ply.changechosen(k-'1')
    else{
        let pr=globalThis[c?"press_ctrl_":"press_"+k]
        if(pr!=undefined)pr.call()
    }
}
function press_w(){
    let st=ply.stepl()
    ply.move(st*Math.sin(ply.θ),-st*Math.cos(ply.θ))
}
function press_a(){
    ply.θ-=Math.PI/12
}
function press_s(){
    let st=ply.stepl()
    ply.move(-st*Math.sin(ply.θ),st*Math.cos(ply.θ))
}
function press_d(){
    ply.θ+=Math.PI/12
}
function press_W(){ply.move(0,-ply.stepl())}
function press_A(){ply.move(-ply.stepl(),0)}
function press_S(){ply.move(0,ply.stepl())}
function press_D(){ply.move(ply.stepl(),0)}
function press_E(){
    closeguis()
    if(localsetting["inf-item"]){
        nit=inf_itemer
        inf_itemer.onuse()
    }
}
function press_e(){
    closeguis()
    if(Number.isNaN(mousex)||Number.isNaN(mousey))return
    var p=pos_by_showpos(mousex,mousey)
    var t=ndim.blk(p.a,p.b)
    if(t.constructor.hasgui){
        if(!ply.reachable(p.a,p.b))return
        guix=p.a
        guiy=p.b
        if(nit!==null){nit.onunuse();nit=null}
        t.onguiopen()
    }
}
function press_f(){
    closeguis()
    if(nit!==null){nit.onunuse();nit=null}
    let t=ply.its.i[localsetting["chosen_itm"]]
    if(t.constructor.canuse){
        if(!t.constructor.useonce)nit=t
        t.onuse()
    }
}
function press_I(){
    info_log(`时间${localsetting["t"]&16383}`,"yellow")
    if(!(Number.isNaN(mousex)||Number.isNaN(mousey))){
        let t=pos_by_showpos(mousex,mousey)
        info_log(`指向(${t.a},${t.b})`,"yellow")
    }
    info_log(`玩家(${ply.x},${ply.y})`,"yellow")
}
function mousemove(e){
    mousex=e.layerX
    mousey=e.layerY
    if(pause)return
    if(!(Number.isNaN(mousex)||Number.isNaN(mousey))&&localsetting["focus_mouse"]){
        ply.θ=Math.atan2(mousex-240,240-mousey)
    }
}
function mouseleave(){
    mousex=NaN
}
function mousedown(e){
    if(pause)return
    var t=pos_by_showpos(e.layerX,e.layerY)
    if(!ply.reachable(t.a,t.b))return
    tempx=t.a
    tempy=t.b
    if(ndim.blk(t.a,t.b).constructor.bk){
        mouseup_done=3
        userfill(t.a,t.b)
    }
    else{
        let tb=ndim.blk(t.a,t.b)
        var te=tb.hard()
        var pe=ply.its.i[localsetting["chosen_itm"]].strength(tb)
        var time=0
        if(!localsetting["break-all"]){
            if(te-pe>15){
                info_help("无法摧毁")
                return
            }
            time=(pe-te>=20) ? 0 : (te-pe+20)*3
        }
        if(time==0){
            userdestroy(t.a,t.b)
            return
        }
        mouseup_done=0
        var count=0
        let p=showpos_by_pos(t.a,t.b)
        show_after_reg["d"]=`draw.drawImage(bimgs["dig0"],${p.a},${p.b},bsz,bsz)`
        var interval=setInterval(function(){
            count++
            if(mouseup_done!=0){
                clearInterval(interval);
                if(mouseup_done==2){
                    if(count>time*3)userdestroy(t.a,t.b)
                    else{
                        info_help("挖掘时间不足")
                    }
                }
                delete show_after_reg["d"]
            }
            else if(count>time*3){
                clearInterval(interval)
                mouseup_done=3
                userdestroy(t.a,t.b)
                delete show_after_reg["d"]
            }
            else{
                if(count==time*2)show_after_reg["d"]=`draw.drawImage(bimgs["dig2"],${p.a},${p.b},bsz,bsz)`
                else if(count==time)show_after_reg["d"]=`draw.drawImage(bimgs["dig1"],${p.a},${p.b},bsz,bsz)`
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
    var i=ply.its.i[localsetting["chosen_itm"]]
    let b=i.formblock()
    if(b!==null){
        makeblk(x,y,b,true)
        if(!localsetting["inf-item"]){
            ply.its.i.reduce(localsetting["chosen_itm"],1)
            ply.updategui()
        }
    }
    mouseup_done=3
}
function userdestroy(x,y){
    if(guix==x&&guiy==y)closebgui()
    makeblk(x,y,new 空气())
    mouseup_done=3
}
// UI
function closebgui(){
    ndim.blk(guix,guiy).onguiclose()
    guix=NaN
    gid("gui").innerHTML=""
}
function closeguis(){
    if(!Number.isNaN(guix)){
        ndim.blk(guix,guiy).onguiclose()
        guix=NaN
    }
    if(nit!==null){
        nit.onunuse()
        nit=null
    }
    gid("gui").innerHTML=""
    inputting2=false
}
function resize(){
    let x=document.body.clientWidth
    if(curpage!="game")return
    let m=x>>1
    gid("draw").style.left=(m-240)+"px"
    gid("itms").style.left=(m-240)+"px"
    gid("info").style.left=(m-436)+"px"
    gid("gui").style.left=(m+244)+"px"
}
// 存储
function savegame(){
    localStorage.setItem("%setting",JSON.stringify(setting))
    if(setting["auto_save"]&&curpage=="game")saveworld()
}
// 用于测试
function rrrrrr(){
    localStorage.clear()
    savegame=null
}
