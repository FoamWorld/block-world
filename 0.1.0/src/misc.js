var chosen_tab=0
var setting={ // 泛设置
    "auto_save":true,
    "show_event":true,
    "show_help":true,
    "username":"匿名",
}
var localsetting={ // 世界设置
    "chosen_itm":"1",
    "mode":"c",
    "seed":0,
    "step":0.3,
    "type":"debug",
    "worldname":"未命名",
}
// 方向
const direx=[0 ,1,0,-1]
const direy=[-1,0,1,0 ]
// 可设置种子的随机数(from C++)
var srand=0
function rand(){
    srand=rem(srand*1103515245+12345,0xffffffff)
    return Math.floor(srand/65536%32768)
}
// 更好地求余
function rem(n,p){
    var t=n%p
    return t<0 ? t+p : t
}
// 快速生成数组
function arrayof(l,r,f){
    var s=[]
    for(var i=l;i<=r;i++){
        s[i]=f() // 不重复生成会变成引用
    }
    return s
}
// js引用似乎不能改变类型，于是我整出了这玩意……
class Wrap{
    constructor(v){this.v=v}
}
// 深拷贝
function clone(obj){
    if(obj==null||typeof(obj)!="object")return obj
    if(obj instanceof Array){
        var copy=[]
        for(var i in obj)copy[i]=clone(obj[i])
        return copy
    }
    if(obj instanceof Object){
        var props=Object.getOwnPropertyDescriptors(obj)
        for(var prop in props){
            props[prop].value=clone(props[prop].value)
        }
        return Object.create(Object.getPrototypeOf(obj),props)
    }
    throw new Error("Failed To Clone")
}
// js连这都没
class Pair{
    constructor(a,b){this.a=a;this.b=b}
}
// 信息区api
function info_log(s,color){
    if(color==undefined)document.getElementById("event").innerHTML+="<span>"+s+"</span><hr />"
    else document.getElementById("event").innerHTML+=`<span style="color:${color}">${s}</span><hr />`
}
function info_help(s){
    if(setting["show_help"]){
        info_log(s)
        tab_to(2)
    }
}
function info_event(s){
    if(setting["show_event"]){
        info_log(s)
        tab_to(2)
    }
}