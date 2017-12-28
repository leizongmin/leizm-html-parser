import {
  isVoidTag,
  isNonVoidTag,
  isHtml5Tag,
  isRawTextTag,
  isEscapableRawTextTag
} from "./tags";

export interface Node {
  /**
   * tag name
   */
  tagName: string;
  /**
   * properties, if don't have any properties, then properties is `undefined`
   */
  properties?: Properties;
  /**
   * children array, if is a void tag, then children is `undefined`
   */
  children?: NodeChildren;
}

export type NodeChildren = Array<Node | string>;

export interface ErrorMessage {
  /**
   * position offset, start from 0
   */
  position: number;
  /**
   * error message
   */
  message: string;
}

export interface Properties {
  [key: string]: string | boolean;
}

export interface Result {
  errors: ErrorMessage[];
  nodes: NodeChildren;
}

/**
 * parse HTML source and returns parsed Nodes
 * @param input HTML source
 */
export function parse(input: string): Result {
  const S_TEXT = 0;
  const S_TAG_NAME = 1;
  const S_PROP_NAME = 2;
  const S_PROP_VALUE = 3;
  const S_COMMENT = 4;
  const S_CDATA = 5;
  const S_RAW_TEXT = 6;

  const C_INVISIBLE_MAX = 32;
  const C_SPACE = 32; // " ".charCodeAt(0);
  const C_EXCLAMATION = 33; // "!".charCodeAt(0);
  const C_D_QUOTE = 34; // '"'.charCodeAt(0);
  const C_S_QUOTE = 39; // "'".charCodeAt(0);
  const C_MINUS = 45; // "-".charCodeAt(0);
  const C_SLASH = 47; // "/".charCodeAt(0);
  const C_LT = 60; // "<".charCodeAt(0);
  const C_EQ = 61; // "=".charCodeAt(0);
  const C_GT = 62; // ">".charCodeAt(0);
  const C_SQUARE_BRACKET_L = 91; // "[".charCodeAt(0);
  const C_SQUARE_BRACKET_R = 93; // "]".charCodeAt(0);

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
  let currentSelfClosing = false;

  function emitError(position: number, message: string) {
    errors.push({ position, message });
  }

  function lastChildNode() {
    return currentChildren[currentChildren.length - 1] as Node;
  }

  function lastNode() {
    return currentStack[currentStack.length - 1];
  }

  function popNodeStack() {
    const tag = currentStack.pop() as Node;
    const parent = currentStack[currentStack.length - 1];
    currentChildren = parent
      ? (parent.children as Array<string | Node>)
      : nodes;
    return { tag, parent };
  }

  function getBuf(pos: number) {
    return input.slice(lastPos, pos);
  }

  function changeState(newState: number, pos: number = lastPos) {
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

  function addTag(): number {
    let tagNameLow = currentTagName.toLowerCase();
    const isEnd = tagNameLow.charCodeAt(0) === C_SLASH;
    if (isEnd) {
      currentTagName = currentTagName.slice(1);
      tagNameLow = tagNameLow.slice(1);
    }
    const newTag: Node = {
      tagName: isHtml5Tag(tagNameLow) ? tagNameLow : currentTagName
    };
    if (Object.keys(currentProps).length > 0) {
      newTag.properties = currentProps;
    }
    if (tagNameLow === "!doctype") {
      newTag.tagName = "!DOCTYPE";
    }

    if (isEnd) {
      const { tag, parent } = popNodeStack();
      if (tag && tag.tagName !== newTag.tagName) {
        emitError(
          lastPos - 1,
          `start tag and end tag does not match: <${tag.tagName}></${
            newTag.tagName
          }>`
        );
      }
    } else if (currentSelfClosing) {
      if (isNonVoidTag(tagNameLow)) {
        newTag.children = [];
      }
      pushToCurrentChildren(newTag);
    } else if (isVoidTag(tagNameLow)) {
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
    currentSelfClosing = false;

    if (isRawTextTag(tagNameLow)) {
      return S_RAW_TEXT;
    } else {
      return S_TEXT;
    }
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
    } else {
      const value = getBuf(pos);
      if (value) {
        currentProps[`"${value}"`] = true;
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
          changeState(addTag(), pos + 1);
          continue;
        } else if (c === C_MINUS) {
          const pc = input.charCodeAt(pos - 1);
          const nc = input.charCodeAt(pos + 1);
          if (pc === C_EXCLAMATION && nc === c) {
            currentTagName = "!--";
            changeState(S_COMMENT, pos + 2);
            continue;
          }
        } else if (c === C_SQUARE_BRACKET_L) {
          if (pos - lastPos === 7 && getBuf(pos + 1) === "![CDATA[") {
            currentTagName = "![CDATA[";
            changeState(S_CDATA, pos + 1);
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
            continue;
          } else if (nc === C_SPACE) {
            pos++;
            addProp(pos, true);
            changeState(S_PROP_NAME, pos + 1);
            continue;
          } else {
            changeState(S_PROP_VALUE, pos + 1);
            continue;
          }
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
          changeState(addTag(), pos + 1);
          continue;
        } else if (c === C_SLASH && input.charCodeAt(lastPos + 1) === C_GT) {
          currentPropName = getBuf(pos);
          addProp(pos, true);
          currentSelfClosing = true;
          changeState(addTag(), pos + 2);
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
          continue;
        } else if (currentPropQuote === 0 && c === C_GT) {
          addProp(pos);
          changeState(addTag(), pos + 1);
          continue;
        }
        break;

      case S_COMMENT:
        if (c === C_GT) {
          const pc = input.charCodeAt(pos - 1);
          const pc2 = input.charCodeAt(pos - 2);
          if (pc === pc2 && pc === C_MINUS) {
            const children = [getBuf(pos - 2)];
            currentSelfClosing = true;
            changeState(addTag(), pos + 1);
            lastChildNode().children = children;
            continue;
          }
        }
        break;

      case S_CDATA:
        if (c === C_GT) {
          const pc = input.charCodeAt(pos - 1);
          const pc2 = input.charCodeAt(pos - 2);
          if (pc === pc2 && pc === C_SQUARE_BRACKET_R) {
            const children = [getBuf(pos - 2)];
            currentSelfClosing = true;
            changeState(addTag(), pos + 1);
            lastChildNode().children = children;
            continue;
          }
        }
        break;

      case S_RAW_TEXT:
        if (c === C_LT) {
          const nc = input.charCodeAt(pos + 1);
          if (nc === C_SLASH) {
            const tag = lastNode();
            const end = pos + 2 + tag.tagName.length;
            if (input.slice(pos + 2, end).toLowerCase() === tag.tagName) {
              tag.children = [getBuf(pos)];
              popNodeStack();
              changeState(S_TEXT, end + 1);
            }
          }
        }
        break;

      default:
        throw new Error(`fatal: invalid state ${state}`);
    }
  }

  switch (state) {
    case S_COMMENT:
      currentSelfClosing = true;
      addTag();
      lastChildNode().children = [getBuf(len)];
      break;
    default:
      addText(len);
  }

  return { errors, nodes };
}
