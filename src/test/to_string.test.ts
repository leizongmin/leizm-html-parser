import { expect } from "chai";
import { toString, parse } from "../lib";
import * as colors from "colors";
import { inspect } from "util";
import { enableDump, PAGING, textHasMulitLines, showInvisibleText } from "./utils";

function assert(source: string, expected: string) {
  const ret = parse(source);
  const actual = toString(ret.nodes);
  if (enableDump) {
    console.log(colors.cyan(PAGING));
    console.log(colors.blue(inspect(ret.nodes, { depth: 10, colors: true })));
    console.log(
      colors.magenta("source:  "),
      (textHasMulitLines(source) ? "\n" : "") + colors.blue(showInvisibleText(source)),
    );
    console.log(
      colors.magenta("actual:  "),
      (textHasMulitLines(actual) ? "\n" : "") + colors.yellow(showInvisibleText(actual)),
    );
    console.log(
      colors.magenta("expected:"),
      (textHasMulitLines(expected) ? "\n" : "") + colors.cyan(showInvisibleText(expected)),
    );
    console.log(colors.cyan(PAGING));
  }
  expect(actual).to.equal(expected);
}

describe("toString()", function () {
  it("Normal", function () {
    expect(
      toString([
        {
          type: "tag",
          name: "!DOCTYPE",
          properties: { html: true },
        },
        {
          type: "tag",
          name: "html",
          children: [
            {
              type: "tag",
              name: "head",
              children: [
                {
                  type: "tag",
                  name: "meta",
                  properties: { charset: "utf-8" },
                },
                {
                  type: "tag",
                  name: "title",
                  children: [{ type: "text", text: "Hello" }],
                },
              ],
            },
            {
              type: "tag",
              name: "body",
              children: [
                {
                  type: "tag",
                  name: "h1",
                  children: [{ type: "text", text: "Hello, world!" }],
                },
              ],
            },
          ],
        },
      ]),
    ).to.equal(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hello</title></head><body><h1>Hello, world!</h1></body></html>',
    );
  });

  it("toString(parse())", function () {
    const html =
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hello</title></head><body><h1>Hello, world!</h1></body></html>';
    assert(html, html);
  });

  it("<style></style>", function () {
    const html = '<style type="text/css"> body { background: #FFF; content: "<a>link</a>" } </style>';
    assert(html, html);
  });

  it("<script></script>", function () {
    const html = '<script src="a.js"></script><script>console.log(alert("hello"))</script>';
    assert(html, html);
  });

  it("<!-- comments -->", function () {
    const html = "<!-- comments <a>link</a> --><p>link</p>";
    assert(html, html);
  });

  it("<![CDATA[ data ]]>", function () {
    const html = "<![CDATA[<!-- comments <a>link</a> --><p>link</p>]]>";
    assert(html, html);
  });

  it("Escape attributes", function () {
    const html = "<a href=\"'<hello>'\">link</a>";
    assert(html, '<a href="&apos;&lt;hello&gt;&apos;">link</a>');
  });

  it("Void tags has no slash <img src=#>", function () {
    const html = "<img src=#1><img src=#2 />";
    assert(html, '<img src="#1"><img src="#2">');
  });

  it("Self-closing tags keep slash <tag a=# />", function () {
    const html = "<tag a=# /><tag b=# />";
    assert(html, '<tag a="#" /><tag b="#" />');
  });

  it("Non-void tags with self-closing <a /><b />", function () {
    const html = "<a /><b />";
    assert(html, "<a></a><b></b>");
  });
});
