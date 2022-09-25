function back_to_menu(){
    if(curpage=="game")end_game()
    else if(curpage!="menu")gui_to("menu")
}
// setting
const setting_chs=[
    ["显示事件","show-event"],
    ["显示帮助","show-help"],
]
function setting_checkbox(id){
    setting[id]=!setting[id]
    let t=setting[id]
    gid(id+"%o").style.background=t?"#0078D4":"#FFFFFF"
    gid(id+"%i").style.left=t?"25px":"5px"
    gid(id+"%i").style.background=t?"#FFFFFF":"#929292"
}
// intend_open
var saved_li
function intend_open_onload(){
    saved_li=[]
    let l=localStorage.length
    for(let i=0;i<l;i++){
        var s=localStorage.key(i)
        if(s.endsWith("%v")){
            saved_li.push(s.slice(0,-2))
        }
    }
    intend_open_sl_upd()
}
function intend_open_sl_upd(){
    let s=""
    for(let i of saved_li){
        s+=`<tr id="${i}%r" class="saved_tr"><td onclick="load_saved('${i}')" class="hbu">${i}</td><td class="hbu" onclick="intend_open_sl_del('${i}')">删除</td></tr>`
    }
    gid("savedlist").innerHTML=s
}
function intend_open_sl_del(id){
    gid(id+"%r").remove()
    saved_li.splice(saved_li.indexOf(id),1)
    eraseworld(id)
}
// game
function game_onload(){
    resize()
}
