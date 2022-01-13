function item_board(id,style,title){
    return `<canvas id="${id}" class="${style}" draggable="true" ondragstart="dragstart(event)" ondragover="dragover(event)" ondrop="drop(event)" width=32 height=32 title="${title}"></canvas>`
}
var drag_from,drag_to // Pair{Class,Int}
function dragstart(e){drag_from=e.target.id}
function dragover(e){
    drag_to=e.target.id
    if(ref_type[drag_to]=="c")e.preventDefault()
}
var ref_get=[],ref_set=[],ref_type=[]
/*c for common
r for read-only
i for infinite*/
function drop(e){
    // 交换数据
    if(drag_from==drag_to)return
    var f1=clone(ref_get[drag_from](drag_from))
    var f2=clone(ref_get[drag_to](drag_to))
    if(f2.a instanceof EI){
        if(ref_type[drag_from]=="i"){
            if(e.ctrlKey)ref_set[drag_to](drag_to,new Pair(f1.a,f1.a.constructor.stack))
            else ref_set[drag_to](drag_to,new Pair(f1.a,1))
        }
        else{
            if(e.ctrlKey){ // 分半
                let mi=f1.b>>1
                ref_set[drag_from](drag_from,new Pair(mi==0 ? new EI() : f1.a,mi))
                ref_set[drag_to](drag_to,new Pair(clone(f1.a),f1.b-mi))
            }
            else if(e.shiftKey){ // 分一
                if(f1.b==1)return
                ref_set[drag_from](drag_from,new Pair(f1.a,1))
                ref_set[drag_to](drag_to,new Pair(clone(f1.a),f1.b-1))
            }
            else{ // 移动
                ref_set[drag_from](drag_from,new Pair(new EI(),0))
                ref_set[drag_to](drag_to,new Pair(f1.a,f1.b))
            }
        }
    }
    else if(f1.a.id()==f2.a.id()){ // 相同叠加
        let st=f2.a.constructor.stack
        if(st==f2.b)return
        if(ref_type[drag_from]=="i")ref_set[drag_to](drag_to,new Pair(f2.a,f2.b+1))
        else{
            let sum=f1.b+f2.b
            if(sum>st){
                ref_set[drag_from](drag_from,new Pair(f1.a,sum-st))
                ref_set[drag_to](drag_to,new Pair(f2.a,st))
            }
            else{
                ref_set[drag_from](drag_from,new Pair(new EI(),0))
                ref_set[drag_to](drag_to,new Pair(f1.a,sum))
            }
        }
    }
    else{
        if(ref_type[drag_from]!="c")return
        ref_set[drag_from](drag_from,f2) // 交换
        ref_set[drag_to](drag_to,f1)
    }
    // 显示
    if(drag_to<0||drag_from<0)ply.updategui()
    if(drag_to>=0||drag_from>=0){
        if(nit!==null)nit.updategui()
        if(!Number.isNaN(guix))ndim.blk(guix,guiy).updategui()
    }
}
class Item{
    static canuse=false
    static stack=15
    static useonce=false
    id(){return this.t===undefined ? this.constructor.name : this.constructor.name+this.t}
    text(){return textof(localsetting["l"],this.id())}
    strength(){return 15}
    formblock(){return null}
    showit(d){
        d.fillStyle="slategray"
        d.clearRect(0,0,32,32)
        this.showita(d)
    }
    showita(d){
        let im=bimgs[this.t==undefined ? this.constructor.name : this.constructor.name+this.t]
        if(im==undefined)im=bimgs["notexture"]
        d.drawImage(im,0,0,32,32)
    }
    onunuse(){}
}
/*
属性
    stack 堆叠数
    canuse 能否使用
    useonce 是否只能单次使用
函数
    id() 辨识
    text() 文字显示
    showit(d) 显示物品
    showita(d) 辅助showit
    formblock() 成块（若能）
    strength(tar) 强度
事件属性
    onuse() 使用开始
    onunuse() 使用停止（不适用useonce=true）
*/
class EI extends Item{
    id(){return ""}
    text(){return ""}
    showita(){}
}
class IFB extends Item{
    static stack=4
    constructor(b){super();this.b=b}
    id(){return this.b.id()}
    text(){return this.b.text()}
    show(){this.b.show()}
    showita(d){return this.b.showita(d)}
    formblock(){return clone(this.b)}
}
class 书 extends Item{
    static stack=1
    static canuse=true
    constructor(c=[""],p=0){super();this.c=c;this.p=p}
    onuse(){
        gid("gui").innerHTML=`
<textarea id='book-page' maxlength='1000' style="width:100%" onselect='select_diarypage()' type='text' rows='20' cols='80'></textarea>
<p id='book-page-num'></p>
<button onclick='nit.firstpage()'>&lt;&lt;</button>
<button onclick='nit.prevpage()'>&lt;</button>
<button onclick='nit.delpage()'>-</button>
<button onclick='nit.clear()'>0</button>
<button onclick='nit.newpage()'>+</button>
<button onclick='nit.nextpage()'>&gt;</button>
<button onclick='nit.lastpage()'>&gt;&gt;</button>`
        this.updategui()
        inputting2=true
    }
    onunuse(){this.savepage();inputting2=false}
    updategui(){
        gid("book-page").value=this.c[this.p]
        gid("book-page-num").innerText=(this.p+1)+"/"+this.c.length
    }
    savepage(){this.c[this.p]=gid("book-page").value}
    newpage(){this.savepage();this.c.splice(this.p+1,0,"");this.updategui()}
    firstpage(){this.savepage();this.p=0;this.updategui()}
    lastpage(){this.savepage();this.p=this.c.length-1;this.updategui()}
    prevpage(){this.savepage();this.p=(this.p==0?0:this.p-1);this.updategui()}
    nextpage(){this.savepage();this.p=(this.p==this.c.length-1?this.p:this.p+1);this.updategui()}
    clear(){this.c=[""];this.p=0;this.updategui()}
    delpage(){
        if(this.c.length==1)this.c[0]=""
        else this.c.splice(this.p,1)
        if(this.p==this.c.length)this.p--
        this.updategui()
    }
}
class 桶 extends Item{
    static canuse=true
    static stack=1
    static useonce=true
    constructor(t=0){super();this.t=t}
    onuse(){
        if(Number.isNaN(mousex))return
        let t=pos_by_showpos(mousex,mousey)
        let b=ndim.blk(t.a,t.b)
        if(this.t==0){
            if(b instanceof 水){
                if(!localsetting["inf-use"]){
                    this.t=1
                    ply.updategui()
                }
                makeblk(t.a,t.b,new 空气())
            }
            else if(b instanceof 水){
                if(!localsetting["inf-use"]){
                    this.t=2
                    ply.updategui()
                }
                makeblk(t.a,t.b,new 空气())
            }
        }
        else if(b instanceof 空气&&ply.reachable(t.a,t.b)){
            if(this.t==1)makeblk(t.a,t.b,new 水())
            else if(this.t==2)makeblk(t.a,t.b,new 岩浆())
            if(!localsetting["inf-use"]){
                this.t=0
                ply.updategui()
            }
        }
    }
}
class 木棍 extends Item{}
class 无限物品表 extends Item{
    static canuse=true
    static stack=1
    onuse(){
        let inf_item_keys=Object.keys(inf_item_names)
        gid("gui").innerHTML=`<div id="guch"></div><div id="guco"></div>`
        let s=""
        for(let i of inf_item_keys){
            s+=`<button id="gu_${i}" class="unselected" onclick="nit.tab_to('${i}')">${i}</button>`
        }
        gid("guch").innerHTML=s
        localtemp["gui"]["ch"]=""
        this.tab_to(inf_item_keys[0])
    }
    tab_to(x){
        let t=localtemp["gui"]["ch"]
        if(x==t)return
        if(t!="")gid("gu_"+t).className="unselected"
        localtemp["gui"]["ch"]=x
        gid("gu_"+x).className="selected"
        let co=inf_item_names[x]
        let l=co.length
        let s=""
        let pre=[]
        for(let i=0;i<l;i++){
            let it=guess_itm(co[i])
            s+=item_board(i,"it0",it.text())
            if(i%8==7)s+="<br />"
            pre.push(it)
        }
        gid("guco").innerHTML=s
        localtemp["gui"]["l"]=l
        localtemp["gui"]["p"]=pre
        this.updategui()
    }
    updategui(){
        let l=localtemp["gui"]["l"]
        let pre=localtemp["gui"]["p"]
        for(let i=0;i<l;i++){
            let d=gid(i).getContext("2d")
            pre[i].showit(d)
            eval(`ref_get[i]=function(x){return new Pair(localtemp["gui"]["p"][x],1)}`)
            ref_type[i]="i"
        }
    }
}
