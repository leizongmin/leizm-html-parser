import { NodeChildren, Properties } from "./index";
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
      if (typeof item === "string") {
        html += item;
      } else if (item) {
        switch (item.tagName) {
          case "!--":
            if (item.children) {
              html += `<!--${nodesToString(item.children)}-->`;
            }
            break;
          case "!DOCTYPE":
            html += `<${item.tagName}${propsToString(item.properties)}>`;
            break;
          case "![CDATA[":
            if (item.children) {
              html += `<![CDATA[${nodesToString(item.children)}]]>`;
            }
            break;
          default:
            if (item.children) {
              html +=
                `<${item.tagName}${propsToString(item.properties)}>` +
                nodesToString(item.children) +
                `</${item.tagName}>`;
            } else if (isVoidTag(item.tagName)) {
              html += `<${item.tagName}${propsToString(item.properties)}>`;
            } else if (item.tagName === "?xml") {
              html += `<${item.tagName}${propsToString(item.properties)} ?>`;
            } else {
              html += `<${item.tagName}${propsToString(item.properties)} />`;
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
