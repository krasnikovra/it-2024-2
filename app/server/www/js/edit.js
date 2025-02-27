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
    return this['_ui_button'] = el("button", {
      className: "btn btn-".concat(type, " ").concat(className)
    }, iconRendered, text);
  });
  _defineProperty(this, "update", function (data) {
    var _data$text = data.text,
      text = _data$text === void 0 ? _this._prop.text : _data$text,
      _data$icon = data.icon,
      icon = _data$icon === void 0 ? _this._prop.icon : _data$icon,
      _data$type = data.type,
      type = _data$type === void 0 ? _this._prop.type : _data$type,
      _data$className = data.className,
      className = _data$className === void 0 ? _this._prop.className : _data$className;
    var iconRendered = icon ? el("i", {
      className: "bi bi-".concat(icon)
    }) : null;
    _this._ui_button.innerHTML = "".concat(iconRendered !== null && iconRendered !== void 0 ? iconRendered : '').concat(text);
    _this._ui_button.className = "btn btn-".concat(type, " ").concat(className);
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
    return el("div", null, this['_ui_label'] = el("label", {
      "for": inputId,
      className: 'form-label'
    }, label), this['_ui_input'] = el("input", {
      type: 'text',
      id: inputId,
      className: 'form-control',
      placeholder: placeholder
    }));
  });
  _defineProperty(this, "update", function (data) {
    var _data$label = data.label,
      label = _data$label === void 0 ? _this._prop.label : _data$label,
      _data$placeholder = data.placeholder,
      placeholder = _data$placeholder === void 0 ? _this._prop.placeholder : _data$placeholder;
    _this._ui_label.textContent = label;
    _this._ui_input.placeholder = placeholder;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvaGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9tb3VudFdpdGhIZWFkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2F0b20vYnV0dG9uLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2NoZWNrYm94LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2lucHV0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvZWRpdEZvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2VkaXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMT7QnNC10L3QtdC00LbQtdGAINC30LDQtNCw0Yc8L2gxPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5cIj7QktGL0YXQvtC0PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4uL3dpZGdldC9oZWFkZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW91bnRXaXRoSGVhZGVyKHJvb3QsIGVsZW0pIHtcclxuICAgIG1vdW50KFxyXG4gICAgICAgIHJvb3QsXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FwcC1ib2R5Jz5cclxuICAgICAgICAgICAgPEhlYWRlciAvPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyIGNlbnRlcmVkJz5cclxuICAgICAgICAgICAgICAgIHtlbGVtfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gJycsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICB0ZXh0LFxyXG4gICAgICAgICAgICBpY29uLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBpY29uLCB0eXBlLCBjbGFzc05hbWUgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGljb25SZW5kZXJlZCA9IGljb24gPyA8aSBjbGFzc05hbWU9e2BiaSBiaS0ke2ljb259YH0+PC9pPiA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxidXR0b24gdGhpcz0nX3VpX2J1dHRvbicgY2xhc3NOYW1lPXtgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWB9PlxyXG4gICAgICAgICAgICAgICAge2ljb25SZW5kZXJlZH1cclxuICAgICAgICAgICAgICAgIHt0ZXh0fVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy5fcHJvcC50ZXh0LFxyXG4gICAgICAgICAgICBpY29uID0gdGhpcy5fcHJvcC5pY29uLFxyXG4gICAgICAgICAgICB0eXBlID0gdGhpcy5fcHJvcC50eXBlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSB0aGlzLl9wcm9wLmNsYXNzTmFtZVxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBjb25zdCBpY29uUmVuZGVyZWQgPSBpY29uID8gPGkgY2xhc3NOYW1lPXtgYmkgYmktJHtpY29ufWB9PjwvaT4gOiBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9idXR0b24uaW5uZXJIVE1MID0gYCR7aWNvblJlbmRlcmVkID8/ICcnfSR7dGV4dH1gO1xyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi5jbGFzc05hbWUgPSBgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWA7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlY2tib3gge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSAnJyxcclxuICAgICAgICAgICAga2V5ID0gJ3VuZGVmaW5lZCcsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgICAga2V5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhYmVsLCBrZXkgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYmFzZS1jaGVjay0ke2tleX1gO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9J2Zvcm0tY2hlY2snPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNoZWNrLWxhYmVsJz57bGFiZWx9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdjaGVja2JveCcgaWQ9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1jaGVjay1pbnB1dCcvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSAnJyxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSAnJyxcclxuICAgICAgICAgICAga2V5ID0gJ3VuZGVmaW5lZCcsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIsXHJcbiAgICAgICAgICAgIGtleVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYWJlbCwgcGxhY2Vob2xkZXIsIGtleSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgY29uc3QgaW5wdXRJZCA9IGBiYXNlLWlucHV0LSR7a2V5fWA7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCB0aGlzPSdfdWlfbGFiZWwnIGZvcj17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWxhYmVsJz57bGFiZWx9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0aGlzPSdfdWlfaW5wdXQnIHR5cGU9J3RleHQnIGlkPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCcgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfS8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSB0aGlzLl9wcm9wLmxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9IHRoaXMuX3Byb3AucGxhY2Vob2xkZXJcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfbGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICB0aGlzLl91aV9pbnB1dC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBDaGVja2JveCBmcm9tICcuLi9hdG9tL2NoZWNrYm94JztcclxuaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b20vaW5wdXQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdEZvcm0ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPElucHV0IGxhYmVsPVwi0J3QsNC30LLQsNC90LjQtSDQt9Cw0LTQsNGH0LhcIiBwbGFjZWhvbGRlcj1cItCc0L7RjyDQt9Cw0LTQsNGH0LBcIiBrZXk9XCJ0YXNrLW5hbWVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCBsYWJlbD1cItCU0LXQtNC70LDQudC9XCIgcGxhY2Vob2xkZXI9XCIwMS4wMS4yMDI1XCIga2V5PVwiZGVhZGxpbmVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDaGVja2JveCBsYWJlbD1cItCS0LDQttC90LDRjyDQt9Cw0LTQsNGH0LBcIiBrZXk9XCJpbXBvcnRhbnQtdGFza1wiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdGV4dD1cItCe0YLQvNC10L3QsFwiIHR5cGU9XCJzZWNvbmRhcnlcIiBjbGFzc05hbWU9XCJ3LTEwMFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRleHQ9XCLQodC+0YXRgNCw0L3QuNGC0YxcIiB0eXBlPVwicHJpbWFyeVwiIGNsYXNzTmFtZT1cInctMTAwXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzXCI7XHJcbmltcG9ydCBtb3VudFdpdGhIZWFkZXIgZnJvbSBcIi4vdXRpbHMvbW91bnRXaXRoSGVhZGVyLmpzXCI7XHJcbmltcG9ydCBFZGl0Rm9ybSBmcm9tIFwiLi93aWRnZXQvZWRpdEZvcm0uanNcIjtcclxuXHJcbmNsYXNzIEVkaXQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPtCg0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LU8L2gxPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8RWRpdEZvcm0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxubW91bnRXaXRoSGVhZGVyKFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpLFxyXG4gICAgPEVkaXQgLz5cclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiSGVhZGVyIiwiX2NyZWF0ZUNsYXNzIiwiX2NsYXNzQ2FsbENoZWNrIiwiX2RlZmluZVByb3BlcnR5IiwiX3VpX3JlbmRlciIsIm1vdW50V2l0aEhlYWRlciIsInJvb3QiLCJlbGVtIiwiQnV0dG9uIiwiX3RoaXMiLCJzZXR0aW5ncyIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIl90aGlzJF9wcm9wIiwiX3Byb3AiLCJpY29uIiwiaWNvblJlbmRlcmVkIiwiY29uY2F0IiwiZGF0YSIsIl9kYXRhJHRleHQiLCJfZGF0YSRpY29uIiwiX2RhdGEkdHlwZSIsIl9kYXRhJGNsYXNzTmFtZSIsIl91aV9idXR0b24iLCJpbm5lckhUTUwiLCJfc2V0dGluZ3MkdGV4dCIsIl9zZXR0aW5ncyRpY29uIiwiX3NldHRpbmdzJHR5cGUiLCJfc2V0dGluZ3MkY2xhc3NOYW1lIiwiQ2hlY2tib3giLCJsYWJlbCIsImlucHV0SWQiLCJfc2V0dGluZ3MkbGFiZWwiLCJfc2V0dGluZ3Mka2V5IiwiSW5wdXQiLCJwbGFjZWhvbGRlciIsIl9kYXRhJGxhYmVsIiwiX2RhdGEkcGxhY2Vob2xkZXIiLCJfdWlfbGFiZWwiLCJ0ZXh0Q29udGVudCIsIl91aV9pbnB1dCIsIl9zZXR0aW5ncyRwbGFjZWhvbGRlciIsIkVkaXRGb3JtIiwiRWRpdCIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFTQSxhQUFhQSxDQUFDQyxLQUFLLEVBQUVDLEVBQUUsRUFBRTtFQUNoQyxNQUFNO0lBQUVDLEdBQUc7SUFBRUMsRUFBRTtBQUFFQyxJQUFBQTtBQUFVLEdBQUMsR0FBR0MsS0FBSyxDQUFDTCxLQUFLLENBQUM7QUFDM0MsRUFBQSxNQUFNTSxPQUFPLEdBQUdMLEVBQUUsR0FDZE0sUUFBUSxDQUFDQyxlQUFlLENBQUNQLEVBQUUsRUFBRUMsR0FBRyxDQUFDLEdBQ2pDSyxRQUFRLENBQUNSLGFBQWEsQ0FBQ0csR0FBRyxDQUFDO0FBRS9CLEVBQUEsSUFBSUMsRUFBRSxFQUFFO0lBQ05HLE9BQU8sQ0FBQ0gsRUFBRSxHQUFHQSxFQUFFO0FBQ2pCO0FBRUEsRUFBQSxJQUFJQyxTQUFTLEVBQUU7QUFDYixJQUVPO01BQ0xFLE9BQU8sQ0FBQ0Ys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
