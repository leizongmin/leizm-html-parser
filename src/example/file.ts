import * as path from "path";
import * as fs from "fs";
import { parse, toString } from "../lib";

fs.readFile(path.resolve(__dirname, "../../test/file.html"), (err, ret) => {
  if (err) throw err;
  const input = ret.toString();
  const start = process.uptime();
  const { errors, nodes } = parse(input);
  const end = process.uptime();
  const html = toString(nodes);
  const end2 = process.uptime();
  if (errors.length > 0) {
    console.error(errors);
  }
  console.log(html);
  console.log(
    "parse: %ss, toString: %ss",
    (end - start).toFixed(3),
    (end2 - end).toFixed(3)
  );
});
