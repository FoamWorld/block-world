const bsz=32

var tarray=[]
class Block{
    static hasgui=false
    static hastrans=false
    static tr=false
    id(){return this.t===undefined ? this.constructor.name : this.constructor.name+this.t}
    text(){return textof(localsetting["l"],this.id())}
    imgsource(){
        let im=bimgs[this.id()]
        if(im==undefined)im=bimgs["notexture"]
        return im
    }
    show(x,y){draw.drawImage(this.imgsource(),x,y,32,32)}
    showita(d){
        d.drawImage(this.imgsource(),0,0,32,32)
    }
    light(){return 0}
    begin(){}
    end(){}
    putextra(){}
    update(){}
    onguiclose(){}
    onbegin(x,y){
        this.begin(x,y)
    }
    onend(x,y){
        this.end(x,y)
        if(this.hasgui&&guix==x&&guiy==y){
            this.onguiclose(x,y)
            info_help("打开的交互方块被摧毁")
        }
    }
    onlighton(x,y,l=this.light()){ // BFS
        if(l==0)return
        for(let i=-l;i<=l;i++)tarray[i]=[]
        let xq=[0],yq=[0],lq=[l] // 任务队列
        while(lq.length!=0){
            let xx=xq[0],yy=yq[0],l=lq[0]
            xq.shift(1)
            yq.shift(1)
            lq.shift(1)
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
    elec(){}
    t_mat(){return this.mat /* 无=>undefined */}
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
    its 物品数组
    w 包裹
函数
    id() 辨识
    text() 文字显示
    imgsource() 图像资源
    show(x,y) canvas显示
    showita(d) 物品显示
    colbox(x,y) 碰撞箱
    hard() 硬度
    light() 亮度
    amount() 所含材质量
    isbackground() 是否视作背景
    updategui() 更新GUI
    update(x,y) 更新
    begin(x,y) 产生时所为
    end(x,y) 消失时所为
    putextra(x,y) 放置时额外所为
    elec(data) 收到电信号所为
事件属性
    onguiopen() 打开GUI
    updategui() GUI更新
    onguiclose() 关闭GUI
    onbegin(x,y) 产生时
    onend(x,y) 消失时
转化属性
    t_mat() 成为材料
*/
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
class 岩石 extends Solid{}
class 类导线 extends NotSolid{
    constructor(dat=0){this.dat=dat} // 表示4边的连接情况与当前信号强度
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
    constructor(its=new IB(16)){super();this.its=its}
    hard(){return 25}
    onguiopen(){
        this.its.html(gid("gui"), 0, "it0", function(par, i){
            if(i==7)par.appendChild(document.createElement("br"))
        })
        this.updategui()
    }
    updategui(){
        this.its.updategui()
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
    show(x,y){
        draw.fillStyle=`rgb(${64-16*this.depth},${80-16*this.depth},${240-16*this.depth})`
        draw.fillRect(x,y,32,32)
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
    show(x,y){
        draw.fillStyle=["#ffffa0","#fffff0","#fffffe","#ffffff"][this.depth]
        draw.fillRect(x,y,32,32)
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
    show(x,y){draw.drawImage(bimgs["石头"+this.t],x,y,32,32)}
    hard(){return [65,60,55,35][this.t]}
}
class 半砖 extends Block{ // 0为上面那块，之后顺时针旋转
    static hastrans=true
    constructor(mat,dir=0){
        super()
        this.mat=mat
        this.dir=dir
    }
    id(){return `${this.mat}半砖`}
    hard(){return this.mat.constructor.hard}
    amount(){return 0.5}
    show(x,y){
        let t=this.mat.constructor.theme
        draw.fillStyle=`rgb(${t[0]},${t[1]},${t[2]})`
        if(this.dir==0)draw.fillRect(x,y,32,16)
        else if(this.dir==1)draw.fillRect(x+16,y,16,32)
        else if(this.dir==2)draw.fillRect(x,y+16,32,16)
        else draw.fillRect(x,y,16,32)
    }
    showita(d){
        let t=this.mat.constructor.theme
        d.fillStyle=`rgb(${t[0]},${t[1]},${t[2]})`
        if(this.dir==0)d.fillRect(0,0,32,16)
        else if(this.dir==1)d.fillRect(16,0,16,32)
        else if(this.dir==2)d.fillRect(0,16,32,16)
        else d.fillRect(0,0,16,32)
    }
    colbox(x,y){
        if(this.dir==0)return new BCollisionBox(x,y,x+1,y+0.5)
        else if(this.dir==1)return new BCollisionBox(x+0.5,y,x+1,y+1)
        else if(this.dir==2)return new BCollisionBox(x,y+0.5,x+1,y+1)
        else return new BCollisionBox(x,y,x+0.5,y+1)
    }
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
    show(x,y){draw.drawImage(bimgs["原木"+this.t],x,y,32,32)}
    hard(){return 25}
}
class 木板 extends Solid{
    constructor(t){super();this.t=t}
    show(x,y){draw.drawImage(bimgs["木板"+this.t],x,y,32,32)}
    hard(){return 25}
    t_mat(){if(this.t==0)return new 苍穹木()}
}
class 树叶 extends NotSolid{
    static bk=false
    static tr=true
    constructor(t){super();this.t=t}
    show(x,y){draw.drawImage(bimgs["树叶"+this.t],x,y,32,32)}
    hard(){return 15}
}
class 树苗 extends NotSolid{
    static bk=false
    static hastrans=true
    constructor(t){super();this.t=t}
    show(x,y){draw.drawImage(bimgs["树苗"+this.t],x,y,32,32)}
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
class 结构方块 extends Solid{
    static hasgui=true
    constructor(n="",x=0,y=0,le=NaN,wi=NaN){super();this.n=n;this.x=x;this.y=y;this.le=le;this.wi=wi;}
    putextra(x,y){
        this.x=x;this.y=y;
    }
    onguiopen(){
        gid("gui").innerHTML=`<input id="gun" type="text" size="8"><button onclick="ndim.blk(${guix},${guiy}).i()">保存</button><button onclick="ndim.blk(${guix},${guiy}).o()">放置</button><br /><span>(</span><input id="gux" type="text" size="2"><span>,</span><input id="guy" type="text" size="2"><span>)[</span><input id="gul" type="text" size="2" placeholder="长度"><span>,</span><input id="guw" type="text" size="2" placeholder="宽度"><span>]</span>`
        this.updategui()
        inputting2=true
    }
    updategui(){
        gid("gun").value=this.n;gid("gux").value=this.x;gid("guy").value=this.y;gid("gul").value=this.le;gid("guw").value=this.wi
    }
    i(){
        let tn=gid("gun").value
        if(tn==""){info_help("名称不能为空");return}
        let x=Number.parseInt(gid("gux").value),y=Number.parseInt(gid("guy").value),le=Number.parseInt(gid("gul").value),wi=Number.parseInt(gid("guw").value)
        if(Number.isNaN(x)||Number.isNaN(y)||Number.isNaN(le)||Number.isNaN(wi)){
            info_help("请输入整数")
            this.updategui()
            return
        }
        if(le<=0||wi<=0){info_help("边长需为正");return}
        this.x=x;this.y=y;this.le=le;this.wi=wi;this.n=tn
        let s="["
        for(let i=0;i<this.le;i++){
            for(let j=0;j<this.wi;j++){
                s+=`${encode(ndim.blk(i+this.x,j+this.y))},`
            }
        }
        setting["st"][tn+"%l"]=this.le
        setting["st"][tn+"%w"]=this.wi
        setting["st"][tn+"%d"]=s+"]"
    }
    o(){
        let x=Number.parseInt(gid("gux").value),y=Number.parseInt(gid("guy").value)
        if(Number.isNaN(x)||Number.isNaN(y)){
            info_help("请输入整数")
            this.updategui()
            return
        }
        this.x=x
        this.y=y
        let n=gid("gun").value
        let td=setting["st"][n+"%d"]
        if(td===undefined){info_help("结构不存在");return}
        let t=decode(td)
        this.n=n
        this.le=Number.parseInt(setting["st"][n+"%l"])
        this.wi=Number.parseInt(setting["st"][n+"%w"])
        this.updategui()
        for(let i=0;i<this.le;i++){
            for(let j=0;j<this.wi;j++){
                makeblk(i+this.x,j+this.y,t[i*this.wi+j])
            }
        }
    }
    hard(){return 3200}
}
class 玻璃 extends Solid{
    static tr=true
    static hastrans=true
    hard(){return 65}
}
class 冰 extends Solid{
    show(x,y){draw.fillStyle=`#A0C0FF`;draw.fillRect(x,y,32,32)}
    showita(d){d.fillStyle="#A0C0FF";d.fillRect(0,0,32,32)}
    update(x,y){
        for(let i=0;i<4;i++){
            if(ndim.blk(x+direx[i],y+direy[i]).light()>8)makeblk(x,y,new 水())
        }
    }
    hard(){return 20}
}
class 沙子 extends Solid{
    hard(){return 10}
}
class 告示牌 extends NotSolid{
    static hasgui=true
    static hastrans=true
    constructor(s="",c="#000000"){super();this.s=s;this.c=c}
    show(x,y){
        draw.drawImage(bimgs["告示牌"],x,y,32,32)
        show_after.push(`draw.fillStyle="${this.c}";draw.font="16px";draw.fillText("${this.s}",${x+2},${y+18})`)
    }
    hard(){return 25}
    onguiopen(){
        gid("gui").innerHTML=`<input id="gus" type="text" size="8" placeholder="内容"><input id="guc" type="color"><button onclick="ndim.blk(${guix},${guiy}).set()">设置</button>`
        this.updategui()
        inputting2=true
    }
    updategui(){gid("gus").value=this.s;gid("guc").value=this.c}
    set(){this.s=gid("gus").value;this.c=gid("guc").value}
}
class 合成台 extends Solid{
    static hasgui=true
    hard(){return 25}
    onguiopen(){
        localtemp.i=new IB(10)
        localtemp.i.html(gid("gui"), 0, "it0", function(par, i){
            if(i==2||i==5)par.appendChild(document.createElement("br"))
            else if(i==8){
                let but = document.createElement("button")
                but.innerText = "合成"
                but.onclick = function(){
                    ndim.blk(guix, guiy).work()
                }
                par.append(document.createElement("br"), but)
            }
        })
        this.updategui()
    }
    onguiclose(x,y){throwits(x,y)}
    updategui(){
        localtemp.i.updategui(0,"localtemp.i",function(){},function(i){return (i==9)?"r":"c"})
    }
    work(){
        if(!(localtemp.i.i[9] instanceof EI)){
            info_help("请先移走生成物")
            return
        }
        let tr=inner_craft(localtemp.i.i)
        if(tr===null){
            info_help("无法合成")
            return
        }
        let it=guess_itm(tr.a)
        let mh=Math.floor(it.constructor.stack/tr.b)
        if(mh==0){
            info_log(`发现设计问题，请告知开发者`)
            return
        }
        for(let i=0;i<9;i++)if(!(localtemp.i.i[i] instanceof EI))mh=Math.min(mh,localtemp.i.getn(i))
        for(let i=0;i<9;i++)localtemp.i.reduce(i,mh)
        localtemp.i.i[9]=it
        localtemp.i.setn(9,tr.b*mh)
        this.updategui()
    }
}
class 刻制台 extends Solid{
    static hasgui=true
    hard(){return 25}
    onguiopen(){
        localtemp.i=new IB(2)
        localtemp.i.html(gid("gui"), 0, "it0", function(par, i){
            if(i==0)par.append(document.createTextNode(" => "))
            else{
                par.innerHTML += `<select id="guo"></select><button onclick="ndim.blk(${guix},${guiy}).work()">刻制</button>`
            }
        })
        this.updategui()
    }
    onguiclose(x,y){throwits(x,y)}
    updategui(){
        localtemp.i.updategui(0,"localtemp.i",function(){},function(i){return (i==0)?"c":"r"})
        let it=localtemp.i.i[0]
        let li=carves_nor[it.id()]
        if(li!==undefined){
            let s=""
            for(let i of li){
                s+=`<option value="${i}">${textof(localsetting["l"],i)}</option>`
            }
            gid("guo").innerHTML=s
        }
        else gid("guo").innerHTML=""
    }
    work(){
        if(!(localtemp.i.i[1] instanceof EI)){info_help("请先移走生成物");return}
        let v=gid("guo").value
        let it=guess_itm(v)
        localtemp.i.i[1]=it
        let inn=localtemp.i.getn(0)
        let oun=Math.min(inn,it.constructor.stack)
        localtemp.i.setn(1,oun)
        if(inn==oun)localtemp.i.i[0]=new EI()
        localtemp.i.setn(0,inn-oun)
        this.updategui()
    }
}
class 模具台 extends Solid{
    static hasgui=true
    hard(){return 25}
    onguiopen(){
        localtemp.i=new IB(2)
        localtemp.i.html(gid("gui"), 0, "it0", function(par, i){
            if(i==0)par.append(document.createTextNode(" => "))
            else{
                par.innerHTML += `<select id="guo"></select><button onclick="ndim.blk(${guix},${guiy}).work()">制作</button>`
            }
        })
        let s=""
        for(let i of Object.keys(mould_dat)){
            s+=`<option value="${i}">${i}</option>`
        }
        gid("guo").innerHTML=s
        this.updategui()
    }
    onguiclose(x,y){throwits(x,y)}
    updategui(){
        localtemp.i.updategui(0,"localtemp.i",function(){},function(i){return (i==0)?"c":"r"})
    }
    work(){
        if(!(localtemp.i.i[1] instanceof EI)){info_help("请先移走生成物");return}
        let ini=localtemp.i.i[0]
        if(!(ini instanceof 薄板)){info_help("请使用薄板");return}
        if(ini.mat.constructor.hard>35){info_help("材质太硬");return}
        let mater=ini.t_mat()
        let v=gid("guo").value
        let it=new 模具(v,mater)
        localtemp.i.i[1]=it
        let inn=localtemp.i.getn(0)
        let oun=Math.min(inn,it.constructor.stack)
        localtemp.i.setn(1,oun)
        if(inn==oun)localtemp.i.i[0]=new EI()
        localtemp.i.setn(0,inn-oun)
        this.updategui()
    }
}
class 组装台 extends Solid{
    static hasgui=true
    hard(){return 25}
}
class 熔炉 extends Solid{
    static hasgui=true
    hard(){return 35}
}
class 高炉壁 extends Solid{
    hard(){return 65}
}
class 高炉控制器 extends Solid{
    static hasgui=true
    hard(){return 65}
}
class 块 extends Solid{
    constructor(mat){super();this.mat=mat}
    hard(){return this.mat.constructor.hard}
    id(){return this.mat.constructor.name+"块"}
    amount(){return 1}
    show(x,y){
        let im=bimgs[this.id()]
        if(im===undefined){
            draw.fillStyle=this.mat.constructor.theme
            draw.fillRect(x,y,32,32)
        }
        else draw.drawImage(im,x,y,32,32)
    }
    showita(d){
        let im=bimgs[this.id()]
        if(im===undefined){
            d.fillStyle=this.mat.constructor.theme
            d.fillRect(0,0,32,32)
        }
        else d.drawImage(im,0,0,32,32)
    }
}
class 电池块 extends Solid{
    hard(){return 45}
    update(x,y){
        for(let i=0;i<3;i++){
            let x0=direx[i],y0=direy[i]
            ndim.blk(x+x0,y+y0).elec(i<<7|7)
        }
    }
}
class 导线 extends 类导线{
    hard(){return 35}
}
class N型导线 extends 类导线{
    hard(){return 35}
}
class P型导线 extends 类导线{
    hard(){return 35}
}
