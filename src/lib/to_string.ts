import { NodeChildren, Properties, TextNode, TagNode } from "./index";
import { isVoidTag } from "./tags";

export interface ToStringOptions {
  pretty?: boolean;
  indent?: string;
}

export function toString(
  nodes: NodeChildren,
  options: ToStringOptions = {}
): string {
  options.pretty = !!options.pretty;
  options.indent = options.pretty ? options.indent || "\t" : "";
  if (options.pretty) {
    nodes = prettyHtml(nodes, options.indent);
  }
  return nodesToString(nodes);
}

function nodesToString(nodes: NodeChildren): string {
  let html = "";
  if (nodes) {
    for (const item of nodes) {
      if (item.type === "text") {
        html += (item as TextNode).text;
      } else if (item.type === "tag") {
        const tag = item as TagNode;
        switch (tag.name) {
          case "!--":
            if (tag.children) {
              html += `<!--${nodesToString(tag.children)}-->`;
            }
            break;
          case "!DOCTYPE":
            html += `<${tag.name}${propsToString(tag.properties)}>`;
            break;
          case "![CDATA[":
            if (tag.children) {
              html += `<![CDATA[${nodesToString(tag.children)}]]>`;
            }
            break;
          default:
            if (tag.children) {
              html +=
                `<${tag.name}${propsToString(tag.properties)}>` +
                nodesToString(tag.children) +
                `</${tag.name}>`;
            } else if (isVoidTag(tag.name)) {
              html += `<${tag.name}${propsToString(tag.properties)}>`;
            } else if (tag.name === "?xml") {
              html += `<${tag.name}${propsToString(tag.properties)} ?>`;
            } else {
              html += `<${tag.name}${propsToString(tag.properties)} />`;
            }
        }
      }
    }
  }
  return html;
}

function propsToString(props?: Properties): string {
  let ret = "";
  if (props) {
    for (const name in props) {
      if (props[name] === true) {
        ret += ` ${name}`;
      } else {
        ret += ` ${name}="${escapeHtml(props[name] as string)}"`;
      }
    }
  }
  return ret;
}

function escapeHtml(str: string): string {
  let ret = "";
  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case "<":
        ret += "&lt;";
        break;
      case ">":
        ret += "&gt;";
        break;
      case "'":
        ret += "&apos;";
        break;
      case '"':
        ret += "&quot;";
        break;
      default:
        ret += str[i];
    }
  }
  return ret;
}

function prettyHtml(nodes: NodeChildren, indent: string): NodeChildren {
  return nodes;
}
