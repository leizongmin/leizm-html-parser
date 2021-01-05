import { expect } from "chai";
import { toString, parse } from "../lib";

describe("Emit errors", function () {
  it("Start tag and end tag does not match", function () {
    const { nodes, errors } = parse("<a>hello<c>world</d></b>");
    expect(nodes).to.deep.equal([
      {
        start: 0,
        end: 24,
        type: "tag",
        name: "a",
        children: [
          { start: 3, end: 8, type: "text", text: "hello" },
          {
            start: 8,
            end: 20,
            type: "tag",
            name: "c",
            children: [{ start: 11, end: 16, type: "text", text: "world" }],
          },
        ],
      },
    ]);
    expect(errors).to.deep.equal([
      {
        position: 16,
        message: "start tag and end tag does not match: <c></d>",
      },
      {
        position: 20,
        message: "start tag and end tag does not match: <a></b>",
      },
    ]);
  });
});
