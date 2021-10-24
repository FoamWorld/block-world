var dims=[],ndim,ndimid
var ply=new Player(1.5,1.5)
var saved={}
/*
saved[区块号][相对坐标号]=方块数据（引用）
*/
function wpos(x,y){return x+","+y}

class Chunk{ // 区块：64x64
    constructor(){
        this.blk=arrayof(0,63,function(){return []})
    }
    generate_debug(x,y){ // 调试用生成器
        for(let i=0;i<64;i++){
            for(let j=0;j<64;j++)this.blk[i][j]=new Air()
        }
    }
    generate(x,y){
        eval(`this.generate_${localsetting["type"]}(${x},${y})`)
        var t=saved[wpos(x,y)]
        if(t!==undefined){
            for(let i in t){
                let y0=rem(i,64),x0=(i-y0)/64
                this.blk[x0][y0]=t[i]
            }
        }
    }
    show(lx,ly,px,py){ // (lx,ly)显示到(px,py)
        var rx=Math.min(lx+15-px,63),ry=Math.min(ly+15-py,63)
        // console.log(`(${lx},${ly}) (${rx},${ry}) => (${px},${py})`)
        for(let i=lx;i<=rx;++i){
            for(let j=ly;j<=ry;++j){
                this.blk[i][j].show(i-lx+px,j-ly+py)
            }
        }
    }
    update(x,y){
        for(let i=0;i<64;i++){
            for(let j=0;j<64;j++){
                if(this.blk[i][j].update!=undefined){
                    this.blk[i][j].update(x+i,y+j)
                }
            }
        }
    }
}
class Dimension{
    constructor(){
        this.dim={}
    }
    chk(x,y){return this.dim[wpos(x,y)]}
    blk(x,y){
        var tx=rem(x,64),ty=rem(y,64)
        var lx=x-tx,ly=y-ty
        return this.chk(lx,ly).blk[tx][ty]
    }
    setblk(x,y,o){
        var tx=rem(x,64),ty=rem(y,64)
        var lx=x-tx,ly=y-ty
        this.chk(lx,ly).blk[tx][ty]=clone(o)
        let t=wpos(lx,ly)
        if(saved[t]==undefined)saved[t]={}
        saved[t][tx*64+ty]=this.chk(lx,ly).blk[tx][ty]
    }
    makeblk(x,y,o){
        var tx=rem(x,64),ty=rem(y,64)
        var lx=x-tx,ly=y-ty
        this.chk(lx,ly).blk[tx][ty]=o
        let t=wpos(lx,ly)
        if(saved[t]==undefined)saved[t]={}
        saved[t][tx*64+ty]=o
    }
    generate(x,y){
        let c=new Chunk()
        c.generate(x,y)
        this.dim[x+","+y]=c
    }
    show(x,y){ // 显示(0,0)的对应坐标
/*
区块坐标（此处假设x行y列）
(x,y)------+---------+
  |    A   |    B    |
  +--(lx+64,ly+64)---+
  |    C   |    D    |
  +--------+---(x+15,y+15)
lx+64-x=64-tx
lx+64<x+15 <=> tx>49 <=> 额外区块需渲染
需渲染区块左上角相对自己
    坐标     取整后   不取整显示坐标/32 显示坐标/32
A: (tx,ty) (tx1,ty1) (0,0)             (tx1-tx,ty1-ty)
B: (tx,0 ) (tx1, 0 ) (0,64-ty)         (tx1-tx,64-ty)
C: (0 ,ty) ( 0 ,ty1) (64-tx,0)         (64-tx,ty1-ty)
D: (0 ,0 ) ( 0 , 0 ) (64-tx,64-ty)     (64-tx,64-ty)
*/
        var tx=rem(x,64),ty=rem(y,64) // 区块相对坐标
        var lx=x-tx,ly=y-ty // 区块标识
        var tx1=Math.floor(tx),ty1=Math.floor(ty)
        // A
        this.chk(lx,ly).show(tx1,ty1,tx1-tx,ty1-ty)
        if(ty>49){// B
            ly+=64
            this.chk(lx,ly).show(tx1,0,tx1-tx,64-ty)
            ly-=64
        }
        if(tx>49){// C
            lx+=64
            this.chk(lx,ly).show(0,ty1,64-tx,ty1-ty)
            if(ty>49){// D
                ly+=64
                this.chk(lx,ly).show(0,0,64-tx,64-ty)
            }
        }
    }
}
function pos_by_showpos(x,y){
    return new Pair(Math.floor(x/bsz-7.5+ply.x),Math.floor(y/bsz-7.5+ply.y))
}
function blk_by_showpos(x,y){
    return ndim.blk(Math.floor(x/bsz-7.5+ply.x),Math.floor(y/bsz-7.5+ply.y))
}

function initdim(){
    dims[0]=new Dimension()
    ndim=dims[0] // 引用
    ndimid=0
}
function pregenerate(){
    var px=64*Math.floor(ply.x/64),py=64*Math.floor(ply.y/64)
    for(let i=px-128;i<=px+128;i+=64){
        for(let j=py-128;j<=py+128;j+=64){
            if(ndim.chk(i,j)==undefined)ndim.generate(i,j)
        }
    }
}
function showgame(){
    var lx=ply.x-7.5,ly=ply.y-7.5
    ndim.show(lx,ly)
    ply.show(7.0625,7.0625)
}
function updategame(){
    var px=64*Math.floor(ply.x/64),py=64*Math.floor(ply.y/64)
    for(let i=px-64;i<=px+64;i+=64){ // 更新范围比生成范围小qwq
        for(let j=py-64;j<=py+64;j+=64){
            ndim.chk(i,j).update(i,j)
        }
    }
}
function blk(x,y){
    return ndim.blk(x,y)
}