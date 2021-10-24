function back_to_menu(){
    if(curpage=="")end_game()
    else if(curpage!="menu")gui_to("menu")
}
// setting
const setting_chs=[
    ["显示事件","show-event"],
    ["显示帮助","show-help"],
]
function setting_onload(){
    let s=""
    for(let i of setting_chs){
        s+=`<span>${i[0]}</span><div class="d_check"><button class="o_check" onclick="setting_checkbox('${i[1]}')" id="${i[1]}%o"></button><span class="i_check" id="${i[1]}%i"></span></div><br />`
    }
    document.getElementById("checker").innerHTML=s
    for(let i of setting_chs){
        let t=setting[i[1]]
        document.getElementById(i[1]+"%o").style.background=t?"#0078D4":"#FFFFFF"
        document.getElementById(i[1]+"%i").style.left=t?"25px":"5px"
        document.getElementById(i[1]+"%i").style.background=t?"#FFFFFF":"#929292"
    }
}
function setting_checkbox(id){
    setting[id]=!setting[id]
    let t=setting[id]
    document.getElementById(id+"%o").style.background=t?"#0078D4":"#FFFFFF"
    document.getElementById(id+"%i").style.left=t?"25px":"5px"
    document.getElementById(id+"%i").style.background=t?"#FFFFFF":"#929292"
}
// intend_open
var li=[]
function intend_open_onload(){
    let l=localStorage.length
    for(let i=0;i<l;i++){
        var s=localStorage.key(i)
        if(s.endsWith("%v")){
            li.push(s.slice(0,-2))
        }
    }
    intend_open_sl_upd()
}
function intend_open_sl_upd(){
    let s=""
    for(let i of li){
        s+=`<tr id="${i}%r"><td onclick="load_saved('${i}')" class="hbu">${i}</td><td class="hbu" onclick="intend_open_sl_del('${i}')">删除</td></tr>`
    }
    document.getElementById("savedlist").innerHTML=s
}
function intend_open_sl_del(id){
    document.getElementById(id+"%r").remove()
    li.splice(li.indexOf(id),1)
    eraseworld(id)
}
