const inf_item_names = {
	"natural": [
		"stone", "sand", "ice", "andesite", "basalt", "granite", "fluorite"
	],
	"decorations": [
		"grow_powder",
		"sky_leaf", "sky_log", "sky_sapling",
		"vine", "vine_grow",
		"sponge", "wooden_sign", "glass"
	],
	"resources": [
		"stick",
		"sky_plank", "lamina[mat='sky']",
		"full_block[mat='iron']", "full_block[mat='gold']", "full_block[mat='copper']", "full_block[mat='clay']", "full_block[mat='ceramic']",
		"ingot[mat='iron']", "ingot[mat='gold']", "ingot[mat='copper']",
	],
	"work spaces": ["chest", "crafting_table", "carving_table", "mould_table"],
	"tools": ["bucket[tID=0]", "bucket[tID=1]", "bucket[tID=2]", "lighter", "book"],
	"administered": ["air", "border", "wall", "structure_block", "bomb", "fire"],
}
class table_items extends Item {
	static canuse = true
	static stack = 1
	onuse() {
		let inf_item_keys = Object.keys(inf_item_names)
		let gui = zbox_gui2()
		let guch = createQElement("div", { id: "guch" })
		for (let i of inf_item_keys)
			guch.append(createQElement("button", {
				id: `gu_${i}`,
				className: "unselected",
				onclick: () => nit.tab_to(i),
				innerText: i
			}))
		gui.append(guch, createQElement("div", { id: "guco" }))
		localtemp["gui"]["ch"] = ""
		this.tab_to(inf_item_keys[0])
	}
	tab_to(x) {
		let t = localtemp["gui"]["ch"]
		if (x == t) return
		if (t != "") gid("gu_" + t).className = "unselected"
		localtemp["gui"]["ch"] = x
		gid("gu_" + x).className = "selected"
		let co = inf_item_names[x]
		let l = co.length
		let pre = []
		gid("guco").replaceChildren()
		for (let i = 0; i < l; i++) {
			let it = guess_object(co[i])
			gid("guco").append(item_board(i, "it0", it.text))
			if (i % 8 == 7) gid("guco").append(document.createElement("br"))
			pre.push(it)
		}
		localtemp["gui"]["l"] = l
		localtemp["gui"]["p"] = pre
		this.updategui()
	}
	updategui() {
		let l = localtemp["gui"]["l"]
		let pre = localtemp["gui"]["p"]
		for (let i = 0; i < l; i++) {
			let d = gid(i).getContext("2d")
			pre[i].showit(d)
			eval(`ref_get[i]=function(x){return pair(localtemp["gui"]["p"][x],1)}`)
			ref_type[i] = "i"
		}
	}
}
