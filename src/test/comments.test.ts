import { assert } from "./utils";

describe("Comments", function() {
  it("Normal", function() {
    assert("this is <!--comments<a href=#>link</a><!-- hello --> end", [
      "this is ",
      {
        tagName: "!--",
        properties: {
          comment: "comments<a href=#>link</a><!-- hello "
        }
      },
      " end"
    ]);
  });

  it('Nesting', function () {
    assert("<!--\nThis is a comment\n-->\n<b>comment</b><!--unexpected", [
      {
        tagName: "!--",
        properties: { comment: "\nThis is a comment\n" }
      },
      "\n",
      {
        tagName: "b",
        children: ["comment"]
      },
      {
        tagName: "!--",
        properties: { comment: "unexpected" },
        children: []
      }
    ]);
  });
});
