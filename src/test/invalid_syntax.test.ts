import { assert } from "./utils";

describe("Invalid syntax", function() {
  it("<<bar>>", function() {
    assert("<<bar>>", [
      { type: "text", text: "<" },
      {
        type: "tag",
        name: "bar",
        children: [{ type: "text", text: ">" }]
      }
    ]);
  });

  it("<<bar>><</bar>>", function() {
    assert("<<bar>><</bar>>", [
      { type: "text", text: "<" },
      {
        type: "tag",
        name: "bar",
        children: [{ type: "text", text: "><" }]
      },
      { type: "text", text: ">" }
    ]);
  });

  it("Unexpected end", function() {
    assert("<a data='\"'>\"<", [
      {
        type: "tag",
        name: "a",
        properties: {
          data: '"'
        },
        children: [
          {
            type: "text",
            text: '"<'
          }
        ]
      }
    ]);

    assert("<style>a{}", [
      {
        type: "tag",
        name: "style",
        children: [{ type: "text", text: "a{}" }]
      }
    ]);

    assert("<a data='\"", [
      {
        type: "text",
        text: "<a data='\""
      }
    ]);
    assert("<a data", [
      {
        type: "text",
        text: "<a data"
      }
    ]);

    assert("<![CDATA[hello", [
      {
        type: "text",
        text: "<![CDATA[hello"
      }
    ]);
  });
});
