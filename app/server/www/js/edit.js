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

var Header = /*#__PURE__*/_createClass(function Header() {
  _classCallCheck(this, Header);
  _defineProperty(this, "_ui_render", function () {
    return el("div", {
      "class": "header"
    }, el("h1", null, "\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0437\u0430\u0434\u0430\u0447"), el("button", {
      type: "button",
      "class": "btn"
    }, "\u0412\u044B\u0445\u043E\u0434"));
  });
  this.el = this._ui_render();
});

function mountWithHeader(root, elem) {
  mount(root, el("div", {
    className: 'app-body'
  }, new Header({}), el("div", {
    className: 'container centered'
  }, elem)));
}

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

var Checkbox = /*#__PURE__*/_createClass(function Checkbox() {
  var _this = this;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Checkbox);
  _defineProperty(this, "_ui_render", function () {
    var _this$_prop = _this._prop,
      label = _this$_prop.label,
      key = _this$_prop.key;
    var inputId = "base-check-".concat(key);
    return el("div", {
      "class": 'form-check'
    }, el("label", {
      "for": inputId,
      className: 'form-check-label'
    }, label), el("input", {
      type: 'checkbox',
      id: inputId,
      className: 'form-check-input'
    }));
  });
  var _settings$label = settings.label,
    _label = _settings$label === void 0 ? '' : _settings$label,
    _settings$key = settings.key,
    _key = _settings$key === void 0 ? 'undefined' : _settings$key;
  this._prop = {
    label: _label,
    key: _key
  };
  this.el = this._ui_render();
});

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

var EditForm = /*#__PURE__*/_createClass(function EditForm() {
  _classCallCheck(this, EditForm);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      "class": "mb-3"
    }, new Input({
      label: "Название задачи",
      placeholder: "Моя задача",
      key: "task-name"
    })), el("div", {
      "class": "mb-3"
    }, new Input({
      label: "Дедлайн",
      placeholder: "01.01.2025",
      key: "deadline"
    })), el("div", {
      "class": "mb-4"
    }, new Checkbox({
      label: "Важная задача",
      key: "important-task"
    })), el("div", {
      "class": "row"
    }, el("div", {
      "class": "col"
    }, new Button({
      text: "Отмена",
      type: "secondary",
      className: "w-100"
    })), el("div", {
      "class": "col"
    }, new Button({
      text: "Сохранить",
      type: "primary",
      className: "w-100"
    }))));
  });
  this.el = this._ui_render();
});

var Edit = /*#__PURE__*/_createClass(function Edit() {
  _classCallCheck(this, Edit);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      "class": "mb-3"
    }, el("h1", {
      className: 'text-center'
    }, "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435")), new EditForm({}));
  });
  this.el = this._ui_render();
});
mountWithHeader(document.getElementById("root"), new Edit({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvaGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9tb3VudFdpdGhIZWFkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2F0b20vYnV0dG9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2NoZWNrYm94LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2lucHV0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvZWRpdEZvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2VkaXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMT7QnNC10L3QtdC00LbQtdGAINC30LDQtNCw0Yc8L2gxPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5cIj7QktGL0YXQvtC0PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4uL3dpZGdldC9oZWFkZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW91bnRXaXRoSGVhZGVyKHJvb3QsIGVsZW0pIHtcclxuICAgIG1vdW50KFxyXG4gICAgICAgIHJvb3QsXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FwcC1ib2R5Jz5cclxuICAgICAgICAgICAgPEhlYWRlciAvPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyIGNlbnRlcmVkJz5cclxuICAgICAgICAgICAgICAgIHtlbGVtfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gJycsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICB0ZXh0LFxyXG4gICAgICAgICAgICBpY29uLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBpY29uLCB0eXBlLCBjbGFzc05hbWUgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGljb25SZW5kZXJlZCA9IGljb24gPyA8aSBjbGFzc05hbWU9e2BiaSBiaS0ke2ljb259YH0+PC9pPiA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWB9PlxyXG4gICAgICAgICAgICAgICAge2ljb25SZW5kZXJlZH1cclxuICAgICAgICAgICAgICAgIHt0ZXh0fVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZWNrYm94IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJycsXHJcbiAgICAgICAgICAgIGtleSA9ICd1bmRlZmluZWQnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgbGFiZWwsXHJcbiAgICAgICAgICAgIGtleVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYWJlbCwga2V5IH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dElkID0gYGJhc2UtY2hlY2stJHtrZXl9YDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdmb3JtLWNoZWNrJz5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1jaGVjay1sYWJlbCc+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGlkPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tY2hlY2staW5wdXQnLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJycsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJycsXHJcbiAgICAgICAgICAgIGtleSA9ICd1bmRlZmluZWQnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgbGFiZWwsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICBrZXlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFiZWwsIHBsYWNlaG9sZGVyLCBrZXkgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYmFzZS1pbnB1dC0ke2tleX1gO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tbGFiZWwnPntsYWJlbH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J3RleHQnIGlkPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCcgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfS8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vYXRvbS9idXR0b24nO1xyXG5pbXBvcnQgQ2hlY2tib3ggZnJvbSAnLi4vYXRvbS9jaGVja2JveCc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9hdG9tL2lucHV0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRGb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCBsYWJlbD1cItCd0LDQt9Cy0LDQvdC40LUg0LfQsNC00LDRh9C4XCIgcGxhY2Vob2xkZXI9XCLQnNC+0Y8g0LfQsNC00LDRh9CwXCIga2V5PVwidGFzay1uYW1lXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1iLTNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8SW5wdXQgbGFiZWw9XCLQlNC10LTQu9Cw0LnQvVwiIHBsYWNlaG9sZGVyPVwiMDEuMDEuMjAyNVwiIGtleT1cImRlYWRsaW5lXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1iLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Q2hlY2tib3ggbGFiZWw9XCLQktCw0LbQvdCw0Y8g0LfQsNC00LDRh9CwXCIga2V5PVwiaW1wb3J0YW50LXRhc2tcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRleHQ9XCLQntGC0LzQtdC90LBcIiB0eXBlPVwic2Vjb25kYXJ5XCIgY2xhc3NOYW1lPVwidy0xMDBcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0ZXh0PVwi0KHQvtGF0YDQsNC90LjRgtGMXCIgdHlwZT1cInByaW1hcnlcIiBjbGFzc05hbWU9XCJ3LTEwMFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gXCIuLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lc1wiO1xyXG5pbXBvcnQgbW91bnRXaXRoSGVhZGVyIGZyb20gXCIuL3V0aWxzL21vdW50V2l0aEhlYWRlci5qc1wiO1xyXG5pbXBvcnQgRWRpdEZvcm0gZnJvbSBcIi4vd2lkZ2V0L2VkaXRGb3JtLmpzXCI7XHJcblxyXG5jbGFzcyBFZGl0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9J3RleHQtY2VudGVyJz7QoNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1PC9oMT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPEVkaXRGb3JtIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vdW50V2l0aEhlYWRlcihcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSxcclxuICAgIDxFZGl0IC8+XHJcbik7XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwicXVlcnkiLCJucyIsInRhZyIsImlkIiwiY2xhc3NOYW1lIiwicGFyc2UiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJjaHVua3MiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJ0cmltIiwiaHRtbCIsImFyZ3MiLCJ0eXBlIiwiUXVlcnkiLCJFcnJvciIsInBhcnNlQXJndW1lbnRzSW50ZXJuYWwiLCJnZXRFbCIsImVsIiwiZXh0ZW5kIiwiZXh0ZW5kSHRtbCIsImJpbmQiLCJkb1VubW91bnQiLCJjaGlsZCIsImNoaWxkRWwiLCJwYXJlbnRFbCIsImhvb2tzIiwiX19yZWRvbV9saWZlY3ljbGUiLCJob29rc0FyZUVtcHR5IiwidHJhdmVyc2UiLCJfX3JlZG9tX21vdW50ZWQiLCJ0cmlnZ2VyIiwicGFyZW50SG9va3MiLCJob29rIiwicGFyZW50Tm9kZSIsImtleSIsImhvb2tOYW1lcyIsInNoYWRvd1Jvb3RBdmFpbGFibGUiLCJ3aW5kb3ciLCJtb3VudCIsInBhcmVudCIsIl9jaGlsZCIsImJlZm9yZSIsInJlcGxhY2UiLCJfX3JlZG9tX3ZpZXciLCJ3YXNNb3VudGVkIiwib2xkUGFyZW50IiwiYXBwZW5kQ2hpbGQiLCJkb01vdW50IiwiZXZlbnROYW1lIiwidmlldyIsImhvb2tDb3VudCIsImZpcnN0Q2hpbGQiLCJuZXh0IiwibmV4dFNpYmxpbmciLCJyZW1vdW50IiwiaG9va3NGb3VuZCIsImhvb2tOYW1lIiwidHJpZ2dlcmVkIiwibm9kZVR5cGUiLCJOb2RlIiwiRE9DVU1FTlRfTk9ERSIsIlNoYWRvd1Jvb3QiLCJzZXRTdHlsZSIsImFyZzEiLCJhcmcyIiwic2V0U3R5bGVWYWx1ZSIsInZhbHVlIiwic3R5bGUiLCJ4bGlua25zIiwic2V0QXR0ckludGVybmFsIiwiaW5pdGlhbCIsImlzT2JqIiwiaXNTVkciLCJTVkdFbGVtZW50IiwiaXNGdW5jIiwic2V0RGF0YSIsInNldFhsaW5rIiwic2V0Q2xhc3NOYW1lIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiYWRkaXRpb25Ub0NsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsImJhc2VWYWwiLCJzZXRBdHRyaWJ1dGVOUyIsInJlbW92ZUF0dHJpYnV0ZU5TIiwiZGF0YXNldCIsInRleHQiLCJzdHIiLCJjcmVhdGVUZXh0Tm9kZSIsImFyZyIsImlzTm9kZSIsIkhlYWRlciIsIl9jcmVhdGVDbGFzcyIsIl9jbGFzc0NhbGxDaGVjayIsIl9kZWZpbmVQcm9wZXJ0eSIsIl91aV9yZW5kZXIiLCJtb3VudFdpdGhIZWFkZXIiLCJyb290IiwiZWxlbSIsIkJ1dHRvbiIsIl90aGlzIiwic2V0dGluZ3MiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJfdGhpcyRfcHJvcCIsIl9wcm9wIiwiaWNvbiIsImljb25SZW5kZXJlZCIsImNvbmNhdCIsIl9zZXR0aW5ncyR0ZXh0IiwiX3NldHRpbmdzJGljb24iLCJfc2V0dGluZ3MkdHlwZSIsIl9zZXR0aW5ncyRjbGFzc05hbWUiLCJDaGVja2JveCIsImxhYmVsIiwiaW5wdXRJZCIsIl9zZXR0aW5ncyRsYWJlbCIsIl9zZXR0aW5ncyRrZXkiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwiX3NldHRpbmdzJHBsYWNlaG9sZGVyIiwiRWRpdEZvcm0iLCJFZGl0IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFNBQVNBLGFBQWFBLENBQUNDLEtBQUssRUFBRUMsRUFBRSxFQUFFO0VBQ2hDLE1BQU07SUFBRUMsR0FBRztJQUFFQyxFQUFFO0FBQUVDLElBQUFBO0FBQVUsR0FBQyxHQUFHQyxLQUFLLENBQUNMLEtBQUssQ0FBQztBQUMzQyxFQUFBLE1BQU1NLE9BQU8sR0FBR0wsRUFBRSxHQUNkTSxRQUFRLENBQUNDLGVBQWUsQ0FBQ1AsRUFBRSxFQUFFQyxHQUFHLENBQUMsR0FDakNLLFFBQVEsQ0FBQ1IsYUFBYSxDQUFDRyxHQUFHLENBQUM7QUFFL0IsRUFBQSxJQUFJQyxFQUFFLEVBQUU7SUFDTkcsT0FBTyxDQUFDSCxFQUFFLEdBQUdBLEVBQUU7QUFDakI7QUFFQSxFQUFBLElBQUlDLFNBQVMsRUFBRTtBQUNiLElBRU87TUFDTEUsT0FBTyxDQUFDRixTQUFTLEdBQUdBLFNBQVM7QUFDL0I7QUFDRjtBQUVBLEVBQUEsT0FBT0UsT0FBTztBQUNoQjtBQUVBLFNBQVNELEtBQUtB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QUNOakIsRUFBQSxDQUFBLEtBQUEsRUFBQTtNQUFLLE9BQU0sRUFBQTtBQUFNLEtBQUEsRUFBQSxJQUFBaUcsUUFBQSxDQUFBO0FBQ0hDLE1BQUFBLEtBQUssRUFBQyxlQUFlO0FBQUNqRixNQUFBQSxHQUFHLEVBQUM7S0FDbkMsQ0FBQSxDQUFDLEVBQ05qQixFQUFBLENBQUEsS0FBQSxFQUFBO01BQUssT0FBTSxFQUFBO0FBQUssS0FBQSxFQUNaQSxFQUFBLENBQUEsS0FBQSxFQUFBO01BQUssT0FBTSxFQUFBO0FBQUssS0FBQSxFQUFBLElBQUFtRixNQUFBLENBQUE7QUFDSmIsTUFBQUEsSUFBSSxFQUFDLFFBQVE7QUFBQzNFLE1BQUFBLElBQUksRUFBQyxXQUFXO0FBQUNaLE1BQUFBLFNBQVMsRUFBQztLQUNoRCxDQUFBLENBQUMsRUFDTmlCLEVBQUEsQ0FBQSxLQUFBLEVBQUE7TUFBSyxPQUFNLEVBQUE7QUFBSyxLQUFBLEVBQUEsSUFBQW1GLE1BQUEsQ0FBQTtBQUNKYixNQUFBQSxJQUFJLEVBQUMsV0FBVztBQUFDM0UsTUFBQUEsSUFBSSxFQUFDLFNBQVM7QUFBQ1osTUFBQUEsU0FBUyxFQUFDO0tBQ2pELENBQUEsQ0FDSixDQUNKLENBQUM7R0FFYixDQUFBO0FBekJHLEVBQUEsSUFBSSxDQUFDaUIsRUFBRSxHQUFHLElBQUksQ0FBQytFLFVBQVUsRUFBRTtBQUMvQixDQUFDLENBQUE7O0FDTnVDLElBRXRDMkIsSUFBSSxnQkFBQTlCLFlBQUEsQ0FDTixTQUFBOEIsT0FBYztBQUFBN0IsRUFBQUEsZUFBQSxPQUFBNkIsSUFBQSxDQUFBO0FBQUE1QixFQUFBQSxlQUFBLHFCQUlELFlBQU07SUFDZixPQUNJOUUsRUFBQSxjQUNJQSxFQUFBLENBQUEsS0FBQSxFQUFBO01BQUssT0FBTSxFQUFBO0FBQU0sS0FBQSxFQUNiQSxFQUFBLENBQUEsSUFBQSxFQUFBO0FBQUlqQixNQUFBQSxTQUFTLEVBQUM7QUFBYSxLQUFBLEVBQUEsc0ZBQW1CLENBQzdDLENBQUMsRUFBQTBILElBQUFBLFFBQUEsSUFFTCxDQUFDO0dBRWIsQ0FBQTtBQVpHLEVBQUEsSUFBSSxDQUFDekcsRUFBRSxHQUFHLElBQUksQ0FBQytFLFVBQVUsRUFBRTtBQUMvQixDQUFDLENBQUE7QUFjTEMsZUFBZSxDQUNYOUYsUUFBUSxDQUFDeUgsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFBLElBQUFELElBQUEsQ0FBQSxFQUFBLENBRW5DLENBQUM7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
