function item_board(id,style){
    return `<img id="${id}" class="${style}" draggable="true" ondragstart="dragstart(event)" ondragover="dragover(event)" ondrop="drop()">`
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
    var t=document.getElementById(drag_from).src
    document.getElementById(drag_from).src=document.getElementById(drag_to).src
    document.getElementById(drag_to).src=t
}
class Item{
    digstrength(){return 50}
}
class EmptyItem extends Item{
    showurl(){return undefined}
}
class ItemFromBlock extends Item{
    constructor(b){super();this.b=b}
    show(){this.b.show()}
    showurl(){return this.b.showurl()}
}