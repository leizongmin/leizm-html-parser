import { expect } from "chai";
import { inspect } from "util";
import * as colors from "colors";
import { parse, toString, NodeChildren } from "../lib";

export function dump(input: string) {
  const { errors, nodes } = parse(input);
  const output = toString(nodes, { pretty: true });
  const line = "`".repeat(process.stdout.columns || 80);
  console.log(colors.cyan(line));
  console.log(colors.magenta("A"), inspect(nodes, { depth: 10, colors: true }));
  console.log(colors.magenta("I"), colors.blue(input));
  console.log(colors.magenta("O"), colors.cyan(output));
  if (errors.length > 0) {
    for (const err of errors) {
      console.log(
        colors.magenta("Error"),
        colors.yellow(`[${err.position}]`),
        colors.red(err.message)
      );
    }
  }
  console.log(colors.cyan(line));
}

export function assert(html: string, nodes: NodeChildren) {
  if (process.env.DEBUG && String(process.env.DEBUG).indexOf("dump") !== -1) {
    dump(html);
  }
  return expect(parse(html).nodes).to.deep.equal(nodes);
}
