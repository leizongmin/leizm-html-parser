import { strictAssert as assert } from "./utils";

describe("Commmon", function() {
  it("Normal", function() {
    assert("hello world", [
      { start: 0, end: 11, type: "text", text: "hello world" }
    ]);

    assert("<a>", [{ start: 0, end: 3, type: "tag", name: "a", children: [] }]);

    assert("<a>hello</a>", [
      {
        start: 0,
        end: 12,
        type: "tag",
        name: "a",
        children: [{ start: 3, end: 8, type: "text", text: "hello" }]
      }
    ]);

    assert("<a href='#' disable>hello</a>", [
      {
        start: 0,
        end: 29,
        type: "tag",
        name: "a",
        properties: { href: "#", disable: true },
        children: [{ start: 20, end: 25, type: "text", text: "hello" }]
      }
    ]);

    assert("say <a>hello</a> to you<br>ok", [
      { start: 0, end: 4, type: "text", text: "say " },
      {
        start: 4,
        end: 16,
        type: "tag",
        name: "a",
        children: [{ start: 7, end: 12, type: "text", text: "hello" }]
      },
      { start: 16, end: 23, type: "text", text: " to you" },
      { start: 23, end: 27, type: "tag", name: "br" },
      { start: 27, end: 29, type: "text", text: "ok" }
    ]);

    assert(
      "start: <div id=1><span>click <a href=here>link</a></span></div> end",
      [
        {
          start: 0,
          end: 7,
          type: "text",
          text: "start: "
        },
        {
          start: 7,
          end: 63,
          type: "tag",
          name: "div",
          properties: {
            id: "1"
          },
          children: [
            {
              start: 17,
              end: 57,
              type: "tag",
              name: "span",
              children: [
                {
                  start: 23,
                  end: 29,
                  type: "text",
                  text: "click "
                },
                {
                  start: 29,
                  end: 50,
                  type: "tag",
                  name: "a",
                  properties: {
                    href: "here"
                  },
                  children: [
                    {
                      start: 42,
                      end: 46,
                      type: "text",
                      text: "link"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          start: 63,
          end: 67,
          type: "text",
          text: " end"
        }
      ]
    );

    assert(
      '<html><body><h1>Title</h1><div id="main" class="test"><p>Hello<em>world</em>!</p></div></body></html>',
      [
        {
          start: 0,
          end: 101,
          type: "tag",
          name: "html",
          children: [
            {
              start: 6,
              end: 94,
              type: "tag",
              name: "body",
              children: [
                {
                  start: 12,
                  end: 26,
                  type: "tag",
                  name: "h1",
                  children: [
                    { start: 16, end: 21, type: "text", text: "Title" }
                  ]
                },
                {
                  start: 26,
                  end: 87,
                  type: "tag",
                  name: "div",
                  properties: {
                    id: "main",
                    class: "test"
                  },
                  children: [
                    {
                      start: 54,
                      end: 81,
                      type: "tag",
                      name: "p",
                      children: [
                        { start: 57, end: 62, type: "text", text: "Hello" },
                        {
                          start: 62,
                          end: 76,
                          type: "tag",
                          name: "em",
                          children: [
                            { start: 66, end: 71, type: "text", text: "world" }
                          ]
                        },
                        { start: 76, end: 77, type: "text", text: "!" }
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
        start: 0,
        end: 26,
        type: "tag",
        name: "xml:lang",
        properties: { value: "zh-cn" }
      }
    ]);
  });

  it("`removePosition` option don't return position info", function() {
    assert(
      '<xml:lang value="zh-cn" />hello',
      [
        {
          type: "tag",
          name: "xml:lang",
          properties: { value: "zh-cn" }
        },
        {
          type: "text",
          text: "hello"
        }
      ],
      { removePosition: true }
    );
  });
});
