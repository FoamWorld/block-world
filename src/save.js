function str_e(s) {
    let t = ""
    for (let i in s) {
        if (s[i] == '\"') t += "#q"
        else if (s[i] == '#') t += "#i"
        else t += s[i]
    }
    return t
}
function str_d(s) {
    let t = "", l = s.length
    for (var i = 0; i < l; i++) {
        if (s[i] == '#') {
            i++
            if (s[i] == 'q') t += "\""
            else t += "#"
        }
        else t += s[i]
    }
    return t
}
function encode(o) {
    if (o === true) return "t"
    if (o === false) return "f"
    if (o === null) return "n"
    if (o === undefined) return "u"
    if (Number.isNaN(o)) return "a"
    if (o === Infinity) return "i"
    var t = typeof (o)
    if (t == "number") return o.toString()
    var s = ""
    if (t == "string") {
        if (o == "") return "s"
        return `"${str_e(o)}"`
    }
    if (o instanceof Array) {
        s = "["
        for (let i of o) {
            s += encode(i) + ","
        }
        if (s[s.length - 1] == ',') s = s.slice(0, -1)
        return s + "]"
    }
    if (o.constructor.name == "Object") {
        s = "{"
        for (var i in o) {
            s += encode(i) + ":" + encode(o[i]) + ","
        }
        if (s[s.length - 1] == ',') s = s.slice(0, -1)
        return s + "}"
    }
    if (o instanceof Object) {
        var props = Object.getOwnPropertyDescriptors(o)
        if (props == {}) return "(" + o.constructor.name + ")"
        s = "(" + o.constructor.name + ","
        for (var i in props) {
            s += encode(props[i].value) + ","
        }
        if (s[s.length - 1] == ',') s = s.slice(0, -1)
        return s + ")"
    }
}
function decode(s) {
    if (s == "t") return true
    if (s == "f") return false
    if (s == "n") return null
    if (s == "u") return undefined
    if (s == "a") return NaN
    if (s == "i") return Infinity
    if (s == "s") return ""
    var t = s[0]
    if (t == "\"") { // 推测字符串
        return str_d(s.slice(1, s.length - 1))
    }
    else if (t == "[") { // 推测数组
        var l = s.length
        var stack = 0, instr = false, ans = [], last = 1
        for (let i = 1; i < l - 1; i++) {
            if (instr) {
                if (s[i] == "\"") instr = false
                continue
            }
            switch (s.charCodeAt(i)) {
                case 91: stack++; break
                case 40: stack++; break
                case 123: stack++; break
                case 41:
                case 93:
                case 125: stack--; break
                case 34: instr = true; break
                case 44: {
                    if (stack == 0) {
                        ans.push(decode(s.slice(last, i)))
                        last = i + 1
                    }
                    break
                }
            }
        }
        if (last != l - 1) {
            ans.push(decode(s.slice(last, l - 1)))
        }
        return ans
    }
    else if (t == "{") { // 推测Object
        var l = s.length
        var stack = 0, instr = false, ans = {}, last = 1, tempkey
        for (let i = 1; i < l - 1; i++) {
            if (instr) {
                if (s[i] == "\"") instr = false
                continue
            }
            switch (s.charCodeAt(i)) {
                case 91: stack++; break
                case 40: stack++; break
                case 123: stack++; break
                case 41:
                case 93:
                case 125: stack--; break
                case 34: instr = true; break
                case 58: {
                    if (stack == 0) {
                        tempkey = decode(s.slice(last, i))
                        last = i + 1
                    }
                    break
                }
                case 44: {
                    if (stack == 0) {
                        ans[tempkey] = decode(s.slice(last, i))
                        last = i + 1
                    }
                    break
                }
            }
        }
        if (last != l - 1) {
            ans[tempkey] = decode(s.slice(last, l - 1))
        }
        return ans
    }
    else if ((t >= "0" && t <= "9") || t == "-") { // 推测数字
        return Number(s)
    }
    else if (t == "(") { // 推测类
        var l = s.length
        var stack = 0, instr = false, ans = [], last = 1
        for (let i = 1; i < l - 1; i++) {
            if (instr) {
                if (s[i] == "\"") instr = false
                continue
            }
            switch (s.charCodeAt(i)) {
                case 91: stack++; break
                case 40: stack++; break
                case 123: stack++; break
                case 41:
                case 93:
                case 125: stack--; break
                case 34: instr = true; break
                case 44: {
                    if (stack == 0) {
                        ans.push(s.slice(last, i))
                        last = i + 1
                    }
                    break
                }
            }
        }
        if (last != l - 1) {
            ans.push(s.slice(last, l - 1))
        }
        if (ans[0] == "Uint8Array") {
            ans.shift(1)
            return Uint8Array.from(ans)
        }
        eval(`f=function(args){return new ${ans[0]}(...args)}`)
        let lf = f // f会被更改
        ans.shift(1)
        for (let i = 0; i < ans.length; i++) {
            ans[i] = decode(ans[i])
        }
        return lf(ans)
    }
}
function saveworld(n = localsetting["worldname"]) {
    localStorage.setItem(n + "%v", VERSION)
    localStorage.setItem(n + "%ls", encode(localsetting))
    localStorage.setItem(n + "%ply", encode(ply))
    localStorage.setItem(n + "%dat", encode(saved))
    localStorage.setItem(n + "%gsr", gsrand)
}
function eraseworld(n) {
    localStorage.removeItem(n + "%v")
    localStorage.removeItem(n + "%ls")
    localStorage.removeItem(n + "%ply")
    localStorage.removeItem(n + "%dat")
    localStorage.removeItem(n + "%gsr")
}
function loadworld(n) {
    try {
        let vs = localStorage.getItem(n + "%v")
        if (vs != VERSION) window.alert("版本可能不匹配：" + vs)
        localsetting = decode(localStorage.getItem(n + "%ls"))
        ply = decode(localStorage.getItem(n + "%ply"))
        saved = decode(localStorage.getItem(n + "%dat"))
        gsrand = Number.parseInt(localStorage.getItem(n + "%gsr"))
    }
    catch (e) {
        window.alert("导入失败")
    }
}
