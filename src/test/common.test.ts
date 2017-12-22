import { assert } from "./utils";

describe("Commmon", function() {
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

  it("doctype", function() {
    assert("<!DOCTYPE html>", [
      {
        tagName: "!DOCTYPE",
        properties: {
          html: true
        }
      }
    ]);

    assert('<!DOCTYPE html SYSTEM "about:legacy-compat">', [
      {
        tagName: "!DOCTYPE",
        properties: {
          html: true,
          SYSTEM: true,
          '"about:legacy-compat"': true
        }
      }
    ]);

    assert("<!DOCTYPE html SYSTEM 'about:legacy-compat'>", [
      {
        tagName: "!DOCTYPE",
        properties: {
          html: true,
          SYSTEM: true,
          '"about:legacy-compat"': true
        }
      }
    ]);
  });

  it("comments", function() {
    assert("this is <!--comments<a href=#>link</a><!-- hello --> end", [
      "this is ",
      {
        tagName: "!--",
        properties: {
          comment: "comments<a href=#>link</a><!-- hello "
        }
      },
      " end"
    ]);
  });

  it("void tags", function() {
    assert(
      "<input disabled><area><base href='#'><br><col><embed><hr><img src='#' title='this is img'><link href='#'><meta charset='utf-8'><param name=a><source src='##'><track><wbr>",
      [
        {
          tagName: "input",
          properties: { disabled: true }
        },
        {
          tagName: "area"
        },
        {
          tagName: "base",
          properties: { href: "#" }
        },
        {
          tagName: "br"
        },
        {
          tagName: "col"
        },
        {
          tagName: "embed"
        },
        {
          tagName: "hr"
        },
        {
          tagName: "img",
          properties: { src: "#", title: "this is img" }
        },
        {
          tagName: "link",
          properties: { href: "#" }
        },
        {
          tagName: "meta",
          properties: { charset: "utf-8" }
        },
        {
          tagName: "param",
          properties: { name: "a" }
        },
        {
          tagName: "source",
          properties: { src: "##" }
        },
        {
          tagName: "track"
        },
        {
          tagName: "wbr"
        }
      ]
    );
  });
});
