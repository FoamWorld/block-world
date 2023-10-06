class andesite extends Solid {
	get hard() { return 55 }
	get isRock() { return true }
}
class basalt extends Solid {
	get hard() { return 60 }
	get isRock() { return true }
}
class fluorite extends Solid {
	get brightness() { return 12 }
	get hard() { return 40 }
	get isRock() { return true }
	static tr = true
}
class granite extends Solid {
	get hard() { return 65 }
	get isRock() { return true }
}
class stone extends Solid {
	get hard() { return 35 }
	get isRock() { return true }
}
