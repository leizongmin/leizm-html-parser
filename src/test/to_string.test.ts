import { expect } from "chai";
import { toString, parse } from "../lib";

describe("toString()", function() {
  it("Normal", function() {
    expect(
      toString([
        {
          tagName: "!DOCTYPE",
          properties: { html: true }
        },
        {
          tagName: "html",
          children: [
            {
              tagName: "head",
              children: [
                {
                  tagName: "meta",
                  properties: { charset: "utf-8" }
                },
                {
                  tagName: "title",
                  children: ["Hello"]
                }
              ]
            },
            {
              tagName: "body",
              children: [
                {
                  tagName: "h1",
                  children: ["Hello, world!"]
                }
              ]
            }
          ]
        }
      ])
    ).to.equal(
      '<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Hello</title></head><body><h1>Hello, world!</h1></body></html>'
    );
  });

  it("toString(parse())", function() {
    const html =
      '<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Hello</title></head><body><h1>Hello, world!</h1></body></html>';
    expect(toString(parse(html).nodes)).to.equal(html);
  });

  it("<style></style>", function() {
    const html =
      '<style type="text/css"> body { background: #FFF; content: "<a>link</a>" } </style>';
    expect(toString(parse(html).nodes)).to.equal(html);
  });

  it("<script></script>", function() {
    const html =
      '<script src="a.js"></script><script>console.log(alert("hello"))</script>';
    expect(toString(parse(html).nodes)).to.equal(html);
  });

  it("<!-- comments -->", function() {
    const html = "<!-- comments <a>link</a> --><p>link</p>";
    expect(toString(parse(html).nodes)).to.equal(html);
  });

  it("<![CDATA[ data ]]>", function() {
    const html = "<![CDATA[<!-- comments <a>link</a> --><p>link</p>]]>";
    expect(toString(parse(html).nodes)).to.equal(html);
  });

  it("Escape attributes", function() {
    const html = "<a href=\"'<hello>'\">link</a>";
    expect(toString(parse(html).nodes)).to.equal(
      '<a href="&apos;&lt;hello&gt;&apos;">link</a>'
    );
  });
});
