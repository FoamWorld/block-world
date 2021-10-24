function item_board(id,style){
    return `<canvas id="${id}" class="${style}" draggable="true" ondragstart="dragstart(event)" ondragover="dragover(event)" ondrop="drop()" width=32 height=32></canvas>`
}
var drag_from,drag_to
function dragstart(e){drag_from=e.target.id}
function dragover(e){drag_to=e.target.id;e.preventDefault()}
var global_ref_itms=[]
function drop(){
    // 交换数据
    if(drag_from==drag_to)return
    var f1=clone(global_ref_itms[drag_from].v)
    var f2=clone(global_ref_itms[drag_to].v)
    global_ref_itms[drag_from].v=f2
    global_ref_itms[drag_to].v=f1
    // 显示
    if(drag_to<0||drag_from<0)ply.updategui()
    if(drag_to>0||drag_from>0){
        if(guii)nit.updategui()
        if(!Number.isNaN(guix))ndim.blk(guix,guiy).updategui()
    }
}
class Item{
    static canuse=false
    digstrength(){return 15}
    formblock(){return undefined}
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
class EmptyItem extends Item{
    showita(){}
}
class ItemFromBlock extends Item{
    constructor(b){super();this.b=b}
    show(){this.b.show()}
    showita(d){return this.b.showita(d)}
    formblock(){return this.b}
}
class 书 extends Item{
    static canuse=true
    constructor(c=[""],p=0){super();this.c=c;this.p=p}
    onuse(){
        document.getElementById("gui").innerHTML=`
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
        tab_to(1)
        inputting2=true
    }
    onunuse(){this.savepage();inputting2=false}
    updategui(){
        document.getElementById("book-page").value=this.c[this.p]
        document.getElementById("book-page-num").innerText=(this.p+1)+"/"+this.c.length
    }
    savepage(){this.c[this.p]=document.getElementById("book-page").value}
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
