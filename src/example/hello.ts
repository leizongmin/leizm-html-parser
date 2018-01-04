import * as html from "../lib";

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

console.log(JSON.stringify({ errors, nodes }));
console.log(html.toString(nodes));
