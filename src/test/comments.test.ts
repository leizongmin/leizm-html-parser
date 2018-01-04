import { assert } from "./utils";

describe("Comments", function() {
  it("Normal", function() {
    assert("this is <!--comments<a href=#>link</a><!-- hello --> end", [
      { type: "text", text: "this is " },
      {
        type: "tag",
        name: "!--",
        children: [
          { type: "text", text: "comments<a href=#>link</a><!-- hello " }
        ]
      },
      { type: "text", text: " end" }
    ]);
  });

  it("Nesting", function() {
    assert("<!--\nThis is a comment\n-->\n<b>comment</b><!--unexpected", [
      {
        type: "tag",
        name: "!--",
        children: [{ type: "text", text: "\nThis is a comment\n" }]
      },
      { type: "text", text: "\n" },
      {
        type: "tag",
        name: "b",
        children: [{ type: "text", text: "comment" }]
      },
      {
        type: "tag",
        name: "!--",
        children: [{ type: "text", text: "unexpected" }]
      }
    ]);
  });
});
