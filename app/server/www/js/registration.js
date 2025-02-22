'use strict';

function createElement(query, ns) {
  const {
    tag,
    id,
    className
  } = parse(query);
  const element = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
  if (id) {
    element.id = id;
  }
  if (className) {
    {
      element.className = className;
    }
  }
  return element;
}
function parse(query) {
  const chunks = query.split(/([.#])/);
  let className = "";
  let id = "";
  for (let i = 1; i < chunks.length; i += 2) {
    switch (chunks[i]) {
      case ".":
        className += ` ${chunks[i + 1]}`;
        break;
      case "#":
        id = chunks[i + 1];
    }
  }
  return {
    className: className.trim(),
    tag: chunks[0] || "div",
    id
  };
}
function html(query, ...args) {
  let element;
  const type = typeof query;
  if (type === "string") {
    element = createElement(query);
  } else if (type === "function") {
    const Query = query;
    element = new Query(...args);
  } else {
    throw new Error("At least one argument required");
  }
  parseArgumentsInternal(getEl(element), args);
  return element;
}
const el = html;
html.extend = function extendHtml(...args) {
  return html.bind(this, ...args);
};
function doUnmount(child, childEl, parentEl) {
  const hooks = childEl.__redom_lifecycle;
  if (hooksAreEmpty(hooks)) {
    childEl.__redom_lifecycle = {};
    return;
  }
  let traverse = parentEl;
  if (childEl.__redom_mounted) {
    trigger(childEl, "onunmount");
  }
  while (traverse) {
    const parentHooks = traverse.__redom_lifecycle || {};
    for (const hook in hooks) {
      if (parentHooks[hook]) {
        parentHooks[hook] -= hooks[hook];
      }
    }
    if (hooksAreEmpty(parentHooks)) {
      traverse.__redom_lifecycle = null;
    }
    traverse = traverse.parentNode;
  }
}
function hooksAreEmpty(hooks) {
  if (hooks == null) {
    return true;
  }
  for (const key in hooks) {
    if (hooks[key]) {
      return false;
    }
  }
  return true;
}

/* global Node, ShadowRoot */

const hookNames = ["onmount", "onremount", "onunmount"];
const shadowRootAvailable = typeof window !== "undefined" && "ShadowRoot" in window;
function mount(parent, _child, before, replace) {
  let child = _child;
  const parentEl = getEl(parent);
  const childEl = getEl(child);
  if (child === childEl && childEl.__redom_view) {
    // try to look up the view if not provided
    child = childEl.__redom_view;
  }
  if (child !== childEl) {
    childEl.__redom_view = child;
  }
  const wasMounted = childEl.__redom_mounted;
  const oldParent = childEl.parentNode;
  if (wasMounted && oldParent !== parentEl) {
    doUnmount(child, childEl, oldParent);
  }
  {
    parentEl.appendChild(childEl);
  }
  doMount(child, childEl, parentEl, oldParent);
  return child;
}
function trigger(el, eventName) {
  if (eventName === "onmount" || eventName === "onremount") {
    el.__redom_mounted = true;
  } else if (eventName === "onunmount") {
    el.__redom_mounted = false;
  }
  const hooks = el.__redom_lifecycle;
  if (!hooks) {
    return;
  }
  const view = el.__redom_view;
  let hookCount = 0;
  view?.[eventName]?.();
  for (const hook in hooks) {
    if (hook) {
      hookCount++;
    }
  }
  if (hookCount) {
    let traverse = el.firstChild;
    while (traverse) {
      const next = traverse.nextSibling;
      trigger(traverse, eventName);
      traverse = next;
    }
  }
}
function doMount(child, childEl, parentEl, oldParent) {
  if (!childEl.__redom_lifecycle) {
    childEl.__redom_lifecycle = {};
  }
  const hooks = childEl.__redom_lifecycle;
  const remount = parentEl === oldParent;
  let hooksFound = false;
  for (const hookName of hookNames) {
    if (!remount) {
      // if already mounted, skip this phase
      if (child !== childEl) {
        // only Views can have lifecycle events
        if (hookName in child) {
          hooks[hookName] = (hooks[hookName] || 0) + 1;
        }
      }
    }
    if (hooks[hookName]) {
      hooksFound = true;
    }
  }
  if (!hooksFound) {
    childEl.__redom_lifecycle = {};
    return;
  }
  let traverse = parentEl;
  let triggered = false;
  if (remount || traverse?.__redom_mounted) {
    trigger(childEl, remount ? "onremount" : "onmount");
    triggered = true;
  }
  while (traverse) {
    const parent = traverse.parentNode;
    if (!traverse.__redom_lifecycle) {
      traverse.__redom_lifecycle = {};
    }
    const parentHooks = traverse.__redom_lifecycle;
    for (const hook in hooks) {
      parentHooks[hook] = (parentHooks[hook] || 0) + hooks[hook];
    }
    if (triggered) {
      break;
    }
    if (traverse.nodeType === Node.DOCUMENT_NODE || shadowRootAvailable && traverse instanceof ShadowRoot || parent?.__redom_mounted) {
      trigger(traverse, remount ? "onremount" : "onmount");
      triggered = true;
    }
    traverse = parent;
  }
}
function setStyle(view, arg1, arg2) {
  const el = getEl(view);
  if (typeof arg1 === "object") {
    for (const key in arg1) {
      setStyleValue(el, key, arg1[key]);
    }
  } else {
    setStyleValue(el, arg1, arg2);
  }
}
function setStyleValue(el, key, value) {
  el.style[key] = value == null ? "" : value;
}

/* global SVGElement */

const xlinkns = "http://www.w3.org/1999/xlink";
function setAttrInternal(view, arg1, arg2, initial) {
  const el = getEl(view);
  const isObj = typeof arg1 === "object";
  if (isObj) {
    for (const key in arg1) {
      setAttrInternal(el, key, arg1[key]);
    }
  } else {
    const isSVG = el instanceof SVGElement;
    const isFunc = typeof arg2 === "function";
    if (arg1 === "style" && typeof arg2 === "object") {
      setStyle(el, arg2);
    } else if (isSVG && isFunc) {
      el[arg1] = arg2;
    } else if (arg1 === "dataset") {
      setData(el, arg2);
    } else if (!isSVG && (arg1 in el || isFunc) && arg1 !== "list") {
      el[arg1] = arg2;
    } else {
      if (isSVG && arg1 === "xlink") {
        setXlink(el, arg2);
        return;
      }
      if (arg1 === "class") {
        setClassName(el, arg2);
        return;
      }
      if (arg2 == null) {
        el.removeAttribute(arg1);
      } else {
        el.setAttribute(arg1, arg2);
      }
    }
  }
}
function setClassName(el, additionToClassName) {
  if (additionToClassName == null) {
    el.removeAttribute("class");
  } else if (el.classList) {
    el.classList.add(additionToClassName);
  } else if (typeof el.className === "object" && el.className && el.className.baseVal) {
    el.className.baseVal = `${el.className.baseVal} ${additionToClassName}`.trim();
  } else {
    el.className = `${el.className} ${additionToClassName}`.trim();
  }
}
function setXlink(el, arg1, arg2) {
  if (typeof arg1 === "object") {
    for (const key in arg1) {
      setXlink(el, key, arg1[key]);
    }
  } else {
    if (arg2 != null) {
      el.setAttributeNS(xlinkns, arg1, arg2);
    } else {
      el.removeAttributeNS(xlinkns, arg1, arg2);
    }
  }
}
function setData(el, arg1, arg2) {
  if (typeof arg1 === "object") {
    for (const key in arg1) {
      setData(el, key, arg1[key]);
    }
  } else {
    if (arg2 != null) {
      el.dataset[arg1] = arg2;
    } else {
      delete el.dataset[arg1];
    }
  }
}
function text(str) {
  return document.createTextNode(str != null ? str : "");
}
function parseArgumentsInternal(element, args, initial) {
  for (const arg of args) {
    if (arg !== 0 && !arg) {
      continue;
    }
    const type = typeof arg;
    if (type === "function") {
      arg(element);
    } else if (type === "string" || type === "number") {
      element.appendChild(text(arg));
    } else if (isNode(getEl(arg))) {
      mount(element, arg);
    } else if (arg.length) {
      parseArgumentsInternal(element, arg);
    } else if (type === "object") {
      setAttrInternal(element, arg, null);
    }
  }
}
function getEl(parent) {
  return parent.nodeType && parent || !parent.el && parent || getEl(parent.el);
}
function isNode(arg) {
  return arg?.nodeType;
}

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _createClass(e, r, t) {
  return Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var Input = /*#__PURE__*/_createClass(function Input() {
  var _this = this;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Input);
  _defineProperty(this, "updateLabel", function (label) {
    // TODO:
    console.log('input. change lang', label);
  });
  _defineProperty(this, "_ui_render", function () {
    var _this$_prop = _this._prop,
      label = _this$_prop.label,
      placeholder = _this$_prop.placeholder;
    return el("div", null, el("label", {
      className: 'form-label'
    }, label, el("input", {
      type: 'text',
      className: 'form-control',
      placeholder: placeholder
    })));
  });
  var _settings$label = settings.label,
    _label = _settings$label === void 0 ? '' : _settings$label,
    _settings$placeholder = settings.placeholder,
    _placeholder = _settings$placeholder === void 0 ? '' : _settings$placeholder;
  this._prop = {
    label: _label,
    placeholder: _placeholder
  };
  this.el = this._ui_render();
});

var LoginAndPassForm = /*#__PURE__*/_createClass(function LoginAndPassForm() {
  _classCallCheck(this, LoginAndPassForm);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      className: 'mb-3'
    }, new Input({
      label: 'E-mail',
      placeholder: 'somebody@gmail.com'
    })), new Input({
      label: 'Пароль',
      placeholder: '********'
    }));
  });
  this.el = this._ui_render();
});

var RegFrom = /*#__PURE__*/_createClass(function RegFrom() {
  _classCallCheck(this, RegFrom);
  _defineProperty(this, "_ui_render", function () {
    return el("div", {
      className: 'd-flex flex-column'
    }, new LoginAndPassForm({}), new Input({
      label: 'Repeat password'
    }));
  });
  this.el = this._ui_render();
});

mount(document.getElementById('main'), new RegFrom({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0cmF0aW9uLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2F0b20vaW5wdXQuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3dpZGdldC9sb2dpbkFuZFBhc3NGb3JtLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvcmVnRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvcmVnaXN0cmF0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKSB7XG4gIGNvbnN0IHsgdGFnLCBpZCwgY2xhc3NOYW1lIH0gPSBwYXJzZShxdWVyeSk7XG4gIGNvbnN0IGVsZW1lbnQgPSBuc1xuICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpXG4gICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cbiAgaWYgKGlkKSB7XG4gICAgZWxlbWVudC5pZCA9IGlkO1xuICB9XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGlmIChucykge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gcGFyc2UocXVlcnkpIHtcbiAgY29uc3QgY2h1bmtzID0gcXVlcnkuc3BsaXQoLyhbLiNdKS8pO1xuICBsZXQgY2xhc3NOYW1lID0gXCJcIjtcbiAgbGV0IGlkID0gXCJcIjtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8IGNodW5rcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHN3aXRjaCAoY2h1bmtzW2ldKSB7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBjbGFzc05hbWUgKz0gYCAke2NodW5rc1tpICsgMV19YDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIGlkID0gY2h1bmtzW2kgKyAxXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLnRyaW0oKSxcbiAgICB0YWc6IGNodW5rc1swXSB8fCBcImRpdlwiLFxuICAgIGlkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBodG1sKHF1ZXJ5LCAuLi5hcmdzKSB7XG4gIGxldCBlbGVtZW50O1xuXG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgcXVlcnk7XG5cbiAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChxdWVyeSk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IFF1ZXJ5KC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5jb25zdCBlbCA9IGh0bWw7XG5jb25zdCBoID0gaHRtbDtcblxuaHRtbC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRIdG1sKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGh0bWwuYmluZCh0aGlzLCAuLi5hcmdzKTtcbn07XG5cbmZ1bmN0aW9uIHVubW91bnQocGFyZW50LCBfY2hpbGQpIHtcbiAgbGV0IGNoaWxkID0gX2NoaWxkO1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZEVsLnBhcmVudE5vZGUpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKTtcblxuICAgIHBhcmVudEVsLnJlbW92ZUNoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKSB7XG4gIGNvbnN0IGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoaG9va3NBcmVFbXB0eShob29rcykpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRyYXZlcnNlID0gcGFyZW50RWw7XG5cbiAgaWYgKGNoaWxkRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgdHJpZ2dlcihjaGlsZEVsLCBcIm9udW5tb3VudFwiKTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgfHwge307XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIGlmIChwYXJlbnRIb29rc1tob29rXSkge1xuICAgICAgICBwYXJlbnRIb29rc1tob29rXSAtPSBob29rc1tob29rXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaG9va3NBcmVFbXB0eShwYXJlbnRIb29rcykpIHtcbiAgICAgIHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cmF2ZXJzZSA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaG9va3NBcmVFbXB0eShob29rcykge1xuICBpZiAoaG9va3MgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2tzW2tleV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qIGdsb2JhbCBOb2RlLCBTaGFkb3dSb290ICovXG5cblxuY29uc3QgaG9va05hbWVzID0gW1wib25tb3VudFwiLCBcIm9ucmVtb3VudFwiLCBcIm9udW5tb3VudFwiXTtcbmNvbnN0IHNoYWRvd1Jvb3RBdmFpbGFibGUgPVxuICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIFwiU2hhZG93Um9vdFwiIGluIHdpbmRvdztcblxuZnVuY3Rpb24gbW91bnQocGFyZW50LCBfY2hpbGQsIGJlZm9yZSwgcmVwbGFjZSkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX3ZpZXcgPSBjaGlsZDtcbiAgfVxuXG4gIGNvbnN0IHdhc01vdW50ZWQgPSBjaGlsZEVsLl9fcmVkb21fbW91bnRlZDtcbiAgY29uc3Qgb2xkUGFyZW50ID0gY2hpbGRFbC5wYXJlbnROb2RlO1xuXG4gIGlmICh3YXNNb3VudGVkICYmIG9sZFBhcmVudCAhPT0gcGFyZW50RWwpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIG9sZFBhcmVudCk7XG4gIH1cblxuICBpZiAoYmVmb3JlICE9IG51bGwpIHtcbiAgICBpZiAocmVwbGFjZSkge1xuICAgICAgY29uc3QgYmVmb3JlRWwgPSBnZXRFbChiZWZvcmUpO1xuXG4gICAgICBpZiAoYmVmb3JlRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgICAgIHRyaWdnZXIoYmVmb3JlRWwsIFwib251bm1vdW50XCIpO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnRFbC5yZXBsYWNlQ2hpbGQoY2hpbGRFbCwgYmVmb3JlRWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRFbC5pbnNlcnRCZWZvcmUoY2hpbGRFbCwgZ2V0RWwoYmVmb3JlKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgZG9Nb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwsIG9sZFBhcmVudCk7XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyKGVsLCBldmVudE5hbWUpIHtcbiAgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbm1vdW50XCIgfHwgZXZlbnROYW1lID09PSBcIm9ucmVtb3VudFwiKSB7XG4gICAgZWwuX19yZWRvbV9tb3VudGVkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChldmVudE5hbWUgPT09IFwib251bm1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGhvb2tzID0gZWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKCFob29rcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHZpZXcgPSBlbC5fX3JlZG9tX3ZpZXc7XG4gIGxldCBob29rQ291bnQgPSAwO1xuXG4gIHZpZXc/LltldmVudE5hbWVdPy4oKTtcblxuICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9vaykge1xuICAgICAgaG9va0NvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGhvb2tDb3VudCkge1xuICAgIGxldCB0cmF2ZXJzZSA9IGVsLmZpcnN0Q2hpbGQ7XG5cbiAgICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICAgIGNvbnN0IG5leHQgPSB0cmF2ZXJzZS5uZXh0U2libGluZztcblxuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgZXZlbnROYW1lKTtcblxuICAgICAgdHJhdmVyc2UgPSBuZXh0O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KSB7XG4gIGlmICghY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgfVxuXG4gIGNvbnN0IGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcbiAgY29uc3QgcmVtb3VudCA9IHBhcmVudEVsID09PSBvbGRQYXJlbnQ7XG4gIGxldCBob29rc0ZvdW5kID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBob29rTmFtZSBvZiBob29rTmFtZXMpIHtcbiAgICBpZiAoIXJlbW91bnQpIHtcbiAgICAgIC8vIGlmIGFscmVhZHkgbW91bnRlZCwgc2tpcCB0aGlzIHBoYXNlXG4gICAgICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICAgICAgLy8gb25seSBWaWV3cyBjYW4gaGF2ZSBsaWZlY3ljbGUgZXZlbnRzXG4gICAgICAgIGlmIChob29rTmFtZSBpbiBjaGlsZCkge1xuICAgICAgICAgIGhvb2tzW2hvb2tOYW1lXSA9IChob29rc1tob29rTmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChob29rc1tob29rTmFtZV0pIHtcbiAgICAgIGhvb2tzRm91bmQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9va3NGb3VuZCkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcbiAgbGV0IHRyaWdnZXJlZCA9IGZhbHNlO1xuXG4gIGlmIChyZW1vdW50IHx8IHRyYXZlcnNlPy5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIHJlbW91bnQgPyBcIm9ucmVtb3VudFwiIDogXCJvbm1vdW50XCIpO1xuICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gIH1cblxuICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuXG4gICAgaWYgKCF0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gICAgZm9yIChjb25zdCBob29rIGluIGhvb2tzKSB7XG4gICAgICBwYXJlbnRIb29rc1tob29rXSA9IChwYXJlbnRIb29rc1tob29rXSB8fCAwKSArIGhvb2tzW2hvb2tdO1xuICAgIH1cblxuICAgIGlmICh0cmlnZ2VyZWQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0cmF2ZXJzZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8XG4gICAgICAoc2hhZG93Um9vdEF2YWlsYWJsZSAmJiB0cmF2ZXJzZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHx8XG4gICAgICBwYXJlbnQ/Ll9fcmVkb21fbW91bnRlZFxuICAgICkge1xuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICAgIH1cbiAgICB0cmF2ZXJzZSA9IHBhcmVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZSh2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIGNvbnN0IGVsID0gZ2V0RWwodmlldyk7XG5cbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0U3R5bGVWYWx1ZShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZXRTdHlsZVZhbHVlKGVsLCBhcmcxLCBhcmcyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIHZhbHVlKSB7XG4gIGVsLnN0eWxlW2tleV0gPSB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlO1xufVxuXG4vKiBnbG9iYWwgU1ZHRWxlbWVudCAqL1xuXG5cbmNvbnN0IHhsaW5rbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIjtcblxuZnVuY3Rpb24gc2V0QXR0cih2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyKTtcbn1cblxuZnVuY3Rpb24gc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIsIGluaXRpYWwpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBjb25zdCBpc09iaiA9IHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiO1xuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbCwga2V5LCBhcmcxW2tleV0sIGluaXRpYWwpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpc1NWRyA9IGVsIGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcbiAgICBjb25zdCBpc0Z1bmMgPSB0eXBlb2YgYXJnMiA9PT0gXCJmdW5jdGlvblwiO1xuXG4gICAgaWYgKGFyZzEgPT09IFwic3R5bGVcIiAmJiB0eXBlb2YgYXJnMiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgc2V0U3R5bGUoZWwsIGFyZzIpO1xuICAgIH0gZWxzZSBpZiAoaXNTVkcgJiYgaXNGdW5jKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIGlmIChhcmcxID09PSBcImRhdGFzZXRcIikge1xuICAgICAgc2V0RGF0YShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmICghaXNTVkcgJiYgKGFyZzEgaW4gZWwgfHwgaXNGdW5jKSAmJiBhcmcxICE9PSBcImxpc3RcIikge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTVkcgJiYgYXJnMSA9PT0gXCJ4bGlua1wiKSB7XG4gICAgICAgIHNldFhsaW5rKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGluaXRpYWwgJiYgYXJnMSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgIHNldENsYXNzTmFtZShlbCwgYXJnMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChhcmcyID09IG51bGwpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGFyZzEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGFyZzEsIGFyZzIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRDbGFzc05hbWUoZWwsIGFkZGl0aW9uVG9DbGFzc05hbWUpIHtcbiAgaWYgKGFkZGl0aW9uVG9DbGFzc05hbWUgPT0gbnVsbCkge1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICB9IGVsc2UgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoYWRkaXRpb25Ub0NsYXNzTmFtZSk7XG4gIH0gZWxzZSBpZiAoXG4gICAgdHlwZW9mIGVsLmNsYXNzTmFtZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgIGVsLmNsYXNzTmFtZSAmJlxuICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsXG4gICkge1xuICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsID1cbiAgICAgIGAke2VsLmNsYXNzTmFtZS5iYXNlVmFsfSAke2FkZGl0aW9uVG9DbGFzc05hbWV9YC50cmltKCk7XG4gIH0gZWxzZSB7XG4gICAgZWwuY2xhc3NOYW1lID0gYCR7ZWwuY2xhc3NOYW1lfSAke2FkZGl0aW9uVG9DbGFzc05hbWV9YC50cmltKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0WGxpbmsoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0WGxpbmsoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGFyZzIgIT0gbnVsbCkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXREYXRhKGVsLCBhcmcxLCBhcmcyKSB7XG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldERhdGEoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGFyZzIgIT0gbnVsbCkge1xuICAgICAgZWwuZGF0YXNldFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBlbC5kYXRhc2V0W2FyZzFdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0ZXh0KHN0cikge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RyICE9IG51bGwgPyBzdHIgOiBcIlwiKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VBcmd1bWVudHNJbnRlcm5hbChlbGVtZW50LCBhcmdzLCBpbml0aWFsKSB7XG4gIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICBpZiAoYXJnICE9PSAwICYmICFhcmcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgYXJnO1xuXG4gICAgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYXJnKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRleHQoYXJnKSk7XG4gICAgfSBlbHNlIGlmIChpc05vZGUoZ2V0RWwoYXJnKSkpIHtcbiAgICAgIG1vdW50KGVsZW1lbnQsIGFyZyk7XG4gICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoKSB7XG4gICAgICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZywgaW5pdGlhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRBdHRySW50ZXJuYWwoZWxlbWVudCwgYXJnLCBudWxsLCBpbml0aWFsKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5zdXJlRWwocGFyZW50KSB7XG4gIHJldHVybiB0eXBlb2YgcGFyZW50ID09PSBcInN0cmluZ1wiID8gaHRtbChwYXJlbnQpIDogZ2V0RWwocGFyZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWwocGFyZW50KSB7XG4gIHJldHVybiAoXG4gICAgKHBhcmVudC5ub2RlVHlwZSAmJiBwYXJlbnQpIHx8ICghcGFyZW50LmVsICYmIHBhcmVudCkgfHwgZ2V0RWwocGFyZW50LmVsKVxuICApO1xufVxuXG5mdW5jdGlvbiBpc05vZGUoYXJnKSB7XG4gIHJldHVybiBhcmc/Lm5vZGVUeXBlO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaChjaGlsZCwgZGF0YSwgZXZlbnROYW1lID0gXCJyZWRvbVwiKSB7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IGRhdGEgfSk7XG4gIGNoaWxkRWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbmZ1bmN0aW9uIHNldENoaWxkcmVuKHBhcmVudCwgLi4uY2hpbGRyZW4pIHtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBsZXQgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIHBhcmVudEVsLmZpcnN0Q2hpbGQpO1xuXG4gIHdoaWxlIChjdXJyZW50KSB7XG4gICAgY29uc3QgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG5cbiAgICB1bm1vdW50KHBhcmVudCwgY3VycmVudCk7XG5cbiAgICBjdXJyZW50ID0gbmV4dDtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBfY3VycmVudCkge1xuICBsZXQgY3VycmVudCA9IF9jdXJyZW50O1xuXG4gIGNvbnN0IGNoaWxkRWxzID0gQXJyYXkoY2hpbGRyZW4ubGVuZ3RoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hpbGRFbHNbaV0gPSBjaGlsZHJlbltpXSAmJiBnZXRFbChjaGlsZHJlbltpXSk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcblxuICAgIGlmICghY2hpbGQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkRWwgPSBjaGlsZEVsc1tpXTtcblxuICAgIGlmIChjaGlsZEVsID09PSBjdXJyZW50KSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChpc05vZGUoY2hpbGRFbCkpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBjdXJyZW50Py5uZXh0U2libGluZztcbiAgICAgIGNvbnN0IGV4aXN0cyA9IGNoaWxkLl9fcmVkb21faW5kZXggIT0gbnVsbDtcbiAgICAgIGNvbnN0IHJlcGxhY2UgPSBleGlzdHMgJiYgbmV4dCA9PT0gY2hpbGRFbHNbaSArIDFdO1xuXG4gICAgICBtb3VudChwYXJlbnQsIGNoaWxkLCBjdXJyZW50LCByZXBsYWNlKTtcblxuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5sZW5ndGggIT0gbnVsbCkge1xuICAgICAgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGQsIGN1cnJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBsaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIExpc3RQb29sIHtcbiAgY29uc3RydWN0b3IoVmlldywga2V5LCBpbml0RGF0YSkge1xuICAgIHRoaXMuVmlldyA9IFZpZXc7XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICAgIHRoaXMub2xkTG9va3VwID0ge307XG4gICAgdGhpcy5sb29rdXAgPSB7fTtcbiAgICB0aGlzLm9sZFZpZXdzID0gW107XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuXG4gICAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmtleSA9IHR5cGVvZiBrZXkgPT09IFwiZnVuY3Rpb25cIiA/IGtleSA6IHByb3BLZXkoa2V5KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoZGF0YSwgY29udGV4dCkge1xuICAgIGNvbnN0IHsgVmlldywga2V5LCBpbml0RGF0YSB9ID0gdGhpcztcbiAgICBjb25zdCBrZXlTZXQgPSBrZXkgIT0gbnVsbDtcblxuICAgIGNvbnN0IG9sZExvb2t1cCA9IHRoaXMubG9va3VwO1xuICAgIGNvbnN0IG5ld0xvb2t1cCA9IHt9O1xuXG4gICAgY29uc3QgbmV3Vmlld3MgPSBBcnJheShkYXRhLmxlbmd0aCk7XG4gICAgY29uc3Qgb2xkVmlld3MgPSB0aGlzLnZpZXdzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gZGF0YVtpXTtcbiAgICAgIGxldCB2aWV3O1xuXG4gICAgICBpZiAoa2V5U2V0KSB7XG4gICAgICAgIGNvbnN0IGlkID0ga2V5KGl0ZW0pO1xuXG4gICAgICAgIHZpZXcgPSBvbGRMb29rdXBbaWRdIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgICAgbmV3TG9va3VwW2lkXSA9IHZpZXc7XG4gICAgICAgIHZpZXcuX19yZWRvbV9pZCA9IGlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlldyA9IG9sZFZpZXdzW2ldIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgIH1cbiAgICAgIHZpZXcudXBkYXRlPy4oaXRlbSwgaSwgZGF0YSwgY29udGV4dCk7XG5cbiAgICAgIGNvbnN0IGVsID0gZ2V0RWwodmlldy5lbCk7XG5cbiAgICAgIGVsLl9fcmVkb21fdmlldyA9IHZpZXc7XG4gICAgICBuZXdWaWV3c1tpXSA9IHZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5vbGRWaWV3cyA9IG9sZFZpZXdzO1xuICAgIHRoaXMudmlld3MgPSBuZXdWaWV3cztcblxuICAgIHRoaXMub2xkTG9va3VwID0gb2xkTG9va3VwO1xuICAgIHRoaXMubG9va3VwID0gbmV3TG9va3VwO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb3BLZXkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiBwcm9wcGVkS2V5KGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbVtrZXldO1xuICB9O1xufVxuXG5mdW5jdGlvbiBsaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICAgIHRoaXMuVmlldyA9IFZpZXc7XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLnBvb2wgPSBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG4gICAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gICAgdGhpcy5rZXlTZXQgPSBrZXkgIT0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBrZXlTZXQgfSA9IHRoaXM7XG4gICAgY29uc3Qgb2xkVmlld3MgPSB0aGlzLnZpZXdzO1xuXG4gICAgdGhpcy5wb29sLnVwZGF0ZShkYXRhIHx8IFtdLCBjb250ZXh0KTtcblxuICAgIGNvbnN0IHsgdmlld3MsIGxvb2t1cCB9ID0gdGhpcy5wb29sO1xuXG4gICAgaWYgKGtleVNldCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvbGRWaWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvbGRWaWV3ID0gb2xkVmlld3NbaV07XG4gICAgICAgIGNvbnN0IGlkID0gb2xkVmlldy5fX3JlZG9tX2lkO1xuXG4gICAgICAgIGlmIChsb29rdXBbaWRdID09IG51bGwpIHtcbiAgICAgICAgICBvbGRWaWV3Ll9fcmVkb21faW5kZXggPSBudWxsO1xuICAgICAgICAgIHVubW91bnQodGhpcywgb2xkVmlldyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdmlld3NbaV07XG5cbiAgICAgIHZpZXcuX19yZWRvbV9pbmRleCA9IGk7XG4gICAgfVxuXG4gICAgc2V0Q2hpbGRyZW4odGhpcywgdmlld3MpO1xuXG4gICAgaWYgKGtleVNldCkge1xuICAgICAgdGhpcy5sb29rdXAgPSBsb29rdXA7XG4gICAgfVxuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgfVxufVxuXG5MaXN0LmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBMaXN0LmJpbmQoTGlzdCwgcGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn07XG5cbmxpc3QuZXh0ZW5kID0gTGlzdC5leHRlbmQ7XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cblxuZnVuY3Rpb24gcGxhY2UoVmlldywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBQbGFjZShWaWV3LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIFBsYWNlIHtcbiAgY29uc3RydWN0b3IoVmlldywgaW5pdERhdGEpIHtcbiAgICB0aGlzLmVsID0gdGV4dChcIlwiKTtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdGhpcy5lbDtcblxuICAgIGlmIChWaWV3IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgIH0gZWxzZSBpZiAoVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIHRoaXMuX2VsID0gVmlldztcbiAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX1ZpZXcgPSBWaWV3O1xuICAgIH1cblxuICAgIHRoaXMuX2luaXREYXRhID0gaW5pdERhdGE7XG4gIH1cblxuICB1cGRhdGUodmlzaWJsZSwgZGF0YSkge1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZWwucGFyZW50Tm9kZTtcblxuICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCwgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IGdldEVsKHRoaXMuX2VsKTtcbiAgICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IFZpZXcgPSB0aGlzLl9WaWV3O1xuICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVmlldyh0aGlzLl9pbml0RGF0YSk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodmlldyk7XG4gICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcblxuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHZpZXcsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy5fZWwpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy5fZWwpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMudmlldyk7XG4gICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy52aWV3KTtcblxuICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVmKGN0eCwga2V5LCB2YWx1ZSkge1xuICBjdHhba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cblxuZnVuY3Rpb24gcm91dGVyKHBhcmVudCwgdmlld3MsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUm91dGVyKHBhcmVudCwgdmlld3MsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUm91dGVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLnZpZXdzID0gdmlld3M7XG4gICAgdGhpcy5WaWV3cyA9IHZpZXdzOyAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZShyb3V0ZSwgZGF0YSkge1xuICAgIGlmIChyb3V0ZSAhPT0gdGhpcy5yb3V0ZSkge1xuICAgICAgY29uc3Qgdmlld3MgPSB0aGlzLnZpZXdzO1xuICAgICAgY29uc3QgVmlldyA9IHZpZXdzW3JvdXRlXTtcblxuICAgICAgdGhpcy5yb3V0ZSA9IHJvdXRlO1xuXG4gICAgICBpZiAoVmlldyAmJiAoVmlldyBpbnN0YW5jZW9mIE5vZGUgfHwgVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpKSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXcgPSBWaWV3ICYmIG5ldyBWaWV3KHRoaXMuaW5pdERhdGEsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBzZXRDaGlsZHJlbih0aGlzLmVsLCBbdGhpcy52aWV3XSk7XG4gICAgfVxuICAgIHRoaXMudmlldz8udXBkYXRlPy4oZGF0YSwgcm91dGUpO1xuICB9XG59XG5cbmNvbnN0IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG5mdW5jdGlvbiBzdmcocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5LCBucyk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IFF1ZXJ5KC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5jb25zdCBzID0gc3ZnO1xuXG5zdmcuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kU3ZnKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHN2Zy5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuc3ZnLm5zID0gbnM7XG5cbmZ1bmN0aW9uIHZpZXdGYWN0b3J5KHZpZXdzLCBrZXkpIHtcbiAgaWYgKCF2aWV3cyB8fCB0eXBlb2Ygdmlld3MgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ2aWV3cyBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICBpZiAoIWtleSB8fCB0eXBlb2Yga2V5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwia2V5IG11c3QgYmUgYSBzdHJpbmdcIik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIGZhY3RvcnlWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKSB7XG4gICAgY29uc3Qgdmlld0tleSA9IGl0ZW1ba2V5XTtcbiAgICBjb25zdCBWaWV3ID0gdmlld3Nbdmlld0tleV07XG5cbiAgICBpZiAoVmlldykge1xuICAgICAgcmV0dXJuIG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYHZpZXcgJHt2aWV3S2V5fSBub3QgZm91bmRgKTtcbiAgfTtcbn1cblxuZXhwb3J0IHsgTGlzdCwgTGlzdFBvb2wsIFBsYWNlLCBSb3V0ZXIsIGRpc3BhdGNoLCBlbCwgaCwgaHRtbCwgbGlzdCwgbGlzdFBvb2wsIG1vdW50LCBwbGFjZSwgcmVmLCByb3V0ZXIsIHMsIHNldEF0dHIsIHNldENoaWxkcmVuLCBzZXREYXRhLCBzZXRTdHlsZSwgc2V0WGxpbmssIHN2ZywgdGV4dCwgdW5tb3VudCwgdmlld0ZhY3RvcnkgfTtcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJycsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJycsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMYWJlbCA9IChsYWJlbCkgPT4ge1xyXG4gICAgICAgIC8vIFRPRE86XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2lucHV0LiBjaGFuZ2UgbGFuZycsIGxhYmVsKVxyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYWJlbCwgcGxhY2Vob2xkZXIgfSA9IHRoaXMuX3Byb3A7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2Zvcm0tbGFiZWwnPntsYWJlbH1cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0ndGV4dCcgY2xhc3NOYW1lPSdmb3JtLWNvbnRyb2wnIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0vPlxyXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b20vaW5wdXQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9naW5BbmRQYXNzRm9ybSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21iLTMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCBsYWJlbD0nRS1tYWlsJyBwbGFjZWhvbGRlcj0nc29tZWJvZHlAZ21haWwuY29tJy8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxJbnB1dCBsYWJlbD0n0J/QsNGA0L7Qu9GMJyBwbGFjZWhvbGRlcj0nKioqKioqKionLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b20vaW5wdXQnO1xyXG5pbXBvcnQgTG9naW5BbmRQYXNzRm9ybSBmcm9tICcuLi93aWRnZXQvbG9naW5BbmRQYXNzRm9ybSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWdGcm9tIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdkLWZsZXggZmxleC1jb2x1bW4nPlxyXG4gICAgICAgICAgICAgICAgPExvZ2luQW5kUGFzc0Zvcm0gLz5cclxuICAgICAgICAgICAgICAgIDxJbnB1dCBsYWJlbD0nUmVwZWF0IHBhc3N3b3JkJyAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgUmVnRm9ybSBmcm9tICcuL3dpZGdldC9yZWdGb3JtJ1xyXG5cclxubW91bnQoXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpLFxyXG4gICAgPFJlZ0Zvcm0gLz5cclxuKTsiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInF1ZXJ5IiwibnMiLCJ0YWciLCJpZCIsImNsYXNzTmFtZSIsInBhcnNlIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiY2h1bmtzIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwidHJpbSIsImh0bWwiLCJhcmdzIiwidHlwZSIsIlF1ZXJ5IiwiRXJyb3IiLCJwYXJzZUFyZ3VtZW50c0ludGVybmFsIiwiZ2V0RWwiLCJlbCIsImV4dGVuZCIsImV4dGVuZEh0bWwiLCJiaW5kIiwiZG9Vbm1vdW50IiwiY2hpbGQiLCJjaGlsZEVsIiwicGFyZW50RWwiLCJob29rcyIsIl9fcmVkb21fbGlmZWN5Y2xlIiwiaG9va3NBcmVFbXB0eSIsInRyYXZlcnNlIiwiX19yZWRvbV9tb3VudGVkIiwidHJpZ2dlciIsInBhcmVudEhvb2tzIiwiaG9vayIsInBhcmVudE5vZGUiLCJrZXkiLCJob29rTmFtZXMiLCJzaGFkb3dSb290QXZhaWxhYmxlIiwid2luZG93IiwibW91bnQiLCJwYXJlbnQiLCJfY2hpbGQiLCJiZWZvcmUiLCJyZXBsYWNlIiwiX19yZWRvbV92aWV3Iiwid2FzTW91bnRlZCIsIm9sZFBhcmVudCIsImFwcGVuZENoaWxkIiwiZG9Nb3VudCIsImV2ZW50TmFtZSIsInZpZXciLCJob29rQ291bnQiLCJmaXJzdENoaWxkIiwibmV4dCIsIm5leHRTaWJsaW5nIiwicmVtb3VudCIsImhvb2tzRm91bmQiLCJob29rTmFtZSIsInRyaWdnZXJlZCIsIm5vZGVUeXBlIiwiTm9kZSIsIkRPQ1VNRU5UX05PREUiLCJTaGFkb3dSb290Iiwic2V0U3R5bGUiLCJhcmcxIiwiYXJnMiIsInNldFN0eWxlVmFsdWUiLCJ2YWx1ZSIsInN0eWxlIiwieGxpbmtucyIsInNldEF0dHJJbnRlcm5hbCIsImluaXRpYWwiLCJpc09iaiIsImlzU1ZHIiwiU1ZHRWxlbWVudCIsImlzRnVuYyIsInNldERhdGEiLCJzZXRYbGluayIsInNldENsYXNzTmFtZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImFkZGl0aW9uVG9DbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJiYXNlVmFsIiwic2V0QXR0cmlidXRlTlMiLCJyZW1vdmVBdHRyaWJ1dGVOUyIsImRhdGFzZXQiLCJ0ZXh0Iiwic3RyIiwiY3JlYXRlVGV4dE5vZGUiLCJhcmciLCJpc05vZGUiLCJJbnB1dCIsIl9jcmVhdGVDbGFzcyIsIl90aGlzIiwic2V0dGluZ3MiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJfY2xhc3NDYWxsQ2hlY2siLCJfZGVmaW5lUHJvcGVydHkiLCJsYWJlbCIsImNvbnNvbGUiLCJsb2ciLCJfdGhpcyRfcHJvcCIsIl9wcm9wIiwicGxhY2Vob2xkZXIiLCJfc2V0dGluZ3MkbGFiZWwiLCJfc2V0dGluZ3MkcGxhY2Vob2xkZXIiLCJfdWlfcmVuZGVyIiwiTG9naW5BbmRQYXNzRm9ybSIsIlJlZ0Zyb20iLCJnZXRFbGVtZW50QnlJZCIsIlJlZ0Zvcm0iXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsYUFBYUEsQ0FBQ0MsS0FBSyxFQUFFQyxFQUFFLEVBQUU7RUFDaEMsTUFBTTtJQUFFQyxHQUFHO0lBQUVDLEVBQUU7QUFBRUMsSUFBQUE7QUFBVSxHQUFDLEdBQUdDLEtBQUssQ0FBQ0wsS0FBSyxDQUFDO0FBQzNDLEVBQUEsTUFBTU0sT0FBTyxHQUFHTCxFQUFFLEdBQ2RNLFFBQVEsQ0FBQ0MsZUFBZSxDQUFDUCxFQUFFLEVBQUVDLEdBQUcsQ0FBQyxHQUNqQ0ssUUFBUSxDQUFDUixhQUFhLENBQUNHLEdBQUcsQ0FBQztBQUUvQixFQUFBLElBQUlDLEVBQUUsRUFBRTtJQUNORyxPQUFPLENBQUNILEVBQUUsR0FBR0EsRUFBRTtBQUNqQjtBQUVBLEVBQUEsSUFBSUMsU0FBUyxFQUFFO0FBQ2IsSUFFTztNQUNMRSxPQUFPLENBQUNGLFNBQVMsR0FBR0EsU0FBUztBQUMvQjtBQUNGO0FBRUEsRUFBQSxPQUFPRSxPQUFPO0FBQ2hCO0FBRUEsU0FB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
