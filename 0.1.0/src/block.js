const bsz=32
var blknames=[ // 正常方块
    "Air","StarRock","Box","Fluorite","Water","Lava",
]
var bimgn=[
    "Air","StarRock","Box","Fluorite",
]
var bimgs={}
function load_resources(){ // 加载方块材质
    for(let i in bimgn){
        var s=new Image()
        s.src="data/img/"+bimgn[i]+".png"
        bimgs[bimgn[i]]=s
    }
}
class Block{
    show(x,y){draw.drawImage(bimgs[this.constructor.name],x*bsz,y*bsz,bsz,bsz)}
    showurl(){
        if(bimgn.includes(this.constructor.name))return "data/img/"+this.constructor.name+".png"
        else return "data/gui/notexture.png"
    }
    light(){return 0}
    onguiclose(){
        document.getElementById("gui").innerHTML=""
        guix=NaN
        guiy=NaN
    }
    ondestroy(){}
    /*
    show(x,y) canvas显示
    showurl() 用于物品显示
    colbox(x,y) 碰撞箱
    hard() 硬度
    light() 亮度
    gui() 初始化GUI
    updategui() 更新GUI
事件属性
    ondestroy(x,y) 被摧毁时
    */
}
class NotSolid extends Block{
    colbox(x,y){return new EmptyCollisionBox()}
    hard(){return 0}
}
class Air extends NotSolid{
}
class StarRock extends Block{
    colbox(x,y){return new BCollisionBox(x,y,x+1,y+1)}
    hard(){return -1}
}
class Box extends Block{
    constructor(its=arrayof(1,16,function(){return new Wrap(new EmptyItem())})){
        super()
        this.its=its
    }
    colbox(x,y){return new BCollisionBox(x,y,x+1,y+1)}
    hard(){return 25}
    gui(){
        var s=""
        for(var i=1;i<=16;i++){
            s+=item_board(i,"it0")
            if(i==8)s+="<br />"
        }
        document.getElementById("gui").innerHTML=s
        this.updategui()
    }
    updategui(){
        for(var i=1;i<=16;i++){
            var t=this.its[i].v.showurl()
            if(t==undefined)document.getElementById(i).src="data/gui/empty.png"
            else document.getElementById(i).src=t
            global_ref_itms[i]=this.its[i]
        }
    }
    ondestroy(x,y){
        if(guix==x&&guiy==y){
            this.onguiclose()
            info_help("打开的交互方块被摧毁")
        }
    }
}
class Fluorite extends Block{
    colbox(x,y){return new BCollisionBox(x,y,x+1,y+1)}
    hard(){return 40}
    light(){return 12}
}
class Water extends NotSolid{
    constructor(depth=3){ // 0,1,2,3
        super()
        this.depth=depth
    }
    show(x,y){
        draw.fillStyle=`rgb(${64-16*this.depth},${80-16*this.depth},${240-16*this.depth})`;
        draw.fillRect(x*bsz,y*bsz,bsz,bsz);
    }
    update(x,y){
        var m=0
        for(let i=0;i<4;i++){
            let t=ndim.blk(x+direx[i],y+direy[i])
            if(t instanceof Water){
                m=Math.max(m,t.depth)
                t.depth=Math.max(t.depth,this.depth-1)
            }
            else if(this.depth!=0&&t instanceof Air){ // 扩散
                ndim.makeblk(x+direx[i],y+direy[i],new Water(this.depth-1))
            }
        }
        if(this.depth!=3&&m<=this.depth)ndim.makeblk(x,y,new Air()) // 消逝
    }
}
