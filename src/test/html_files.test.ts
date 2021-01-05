import { parse } from "../lib";
import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";

describe("HTML files", function () {
  const dir = path.resolve(__dirname, "../../fixtures/html");
  const files = fs
    .readdirSync(dir)
    .filter((n) => /\.(ht|x)ml?$/.test(n))
    .map((n) => path.resolve(dir, n));

  files.forEach((f) => {
    it(`file ${path.basename(f)}`, function () {
      const { errors } = parse(fs.readFileSync(f).toString(), { removePosition: true, xmlMode: f.endsWith(".xml") });
      expect(errors).to.deep.eq([]);
    });
  });
});
