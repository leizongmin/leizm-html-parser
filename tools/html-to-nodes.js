const util = require("util");
const parse5 = require("parse5");

const chunks = [];
process.stdin.on("data", (chunk) => {
  chunks.push(chunk);
});
process.stdin.on("end", () => {
  const html = Buffer.concat(chunks).toString();
  start(html);
});

if (process.env.DEBUG_MODE && process.env.DEBUG_MODE == "1") {
  start(process.env.DEBUG_INPUT || "");
}

function start(html) {
  if (!html) {
    console.log('Usage: echo "any html here" | node html-to-nodes');
    process.exit();
  }
  const doc = parse5.parse(html, { locationInfo: true });
  const body = doc.childNodes[0].childNodes[1].childNodes;
  const nodes = transform(body);
  if (nodes[nodes.length - 1].type === "text") {
    nodes[nodes.length - 1].end--;
    nodes[nodes.length - 1].text = nodes[nodes.length - 1].text.slice(0, -1);
  }
  console.log(util.inspect(body, { color: true, depth: 20 }));
  console.log(JSON.stringify(nodes, (k, v) => v, 2));
}

function transform(nodes) {
  const ret = [];
  for (const item of nodes) {
    if (item.nodeName === "#text") {
      ret.push({
        start: item.__location.startOffset,
        end: item.__location.endOffset,
        type: "text",
        text: item.value,
      });
    } else {
      let props = {};
      for (const p of item.attrs) {
        props[p.name] = p.value;
      }
      if (Object.keys(props).length === 0) {
        props = undefined;
      }
      ret.push({
        start: item.__location.startOffset,
        end: item.__location.endOffset,
        type: "tag",
        name: item.nodeName,
        properties: props,
      });
      if (item.childNodes) {
        ret[ret.length - 1].children = transform(item.childNodes);
      }
    }
  }
  return ret;
}
