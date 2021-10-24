const bsz=32

var tarray=[]
class Block{
    static hasgui=false
    static hastrans=false
    static tr=false
    imgsource(){
        let im=bimgs[this.t==undefined ? this.constructor.name : this.constructor.name+this.t]
        if(im==undefined)im=bimgs["notexture"]
        return im
    }
    show(x,y,sz=bsz){draw.drawImage(this.imgsource(),x,y,sz,sz)}
    showita(d){
        d.drawImage(this.imgsource(),0,0,32,32)
    }
    light(){return 0}
    begin(){}
    end(){}
    putextra(){}
    update(){}
    onguiclose(){
        document.getElementById("gui").innerHTML=""
    }
    onbegin(x,y){
        this.begin(x,y)
    }
    onend(x,y){
        this.end(x,y)
        if(this.hasgui&&guix==x&&guiy==y){
            this.onguiclose()
            info_help("打开的交互方块被摧毁")
        }
    }
    onlighton(x,y,l=this.light()){ // BFS
        if(l==0)return
        for(let i=-l;i<=l;i++)tarray[i]=[]
        let xq=[0],yq=[0],lq=[l] // 任务队列
        while(lq.length!=0){
            let xx=xq[0],yy=yq[0],l=lq[0]
            xq.popfirst()
            yq.popfirst()
            lq.popfirst()
            tarray[xx][yy]=true
            let tl=ndim.getlig(x+xx,y+yy)
            if(l<=tl)continue
            ndim.setlig(x+xx,y+yy,l)
            if((!ndim.blk(x+xx,y+yy).constructor.tr&&(xx!=0||yy!=0))||l==1)continue
            let ll=l-1
            for(let i=0;i<4;i++){
                let x0=xx+direx[i],y0=yy+direy[i]
                if(!tarray[x0][y0]){
                    xq.push(x0)
                    yq.push(y0)
                    lq.push(ll)
                }
            }
        }
    }
    /*
属性
    bk 挖掘时视作背景
    hasgui 具有gui
    hastrans 贴图具有透明部分
    tr 光照系统中可透光（应包括发光体）
变量
    t 一类中的编号
    dir 方向
函数
    imgsource() 图像资源
    show(x,y) canvas显示
    showita(d) 物品显示
    colbox(x,y) 碰撞箱
    hard() 硬度
    light() 亮度
    isbackground() 是否视作背景
    updategui() 更新GUI
    update(x,y) 更新
    begin(x,y) 产生时所为
    end(x,y) 消失时所为
    putextra(x,y) 放置时额外所为
事件属性
    onguiopen() 打开GUI
    updategui() GUI更新
    onguiclose() 关闭GUI
    onbegin(x,y) 产生时
    onend(x,y) 消失时
    */
}
class Solid extends Block{ // 【固体】，通常指碰撞箱为整的物质
    static bk=false
    colbox(x,y){return new BCollisionBox(x,y,x+1,y+1)}
}
class NotSolid extends Block{ // 【非固体】，通常指碰撞箱为0的物质
    static bk=true
    static tr=true
    colbox(x,y){return new EmptyCollisionBox()}
    hard(){return 0}
}
class 岩石 extends Solid{ // 通常指自然生成的
}
class 空气 extends NotSolid{
    static hastrans=true
    show(){}
    onlighton(){}
    onlightoff(){}
    onbegin(){}
    onend(){} // 加速，防止过多调用
}
class 星岩 extends Solid{
    hard(){return 3200}
}
class 箱子 extends Solid{
    static hasgui=true
    constructor(its=arrayof(1,16,function(){return new Wrap(new EmptyItem())})){
        super()
        this.its=its
    }
    hard(){return 25}
    onguiopen(){
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
            this.its[i].v.showit(document.getElementById(i).getContext("2d"))
            global_ref_itms[i]=this.its[i]
        }
    }
}
class 萤石 extends 岩石{
    static tr=true
    hard(){return 40}
    light(){return 12}
}
class 水 extends NotSolid{
    constructor(depth=3){ // 0,1,2,3
        super()
        this.depth=depth
    }
    show(x,y,sz=bsz){
        draw.fillStyle=`rgb(${64-16*this.depth},${80-16*this.depth},${240-16*this.depth})`
        draw.fillRect(x,y,sz,sz)
    }
    update(x,y){
        if(localsetting["t"]%4!=0)return
        var m=0
        for(let i=0;i<4;i++){
            let t=ndim.blk(x+direx[i],y+direy[i])
            if(t instanceof 水){
                m=Math.max(m,t.depth)
                t.depth=Math.max(t.depth,this.depth-1)
            }
            else if(this.depth!=0&&t instanceof 空气){ // 扩散
                makeblk(x+direx[i],y+direy[i],new 水(this.depth-1))
            }
        }
        if(this.depth!=3&&m<=this.depth)makeblk(x,y,new 空气()) // 消逝
    }
}
class 岩浆 extends NotSolid{ // 岩浆
    constructor(depth=3){
        super()
        this.depth=depth
    }
    show(x,y,sz=bsz){
        draw.fillStyle=["#ffffa0","#fffff0","#fffffe","#ffffff"][this.depth]
        draw.fillRect(x,y,sz,sz)
    }
    light(){return 14}
    update(x,y){
        if(localsetting["t"]%4!=0)return
        var m=0,nw=false,nr=false
        for(let i=0;i<4;i++){
            let t=ndim.blk(x+direx[i],y+direy[i])
            if(t instanceof 水){
                nw=true
            }
            else if(t instanceof 岩浆){
                m=Math.max(m,t.depth)
                t.depth=Math.max(t.depth,this.depth-1)
            }
            else if(this.depth!=0&&t instanceof 空气){
                makeblk(x+direx[i],y+direy[i],new 岩浆(this.depth-1))
            }
            else if(t instanceof 岩石){
                nr=true
            }
        }
        if(nw){
            if(nr)makeblk(x,y,new 石头(0)) // 推测生成侵入岩
            else makeblk(x,y,new 石头(grand()<16384 ? 1 : 2)) // 推测生成火成岩
        }
        else if(this.depth!=3&&m<=this.depth)makeblk(x,y,new 空气()) // 消逝
    }
}
class 石头 extends 岩石{
    constructor(t=3){
        super()
        this.t=t
    }
    show(x,y,sz=bsz){draw.drawImage(bimgs["石头"+this.t],x,y,sz,sz)}
    hard(){return [65,60,55,50][this.t]}
}
class 半砖 extends Block{ // 0为上面那块，之后顺时针旋转
    static hastrans=true
    constructor(w=new 木板(0),dir=0){
        super()
        this.w=w
        this.dir=dir
    }
    show(x,y,sz=bsz){
        if(this.dir==0)draw.drawImage(this.w.imgsource(),x,y,sz,sz/2)
        else if(this.dir==1)draw.drawImage(this.w.imgsource(),x+sz/2,y,sz/2,sz)
        else if(this.dir==2)draw.drawImage(this.w.imgsource(),x,y+sz/2,sz,sz/2)
        else draw.drawImage(this.w.imgsource(),x,y,sz/2,sz)
    }
    showita(d){
        if(this.dir==0)d.drawImage(this.w.imgsource(),0,0,32,16)
        else if(this.dir==1)d.drawImage(this.w.imgsource(),16,0,16,32)
        else if(this.dir==2)d.drawImage(this.w.imgsource(),0,16,32,16)
        else d.drawImage(this.w.imgsource(),0,0,16,32)
    }
    colbox(x,y){
        if(this.dir==0)return new BCollisionBox(x,y,x+1,y+0.5)
        else if(this.dir==1)return new BCollisionBox(x+0.5,y,x+1,y+1)
        else if(this.dir==2)return new BCollisionBox(x,y+0.5,x+1,y+1)
        else return new BCollisionBox(x,y,x+0.5,y+1)
    }
    hard(){return this.w.hard()}
    putextra(x,y){
        let x0=x-ply.x,y0=y-ply.y
        if(x0>0){
            if(x0<y0)this.dir=2
            else if(x0<-y0)this.dir=0
            else this.dir=1
        }
        else{
            if(x0>y0)this.dir=0
            else if(x0>-y0)this.dir=2
            else this.dir=3
        }
    }
}
class 原木 extends Solid{
    constructor(t){super();this.t=t}
    show(x,y,sz=bsz){draw.drawImage(bimgs["原木"+this.t],x,y,sz,sz)}
    hard(){return 25}
}
class 木板 extends Solid{
    constructor(t){super();this.t=t}
    show(x,y,sz=bsz){draw.drawImage(bimgs["木板"+this.t],x,y,sz,sz)}
    hard(){return 25}
}
class 树叶 extends NotSolid{
    static bk=false
    static tr=true
    constructor(t){super();this.t=t}
    show(x,y,sz=bsz){draw.drawImage(bimgs["树叶"+this.t],x,y,sz,sz)}
    hard(){return 15}
}
class 树苗 extends NotSolid{
    static bk=false
    static hastrans=true
    constructor(t){super();this.t=t}
    show(x,y,sz=bsz){draw.drawImage(bimgs["树苗"+this.t],x,y,sz,sz)}
    hard(){return 15}
    update(x,y){
        let t=grand()
        if(t>=8)return
        eval(`this.ongrow${this.t}(x,y,t)`)
    }
    ongrow0(x,y,t){
        if(t<4){
            this.grow0(x,y,0,8)
            this.grow0(x,y,2,8)
        }
        else{
            this.grow0(x,y,1,8)
            this.grow0(x,y,3,8)
        }
        makeblk(x,y,new 原木(0))
    }
    grow0(x,y,dir,la){
        let l=grand()%la+1
        for(let i=1;i<=l;i++){
            if(ndim.blk(x+direx[dir]*i,y+direy[dir]*i).hard()<15)makeblk(x+direx[dir]*i,y+direy[dir]*i,new 原木(0))
            else{
                l=i-1
                break
            }
        }
        if(la>=2||l>=2){
            let t=grand(),x0=x+direx[dir]*(l-1),y0=y+direy[dir]*(l-1),dl=left_dir(dir),dr=right_dir(dir)
            if(t>=16384){
                t-=16384 // 《反复利用》
                this.grow0(x0,y0,dl,la>>1)
                if(ndim.blk(+direx[dir]*l+direx[dl],y0+direy[dir]*l+direy[dl]).hard()<10&&t%4!=0)makeblk(x+direx[dir]*l+direx[dl],y0+direy[dir]*l+direy[dl],new 树叶(0))
            }
            if(t>=8192){
                this.grow0(x0,y0,dr,la>>1)
                if(ndim.blk(direx[dir]*l+direx[dr],y0+direy[dir]*l+direy[dr]).hard()<10&&t%16>=4)makeblk(x+direx[dir]*l+direx[dr],y0+direy[dir]*l+direy[dr],new 树叶(0))
            }
        }
    }
}
