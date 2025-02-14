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
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
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

var _excluded$2 = ["text"];
var FormHeader = /*#__PURE__*/_createClass(function FormHeader(props) {
  _classCallCheck(this, FormHeader);
  props.text;
    var otherProps = _objectWithoutProperties(props, _excluded$2);
  this.el = el("h1", _extends({
    "class": "text-center"
  }, otherProps), props.text);
});

var _excluded$1 = ["label", "key"];
var FormInput = /*#__PURE__*/_createClass(function FormInput(props) {
  _classCallCheck(this, FormInput);
  var label = props.label,
    key = props.key,
    otherProps = _objectWithoutProperties(props, _excluded$1);
  var inputId = "base-input-".concat(key);
  this.el = el("div", null, el("label", {
    "for": inputId,
    "class": "form-label"
  }, label), el("input", _extends({
    id: inputId,
    type: "text",
    "class": "form-control"
  }, otherProps)));
});

var FormSwitchLabel = /*#__PURE__*/_createClass(function FormSwitchLabel(props) {
  _classCallCheck(this, FormSwitchLabel);
  this.el = el("p", null, el("small", null, "".concat(props.text, " "), el("a", {
    href: props.link
  }, props.linkText)));
});

var _excluded = ["text", "type"];
var FormButton = /*#__PURE__*/_createClass(function FormButton(props) {
  _classCallCheck(this, FormButton);
  props.text;
    var type = props.type,
    otherProps = _objectWithoutProperties(props, _excluded);
  var bootstrapBtnType = "btn-light";
  switch (type) {
    case "primary":
      bootstrapBtnType = "btn-primary";
      break;
    case "secondary":
      bootstrapBtnType = "btn-secondary";
      break;
  }

  // This instantiation is needed because
  // redom + babel fails to render a jsx with
  // complex className i.e. <div class="class other-class"/>
  var btn = Object.assign(document.createElement("button"), _objectSpread2({
    type: "button",
    className: "btn ".concat(bootstrapBtnType, " w-100"),
    textContent: props.text
  }, otherProps));
  this.el = el("div", {
    "class": "text-center"
  }, btn);
});

var Register = el("div", {
  "class": "container-md"
}, el("div", {
  "class": "mb-3"
}, new FormHeader({
  text: "Регистрация"
})), el("div", {
  "class": "mb-3"
}, new FormInput({
  label: "E-mail",
  placeholder: "somebody@gmail.com",
  key: "email"
})), el("div", {
  "class": "mb-3"
}, new FormInput({
  label: "Пароль",
  placeholder: "********",
  key: "pwd"
})), el("div", {
  "class": "mb-4"
}, new FormInput({
  label: "Повторите пароль",
  placeholder: "********",
  key: "pwd-repeat"
}), new FormSwitchLabel({
  text: "Уже есть аккаунт?",
  linkText: "Войти",
  link: "./login.html"
})), new FormButton({
  text: "Зарегистрироваться",
  type: "primary"
}));
mount(document.getElementById("main"), Register);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9mb3Jtcy9Gb3JtSGVhZGVyLmpzeCIsIi4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9mb3Jtcy9Gb3JtSW5wdXQuanN4IiwiLi4vLi4vLi4vY2xpZW50L3NyYy9jb21wb25lbnRzL2Zvcm1zL0Zvcm1Td2l0Y2hMYWJlbC5qc3giLCIuLi8uLi8uLi9jbGllbnQvc3JjL2NvbXBvbmVudHMvZm9ybXMvRm9ybUJ1dHRvbi5qc3giLCIuLi8uLi8uLi9jbGllbnQvc3JjL3JlZ2lzdGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKSB7XG4gIGNvbnN0IHsgdGFnLCBpZCwgY2xhc3NOYW1lIH0gPSBwYXJzZShxdWVyeSk7XG4gIGNvbnN0IGVsZW1lbnQgPSBuc1xuICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpXG4gICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cbiAgaWYgKGlkKSB7XG4gICAgZWxlbWVudC5pZCA9IGlkO1xuICB9XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGlmIChucykge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gcGFyc2UocXVlcnkpIHtcbiAgY29uc3QgY2h1bmtzID0gcXVlcnkuc3BsaXQoLyhbLiNdKS8pO1xuICBsZXQgY2xhc3NOYW1lID0gXCJcIjtcbiAgbGV0IGlkID0gXCJcIjtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8IGNodW5rcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHN3aXRjaCAoY2h1bmtzW2ldKSB7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBjbGFzc05hbWUgKz0gYCAke2NodW5rc1tpICsgMV19YDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIGlkID0gY2h1bmtzW2kgKyAxXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLnRyaW0oKSxcbiAgICB0YWc6IGNodW5rc1swXSB8fCBcImRpdlwiLFxuICAgIGlkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBodG1sKHF1ZXJ5LCAuLi5hcmdzKSB7XG4gIGxldCBlbGVtZW50O1xuXG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgcXVlcnk7XG5cbiAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChxdWVyeSk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IFF1ZXJ5KC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5jb25zdCBlbCA9IGh0bWw7XG5jb25zdCBoID0gaHRtbDtcblxuaHRtbC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRIdG1sKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGh0bWwuYmluZCh0aGlzLCAuLi5hcmdzKTtcbn07XG5cbmZ1bmN0aW9uIHVubW91bnQocGFyZW50LCBfY2hpbGQpIHtcbiAgbGV0IGNoaWxkID0gX2NoaWxkO1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZEVsLnBhcmVudE5vZGUpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKTtcblxuICAgIHBhcmVudEVsLnJlbW92ZUNoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKSB7XG4gIGNvbnN0IGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoaG9va3NBcmVFbXB0eShob29rcykpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRyYXZlcnNlID0gcGFyZW50RWw7XG5cbiAgaWYgKGNoaWxkRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgdHJpZ2dlcihjaGlsZEVsLCBcIm9udW5tb3VudFwiKTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgfHwge307XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIGlmIChwYXJlbnRIb29rc1tob29rXSkge1xuICAgICAgICBwYXJlbnRIb29rc1tob29rXSAtPSBob29rc1tob29rXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaG9va3NBcmVFbXB0eShwYXJlbnRIb29rcykpIHtcbiAgICAgIHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cmF2ZXJzZSA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaG9va3NBcmVFbXB0eShob29rcykge1xuICBpZiAoaG9va3MgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2tzW2tleV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qIGdsb2JhbCBOb2RlLCBTaGFkb3dSb290ICovXG5cblxuY29uc3QgaG9va05hbWVzID0gW1wib25tb3VudFwiLCBcIm9ucmVtb3VudFwiLCBcIm9udW5tb3VudFwiXTtcbmNvbnN0IHNoYWRvd1Jvb3RBdmFpbGFibGUgPVxuICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIFwiU2hhZG93Um9vdFwiIGluIHdpbmRvdztcblxuZnVuY3Rpb24gbW91bnQocGFyZW50LCBfY2hpbGQsIGJlZm9yZSwgcmVwbGFjZSkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX3ZpZXcgPSBjaGlsZDtcbiAgfVxuXG4gIGNvbnN0IHdhc01vdW50ZWQgPSBjaGlsZEVsLl9fcmVkb21fbW91bnRlZDtcbiAgY29uc3Qgb2xkUGFyZW50ID0gY2hpbGRFbC5wYXJlbnROb2RlO1xuXG4gIGlmICh3YXNNb3VudGVkICYmIG9sZFBhcmVudCAhPT0gcGFyZW50RWwpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIG9sZFBhcmVudCk7XG4gIH1cblxuICBpZiAoYmVmb3JlICE9IG51bGwpIHtcbiAgICBpZiAocmVwbGFjZSkge1xuICAgICAgY29uc3QgYmVmb3JlRWwgPSBnZXRFbChiZWZvcmUpO1xuXG4gICAgICBpZiAoYmVmb3JlRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgICAgIHRyaWdnZXIoYmVmb3JlRWwsIFwib251bm1vdW50XCIpO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnRFbC5yZXBsYWNlQ2hpbGQoY2hpbGRFbCwgYmVmb3JlRWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRFbC5pbnNlcnRCZWZvcmUoY2hpbGRFbCwgZ2V0RWwoYmVmb3JlKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgZG9Nb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwsIG9sZFBhcmVudCk7XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyKGVsLCBldmVudE5hbWUpIHtcbiAgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbm1vdW50XCIgfHwgZXZlbnROYW1lID09PSBcIm9ucmVtb3VudFwiKSB7XG4gICAgZWwuX19yZWRvbV9tb3VudGVkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChldmVudE5hbWUgPT09IFwib251bm1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGhvb2tzID0gZWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKCFob29rcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHZpZXcgPSBlbC5fX3JlZG9tX3ZpZXc7XG4gIGxldCBob29rQ291bnQgPSAwO1xuXG4gIHZpZXc/LltldmVudE5hbWVdPy4oKTtcblxuICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9vaykge1xuICAgICAgaG9va0NvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGhvb2tDb3VudCkge1xuICAgIGxldCB0cmF2ZXJzZSA9IGVsLmZpcnN0Q2hpbGQ7XG5cbiAgICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICAgIGNvbnN0IG5leHQgPSB0cmF2ZXJzZS5uZXh0U2libGluZztcblxuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgZXZlbnROYW1lKTtcblxuICAgICAgdHJhdmVyc2UgPSBuZXh0O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KSB7XG4gIGlmICghY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgfVxuXG4gIGNvbnN0IGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcbiAgY29uc3QgcmVtb3VudCA9IHBhcmVudEVsID09PSBvbGRQYXJlbnQ7XG4gIGxldCBob29rc0ZvdW5kID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBob29rTmFtZSBvZiBob29rTmFtZXMpIHtcbiAgICBpZiAoIXJlbW91bnQpIHtcbiAgICAgIC8vIGlmIGFscmVhZHkgbW91bnRlZCwgc2tpcCB0aGlzIHBoYXNlXG4gICAgICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICAgICAgLy8gb25seSBWaWV3cyBjYW4gaGF2ZSBsaWZlY3ljbGUgZXZlbnRzXG4gICAgICAgIGlmIChob29rTmFtZSBpbiBjaGlsZCkge1xuICAgICAgICAgIGhvb2tzW2hvb2tOYW1lXSA9IChob29rc1tob29rTmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChob29rc1tob29rTmFtZV0pIHtcbiAgICAgIGhvb2tzRm91bmQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9va3NGb3VuZCkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcbiAgbGV0IHRyaWdnZXJlZCA9IGZhbHNlO1xuXG4gIGlmIChyZW1vdW50IHx8IHRyYXZlcnNlPy5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIHJlbW91bnQgPyBcIm9ucmVtb3VudFwiIDogXCJvbm1vdW50XCIpO1xuICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gIH1cblxuICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuXG4gICAgaWYgKCF0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gICAgZm9yIChjb25zdCBob29rIGluIGhvb2tzKSB7XG4gICAgICBwYXJlbnRIb29rc1tob29rXSA9IChwYXJlbnRIb29rc1tob29rXSB8fCAwKSArIGhvb2tzW2hvb2tdO1xuICAgIH1cblxuICAgIGlmICh0cmlnZ2VyZWQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0cmF2ZXJzZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8XG4gICAgICAoc2hhZG93Um9vdEF2YWlsYWJsZSAmJiB0cmF2ZXJzZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHx8XG4gICAgICBwYXJlbnQ/Ll9fcmVkb21fbW91bnRlZFxuICAgICkge1xuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICAgIH1cbiAgICB0cmF2ZXJzZSA9IHBhcmVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZSh2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIGNvbnN0IGVsID0gZ2V0RWwodmlldyk7XG5cbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0U3R5bGVWYWx1ZShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZXRTdHlsZVZhbHVlKGVsLCBhcmcxLCBhcmcyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIHZhbHVlKSB7XG4gIGVsLnN0eWxlW2tleV0gPSB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlO1xufVxuXG4vKiBnbG9iYWwgU1ZHRWxlbWVudCAqL1xuXG5cbmNvbnN0IHhsaW5rbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIjtcblxuZnVuY3Rpb24gc2V0QXR0cih2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyKTtcbn1cblxuZnVuY3Rpb24gc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIsIGluaXRpYWwpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBjb25zdCBpc09iaiA9IHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiO1xuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbCwga2V5LCBhcmcxW2tleV0sIGluaXRpYWwpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpc1NWRyA9IGVsIGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcbiAgICBjb25zdCBpc0Z1bmMgPSB0eXBlb2YgYXJnMiA9PT0gXCJmdW5jdGlvblwiO1xuXG4gICAgaWYgKGFyZzEgPT09IFwic3R5bGVcIiAmJiB0eXBlb2YgYXJnMiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgc2V0U3R5bGUoZWwsIGFyZzIpO1xuICAgIH0gZWxzZSBpZiAoaXNTVkcgJiYgaXNGdW5jKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIGlmIChhcmcxID09PSBcImRhdGFzZXRcIikge1xuICAgICAgc2V0RGF0YShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmICghaXNTVkcgJiYgKGFyZzEgaW4gZWwgfHwgaXNGdW5jKSAmJiBhcmcxICE9PSBcImxpc3RcIikge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTVkcgJiYgYXJnMSA9PT0gXCJ4bGlua1wiKSB7XG4gICAgICAgIHNldFhsaW5rKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGluaXRpYWwgJiYgYXJnMSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgIHNldENsYXNzTmFtZShlbCwgYXJnMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChhcmcyID09IG51bGwpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGFyZzEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGFyZzEsIGFyZzIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRDbGFzc05hbWUoZWwsIGFkZGl0aW9uVG9DbGFzc05hbWUpIHtcbiAgaWYgKGFkZGl0aW9uVG9DbGFzc05hbWUgPT0gbnVsbCkge1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICB9IGVsc2UgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoYWRkaXRpb25Ub0NsYXNzTmFtZSk7XG4gIH0gZWxzZSBpZiAoXG4gICAgdHlwZW9mIGVsLmNsYXNzTmFtZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgIGVsLmNsYXNzTmFtZSAmJlxuICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsXG4gICkge1xuICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsID1cbiAgICAgIGAke2VsLmNsYXNzTmFtZS5iYXNlVmFsfSAke2FkZGl0aW9uVG9DbGFzc05hbWV9YC50cmltKCk7XG4gIH0gZWxzZSB7XG4gICAgZWwuY2xhc3NOYW1lID0gYCR7ZWwuY2xhc3NOYW1lfSAke2FkZGl0aW9uVG9DbGFzc05hbWV9YC50cmltKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0WGxpbmsoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0WGxpbmsoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGFyZzIgIT0gbnVsbCkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXREYXRhKGVsLCBhcmcxLCBhcmcyKSB7XG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldERhdGEoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGFyZzIgIT0gbnVsbCkge1xuICAgICAgZWwuZGF0YXNldFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBlbC5kYXRhc2V0W2FyZzFdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0ZXh0KHN0cikge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RyICE9IG51bGwgPyBzdHIgOiBcIlwiKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VBcmd1bWVudHNJbnRlcm5hbChlbGVtZW50LCBhcmdzLCBpbml0aWFsKSB7XG4gIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICBpZiAoYXJnICE9PSAwICYmICFhcmcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgYXJnO1xuXG4gICAgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYXJnKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRleHQoYXJnKSk7XG4gICAgfSBlbHNlIGlmIChpc05vZGUoZ2V0RWwoYXJnKSkpIHtcbiAgICAgIG1vdW50KGVsZW1lbnQsIGFyZyk7XG4gICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoKSB7XG4gICAgICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZywgaW5pdGlhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRBdHRySW50ZXJuYWwoZWxlbWVudCwgYXJnLCBudWxsLCBpbml0aWFsKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5zdXJlRWwocGFyZW50KSB7XG4gIHJldHVybiB0eXBlb2YgcGFyZW50ID09PSBcInN0cmluZ1wiID8gaHRtbChwYXJlbnQpIDogZ2V0RWwocGFyZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWwocGFyZW50KSB7XG4gIHJldHVybiAoXG4gICAgKHBhcmVudC5ub2RlVHlwZSAmJiBwYXJlbnQpIHx8ICghcGFyZW50LmVsICYmIHBhcmVudCkgfHwgZ2V0RWwocGFyZW50LmVsKVxuICApO1xufVxuXG5mdW5jdGlvbiBpc05vZGUoYXJnKSB7XG4gIHJldHVybiBhcmc/Lm5vZGVUeXBlO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaChjaGlsZCwgZGF0YSwgZXZlbnROYW1lID0gXCJyZWRvbVwiKSB7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IGRhdGEgfSk7XG4gIGNoaWxkRWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbmZ1bmN0aW9uIHNldENoaWxkcmVuKHBhcmVudCwgLi4uY2hpbGRyZW4pIHtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBsZXQgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIHBhcmVudEVsLmZpcnN0Q2hpbGQpO1xuXG4gIHdoaWxlIChjdXJyZW50KSB7XG4gICAgY29uc3QgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG5cbiAgICB1bm1vdW50KHBhcmVudCwgY3VycmVudCk7XG5cbiAgICBjdXJyZW50ID0gbmV4dDtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBfY3VycmVudCkge1xuICBsZXQgY3VycmVudCA9IF9jdXJyZW50O1xuXG4gIGNvbnN0IGNoaWxkRWxzID0gQXJyYXkoY2hpbGRyZW4ubGVuZ3RoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hpbGRFbHNbaV0gPSBjaGlsZHJlbltpXSAmJiBnZXRFbChjaGlsZHJlbltpXSk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcblxuICAgIGlmICghY2hpbGQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkRWwgPSBjaGlsZEVsc1tpXTtcblxuICAgIGlmIChjaGlsZEVsID09PSBjdXJyZW50KSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChpc05vZGUoY2hpbGRFbCkpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBjdXJyZW50Py5uZXh0U2libGluZztcbiAgICAgIGNvbnN0IGV4aXN0cyA9IGNoaWxkLl9fcmVkb21faW5kZXggIT0gbnVsbDtcbiAgICAgIGNvbnN0IHJlcGxhY2UgPSBleGlzdHMgJiYgbmV4dCA9PT0gY2hpbGRFbHNbaSArIDFdO1xuXG4gICAgICBtb3VudChwYXJlbnQsIGNoaWxkLCBjdXJyZW50LCByZXBsYWNlKTtcblxuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5sZW5ndGggIT0gbnVsbCkge1xuICAgICAgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGQsIGN1cnJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBsaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIExpc3RQb29sIHtcbiAgY29uc3RydWN0b3IoVmlldywga2V5LCBpbml0RGF0YSkge1xuICAgIHRoaXMuVmlldyA9IFZpZXc7XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICAgIHRoaXMub2xkTG9va3VwID0ge307XG4gICAgdGhpcy5sb29rdXAgPSB7fTtcbiAgICB0aGlzLm9sZFZpZXdzID0gW107XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuXG4gICAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmtleSA9IHR5cGVvZiBrZXkgPT09IFwiZnVuY3Rpb25cIiA/IGtleSA6IHByb3BLZXkoa2V5KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoZGF0YSwgY29udGV4dCkge1xuICAgIGNvbnN0IHsgVmlldywga2V5LCBpbml0RGF0YSB9ID0gdGhpcztcbiAgICBjb25zdCBrZXlTZXQgPSBrZXkgIT0gbnVsbDtcblxuICAgIGNvbnN0IG9sZExvb2t1cCA9IHRoaXMubG9va3VwO1xuICAgIGNvbnN0IG5ld0xvb2t1cCA9IHt9O1xuXG4gICAgY29uc3QgbmV3Vmlld3MgPSBBcnJheShkYXRhLmxlbmd0aCk7XG4gICAgY29uc3Qgb2xkVmlld3MgPSB0aGlzLnZpZXdzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gZGF0YVtpXTtcbiAgICAgIGxldCB2aWV3O1xuXG4gICAgICBpZiAoa2V5U2V0KSB7XG4gICAgICAgIGNvbnN0IGlkID0ga2V5KGl0ZW0pO1xuXG4gICAgICAgIHZpZXcgPSBvbGRMb29rdXBbaWRdIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgICAgbmV3TG9va3VwW2lkXSA9IHZpZXc7XG4gICAgICAgIHZpZXcuX19yZWRvbV9pZCA9IGlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlldyA9IG9sZFZpZXdzW2ldIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgIH1cbiAgICAgIHZpZXcudXBkYXRlPy4oaXRlbSwgaSwgZGF0YSwgY29udGV4dCk7XG5cbiAgICAgIGNvbnN0IGVsID0gZ2V0RWwodmlldy5lbCk7XG5cbiAgICAgIGVsLl9fcmVkb21fdmlldyA9IHZpZXc7XG4gICAgICBuZXdWaWV3c1tpXSA9IHZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5vbGRWaWV3cyA9IG9sZFZpZXdzO1xuICAgIHRoaXMudmlld3MgPSBuZXdWaWV3cztcblxuICAgIHRoaXMub2xkTG9va3VwID0gb2xkTG9va3VwO1xuICAgIHRoaXMubG9va3VwID0gbmV3TG9va3VwO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb3BLZXkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiBwcm9wcGVkS2V5KGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbVtrZXldO1xuICB9O1xufVxuXG5mdW5jdGlvbiBsaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICAgIHRoaXMuVmlldyA9IFZpZXc7XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLnBvb2wgPSBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG4gICAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gICAgdGhpcy5rZXlTZXQgPSBrZXkgIT0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBrZXlTZXQgfSA9IHRoaXM7XG4gICAgY29uc3Qgb2xkVmlld3MgPSB0aGlzLnZpZXdzO1xuXG4gICAgdGhpcy5wb29sLnVwZGF0ZShkYXRhIHx8IFtdLCBjb250ZXh0KTtcblxuICAgIGNvbnN0IHsgdmlld3MsIGxvb2t1cCB9ID0gdGhpcy5wb29sO1xuXG4gICAgaWYgKGtleVNldCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvbGRWaWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvbGRWaWV3ID0gb2xkVmlld3NbaV07XG4gICAgICAgIGNvbnN0IGlkID0gb2xkVmlldy5fX3JlZG9tX2lkO1xuXG4gICAgICAgIGlmIChsb29rdXBbaWRdID09IG51bGwpIHtcbiAgICAgICAgICBvbGRWaWV3Ll9fcmVkb21faW5kZXggPSBudWxsO1xuICAgICAgICAgIHVubW91bnQodGhpcywgb2xkVmlldyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdmlld3NbaV07XG5cbiAgICAgIHZpZXcuX19yZWRvbV9pbmRleCA9IGk7XG4gICAgfVxuXG4gICAgc2V0Q2hpbGRyZW4odGhpcywgdmlld3MpO1xuXG4gICAgaWYgKGtleVNldCkge1xuICAgICAgdGhpcy5sb29rdXAgPSBsb29rdXA7XG4gICAgfVxuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgfVxufVxuXG5MaXN0LmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBMaXN0LmJpbmQoTGlzdCwgcGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn07XG5cbmxpc3QuZXh0ZW5kID0gTGlzdC5leHRlbmQ7XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cblxuZnVuY3Rpb24gcGxhY2UoVmlldywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBQbGFjZShWaWV3LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIFBsYWNlIHtcbiAgY29uc3RydWN0b3IoVmlldywgaW5pdERhdGEpIHtcbiAgICB0aGlzLmVsID0gdGV4dChcIlwiKTtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdGhpcy5lbDtcblxuICAgIGlmIChWaWV3IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgIH0gZWxzZSBpZiAoVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIHRoaXMuX2VsID0gVmlldztcbiAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX1ZpZXcgPSBWaWV3O1xuICAgIH1cblxuICAgIHRoaXMuX2luaXREYXRhID0gaW5pdERhdGE7XG4gIH1cblxuICB1cGRhdGUodmlzaWJsZSwgZGF0YSkge1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZWwucGFyZW50Tm9kZTtcblxuICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCwgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IGdldEVsKHRoaXMuX2VsKTtcbiAgICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IFZpZXcgPSB0aGlzLl9WaWV3O1xuICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVmlldyh0aGlzLl9pbml0RGF0YSk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodmlldyk7XG4gICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcblxuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHZpZXcsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy5fZWwpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy5fZWwpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMudmlldyk7XG4gICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy52aWV3KTtcblxuICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVmKGN0eCwga2V5LCB2YWx1ZSkge1xuICBjdHhba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cblxuZnVuY3Rpb24gcm91dGVyKHBhcmVudCwgdmlld3MsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUm91dGVyKHBhcmVudCwgdmlld3MsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUm91dGVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLnZpZXdzID0gdmlld3M7XG4gICAgdGhpcy5WaWV3cyA9IHZpZXdzOyAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZShyb3V0ZSwgZGF0YSkge1xuICAgIGlmIChyb3V0ZSAhPT0gdGhpcy5yb3V0ZSkge1xuICAgICAgY29uc3Qgdmlld3MgPSB0aGlzLnZpZXdzO1xuICAgICAgY29uc3QgVmlldyA9IHZpZXdzW3JvdXRlXTtcblxuICAgICAgdGhpcy5yb3V0ZSA9IHJvdXRlO1xuXG4gICAgICBpZiAoVmlldyAmJiAoVmlldyBpbnN0YW5jZW9mIE5vZGUgfHwgVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpKSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXcgPSBWaWV3ICYmIG5ldyBWaWV3KHRoaXMuaW5pdERhdGEsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBzZXRDaGlsZHJlbih0aGlzLmVsLCBbdGhpcy52aWV3XSk7XG4gICAgfVxuICAgIHRoaXMudmlldz8udXBkYXRlPy4oZGF0YSwgcm91dGUpO1xuICB9XG59XG5cbmNvbnN0IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG5mdW5jdGlvbiBzdmcocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5LCBucyk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IFF1ZXJ5KC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5jb25zdCBzID0gc3ZnO1xuXG5zdmcuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kU3ZnKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHN2Zy5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuc3ZnLm5zID0gbnM7XG5cbmZ1bmN0aW9uIHZpZXdGYWN0b3J5KHZpZXdzLCBrZXkpIHtcbiAgaWYgKCF2aWV3cyB8fCB0eXBlb2Ygdmlld3MgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ2aWV3cyBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICBpZiAoIWtleSB8fCB0eXBlb2Yga2V5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwia2V5IG11c3QgYmUgYSBzdHJpbmdcIik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIGZhY3RvcnlWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKSB7XG4gICAgY29uc3Qgdmlld0tleSA9IGl0ZW1ba2V5XTtcbiAgICBjb25zdCBWaWV3ID0gdmlld3Nbdmlld0tleV07XG5cbiAgICBpZiAoVmlldykge1xuICAgICAgcmV0dXJuIG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYHZpZXcgJHt2aWV3S2V5fSBub3QgZm91bmRgKTtcbiAgfTtcbn1cblxuZXhwb3J0IHsgTGlzdCwgTGlzdFBvb2wsIFBsYWNlLCBSb3V0ZXIsIGRpc3BhdGNoLCBlbCwgaCwgaHRtbCwgbGlzdCwgbGlzdFBvb2wsIG1vdW50LCBwbGFjZSwgcmVmLCByb3V0ZXIsIHMsIHNldEF0dHIsIHNldENoaWxkcmVuLCBzZXREYXRhLCBzZXRTdHlsZSwgc2V0WGxpbmssIHN2ZywgdGV4dCwgdW5tb3VudCwgdmlld0ZhY3RvcnkgfTtcbiIsImltcG9ydCB7IGVsIH0gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzXCI7XHJcblxyXG5jbGFzcyBGb3JtSGVhZGVyIHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgY29uc3Qge3RleHQsIC4uLm90aGVyUHJvcHN9ID0gcHJvcHM7XHJcblxyXG4gICAgdGhpcy5lbCA9XHJcbiAgICAgIDxoMSBjbGFzcz1cInRleHQtY2VudGVyXCIgey4uLm90aGVyUHJvcHN9Pntwcm9wcy50ZXh0fTwvaDE+XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGb3JtSGVhZGVyO1xyXG4iLCJpbXBvcnQgeyBlbCB9IGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lc1wiO1xyXG5cclxuY2xhc3MgRm9ybUlucHV0IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgY29uc3Qge2xhYmVsLCBrZXksIC4uLm90aGVyUHJvcHN9ID0gcHJvcHM7XHJcblxyXG4gICAgY29uc3QgaW5wdXRJZCA9IGBiYXNlLWlucHV0LSR7a2V5fWA7XHJcbiAgICB0aGlzLmVsID0gXHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGxhYmVsIGZvcj17aW5wdXRJZH0gY2xhc3M9XCJmb3JtLWxhYmVsXCI+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICAgICAgPGlucHV0IGlkPXtpbnB1dElkfSB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgey4uLm90aGVyUHJvcHN9Lz5cclxuICAgICAgPC9kaXY+XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGb3JtSW5wdXQ7XHJcbiIsImltcG9ydCB7IGVsIH0gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzXCI7XHJcblxyXG5jbGFzcyBGb3JtU3dpdGNoTGFiZWwge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICB0aGlzLmVsID0gXHJcbiAgICAgIDxwPjxzbWFsbD57YCR7cHJvcHMudGV4dH0gYH08YSBocmVmPXtwcm9wcy5saW5rfT57cHJvcHMubGlua1RleHR9PC9hPjwvc21hbGw+PC9wPlxyXG4gIH1cclxufVxyXG4gIFxyXG5leHBvcnQgZGVmYXVsdCBGb3JtU3dpdGNoTGFiZWw7XHJcbiIsImltcG9ydCB7IGVsIH0gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzXCI7XHJcblxyXG5jbGFzcyBGb3JtQnV0dG9uIHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgY29uc3Qge3RleHQsIHR5cGUsIC4uLm90aGVyUHJvcHN9ID0gcHJvcHM7XHJcblxyXG4gICAgbGV0IGJvb3RzdHJhcEJ0blR5cGUgPSBcImJ0bi1saWdodFwiO1xyXG4gICAgc3dpdGNoKHR5cGUpIHtcclxuICAgICAgY2FzZSBcInByaW1hcnlcIjpcclxuICAgICAgICBib290c3RyYXBCdG5UeXBlID0gXCJidG4tcHJpbWFyeVwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwic2Vjb25kYXJ5XCI6XHJcbiAgICAgICAgYm9vdHN0cmFwQnRuVHlwZSA9IFwiYnRuLXNlY29uZGFyeVwiO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoaXMgaW5zdGFudGlhdGlvbiBpcyBuZWVkZWQgYmVjYXVzZVxyXG4gICAgLy8gcmVkb20gKyBiYWJlbCBmYWlscyB0byByZW5kZXIgYSBqc3ggd2l0aFxyXG4gICAgLy8gY29tcGxleCBjbGFzc05hbWUgaS5lLiA8ZGl2IGNsYXNzPVwiY2xhc3Mgb3RoZXItY2xhc3NcIi8+XHJcbiAgICBjb25zdCBidG4gPSBPYmplY3QuYXNzaWduKFxyXG4gICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpLFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICBjbGFzc05hbWU6IGBidG4gJHtib290c3RyYXBCdG5UeXBlfSB3LTEwMGAsXHJcbiAgICAgICAgdGV4dENvbnRlbnQ6IHByb3BzLnRleHQsXHJcbiAgICAgICAgLi4ub3RoZXJQcm9wc1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuZWwgPVxyXG4gICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICB7YnRufVxyXG4gICAgICA8L2Rpdj5cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZvcm1CdXR0b247XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gXCIuLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lc1wiO1xyXG5pbXBvcnQgRm9ybUhlYWRlciBmcm9tIFwiLi9jb21wb25lbnRzL2Zvcm1zL0Zvcm1IZWFkZXIuanN4XCI7XHJcbmltcG9ydCBGb3JtSW5wdXQgZnJvbSBcIi4vY29tcG9uZW50cy9mb3Jtcy9Gb3JtSW5wdXQuanN4XCI7XHJcbmltcG9ydCBGb3JtU3dpdGNoTGFiZWwgZnJvbSBcIi4vY29tcG9uZW50cy9mb3Jtcy9Gb3JtU3dpdGNoTGFiZWwuanN4XCI7XHJcbmltcG9ydCBGb3JtQnV0dG9uIGZyb20gXCIuL2NvbXBvbmVudHMvZm9ybXMvRm9ybUJ1dHRvbi5qc3hcIjtcclxuXHJcbmNvbnN0IFJlZ2lzdGVyID1cclxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLW1kXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICA8Rm9ybUhlYWRlciB0ZXh0PVwi0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1wiLz5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cIm1iLTNcIj5cclxuICAgICAgPEZvcm1JbnB1dCBsYWJlbD1cIkUtbWFpbFwiIHBsYWNlaG9sZGVyPVwic29tZWJvZHlAZ21haWwuY29tXCIga2V5PVwiZW1haWxcIi8+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgIDxGb3JtSW5wdXQgbGFiZWw9XCLQn9Cw0YDQvtC70YxcIiBwbGFjZWhvbGRlcj1cIioqKioqKioqXCIga2V5PVwicHdkXCIvPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwibWItNFwiPlxyXG4gICAgICA8Rm9ybUlucHV0IGxhYmVsPVwi0J/QvtCy0YLQvtGA0LjRgtC1INC/0LDRgNC+0LvRjFwiIHBsYWNlaG9sZGVyPVwiKioqKioqKipcIiBrZXk9XCJwd2QtcmVwZWF0XCIvPlxyXG4gICAgICA8Rm9ybVN3aXRjaExhYmVsIHRleHQ9XCLQo9C20LUg0LXRgdGC0Ywg0LDQutC60LDRg9C90YI/XCIgbGlua1RleHQ9XCLQktC+0LnRgtC4XCIgbGluaz1cIi4vbG9naW4uaHRtbFwiLz5cclxuICAgIDwvZGl2PlxyXG4gICAgPEZvcm1CdXR0b24gdGV4dD1cItCX0LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRj1wiIHR5cGU9XCJwcmltYXJ5XCIvPlxyXG4gIDwvZGl2PjtcclxuXHJcbm1vdW50KFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpLFxyXG4gICAgUmVnaXN0ZXJcclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiRm9ybUhlYWRlciIsIl9jcmVhdGVDbGFzcyIsInByb3BzIiwiX2NsYXNzQ2FsbENoZWNrIiwib3RoZXJQcm9wcyIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsIl9leGNsdWRlZCIsIl9leHRlbmRzIiwiRm9ybUlucHV0IiwibGFiZWwiLCJpbnB1dElkIiwiY29uY2F0IiwiRm9ybVN3aXRjaExhYmVsIiwiaHJlZiIsImxpbmsiLCJsaW5rVGV4dCIsIkZvcm1CdXR0b24iLCJib290c3RyYXBCdG5UeXBlIiwiYnRuIiwiT2JqZWN0IiwiYXNzaWduIiwiX29iamVjdFNwcmVhZCIsInRleHRDb250ZW50IiwiUmVnaXN0ZXIiLCJwbGFjZWhvbGRlciIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLGFBQWFBLENBQUNDLEtBQUssRUFBRUMsRUFBRSxFQUFFO0VBQ2hDLE1BQU07SUFBRUMsR0FBRztJQUFFQyxFQUFFO0FBQUVDLElBQUFB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
