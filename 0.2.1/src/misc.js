var chosen_tab=0
var setting // 泛设置
var localsetting // 世界设置
const halfpi=Math.PI/2
var bimgs={}
// 方向
const direx=[ 0,1,0,-1,-1, 1,1,-1]
const direy=[-1,0,1, 0,-1,-1,1, 1]
/*
+-------x->
|
|  4 0 5
|  3   1
y  7 2 6
|
v
*/
function left_dir(d){return d==0 ? 3 : d-1}
function right_dir(d){return d==3 ? 0 : d+1}
function opposite(d){return d<2 ? d+2 : d-2}
// 可设置种子的随机数(from C++)
var srand=0
function rand(){
    srand=(srand*1103515245+12345)&0xffffffff
    return srand>>16&32767
}
var gsrand=0 // 宏用
function grand(){
    gsrand=(gsrand*1103515245+12345)&0xffffffff
    return gsrand>>16&32767
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
        for(var i of obj)copy[i]=clone(i)
        return copy
    }
    if(obj instanceof Object){
        var props=Object.getOwnPropertyDescriptors(obj)
        let l=props.length
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
Array.prototype.popfirst=function(){
    this.splice(0,1)
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
function drawRot(ctx,img,x,y,w,h,rad){ // 画旋转的图片
    ctx.translate(x+w/2,y+h/2)
    ctx.rotate(rad)
    ctx.drawImage(img,-w/2,-h/2,w,h)
    ctx.rotate(-rad)
    ctx.translate(-x-w/2,-y-h/2)
}
function srcimg(s){
    let i=new Image()
    i.src=s
    return i
}
function insertsto(b,d){
    for(let i in d){
        b[i]=d[i]
    }
}
// 杂物
function envlight(){
    // 当前0.1s一帧，设计一昼夜16384帧，即[27min 18.4s]
    let t=localsetting["t"]&16383
    // round(sin(t/8192*π)*8+7.5)
    let te=(t>8191) ? t-8192 : t
    if(te<327||te>7865)te=0
    else if(te<659||te>7533)te=1
    else if(te<1003||te>7189)te=2
    else if(te<1366||te>6826)te=3
    else if(te<1761||te>6431)te=4
    else if(te<2212||te>5980)te=5
    else if(te<2779||te>5413)te=6
    else te=7
    return (t>8192)?7-te:te+8
}
function setgamemode(s){
    if(s=="c")insertsto(localsetting,{
        "break-all":true,
        "inf-item":true,
        "inf-use":true,
        "reach-all":true,
    })
    else if(s=="s")insertsto(localsetting,{
        "break-all":false,
        "inf-item":false,
        "inf-use":false,
        "reach-all":false,
    })
}
