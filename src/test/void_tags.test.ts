import { assert } from "./utils";

describe("Void tags", function() {
  it("HTML5 void tags", function() {
    assert(
      "<input disabled><area><base href='#'><br><col><embed><hr><img src='#' title='this is img'><link href='#'><meta charset='utf-8'><param name=a><source src='##'><track><wbr>",
      [
        {
          type: "tag",
          name: "input",
          properties: { disabled: true }
        },
        {
          type: "tag",
          name: "area"
        },
        {
          type: "tag",
          name: "base",
          properties: { href: "#" }
        },
        {
          type: "tag",
          name: "br"
        },
        {
          type: "tag",
          name: "col"
        },
        {
          type: "tag",
          name: "embed"
        },
        {
          type: "tag",
          name: "hr"
        },
        {
          type: "tag",
          name: "img",
          properties: { src: "#", title: "this is img" }
        },
        {
          type: "tag",
          name: "link",
          properties: { href: "#" }
        },
        {
          type: "tag",
          name: "meta",
          properties: { charset: "utf-8" }
        },
        {
          type: "tag",
          name: "param",
          properties: { name: "a" }
        },
        {
          type: "tag",
          name: "source",
          properties: { src: "##" }
        },
        {
          type: "tag",
          name: "track"
        },
        {
          type: "tag",
          name: "wbr"
        }
      ]
    );
  });

  it("Custom void tags", function() {
    assert('<xx value="1" /><yy value="2" />', [
      {
        type: "tag",
        name: "xx",
        properties: { value: "1" }
      },
      {
        type: "tag",
        name: "yy",
        properties: { value: "2" }
      }
    ]);
  });

  it("Non-void tags with self-closing auto add empty children", function() {
    assert('<a value="1" /><b value="2" />', [
      {
        type: "tag",
        name: "a",
        properties: { value: "1" },
        children: []
      },
      {
        type: "tag",
        name: "b",
        properties: { value: "2" },
        children: []
      }
    ]);
  });
});
