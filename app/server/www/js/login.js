'use strict';

function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, [], _getPrototypeOf(t).constructor) : o.apply(t, e));
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
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
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
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
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

var Button = /*#__PURE__*/_createClass(function Button() {
  var _this = this;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Button);
  _defineProperty(this, "_ui_render", function () {
    var _this$_prop = _this._prop,
      text = _this$_prop.text,
      icon = _this$_prop.icon,
      type = _this$_prop.type,
      disabled = _this$_prop.disabled,
      onClick = _this$_prop.onClick,
      className = _this$_prop.className;
    return this['_ui_button'] = el("button", {
      className: "btn btn-".concat(type, " ").concat(className),
      onclick: onClick,
      disabled: disabled
    }, _this._ui_icon(icon), this['_ui_span'] = el("span", null, text));
  });
  _defineProperty(this, "_ui_icon", function (icon) {
    return icon ? el("i", {
      className: "bi bi-".concat(icon, " me-2")
    }) : null;
  });
  _defineProperty(this, "_ui_spinner", function () {
    return el("span", {
      className: 'spinner-border spinner-border-sm me-2'
    });
  });
  _defineProperty(this, "startLoading", function (loadingLabel) {
    _this.update({
      disabled: true,
      text: loadingLabel,
      loading: true
    });
  });
  _defineProperty(this, "endLoading", function (label) {
    _this.update({
      disabled: false,
      text: label,
      loading: false
    });
  });
  _defineProperty(this, "update", function (data) {
    var _data$text = data.text,
      text = _data$text === void 0 ? _this._prop.text : _data$text,
      _data$icon = data.icon,
      icon = _data$icon === void 0 ? _this._prop.icon : _data$icon,
      _data$type = data.type,
      type = _data$type === void 0 ? _this._prop.type : _data$type,
      _data$disabled = data.disabled,
      disabled = _data$disabled === void 0 ? _this._prop.disabled : _data$disabled,
      _data$loading = data.loading,
      loading = _data$loading === void 0 ? _this._prop.loading : _data$loading,
      _data$onClick = data.onClick,
      onClick = _data$onClick === void 0 ? _this._prop.onClick : _data$onClick,
      _data$className = data.className,
      className = _data$className === void 0 ? _this._prop.className : _data$className;
    if (loading !== _this._prop.loading) {
      if (_this._ui_button.childNodes.length > 1) {
        var childToRemove = _this._ui_button.childNodes[0];
        _this._ui_button.removeChild(childToRemove);
      }
      var child = loading ? _this._ui_spinner() : _this._ui_icon(icon);
      child && _this._ui_button.insertBefore(child, _this._ui_span);
    }
    if (icon !== _this._prop.icon) {
      if (_this._ui_button.childNodes.length > 1) {
        var _childToRemove = _this._ui_button.childNodes[0];
        _this._ui_button.removeChild(_childToRemove);
      }
      var _child = _this._ui_icon(icon);
      _child && _this._ui_button.insertBefore(_this._ui_icon(icon), _this._ui_span);
    }
    if (text !== _this._prop.text) {
      var spanBody = el("div", null, text);
      _this._ui_span.innerHTML = spanBody.innerHTML;
    }
    if (className !== _this._prop.className) {
      _this._ui_button.className = "btn btn-".concat(type, " ").concat(className);
    }
    if (disabled !== _this._prop.disabled) {
      _this._ui_button.disabled = disabled;
    }
    if (onClick !== _this._prop.onClick) {
      _this._ui_button.onclick = onClick;
    }
    _this._prop = _objectSpread2(_objectSpread2({}, _this._prop), {}, {
      text: text,
      icon: icon,
      type: type,
      disabled: disabled,
      loading: loading,
      onClick: onClick,
      className: className
    });
  });
  var _settings$text = settings.text,
    _text = _settings$text === void 0 ? '' : _settings$text,
    _settings$icon = settings.icon,
    _icon = _settings$icon === void 0 ? null : _settings$icon,
    _settings$type = settings.type,
    _type = _settings$type === void 0 ? 'primary' : _settings$type,
    _settings$disabled = settings.disabled,
    _disabled = _settings$disabled === void 0 ? false : _settings$disabled,
    _settings$onClick = settings.onClick,
    _onClick = _settings$onClick === void 0 ? function (e) {
      console.log("clicked button", e.target);
    } : _settings$onClick,
    _settings$className = settings.className,
    _className = _settings$className === void 0 ? '' : _settings$className;
  this._prop = {
    text: _text,
    icon: _icon,
    type: _type,
    disabled: _disabled,
    loading: false,
    onClick: _onClick,
    className: _className
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
    return this['_ui_a'] = el("a", {
      href: href
    }, text);
  });
  _defineProperty(this, "update", function (data) {
    var _data$text = data.text,
      text = _data$text === void 0 ? _this._prop.text : _data$text,
      _data$href = data.href,
      href = _data$href === void 0 ? _this._prop.href : _data$href;
    if (text !== _this._prop.text) {
      _this._ui_a.textContent = text;
    }
    if (href !== _this._prop.href) {
      _this._ui_a.href = href;
    }
    _this._prop = _objectSpread2(_objectSpread2({}, _this._prop), {}, {
      text: text,
      href: href
    });
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
    if (label !== _this._prop.label) {
      _this._ui_label.textContent = label;
    }
    if (placeholder !== _this._prop.placeholder) {
      _this._ui_input.placeholder = placeholder;
    }
    _this._prop = _objectSpread2(_objectSpread2({}, _this.prop), {}, {
      label: label,
      placeholder: placeholder
    });
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

var RU = {
  'task_manager': 'Менеджер задач',
  'login': 'Вход',
  'loading_n_seconds_left': function loading_n_seconds_left(n) {
    var secondPostfix = '';
    var leftPostfix = 'ось';
    var nBetween10and20 = n > 10 && n < 20;
    if (n % 10 === 1 && !nBetween10and20) {
      secondPostfix = 'а';
      leftPostfix = 'ась';
    } else if ([2, 3, 4].includes(n % 10) && !nBetween10and20) {
      secondPostfix = 'ы';
    }
    return "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430... (\u041E\u0441\u0442\u0430\u043B".concat(leftPostfix, " ").concat(n, " \u0441\u0435\u043A\u0443\u043D\u0434").concat(secondPostfix, ")");
  },
  'email': 'E-mail',
  'somebody_email': 'somebody@gmail.com',
  'password': 'Пароль',
  'to_login': 'Войти',
  'to_register': 'Зарегистрироваться',
  'no_account_question': 'Нет аккаунта?',
  'to_log_out': 'Выйти',
  'registration': 'Регистрация',
  'repeat_password': 'Повторите пароль',
  'already_have_account_question': 'Уже есть аккаунт?',
  'editing': 'Редактирование',
  'task_name': 'Название задачи',
  'my_task': 'Моя задача',
  'deadline': 'Дедлайн',
  'important_task': 'Важная задача',
  'cancel': 'Отмена',
  'to_save': 'Сохранить',
  'ru': 'Русский',
  'en': 'Английский'
};

var EN = {
  'task_manager': 'Task manager',
  'login': 'Login',
  'loading_n_seconds_left': function loading_n_seconds_left(n) {
    return "Loading... (".concat(n, " second").concat(n % 10 === 1 ? '' : 's', " left)");
  },
  'email': 'E-mail',
  'somebody_email': 'somebody@gmail.com',
  'password': 'Password',
  'to_login': 'Log in',
  'to_register': 'Register',
  'no_account_question': 'No account?',
  'to_log_out': 'Log out',
  'registration': 'Registration',
  'repeat_password': 'Repeat password',
  'already_have_account_question': 'Have got an account?',
  'editing': 'Editing',
  'task_name': 'Task name',
  'my_task': 'My task',
  'deadline': 'Deadline',
  'important_task': 'Important task',
  'cancel': 'Cancel',
  'to_save': 'Save',
  'ru': 'Russian',
  'en': 'English'
};

function useTag(htmlEl, tag) {
  var result = document.createElement(tag);
  if (typeof htmlEl === 'string') {
    result.innerHTML = htmlEl;
  } else {
    result.appendChild(htmlEl);
  }
  return result;
}
function useTags(htmlEl, tags) {
  var result = htmlEl;
  tags.forEach(function (tag) {
    return result = useTag(result, tag);
  });
  return result;
}
var t9n = (function (landId, code, tag) {
  if (code == null || code.length === 0) return '';
  if (!['ru', 'en'].includes(landId)) {
    landId = 'ru';
  }
  var result = code;
  if (landId === 'ru' && RU[code]) {
    result = RU[code];
  }
  if (landId === 'en' && EN[code]) {
    result = EN[code];
  }
  if (typeof result === 'function') {
    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }
    result = result.apply(void 0, args);
  }
  if (tag) {
    if (tag instanceof Array) {
      result = useTags(result, tag);
    } else {
      result = useTag(result, tag);
    }
  }
  return result;
});

var localStorageItems = Object.freeze({
  langId: 'langId'
});

var _localStorage$getItem;
var defaultLang$1 = (_localStorage$getItem = localStorage.getItem(localStorageItems.langId)) !== null && _localStorage$getItem !== void 0 ? _localStorage$getItem : 'ru';

var LoginAndPassForm = /*#__PURE__*/_createClass(function LoginAndPassForm() {
  var _this = this;
  _classCallCheck(this, LoginAndPassForm);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      className: 'mb-3'
    }, this['_ui_input_email'] = new Input({
      label: t9n(defaultLang$1, 'email'),
      placeholder: t9n(defaultLang$1, 'somebody_email'),
      key: "e-mail"
    })), this['_ui_input_pwd'] = new Input({
      label: t9n(defaultLang$1, 'password'),
      placeholder: '********',
      key: "pwd"
    }));
  });
  _defineProperty(this, "update", function (data) {
    var lang = data.lang;
    _this._ui_input_email.update({
      label: t9n(lang, 'email'),
      placeholder: t9n(lang, 'somebody_email')
    });
    _this._ui_input_pwd.update({
      label: t9n(lang, 'password')
    });
  });
  this.el = this._ui_render();
});

var LoginForm = /*#__PURE__*/_createClass(function LoginForm() {
  var _this = this;
  _classCallCheck(this, LoginForm);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      className: 'mb-4'
    }, this['_ui_login_and_pass_form'] = new LoginAndPassForm({}), el("p", null, el("small", null, this['_ui_span'] = el("span", null, t9n(defaultLang$1, 'no_account_question')), "\xA0", this['_ui_link'] = new Link({
      text: t9n(defaultLang$1, 'to_register'),
      href: './register.html'
    })))), el("div", {
      className: 'text-center'
    }, this['_ui_button'] = new Button({
      text: t9n(defaultLang$1, 'to_login'),
      onClick: _this._get_on_btn_click(defaultLang$1),
      className: 'w-100',
      type: 'primary'
    })));
  });
  _defineProperty(this, "_get_on_btn_click", function (lang) {
    var _toggleBtnLabel = function toggleBtnLabel(secLeft) {
      setTimeout(function () {
        if (secLeft > 0) {
          _this._ui_button.update({
            text: t9n(lang, 'loading_n_seconds_left', 'em', secLeft)
          });
          _toggleBtnLabel(secLeft - 1);
        } else {
          _this._ui_button.endLoading(t9n(lang, 'to_login'));
        }
      }, 1000);
    };
    var sec = 3;
    return function () {
      _this._ui_button.startLoading(t9n(lang, 'loading_n_seconds_left', 'em', sec));
      _toggleBtnLabel(sec - 1);
    };
  });
  _defineProperty(this, "update", function (data) {
    var lang = data.lang;
    _this._ui_login_and_pass_form.update(data);
    _this._ui_link.update({
      text: t9n(lang, 'to_register')
    });
    _this._ui_span.textContent = t9n(lang, 'no_account_question');
    _this._ui_button.update({
      text: t9n(lang, 'to_login'),
      onClick: _this._get_on_btn_click(lang)
    });
  });
  this.el = this._ui_render();
});

var Select = /*#__PURE__*/_createClass(function Select() {
  var _this = this;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Select);
  _defineProperty(this, "_ui_render", function () {
    var _this$_prop = _this._prop,
      options = _this$_prop.options,
      value = _this$_prop.value,
      onChange = _this$_prop.onChange;
    _this._ui_options = [];
    return this['_ui_select'] = el("select", {
      className: 'form-select',
      onchange: function onchange(e) {
        return onChange(e.target.value);
      }
    }, options.map(function (option) {
      var uiOpt = el("option", {
        value: option.value,
        selected: value === option.value
      }, option.label);
      _this._ui_options.push(uiOpt);
      return uiOpt;
    }));
  });
  _defineProperty(this, "updateLabels", function (labels) {
    if (labels.length !== _this._prop.options.length) {
      console.error('Failed to update select\'s options labels!\
                 Labels array is incompatible with select\' options array.');
      return;
    }
    _this._ui_options.forEach(function (uiOption, index) {
      uiOption.innerHTML = labels[index];
    });
  });
  var _settings$options = settings.options,
    _options = _settings$options === void 0 ? [{
      label: 'Option 1',
      value: 'option1'
    }] : _settings$options,
    _settings$value = settings.value,
    _value = _settings$value === void 0 ? 'option1' : _settings$value,
    _settings$onChange = settings.onChange,
    _onChange = _settings$onChange === void 0 ? function (value) {
      console.log(value);
    } : _settings$onChange;
  this._prop = {
    options: _options,
    value: _value,
    onChange: _onChange
  };
  this.el = this._ui_render();
});

var EventManager = /*#__PURE__*/_createClass(function EventManager() {
  var _this = this;
  _classCallCheck(this, EventManager);
  _defineProperty(this, "_eventList", {});
  // {
  //     'event1': [
  //         f1,
  //         f2
  //     ],
  //     'event2': [
  //         f3
  //     ]
  // }
  _defineProperty(this, "subscribe", function (name, listener) {
    if (typeof _this._eventList[name] === 'undefined') {
      _this._eventList[name] = [];
    }
    _this._eventList[name].push(listener);
  });
  _defineProperty(this, "dispatch", function (name) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (_this._eventList.hasOwnProperty(name)) {
      _this._eventList[name].forEach(function (listener) {
        listener(args);
      });
    }
  });
});
var commonEventManager = new EventManager(); // singleton
 // class

var events = Object.freeze({
  changeLang: 'changeLang'
});

var SelectLang = /*#__PURE__*/_createClass(function SelectLang() {
  var _this = this;
  _classCallCheck(this, SelectLang);
  _defineProperty(this, "_langIds", ['ru', 'en']);
  _defineProperty(this, "_langT9nKeys", ['ru', 'en']);
  _defineProperty(this, "_langLabels", function (langId) {
    return _this._langT9nKeys.map(function (t9nKey) {
      return t9n(langId, t9nKey);
    });
  });
  _defineProperty(this, "_ui_render", function () {
    var labels = _this._langLabels(defaultLang$1);
    var options = _this._langIds.map(function (langId, index) {
      return {
        value: langId,
        label: labels[index]
      };
    });
    return this['_ui_select'] = new Select({
      options: options,
      value: defaultLang$1,
      onChange: function onChange(langId) {
        return commonEventManager.dispatch(events.changeLang, langId);
      }
    });
  });
  _defineProperty(this, "update", function (data) {
    var _data$lang = data.lang,
      lang = _data$lang === void 0 ? defaultLang$1 : _data$lang;
    var labels = _this._langLabels(lang);
    _this._ui_select.updateLabels(labels);
  });
  this.el = this._ui_render();
});

var Header = /*#__PURE__*/_createClass(function Header() {
  var _this = this;
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _classCallCheck(this, Header);
  _defineProperty(this, "_ui_render", function () {
    var authorized = _this._prop.authorized;
    return el("div", {
      "class": "header"
    }, this['_ui_h1'] = el("h1", {
      className: 'me-5'
    }, t9n(defaultLang$1, 'task_manager')), el("div", null, this['_ui_select'] = new SelectLang({})), authorized && (this['_ui_btn'] = new Button({
      type: "button",
      className: 'ms-auto',
      text: t9n(defaultLang$1, 'to_log_out')
    })));
  });
  _defineProperty(this, "update", function (data) {
    var _data$lang = data.lang,
      lang = _data$lang === void 0 ? defaultLang$1 : _data$lang;
    _this._ui_select.update(data);
    _this._ui_h1.textContent = t9n(lang, 'task_manager');
    _this._ui_btn && _this._ui_btn.update({
      text: t9n(lang, 'to_log_out')
    });
  });
  var _settings$authorized = settings.authorized,
    _authorized = _settings$authorized === void 0 ? false : _settings$authorized;
  this._prop = {
    authorized: _authorized
  };
  this.el = this._ui_render();
});

var _default = /*#__PURE__*/_createClass(function _default() {
  var _this = this;
  var eventManager = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : commonEventManager;
  _classCallCheck(this, _default);
  eventManager.subscribe(events.changeLang, function (lang) {
    _this.update({
      lang: lang
    });
    localStorage.setItem(localStorageItems.langId, lang);
  });
});

var WithHeader = /*#__PURE__*/function (_LocalizedPage) {
  function WithHeader() {
    var _this;
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var elem = arguments.length > 1 ? arguments[1] : undefined;
    _classCallCheck(this, WithHeader);
    _this = _callSuper(this, WithHeader);
    _defineProperty(_this, "_ui_render", function () {
      var authorized = _this._prop.authorized;
      return el("div", {
        className: 'app-body'
      }, this['_ui_header'] = new Header({
        authorized: authorized
      }), el("div", {
        className: 'container centered'
      }, _this._ui_elem));
    });
    _defineProperty(_this, "update", function (data) {
      var _data$lang = data.lang;
        _data$lang === void 0 ? defaultLang : _data$lang;
      _this._ui_header.update(data);
      _this._ui_elem.update(data);
    });
    var _settings$authorized = settings.authorized,
      _authorized = _settings$authorized === void 0 ? false : _settings$authorized;
    _this._prop = {
      authorized: _authorized
    };
    _this._ui_elem = elem;
    _this.el = _this._ui_render();
    return _this;
  }
  _inherits(WithHeader, _LocalizedPage);
  return _createClass(WithHeader);
}(_default);

var LoginPage = /*#__PURE__*/_createClass(function LoginPage() {
  var _this = this;
  _classCallCheck(this, LoginPage);
  _defineProperty(this, "_ui_render", function () {
    return el("div", {
      className: 'container-md'
    }, el("div", {
      className: 'mb-3'
    }, this["_ui_h1"] = el("h1", {
      className: 'text-center'
    }, t9n(defaultLang$1, 'login'))), this["_ui_login_form"] = new LoginForm({}));
  });
  _defineProperty(this, "update", function (data) {
    var _data$lang = data.lang,
      lang = _data$lang === void 0 ? defaultLang$1 : _data$lang;
    _this._ui_h1.textContent = t9n(lang, 'login');
    _this._ui_login_form.update(data);
  });
  this.el = this._ui_render();
});
mount(document.getElementById("root"), new WithHeader({}, new LoginPage({})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9idXR0b24uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2F0b20vbGluay5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9pbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5ydS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5lbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvbG9naW5BbmRQYXNzRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2xvZ2luRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvc2VsZWN0TGFuZy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2hlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxpemVkUGFnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvd2l0aEhlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvbG9naW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayA9IChlKSA9PiB7IGNvbnNvbGUubG9nKFwiY2xpY2tlZCBidXR0b25cIiwgZS50YXJnZXQpOyB9LFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGljb24sXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkLFxyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayxcclxuICAgICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgaWNvbiwgdHlwZSwgZGlzYWJsZWQsIG9uQ2xpY2ssIGNsYXNzTmFtZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGJ1dHRvbiB0aGlzPSdfdWlfYnV0dG9uJyBjbGFzc05hbWU9e2BidG4gYnRuLSR7dHlwZX0gJHtjbGFzc05hbWV9YH1cclxuICAgICAgICAgICAgICAgIG9uY2xpY2s9e29uQ2xpY2t9IGRpc2FibGVkPXtkaXNhYmxlZH0+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5fdWlfaWNvbihpY29uKX1cclxuICAgICAgICAgICAgICAgIDxzcGFuIHRoaXM9J191aV9zcGFuJz57dGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX2ljb24gPSAoaWNvbikgPT4ge1xyXG4gICAgICAgIHJldHVybiBpY29uID8gPGkgY2xhc3NOYW1lPXtgYmkgYmktJHtpY29ufSBtZS0yYH0+PC9pPiA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3NwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT0nc3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbWUtMicgLz5cclxuICAgIH1cclxuXHJcbiAgICBzdGFydExvYWRpbmcgPSAobG9hZGluZ0xhYmVsKSA9PiB7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IHRydWUsIHRleHQ6IGxvYWRpbmdMYWJlbCwgbG9hZGluZzogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmRMb2FkaW5nID0gKGxhYmVsKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoeyBkaXNhYmxlZDogZmFsc2UsIHRleHQ6IGxhYmVsLCBsb2FkaW5nOiBmYWxzZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMuX3Byb3AudGV4dCxcclxuICAgICAgICAgICAgaWNvbiA9IHRoaXMuX3Byb3AuaWNvbixcclxuICAgICAgICAgICAgdHlwZSA9IHRoaXMuX3Byb3AudHlwZSxcclxuICAgICAgICAgICAgZGlzYWJsZWQgPSB0aGlzLl9wcm9wLmRpc2FibGVkLFxyXG4gICAgICAgICAgICBsb2FkaW5nID0gdGhpcy5fcHJvcC5sb2FkaW5nLFxyXG4gICAgICAgICAgICBvbkNsaWNrID0gdGhpcy5fcHJvcC5vbkNsaWNrLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSB0aGlzLl9wcm9wLmNsYXNzTmFtZVxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAobG9hZGluZyAhPT0gdGhpcy5fcHJvcC5sb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZFRvUmVtb3ZlID0gdGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91aV9idXR0b24ucmVtb3ZlQ2hpbGQoY2hpbGRUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBsb2FkaW5nID8gdGhpcy5fdWlfc3Bpbm5lcigpIDogdGhpcy5fdWlfaWNvbihpY29uKTtcclxuICAgICAgICAgICAgY2hpbGQgJiYgdGhpcy5fdWlfYnV0dG9uLmluc2VydEJlZm9yZShjaGlsZCwgdGhpcy5fdWlfc3Bhbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpY29uICE9PSB0aGlzLl9wcm9wLmljb24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkVG9SZW1vdmUgPSB0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlc1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5yZW1vdmVDaGlsZChjaGlsZFRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuX3VpX2ljb24oaWNvbik7XHJcbiAgICAgICAgICAgIGNoaWxkICYmIHRoaXMuX3VpX2J1dHRvbi5pbnNlcnRCZWZvcmUodGhpcy5fdWlfaWNvbihpY29uKSwgdGhpcy5fdWlfc3Bhbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0ZXh0ICE9PSB0aGlzLl9wcm9wLnRleHQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3BhbkJvZHkgPSA8ZGl2Pnt0ZXh0fTwvZGl2PjtcclxuICAgICAgICAgICAgdGhpcy5fdWlfc3Bhbi5pbm5lckhUTUwgPSBzcGFuQm9keS5pbm5lckhUTUw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjbGFzc05hbWUgIT09IHRoaXMuX3Byb3AuY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5jbGFzc05hbWUgPSBgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXNhYmxlZCAhPT0gdGhpcy5fcHJvcC5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24uZGlzYWJsZWQgPSBkaXNhYmxlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9uQ2xpY2sgIT09IHRoaXMuX3Byb3Aub25DbGljaykge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24ub25jbGljayA9IG9uQ2xpY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyAuLi50aGlzLl9wcm9wLCB0ZXh0LCBpY29uLCB0eXBlLCBkaXNhYmxlZCwgbG9hZGluZywgb25DbGljaywgY2xhc3NOYW1lIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gJycsXHJcbiAgICAgICAgICAgIGhyZWYgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGhyZWZcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGhyZWYgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIHRoaXM9J191aV9hJyBocmVmPXtocmVmfT57dGV4dH08L2E+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMuX3Byb3AudGV4dCxcclxuICAgICAgICAgICAgaHJlZiA9IHRoaXMuX3Byb3AuaHJlZlxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAodGV4dCAhPT0gdGhpcy5fcHJvcC50ZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2EudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaHJlZiAhPT0gdGhpcy5fcHJvcC5ocmVmKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2EuaHJlZiA9IGhyZWY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyAuLi50aGlzLl9wcm9wLCB0ZXh0LCBocmVmIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSAnJyxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSAnJyxcclxuICAgICAgICAgICAga2V5ID0gJ3VuZGVmaW5lZCcsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIsXHJcbiAgICAgICAgICAgIGtleVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYWJlbCwgcGxhY2Vob2xkZXIsIGtleSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgY29uc3QgaW5wdXRJZCA9IGBiYXNlLWlucHV0LSR7a2V5fWA7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCB0aGlzPSdfdWlfbGFiZWwnIGZvcj17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWxhYmVsJz57bGFiZWx9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0aGlzPSdfdWlfaW5wdXQnIHR5cGU9J3RleHQnIGlkPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCcgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5fcHJvcC5sYWJlbCxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSB0aGlzLl9wcm9wLnBsYWNlaG9sZGVyXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmIChsYWJlbCAhPT0gdGhpcy5fcHJvcC5sYWJlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9sYWJlbC50ZXh0Q29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGxhY2Vob2xkZXIgIT09IHRoaXMuX3Byb3AucGxhY2Vob2xkZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfaW5wdXQucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgLi4udGhpcy5wcm9wLCBsYWJlbCwgcGxhY2Vob2xkZXIgfTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAndGFza19tYW5hZ2VyJzogJ9Cc0LXQvdC10LTQttC10YAg0LfQsNC00LDRhycsXHJcbiAgICAnbG9naW4nOiAn0JLRhdC+0LQnLFxyXG4gICAgJ2xvYWRpbmdfbl9zZWNvbmRzX2xlZnQnOiBuID0+IHtcclxuICAgICAgICBsZXQgc2Vjb25kUG9zdGZpeCA9ICcnO1xyXG4gICAgICAgIGxldCBsZWZ0UG9zdGZpeCA9ICfQvtGB0YwnO1xyXG4gICAgICAgIGNvbnN0IG5CZXR3ZWVuMTBhbmQyMCA9IG4gPiAxMCAmJiBuIDwgMjA7XHJcbiAgICAgICAgaWYgKG4gJSAxMCA9PT0gMSAmJiAhbkJldHdlZW4xMGFuZDIwKSB7XHJcbiAgICAgICAgICAgIHNlY29uZFBvc3RmaXggPSAn0LAnO1xyXG4gICAgICAgICAgICBsZWZ0UG9zdGZpeCA9ICfQsNGB0YwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChbMiwgMywgNF0uaW5jbHVkZXMobiAlIDEwKSAmJiAhbkJldHdlZW4xMGFuZDIwKSB7XHJcbiAgICAgICAgICAgIHNlY29uZFBvc3RmaXggPSAn0YsnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGDQl9Cw0LPRgNGD0LfQutCwLi4uICjQntGB0YLQsNC7JHtsZWZ0UG9zdGZpeH0gJHtufSDRgdC10LrRg9C90LQke3NlY29uZFBvc3RmaXh9KWA7XHJcbiAgICB9LFxyXG4gICAgJ2VtYWlsJzogJ0UtbWFpbCcsXHJcbiAgICAnc29tZWJvZHlfZW1haWwnOiAnc29tZWJvZHlAZ21haWwuY29tJyxcclxuICAgICdwYXNzd29yZCc6ICfQn9Cw0YDQvtC70YwnLFxyXG4gICAgJ3RvX2xvZ2luJzogJ9CS0L7QudGC0LgnLFxyXG4gICAgJ3RvX3JlZ2lzdGVyJzogJ9CX0LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRjycsXHJcbiAgICAnbm9fYWNjb3VudF9xdWVzdGlvbic6ICfQndC10YIg0LDQutC60LDRg9C90YLQsD8nLFxyXG4gICAgJ3RvX2xvZ19vdXQnOiAn0JLRi9C50YLQuCcsXHJcbiAgICAncmVnaXN0cmF0aW9uJzogJ9Cg0LXQs9C40YHRgtGA0LDRhtC40Y8nLFxyXG4gICAgJ3JlcGVhdF9wYXNzd29yZCc6ICfQn9C+0LLRgtC+0YDQuNGC0LUg0L/QsNGA0L7Qu9GMJyxcclxuICAgICdhbHJlYWR5X2hhdmVfYWNjb3VudF9xdWVzdGlvbic6ICfQo9C20LUg0LXRgdGC0Ywg0LDQutC60LDRg9C90YI/JyxcclxuICAgICdlZGl0aW5nJzogJ9Cg0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUnLFxyXG4gICAgJ3Rhc2tfbmFtZSc6ICfQndCw0LfQstCw0L3QuNC1INC30LDQtNCw0YfQuCcsXHJcbiAgICAnbXlfdGFzayc6ICfQnNC+0Y8g0LfQsNC00LDRh9CwJyxcclxuICAgICdkZWFkbGluZSc6ICfQlNC10LTQu9Cw0LnQvScsXHJcbiAgICAnaW1wb3J0YW50X3Rhc2snOiAn0JLQsNC20L3QsNGPINC30LDQtNCw0YfQsCcsXHJcbiAgICAnY2FuY2VsJzogJ9Ce0YLQvNC10L3QsCcsXHJcbiAgICAndG9fc2F2ZSc6ICfQodC+0YXRgNCw0L3QuNGC0YwnLFxyXG4gICAgJ3J1JzogJ9Cg0YPRgdGB0LrQuNC5JyxcclxuICAgICdlbic6ICfQkNC90LPQu9C40LnRgdC60LjQuSdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgJ3Rhc2tfbWFuYWdlcic6ICdUYXNrIG1hbmFnZXInLFxyXG4gICAgJ2xvZ2luJzogJ0xvZ2luJyxcclxuICAgICdsb2FkaW5nX25fc2Vjb25kc19sZWZ0JzogbiA9PiBgTG9hZGluZy4uLiAoJHtufSBzZWNvbmQke24gJSAxMCA9PT0gMSA/ICcnIDogJ3MnfSBsZWZ0KWAsXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ1Bhc3N3b3JkJyxcclxuICAgICd0b19sb2dpbic6ICdMb2cgaW4nLFxyXG4gICAgJ3RvX3JlZ2lzdGVyJzogJ1JlZ2lzdGVyJyxcclxuICAgICdub19hY2NvdW50X3F1ZXN0aW9uJzogJ05vIGFjY291bnQ/JyxcclxuICAgICd0b19sb2dfb3V0JzogJ0xvZyBvdXQnLFxyXG4gICAgJ3JlZ2lzdHJhdGlvbic6ICdSZWdpc3RyYXRpb24nLFxyXG4gICAgJ3JlcGVhdF9wYXNzd29yZCc6ICdSZXBlYXQgcGFzc3dvcmQnLFxyXG4gICAgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJzogJ0hhdmUgZ290IGFuIGFjY291bnQ/JyxcclxuICAgICdlZGl0aW5nJzogJ0VkaXRpbmcnLFxyXG4gICAgJ3Rhc2tfbmFtZSc6ICdUYXNrIG5hbWUnLFxyXG4gICAgJ215X3Rhc2snOiAnTXkgdGFzaycsXHJcbiAgICAnZGVhZGxpbmUnOiAnRGVhZGxpbmUnLFxyXG4gICAgJ2ltcG9ydGFudF90YXNrJzogJ0ltcG9ydGFudCB0YXNrJyxcclxuICAgICdjYW5jZWwnOiAnQ2FuY2VsJyxcclxuICAgICd0b19zYXZlJzogJ1NhdmUnLFxyXG4gICAgJ3J1JzogJ1J1c3NpYW4nLFxyXG4gICAgJ2VuJzogJ0VuZ2xpc2gnLFxyXG59O1xyXG4iLCJpbXBvcnQgUlUgZnJvbSAnLi90OW4ucnUnO1xyXG5pbXBvcnQgRU4gZnJvbSAnLi90OW4uZW4nO1xyXG5cclxuZnVuY3Rpb24gdXNlVGFnKGh0bWxFbCwgdGFnKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xyXG4gICAgaWYgKHR5cGVvZiBodG1sRWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmVzdWx0LmlubmVySFRNTCA9IGh0bWxFbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0LmFwcGVuZENoaWxkKGh0bWxFbCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiB1c2VUYWdzKGh0bWxFbCwgdGFncykge1xyXG4gICAgbGV0IHJlc3VsdCA9IGh0bWxFbDtcclxuICAgIHRhZ3MuZm9yRWFjaCh0YWcgPT4gcmVzdWx0ID0gdXNlVGFnKHJlc3VsdCwgdGFnKSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCAobGFuZElkLCBjb2RlLCB0YWcsIC4uLmFyZ3MpID0+IHtcclxuICAgIGlmIChjb2RlID09IG51bGwgfHwgY29kZS5sZW5ndGggPT09IDApIHJldHVybiAnJztcclxuXHJcbiAgICBpZiAoIVsncnUnLCAnZW4nXS5pbmNsdWRlcyhsYW5kSWQpKSB7XHJcbiAgICAgICAgbGFuZElkID0gJ3J1JztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gY29kZTtcclxuXHJcbiAgICBpZiAobGFuZElkID09PSAncnUnICYmIFJVW2NvZGVdKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gUlVbY29kZV07XHJcbiAgICB9XHJcbiAgICBpZiAobGFuZElkID09PSAnZW4nICYmIEVOW2NvZGVdKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gRU5bY29kZV07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQoLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhZykge1xyXG4gICAgICAgIGlmICh0YWcgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB1c2VUYWdzKHJlc3VsdCwgdGFnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB1c2VUYWcocmVzdWx0LCB0YWcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgbGFuZ0lkOiAnbGFuZ0lkJ1xyXG59KTtcclxuIiwiaW1wb3J0IGxvY2FsU3RvcmFnZUl0ZW1zIGZyb20gXCIuL2xvY2FsU3RvcmFnZUl0ZW1zXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZGVmYXVsdExhbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2VJdGVtcy5sYW5nSWQpID8/ICdydSc7XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b20vaW5wdXQnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2luQW5kUGFzc0Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi0zJz5cclxuICAgICAgICAgICAgICAgICAgICA8SW5wdXQgdGhpcz0nX3VpX2lucHV0X2VtYWlsJyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAnZW1haWwnKX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dDluKGRlZmF1bHRMYW5nLCAnc29tZWJvZHlfZW1haWwnKX0ga2V5PVwiZS1tYWlsXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPElucHV0IHRoaXM9J191aV9pbnB1dF9wd2QnIGxhYmVsPXt0OW4oZGVmYXVsdExhbmcsICdwYXNzd29yZCcpfSBwbGFjZWhvbGRlcj0nKioqKioqKionIGtleT1cInB3ZFwiLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9pbnB1dF9lbWFpbC51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdlbWFpbCcpLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdDluKGxhbmcsICdzb21lYm9keV9lbWFpbCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfcHdkLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ3Bhc3N3b3JkJyksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2F0b20vYnV0dG9uJztcclxuaW1wb3J0IExpbmsgZnJvbSAnLi4vYXRvbS9saW5rJztcclxuaW1wb3J0IExvZ2luQW5kUGFzc0Zvcm0gZnJvbSAnLi9sb2dpbkFuZFBhc3NGb3JtJztcclxuaW1wb3J0IHQ5biBmcm9tICcuLi91dGlscy90OW4vaW5kZXgnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dpbkZvcm0ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi00Jz5cclxuICAgICAgICAgICAgICAgICAgICA8TG9naW5BbmRQYXNzRm9ybSB0aGlzPSdfdWlfbG9naW5fYW5kX3Bhc3NfZm9ybScgLz5cclxuICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGhpcz0nX3VpX3NwYW4nPnt0OW4oZGVmYXVsdExhbmcsICdub19hY2NvdW50X3F1ZXN0aW9uJyl9PC9zcGFuPiZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdGhpcz0nX3VpX2xpbmsnIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX3JlZ2lzdGVyJyl9IGhyZWY9Jy4vcmVnaXN0ZXIuaHRtbCcgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0aGlzPSdfdWlfYnV0dG9uJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICd0b19sb2dpbicpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLl9nZXRfb25fYnRuX2NsaWNrKGRlZmF1bHRMYW5nKX0gY2xhc3NOYW1lPSd3LTEwMCcgdHlwZT0ncHJpbWFyeScgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIF9nZXRfb25fYnRuX2NsaWNrID0gKGxhbmcpID0+IHtcclxuICAgICAgICBjb25zdCB0b2dnbGVCdG5MYWJlbCA9IChzZWNMZWZ0KSA9PiB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlY0xlZnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLnVwZGF0ZSh7IHRleHQ6IHQ5bihsYW5nLCAnbG9hZGluZ19uX3NlY29uZHNfbGVmdCcsICdlbScsIHNlY0xlZnQpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUJ0bkxhYmVsKHNlY0xlZnQgLSAxKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLmVuZExvYWRpbmcodDluKGxhbmcsICd0b19sb2dpbicpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzZWMgPSAzO1xyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5zdGFydExvYWRpbmcoXHJcbiAgICAgICAgICAgICAgICB0OW4obGFuZywgJ2xvYWRpbmdfbl9zZWNvbmRzX2xlZnQnLCAnZW0nLCBzZWMpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHRvZ2dsZUJ0bkxhYmVsKHNlYyAtIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfbGluay51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX3JlZ2lzdGVyJyksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfc3Bhbi50ZXh0Q29udGVudCA9IHQ5bihsYW5nLCAnbm9fYWNjb3VudF9xdWVzdGlvbicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX2xvZ2luJyksXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuX2dldF9vbl9idG5fY2xpY2sobGFuZylcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Qge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ09wdGlvbiAxJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ29wdGlvbjEnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHZhbHVlID0gJ29wdGlvbjEnLFxyXG4gICAgICAgICAgICBvbkNoYW5nZSA9ICh2YWx1ZSkgPT4geyBjb25zb2xlLmxvZyh2YWx1ZSkgfSxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBvbkNoYW5nZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgb3B0aW9ucywgdmFsdWUsIG9uQ2hhbmdlIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9vcHRpb25zID0gW107XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlbGVjdCB0aGlzPSdfdWlfc2VsZWN0JyBjbGFzc05hbWU9J2Zvcm0tc2VsZWN0JyBvbmNoYW5nZT17ZSA9PiBvbkNoYW5nZShlLnRhcmdldC52YWx1ZSl9PlxyXG4gICAgICAgICAgICAgICAge29wdGlvbnMubWFwKG9wdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdWlPcHQgPSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uLnZhbHVlfSBzZWxlY3RlZD17dmFsdWUgPT09IG9wdGlvbi52YWx1ZX0+e29wdGlvbi5sYWJlbH08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9vcHRpb25zLnB1c2godWlPcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aU9wdDtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGFiZWxzID0gKGxhYmVscykgPT4ge1xyXG4gICAgICAgIGlmIChsYWJlbHMubGVuZ3RoICE9PSB0aGlzLl9wcm9wLm9wdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byB1cGRhdGUgc2VsZWN0XFwncyBvcHRpb25zIGxhYmVscyFcXFxyXG4gICAgICAgICAgICAgICAgIExhYmVscyBhcnJheSBpcyBpbmNvbXBhdGlibGUgd2l0aCBzZWxlY3RcXCcgb3B0aW9ucyBhcnJheS4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdWlfb3B0aW9ucy5mb3JFYWNoKCh1aU9wdGlvbiwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdWlPcHRpb24uaW5uZXJIVE1MID0gbGFiZWxzW2luZGV4XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xyXG4gICAgX2V2ZW50TGlzdCA9IHt9O1xyXG5cclxuICAgIC8vIHtcclxuICAgIC8vICAgICAnZXZlbnQxJzogW1xyXG4gICAgLy8gICAgICAgICBmMSxcclxuICAgIC8vICAgICAgICAgZjJcclxuICAgIC8vICAgICBdLFxyXG4gICAgLy8gICAgICdldmVudDInOiBbXHJcbiAgICAvLyAgICAgICAgIGYzXHJcbiAgICAvLyAgICAgXVxyXG4gICAgLy8gfVxyXG5cclxuICAgIHN1YnNjcmliZSA9IChuYW1lLCBsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fZXZlbnRMaXN0W25hbWVdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoID0gKG5hbWUsIGFyZ3MgPSB7fSkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudExpc3QuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcihhcmdzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgbGV0IGNvbW1vbkV2ZW50TWFuYWdlciA9IG5ldyBFdmVudE1hbmFnZXIoKTsgLy8gc2luZ2xldG9uXHJcbmV4cG9ydCB7IEV2ZW50TWFuYWdlciB9OyAvLyBjbGFzc1xyXG4iLCJleHBvcnQgZGVmYXVsdCBPYmplY3QuZnJlZXplKHtcclxuICAgIGNoYW5nZUxhbmc6ICdjaGFuZ2VMYW5nJ1xyXG59KTtcclxuIiwiaW1wb3J0IFNlbGVjdCBmcm9tIFwiLi4vYXRvbS9zZWxlY3RcIjtcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tIFwiLi4vdXRpbHMvY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNvbW1vbkV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi91dGlscy9ldmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi4vdXRpbHMvZXZlbnRzXCI7XHJcbmltcG9ydCB0OW4gZnJvbSBcIi4uL3V0aWxzL3Q5bi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0TGFuZyB7XHJcbiAgICBfbGFuZ0lkcyA9IFsncnUnLCAnZW4nXTtcclxuICAgIF9sYW5nVDluS2V5cyA9IFsncnUnLCAnZW4nXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2xhbmdMYWJlbHMgPSAobGFuZ0lkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmdUOW5LZXlzLm1hcCh0OW5LZXkgPT4gdDluKGxhbmdJZCwgdDluS2V5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLl9sYW5nTGFiZWxzKGRlZmF1bHRMYW5nKTtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fbGFuZ0lkcy5tYXAoKGxhbmdJZCwgaW5kZXgpID0+ICh7XHJcbiAgICAgICAgICAgIHZhbHVlOiBsYW5nSWQsXHJcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbHNbaW5kZXhdXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8U2VsZWN0IHRoaXM9J191aV9zZWxlY3QnIG9wdGlvbnM9e29wdGlvbnN9IHZhbHVlPXtkZWZhdWx0TGFuZ30gXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17bGFuZ0lkID0+IGNvbW1vbkV2ZW50TWFuYWdlci5kaXNwYXRjaChldmVudHMuY2hhbmdlTGFuZywgbGFuZ0lkKX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdGhpcy5fbGFuZ0xhYmVscyhsYW5nKTtcclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlTGFiZWxzKGxhYmVscyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2F0b20vYnV0dG9uJztcclxuaW1wb3J0IFNlbGVjdExhbmcgZnJvbSAnLi9zZWxlY3RMYW5nJztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCA9IGZhbHNlIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgYXV0aG9yaXplZCB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMSB0aGlzPSdfdWlfaDEnIGNsYXNzTmFtZT0nbWUtNSc+e3Q5bihkZWZhdWx0TGFuZywgJ3Rhc2tfbWFuYWdlcicpfTwvaDE+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxTZWxlY3RMYW5nIHRoaXM9J191aV9zZWxlY3QnIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsgYXV0aG9yaXplZCAmJiBcclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idG4nIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9J21zLWF1dG8nIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX2xvZ19vdXQnKX0gLz4gfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7IFxyXG5cclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3VpX2gxLnRleHRDb250ZW50ID0gdDluKGxhbmcsICd0YXNrX21hbmFnZXInKTtcclxuICAgICAgICB0aGlzLl91aV9idG4gJiYgdGhpcy5fdWlfYnRuLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fbG9nX291dCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY29tbW9uRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4vZXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XHJcbmltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tIFwiLi9sb2NhbFN0b3JhZ2VJdGVtc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gICAgY29uc3RydWN0b3IoZXZlbnRNYW5hZ2VyID0gY29tbW9uRXZlbnRNYW5hZ2VyKSB7XHJcbiAgICAgICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShldmVudHMuY2hhbmdlTGFuZywgbGFuZyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHsgbGFuZyB9KTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMubGFuZ0lkLCBsYW5nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi4vd2lkZ2V0L2hlYWRlcic7XHJcbmltcG9ydCBMb2NhbGl6ZWRQYWdlIGZyb20gJy4vbG9jYWxpemVkUGFnZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaXRoSGVhZGVyIGV4dGVuZHMgTG9jYWxpemVkUGFnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBlbGVtKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkID0gZmFsc2UgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBhdXRob3JpemVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfZWxlbSA9IGVsZW07XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXBwLWJvZHknPlxyXG4gICAgICAgICAgICAgICAgPEhlYWRlciB0aGlzPSdfdWlfaGVhZGVyJyBhdXRob3JpemVkPXthdXRob3JpemVkfSAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lciBjZW50ZXJlZCc+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMuX3VpX2VsZW19XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuX3VpX2hlYWRlci51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfZWxlbS51cGRhdGUoZGF0YSk7XHJcbiAgICB9XHJcbn07XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IExvZ2luRm9ybSBmcm9tICcuL3dpZGdldC9sb2dpbkZvcm0nO1xyXG5pbXBvcnQgdDluIGZyb20gJy4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCBXaXRoSGVhZGVyIGZyb20gJy4vdXRpbHMvd2l0aEhlYWRlcic7XHJcblxyXG5jbGFzcyBMb2dpblBhZ2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lci1tZCc+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWItMyc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxIHRoaXM9XCJfdWlfaDFcIiBjbGFzc05hbWU9J3RleHQtY2VudGVyJz57dDluKGRlZmF1bHRMYW5nLCAnbG9naW4nKX08L2gxPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8TG9naW5Gb3JtIHRoaXM9XCJfdWlfbG9naW5fZm9ybVwiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfaDEudGV4dENvbnRlbnQgPSB0OW4obGFuZywgJ2xvZ2luJyk7XHJcbiAgICAgICAgdGhpcy5fdWlfbG9naW5fZm9ybS51cGRhdGUoZGF0YSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vdW50KFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpLFxyXG4gICAgPFdpdGhIZWFkZXI+XHJcbiAgICAgICAgPExvZ2luUGFnZSAvPlxyXG4gICAgPC9XaXRoSGVhZGVyPlxyXG4pO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInF1ZXJ5IiwibnMiLCJ0YWciLCJpZCIsImNsYXNzTmFtZSIsInBhcnNlIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiY2h1bmtzIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwidHJpbSIsImh0bWwiLCJhcmdzIiwidHlwZSIsIlF1ZXJ5IiwiRXJyb3IiLCJwYXJzZUFyZ3VtZW50c0ludGVybmFsIiwiZ2V0RWwiLCJlbCIsImV4dGVuZCIsImV4dGVuZEh0bWwiLCJiaW5kIiwiZG9Vbm1vdW50IiwiY2hpbGQiLCJjaGlsZEVsIiwicGFyZW50RWwiLCJob29rcyIsIl9fcmVkb21fbGlmZWN5Y2xlIiwiaG9va3NBcmVFbXB0eSIsInRyYXZlcnNlIiwiX19yZWRvbV9tb3VudGVkIiwidHJpZ2dlciIsInBhcmVudEhvb2tzIiwiaG9vayIsInBhcmVudE5vZGUiLCJrZXkiLCJob29rTmFtZXMiLCJzaGFkb3dSb290QXZhaWxhYmxlIiwid2luZG93IiwibW91bnQiLCJwYXJlbnQiLCJfY2hpbGQiLCJiZWZvcmUiLCJyZXBsYWNlIiwiX19yZWRvbV92aWV3Iiwid2FzTW91bnRlZCIsIm9sZFBhcmVudCIsImFwcGVuZENoaWxkIiwiZG9Nb3VudCIsImV2ZW50TmFtZSIsInZpZXciLCJob29rQ291bnQiLCJmaXJzdENoaWxkIiwibmV4dCIsIm5leHRTaWJsaW5nIiwicmVtb3VudCIsImhvb2tzRm91bmQiLCJob29rTmFtZSIsInRyaWdnZXJlZCIsIm5vZGVUeXBlIiwiTm9kZSIsIkRPQ1VNRU5UX05PREUiLCJTaGFkb3dSb290Iiwic2V0U3R5bGUiLCJhcmcxIiwiYXJnMiIsInNldFN0eWxlVmFsdWUiLCJ2YWx1ZSIsInN0eWxlIiwieGxpbmtucyIsInNldEF0dHJJbnRlcm5hbCIsImluaXRpYWwiLCJpc09iaiIsImlzU1ZHIiwiU1ZHRWxlbWVudCIsImlzRnVuYyIsInNldERhdGEiLCJzZXRYbGluayIsInNldENsYXNzTmFtZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImFkZGl0aW9uVG9DbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJiYXNlVmFsIiwic2V0QXR0cmlidXRlTlMiLCJyZW1vdmVBdHRyaWJ1dGVOUyIsImRhdGFzZXQiLCJ0ZXh0Iiwic3RyIiwiY3JlYXRlVGV4dE5vZGUiLCJhcmciLCJpc05vZGUiLCJCdXR0b24iLCJfY3JlYXRlQ2xhc3MiLCJfdGhpcyIsInNldHRpbmdzIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiX2NsYXNzQ2FsbENoZWNrIiwiX2RlZmluZVByb3BlcnR5IiwiX3RoaXMkX3Byb3AiLCJfcHJvcCIsImljb24iLCJkaXNhYmxlZCIsIm9uQ2xpY2siLCJjb25jYXQiLCJvbmNsaWNrIiwiX3VpX2ljb24iLCJsb2FkaW5nTGFiZWwiLCJ1cGRhdGUiLCJsb2FkaW5nIiwibGFiZWwiLCJkYXRhIiwiX2RhdGEkdGV4dCIsIl9kYXRhJGljb24iLCJfZGF0YSR0eXBlIiwiX2RhdGEkZGlzYWJsZWQiLCJfZGF0YSRsb2FkaW5nIiwiX2RhdGEkb25DbGljayIsIl9kYXRhJGNsYXNzTmFtZSIsIl91aV9idXR0b24iLCJjaGlsZE5vZGVzIiwiY2hpbGRUb1JlbW92ZSIsInJlbW92ZUNoaWxkIiwiX3VpX3NwaW5uZXIiLCJpbnNlcnRCZWZvcmUiLCJfdWlfc3BhbiIsInNwYW5Cb2R5IiwiaW5uZXJIVE1MIiwiX29iamVjdFNwcmVhZCIsIl9zZXR0aW5ncyR0ZXh0IiwiX3NldHRpbmdzJGljb24iLCJfc2V0dGluZ3MkdHlwZSIsIl9zZXR0aW5ncyRkaXNhYmxlZCIsIl9zZXR0aW5ncyRvbkNsaWNrIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ0YXJnZXQiLCJfc2V0dGluZ3MkY2xhc3NOYW1lIiwiX3VpX3JlbmRlciIsIkxpbmsiLCJocmVmIiwiX2RhdGEkaHJlZiIsIl91aV9hIiwidGV4dENvbnRlbnQiLCJfc2V0dGluZ3MkaHJlZiIsIklucHV0IiwicGxhY2Vob2xkZXIiLCJpbnB1dElkIiwiX2RhdGEkbGFiZWwiLCJfZGF0YSRwbGFjZWhvbGRlciIsIl91aV9sYWJlbCIsIl91aV9pbnB1dCIsInByb3AiLCJfc2V0dGluZ3MkbGFiZWwiLCJfc2V0dGluZ3MkcGxhY2Vob2xkZXIiLCJfc2V0dGluZ3Mka2V5IiwibG9hZGluZ19uX3NlY29uZHNfbGVmdCIsIm4iLCJzZWNvbmRQb3N0Zml4IiwibGVmdFBvc3RmaXgiLCJuQmV0d2VlbjEwYW5kMjAiLCJpbmNsdWRlcyIsInVzZVRhZyIsImh0bWxFbCIsInJlc3VsdCIsInVzZVRhZ3MiLCJ0YWdzIiwiZm9yRWFjaCIsImxhbmRJZCIsImNvZGUiLCJSVSIsIkVOIiwiX2xlbiIsIkFycmF5IiwiX2tleSIsImFwcGx5IiwiT2JqZWN0IiwiZnJlZXplIiwibGFuZ0lkIiwiZGVmYXVsdExhbmciLCJfbG9jYWxTdG9yYWdlJGdldEl0ZW0iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwibG9jYWxTdG9yYWdlSXRlbXMiLCJMb2dpbkFuZFBhc3NGb3JtIiwidDluIiwibGFuZyIsIl91aV9pbnB1dF9lbWFpbCIsIl91aV9pbnB1dF9wd2QiLCJMb2dpbkZvcm0iLCJfZ2V0X29uX2J0bl9jbGljayIsInRvZ2dsZUJ0bkxhYmVsIiwic2VjTGVmdCIsInNldFRpbWVvdXQiLCJlbmRMb2FkaW5nIiwic2VjIiwic3RhcnRMb2FkaW5nIiwiX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0iLCJfdWlfbGluayIsIlNlbGVjdCIsIm9wdGlvbnMiLCJvbkNoYW5nZSIsIl91aV9vcHRpb25zIiwib25jaGFuZ2UiLCJtYXAiLCJvcHRpb24iLCJ1aU9wdCIsInNlbGVjdGVkIiwicHVzaCIsImxhYmVscyIsImVycm9yIiwidWlPcHRpb24iLCJpbmRleCIsIl9zZXR0aW5ncyRvcHRpb25zIiwiX3NldHRpbmdzJHZhbHVlIiwiX3NldHRpbmdzJG9uQ2hhbmdlIiwiRXZlbnRNYW5hZ2VyIiwibmFtZSIsImxpc3RlbmVyIiwiX2V2ZW50TGlzdCIsImhhc093blByb3BlcnR5IiwiY29tbW9uRXZlbnRNYW5hZ2VyIiwiY2hhbmdlTGFuZyIsIlNlbGVjdExhbmciLCJfbGFuZ1Q5bktleXMiLCJ0OW5LZXkiLCJfbGFuZ0xhYmVscyIsIl9sYW5nSWRzIiwiZGlzcGF0Y2giLCJldmVudHMiLCJfZGF0YSRsYW5nIiwiX3VpX3NlbGVjdCIsInVwZGF0ZUxhYmVscyIsIkhlYWRlciIsImF1dGhvcml6ZWQiLCJfdWlfaDEiLCJfdWlfYnRuIiwiX3NldHRpbmdzJGF1dGhvcml6ZWQiLCJfZGVmYXVsdCIsImV2ZW50TWFuYWdlciIsInN1YnNjcmliZSIsInNldEl0ZW0iLCJXaXRoSGVhZGVyIiwiX0xvY2FsaXplZFBhZ2UiLCJlbGVtIiwiX2NhbGxTdXBlciIsIl91aV9lbGVtIiwiX3VpX2hlYWRlciIsIl9pbmhlcml0cyIsIkxvY2FsaXplZFBhZ2UiLCJMb2dpblBhZ2UiLCJfdWlfbG9naW5fZm9ybSIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
