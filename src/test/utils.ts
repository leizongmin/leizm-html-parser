import { expect } from "chai";
import { inspect } from "util";
import * as colors from "colors";
import { parse, ParseOptions, toString, NodeChildren } from "../lib";

export const enableDump =
  process.env.DEBUG && String(process.env.DEBUG).indexOf("dump") !== -1;

export const PAGING = "`".repeat(process.stdout.columns || 80);

export function dump(input: string, options?: ParseOptions) {
  const { errors, nodes } = parse(input, options);
  const output = toString(nodes, { pretty: true });
  console.log(colors.cyan(PAGING));
  console.log(inspect(nodes, { depth: 10, colors: true }));
  console.log(
    colors.magenta("before:"),
    (textHasMulitLines(input) ? "\n" : "") + colors.blue(input)
  );
  console.log(
    colors.magenta("after: "),
    (textHasMulitLines(output) ? "\n" : "") + colors.cyan(output)
  );
  if (errors.length > 0) {
    for (const err of errors) {
      console.log(
        colors.magenta("Error"),
        colors.yellow(`[${err.position}]`),
        colors.red(err.message)
      );
    }
  }
  console.log(colors.cyan(PAGING));
}

export function assert(
  html: string,
  nodes: NodeChildren,
  options: ParseOptions = {}
) {
  if (enableDump) {
    dump(html, options);
  }
  const ret = parse(html, options);
  expect(ret.nodes).to.deep.equal(nodes);
  if ("xml" in options) {
    expect(ret.xml).to.equal(options.xml);
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
