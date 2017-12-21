import { expect } from "chai";
import { inspect } from "util";
import * as colors from "colors";
import { parse, toString, NodeChildren } from "../lib";

function dump(input: string) {
  const { errors, nodes } = parse(input);
  const output = toString(nodes);
  const line = "`".repeat(process.stdout.columns || 80);
  console.log(colors.cyan(line));
  console.log(colors.magenta("A"), inspect(nodes, { depth: 10, colors: true }));
  console.log(colors.magenta("I"), colors.blue(input));
  console.log(colors.magenta("O"), colors.cyan(output));
  if (errors.length > 0) {
    for (const err of errors) {
      console.log(
        colors.magenta("Error"),
        colors.yellow(`[${err.position}]`),
        colors.red(err.message)
      );
    }
  }
  console.log(colors.cyan(line));
}

function assert(html: string, nodes: NodeChildren) {
  if (process.env.DEBUG && String(process.env.DEBUG).indexOf("dump") !== -1) {
    dump(html);
  }
  return expect(parse(html).nodes).to.deep.equal(nodes);
}

describe("@leizm/html-parser", function() {
  it("normal", function() {
    assert("hello world", ["hello world"]);

    assert("<a>", [{ tagName: "a", children: [] }]);

    assert("<a>hello</a>", [{ tagName: "a", children: ["hello"] }]);

    assert("<a href='#' disable>hello</a>", [
      {
        tagName: "a",
        properties: { href: "#", disable: true },
        children: ["hello"]
      }
    ]);

    assert("say <a>hello</a> to you<br>ok", [
      "say ",
      { tagName: "a", children: ["hello"] },
      " to you",
      { tagName: "br" },
      "ok"
    ]);

    assert(
      "start: <div id=1><span>click <a href=here>link</a></span></div> end",
      [
        "start: ",
        {
          tagName: "div",
          properties: { id: "1" },
          children: [
            {
              tagName: "span",
              children: [
                "click ",
                {
                  tagName: "a",
                  properties: { href: "here" },
                  children: ["link"]
                }
              ]
            }
          ]
        },
        " end"
      ]
    );

    assert("<a data='\"'>\"<", [
      { tagName: "a", properties: { data: '"' }, children: ['"'] }
    ]);

    assert("<!--\nThis is a comment\n-->\n<b>comment</b><!--unexpected", [
      {
        tagName: "!--",
        properties: { comment: "\nThis is a comment\n" }
      },
      "\n",
      {
        tagName: "b",
        children: ["comment"]
      },
      {
        tagName: "!--",
        properties: { comment: "unexpected" }
      }
    ]);

    assert("<!doctype html>", [
      {
        tagName: "!doctype",
        properties: {
          html: true
        }
      }
    ]);

    assert(
      '<html><body><h1>Title</h1><div id="main" class="test"><p>Hello<em>world</em>!</p></div></body></html>',
      [
        {
          tagName: "html",
          children: [
            {
              tagName: "body",
              children: [
                {
                  tagName: "h1",
                  children: ["Title"]
                },
                {
                  tagName: "div",
                  properties: {
                    id: "main",
                    class: "test"
                  },
                  children: [
                    {
                      tagName: "p",
                      children: [
                        "Hello",
                        {
                          tagName: "em",
                          children: ["world"]
                        },
                        "!"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    );
  });
});
