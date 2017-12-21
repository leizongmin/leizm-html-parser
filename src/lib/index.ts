export interface Node {
  tagName: string;
  properties?: Properties;
  children?: NodeChildren;
}

export type NodeChildren = Array<Node | string>;

export interface ErrorMessage {
  position: number;
  message: string;
}

export interface Properties {
  [key: string]: string | boolean | number;
}

const S_TEXT = 0;
const S_TAG_NAME = 1;
const S_PROP_NAME = 2;
const S_PROP_VALUE = 4;
const S_COMMENT = 8;

const C_LT = "<".charCodeAt(0);
const C_GT = ">".charCodeAt(0);
const C_EQ = "=".charCodeAt(0);
const C_SLASH = "/".charCodeAt(0);
const C_MINUS = "-".charCodeAt(0);
const C_S_QUOTE = "'".charCodeAt(0);
const C_D_QUOTE = '"'.charCodeAt(0);
const C_EXCLAMATION = "!".charCodeAt(0);
const C_SPACE = " ".charCodeAt(0);
const C_INVISIBLE_MAX = 32;

const AUTO_CLOSE_TAGS = ["br", "hr", "img", "href", "base", "!--", "!doctype"];

export interface Result {
  errors: ErrorMessage[];
  nodes: NodeChildren;
}

export function parse(input: string): Result {
  const nodes: NodeChildren = [];
  const errors: ErrorMessage[] = [];
  const len = input.length;

  let state: number = S_TEXT;
  let lastPos = 0;
  let currentStack: Node[] = [];
  let currentChildren: NodeChildren = nodes;
  let currentTagName = "";
  let currentProps: Properties = {};
  let currentPropQuote = 0;
  let currentPropName = "";
  let currentSelfCloseTag = false;

  function emitError(position: number, message: string) {
    errors.push({ position, message });
  }

  function lastChildNode() {
    const children = currentChildren as Node[];
    return children[children.length - 1];
  }

  function getBuf(pos: number) {
    return input.slice(lastPos, pos);
  }

  function changeState(newState: number, pos: number) {
    state = newState;
    lastPos = pos;
  }

  function pushToCurrentChildren(item: Node | string) {
    (currentChildren as Array<Node | string>).push(item);
  }

  function addText(pos: number) {
    const str = getBuf(pos);
    if (str) {
      pushToCurrentChildren(str);
    }
  }

  function addTag() {
    const tagNameLow = currentTagName.toLowerCase();
    const isClose = tagNameLow.charCodeAt(0) === C_SLASH;
    if (isClose) {
      currentTagName = currentTagName.slice(1);
    }
    const newTag: Node = {
      tagName: currentTagName
    };
    if (Object.keys(currentProps).length > 0) {
      newTag.properties = currentProps;
    }

    if (isClose) {
      const tag = currentStack.pop() as Node;
      const parent = currentStack[currentStack.length - 1];
      currentChildren = parent
        ? (parent.children as Array<string | Node>)
        : nodes;
      if (tag && tag.tagName !== newTag.tagName) {
        emitError(
          lastPos - 1,
          `close tag does not match: <${tag.tagName}></${newTag.tagName}>`
        );
      }
    } else if (
      currentSelfCloseTag ||
      AUTO_CLOSE_TAGS.indexOf(tagNameLow) !== -1
    ) {
      pushToCurrentChildren(newTag);
    } else {
      pushToCurrentChildren(newTag);
      const last = lastChildNode() as Node;
      last.children = last.children || [];
      currentStack.push(last);
      currentChildren = last.children as Node[];
    }
    currentTagName = "";
    currentProps = {};
    currentSelfCloseTag = false;
  }

  function addProp(pos: number, noValue: boolean = false) {
    const name = currentPropName.trim();
    if (name) {
      if (noValue) {
        currentProps[name] = true;
      } else {
        const value = getBuf(pos);
        currentProps[name] = value;
      }
    }
    currentPropName = "";
    currentPropQuote = 0;
  }

  for (let pos = 0; pos < len; pos++) {
    const c = input.charCodeAt(pos);
    switch (state) {
      case S_TEXT:
        if (c === C_LT) {
          addText(pos);
          changeState(S_TAG_NAME, pos + 1);
          continue;
        }
        break;

      case S_TAG_NAME:
        if (c <= C_INVISIBLE_MAX) {
          currentTagName = getBuf(pos);
          changeState(S_PROP_NAME, pos + 1);
          continue;
        } else if (c === C_GT) {
          currentTagName = getBuf(pos);
          addTag();
          changeState(S_TEXT, pos + 1);
          continue;
        } else if (c === C_MINUS) {
          const pc = input.charCodeAt(pos - 1);
          const nc = input.charCodeAt(pos + 1);
          if (pc === C_EXCLAMATION && nc === c) {
            currentTagName = "!--";
            changeState(S_COMMENT, pos + 2);
            continue;
          }
        }
        break;

      case S_PROP_NAME:
        if (c === C_EQ) {
          currentPropQuote = 0;
          currentPropName = getBuf(pos);
          const nc = input.charCodeAt(pos + 1);
          if (nc === C_S_QUOTE || nc === C_D_QUOTE) {
            currentPropQuote = nc;
            pos++;
            changeState(S_PROP_VALUE, pos + 1);
          } else if (nc === C_SPACE) {
            pos++;
            addProp(pos, true);
            changeState(S_PROP_NAME, pos + 1);
          } else {
            changeState(S_PROP_VALUE, pos + 1);
          }
          continue;
        } else if (c === C_S_QUOTE || c === C_D_QUOTE) {
          currentPropQuote = c;
          currentPropName = getBuf(pos);
          changeState(S_PROP_VALUE, pos + 1);
          continue;
        } else if (c <= C_INVISIBLE_MAX) {
          currentPropName = getBuf(pos);
          addProp(pos, true);
          changeState(S_PROP_NAME, pos + 1);
          continue;
        } else if (c === C_GT) {
          currentPropName = getBuf(pos);
          addProp(pos, true);
          addTag();
          changeState(S_TEXT, pos + 1);
          continue;
        } else if (c === C_SLASH && input.charCodeAt(lastPos + 1) === C_GT) {
          currentPropName = getBuf(pos);
          addProp(pos, true);
          currentSelfCloseTag = true;
          addTag();
          changeState(S_TEXT, pos + 2);
          continue;
        }
        break;

      case S_PROP_VALUE:
        if (c === currentPropQuote) {
          addProp(pos);
          changeState(S_PROP_NAME, pos + 1);
          continue;
        } else if (currentPropQuote === 0 && c === C_SPACE) {
          addProp(pos);
          changeState(S_PROP_NAME, pos + 1);
        } else if (c === C_GT) {
          addProp(pos);
          addTag();
          changeState(S_TEXT, pos + 1);
        }
        break;

      case S_COMMENT:
        if (c === C_GT) {
          const pc = input.charCodeAt(pos - 1);
          const pc2 = input.charCodeAt(pos - 2);
          if (pc === pc2 && pc === C_MINUS) {
            currentProps.comment = getBuf(pos - 2);
            addTag();
            changeState(S_TEXT, pos + 1);
          }
        }
        break;

      default:
        throw new Error(`invalid state`);
    }
  }

  switch (state) {
    case S_COMMENT:
      currentProps.comment = getBuf(len);
      addTag();
      break;
    default:
      addText(len);
  }

  return { errors, nodes };
}

export function toString(nodes: NodeChildren): string {
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
            toString(item.children) +
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

function formatPropValue(value: number | boolean | string): string {
  switch (typeof value) {
    case "number":
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
