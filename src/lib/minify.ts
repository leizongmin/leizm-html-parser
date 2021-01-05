import { NodeChildren, TextNode, TagNode, parse, toString } from "./index";

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
export function minifyNodes(nodes: NodeChildren, options: MinifyOptions = {}): NodeChildren {
  if (nodes.length > 0) {
    function walk(nodes: NodeChildren): NodeChildren {
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i];
        if (item.type === "text") {
          const textNode = item as TextNode;
          textNode.text = textNode.text.replace(REG_REMOVE_SPACES, " ");
          // remove the text node when it is a whitespace
          if (!options.keepEmptyTextNode && textNode.text === " ") {
            nodes.splice(i, 1);
            i--;
          }
        } else {
          const tagNode = item as TagNode;
          if (tagNode.children && tagNode.children.length > 0) {
            tagNode.children = walk(tagNode.children);
          }
        }
      }
      return nodes;
    }

    nodes = walk(nodes);

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
 * Minify input html
 *
 * @param html
 * @param options
 */
export function minify(html: string, options: MinifyOptions = {}): string {
  return toString(minifyNodes(parse(html).nodes, options));
}
