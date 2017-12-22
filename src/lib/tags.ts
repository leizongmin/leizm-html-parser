/**
 * Tags are used to delimit the start and end of elements in the markup.
 * Raw text, escapable raw text, and normal elements have a start tag to indicate where they begin,
 * and an end tag to indicate where they end.
 * The start and end tags of certain normal elements can be omitted,
 * as described below in the section on [[#optional tags]]. Those that cannot be omitted must not be omitted.
 * Void elements only have a start tag; end tags must not be specified for void elements.
 * Foreign elements must either have a start tag and an end tag, or a start tag that is marked as self-closing,
 * in which case they must not have an end tag.
 *
 * @see https://www.w3.org/TR/html5/syntax.html#tags
 */

/**
 * Returns true if the input is void tag name
 *
 * Void elements can’t have any contents (since there’s no end tag, no content can be put between the start tag and the end tag).
 *
 * @param name tag name in lower case
 */
export function isVoidTag(name: string): boolean {
  switch (name) {
    case "!doctype":
    case "area":
    case "base":
    case "br":
    case "col":
    case "embed":
    case "hr":
    case "img":
    case "input":
    case "link":
    case "meta":
    case "param":
    case "source":
    case "track":
    case "wbr":
      return true;
    default:
      return false;
  }
}

/**
 * Returns true if the input is raw text tag name
 *
 * The text in raw text and escapable raw text elements must not contain any occurrences of the string "</"
 * @see https://www.w3.org/TR/html5/syntax.html#restrictions-on-the-contents-of-raw-text-and-escapable-raw-text-elements
 *
 * Raw text elements can have text, though it has restrictions described below.
 *
 * @param name tag name in lower case
 */
export function isRawTextTag(name: string): boolean {
  switch (name) {
    case "script":
    case "style":
      return true;
    default:
      return false;
  }
}

/**
 * Returns true if the input is escapable raw text name
 *
 * The text in raw text and escapable raw text elements must not contain any occurrences of the string "</"
 * @see https://www.w3.org/TR/html5/syntax.html#restrictions-on-the-contents-of-raw-text-and-escapable-raw-text-elements
 *
 * Escapable raw text elements can have text and character references, but the text must not contain an ambiguous ampersand. There are also further restrictions described below.
 * An ambiguous ampersand is a U+0026 AMPERSAND character (&) that is followed by one or more alphanumeric ASCII characters, followed by a U+003B SEMICOLON character (;)
 *
 * @param name tag name in lower case
 */
export function isEscapableRawTextTag(name: string): boolean {
  switch (name) {
    case "textarea":
    case "title":
      return true;
    default:
      return false;
  }
}

/**
 * Returns true if the input is a html5 tag name
 * @param name tag name in lower case
 */
export function isHtml5Tag(name: string): boolean {
  switch (name) {
    case "a":
    case "abbr":
    case "acronym":
    case "address":
    case "applet":
    case "object":
    case "area":
    case "article":
    case "aside":
    case "audio":
    case "b":
    case "base":
    case "basefont":
    case "bdi":
    case "bdo":
    case "big":
    case "blockquote":
    case "body":
    case "br":
    case "button":
    case "canvas":
    case "caption":
    case "center":
    case "cite":
    case "code":
    case "col":
    case "colgroup":
    case "datalist":
    case "input":
    case "dd":
    case "del":
    case "details":
    case "dfn":
    case "dir":
    case "div":
    case "dl":
    case "dt":
    case "em":
    case "embed":
    case "fieldset":
    case "figcaption":
    case "figure":
    case "font":
    case "footer":
    case "form":
    case "frame":
    case "frameset":
    case "h1> to <h6":
    case "head":
    case "header":
    case "hgroup":
    case "hr":
    case "html":
    case "i":
    case "iframe":
    case "img":
    case "input":
    case "ins":
    case "kbd":
    case "keygen":
    case "label":
    case "input":
    case "legend":
    case "fieldset":
    case "li":
    case "link":
    case "map":
    case "mark":
    case "menu":
    case "meta":
    case "meter":
    case "nav":
    case "noframes":
    case "noscript":
    case "object":
    case "ol":
    case "optgroup":
    case "option":
    case "output":
    case "p":
    case "param":
    case "pre":
    case "progress":
    case "q":
    case "rp":
    case "rt":
    case "ruby":
    case "s":
    case "samp":
    case "script":
    case "section":
    case "select":
    case "small":
    case "source":
    case "audio":
    case "video":
    case "span":
    case "strike":
    case "strong":
    case "style":
    case "sub":
    case "summary":
    case "details":
    case "sup":
    case "table":
    case "tbody":
    case "td":
    case "textarea":
    case "tfoot":
    case "th":
    case "thead":
    case "time":
    case "title":
    case "tr":
    case "track":
    case "audio":
    case "video":
    case "tt":
    case "u":
    case "ul":
    case "var":
    case "video":
    case "wbr":
    case "a":
    case "article":
    case "aside":
    case "body":
    case "br":
    case "details":
    case "div":
    case "h1> to <h6":
    case "head":
    case "header":
    case "hgroup":
    case "hr":
    case "html":
    case "footer":
    case "nav":
    case "p":
    case "section":
    case "span":
    case "summary":
    case "details":
    case "base":
    case "basefont":
    case "link":
    case "meta":
    case "style":
    case "title":
    case "button":
    case "datalist":
    case "input":
    case "fieldset":
    case "form":
    case "input":
    case "keygen":
    case "label":
    case "input":
    case "legend":
    case "fieldset":
    case "meter":
    case "optgroup":
    case "option":
    case "select":
    case "textarea":
    case "abbr":
    case "acronym":
    case "address":
    case "b":
    case "bdi":
    case "bdo":
    case "big":
    case "blockquote":
    case "center":
    case "cite":
    case "code":
    case "del":
    case "dfn":
    case "em":
    case "font":
    case "i":
    case "ins":
    case "kbd":
    case "mark":
    case "output":
    case "pre":
    case "progress":
    case "q":
    case "rp":
    case "rt":
    case "ruby":
    case "s":
    case "samp":
    case "small":
    case "strike":
    case "strong":
    case "sub":
    case "sup":
    case "tt":
    case "u":
    case "var":
    case "wbr":
    case "dd":
    case "dir":
    case "dl":
    case "dt":
    case "li":
    case "ol":
    case "menu":
    case "ul":
    case "caption":
    case "col":
    case "colgroup":
    case "table":
    case "tbody":
    case "td":
    case "tfoot":
    case "thead":
    case "th":
    case "tr":
    case "noscript":
    case "script":
    case "applet":
    case "object":
    case "area":
    case "audio":
    case "canvas":
    case "embed":
    case "figcaption":
    case "figure":
    case "frame":
    case "frameset":
    case "iframe":
    case "img":
    case "map":
    case "noframes":
    case "object":
    case "param":
    case "source":
    case "audio":
    case "video":
    case "time":
    case "video":
      return true;
    default:
      return false;
  }
}
