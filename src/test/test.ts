import { expect } from "chai";
import { inspect } from "util";
import * as colors from "colors";
import { parse, toString, NodeChildren } from "../lib";

function dump(input: string) {
  const nodes = parse(input);
  const output = toString(nodes);
  const equal = input === output;
  const line = "`".repeat(process.stdout.columns || 80);
  console.log(colors.cyan(line));
  console.log(colors.magenta("A"), inspect(nodes, { depth: 10, colors: true }));
  console.log(colors.magenta("I"), colors.blue(input));
  console.log(colors.magenta("O"), colors.cyan(output));
  console.log(
    colors.magenta("E"),
    equal ? colors.bgGreen.white("yes") : colors.bgRed.white("no ")
  );
  console.log(colors.cyan(line));
}

function assert(html: string, nodes: NodeChildren) {
  if (process.env.DEBUG && String(process.env.DEBUG).indexOf("dump") !== -1) {
    dump(html);
  }
  return expect(parse(html)).to.deep.equal(nodes);
}

describe("@leizm/html-parser", function() {
  it("normal", function() {
    assert("hello world", ["hello world"]);
    assert("<a>", [{ tagName: "a", children: [] }]);
    assert("<a>hello</a>", [{ tagName: "a", children: ["hello"] }]);
    assert("<a href='#' disable>hello</a>", [
      {
        tagName: "a",
        props: { href: "#", disable: "disable" },
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
          props: { id: "1" },
          children: [
            {
              tagName: "span",
              children: [
                "click ",
                { tagName: "a", props: { href: "here" }, children: ["link"] }
              ]
            }
          ]
        },
        " end"
      ]
    );
    assert("<a data='\"'>\"<", [
      { tagName: "a", props: { data: '"' }, children: ['"'] }
    ]);
    assert("<!--\nThis is a comment\n-->\n<b>comment</b><!--unexpected", [
      {
        tagName: "!--",
        props: { comment: "\nThis is a comment\n" }
      },
      "\n",
      {
        tagName: "b",
        children: ["comment"]
      },
      {
        tagName: "!--",
        props: { comment: "unexpected" }
      }
    ]);
  });
});
