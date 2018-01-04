import { assert } from "./utils";

describe("HTML5 tags", function() {
  it("DOCTYPE", function() {
    assert("<!doctype html>", [
      {
        type: "tag",
        name: "!DOCTYPE",
        properties: {
          html: true
        }
      }
    ]);

    assert('<!doctype html SYSTEM "about:legacy-compat">', [
      {
        type: "tag",
        name: "!DOCTYPE",
        properties: {
          html: true,
          SYSTEM: true,
          '"about:legacy-compat"': true
        }
      }
    ]);

    assert("<!doctype html SYSTEM 'about:legacy-compat'>", [
      {
        type: "tag",
        name: "!DOCTYPE",
        properties: {
          html: true,
          SYSTEM: true,
          '"about:legacy-compat"': true
        }
      }
    ]);
  });

  it("Auto change to lowercase", function() {
    assert('<Div><A href="#">link</A></DIV>', [
      {
        type: "tag",
        name: "div",
        children: [
          {
            type: "tag",
            name: "a",
            properties: { href: "#" },
            children: [{ type: "text", text: "link" }]
          }
        ]
      }
    ]);
    assert('<DIv><MyCustomTag href="#">link</MyCustomTag></div>', [
      {
        type: "tag",
        name: "div",
        children: [
          {
            type: "tag",
            name: "MyCustomTag",
            properties: { href: "#" },
            children: [{ type: "text", text: "link" }]
          }
        ]
      }
    ]);
  });
});
