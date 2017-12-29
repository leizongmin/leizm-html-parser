import { NodeChildren, parse, toString } from "./index";

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
    // only when there is unless one Node, then start the pretty process
    let indent = "";
    if (options.indent) {
      if (typeof options.indent === "number") {
        indent = " ".repeat(options.indent);
      } else {
        indent = options.indent;
      }
    }
    nodes = prettyNodesWithIndent(nodes, 0, indent);

    // trim left and right spaces
    if (nodes[0] && typeof nodes[0] === "string") {
      nodes[0] = nodes[0].toString().trimLeft();
      if (!nodes[0]) {
        nodes.splice(0, 1);
      }
    }
    const lastIndex = nodes.length - 1;
    if (nodes[lastIndex] && typeof nodes[lastIndex] === "string") {
      nodes[lastIndex] = nodes[lastIndex].toString().trimRight();
      if (!nodes[lastIndex]) {
        nodes.splice(lastIndex, 1);
      }
    }
  }
  return nodes;
}

function prettyNodesWithIndent(
  nodes: NodeChildren,
  level: number,
  indent: string
): NodeChildren {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (typeof node === "string") {
      nodes[i] = node.replace(REG_REMOVE_SPACES, " ");
    } else {
      if (node.children && node.children.length > 0) {
        node.children = prettyNodesWithIndent(node.children, level + 1, indent);
      }
    }
  }
  if (
    level &&
    indent &&
    !(nodes.length === 1 && typeof nodes[0] === "string")
  ) {
    const whiteSpaces = "\n" + indent.repeat(level);
    for (let i = 0; i < nodes.length; i += 2) {
      nodes.splice(i, -1, whiteSpaces);
    }
    nodes.push("\n" + indent.repeat(level - 1));
  } else if (indent && level === 0) {
    // top level
    for (let i = 0; i < nodes.length; i += 2) {
      nodes.splice(i, -1, "\n");
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
export function pretty(html: string, options: PrettyOptions = {}): string {
  return toString(prettyNodes(parse(html).nodes, options));
}
