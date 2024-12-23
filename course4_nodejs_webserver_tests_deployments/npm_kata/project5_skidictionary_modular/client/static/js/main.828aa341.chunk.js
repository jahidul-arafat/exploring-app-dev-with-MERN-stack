(window.webpackJsonp = window.webpackJsonp || []).push([[0], {
    11: function (n, e, t) {
        n.exports = t.p + "static/media/ski.23b3782b.jpg"
    }, 15: function (n, e, t) {
        n.exports = t(26)
    }, 26: function (n, e, t) {
        "use strict";
        t.r(e);
        var r = t(0), o = t.n(r), a = t(3), i = t(4), c = t(13), u = t(1);

        function l() {
            var n = Object(i.a)(["\n  svg {\n    &:hover {\n      cursor: pointer;\n    }\n  }\n"]);
            return l = function () {
                return n
            }, n
        }

        function d(n) {
            var e = n.definitions, t = void 0 === e ? [] : e, a = n.onRemoveTerm, i = void 0 === a ? function (n) {
                return n
            } : a;
            return o.a.createElement(m, null, o.a.createElement("h1", null, "Skier Dictionary"), o.a.createElement("dl", null, t.map(function (n, e) {
                var t = n.term, a = n.defined;
                return o.a.createElement(r.Fragment, {key: e}, o.a.createElement("dt", null, t), o.a.createElement("dd", null, a, " ", o.a.createElement(c.a, {
                    onClick: function () {
                        window.confirm('Are you sure you want to remove "'.concat(t, '"?')) && i(t)
                    }, color: "red", size: 10
                })))
            })))
        }

        var m = u.a.section(l()), f = t(2);

        function s(n) {
            var e = n.onAddTerm, t = void 0 === e ? function (n) {
                    return n
                } : e, a = Object(r.useState)(""), i = Object(f.a)(a, 2), c = i[0], u = i[1], l = Object(r.useState)(""),
                d = Object(f.a)(l, 2), m = d[0], s = d[1];
            return o.a.createElement("form", null, o.a.createElement("input", {
                name: "term",
                placeholder: "term...",
                onChange: function (n) {
                    return u(n.target.value)
                },
                value: c
            }), o.a.createElement("input", {
                name: "defined", placeholder: "definition...", onChange: function (n) {
                    return s(n.target.value)
                }, value: m
            }), o.a.createElement("button", {
                type: "button", onClick: function () {
                    t({term: c, defined: m}), u(""), s("")
                }
            }, "Add Term"))
        }

        var p = t(12), v = function () {
            var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], e = Object(r.useState)(n),
                t = Object(f.a)(e, 2), o = t[0], a = t[1];
            Object(r.useEffect)(function () {
                fetch("/dictionary").then(function (n) {
                    return n.json()
                }).then(a).catch(console.error)
            }, []);
            return {
                definitions: o, addTerm: function (n) {
                    fetch("/dictionary", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(n)
                    }).then(function (n) {
                        return n.json()
                    }).then(function (n) {
                        var e = n.term;
                        a([].concat(Object(p.a)(o), [e]))
                    }).catch(console.error)
                }, removeTerm: function (n) {
                    fetch("/dictionary/".concat(n), {method: "DELETE"}).then(function (n) {
                        return n.json()
                    }).then(function () {
                        a(o.filter(function (e) {
                            return e.term !== n
                        }))
                    }).catch(console.error)
                }
            }
        }, h = t(11), b = t.n(h);

        function g() {
            var n = Object(i.a)(["\n  display: flex;\n  flex-direction: row;\n\n  img {\n    flex-shrink: 5;\n  }\n\n  > div {\n    flex-grow: 2;\n    padding: 2em;\n\n    h1 {\n      margin: 0;\n      padding: 0;\n      font-family: Verdana;\n    }\n\n    dl {\n      font-family: Verdana;\n      dt {\n        font-weight: bold;\n        color: #006;\n      }\n      dd {\n        margin-left: 0;\n        margin-bottom: 10px;\n      }\n    }\n\n    form {\n      display: flex;\n      justify-content: space-between;\n      align-items: stretch;\n      input {\n        width: 100%;\n        margin: 0.2em;\n        font-size: 1.2em;\n        padding: 0.2em;\n        border-radius: 0.2em;\n      }\n      button {\n        flex-basis: 150px;\n        margin: 0.2em;\n      }\n    }\n  }\n"]);
            return g = function () {
                return n
            }, n
        }

        u.a.createGlobalStyle = "\n  html, body {\n    margin: 0;\n    padding: 0;\n    background-color: rgb(212, 218, 240);\n  }\n";
        var E = u.a.div(g());
        Object(a.render)(o.a.createElement(function () {
            var n = v(), e = n.definitions, t = n.addTerm, r = n.removeTerm;
            return o.a.createElement(E, null, o.a.createElement("img", {
                src: b.a,
                alt: "skier skiing powder"
            }), o.a.createElement("div", null, o.a.createElement(d, {
                definitions: e,
                onRemoveTerm: r
            }), o.a.createElement(s, {onAddTerm: t})))
        }, null), document.getElementById("root"))
    }
}, [[15, 1, 2]]]);
//# sourceMappingURL=main.828aa341.chunk.js.map