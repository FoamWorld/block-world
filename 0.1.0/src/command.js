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
    if(s[0]!='(')s="("+s+")"
    var t=decode(s)
    if(t instanceof Block){
        return new ItemFromBlock(t)
    }
    else return t
}
function guess_blk(s){
    if(s[0]!='(')s="("+s+")"
    return decode(s)
}
function guess_blkpos(s,t){
    if(s[0]=='~'){
        return Math.floor(t)+Number(s.slice(1))
    }
    else return Number(s)
}
function work_command(s){
    try{
    var t=split_cmd(s)
    if(t[0]=="clear")document.getElementById("event").innerHTML=""
    else if(t[0]=="eval")eval(t[1])
    else if(t[0]=="say")info_log(setting["username"]+": "+t[1],"blue")
    else if(t[0]=="gamemode")localsetting["mode"]=t[1]
    else if(t[0]=="seed")info_log(localsetting["seed"])
    else if(t[0]=="give"){
        ply.give(guess_itm(t[1]))
    }
    else if(t[0]=="fill"){
        let lx=guess_blkpos(t[1],ply.x)
        let ly=guess_blkpos(t[2],ply.y)
        let rx=guess_blkpos(t[3],ply.x)
        let ry=guess_blkpos(t[4],ply.y)
        if(lx>rx){let t=lx;lx=rx;rx=t;}
        if(ly>ry){let t=ly;ly=ry;ry=t;}
        let b=guess_blk(t[5])
        for(let i=lx;i<=rx;i++){
            for(let j=ly;j<=ry;j++){
                ndim.setblk(i,j,b)
            }
        }
    }
    }
    catch(e){
        info_log(e,"red")
    }
}