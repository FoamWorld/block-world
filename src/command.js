function split_cmd(s) {
    var a = [], t = "", quote = false
    let l = s.length
    for (let i = 0; i < l; i++) {
        if (s[i] == " " && !quote) {
            if (t != "") {
                a.push(t)
                t = ""
            }
            continue
        }
        if (s[i] == "\\") {
            if (s[i + 1] == "`") {
                i++
                t += "`"
            }
            else if (s[i + 1] == "\\") {
                i++
                t += "\\"
            }
            else t += "\\"
        }
        else if (s[i] == "`") {
            quote = !quote
        }
        else t += s[i]
    }
    if (t != "") a.push(t)
    return a
}
function anti_html(s) {
    let t = ""
    let l = s.length
    for (let i = 0; i < l; i++) {
        let c = s[i]
        if (c == '<') t += "&lt;"
        else if (c == ">") t += "&gt;"
        else t += c
    }
    return t
}
function guess_itm(s) {
    let i = jump2itm[s]
    if (i != undefined) s = i
    i = name2itm[s]
    if (i != undefined) return decode(`(${i})`)
    var t = getblkbystr(s)
    if (t instanceof Block) {
        return new IFB(t)
    }
    else return t
}
function guess_blk(s) {
    return getblkbystr(s)
}
function guess_blkpos(s, t) {
    if (s[0] == '~') {
        return Math.floor(t) + Number(s.slice(1))
    }
    else return Number(s)
}
function work_command(s) {
    if (s == "") return
    try {
        var t = split_cmd(s)
        let cn = t[0]
        t.shift(1)
        let cnc = globalThis["cmd_" + cn]
        if (cnc == undefined) {
            throw new Error("未知指令" + cn)
        }
        else cnc.call(null, ...t)
    }
    catch (e) {
        info_log(e, "error")
    }
}
function cmd_clear() { gid("events").replaceChildren() }
function cmd_eval(i) { eval(i) }
function cmd_fill(...t) {
    let lx = guess_blkpos(t[0], ply.x), ly = guess_blkpos(t[1], ply.y)
    let rx = guess_blkpos(t[2], ply.x), ry = guess_blkpos(t[3], ply.y)
    if (lx > rx) { let t = lx; lx = rx; rx = t; }
    if (ly > ry) { let t = ly; ly = ry; ry = t; }
    let b = guess_blk(t[4])
    for (let i = lx; i <= rx; i++) {
        for (let j = ly; j <= ry; j++) {
            makeblk(i, j, b)
        }
    }
}
function cmd_gamemode(m) { setgamemode(m) }
function cmd_give(i, n) { ply.give(guess_itm(i), n) }
function cmd_say(s = "") { info_log(anti_html(s), "user") }
function cmd_seed() { info_log(localsetting["seed"]) }
function cmd_show(i) { info_log(encode(eval(i))) }
function cmd_function(n, s) { localsetting["cmdf"][n] = s }
function cmd_call(n) { eval(localsetting["cmdf"][n]) }
function cmd_quit(t) {
    if (t) {
        clearInterval(manager_interval)
        saved = {}
        container_to("menu")
    }
    else quit_game()
}
function cmd_save() { saveworld() }
function cmd_lset(k, v) { localsetting[k] = decode(v) }
