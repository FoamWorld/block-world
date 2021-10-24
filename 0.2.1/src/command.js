function split_cmd(s){
    var a=[],t="",quote=false
    for(let i in s){
        if(s[i]==" "&&!quote){
            if(t!=""){
                a.push(t)
                t=""
            }
            continue
        }
        if(s[i]=="`"){
            quote=!quote
        }
        else t+=s[i]
    }
    if(t!="")a.push(t)
    return a
}
function guess_itm(s){
    let i=jump2itm[s]
    if(i!=undefined)s=i
    i=name2itm[s]
    if(i!=undefined)return decode(`(${i})`)
    var t=getblkbystr(s)
    if(t instanceof Block){
        return new ItemFromBlock(t)
    }
    else return t
}
function guess_blk(s){
    return getblkbystr(s)
}
function guess_blkpos(s,t){
    if(s[0]=='~'){
        return Math.floor(t)+Number(s.slice(1))
    }
    else return Number(s)
}
function work_command(s){
    try{
    if(s[0]=="/")s=s.substr(1)
    var t=split_cmd(s)
    let cn=t[0]
    t.popfirst()
    let cnc=globalThis["cmd_"+cn]
    if(cnc==undefined){
        throw new Error("未知指令"+cn)
    }
    else cnc.call(null,...t)
    }
    catch(e){
        info_log(e,"red")
    }
}
function cmd_clear(){document.getElementById("event").innerHTML=""}
function cmd_eval(i){eval(i)}
function cmd_fill(...t){
    let lx=guess_blkpos(t[0],ply.x),ly=guess_blkpos(t[1],ply.y)
    let rx=guess_blkpos(t[2],ply.x),ry=guess_blkpos(t[3],ply.y)
    if(lx>rx){let t=lx;lx=rx;rx=t;}
    if(ly>ry){let t=ly;ly=ry;ry=t;}
    let b=guess_blk(t[4])
    for(let i=lx;i<=rx;i++){
        for(let j=ly;j<=ry;j++){
            makeblk(i,j,b)
        }
    }
}
function cmd_gamemode(m){setgamemode(m)}
function cmd_give(i){ply.give(guess_itm(i))}
function cmd_say(s){info_log(setting["username"]+": "+s,"blue")}
function cmd_seed(){info_log(localsetting["seed"])}
function cmd_show(i){info_log(encode(eval(i)))}
function cmd_function(n,s){localsetting["cmdf"][n]=s}
function cmd_call(n){eval(localsetting["cmdf"][n])}
