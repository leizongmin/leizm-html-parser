import { assert } from "./utils";

describe("Void tags", function() {
  it("HTML5 void tags", function() {
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

  it("Custom void tags", function() {
    assert('<A value="1" /><B value="2" />', [
      {
        tagName: "A",
        properties: { value: "1" }
      },
      {
        tagName: "B",
        properties: { value: "2" }
      }
    ]);
  });
});
