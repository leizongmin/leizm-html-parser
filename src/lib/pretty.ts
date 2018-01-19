import {
  NodeChildren,
  TextNode,
  TagNode,
  parse,
  toString,
  ParseOptions
} from "./index";

const REG_REMOVE_SPACES = /^\s+|\s+$/g;

export interface PrettyOptions {
  /**
   * indent string or number of spaces
   * e.g. "\t" or 4
   */
  indent?: string | number;
}

/**
 * Pretty input nodes
 *
 * @param nodes
 * @param options
 */
export function prettyNodes(
  nodes: NodeChildren,
  options: PrettyOptions = {}
): NodeChildren {
  if (nodes.length > 0) {
    // only when there is unless one Node, then starts the pretty process
    let indent = "";
    if (options.indent) {
      if (typeof options.indent === "number") {
        indent = " ".repeat(options.indent);
      } else {
        indent = options.indent;
      }
    }

    function walk(
      nodes: NodeChildren,
      level: number,
      indent: string
    ): NodeChildren {
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i];
        if (item.type === "text") {
          const textNode = item as TextNode;
          textNode.text = textNode.text.replace(REG_REMOVE_SPACES, " ");
        } else {
          const tagNode = item as TagNode;
          if (tagNode.children && tagNode.children.length > 0) {
            tagNode.children = walk(tagNode.children, level + 1, indent);
          }
        }
      }
      if (
        level &&
        indent &&
        !(nodes.length === 1 && nodes[0].type === "text")
      ) {
        const whiteSpaces = "\n" + indent.repeat(level);
        for (let i = 0; i < nodes.length; i += 2) {
          nodes.splice(i, -1, { type: "text", text: whiteSpaces });
        }
        nodes.push({ type: "text", text: "\n" + indent.repeat(level - 1) });
      } else if (indent && level === 0) {
        // top level
        for (let i = 0; i < nodes.length; i += 2) {
          nodes.splice(i, -1, { type: "text", text: "\n" });
        }
      }
      return nodes;
    }

    nodes = walk(nodes, 0, indent);

    // trim left and right spaces
    if (nodes[0] && nodes[0].type === "text") {
      const textNode = nodes[0] as TextNode;
      textNode.text = textNode.text.trimLeft();
      if (!nodes[0]) {
        nodes.splice(0, 1);
      }
    }
    const lastIndex = nodes.length - 1;
    if (nodes[lastIndex] && nodes[lastIndex].type === "text") {
      const textNode = nodes[lastIndex] as TextNode;
      textNode.text = textNode.text.trimRight();
      if (!nodes[lastIndex]) {
        nodes.splice(lastIndex, 1);
      }
    }
  }
  return nodes;
}

/**
 * Pretty input html
 *
 * @param html
 * @param options
 */
export function pretty(
  html: string,
  options: PrettyOptions & ParseOptions = {}
): string {
  return toString(prettyNodes(parse(html, options).nodes, options), options);
}
