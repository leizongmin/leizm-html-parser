import { assert } from "./utils";

describe("Commmon", function() {
  it("Normal", function() {
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

    assert("<!doctype html>", [
      {
        tagName: "!DOCTYPE",
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

  it("Namespace tag name syntax", function() {
    assert('<xml:lang value="zh-cn" />', [
      {
        tagName: "xml:lang",
        properties: { value: "zh-cn" }
      }
    ]);
  });

  it("DOCTYPE", function() {
    assert("<!doctype html>", [
      {
        tagName: "!DOCTYPE",
        properties: {
          html: true
        }
      }
    ]);

    assert('<!doctype html SYSTEM "about:legacy-compat">', [
      {
        tagName: "!DOCTYPE",
        properties: {
          html: true,
          SYSTEM: true,
          '"about:legacy-compat"': true
        }
      }
    ]);

    assert("<!doctype html SYSTEM 'about:legacy-compat'>", [
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
});
