import { assert } from "./utils";

describe("CDATA sections", function() {
  it("Normal", function() {
    assert("<ms><![CDATA[x<y]]></ms>", [
      {
        tagName: "ms",
        children: [
          {
            tagName: "![CDATA[",
            properties: {
              data: "x<y"
            }
          }
        ]
      }
    ]);
  });

  it("Nesting", function() {
    assert("<ms><![CDATA[ <![CDATA[ <b>hello</b> ]]></ms>", [
      {
        tagName: "ms",
        children: [
          {
            tagName: "![CDATA[",
            properties: {
              data: " <![CDATA[ <b>hello</b> "
            }
          }
        ]
      }
    ]);
  });
});
