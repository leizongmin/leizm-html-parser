import { assert } from "./utils";

describe("Invalid syntax", function() {
  it("<<bar>>", function() {
    assert("<<bar>>", [
      "<",
      {
        tagName: "bar",
        children: [">"]
      }
    ]);
  });

  it("<<bar>><</bar>>", function() {
    assert("<<bar>><</bar>>", [
      "<",
      {
        tagName: "bar",
        children: ["><"]
      },
      ">"
    ]);
  });
});
