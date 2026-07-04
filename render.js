function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderMarkdownWithMath(raw) {
  var mathBlocks = [];

  var placeholder = raw
    .replace(/\$\$([\s\S]+?)\$\$/g, function (m, expr) {
      mathBlocks.push({ display: true, expr: expr });
      return "@@MATH" + (mathBlocks.length - 1) + "@@";
    })
    .replace(/\$([^\$\n]+?)\$/g, function (m, expr) {
      mathBlocks.push({ display: false, expr: expr });
      return "@@MATH" + (mathBlocks.length - 1) + "@@";
    });

  var html = marked.parse(placeholder);

  html = html.replace(/@@MATH(\d+)@@/g, function (m, idxStr) {
    var b = mathBlocks[parseInt(idxStr, 10)];
    try {
      return katex.renderToString(b.expr, { displayMode: b.display, throwOnError: false });
    } catch (e) {
      return escapeHtml(b.display ? "$$" + b.expr + "$$" : "$" + b.expr + "$");
    }
  });

  return html;
}
