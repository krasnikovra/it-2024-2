'use strict';

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

var Input = /*#__PURE__*/_createClass(function Input() {
  var _this = this;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Input);
  _defineProperty(this, "_ui_render", function () {
    var _this$_prop = _this._prop,
      label = _this$_prop.label,
      placeholder = _this$_prop.placeholder,
      key = _this$_prop.key;
    var inputId = "base-input-".concat(key);
    return el("div", null, el("label", {
      "for": inputId,
      className: 'form-label'
    }, label), el("input", {
      type: 'text',
      id: inputId,
      className: 'form-control',
      placeholder: placeholder
    }));
  });
  var _settings$label = settings.label,
    _label = _settings$label === void 0 ? '' : _settings$label,
    _settings$placeholder = settings.placeholder,
    _placeholder = _settings$placeholder === void 0 ? '' : _settings$placeholder,
    _settings$key = settings.key,
    _key = _settings$key === void 0 ? 'undefined' : _settings$key;
  this._prop = {
    label: _label,
    placeholder: _placeholder,
    key: _key
  };
  this.el = this._ui_render();
});

var Link = /*#__PURE__*/_createClass(function Link() {
  var _this = this;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Link);
  _defineProperty(this, "_ui_render", function () {
    var _this$_prop = _this._prop,
      text = _this$_prop.text,
      href = _this$_prop.href;
    return el("a", {
      href: href
    }, text);
  });
  var _settings$text = settings.text,
    _text = _settings$text === void 0 ? '' : _settings$text,
    _settings$href = settings.href,
    _href = _settings$href === void 0 ? '' : _settings$href;
  this._prop = {
    text: _text,
    href: _href
  };
  this.el = this._ui_render();
});

var Button = /*#__PURE__*/_createClass(function Button() {
  var _this = this;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Button);
  _defineProperty(this, "_ui_render", function () {
    var _this$_prop = _this._prop,
      text = _this$_prop.text,
      icon = _this$_prop.icon,
      type = _this$_prop.type,
      className = _this$_prop.className;
    var iconRendered = icon ? el("i", {
      className: "bi bi-".concat(icon)
    }) : null;
    return el("button", {
      className: "btn btn-".concat(type, " ").concat(className)
    }, iconRendered, text);
  });
  var _settings$text = settings.text,
    _text = _settings$text === void 0 ? '' : _settings$text,
    _settings$icon = settings.icon,
    _icon = _settings$icon === void 0 ? null : _settings$icon,
    _settings$type = settings.type,
    _type = _settings$type === void 0 ? 'primary' : _settings$type,
    _settings$className = settings.className,
    _className = _settings$className === void 0 ? '' : _settings$className;
  this._prop = {
    text: _text,
    icon: _icon,
    type: _type,
    className: _className
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
      placeholder: 'somebody@gmail.com',
      key: "e-mail"
    })), new Input({
      label: 'Пароль',
      placeholder: '********',
      key: "pwd"
    }));
  });
  this.el = this._ui_render();
});

var RegFrom = /*#__PURE__*/_createClass(function RegFrom() {
  _classCallCheck(this, RegFrom);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      "class": 'mb-4'
    }, el("div", {
      className: 'mb-3'
    }, new LoginAndPassForm({})), new Input({
      label: 'Повторите пароль',
      placeholder: '********'
    }), el("p", null, el("small", null, "\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442? ", new Link({
      text: 'Войти',
      href: './login.html'
    })))), el("div", {
      className: 'text-center'
    }, new Button({
      text: 'Зарегистрироваться',
      className: 'w-100',
      type: 'primary'
    })));
  });
  this.el = this._ui_render();
});

var RegPage = /*#__PURE__*/_createClass(function RegPage() {
  _classCallCheck(this, RegPage);
  _defineProperty(this, "_ui_render", function () {
    return el("div", {
      className: 'container-md'
    }, el("div", {
      className: 'mb-3'
    }, el("h1", {
      className: 'text-center'
    }, "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F")), new RegFrom({}));
  });
  this.el = this._ui_render();
});
mount(document.getElementById("main"), new RegPage({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9pbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9saW5rLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2xvZ2luQW5kUGFzc0Zvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3dpZGdldC9yZWdGb3JtLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9yZWdpc3Rlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHF1ZXJ5LCBucykge1xuICBjb25zdCB7IHRhZywgaWQsIGNsYXNzTmFtZSB9ID0gcGFyc2UocXVlcnkpO1xuICBjb25zdCBlbGVtZW50ID0gbnNcbiAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgdGFnKVxuICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuXG4gIGlmIChpZCkge1xuICAgIGVsZW1lbnQuaWQgPSBpZDtcbiAgfVxuXG4gIGlmIChjbGFzc05hbWUpIHtcbiAgICBpZiAobnMpIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKHF1ZXJ5KSB7XG4gIGNvbnN0IGNodW5rcyA9IHF1ZXJ5LnNwbGl0KC8oWy4jXSkvKTtcbiAgbGV0IGNsYXNzTmFtZSA9IFwiXCI7XG4gIGxldCBpZCA9IFwiXCI7XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBjaHVua3MubGVuZ3RoOyBpICs9IDIpIHtcbiAgICBzd2l0Y2ggKGNodW5rc1tpXSkge1xuICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgY2xhc3NOYW1lICs9IGAgJHtjaHVua3NbaSArIDFdfWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwiI1wiOlxuICAgICAgICBpZCA9IGNodW5rc1tpICsgMV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjbGFzc05hbWU6IGNsYXNzTmFtZS50cmltKCksXG4gICAgdGFnOiBjaHVua3NbMF0gfHwgXCJkaXZcIixcbiAgICBpZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaHRtbChxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnkpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNvbnN0IFF1ZXJ5ID0gcXVlcnk7XG4gICAgZWxlbWVudCA9IG5ldyBRdWVyeSguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdCBsZWFzdCBvbmUgYXJndW1lbnQgcmVxdWlyZWRcIik7XG4gIH1cblxuICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGdldEVsKGVsZW1lbnQpLCBhcmdzLCB0cnVlKTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuY29uc3QgZWwgPSBodG1sO1xuY29uc3QgaCA9IGh0bWw7XG5cbmh0bWwuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kSHRtbCguLi5hcmdzKSB7XG4gIHJldHVybiBodG1sLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5mdW5jdGlvbiB1bm1vdW50KHBhcmVudCwgX2NoaWxkKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGRFbC5wYXJlbnROb2RlKSB7XG4gICAgZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCk7XG5cbiAgICBwYXJlbnRFbC5yZW1vdmVDaGlsZChjaGlsZEVsKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCkge1xuICBjb25zdCBob29rcyA9IGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKGhvb2tzQXJlRW1wdHkoaG9va3MpKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuXG4gIGlmIChjaGlsZEVsLl9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgXCJvbnVubW91bnRcIik7XG4gIH1cblxuICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICBjb25zdCBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlIHx8IHt9O1xuXG4gICAgZm9yIChjb25zdCBob29rIGluIGhvb2tzKSB7XG4gICAgICBpZiAocGFyZW50SG9va3NbaG9va10pIHtcbiAgICAgICAgcGFyZW50SG9va3NbaG9va10gLT0gaG9va3NbaG9va107XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhvb2tzQXJlRW1wdHkocGFyZW50SG9va3MpKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgdHJhdmVyc2UgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhvb2tzQXJlRW1wdHkoaG9va3MpIHtcbiAgaWYgKGhvb2tzID09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBpbiBob29rcykge1xuICAgIGlmIChob29rc1trZXldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiBnbG9iYWwgTm9kZSwgU2hhZG93Um9vdCAqL1xuXG5cbmNvbnN0IGhvb2tOYW1lcyA9IFtcIm9ubW91bnRcIiwgXCJvbnJlbW91bnRcIiwgXCJvbnVubW91bnRcIl07XG5jb25zdCBzaGFkb3dSb290QXZhaWxhYmxlID1cbiAgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBcIlNoYWRvd1Jvb3RcIiBpbiB3aW5kb3c7XG5cbmZ1bmN0aW9uIG1vdW50KHBhcmVudCwgX2NoaWxkLCBiZWZvcmUsIHJlcGxhY2UpIHtcbiAgbGV0IGNoaWxkID0gX2NoaWxkO1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgIGNoaWxkRWwuX19yZWRvbV92aWV3ID0gY2hpbGQ7XG4gIH1cblxuICBjb25zdCB3YXNNb3VudGVkID0gY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQ7XG4gIGNvbnN0IG9sZFBhcmVudCA9IGNoaWxkRWwucGFyZW50Tm9kZTtcblxuICBpZiAod2FzTW91bnRlZCAmJiBvbGRQYXJlbnQgIT09IHBhcmVudEVsKSB7XG4gICAgZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBvbGRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKGJlZm9yZSAhPSBudWxsKSB7XG4gICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgIGNvbnN0IGJlZm9yZUVsID0gZ2V0RWwoYmVmb3JlKTtcblxuICAgICAgaWYgKGJlZm9yZUVsLl9fcmVkb21fbW91bnRlZCkge1xuICAgICAgICB0cmlnZ2VyKGJlZm9yZUVsLCBcIm9udW5tb3VudFwiKTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50RWwucmVwbGFjZUNoaWxkKGNoaWxkRWwsIGJlZm9yZUVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50RWwuaW5zZXJ0QmVmb3JlKGNoaWxkRWwsIGdldEVsKGJlZm9yZSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChjaGlsZEVsKTtcbiAgfVxuXG4gIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpO1xuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlcihlbCwgZXZlbnROYW1lKSB7XG4gIGlmIChldmVudE5hbWUgPT09IFwib25tb3VudFwiIHx8IGV2ZW50TmFtZSA9PT0gXCJvbnJlbW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSBcIm9udW5tb3VudFwiKSB7XG4gICAgZWwuX19yZWRvbV9tb3VudGVkID0gZmFsc2U7XG4gIH1cblxuICBjb25zdCBob29rcyA9IGVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmICghaG9va3MpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB2aWV3ID0gZWwuX19yZWRvbV92aWV3O1xuICBsZXQgaG9va0NvdW50ID0gMDtcblxuICB2aWV3Py5bZXZlbnROYW1lXT8uKCk7XG5cbiAgZm9yIChjb25zdCBob29rIGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2spIHtcbiAgICAgIGhvb2tDb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChob29rQ291bnQpIHtcbiAgICBsZXQgdHJhdmVyc2UgPSBlbC5maXJzdENoaWxkO1xuXG4gICAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgICBjb25zdCBuZXh0ID0gdHJhdmVyc2UubmV4dFNpYmxpbmc7XG5cbiAgICAgIHRyaWdnZXIodHJhdmVyc2UsIGV2ZW50TmFtZSk7XG5cbiAgICAgIHRyYXZlcnNlID0gbmV4dDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZG9Nb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwsIG9sZFBhcmVudCkge1xuICBpZiAoIWNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gIH1cblxuICBjb25zdCBob29rcyA9IGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGU7XG4gIGNvbnN0IHJlbW91bnQgPSBwYXJlbnRFbCA9PT0gb2xkUGFyZW50O1xuICBsZXQgaG9va3NGb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAoY29uc3QgaG9va05hbWUgb2YgaG9va05hbWVzKSB7XG4gICAgaWYgKCFyZW1vdW50KSB7XG4gICAgICAvLyBpZiBhbHJlYWR5IG1vdW50ZWQsIHNraXAgdGhpcyBwaGFzZVxuICAgICAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgICAgIC8vIG9ubHkgVmlld3MgY2FuIGhhdmUgbGlmZWN5Y2xlIGV2ZW50c1xuICAgICAgICBpZiAoaG9va05hbWUgaW4gY2hpbGQpIHtcbiAgICAgICAgICBob29rc1tob29rTmFtZV0gPSAoaG9va3NbaG9va05hbWVdIHx8IDApICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaG9va3NbaG9va05hbWVdKSB7XG4gICAgICBob29rc0ZvdW5kID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWhvb2tzRm91bmQpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRyYXZlcnNlID0gcGFyZW50RWw7XG4gIGxldCB0cmlnZ2VyZWQgPSBmYWxzZTtcblxuICBpZiAocmVtb3VudCB8fCB0cmF2ZXJzZT8uX19yZWRvbV9tb3VudGVkKSB7XG4gICAgdHJpZ2dlcihjaGlsZEVsLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcblxuICAgIGlmICghdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUpIHtcbiAgICAgIHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgcGFyZW50SG9va3NbaG9va10gPSAocGFyZW50SG9va3NbaG9va10gfHwgMCkgKyBob29rc1tob29rXTtcbiAgICB9XG5cbiAgICBpZiAodHJpZ2dlcmVkKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKFxuICAgICAgdHJhdmVyc2Uubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSB8fFxuICAgICAgKHNoYWRvd1Jvb3RBdmFpbGFibGUgJiYgdHJhdmVyc2UgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB8fFxuICAgICAgcGFyZW50Py5fX3JlZG9tX21vdW50ZWRcbiAgICApIHtcbiAgICAgIHRyaWdnZXIodHJhdmVyc2UsIHJlbW91bnQgPyBcIm9ucmVtb3VudFwiIDogXCJvbm1vdW50XCIpO1xuICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgdHJhdmVyc2UgPSBwYXJlbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0U3R5bGUodmlldywgYXJnMSwgYXJnMikge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2V0U3R5bGVWYWx1ZShlbCwgYXJnMSwgYXJnMik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0U3R5bGVWYWx1ZShlbCwga2V5LCB2YWx1ZSkge1xuICBlbC5zdHlsZVtrZXldID0gdmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIFNWR0VsZW1lbnQgKi9cblxuXG5jb25zdCB4bGlua25zID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI7XG5cbmZ1bmN0aW9uIHNldEF0dHIodmlldywgYXJnMSwgYXJnMikge1xuICBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMik7XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyLCBpbml0aWFsKSB7XG4gIGNvbnN0IGVsID0gZ2V0RWwodmlldyk7XG5cbiAgY29uc3QgaXNPYmogPSB0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIjtcblxuICBpZiAoaXNPYmopIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRBdHRySW50ZXJuYWwoZWwsIGtleSwgYXJnMVtrZXldLCBpbml0aWFsKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaXNTVkcgPSBlbCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQ7XG4gICAgY29uc3QgaXNGdW5jID0gdHlwZW9mIGFyZzIgPT09IFwiZnVuY3Rpb25cIjtcblxuICAgIGlmIChhcmcxID09PSBcInN0eWxlXCIgJiYgdHlwZW9mIGFyZzIgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldFN0eWxlKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKGlzU1ZHICYmIGlzRnVuYykge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSBpZiAoYXJnMSA9PT0gXCJkYXRhc2V0XCIpIHtcbiAgICAgIHNldERhdGEoZWwsIGFyZzIpO1xuICAgIH0gZWxzZSBpZiAoIWlzU1ZHICYmIChhcmcxIGluIGVsIHx8IGlzRnVuYykgJiYgYXJnMSAhPT0gXCJsaXN0XCIpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU1ZHICYmIGFyZzEgPT09IFwieGxpbmtcIikge1xuICAgICAgICBzZXRYbGluayhlbCwgYXJnMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChpbml0aWFsICYmIGFyZzEgPT09IFwiY2xhc3NcIikge1xuICAgICAgICBzZXRDbGFzc05hbWUoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoYXJnMiA9PSBudWxsKSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhcmcxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhcmcxLCBhcmcyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0Q2xhc3NOYW1lKGVsLCBhZGRpdGlvblRvQ2xhc3NOYW1lKSB7XG4gIGlmIChhZGRpdGlvblRvQ2xhc3NOYW1lID09IG51bGwpIHtcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgfSBlbHNlIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKGFkZGl0aW9uVG9DbGFzc05hbWUpO1xuICB9IGVsc2UgaWYgKFxuICAgIHR5cGVvZiBlbC5jbGFzc05hbWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICBlbC5jbGFzc05hbWUgJiZcbiAgICBlbC5jbGFzc05hbWUuYmFzZVZhbFxuICApIHtcbiAgICBlbC5jbGFzc05hbWUuYmFzZVZhbCA9XG4gICAgICBgJHtlbC5jbGFzc05hbWUuYmFzZVZhbH0gJHthZGRpdGlvblRvQ2xhc3NOYW1lfWAudHJpbSgpO1xuICB9IGVsc2Uge1xuICAgIGVsLmNsYXNzTmFtZSA9IGAke2VsLmNsYXNzTmFtZX0gJHthZGRpdGlvblRvQ2xhc3NOYW1lfWAudHJpbSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFhsaW5rKGVsLCBhcmcxLCBhcmcyKSB7XG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFhsaW5rKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0RGF0YShlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXREYXRhKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLmRhdGFzZXRbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZWwuZGF0YXNldFthcmcxXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdGV4dChzdHIpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0ciAhPSBudWxsID8gc3RyIDogXCJcIik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJncywgaW5pdGlhbCkge1xuICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgaWYgKGFyZyAhPT0gMCAmJiAhYXJnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIGFyZztcblxuICAgIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGFyZyhlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIgfHwgdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0KGFyZykpO1xuICAgIH0gZWxzZSBpZiAoaXNOb2RlKGdldEVsKGFyZykpKSB7XG4gICAgICBtb3VudChlbGVtZW50LCBhcmcpO1xuICAgIH0gZWxzZSBpZiAoYXJnLmxlbmd0aCkge1xuICAgICAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChlbGVtZW50LCBhcmcsIGluaXRpYWwpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsZW1lbnQsIGFyZywgbnVsbCwgaW5pdGlhbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUVsKHBhcmVudCkge1xuICByZXR1cm4gdHlwZW9mIHBhcmVudCA9PT0gXCJzdHJpbmdcIiA/IGh0bWwocGFyZW50KSA6IGdldEVsKHBhcmVudCk7XG59XG5cbmZ1bmN0aW9uIGdldEVsKHBhcmVudCkge1xuICByZXR1cm4gKFxuICAgIChwYXJlbnQubm9kZVR5cGUgJiYgcGFyZW50KSB8fCAoIXBhcmVudC5lbCAmJiBwYXJlbnQpIHx8IGdldEVsKHBhcmVudC5lbClcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlKGFyZykge1xuICByZXR1cm4gYXJnPy5ub2RlVHlwZTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2goY2hpbGQsIGRhdGEsIGV2ZW50TmFtZSA9IFwicmVkb21cIikge1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiBkYXRhIH0pO1xuICBjaGlsZEVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBzZXRDaGlsZHJlbihwYXJlbnQsIC4uLmNoaWxkcmVuKSB7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgbGV0IGN1cnJlbnQgPSB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBwYXJlbnRFbC5maXJzdENoaWxkKTtcblxuICB3aGlsZSAoY3VycmVudCkge1xuICAgIGNvbnN0IG5leHQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuXG4gICAgdW5tb3VudChwYXJlbnQsIGN1cnJlbnQpO1xuXG4gICAgY3VycmVudCA9IG5leHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgX2N1cnJlbnQpIHtcbiAgbGV0IGN1cnJlbnQgPSBfY3VycmVudDtcblxuICBjb25zdCBjaGlsZEVscyA9IEFycmF5KGNoaWxkcmVuLmxlbmd0aCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGNoaWxkRWxzW2ldID0gY2hpbGRyZW5baV0gJiYgZ2V0RWwoY2hpbGRyZW5baV0pO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG5cbiAgICBpZiAoIWNoaWxkKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZEVsID0gY2hpbGRFbHNbaV07XG5cbiAgICBpZiAoY2hpbGRFbCA9PT0gY3VycmVudCkge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoaXNOb2RlKGNoaWxkRWwpKSB7XG4gICAgICBjb25zdCBuZXh0ID0gY3VycmVudD8ubmV4dFNpYmxpbmc7XG4gICAgICBjb25zdCBleGlzdHMgPSBjaGlsZC5fX3JlZG9tX2luZGV4ICE9IG51bGw7XG4gICAgICBjb25zdCByZXBsYWNlID0gZXhpc3RzICYmIG5leHQgPT09IGNoaWxkRWxzW2kgKyAxXTtcblxuICAgICAgbW91bnQocGFyZW50LCBjaGlsZCwgY3VycmVudCwgcmVwbGFjZSk7XG5cbiAgICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgfVxuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQubGVuZ3RoICE9IG51bGwpIHtcbiAgICAgIGN1cnJlbnQgPSB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkLCBjdXJyZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gbGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0UG9vbCB7XG4gIGNvbnN0cnVjdG9yKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgICB0aGlzLlZpZXcgPSBWaWV3O1xuICAgIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgICB0aGlzLm9sZExvb2t1cCA9IHt9O1xuICAgIHRoaXMubG9va3VwID0ge307XG4gICAgdGhpcy5vbGRWaWV3cyA9IFtdO1xuICAgIHRoaXMudmlld3MgPSBbXTtcblxuICAgIGlmIChrZXkgIT0gbnVsbCkge1xuICAgICAgdGhpcy5rZXkgPSB0eXBlb2Yga2V5ID09PSBcImZ1bmN0aW9uXCIgPyBrZXkgOiBwcm9wS2V5KGtleSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IFZpZXcsIGtleSwgaW5pdERhdGEgfSA9IHRoaXM7XG4gICAgY29uc3Qga2V5U2V0ID0ga2V5ICE9IG51bGw7XG5cbiAgICBjb25zdCBvbGRMb29rdXAgPSB0aGlzLmxvb2t1cDtcbiAgICBjb25zdCBuZXdMb29rdXAgPSB7fTtcblxuICAgIGNvbnN0IG5ld1ZpZXdzID0gQXJyYXkoZGF0YS5sZW5ndGgpO1xuICAgIGNvbnN0IG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbSA9IGRhdGFbaV07XG4gICAgICBsZXQgdmlldztcblxuICAgICAgaWYgKGtleVNldCkge1xuICAgICAgICBjb25zdCBpZCA9IGtleShpdGVtKTtcblxuICAgICAgICB2aWV3ID0gb2xkTG9va3VwW2lkXSB8fCBuZXcgVmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSk7XG4gICAgICAgIG5ld0xvb2t1cFtpZF0gPSB2aWV3O1xuICAgICAgICB2aWV3Ll9fcmVkb21faWQgPSBpZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZXcgPSBvbGRWaWV3c1tpXSB8fCBuZXcgVmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSk7XG4gICAgICB9XG4gICAgICB2aWV3LnVwZGF0ZT8uKGl0ZW0sIGksIGRhdGEsIGNvbnRleHQpO1xuXG4gICAgICBjb25zdCBlbCA9IGdldEVsKHZpZXcuZWwpO1xuXG4gICAgICBlbC5fX3JlZG9tX3ZpZXcgPSB2aWV3O1xuICAgICAgbmV3Vmlld3NbaV0gPSB2aWV3O1xuICAgIH1cblxuICAgIHRoaXMub2xkVmlld3MgPSBvbGRWaWV3cztcbiAgICB0aGlzLnZpZXdzID0gbmV3Vmlld3M7XG5cbiAgICB0aGlzLm9sZExvb2t1cCA9IG9sZExvb2t1cDtcbiAgICB0aGlzLmxvb2t1cCA9IG5ld0xvb2t1cDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9wS2V5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24gcHJvcHBlZEtleShpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW1ba2V5XTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIExpc3Qge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgICB0aGlzLlZpZXcgPSBWaWV3O1xuICAgIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgICB0aGlzLnZpZXdzID0gW107XG4gICAgdGhpcy5wb29sID0gbmV3IExpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpO1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMua2V5U2V0ID0ga2V5ICE9IG51bGw7XG4gIH1cblxuICB1cGRhdGUoZGF0YSwgY29udGV4dCkge1xuICAgIGNvbnN0IHsga2V5U2V0IH0gPSB0aGlzO1xuICAgIGNvbnN0IG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICAgIHRoaXMucG9vbC51cGRhdGUoZGF0YSB8fCBbXSwgY29udGV4dCk7XG5cbiAgICBjb25zdCB7IHZpZXdzLCBsb29rdXAgfSA9IHRoaXMucG9vbDtcblxuICAgIGlmIChrZXlTZXQpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2xkVmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb2xkVmlldyA9IG9sZFZpZXdzW2ldO1xuICAgICAgICBjb25zdCBpZCA9IG9sZFZpZXcuX19yZWRvbV9pZDtcblxuICAgICAgICBpZiAobG9va3VwW2lkXSA9PSBudWxsKSB7XG4gICAgICAgICAgb2xkVmlldy5fX3JlZG9tX2luZGV4ID0gbnVsbDtcbiAgICAgICAgICB1bm1vdW50KHRoaXMsIG9sZFZpZXcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdmlldyA9IHZpZXdzW2ldO1xuXG4gICAgICB2aWV3Ll9fcmVkb21faW5kZXggPSBpO1xuICAgIH1cblxuICAgIHNldENoaWxkcmVuKHRoaXMsIHZpZXdzKTtcblxuICAgIGlmIChrZXlTZXQpIHtcbiAgICAgIHRoaXMubG9va3VwID0gbG9va3VwO1xuICAgIH1cbiAgICB0aGlzLnZpZXdzID0gdmlld3M7XG4gIH1cbn1cblxuTGlzdC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRMaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gTGlzdC5iaW5kKExpc3QsIHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSk7XG59O1xuXG5saXN0LmV4dGVuZCA9IExpc3QuZXh0ZW5kO1xuXG4vKiBnbG9iYWwgTm9kZSAqL1xuXG5cbmZ1bmN0aW9uIHBsYWNlKFZpZXcsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUGxhY2UoVmlldywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBQbGFjZSB7XG4gIGNvbnN0cnVjdG9yKFZpZXcsIGluaXREYXRhKSB7XG4gICAgdGhpcy5lbCA9IHRleHQoXCJcIik7XG4gICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHRoaXMuZWw7XG5cbiAgICBpZiAoVmlldyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIHRoaXMuX2VsID0gVmlldztcbiAgICB9IGVsc2UgaWYgKFZpZXcuZWwgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgICB0aGlzLnZpZXcgPSBWaWV3O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9WaWV3ID0gVmlldztcbiAgICB9XG5cbiAgICB0aGlzLl9pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHZpc2libGUsIGRhdGEpIHtcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuX3BsYWNlaG9sZGVyO1xuICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLmVsLnBhcmVudE5vZGU7XG5cbiAgICBpZiAodmlzaWJsZSkge1xuICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VsKSB7XG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdGhpcy5fZWwsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh0aGlzLl9lbCk7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBWaWV3ID0gdGhpcy5fVmlldztcbiAgICAgICAgICBjb25zdCB2aWV3ID0gbmV3IFZpZXcodGhpcy5faW5pdERhdGEpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IGdldEVsKHZpZXcpO1xuICAgICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG5cbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCB2aWV3LCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMudmlldz8udXBkYXRlPy4oZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnZpc2libGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VsKSB7XG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMuX2VsKTtcbiAgICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLnZpZXcpO1xuICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHRoaXMudmlldyk7XG5cbiAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlZihjdHgsIGtleSwgdmFsdWUpIHtcbiAgY3R4W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKiBnbG9iYWwgTm9kZSAqL1xuXG5cbmZ1bmN0aW9uIHJvdXRlcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFJvdXRlcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIFJvdXRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgdmlld3MsIGluaXREYXRhKSB7XG4gICAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICAgIHRoaXMuVmlld3MgPSB2aWV3czsgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gIH1cblxuICB1cGRhdGUocm91dGUsIGRhdGEpIHtcbiAgICBpZiAocm91dGUgIT09IHRoaXMucm91dGUpIHtcbiAgICAgIGNvbnN0IHZpZXdzID0gdGhpcy52aWV3cztcbiAgICAgIGNvbnN0IFZpZXcgPSB2aWV3c1tyb3V0ZV07XG5cbiAgICAgIHRoaXMucm91dGUgPSByb3V0ZTtcblxuICAgICAgaWYgKFZpZXcgJiYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlIHx8IFZpZXcuZWwgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgICAgICB0aGlzLnZpZXcgPSBWaWV3O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldyAmJiBuZXcgVmlldyh0aGlzLmluaXREYXRhLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgc2V0Q2hpbGRyZW4odGhpcy5lbCwgW3RoaXMudmlld10pO1xuICAgIH1cbiAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEsIHJvdXRlKTtcbiAgfVxufVxuXG5jb25zdCBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcblxuZnVuY3Rpb24gc3ZnKHF1ZXJ5LCAuLi5hcmdzKSB7XG4gIGxldCBlbGVtZW50O1xuXG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgcXVlcnk7XG5cbiAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNvbnN0IFF1ZXJ5ID0gcXVlcnk7XG4gICAgZWxlbWVudCA9IG5ldyBRdWVyeSguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdCBsZWFzdCBvbmUgYXJndW1lbnQgcmVxdWlyZWRcIik7XG4gIH1cblxuICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGdldEVsKGVsZW1lbnQpLCBhcmdzLCB0cnVlKTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuY29uc3QgcyA9IHN2Zztcblxuc3ZnLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZFN2ZyguLi5hcmdzKSB7XG4gIHJldHVybiBzdmcuYmluZCh0aGlzLCAuLi5hcmdzKTtcbn07XG5cbnN2Zy5ucyA9IG5zO1xuXG5mdW5jdGlvbiB2aWV3RmFjdG9yeSh2aWV3cywga2V5KSB7XG4gIGlmICghdmlld3MgfHwgdHlwZW9mIHZpZXdzICE9PSBcIm9iamVjdFwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidmlld3MgbXVzdCBiZSBhbiBvYmplY3RcIik7XG4gIH1cbiAgaWYgKCFrZXkgfHwgdHlwZW9mIGtleSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImtleSBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiBmYWN0b3J5Vmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSkge1xuICAgIGNvbnN0IHZpZXdLZXkgPSBpdGVtW2tleV07XG4gICAgY29uc3QgVmlldyA9IHZpZXdzW3ZpZXdLZXldO1xuXG4gICAgaWYgKFZpZXcpIHtcbiAgICAgIHJldHVybiBuZXcgVmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGB2aWV3ICR7dmlld0tleX0gbm90IGZvdW5kYCk7XG4gIH07XG59XG5cbmV4cG9ydCB7IExpc3QsIExpc3RQb29sLCBQbGFjZSwgUm91dGVyLCBkaXNwYXRjaCwgZWwsIGgsIGh0bWwsIGxpc3QsIGxpc3RQb29sLCBtb3VudCwgcGxhY2UsIHJlZiwgcm91dGVyLCBzLCBzZXRBdHRyLCBzZXRDaGlsZHJlbiwgc2V0RGF0YSwgc2V0U3R5bGUsIHNldFhsaW5rLCBzdmcsIHRleHQsIHVubW91bnQsIHZpZXdGYWN0b3J5IH07XG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYWJlbCA9ICcnLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9ICcnLFxyXG4gICAgICAgICAgICBrZXkgPSAndW5kZWZpbmVkJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcixcclxuICAgICAgICAgICAga2V5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhYmVsLCBwbGFjZWhvbGRlciwga2V5IH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dElkID0gYGJhc2UtaW5wdXQtJHtrZXl9YDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWxhYmVsJz57bGFiZWx9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNvbnRyb2wnIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0vPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gJycsXHJcbiAgICAgICAgICAgIGhyZWYgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGhyZWZcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGhyZWYgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIGhyZWY9e2hyZWZ9Pnt0ZXh0fTwvYT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvbiB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gJycsXHJcbiAgICAgICAgICAgIGljb24gPSBudWxsLFxyXG4gICAgICAgICAgICB0eXBlID0gJ3ByaW1hcnknLCAvLyAncHJpbWFyeScsICdzZWNvbmRhcnknXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgdGV4dCxcclxuICAgICAgICAgICAgaWNvbixcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgaWNvbiwgdHlwZSwgY2xhc3NOYW1lIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICBjb25zdCBpY29uUmVuZGVyZWQgPSBpY29uID8gPGkgY2xhc3NOYW1lPXtgYmkgYmktJHtpY29ufWB9PjwvaT4gOiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17YGJ0biBidG4tJHt0eXBlfSAke2NsYXNzTmFtZX1gfT5cclxuICAgICAgICAgICAgICAgIHtpY29uUmVuZGVyZWR9XHJcbiAgICAgICAgICAgICAgICB7dGV4dH1cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9hdG9tL2lucHV0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2luQW5kUGFzc0Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi0zJz5cclxuICAgICAgICAgICAgICAgICAgICA8SW5wdXQgbGFiZWw9J0UtbWFpbCcgcGxhY2Vob2xkZXI9J3NvbWVib2R5QGdtYWlsLmNvbScga2V5PVwiZS1tYWlsXCIvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8SW5wdXQgbGFiZWw9J9Cf0LDRgNC+0LvRjCcgcGxhY2Vob2xkZXI9JyoqKioqKioqJyBrZXk9XCJwd2RcIi8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9hdG9tL2lucHV0JztcclxuaW1wb3J0IExpbmsgZnJvbSAnLi4vYXRvbS9saW5rJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBMb2dpbkFuZFBhc3NGb3JtIGZyb20gJy4uL3dpZGdldC9sb2dpbkFuZFBhc3NGb3JtJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ0Zyb20ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J21iLTQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi0zJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPExvZ2luQW5kUGFzc0Zvcm0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8SW5wdXQgbGFiZWw9J9Cf0L7QstGC0L7RgNC40YLQtSDQv9Cw0YDQvtC70YwnIHBsYWNlaG9sZGVyPScqKioqKioqKicgLz5cclxuICAgICAgICAgICAgICAgICAgICA8cD48c21hbGw+0KPQttC1INC10YHRgtGMINCw0LrQutCw0YPQvdGCPyA8TGluayB0ZXh0PSfQktC+0LnRgtC4JyBocmVmPScuL2xvZ2luLmh0bWwnIC8+PC9zbWFsbD48L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0ZXh0PSfQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y8nIGNsYXNzTmFtZT0ndy0xMDAnIHR5cGU9J3ByaW1hcnknIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IFJlZ0Zvcm0gZnJvbSAnLi93aWRnZXQvcmVnRm9ybSdcclxuXHJcbmNsYXNzIFJlZ1BhZ2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lci1tZCc+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWItMyc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPtCg0LXQs9C40YHRgtGA0LDRhtC40Y88L2gxPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8UmVnRm9ybS8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vdW50KFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpLFxyXG4gICAgPFJlZ1BhZ2UgLz5cclxuKTsiXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInF1ZXJ5IiwibnMiLCJ0YWciLCJpZCIsImNsYXNzTmFtZSIsInBhcnNlIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiY2h1bmtzIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwidHJpbSIsImh0bWwiLCJhcmdzIiwidHlwZSIsIlF1ZXJ5IiwiRXJyb3IiLCJwYXJzZUFyZ3VtZW50c0ludGVybmFsIiwiZ2V0RWwiLCJlbCIsImV4dGVuZCIsImV4dGVuZEh0bWwiLCJiaW5kIiwiZG9Vbm1vdW50IiwiY2hpbGQiLCJjaGlsZEVsIiwicGFyZW50RWwiLCJob29rcyIsIl9fcmVkb21fbGlmZWN5Y2xlIiwiaG9va3NBcmVFbXB0eSIsInRyYXZlcnNlIiwiX19yZWRvbV9tb3VudGVkIiwidHJpZ2dlciIsInBhcmVudEhvb2tzIiwiaG9vayIsInBhcmVudE5vZGUiLCJrZXkiLCJob29rTmFtZXMiLCJzaGFkb3dSb290QXZhaWxhYmxlIiwid2luZG93IiwibW91bnQiLCJwYXJlbnQiLCJfY2hpbGQiLCJiZWZvcmUiLCJyZXBsYWNlIiwiX19yZWRvbV92aWV3Iiwid2FzTW91bnRlZCIsIm9sZFBhcmVudCIsImFwcGVuZENoaWxkIiwiZG9Nb3VudCIsImV2ZW50TmFtZSIsInZpZXciLCJob29rQ291bnQiLCJmaXJzdENoaWxkIiwibmV4dCIsIm5leHRTaWJsaW5nIiwicmVtb3VudCIsImhvb2tzRm91bmQiLCJob29rTmFtZSIsInRyaWdnZXJlZCIsIm5vZGVUeXBlIiwiTm9kZSIsIkRPQ1VNRU5UX05PREUiLCJTaGFkb3dSb290Iiwic2V0U3R5bGUiLCJhcmcxIiwiYXJnMiIsInNldFN0eWxlVmFsdWUiLCJ2YWx1ZSIsInN0eWxlIiwieGxpbmtucyIsInNldEF0dHJJbnRlcm5hbCIsImluaXRpYWwiLCJpc09iaiIsImlzU1ZHIiwiU1ZHRWxlbWVudCIsImlzRnVuYyIsInNldERhdGEiLCJzZXRYbGluayIsInNldENsYXNzTmFtZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImFkZGl0aW9uVG9DbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJiYXNlVmFsIiwic2V0QXR0cmlidXRlTlMiLCJyZW1vdmVBdHRyaWJ1dGVOUyIsImRhdGFzZXQiLCJ0ZXh0Iiwic3RyIiwiY3JlYXRlVGV4dE5vZGUiLCJhcmciLCJpc05vZGUiLCJJbnB1dCIsIl9jcmVhdGVDbGFzcyIsIl90aGlzIiwic2V0dGluZ3MiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJfY2xhc3NDYWxsQ2hlY2siLCJfZGVmaW5lUHJvcGVydHkiLCJfdGhpcyRfcHJvcCIsIl9wcm9wIiwibGFiZWwiLCJwbGFjZWhvbGRlciIsImlucHV0SWQiLCJjb25jYXQiLCJfc2V0dGluZ3MkbGFiZWwiLCJfc2V0dGluZ3MkcGxhY2Vob2xkZXIiLCJfc2V0dGluZ3Mka2V5IiwiX3VpX3JlbmRlciIsIkxpbmsiLCJocmVmIiwiX3NldHRpbmdzJHRleHQiLCJfc2V0dGluZ3MkaHJlZiIsIkJ1dHRvbiIsImljb24iLCJpY29uUmVuZGVyZWQiLCJfc2V0dGluZ3MkaWNvbiIsIl9zZXR0aW5ncyR0eXBlIiwiX3NldHRpbmdzJGNsYXNzTmFtZSIsIkxvZ2luQW5kUGFzc0Zvcm0iLCJSZWdGcm9tIiwiUmVnUGFnZSIsIlJlZ0Zvcm0iLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBU0EsYUFBYUEsQ0FBQ0MsS0FBSyxFQUFFQyxFQUFFLEVBQUU7RUFDaEMsTUFBTTtJQUFFQyxHQUFHO0lBQUVDLEVBQUU7QUFBRUMsSUFBQUE7QUFBVSxHQUFDLEdBQUdDLEtBQUssQ0FBQ0wsS0FBSyxDQUFDO0FBQzNDLEVBQUEsTUFBTU0sT0FBTyxHQUFHTCxFQUFFLEdBQ2RNLFFBQVEsQ0FBQ0MsZUFBZSxDQUFDUCxFQUFFLEVBQUVDLEdBQUcsQ0FBQyxHQUNqQ0ssUUFBUSxDQUFDUixhQUFhLENBQUNHLEdBQUcsQ0FBQztBQUUvQixFQUFBLElBQUlDLEVBQUUsRUFBRTtJQUNORyxPQUFPLENBQUNILEVBQUUsR0FBR0EsRUFBRTtBQUNqQjtBQUVBLEVBQUEsSUFBSUMsU0FBUyxFQUFFO0FBQ2IsSUFFTztNQUNMRSxPQUFPLENBQUNGLFNBQVMsR0FBR0EsU0FBUztBQUMvQjtBQUNGO0FBRUEsRUFBQSxPQUFPRSxPQUFPO0FBQ2hCO0FB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
