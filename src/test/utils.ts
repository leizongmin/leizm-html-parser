import { expect } from "chai";
import { inspect } from "util";
import * as colors from "colors";
import { parse, ParseOptions, Result, toString, NodeChildren, TagNode } from "../lib";

export const enableDump =
  process.env.DEBUG && String(process.env.DEBUG).indexOf("dump") !== -1;

export const PAGING = "`".repeat(process.stdout.columns || 80);

export function assert(
  html: string,
  nodes: NodeChildren,
  options: ParseOptions = {}
) {
  strictAssert(html, nodes, options, function (ret) {
    // remove all position info
    function removePosition(nodes: NodeChildren) {
      for (const item of nodes) {
        delete item.start;
        delete item.end;
        const tag = item as TagNode;
        if (tag.children) {
          removePosition(tag.children);
        }
      }
    }
    removePosition(ret.nodes);
    return ret;
  });
}

export function strictAssert(
  html: string,
  nodes: NodeChildren,
  options: ParseOptions = {},
  onResult?: (ret: Result) => Result
) {
  let ret = parse(html, options);
  if (enableDump) {
    const output = toString(ret.nodes, { pretty: true });
    console.log(colors.cyan(PAGING));
    console.log(colors.blue(inspect(ret.nodes, { depth: 10, colors: true })));
    console.log(colors.cyan(inspect(nodes, { depth: 10, colors: true })));
    console.log(
      colors.magenta("before:"),
      (textHasMulitLines(html) ? "\n" : "") + colors.blue(html)
    );
    console.log(
      colors.magenta("after: "),
      (textHasMulitLines(output) ? "\n" : "") + colors.cyan(output)
    );
    if (ret.errors.length > 0) {
      for (const err of ret.errors) {
        console.log(
          colors.magenta("Error"),
          colors.yellow(`[${err.position}]`),
          colors.red(err.message)
        );
      }
    }
    console.log(colors.cyan(PAGING));
  }
  if (onResult) {
    ret = onResult(ret);
  }
  expect(ret.nodes).to.deep.equal(nodes);
  if ("xmlMode" in options) {
    expect(ret.xmlMode).to.equal(options.xmlMode);
  }
}

export function textHasMulitLines(text: string): boolean {
  return text.split("\n").length > 1;
}

export function showInvisibleText(text: string): string {
  return text
    .replace(/ /g, colors.gray("·"))
    .replace(/\t/g, colors.gray("⎯⎯⎯↣"))
    .replace(/\n/g, colors.gray("↲") + "\n");
}
