![Node.js CI](https://github.com/leizongmin/leizm-html-parser/workflows/Node.js%20CI/badge.svg)
[![DeepScan grade](https://deepscan.io/api/teams/2068/projects/2782/branches/20098/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=2068&pid=2782&bid=20098)
[![NPM version][npm-image]][npm-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@leizm/html-parser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@leizm/html-parser
[coveralls-image]: https://img.shields.io/coveralls/leizongmin/leizm-html-parser.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/leizongmin/leizm-html-parser?branch=master
[david-image]: https://img.shields.io/david/leizongmin/leizm-html-parser.svg?style=flat-square
[david-url]: https://david-dm.org/leizongmin/leizm-html-parser
[node-image]: https://img.shields.io/badge/node.js-%3E=_6.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/@leizm/html-parser.svg?style=flat-square
[download-url]: https://npmjs.org/package/@leizm/html-parser
[license-image]: https://img.shields.io/npm/l/@leizm/html-parser.svg

# @leizm/html-parser

Fast HTML parser written in pure JavaScript

## Installation

```bash
npm install @leizm/html-parser --save
```

## Usage

### Node.js or Webpack

```typescript
import * as html from "@leizm/html-parser";

const { errors, nodes } = html.parse(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <h1>Hello, world! <small>by @leizm/html-parser</small></h1>
  <p>Fast HTML parser written in pure JavaScript</p>
</body>
</html>`);

console.log({ errors, nodes });
console.log(html.toString(nodes));
```

The result of `html.parse()` should be:

<details><summary>View details</summary>

```json
{
  "errors": [],
  "nodes": [
    {
      "start": 0,
      "end": 15,
      "type": "tag",
      "name": "!DOCTYPE",
      "properties": { "html": true }
    },
    { "start": 15, "end": 16, "type": "text", "text": "\n" },
    {
      "start": 16,
      "end": 365,
      "type": "tag",
      "name": "html",
      "properties": { "lang": "en" },
      "children": [
        { "start": 32, "end": 33, "type": "text", "text": "\n" },
        {
          "start": 33,
          "end": 227,
          "type": "tag",
          "name": "head",
          "children": [
            { "start": 39, "end": 42, "type": "text", "text": "\n  " },
            {
              "start": 42,
              "end": 64,
              "type": "tag",
              "name": "meta",
              "properties": { "charset": "UTF-8" }
            },
            { "start": 64, "end": 67, "type": "text", "text": "\n  " },
            {
              "start": 67,
              "end": 137,
              "type": "tag",
              "name": "meta",
              "properties": {
                "name": "viewport",
                "content": "width=device-width, initial-scale=1.0"
              }
            },
            { "start": 137, "end": 140, "type": "text", "text": "\n  " },
            {
              "start": 140,
              "end": 193,
              "type": "tag",
              "name": "meta",
              "properties": {
                "http-equiv": "X-UA-Compatible",
                "content": "ie=edge"
              }
            },
            { "start": 193, "end": 196, "type": "text", "text": "\n  " },
            {
              "start": 196,
              "end": 219,
              "type": "tag",
              "name": "title",
              "children": [
                { "start": 203, "end": 211, "type": "text", "text": "Document" }
              ]
            },
            { "start": 219, "end": 220, "type": "text", "text": "\n" }
          ]
        },
        { "start": 227, "end": 228, "type": "text", "text": "\n" },
        {
          "start": 228,
          "end": 357,
          "type": "tag",
          "name": "body",
          "children": [
            { "start": 234, "end": 237, "type": "text", "text": "\n  " },
            {
              "start": 237,
              "end": 296,
              "type": "tag",
              "name": "h1",
              "children": [
                {
                  "start": 241,
                  "end": 255,
                  "type": "text",
                  "text": "Hello, world! "
                },
                {
                  "start": 255,
                  "end": 291,
                  "type": "tag",
                  "name": "small",
                  "children": [
                    {
                      "start": 262,
                      "end": 283,
                      "type": "text",
                      "text": "by @leizm/html-parser"
                    }
                  ]
                }
              ]
            },
            { "start": 296, "end": 299, "type": "text", "text": "\n  " },
            {
              "start": 299,
              "end": 349,
              "type": "tag",
              "name": "p",
              "children": [
                {
                  "start": 302,
                  "end": 345,
                  "type": "text",
                  "text": "Fast HTML parser written in pure JavaScript"
                }
              ]
            },
            { "start": 349, "end": 350, "type": "text", "text": "\n" }
          ]
        },
        { "start": 357, "end": 358, "type": "text", "text": "\n" }
      ]
    }
  ]
}
```

</details>

The result of `html.toString()` should be:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Document</title>
</head>
<body>
  <h1>Hello, world! <small>by @leizm/html-parser</small></h1>
  <p>Fast HTML parser written in pure JavaScript</p>
</body>
</html>
```

### Browser-side

`parser.min.js` is pack by [Browserify](http://browserify.org/), it provided an `require()` function to load the module:

```html
<script src="https://unpkg.com/@leizm/html-parser/dist/parser.min.js"></script>
<script>
  const html = require("@leizm/html-parser");
  const { errors, nodes } = html.parse(`<strong>hello</strong>`);
  // ...
</script>
```

## Benchmark

Environment:
- Node v15.4.0
- Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz

Result:
- file1 size: 0.12M, parse: 18.4M/s, toString: 49.2M/s
- file2 size: 5.04M, parse: 15.4M/s, toString: 9.2M/s

## License

```text
MIT License

Copyright (c) 2017-2021 Zongmin Lei <leizongmin@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
