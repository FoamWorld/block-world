class Entity{
    constructor(x,y,vx,vy){
        this.x=x
        this.y=y
        this.vx=vx
        this.vy=vy
    }
}
var pimg=new Image()
pimg.src="data/skin/default.png"
class Player extends Entity{
    constructor(x,y,vx=0,vy=0,h=20,itms=arrayof(1,8,function(){return new Wrap(new EmptyItem())})){
        super(x,y,vx,vy)
        this.h=h
        itms[0]=undefined
        this.itms=itms
    }
    initgui(){
        var s=""
        for(var i=-1;i>=-8;i--){
            s+=item_board(i,"it")
        }
        document.getElementById("itms").innerHTML=s
    }
    changechosen(to){
        if(localsetting["chosen_itm"]==to)return
        document.getElementById("-"+localsetting["chosen_itm"]).style.border="1px solid silver"
        document.getElementById("-"+to).style.border="2px solid lightcyan"
        localsetting["chosen_itm"]=to
    }
    updategui(){
        for(var i=1;i<=8;i++){
            var t=this.itms[i].v.showurl()
            if(t==undefined)document.getElementById(-i).src="data/gui/empty.png"
            else document.getElementById(-i).src=t
            if(i==localsetting["chosen_itm"])document.getElementById(-i).style.border="2px solid lightcyan"
            else document.getElementById(-i).style.border="1px solid silver"
            global_ref_itms[-i]=this.itms[i]
        }
    }
    show(x,y){draw.drawImage(pimg,x*bsz,y*bsz,bsz-4,bsz-4)}
    move(x,y){
        var v=new CircleCollisionBox(this.x,this.y,0.4375).move_to_blks(ndim,x,y)
        this.x+=v.a
        this.y+=v.b
        if(Math.hypot(this.x-guix,this.y-guiy)>3){
            ndim.blk(guix,guiy).onguiclose()
            info_help("你远离了打开的交互方块")
        }
    }
    give(it){
        for(let i=1;i<=8;i++){
            if(this.itms[i].v instanceof EmptyItem){
                this.itms[i].v=it
                this.updategui()
                return true
            }
        }
        return false
    }
}