/**
 * @leizm/html-parser
 *
 * reference for "HTML 5.2 W3C Recommendation" https://www.w3.org/TR/html5/syntax.html
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import * as parser from "./src/lib/parser.ts";
import * as to_string from "./src/lib/to_string.ts";
import * as pretty from "./src/lib/pretty.ts";
import * as minify from "./src/lib/minify.ts";
export default { ...parser, ...to_string, ...pretty, ...minify };
