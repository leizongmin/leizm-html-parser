import { assert } from "./utils";

describe("CDATA sections", function() {
  it("Normal", function() {
    assert("<ms><![CDATA[x<y]]></ms>", [
      {
        type: "tag",
        name: "ms",
        children: [
          {
            type: "tag",
            name: "![CDATA[",
            children: [{ type: "text", text: "x<y" }]
          }
        ]
      }
    ]);
  });

  it("Nesting", function() {
    assert("<ms><![CDATA[ <![CDATA[ <b>hello</b> ]]></ms>", [
      {
        type: "tag",
        name: "ms",
        children: [
          {
            type: "tag",
            name: "![CDATA[",
            children: [{ type: "text", text: " <![CDATA[ <b>hello</b> " }]
          }
        ]
      }
    ]);
  });
});
