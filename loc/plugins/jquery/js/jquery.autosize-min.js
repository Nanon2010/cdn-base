!function(p) {
    var h, e = {
        className: "autosizejs",
        append: "",
        callback: !1
    }, u = "hidden", b = "border-box", t = "lineHeight", g = [ "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "textTransform", "wordSpacing", "textIndent" ], w = "oninput", x = "onpropertychange", f = p('<textarea tabindex="-1" style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>').data("autosize", !0)[0];
    (f.style.lineHeight = "99px") === p(f).css(t) && g.push(t), f.style.lineHeight = "", 
    p.fn.autosize = function(d) {
        return d = p.extend({}, e, d || {}), f.parentNode !== document.body && p(document.body).append(f), 
        this.each(function() {
            function e() {
                var e, t, o;
                h !== n && (h = n, f.className = d.className, p.each(g, function(e, t) {
                    f.style[t] = s.css(t);
                })), i || (i = !0, f.value = n.value + d.append, f.style.overflowY = n.style.overflowY, 
                o = parseInt(n.style.height, 10), f.style.width = s.width() + "px", f.scrollTop = 0, 
                f.scrollTop = 9e4, e = f.scrollTop, l < e ? (e = l, t = "scroll") : e < a && (e = a), 
                e += r, n.style.overflowY = t || u, o !== e && (n.style.height = e + "px", c && d.callback.call(n)), 
                setTimeout(function() {
                    i = !1;
                }, 1));
            }
            var i, t, n = this, s = p(n), a = s.height(), l = parseInt(s.css("maxHeight"), 10), r = 0, o = n.value, c = p.isFunction(d.callback);
            s.data("autosize") || ((s.css("box-sizing") === b || s.css("-moz-box-sizing") === b || s.css("-webkit-box-sizing") === b) && (r = s.outerHeight() - s.height()), 
            t = "none" === s.css("resize") ? "none" : "horizontal", s.css({
                overflow: u,
                overflowY: u,
                wordWrap: "break-word",
                resize: t
            }).data("autosize", !0), l = l && 0 < l ? l : 9e4, x in n ? w in n ? n[w] = n.onkeyup = e : n[x] = e : (n[w] = e, 
            n.value = "", n.value = o), p(window).resize(e), s.bind("autosize", e), e());
        });
    };
}(window.jQuery || window.Zepto);