import { assert } from "./utils";

describe("Raw text tags", function () {
  it("<style>", function () {
    assert("<style>body { background: #fff; }/*</</*/</style>end", [
      {
        type: "tag",
        name: "style",
        children: [{ type: "text", text: "body { background: #fff; }/*</</*/" }],
      },
      { type: "text", text: "end" },
    ]);

    assert('<style>a { content: "<b>hello<a>link</a></b><c>ok</c>" }</style>end', [
      {
        type: "tag",
        name: "style",
        children: [
          {
            type: "text",
            text: 'a { content: "<b>hello<a>link</a></b><c>ok</c>" }',
          },
        ],
      },
      { type: "text", text: "end" },
    ]);
  });
  it("<script>", function () {
    assert('<script type="text/javascript" async>alert("hello, world")</script>', [
      {
        type: "tag",
        name: "script",
        properties: { type: "text/javascript", async: true },
        children: [{ type: "text", text: 'alert("hello, world")' }],
      },
    ]);
  });
});
