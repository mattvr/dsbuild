// https://esm.sh/v130/marked@6.0.0/denonext/marked.mjs
var ie = (t, n, e) => {
  if (!n.has(t))
    throw TypeError("Cannot " + e);
};
var W = (t, n, e) => {
  if (n.has(t))
    throw TypeError("Cannot add the same private member more than once");
  n instanceof WeakSet ? n.add(t) : n.set(t, e);
};
var U = (t, n, e) => (ie(t, n, "access private method"), e);
function M() {
  return { async: false, baseUrl: null, breaks: false, extensions: null, gfm: true, headerIds: true, headerPrefix: "", highlight: null, hooks: null, langPrefix: "language-", mangle: true, pedantic: false, renderer: null, sanitize: false, sanitizer: null, silent: false, smartypants: false, tokenizer: null, walkTokens: null, xhtml: false };
}
var I = M();
function K(t) {
  I = t;
}
var Y = /[&<>"']/;
var se = new RegExp(Y.source, "g");
var ee = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
var re = new RegExp(ee.source, "g");
var le = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var F = (t) => le[t];
function _(t, n) {
  if (n) {
    if (Y.test(t))
      return t.replace(se, F);
  } else if (ee.test(t))
    return t.replace(re, F);
  return t;
}
var ae = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function te(t) {
  return t.replace(ae, (n, e) => (e = e.toLowerCase(), e === "colon" ? ":" : e.charAt(0) === "#" ? e.charAt(1) === "x" ? String.fromCharCode(parseInt(e.substring(2), 16)) : String.fromCharCode(+e.substring(1)) : ""));
}
var oe = /(^|[^\[])\^/g;
function k(t, n) {
  t = typeof t == "string" ? t : t.source, n = n || "";
  let e = { replace: (i, s) => (s = typeof s == "object" && "source" in s ? s.source : s, s = s.replace(oe, "$1"), t = t.replace(i, s), e), getRegex: () => new RegExp(t, n) };
  return e;
}
var he = /[^\w:]/g;
var ce = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function X(t, n, e) {
  if (t) {
    let i;
    try {
      i = decodeURIComponent(te(e)).replace(he, "").toLowerCase();
    } catch {
      return null;
    }
    if (i.indexOf("javascript:") === 0 || i.indexOf("vbscript:") === 0 || i.indexOf("data:") === 0)
      return null;
  }
  n && !ce.test(e) && (e = ge(n, e));
  try {
    e = encodeURI(e).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return e;
}
var L = {};
var pe = /^[^:]+:\/*[^/]*$/;
var ue = /^([^:]+:)[\s\S]*$/;
var fe = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function ge(t, n) {
  L[" " + t] || (pe.test(t) ? L[" " + t] = t + "/" : L[" " + t] = P(t, "/", true)), t = L[" " + t];
  let e = t.indexOf(":") === -1;
  return n.substring(0, 2) === "//" ? e ? n : t.replace(ue, "$1") + n : n.charAt(0) === "/" ? e ? n : t.replace(fe, "$1") + n : t + n;
}
var Z = { exec: () => null };
function G(t, n) {
  let e = t.replace(/\|/g, (l, r, h) => {
    let c = false, u = r;
    for (; --u >= 0 && h[u] === "\\"; )
      c = !c;
    return c ? "|" : " |";
  }), i = e.split(/ \|/), s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i[i.length - 1].trim() && i.pop(), i.length > n)
    i.splice(n);
  else
    for (; i.length < n; )
      i.push("");
  for (; s < i.length; s++)
    i[s] = i[s].trim().replace(/\\\|/g, "|");
  return i;
}
function P(t, n, e) {
  let i = t.length;
  if (i === 0)
    return "";
  let s = 0;
  for (; s < i; ) {
    let l = t.charAt(i - s - 1);
    if (l === n && !e)
      s++;
    else if (l !== n && e)
      s++;
    else
      break;
  }
  return t.slice(0, i - s);
}
function de(t, n) {
  if (t.indexOf(n[1]) === -1)
    return -1;
  let e = t.length, i = 0, s = 0;
  for (; s < e; s++)
    if (t[s] === "\\")
      s++;
    else if (t[s] === n[0])
      i++;
    else if (t[s] === n[1] && (i--, i < 0))
      return s;
  return -1;
}
function ke(t, n) {
  !t || t.silent || (n && console.warn("marked(): callback is deprecated since version 5.0.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/using_pro#async"), (t.sanitize || t.sanitizer) && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options"), (t.highlight || t.langPrefix !== "language-") && console.warn("marked(): highlight and langPrefix parameters are deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-highlight."), t.mangle && console.warn("marked(): mangle parameter is enabled by default, but is deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install https://www.npmjs.com/package/marked-mangle, or disable by setting `{mangle: false}`."), t.baseUrl && console.warn("marked(): baseUrl parameter is deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-base-url."), t.smartypants && console.warn("marked(): smartypants parameter is deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-smartypants."), t.xhtml && console.warn("marked(): xhtml parameter is deprecated since version 5.0.0, should not be used and will be removed in the future. Instead use https://www.npmjs.com/package/marked-xhtml."), (t.headerIds || t.headerPrefix) && console.warn("marked(): headerIds and headerPrefix parameters enabled by default, but are deprecated since version 5.0.0, and will be removed in the future. To clear this warning, install  https://www.npmjs.com/package/marked-gfm-heading-id, or disable by setting `{headerIds: false}`."));
}
function V(t, n, e, i) {
  let s = n.href, l = n.title ? _(n.title) : null, r = t[1].replace(/\\([\[\]])/g, "$1");
  if (t[0].charAt(0) !== "!") {
    i.state.inLink = true;
    let h = { type: "link", raw: e, href: s, title: l, text: r, tokens: i.inlineTokens(r) };
    return i.state.inLink = false, h;
  }
  return { type: "image", raw: e, href: s, title: l, text: _(r) };
}
function me(t, n) {
  let e = t.match(/^(\s+)(?:```)/);
  if (e === null)
    return n;
  let i = e[1];
  return n.split(`
`).map((s) => {
    let l = s.match(/^\s+/);
    if (l === null)
      return s;
    let [r] = l;
    return r.length >= i.length ? s.slice(i.length) : s;
  }).join(`
`);
}
var q = class {
  constructor(t) {
    this.options = t || I;
  }
  space(t) {
    let n = this.rules.block.newline.exec(t);
    if (n && n[0].length > 0)
      return { type: "space", raw: n[0] };
  }
  code(t) {
    let n = this.rules.block.code.exec(t);
    if (n) {
      let e = n[0].replace(/^ {1,4}/gm, "");
      return { type: "code", raw: n[0], codeBlockStyle: "indented", text: this.options.pedantic ? e : P(e, `
`) };
    }
  }
  fences(t) {
    let n = this.rules.block.fences.exec(t);
    if (n) {
      let e = n[0], i = me(e, n[3] || "");
      return { type: "code", raw: e, lang: n[2] ? n[2].trim().replace(this.rules.inline._escapes, "$1") : n[2], text: i };
    }
  }
  heading(t) {
    let n = this.rules.block.heading.exec(t);
    if (n) {
      let e = n[2].trim();
      if (/#$/.test(e)) {
        let i = P(e, "#");
        (this.options.pedantic || !i || / $/.test(i)) && (e = i.trim());
      }
      return { type: "heading", raw: n[0], depth: n[1].length, text: e, tokens: this.lexer.inline(e) };
    }
  }
  hr(t) {
    let n = this.rules.block.hr.exec(t);
    if (n)
      return { type: "hr", raw: n[0] };
  }
  blockquote(t) {
    let n = this.rules.block.blockquote.exec(t);
    if (n) {
      let e = n[0].replace(/^ *>[ \t]?/gm, ""), i = this.lexer.state.top;
      this.lexer.state.top = true;
      let s = this.lexer.blockTokens(e);
      return this.lexer.state.top = i, { type: "blockquote", raw: n[0], tokens: s, text: e };
    }
  }
  list(t) {
    let n = this.rules.block.list.exec(t);
    if (n) {
      let e, i, s, l, r, h, c, u, g, f, o, x, w = n[1].trim(), S = w.length > 1, m = { type: "list", raw: "", ordered: S, start: S ? +w.slice(0, -1) : "", loose: false, items: [] };
      w = S ? `\\d{1,9}\\${w.slice(-1)}` : `\\${w}`, this.options.pedantic && (w = S ? w : "[*+-]");
      let b = new RegExp(`^( {0,3}${w})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      for (; t && (x = false, !(!(n = b.exec(t)) || this.rules.block.hr.test(t))); ) {
        if (e = n[0], t = t.substring(e.length), u = n[2].split(`
`, 1)[0].replace(/^\t+/, (z) => " ".repeat(3 * z.length)), g = t.split(`
`, 1)[0], this.options.pedantic ? (l = 2, o = u.trimLeft()) : (l = n[2].search(/[^ ]/), l = l > 4 ? 1 : l, o = u.slice(l), l += n[1].length), h = false, !u && /^ *$/.test(g) && (e += g + `
`, t = t.substring(g.length + 1), x = true), !x) {
          let z = new RegExp(`^ {0,${Math.min(3, l - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), y = new RegExp(`^ {0,${Math.min(3, l - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), $ = new RegExp(`^ {0,${Math.min(3, l - 1)}}(?:\`\`\`|~~~)`), E = new RegExp(`^ {0,${Math.min(3, l - 1)}}#`);
          for (; t && (f = t.split(`
`, 1)[0], g = f, this.options.pedantic && (g = g.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), !($.test(g) || E.test(g) || z.test(g) || y.test(t))); ) {
            if (g.search(/[^ ]/) >= l || !g.trim())
              o += `
` + g.slice(l);
            else {
              if (h || u.search(/[^ ]/) >= 4 || $.test(u) || E.test(u) || y.test(u))
                break;
              o += `
` + g;
            }
            !h && !g.trim() && (h = true), e += f + `
`, t = t.substring(f.length + 1), u = g.slice(l);
          }
        }
        m.loose || (c ? m.loose = true : /\n *\n *$/.test(e) && (c = true)), this.options.gfm && (i = /^\[[ xX]\] /.exec(o), i && (s = i[0] !== "[ ] ", o = o.replace(/^\[[ xX]\] +/, ""))), m.items.push({ type: "list_item", raw: e, task: !!i, checked: s, loose: false, text: o }), m.raw += e;
      }
      m.items[m.items.length - 1].raw = e.trimRight(), m.items[m.items.length - 1].text = o.trimRight(), m.raw = m.raw.trimRight();
      let A = m.items.length;
      for (r = 0; r < A; r++)
        if (this.lexer.state.top = false, m.items[r].tokens = this.lexer.blockTokens(m.items[r].text, []), !m.loose) {
          let z = m.items[r].tokens.filter(($) => $.type === "space"), y = z.length > 0 && z.some(($) => /\n.*\n/.test($.raw));
          m.loose = y;
        }
      if (m.loose)
        for (r = 0; r < A; r++)
          m.items[r].loose = true;
      return m;
    }
  }
  html(t) {
    let n = this.rules.block.html.exec(t);
    if (n) {
      let e = { type: "html", block: true, raw: n[0], pre: !this.options.sanitizer && (n[1] === "pre" || n[1] === "script" || n[1] === "style"), text: n[0] };
      if (this.options.sanitize) {
        let i = this.options.sanitizer ? this.options.sanitizer(n[0]) : _(n[0]), s = e;
        s.type = "paragraph", s.text = i, s.tokens = this.lexer.inline(i);
      }
      return e;
    }
  }
  def(t) {
    let n = this.rules.block.def.exec(t);
    if (n) {
      let e = n[1].toLowerCase().replace(/\s+/g, " "), i = n[2] ? n[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "", s = n[3] ? n[3].substring(1, n[3].length - 1).replace(this.rules.inline._escapes, "$1") : n[3];
      return { type: "def", tag: e, raw: n[0], href: i, title: s };
    }
  }
  table(t) {
    let n = this.rules.block.table.exec(t);
    if (n) {
      let e = { type: "table", header: G(n[1]).map((i) => ({ text: i })), align: n[2].replace(/^ *|\| *$/g, "").split(/ *\| */), rows: n[3] && n[3].trim() ? n[3].replace(/\n[ \t]*$/, "").split(`
`) : [] };
      if (e.header.length === e.align.length) {
        e.raw = n[0];
        let i = e.align.length, s, l, r, h;
        for (s = 0; s < i; s++)
          /^ *-+: *$/.test(e.align[s]) ? e.align[s] = "right" : /^ *:-+: *$/.test(e.align[s]) ? e.align[s] = "center" : /^ *:-+ *$/.test(e.align[s]) ? e.align[s] = "left" : e.align[s] = null;
        for (i = e.rows.length, s = 0; s < i; s++)
          e.rows[s] = G(e.rows[s], e.header.length).map((c) => ({ text: c }));
        for (i = e.header.length, l = 0; l < i; l++)
          e.header[l].tokens = this.lexer.inline(e.header[l].text);
        for (i = e.rows.length, l = 0; l < i; l++)
          for (h = e.rows[l], r = 0; r < h.length; r++)
            h[r].tokens = this.lexer.inline(h[r].text);
        return e;
      }
    }
  }
  lheading(t) {
    let n = this.rules.block.lheading.exec(t);
    if (n)
      return { type: "heading", raw: n[0], depth: n[2].charAt(0) === "=" ? 1 : 2, text: n[1], tokens: this.lexer.inline(n[1]) };
  }
  paragraph(t) {
    let n = this.rules.block.paragraph.exec(t);
    if (n) {
      let e = n[1].charAt(n[1].length - 1) === `
` ? n[1].slice(0, -1) : n[1];
      return { type: "paragraph", raw: n[0], text: e, tokens: this.lexer.inline(e) };
    }
  }
  text(t) {
    let n = this.rules.block.text.exec(t);
    if (n)
      return { type: "text", raw: n[0], text: n[0], tokens: this.lexer.inline(n[0]) };
  }
  escape(t) {
    let n = this.rules.inline.escape.exec(t);
    if (n)
      return { type: "escape", raw: n[0], text: _(n[1]) };
  }
  tag(t) {
    let n = this.rules.inline.tag.exec(t);
    if (n)
      return !this.lexer.state.inLink && /^<a /i.test(n[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && /^<\/a>/i.test(n[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(n[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(n[0]) && (this.lexer.state.inRawBlock = false), { type: this.options.sanitize ? "text" : "html", raw: n[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(n[0]) : _(n[0]) : n[0] };
  }
  link(t) {
    let n = this.rules.inline.link.exec(t);
    if (n) {
      let e = n[2].trim();
      if (!this.options.pedantic && /^</.test(e)) {
        if (!/>$/.test(e))
          return;
        let l = P(e.slice(0, -1), "\\");
        if ((e.length - l.length) % 2 === 0)
          return;
      } else {
        let l = de(n[2], "()");
        if (l > -1) {
          let h = (n[0].indexOf("!") === 0 ? 5 : 4) + n[1].length + l;
          n[2] = n[2].substring(0, l), n[0] = n[0].substring(0, h).trim(), n[3] = "";
        }
      }
      let i = n[2], s = "";
      if (this.options.pedantic) {
        let l = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);
        l && (i = l[1], s = l[3]);
      } else
        s = n[3] ? n[3].slice(1, -1) : "";
      return i = i.trim(), /^</.test(i) && (this.options.pedantic && !/>$/.test(e) ? i = i.slice(1) : i = i.slice(1, -1)), V(n, { href: i && i.replace(this.rules.inline._escapes, "$1"), title: s && s.replace(this.rules.inline._escapes, "$1") }, n[0], this.lexer);
    }
  }
  reflink(t, n) {
    let e;
    if ((e = this.rules.inline.reflink.exec(t)) || (e = this.rules.inline.nolink.exec(t))) {
      let i = (e[2] || e[1]).replace(/\s+/g, " ");
      if (i = n[i.toLowerCase()], !i) {
        let s = e[0].charAt(0);
        return { type: "text", raw: s, text: s };
      }
      return V(e, i, e[0], this.lexer);
    }
  }
  emStrong(t, n, e = "") {
    let i = this.rules.inline.emStrong.lDelim.exec(t);
    if (!i || i[3] && e.match(/[\p{L}\p{N}]/u))
      return;
    if (!(i[1] || i[2] || "") || !e || this.rules.inline.punctuation.exec(e)) {
      let l = i[0].length - 1, r, h, c = l, u = 0, g = i[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      for (g.lastIndex = 0, n = n.slice(-1 * t.length + l); (i = g.exec(n)) != null; ) {
        if (r = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !r)
          continue;
        if (h = r.length, i[3] || i[4]) {
          c += h;
          continue;
        } else if ((i[5] || i[6]) && l % 3 && !((l + h) % 3)) {
          u += h;
          continue;
        }
        if (c -= h, c > 0)
          continue;
        h = Math.min(h, h + c + u);
        let f = t.slice(0, l + i.index + h + 1);
        if (Math.min(l, h) % 2) {
          let x = f.slice(1, -1);
          return { type: "em", raw: f, text: x, tokens: this.lexer.inlineTokens(x) };
        }
        let o = f.slice(2, -2);
        return { type: "strong", raw: f, text: o, tokens: this.lexer.inlineTokens(o) };
      }
    }
  }
  codespan(t) {
    let n = this.rules.inline.code.exec(t);
    if (n) {
      let e = n[2].replace(/\n/g, " "), i = /[^ ]/.test(e), s = /^ /.test(e) && / $/.test(e);
      return i && s && (e = e.substring(1, e.length - 1)), e = _(e, true), { type: "codespan", raw: n[0], text: e };
    }
  }
  br(t) {
    let n = this.rules.inline.br.exec(t);
    if (n)
      return { type: "br", raw: n[0] };
  }
  del(t) {
    let n = this.rules.inline.del.exec(t);
    if (n)
      return { type: "del", raw: n[0], text: n[2], tokens: this.lexer.inlineTokens(n[2]) };
  }
  autolink(t, n) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let i, s;
      return e[2] === "@" ? (i = _(this.options.mangle ? n(e[1]) : e[1]), s = "mailto:" + i) : (i = _(e[1]), s = i), { type: "link", raw: e[0], text: i, href: s, tokens: [{ type: "text", raw: i, text: i }] };
    }
  }
  url(t, n) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let i, s;
      if (e[2] === "@")
        i = _(this.options.mangle ? n(e[0]) : e[0]), s = "mailto:" + i;
      else {
        let l;
        do
          l = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])[0];
        while (l !== e[0]);
        i = _(e[0]), e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return { type: "link", raw: e[0], text: i, href: s, tokens: [{ type: "text", raw: i, text: i }] };
    }
  }
  inlineText(t, n) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let i;
      return this.lexer.state.inRawBlock ? i = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : _(e[0]) : e[0] : i = _(this.options.smartypants ? n(e[0]) : e[0]), { type: "text", raw: e[0], text: i };
    }
  }
};
var p = { newline: /^(?: *(?:\n|$))+/, code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/, fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/, list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/, html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/, table: Z, lheading: /^((?:(?!^bull ).|\n(?!\n|bull ))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, text: /^[^\n]+/ };
p._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
p._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
p.def = k(p.def).replace("label", p._label).replace("title", p._title).getRegex();
p.bullet = /(?:[*+-]|\d{1,9}[.)])/;
p.listItemStart = k(/^( *)(bull) */).replace("bull", p.bullet).getRegex();
p.list = k(p.list).replace(/bull/g, p.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + p.def.source + ")").getRegex();
p._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
p._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
p.html = k(p.html, "i").replace("comment", p._comment).replace("tag", p._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
p.lheading = k(p.lheading).replace(/bull/g, p.bullet).getRegex();
p.paragraph = k(p._paragraph).replace("hr", p.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", p._tag).getRegex();
p.blockquote = k(p.blockquote).replace("paragraph", p.paragraph).getRegex();
p.normal = { ...p };
p.gfm = { ...p.normal, table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)" };
p.gfm.table = k(p.gfm.table).replace("hr", p.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", p._tag).getRegex();
p.gfm.paragraph = k(p._paragraph).replace("hr", p.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", p.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", p._tag).getRegex();
p.pedantic = { ...p.normal, html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", p._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Z, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k(p.normal._paragraph).replace("hr", p.hr).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", p.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex() };
var a = { escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/, url: Z, tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/, reflink: /^!?\[(label)\]\[(ref)\]/, nolink: /^!?\[(ref)\](?:\[\])?/, reflinkSearch: "reflink|nolink(?!\\()", emStrong: { lDelim: /^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, rDelimAst: /^[^_*]*?__[^_*]*?\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\*)[punct](\*+)(?=[\s]|$)|[^punct\s](\*+)(?!\*)(?=[punct\s]|$)|(?!\*)[punct\s](\*+)(?=[^punct\s])|[\s](\*+)(?!\*)(?=[punct])|(?!\*)[punct](\*+)(?!\*)(?=[punct])|[^punct\s](\*+)(?=[^punct\s])/, rDelimUnd: /^[^_*]*?\*\*[^_*]*?_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\s]|$)|[^punct\s](_+)(?!_)(?=[punct\s]|$)|(?!_)[punct\s](_+)(?=[^punct\s])|[\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])/ }, code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, br: /^( {2,}|\\)\n(?!\s*$)/, del: Z, text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, punctuation: /^((?![*_])[\spunctuation])/ };
a._punctuation = "\\p{P}$+<=>`^|~";
a.punctuation = k(a.punctuation, "u").replace(/punctuation/g, a._punctuation).getRegex();
a.blockSkip = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g;
a.anyPunctuation = /\\[punct]/g;
a._escapes = /\\([punct])/g;
a._comment = k(p._comment).replace("(?:-->|$)", "-->").getRegex();
a.emStrong.lDelim = k(a.emStrong.lDelim, "u").replace(/punct/g, a._punctuation).getRegex();
a.emStrong.rDelimAst = k(a.emStrong.rDelimAst, "gu").replace(/punct/g, a._punctuation).getRegex();
a.emStrong.rDelimUnd = k(a.emStrong.rDelimUnd, "gu").replace(/punct/g, a._punctuation).getRegex();
a.anyPunctuation = k(a.anyPunctuation, "gu").replace(/punct/g, a._punctuation).getRegex();
a._escapes = k(a._escapes, "gu").replace(/punct/g, a._punctuation).getRegex();
a._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
a._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
a.autolink = k(a.autolink).replace("scheme", a._scheme).replace("email", a._email).getRegex();
a._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
a.tag = k(a.tag).replace("comment", a._comment).replace("attribute", a._attribute).getRegex();
a._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
a._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
a._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
a.link = k(a.link).replace("label", a._label).replace("href", a._href).replace("title", a._title).getRegex();
a.reflink = k(a.reflink).replace("label", a._label).replace("ref", p._label).getRegex();
a.nolink = k(a.nolink).replace("ref", p._label).getRegex();
a.reflinkSearch = k(a.reflinkSearch, "g").replace("reflink", a.reflink).replace("nolink", a.nolink).getRegex();
a.normal = { ...a };
a.pedantic = { ...a.normal, strong: { start: /^__|\*\*/, middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/, endAst: /\*\*(?!\*)/g, endUnd: /__(?!_)/g }, em: { start: /^_|\*/, middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/, endAst: /\*(?!\*)/g, endUnd: /_(?!_)/g }, link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", a._label).getRegex(), reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", a._label).getRegex() };
a.gfm = { ...a.normal, escape: k(a.escape).replace("])", "~|])").getRegex(), _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/, url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/, text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/ };
a.gfm.url = k(a.gfm.url, "i").replace("email", a.gfm._extended_email).getRegex();
a.breaks = { ...a.gfm, br: k(a.br).replace("{2,}", "*").getRegex(), text: k(a.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
function xe(t) {
  return t.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
}
function J(t) {
  let n = "", e, i, s = t.length;
  for (e = 0; e < s; e++)
    i = t.charCodeAt(e), Math.random() > 0.5 && (i = "x" + i.toString(16)), n += "&#" + i + ";";
  return n;
}
var T = class {
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || I, this.options.tokenizer = this.options.tokenizer || new q(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let n = { block: p.normal, inline: a.normal };
    this.options.pedantic ? (n.block = p.pedantic, n.inline = a.pedantic) : this.options.gfm && (n.block = p.gfm, this.options.breaks ? n.inline = a.breaks : n.inline = a.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: p, inline: a };
  }
  static lex(t, n) {
    return new T(n).lex(t);
  }
  static lexInline(t, n) {
    return new T(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(/\r\n|\r/g, `
`), this.blockTokens(t, this.tokens);
    let n;
    for (; n = this.inlineQueue.shift(); )
      this.inlineTokens(n.src, n.tokens);
    return this.tokens;
  }
  blockTokens(t, n = []) {
    this.options.pedantic ? t = t.replace(/\t/g, "    ").replace(/^ +$/gm, "") : t = t.replace(/^( *)(\t+)/gm, (r, h, c) => h + "    ".repeat(c.length));
    let e, i, s, l;
    for (; t; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((r) => (e = r.call({ lexer: this }, t, n)) ? (t = t.substring(e.raw.length), n.push(e), true) : false))) {
        if (e = this.tokenizer.space(t)) {
          t = t.substring(e.raw.length), e.raw.length === 1 && n.length > 0 ? n[n.length - 1].raw += `
` : n.push(e);
          continue;
        }
        if (e = this.tokenizer.code(t)) {
          t = t.substring(e.raw.length), i = n[n.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + e.raw, i.text += `
` + e.text, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : n.push(e);
          continue;
        }
        if (e = this.tokenizer.fences(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.heading(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.hr(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.blockquote(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.list(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.html(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.def(t)) {
          t = t.substring(e.raw.length), i = n[n.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + e.raw, i.text += `
` + e.raw, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : this.tokens.links[e.tag] || (this.tokens.links[e.tag] = { href: e.href, title: e.title });
          continue;
        }
        if (e = this.tokenizer.table(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.lheading(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (s = t, this.options.extensions && this.options.extensions.startBlock) {
          let r = 1 / 0, h = t.slice(1), c;
          this.options.extensions.startBlock.forEach((u) => {
            c = u.call({ lexer: this }, h), typeof c == "number" && c >= 0 && (r = Math.min(r, c));
          }), r < 1 / 0 && r >= 0 && (s = t.substring(0, r + 1));
        }
        if (this.state.top && (e = this.tokenizer.paragraph(s))) {
          i = n[n.length - 1], l && i.type === "paragraph" ? (i.raw += `
` + e.raw, i.text += `
` + e.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : n.push(e), l = s.length !== t.length, t = t.substring(e.raw.length);
          continue;
        }
        if (e = this.tokenizer.text(t)) {
          t = t.substring(e.raw.length), i = n[n.length - 1], i && i.type === "text" ? (i.raw += `
` + e.raw, i.text += `
` + e.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : n.push(e);
          continue;
        }
        if (t) {
          let r = "Infinite loop on byte: " + t.charCodeAt(0);
          if (this.options.silent) {
            console.error(r);
            break;
          } else
            throw new Error(r);
        }
      }
    return this.state.top = true, n;
  }
  inline(t, n = []) {
    return this.inlineQueue.push({ src: t, tokens: n }), n;
  }
  inlineTokens(t, n = []) {
    let e, i, s, l = t, r, h, c;
    if (this.tokens.links) {
      let u = Object.keys(this.tokens.links);
      if (u.length > 0)
        for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(l)) != null; )
          u.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (l = l.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(l)) != null; )
      l = l.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(l)) != null; )
      l = l.slice(0, r.index) + "++" + l.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; t; )
      if (h || (c = ""), h = false, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((u) => (e = u.call({ lexer: this }, t, n)) ? (t = t.substring(e.raw.length), n.push(e), true) : false))) {
        if (e = this.tokenizer.escape(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.tag(t)) {
          t = t.substring(e.raw.length), i = n[n.length - 1], i && e.type === "text" && i.type === "text" ? (i.raw += e.raw, i.text += e.text) : n.push(e);
          continue;
        }
        if (e = this.tokenizer.link(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.reflink(t, this.tokens.links)) {
          t = t.substring(e.raw.length), i = n[n.length - 1], i && e.type === "text" && i.type === "text" ? (i.raw += e.raw, i.text += e.text) : n.push(e);
          continue;
        }
        if (e = this.tokenizer.emStrong(t, l, c)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.codespan(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.br(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.del(t)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (e = this.tokenizer.autolink(t, J)) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (!this.state.inLink && (e = this.tokenizer.url(t, J))) {
          t = t.substring(e.raw.length), n.push(e);
          continue;
        }
        if (s = t, this.options.extensions && this.options.extensions.startInline) {
          let u = 1 / 0, g = t.slice(1), f;
          this.options.extensions.startInline.forEach((o) => {
            f = o.call({ lexer: this }, g), typeof f == "number" && f >= 0 && (u = Math.min(u, f));
          }), u < 1 / 0 && u >= 0 && (s = t.substring(0, u + 1));
        }
        if (e = this.tokenizer.inlineText(s, xe)) {
          t = t.substring(e.raw.length), e.raw.slice(-1) !== "_" && (c = e.raw.slice(-1)), h = true, i = n[n.length - 1], i && i.type === "text" ? (i.raw += e.raw, i.text += e.text) : n.push(e);
          continue;
        }
        if (t) {
          let u = "Infinite loop on byte: " + t.charCodeAt(0);
          if (this.options.silent) {
            console.error(u);
            break;
          } else
            throw new Error(u);
        }
      }
    return n;
  }
};
var B = class {
  constructor(t) {
    this.options = t || I;
  }
  code(t, n, e) {
    let i = (n || "").match(/\S*/)[0];
    if (this.options.highlight) {
      let s = this.options.highlight(t, i);
      s != null && s !== t && (e = true, t = s);
    }
    return t = t.replace(/\n$/, "") + `
`, i ? '<pre><code class="' + this.options.langPrefix + _(i) + '">' + (e ? t : _(t, true)) + `</code></pre>
` : "<pre><code>" + (e ? t : _(t, true)) + `</code></pre>
`;
  }
  blockquote(t) {
    return `<blockquote>
${t}</blockquote>
`;
  }
  html(t, n) {
    return t;
  }
  heading(t, n, e, i) {
    if (this.options.headerIds) {
      let s = this.options.headerPrefix + i.slug(e);
      return `<h${n} id="${s}">${t}</h${n}>
`;
    }
    return `<h${n}>${t}</h${n}>
`;
  }
  hr() {
    return this.options.xhtml ? `<hr/>
` : `<hr>
`;
  }
  list(t, n, e) {
    let i = n ? "ol" : "ul", s = n && e !== 1 ? ' start="' + e + '"' : "";
    return "<" + i + s + `>
` + t + "</" + i + `>
`;
  }
  listitem(t, n, e) {
    return `<li>${t}</li>
`;
  }
  checkbox(t) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
  }
  paragraph(t) {
    return `<p>${t}</p>
`;
  }
  table(t, n) {
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + n + `</table>
`;
  }
  tablerow(t) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t, n) {
    let e = n.header ? "th" : "td";
    return (n.align ? `<${e} align="${n.align}">` : `<${e}>`) + t + `</${e}>
`;
  }
  strong(t) {
    return `<strong>${t}</strong>`;
  }
  em(t) {
    return `<em>${t}</em>`;
  }
  codespan(t) {
    return `<code>${t}</code>`;
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  del(t) {
    return `<del>${t}</del>`;
  }
  link(t, n, e) {
    if (t = X(this.options.sanitize, this.options.baseUrl, t), t === null)
      return e;
    let i = '<a href="' + t + '"';
    return n && (i += ' title="' + n + '"'), i += ">" + e + "</a>", i;
  }
  image(t, n, e) {
    if (t = X(this.options.sanitize, this.options.baseUrl, t), t === null)
      return e;
    let i = `<img src="${t}" alt="${e}"`;
    return n && (i += ` title="${n}"`), i += this.options.xhtml ? "/>" : ">", i;
  }
  text(t) {
    return t;
  }
};
var O = class {
  strong(t) {
    return t;
  }
  em(t) {
    return t;
  }
  codespan(t) {
    return t;
  }
  del(t) {
    return t;
  }
  html(t) {
    return t;
  }
  text(t) {
    return t;
  }
  link(t, n, e) {
    return "" + e;
  }
  image(t, n, e) {
    return "" + e;
  }
  br() {
    return "";
  }
};
var Q = class {
  constructor() {
    this.seen = {};
  }
  serialize(t) {
    return t.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
  }
  getNextSafeSlug(t, n) {
    let e = t, i = 0;
    if (this.seen.hasOwnProperty(e)) {
      i = this.seen[t];
      do
        i++, e = t + "-" + i;
      while (this.seen.hasOwnProperty(e));
    }
    return n || (this.seen[t] = i, this.seen[e] = 0), e;
  }
  slug(t, n = {}) {
    let e = this.serialize(t);
    return this.getNextSafeSlug(e, n.dryrun);
  }
};
var R = class {
  constructor(t) {
    this.options = t || I, this.options.renderer = this.options.renderer || new B(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new O(), this.slugger = new Q();
  }
  static parse(t, n) {
    return new R(n).parse(t);
  }
  static parseInline(t, n) {
    return new R(n).parseInline(t);
  }
  parse(t, n = true) {
    let e = "", i, s, l, r, h, c, u, g, f, o, x, w, S, m, b, A, z, y, $, E = t.length;
    for (i = 0; i < E; i++) {
      if (o = t[i], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[o.type] && ($ = this.options.extensions.renderers[o.type].call({ parser: this }, o), $ !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(o.type))) {
        e += $ || "";
        continue;
      }
      switch (o.type) {
        case "space":
          continue;
        case "hr": {
          e += this.renderer.hr();
          continue;
        }
        case "heading": {
          e += this.renderer.heading(this.parseInline(o.tokens), o.depth, te(this.parseInline(o.tokens, this.textRenderer)), this.slugger);
          continue;
        }
        case "code": {
          e += this.renderer.code(o.text, o.lang, !!o.escaped);
          continue;
        }
        case "table": {
          for (g = "", u = "", r = o.header.length, s = 0; s < r; s++)
            u += this.renderer.tablecell(this.parseInline(o.header[s].tokens), { header: true, align: o.align[s] });
          for (g += this.renderer.tablerow(u), f = "", r = o.rows.length, s = 0; s < r; s++) {
            for (c = o.rows[s], u = "", h = c.length, l = 0; l < h; l++)
              u += this.renderer.tablecell(this.parseInline(c[l].tokens), { header: false, align: o.align[l] });
            f += this.renderer.tablerow(u);
          }
          e += this.renderer.table(g, f);
          continue;
        }
        case "blockquote": {
          f = this.parse(o.tokens), e += this.renderer.blockquote(f);
          continue;
        }
        case "list": {
          for (x = o.ordered, w = o.start, S = o.loose, r = o.items.length, f = "", s = 0; s < r; s++)
            b = o.items[s], A = b.checked, z = b.task, m = "", b.task && (y = this.renderer.checkbox(!!A), S ? b.tokens.length > 0 && b.tokens[0].type === "paragraph" ? (b.tokens[0].text = y + " " + b.tokens[0].text, b.tokens[0].tokens && b.tokens[0].tokens.length > 0 && b.tokens[0].tokens[0].type === "text" && (b.tokens[0].tokens[0].text = y + " " + b.tokens[0].tokens[0].text)) : b.tokens.unshift({ type: "text", text: y }) : m += y), m += this.parse(b.tokens, S), f += this.renderer.listitem(m, z, !!A);
          e += this.renderer.list(f, x, w);
          continue;
        }
        case "html": {
          e += this.renderer.html(o.text, o.block);
          continue;
        }
        case "paragraph": {
          e += this.renderer.paragraph(this.parseInline(o.tokens));
          continue;
        }
        case "text": {
          for (f = o.tokens ? this.parseInline(o.tokens) : o.text; i + 1 < E && t[i + 1].type === "text"; )
            o = t[++i], f += `
` + (o.tokens ? this.parseInline(o.tokens) : o.text);
          e += n ? this.renderer.paragraph(f) : f;
          continue;
        }
        default: {
          let H = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent)
            return console.error(H), "";
          throw new Error(H);
        }
      }
    }
    return e;
  }
  parseInline(t, n) {
    n = n || this.renderer;
    let e = "", i, s, l, r = t.length;
    for (i = 0; i < r; i++) {
      if (s = t[i], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[s.type] && (l = this.options.extensions.renderers[s.type].call({ parser: this }, s), l !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type))) {
        e += l || "";
        continue;
      }
      switch (s.type) {
        case "escape": {
          e += n.text(s.text);
          break;
        }
        case "html": {
          e += n.html(s.text);
          break;
        }
        case "link": {
          e += n.link(s.href, s.title, this.parseInline(s.tokens, n));
          break;
        }
        case "image": {
          e += n.image(s.href, s.title, s.text);
          break;
        }
        case "strong": {
          e += n.strong(this.parseInline(s.tokens, n));
          break;
        }
        case "em": {
          e += n.em(this.parseInline(s.tokens, n));
          break;
        }
        case "codespan": {
          e += n.codespan(s.text);
          break;
        }
        case "br": {
          e += n.br();
          break;
        }
        case "del": {
          e += n.del(this.parseInline(s.tokens, n));
          break;
        }
        case "text": {
          e += n.text(s.text);
          break;
        }
        default: {
          let h = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent)
            return console.error(h), "";
          throw new Error(h);
        }
      }
    }
    return e;
  }
};
var C = class {
  constructor(t) {
    this.options = t || I;
  }
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
};
C.passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess"]);
var D;
var j;
var N;
var ne;
var we = class {
  constructor(...t) {
    W(this, D), W(this, N), this.defaults = M(), this.options = this.setOptions, this.parse = U(this, D, j).call(this, T.lex, R.parse), this.parseInline = U(this, D, j).call(this, T.lexInline, R.parseInline), this.Parser = R, this.parser = R.parse, this.Renderer = B, this.TextRenderer = O, this.Lexer = T, this.lexer = T.lex, this.Tokenizer = q, this.Slugger = Q, this.Hooks = C, this.use(...t);
  }
  walkTokens(t, n) {
    let e = [];
    for (let i of t)
      switch (e = e.concat(n.call(this, i)), i.type) {
        case "table": {
          for (let s of i.header)
            e = e.concat(this.walkTokens(s.tokens, n));
          for (let s of i.rows)
            for (let l of s)
              e = e.concat(this.walkTokens(l.tokens, n));
          break;
        }
        case "list": {
          e = e.concat(this.walkTokens(i.items, n));
          break;
        }
        default:
          this.defaults.extensions && this.defaults.extensions.childTokens && this.defaults.extensions.childTokens[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
            e = e.concat(this.walkTokens(i[s], n));
          }) : i.tokens && (e = e.concat(this.walkTokens(i.tokens, n)));
      }
    return e;
  }
  use(...t) {
    let n = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((e) => {
      let i = { ...e };
      if (i.async = this.defaults.async || i.async || false, e.extensions && (e.extensions.forEach((s) => {
        if (!s.name)
          throw new Error("extension name required");
        if ("renderer" in s) {
          let l = n.renderers[s.name];
          l ? n.renderers[s.name] = function(...r) {
            let h = s.renderer.apply(this, r);
            return h === false && (h = l.apply(this, r)), h;
          } : n.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          n[s.level] ? n[s.level].unshift(s.tokenizer) : n[s.level] = [s.tokenizer], s.start && (s.level === "block" ? n.startBlock ? n.startBlock.push(s.start) : n.startBlock = [s.start] : s.level === "inline" && (n.startInline ? n.startInline.push(s.start) : n.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (n.childTokens[s.name] = s.childTokens);
      }), i.extensions = n), e.renderer) {
        let s = this.defaults.renderer || new B(this.defaults);
        for (let l in e.renderer) {
          let r = s[l];
          s[l] = (...h) => {
            let c = e.renderer[l].apply(s, h);
            return c === false && (c = r.apply(s, h)), c;
          };
        }
        i.renderer = s;
      }
      if (e.tokenizer) {
        let s = this.defaults.tokenizer || new q(this.defaults);
        for (let l in e.tokenizer) {
          let r = s[l];
          s[l] = (...h) => {
            let c = e.tokenizer[l].apply(s, h);
            return c === false && (c = r.apply(s, h)), c;
          };
        }
        i.tokenizer = s;
      }
      if (e.hooks) {
        let s = this.defaults.hooks || new C();
        for (let l in e.hooks) {
          let r = s[l];
          C.passThroughHooks.has(l) ? s[l] = (h) => {
            if (this.defaults.async)
              return Promise.resolve(e.hooks[l].call(s, h)).then((u) => r.call(s, u));
            let c = e.hooks[l].call(s, h);
            return r.call(s, c);
          } : s[l] = (...h) => {
            let c = e.hooks[l].apply(s, h);
            return c === false && (c = r.apply(s, h)), c;
          };
        }
        i.hooks = s;
      }
      if (e.walkTokens) {
        let s = this.defaults.walkTokens;
        i.walkTokens = function(l) {
          let r = [];
          return r.push(e.walkTokens.call(this, l)), s && (r = r.concat(s.call(this, l))), r;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
};
D = /* @__PURE__ */ new WeakSet();
j = function(t, n) {
  return (e, i, s) => {
    typeof i == "function" && (s = i, i = null);
    let l = { ...i }, r = { ...this.defaults, ...l }, h = U(this, N, ne).call(this, !!r.silent, !!r.async, s);
    if (typeof e > "u" || e === null)
      return h(new Error("marked(): input parameter is undefined or null"));
    if (typeof e != "string")
      return h(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
    if (ke(r, s), r.hooks && (r.hooks.options = r), s) {
      let c = r.highlight, u;
      try {
        r.hooks && (e = r.hooks.preprocess(e)), u = t(e, r);
      } catch (o) {
        return h(o);
      }
      let g = (o) => {
        let x;
        if (!o)
          try {
            r.walkTokens && this.walkTokens(u, r.walkTokens), x = n(u, r), r.hooks && (x = r.hooks.postprocess(x));
          } catch (w) {
            o = w;
          }
        return r.highlight = c, o ? h(o) : s(null, x);
      };
      if (!c || c.length < 3 || (delete r.highlight, !u.length))
        return g();
      let f = 0;
      this.walkTokens(u, (o) => {
        o.type === "code" && (f++, setTimeout(() => {
          c(o.text, o.lang, (x, w) => {
            if (x)
              return g(x);
            w != null && w !== o.text && (o.text = w, o.escaped = true), f--, f === 0 && g();
          });
        }, 0));
      }), f === 0 && g();
      return;
    }
    if (r.async)
      return Promise.resolve(r.hooks ? r.hooks.preprocess(e) : e).then((c) => t(c, r)).then((c) => r.walkTokens ? Promise.all(this.walkTokens(c, r.walkTokens)).then(() => c) : c).then((c) => n(c, r)).then((c) => r.hooks ? r.hooks.postprocess(c) : c).catch(h);
    try {
      r.hooks && (e = r.hooks.preprocess(e));
      let c = t(e, r);
      r.walkTokens && this.walkTokens(c, r.walkTokens);
      let u = n(c, r);
      return r.hooks && (u = r.hooks.postprocess(u)), u;
    } catch (c) {
      return h(c);
    }
  };
};
N = /* @__PURE__ */ new WeakSet();
ne = function(t, n, e) {
  return (i) => {
    if (i.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
      let s = "<p>An error occurred:</p><pre>" + _(i.message + "", true) + "</pre>";
      if (n)
        return Promise.resolve(s);
      if (e) {
        e(null, s);
        return;
      }
      return s;
    }
    if (n)
      return Promise.reject(i);
    if (e) {
      e(i);
      return;
    }
    throw i;
  };
};
var v = new we();
function d(t, n, e) {
  return v.parse(t, n, e);
}
d.options = d.setOptions = function(t) {
  return v.setOptions(t), d.defaults = v.defaults, K(d.defaults), d;
};
d.getDefaults = M;
d.defaults = I;
d.use = function(...t) {
  return v.use(...t), d.defaults = v.defaults, K(d.defaults), d;
};
d.walkTokens = function(t, n) {
  return v.walkTokens(t, n);
};
d.parseInline = v.parseInline;
d.Parser = R;
d.parser = R.parse;
d.Renderer = B;
d.TextRenderer = O;
d.Lexer = T;
d.lexer = T.lex;
d.Tokenizer = q;
d.Slugger = Q;
d.Hooks = C;
d.parse = d;
var be = d.options;
var _e = d.setOptions;
var ye = d.use;
var $e = d.walkTokens;
var ze = d.parseInline;
var Re = R.parse;
var Se = T.lex;

// src/app.ts
window.onload = () => {
  const str = `# \u{1FA90} sup, universe!

This page is rendered with **marked** and compiled using \`dsbuild\`.
`;
  document.body.innerHTML = d(str);
};
