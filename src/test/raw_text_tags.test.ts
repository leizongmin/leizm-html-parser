import { assert } from "./utils";

describe("Raw text tags", function() {
  it("<style>", function() {
    assert("<style>body { background: #fff; }/*</</*/</style>end", [
      {
        tagName: "style",
        children: ["body { background: #fff; }/*</</*/"]
      },
      "end"
    ]);

    assert(
      '<style>a { content: "<b>hello<a>link</a></b><c>ok</c>" }</style>end',
      [
        {
          tagName: "style",
          children: ['a { content: "<b>hello<a>link</a></b><c>ok</c>" }']
        },
        "end"
      ]
    );
  });
  it("<script>", function() {
    assert(
      '<script type="text/javascript" async>alert("hello, world")</script>',
      [
        {
          tagName: "script",
          properties: { type: "text/javascript", async: true },
          children: ['alert("hello, world")']
        }
      ]
    );
  });
});
