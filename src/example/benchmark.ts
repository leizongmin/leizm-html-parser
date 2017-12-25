import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { parse, toString } from "../lib";
import * as colors from "colors";

const file1 = fs
  .readFileSync(path.resolve(__dirname, "../../test/file1.html"))
  .toString();
const file2 = fs
  .readFileSync(path.resolve(__dirname, "../../test/file2.html"))
  .toString();

function parseHTML(title: string, content: string) {
  const input = content.toString();
  const start = process.uptime();
  const { errors, nodes } = parse(input);
  const end = process.uptime();
  const html = toString(nodes);
  const end2 = process.uptime();
  if (errors.length > 0) {
    for (const err of errors) {
      console.log("[offset:%s]\t%s", err.position, colors.red(err.message));
    }
  }
  // console.log(html);
  const spent1 = end - start;
  const spent2 = end2 - end;
  const speed = html.length / spent1 / 1000000;
  return util.format(
    "[%s] parse: %ss (speed: %sM/s), toString: %ss",
    title,
    spent1.toFixed(3),
    speed.toFixed(1),
    spent2.toFixed(3)
  );
}

const lines: string[] = [];
const count = 100;
for (let i = 0; i < count; i++) {
  lines.push(parseHTML("file1", file1));
  lines.push(parseHTML("file2", file2));
  if (i % 10 === 0) {
    console.log('progress: %s%%', (i / count * 100).toFixed(2));
  }
}
lines.forEach((line, i) => {
  console.log((i % 2 === 0 ? colors.blue : colors.magenta)(line));
});
