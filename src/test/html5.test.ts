import { assert } from "./utils";

describe("HTML5 tags", function() {
  it("Auto change to lowercase", function() {
    assert('<Div><A href="#">link</A></DIV>', [
      {
        tagName: "div",
        children: [
          {
            tagName: "a",
            properties: { href: "#" },
            children: ["link"]
          }
        ]
      }
    ]);
    assert('<DIv><MyCustomTag href="#">link</MyCustomTag></div>', [
      {
        tagName: "div",
        children: [
          {
            tagName: "MyCustomTag",
            properties: { href: "#" },
            children: ["link"]
          }
        ]
      }
    ]);
  });
});
