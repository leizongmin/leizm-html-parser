import { expect } from "chai";
import { toString, parse } from "../lib";

describe("Emit errors", function() {
  it("Start tag and end tag does not match", function() {
    const { nodes, errors } = parse("<a>hello<c>world</d></b>");
    expect(nodes).to.deep.equal([
      {
        tagName: "a",
        children: [
          "hello",
          {
            tagName: "c",
            children: ["world"]
          }
        ]
      }
    ]);
    expect(errors).to.deep.equal([
      {
        position: 16,
        message: "start tag and end tag does not match: <c></d>"
      },
      {
        position: 20,
        message: "start tag and end tag does not match: <a></b>"
      }
    ]);
  });
});
