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
class Player{
    constructor(x,y,θ=0,h=20,itms=arrayof(1,8,function(){return new Wrap(new EmptyItem())})){
        this.x=x
        this.y=y
        this.θ=θ
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
            this.itms[i].v.showit(document.getElementById(-i).getContext("2d"))
            if(i==localsetting["chosen_itm"])document.getElementById(-i).style.border="2px solid lightcyan"
            else document.getElementById(-i).style.border="1px solid silver"
            global_ref_itms[-i]=this.itms[i]
        }
    }
    initcregui(){}
    show(){drawRot(draw,pimg,226,226,28,28,this.θ)}
    stepl(){return localsetting["step"]}
    move(x,y){
        var v=new CircleCollisionBox(this.x,this.y,0.4375).move_to_blks(ndim,x,y)
        this.x+=v.a
        this.y+=v.b
        if(Math.hypot(this.x-guix,this.y-guiy)>3){
            ndim.blk(guix,guiy).onguiclose()
            guix=NaN
            guiy=NaN
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
    reachable(x,y){
        if(localsetting["reach-all"])return true
        if(Math.hypot(this.x-x,this.y-y)>4){
            info_help("离得太远了")
            return false
        }
        let c=new SegCollisionBox(x,y,this.x,this.y)
        let fx=Math.floor(x),fy=Math.floor(y)
        let lx=Math.min(fx,Math.floor(this.x)),rx=Math.max(fx,Math.floor(this.x))
        let ly=Math.min(fy,Math.floor(this.y)),ry=Math.max(fy,Math.floor(this.y))
        for(let i=lx;i<=rx;i++){
            for(let j=ly;j<=ry;j++){
                if(i==fx&&j==fy)continue
                if(c.collide_with_blk(ndim.blk(i,j).colbox(i,j))){
                    info_help("被挡住了")
                    return false
                }
            }
        }
        return true
    }
}