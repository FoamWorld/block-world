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
function guess_object(s) {
    let f = s.indexOf('[')
    if (f == -1)
        return item(s)
    let name = s.substring(0, f)
    let argstr = s.substring(f + 1, s.length - 1)
    let l = argstr.length, instr = ""
    let ans = {}, last, tempkey
    for (let i = 0; i < l; i++) {
        let char = argstr.charAt(i)
        if (instr != "") {
            if (char == instr) {
                instr = ""
                if (tempkey == "")
                    tempkey = argstr.substring(last, i)
            }
        }
        else if (char == "\"" || char == "'") {
            instr = char
            last = i + 1
        }
        else if ((char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            (char >= '0' && char <= '9') ||
            char == "_") {
            ;
        }
        else if (char == ",") {
            tempkey = ""
        }
        else if (char == "=") {
            decode_continue()
        }
    }
    if (last != l - 1) {
        ans[tempkey] = decode(s.slice(last, l - 1))
    }
    return item(name, ans)
}
function guess_blkpos(s, t) {
    if (s[0] == '~') {
        return Math.floor(t) + Number(s.slice(1))
    }
    else return Number(s)
}

var errorMessage = ""
function work_command(s) {
    if (s == "") return
    errorMessage = ""
    try {
        var t = split_cmd(s)
        let cn = t[0]
        t.shift(1)
        let cnc = globalThis["cmd_" + cn]
        if (cnc == undefined)
            errorMessage = `未知指令 "${cn}"`
        else
            cnc.call(null, ...t)
    }
    catch (e) {
        info_log(e, "error")
    }
    if (errorMessage != "")
        info_log(errorMessage, "error")
}
function cmd_clear() { gid("events").replaceChildren() }
function cmd_eval(i) { eval(i) }
function cmd_fill(...t) {
    let lx = guess_blkpos(t[0], ply.x), ly = guess_blkpos(t[1], ply.y)
    let rx = guess_blkpos(t[2], ply.x), ry = guess_blkpos(t[3], ply.y)
    if (lx > rx) { let t = lx; lx = rx; rx = t; }
    if (ly > ry) { let t = ly; ly = ry; ry = t; }
    let b = guess_object(t[4])
    for (let i = lx; i <= rx; i++) {
        for (let j = ly; j <= ry; j++) {
            makeblk(i, j, b)
        }
    }
}
function cmd_gamemode(m) { setgamemode(m) }
function cmd_give(i, n) { ply.give(guess_object(i), n) }
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
