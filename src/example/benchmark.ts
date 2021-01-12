import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { parse, toString } from "../lib";
import * as colors from "colors";

const files = ["file1", "file2"].map((title) => {
  const f = path.resolve(__dirname, `../../fixtures/${title}.html`);
  const data = fs.readFileSync(f);
  const text = data.toString();
  return { title, data, size: data.length, text };
});

function runTest(title: string, content: string) {
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
  const speed1 = html.length / spent1 / 1048576;
  const speed2 = html.length / spent2 / 1048576;
  return {
    title,
    spent1,
    speed1,
    spent2,
    speed2,
    text: util.format(
      "[%s]\t parse: %ss (speed: %sM/s) \t toString: %ss (speed: %sM/s)",
      title,
      spent1.toFixed(3),
      speed1.toFixed(1),
      spent2.toFixed(3),
      speed2.toFixed(1),
    ),
  };
}

const lines = [];
const count = 100;
for (let i = 0; i < count; i++) {
  for (const item of files) {
    lines.push(runTest(item.title, item.text));
  }
  if (i % 10 === 0) {
    console.log("progress: %s%%", ((i / count) * 100).toFixed(2));
  }
}
lines.forEach((line, i) => {
  console.log((i % 2 === 0 ? colors.blue : colors.magenta)(line.text));
});

const lines2 = lines.slice(2);
const results = files.map((item) => {
  const avgSpeed1 = (
    lines2
      .filter((v) => v.title === item.title)
      .map((v) => v.speed1)
      .reduce((pv, cv) => pv + cv) / lines2.length
  ).toFixed(1);
  const avgSpeed2 = (
    lines2
      .filter((v) => v.title === item.title)
      .map((v) => v.speed2)
      .reduce((pv, cv) => pv + cv) / lines2.length
  ).toFixed(1);
  return {
    title: item.title,
    text: util.format(
      "%s size: %sM, parse: %sM/s, toString: %sM/s",
      item.title,
      (item.size / 1048576).toFixed(2),
      avgSpeed1,
      avgSpeed2,
    ),
  };
});
console.log("");
console.log("");
console.log(colors.green("## Benchmark"));
console.log("");
console.log(colors.green("Environment:"));
console.log("");
console.log(colors.green("- Node %s"), process.version);
console.log(colors.green("- %s"), os.cpus()[0].model);
console.log("");
console.log(colors.green("Result:"));
results.forEach((line) => console.log(colors.green(`- ${line.text}`)));
