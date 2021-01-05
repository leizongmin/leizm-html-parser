import { expect } from "chai";
import * as colors from "colors";
import { pretty } from "../lib";
import { enableDump, PAGING, textHasMulitLines, showInvisibleText } from "./utils";

function assertPretty(source: string, actual: string, expected: string) {
  if (enableDump) {
    console.log(colors.cyan(PAGING));
    console.log(
      colors.magenta("source:  "),
      (textHasMulitLines(source) ? "\n" : "") + colors.blue(showInvisibleText(source)),
    );
    console.log(
      colors.magenta("actual:  "),
      (textHasMulitLines(actual) ? "\n" : "") + colors.yellow(showInvisibleText(actual)),
    );
    console.log(
      colors.magenta("expected:"),
      (textHasMulitLines(expected) ? "\n" : "") + colors.cyan(showInvisibleText(expected)),
    );
    console.log(colors.cyan(PAGING));
  }
  expect(actual).to.equal(expected);
}

describe("pretty()", function () {
  it("Remove leading and trailing for top level nodes", function () {
    {
      const html = "  <b>hello, world</b>";
      assertPretty(html, pretty(html), "<b>hello, world</b>");
    }
    {
      const html = "<b>hello, world</b>hello\t\t\n  ";
      assertPretty(html, pretty(html), "<b>hello, world</b>hello");
    }
    {
      const html = "  <b>hello, world</b>  ";
      assertPretty(html, pretty(html), "<b>hello, world</b>");
    }
  });

  it("Remove leading and trailing multiple spaces for the text node, only keep one space", function () {
    {
      const html = "<a>   hello world  </a>";
      assertPretty(html, pretty(html), "<a> hello world </a>");
    }
    {
      const html = "<a>  <b>\t\t hello world</a>     </a>";
      assertPretty(html, pretty(html), "<a> <b> hello world</b> </a>");
    }
  });

  it("With string `indent` option, `\t` or `  `", function () {
    {
      const html = '<a href="#"><b> link </b></a>';
      assertPretty(html, pretty(html, { indent: "\t" }), '<a href="#">\n\t<b> link </b>\n</a>');
    }
    {
      const html = '<a href="#"><b> link </b></a>';
      assertPretty(html, pretty(html, { indent: "  " }), '<a href="#">\n  <b> link </b>\n</a>');
    }
  });

  it("With number `indent` option, 2 or 7", function () {
    {
      const html = '<a href="#"><b> link </b></a>';
      assertPretty(html, pretty(html, { indent: 2 }), '<a href="#">\n  <b> link </b>\n</a>');
    }
    {
      const html = '<a href="#"><b> link </b></a>';
      assertPretty(html, pretty(html, { indent: 7 }), '<a href="#">\n       <b> link </b>\n</a>');
    }
  });

  it("Deep level", function () {
    {
      const html = "<a>hello<b><c><d><e>ffff</e></d></c>world</b></a>";
      assertPretty(
        html,
        pretty(html, { indent: "\t" }),
        "<a>\n\thello\n\t<b>\n\t\t<c>\n\t\t\t<d>\n\t\t\t\t<e>ffff</e>\n\t\t\t</d>\n\t\t</c>\n\t\tworld\n\t</b>\n</a>",
      );
    }
    {
      const html =
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Document</title></head><body><h1>Hello world</h1><div><ul><li>First</li><li>Second</li><li>Third</li></ul></div><p> Test </p></body></html>';
      assertPretty(
        html,
        pretty(html, { indent: "\t" }),
        '<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="UTF-8">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n\t\t<title>Document</title>\n\t</head>\n\t<body>\n\t\t<h1>Hello world</h1>\n\t\t<div>\n\t\t\t<ul>\n\t\t\t\t<li>First</li>\n\t\t\t\t<li>Second</li>\n\t\t\t\t<li>Third</li>\n\t\t\t</ul>\n\t\t</div>\n\t\t<p> Test </p>\n\t</body>\n</html>',
      );
    }
  });

  it("pretty() on `xmlMode=true`", function () {
    {
      const html = "<input />";
      assertPretty(html, pretty(html, {}), "<input>");
    }
    {
      const html = "<input />";
      assertPretty(html, pretty(html, { xmlMode: true }), "<input />");
    }
  });
});
