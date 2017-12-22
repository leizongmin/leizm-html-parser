import { NodeChildren, Properties } from "./index";

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
        if (item.tagName === "!--" && item.properties) {
          html += `<!--${item.properties.comment}-->`;
        } else if (item.tagName.toLocaleLowerCase() === "!doctype") {
          html += `<${item.tagName}${propsToString(item.properties)}>`;
        } else if (item.children) {
          html +=
            `<${item.tagName}${propsToString(item.properties)}>` +
            nodesToString(item.children) +
            `</${item.tagName}>`;
        } else {
          html += `<${item.tagName}${propsToString(item.properties)} />`;
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
        ret += ` ${name}=${formatPropValue(props[name])}`;
      }
    }
  }
  return ret;
}

function formatPropValue(value: boolean | string): string {
  switch (typeof value) {
    case "boolean":
      return `"${value}"`;
    default:
      return `"${escapeHtml(value as string)}"`;
  }
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
