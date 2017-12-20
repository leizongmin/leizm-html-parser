export interface Node {
  tagName: string;
  props?: Props;
  children?: NodeChildren;
}

export type NodeChildren = Array<Node | string>;

export interface ErrorMessage {
  position: number;
  message: string;
}

export interface Props {
  [key: string]: string | boolean | number;
}

const S_TEXT_START = 0;
const S_TAG_NAME_START = 1;
const S_PROP_NAME_START = 2;
const S_PROP_VALUE_START = 4;
const S_COMMENT_START = 8;
type State = number;

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

export function parse(input: string): NodeChildren {
  const nodes: NodeChildren = [];
  const errors: ErrorMessage[] = [];
  const len = input.length;

  let state: State = S_TEXT_START;
  let lastPos = 0;
  let currentStack: Node[] = [];
  let currentChildren: NodeChildren = nodes;
  let currentTagName = "";
  let currentProps: Props = {};
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
    const tagNameLC = currentTagName.toLowerCase();
    const isClose = tagNameLC.charCodeAt(0) === C_SLASH;
    if (isClose) {
      currentTagName = currentTagName.slice(1);
    }
    const newTag: Node = {
      tagName: currentTagName
    };
    if (Object.keys(currentProps).length > 0) {
      newTag.props = currentProps;
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
      tagNameLC === "hr" ||
      tagNameLC === "br" ||
      tagNameLC === "!--"
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
      case S_TEXT_START:
        if (c === C_LT) {
          addText(pos);
          changeState(S_TAG_NAME_START, pos + 1);
          continue;
        }
        break;

      case S_TAG_NAME_START:
        if (c <= C_INVISIBLE_MAX) {
          currentTagName = getBuf(pos);
          changeState(S_PROP_NAME_START, pos + 1);
          continue;
        } else if (c === C_GT) {
          currentTagName = getBuf(pos);
          addTag();
          changeState(S_TEXT_START, pos + 1);
          continue;
        } else if (c === C_MINUS) {
          const pc = input.charCodeAt(pos - 1);
          const nc = input.charCodeAt(pos + 1);
          if (pc === C_EXCLAMATION && nc === c) {
            currentTagName = "!--";
            changeState(S_COMMENT_START, pos + 2);
            continue;
          }
        }
        break;

      case S_PROP_NAME_START:
        if (c === C_EQ) {
          currentPropQuote = 0;
          currentPropName = getBuf(pos);
          const nc = input.charCodeAt(pos + 1);
          if (nc === C_S_QUOTE || c === C_D_QUOTE) {
            currentPropQuote = nc;
            pos++;
            changeState(S_PROP_VALUE_START, pos + 1);
          } else if (nc === C_SPACE) {
            pos++;
            addProp(pos);
            changeState(S_PROP_NAME_START, pos + 1);
          } else {
            changeState(S_PROP_VALUE_START, pos + 1);
          }
          continue;
        } else if (c === C_S_QUOTE || c === C_D_QUOTE) {
          currentPropQuote = c;
          currentPropName = getBuf(pos);
          changeState(S_PROP_VALUE_START, pos + 1);
          continue;
        } else if (c <= C_INVISIBLE_MAX) {
          currentPropName = getBuf(pos);
          addProp(pos);
          changeState(S_PROP_NAME_START, pos + 1);
          continue;
        } else if (c === C_GT) {
          currentPropName = getBuf(pos);
          addProp(pos);
          addTag();
          changeState(S_TEXT_START, pos + 1);
          continue;
        } else if (c === C_SLASH && input.charCodeAt(lastPos + 1) === C_GT) {
          currentPropName = getBuf(pos);
          addProp(pos);
          currentSelfCloseTag = true;
          addTag();
          changeState(S_TEXT_START, pos + 2);
          continue;
        }
        break;

      case S_PROP_VALUE_START:
        if (c === currentPropQuote) {
          addProp(pos);
          changeState(S_PROP_NAME_START, pos + 1);
          continue;
        } else if (currentPropQuote === 0 && c === C_SPACE) {
          addProp(pos);
          changeState(S_PROP_NAME_START, pos + 1);
        } else if (c === C_GT) {
          addProp(pos);
          addTag();
          changeState(S_TEXT_START, pos + 1);
        }
        break;

      case S_COMMENT_START:
        if (c === C_GT) {
          const pc = input.charCodeAt(pos - 1);
          const pc2 = input.charCodeAt(pos - 2);
          if (pc === pc2 && pc === C_MINUS) {
            currentProps.comment = getBuf(pos - 2);
            addTag();
            changeState(S_TEXT_START, pos + 1);
          }
        }
        break;

      default:
        throw new Error(`invalid state`);
    }
  }

  switch (state) {
    case S_COMMENT_START:
      currentProps.comment = getBuf(len);
      addTag();
      break;
    default:
      addText(len);
  }

  if (errors.length > 0) {
    console.log(errors);
  }

  return nodes;
}

export function toString(nodes: NodeChildren): string {
  let html = "";
  if (nodes) {
    for (const item of nodes) {
      if (typeof item === "string") {
        html += item;
      } else if (item) {
        if (item.tagName === "!--" && item.props) {
          html += `<!--${item.props.comment}-->`;
        } else if (item.children) {
          html +=
            `<${item.tagName}${propsToString(item.props)}>` +
            toString(item.children) +
            `</${item.tagName}>`;
        } else {
          html += `<${item.tagName}${propsToString(item.props)} />`;
        }
      }
    }
  }
  return html;
}

function propsToString(props?: Props): string {
  let ret = "";
  if (props) {
    for (const name in props) {
      ret += ` ${name}=${formatPropValue(props[name])}`;
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
