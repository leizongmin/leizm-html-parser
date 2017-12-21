import * as path from "path";
import * as fs from "fs";
import { parse, toString } from "../lib";
import * as colors from 'colors';

const file1 = fs
  .readFileSync(path.resolve(__dirname, "../../test/file1.html"))
  .toString();
const file2 = fs
  .readFileSync(path.resolve(__dirname, "../../test/file2.html"))
  .toString();

function parseHTML(content: string) {
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
  console.log(
    "parse: %ss (speed: %sM/s), toString: %ss",
    spent1.toFixed(3),
    speed.toFixed(1),
    spent2.toFixed(3)
  );
}

parseHTML(file1);
parseHTML(file2);
