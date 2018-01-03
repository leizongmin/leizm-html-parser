import { NodeChildren, parse, toString } from "./index";

const REG_REMOVE_SPACES = /^\s+|\s+$/g;

export interface MinifyOptions {
  keepEmptyTextNode?: boolean;
}

/**
 * Minify input nodes
 *
 * @param nodes
 * @param options
 */
export function minifyNodes(
  nodes: NodeChildren,
  options: MinifyOptions = {}
): NodeChildren {
  if (nodes.length > 0) {
    function walk(nodes: NodeChildren): NodeChildren {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (typeof node === "string") {
          nodes[i] = node.replace(REG_REMOVE_SPACES, " ");
          // remove the text node when it is a whitespace
          if (!options.keepEmptyTextNode && nodes[i] === " ") {
            nodes.splice(i, 1);
            i--;
          }
        } else {
          if (node.children && node.children.length > 0) {
            node.children = walk(node.children);
          }
        }
      }
      return nodes;
    }

    nodes = walk(nodes);

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

/**
 * Minify input html
 *
 * @param html
 * @param options
 */
export function minify(html: string, options: MinifyOptions = {}): string {
  return toString(minifyNodes(parse(html).nodes, options));
}
