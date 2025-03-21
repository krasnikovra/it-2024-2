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

var localStorageItems = Object.freeze({
  langId: 'langId'
});

var _localStorage$getItem;
var defaultLang$1 = (_localStorage$getItem = localStorage.getItem(localStorageItems.langId)) !== null && _localStorage$getItem !== void 0 ? _localStorage$getItem : 'ru';

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
  return result;
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

var RegFrom = /*#__PURE__*/_createClass(function RegFrom() {
  var _this = this;
  _classCallCheck(this, RegFrom);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      "class": 'mb-4'
    }, el("div", {
      className: 'mb-3'
    }, this['_ui_login_and_pass_form'] = new LoginAndPassForm({})), this['_ui_input_repeat_pwd'] = new Input({
      label: t9n(defaultLang$1, 'repeat_password'),
      placeholder: '********'
    }), el("p", null, el("small", null, this['_ui_span'] = el("span", null, t9n(defaultLang$1, 'already_have_account_question')), "\xA0", this['_ui_link'] = new Link({
      text: t9n(defaultLang$1, 'to_login'),
      href: './login.html'
    })))), el("div", {
      className: 'text-center'
    }, this['_ui_btn'] = new Button({
      text: t9n(defaultLang$1, 'to_register'),
      className: 'w-100',
      type: 'primary'
    })));
  });
  _defineProperty(this, "update", function (data) {
    var _data$lang = data.lang,
      lang = _data$lang === void 0 ? defaultLang$1 : _data$lang;
    _this._ui_login_and_pass_form.update(data);
    _this._ui_input_repeat_pwd.update({
      label: t9n(lang, 'repeat_password')
    });
    _this._ui_span.innerHTML = t9n(lang, 'already_have_account_question');
    _this._ui_link.update({
      text: t9n(lang, 'to_login')
    });
    _this._ui_btn.update({
      text: t9n(lang, 'to_register')
    });
  });
  this.el = this._ui_render();
});

var RegPage = /*#__PURE__*/_createClass(function RegPage() {
  var _this = this;
  _classCallCheck(this, RegPage);
  _defineProperty(this, "_ui_render", function () {
    return el("div", {
      className: 'container-md'
    }, el("div", {
      className: 'mb-3'
    }, this['_ui_h1'] = el("h1", {
      className: 'text-center'
    }, t9n(defaultLang$1, 'registration'))), this['_ui_reg_form'] = new RegFrom({}));
  });
  _defineProperty(this, "update", function (data) {
    var _data$lang = data.lang,
      lang = _data$lang === void 0 ? defaultLang$1 : _data$lang;
    _this._ui_h1.innerHTML = t9n(lang, 'registration');
    _this._ui_reg_form.update(data);
  });
  this.el = this._ui_render();
});
mount(document.getElementById("root"), new WithHeader({}, new RegPage({})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxTdG9yYWdlSXRlbXMuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2NvbnN0YW50cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5ydS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5lbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvc2VsZWN0TGFuZy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2hlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxpemVkUGFnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvd2l0aEhlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9pbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9saW5rLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvbG9naW5BbmRQYXNzRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L3JlZ0Zvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3JlZ2lzdGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKSB7XG4gIGNvbnN0IHsgdGFnLCBpZCwgY2xhc3NOYW1lIH0gPSBwYXJzZShxdWVyeSk7XG4gIGNvbnN0IGVsZW1lbnQgPSBuc1xuICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpXG4gICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cbiAgaWYgKGlkKSB7XG4gICAgZWxlbWVudC5pZCA9IGlkO1xuICB9XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGlmIChucykge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gcGFyc2UocXVlcnkpIHtcbiAgY29uc3QgY2h1bmtzID0gcXVlcnkuc3BsaXQoLyhbLiNdKS8pO1xuICBsZXQgY2xhc3NOYW1lID0gXCJcIjtcbiAgbGV0IGlkID0gXCJcIjtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8IGNodW5rcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHN3aXRjaCAoY2h1bmtzW2ldKSB7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBjbGFzc05hbWUgKz0gYCAke2NodW5rc1tpICsgMV19YDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIGlkID0gY2h1bmtzW2kgKyAxXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLnRyaW0oKSxcbiAgICB0YWc6IGNodW5rc1swXSB8fCBcImRpdlwiLFxuICAgIGlkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBodG1sKHF1ZXJ5LCAuLi5hcmdzKSB7XG4gIGxldCBlbGVtZW50O1xuXG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgcXVlcnk7XG5cbiAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChxdWVyeSk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IFF1ZXJ5KC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5jb25zdCBlbCA9IGh0bWw7XG5jb25zdCBoID0gaHRtbDtcblxuaHRtbC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRIdG1sKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGh0bWwuYmluZCh0aGlzLCAuLi5hcmdzKTtcbn07XG5cbmZ1bmN0aW9uIHVubW91bnQocGFyZW50LCBfY2hpbGQpIHtcbiAgbGV0IGNoaWxkID0gX2NoaWxkO1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZEVsLnBhcmVudE5vZGUpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKTtcblxuICAgIHBhcmVudEVsLnJlbW92ZUNoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKSB7XG4gIGNvbnN0IGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoaG9va3NBcmVFbXB0eShob29rcykpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRyYXZlcnNlID0gcGFyZW50RWw7XG5cbiAgaWYgKGNoaWxkRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgdHJpZ2dlcihjaGlsZEVsLCBcIm9udW5tb3VudFwiKTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgfHwge307XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIGlmIChwYXJlbnRIb29rc1tob29rXSkge1xuICAgICAgICBwYXJlbnRIb29rc1tob29rXSAtPSBob29rc1tob29rXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaG9va3NBcmVFbXB0eShwYXJlbnRIb29rcykpIHtcbiAgICAgIHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cmF2ZXJzZSA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaG9va3NBcmVFbXB0eShob29rcykge1xuICBpZiAoaG9va3MgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2tzW2tleV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qIGdsb2JhbCBOb2RlLCBTaGFkb3dSb290ICovXG5cblxuY29uc3QgaG9va05hbWVzID0gW1wib25tb3VudFwiLCBcIm9ucmVtb3VudFwiLCBcIm9udW5tb3VudFwiXTtcbmNvbnN0IHNoYWRvd1Jvb3RBdmFpbGFibGUgPVxuICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIFwiU2hhZG93Um9vdFwiIGluIHdpbmRvdztcblxuZnVuY3Rpb24gbW91bnQocGFyZW50LCBfY2hpbGQsIGJlZm9yZSwgcmVwbGFjZSkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX3ZpZXcgPSBjaGlsZDtcbiAgfVxuXG4gIGNvbnN0IHdhc01vdW50ZWQgPSBjaGlsZEVsLl9fcmVkb21fbW91bnRlZDtcbiAgY29uc3Qgb2xkUGFyZW50ID0gY2hpbGRFbC5wYXJlbnROb2RlO1xuXG4gIGlmICh3YXNNb3VudGVkICYmIG9sZFBhcmVudCAhPT0gcGFyZW50RWwpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIG9sZFBhcmVudCk7XG4gIH1cblxuICBpZiAoYmVmb3JlICE9IG51bGwpIHtcbiAgICBpZiAocmVwbGFjZSkge1xuICAgICAgY29uc3QgYmVmb3JlRWwgPSBnZXRFbChiZWZvcmUpO1xuXG4gICAgICBpZiAoYmVmb3JlRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgICAgIHRyaWdnZXIoYmVmb3JlRWwsIFwib251bm1vdW50XCIpO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnRFbC5yZXBsYWNlQ2hpbGQoY2hpbGRFbCwgYmVmb3JlRWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRFbC5pbnNlcnRCZWZvcmUoY2hpbGRFbCwgZ2V0RWwoYmVmb3JlKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgZG9Nb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwsIG9sZFBhcmVudCk7XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyKGVsLCBldmVudE5hbWUpIHtcbiAgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbm1vdW50XCIgfHwgZXZlbnROYW1lID09PSBcIm9ucmVtb3VudFwiKSB7XG4gICAgZWwuX19yZWRvbV9tb3VudGVkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChldmVudE5hbWUgPT09IFwib251bm1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGhvb2tzID0gZWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKCFob29rcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHZpZXcgPSBlbC5fX3JlZG9tX3ZpZXc7XG4gIGxldCBob29rQ291bnQgPSAwO1xuXG4gIHZpZXc/LltldmVudE5hbWVdPy4oKTtcblxuICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9vaykge1xuICAgICAgaG9va0NvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGhvb2tDb3VudCkge1xuICAgIGxldCB0cmF2ZXJzZSA9IGVsLmZpcnN0Q2hpbGQ7XG5cbiAgICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICAgIGNvbnN0IG5leHQgPSB0cmF2ZXJzZS5uZXh0U2libGluZztcblxuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgZXZlbnROYW1lKTtcblxuICAgICAgdHJhdmVyc2UgPSBuZXh0O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KSB7XG4gIGlmICghY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgfVxuXG4gIGNvbnN0IGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcbiAgY29uc3QgcmVtb3VudCA9IHBhcmVudEVsID09PSBvbGRQYXJlbnQ7XG4gIGxldCBob29rc0ZvdW5kID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBob29rTmFtZSBvZiBob29rTmFtZXMpIHtcbiAgICBpZiAoIXJlbW91bnQpIHtcbiAgICAgIC8vIGlmIGFscmVhZHkgbW91bnRlZCwgc2tpcCB0aGlzIHBoYXNlXG4gICAgICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICAgICAgLy8gb25seSBWaWV3cyBjYW4gaGF2ZSBsaWZlY3ljbGUgZXZlbnRzXG4gICAgICAgIGlmIChob29rTmFtZSBpbiBjaGlsZCkge1xuICAgICAgICAgIGhvb2tzW2hvb2tOYW1lXSA9IChob29rc1tob29rTmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChob29rc1tob29rTmFtZV0pIHtcbiAgICAgIGhvb2tzRm91bmQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9va3NGb3VuZCkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcbiAgbGV0IHRyaWdnZXJlZCA9IGZhbHNlO1xuXG4gIGlmIChyZW1vdW50IHx8IHRyYXZlcnNlPy5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIHJlbW91bnQgPyBcIm9ucmVtb3VudFwiIDogXCJvbm1vdW50XCIpO1xuICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gIH1cblxuICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuXG4gICAgaWYgKCF0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gICAgZm9yIChjb25zdCBob29rIGluIGhvb2tzKSB7XG4gICAgICBwYXJlbnRIb29rc1tob29rXSA9IChwYXJlbnRIb29rc1tob29rXSB8fCAwKSArIGhvb2tzW2hvb2tdO1xuICAgIH1cblxuICAgIGlmICh0cmlnZ2VyZWQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0cmF2ZXJzZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8XG4gICAgICAoc2hhZG93Um9vdEF2YWlsYWJsZSAmJiB0cmF2ZXJzZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHx8XG4gICAgICBwYXJlbnQ/Ll9fcmVkb21fbW91bnRlZFxuICAgICkge1xuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICAgIH1cbiAgICB0cmF2ZXJzZSA9IHBhcmVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZSh2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIGNvbnN0IGVsID0gZ2V0RWwodmlldyk7XG5cbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0U3R5bGVWYWx1ZShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZXRTdHlsZVZhbHVlKGVsLCBhcmcxLCBhcmcyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIHZhbHVlKSB7XG4gIGVsLnN0eWxlW2tleV0gPSB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlO1xufVxuXG4vKiBnbG9iYWwgU1ZHRWxlbWVudCAqL1xuXG5cbmNvbnN0IHhsaW5rbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIjtcblxuZnVuY3Rpb24gc2V0QXR0cih2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyKTtcbn1cblxuZnVuY3Rpb24gc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIsIGluaXRpYWwpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBjb25zdCBpc09iaiA9IHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiO1xuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbCwga2V5LCBhcmcxW2tleV0sIGluaXRpYWwpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpc1NWRyA9IGVsIGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcbiAgICBjb25zdCBpc0Z1bmMgPSB0eXBlb2YgYXJnMiA9PT0gXCJmdW5jdGlvblwiO1xuXG4gICAgaWYgKGFyZzEgPT09IFwic3R5bGVcIiAmJiB0eXBlb2YgYXJnMiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgc2V0U3R5bGUoZWwsIGFyZzIpO1xuICAgIH0gZWxzZSBpZiAoaXNTVkcgJiYgaXNGdW5jKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIGlmIChhcmcxID09PSBcImRhdGFzZXRcIikge1xuICAgICAgc2V0RGF0YShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmICghaXNTVkcgJiYgKGFyZzEgaW4gZWwgfHwgaXNGdW5jKSAmJiBhcmcxICE9PSBcImxpc3RcIikge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTVkcgJiYgYXJnMSA9PT0gXCJ4bGlua1wiKSB7XG4gICAgICAgIHNldFhsaW5rKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGluaXRpYWwgJiYgYXJnMSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgIHNldENsYXNzTmFtZShlbCwgYXJnMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChhcmcyID09IG51bGwpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGFyZzEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGFyZzEsIGFyZzIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRDbGFzc05hbWUoZWwsIGFkZGl0aW9uVG9DbGFzc05hbWUpIHtcbiAgaWYgKGFkZGl0aW9uVG9DbGFzc05hbWUgPT0gbnVsbCkge1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICB9IGVsc2UgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoYWRkaXRpb25Ub0NsYXNzTmFtZSk7XG4gIH0gZWxzZSBpZiAoXG4gICAgdHlwZW9mIGVsLmNsYXNzTmFtZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgIGVsLmNsYXNzTmFtZSAmJlxuICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsXG4gICkge1xuICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsID1cbiAgICAgIGAke2VsLmNsYXNzTmFtZS5iYXNlVmFsfSAke2FkZGl0aW9uVG9DbGFzc05hbWV9YC50cmltKCk7XG4gIH0gZWxzZSB7XG4gICAgZWwuY2xhc3NOYW1lID0gYCR7ZWwuY2xhc3NOYW1lfSAke2FkZGl0aW9uVG9DbGFzc05hbWV9YC50cmltKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0WGxpbmsoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0WGxpbmsoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGFyZzIgIT0gbnVsbCkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXREYXRhKGVsLCBhcmcxLCBhcmcyKSB7XG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldERhdGEoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGFyZzIgIT0gbnVsbCkge1xuICAgICAgZWwuZGF0YXNldFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBlbC5kYXRhc2V0W2FyZzFdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0ZXh0KHN0cikge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RyICE9IG51bGwgPyBzdHIgOiBcIlwiKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VBcmd1bWVudHNJbnRlcm5hbChlbGVtZW50LCBhcmdzLCBpbml0aWFsKSB7XG4gIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICBpZiAoYXJnICE9PSAwICYmICFhcmcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgYXJnO1xuXG4gICAgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYXJnKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRleHQoYXJnKSk7XG4gICAgfSBlbHNlIGlmIChpc05vZGUoZ2V0RWwoYXJnKSkpIHtcbiAgICAgIG1vdW50KGVsZW1lbnQsIGFyZyk7XG4gICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoKSB7XG4gICAgICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZywgaW5pdGlhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRBdHRySW50ZXJuYWwoZWxlbWVudCwgYXJnLCBudWxsLCBpbml0aWFsKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5zdXJlRWwocGFyZW50KSB7XG4gIHJldHVybiB0eXBlb2YgcGFyZW50ID09PSBcInN0cmluZ1wiID8gaHRtbChwYXJlbnQpIDogZ2V0RWwocGFyZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWwocGFyZW50KSB7XG4gIHJldHVybiAoXG4gICAgKHBhcmVudC5ub2RlVHlwZSAmJiBwYXJlbnQpIHx8ICghcGFyZW50LmVsICYmIHBhcmVudCkgfHwgZ2V0RWwocGFyZW50LmVsKVxuICApO1xufVxuXG5mdW5jdGlvbiBpc05vZGUoYXJnKSB7XG4gIHJldHVybiBhcmc/Lm5vZGVUeXBlO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaChjaGlsZCwgZGF0YSwgZXZlbnROYW1lID0gXCJyZWRvbVwiKSB7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IGRhdGEgfSk7XG4gIGNoaWxkRWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbmZ1bmN0aW9uIHNldENoaWxkcmVuKHBhcmVudCwgLi4uY2hpbGRyZW4pIHtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBsZXQgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIHBhcmVudEVsLmZpcnN0Q2hpbGQpO1xuXG4gIHdoaWxlIChjdXJyZW50KSB7XG4gICAgY29uc3QgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG5cbiAgICB1bm1vdW50KHBhcmVudCwgY3VycmVudCk7XG5cbiAgICBjdXJyZW50ID0gbmV4dDtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBfY3VycmVudCkge1xuICBsZXQgY3VycmVudCA9IF9jdXJyZW50O1xuXG4gIGNvbnN0IGNoaWxkRWxzID0gQXJyYXkoY2hpbGRyZW4ubGVuZ3RoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hpbGRFbHNbaV0gPSBjaGlsZHJlbltpXSAmJiBnZXRFbChjaGlsZHJlbltpXSk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcblxuICAgIGlmICghY2hpbGQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkRWwgPSBjaGlsZEVsc1tpXTtcblxuICAgIGlmIChjaGlsZEVsID09PSBjdXJyZW50KSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChpc05vZGUoY2hpbGRFbCkpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBjdXJyZW50Py5uZXh0U2libGluZztcbiAgICAgIGNvbnN0IGV4aXN0cyA9IGNoaWxkLl9fcmVkb21faW5kZXggIT0gbnVsbDtcbiAgICAgIGNvbnN0IHJlcGxhY2UgPSBleGlzdHMgJiYgbmV4dCA9PT0gY2hpbGRFbHNbaSArIDFdO1xuXG4gICAgICBtb3VudChwYXJlbnQsIGNoaWxkLCBjdXJyZW50LCByZXBsYWNlKTtcblxuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5sZW5ndGggIT0gbnVsbCkge1xuICAgICAgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGQsIGN1cnJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBsaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIExpc3RQb29sIHtcbiAgY29uc3RydWN0b3IoVmlldywga2V5LCBpbml0RGF0YSkge1xuICAgIHRoaXMuVmlldyA9IFZpZXc7XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICAgIHRoaXMub2xkTG9va3VwID0ge307XG4gICAgdGhpcy5sb29rdXAgPSB7fTtcbiAgICB0aGlzLm9sZFZpZXdzID0gW107XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuXG4gICAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmtleSA9IHR5cGVvZiBrZXkgPT09IFwiZnVuY3Rpb25cIiA/IGtleSA6IHByb3BLZXkoa2V5KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoZGF0YSwgY29udGV4dCkge1xuICAgIGNvbnN0IHsgVmlldywga2V5LCBpbml0RGF0YSB9ID0gdGhpcztcbiAgICBjb25zdCBrZXlTZXQgPSBrZXkgIT0gbnVsbDtcblxuICAgIGNvbnN0IG9sZExvb2t1cCA9IHRoaXMubG9va3VwO1xuICAgIGNvbnN0IG5ld0xvb2t1cCA9IHt9O1xuXG4gICAgY29uc3QgbmV3Vmlld3MgPSBBcnJheShkYXRhLmxlbmd0aCk7XG4gICAgY29uc3Qgb2xkVmlld3MgPSB0aGlzLnZpZXdzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gZGF0YVtpXTtcbiAgICAgIGxldCB2aWV3O1xuXG4gICAgICBpZiAoa2V5U2V0KSB7XG4gICAgICAgIGNvbnN0IGlkID0ga2V5KGl0ZW0pO1xuXG4gICAgICAgIHZpZXcgPSBvbGRMb29rdXBbaWRdIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgICAgbmV3TG9va3VwW2lkXSA9IHZpZXc7XG4gICAgICAgIHZpZXcuX19yZWRvbV9pZCA9IGlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlldyA9IG9sZFZpZXdzW2ldIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgIH1cbiAgICAgIHZpZXcudXBkYXRlPy4oaXRlbSwgaSwgZGF0YSwgY29udGV4dCk7XG5cbiAgICAgIGNvbnN0IGVsID0gZ2V0RWwodmlldy5lbCk7XG5cbiAgICAgIGVsLl9fcmVkb21fdmlldyA9IHZpZXc7XG4gICAgICBuZXdWaWV3c1tpXSA9IHZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5vbGRWaWV3cyA9IG9sZFZpZXdzO1xuICAgIHRoaXMudmlld3MgPSBuZXdWaWV3cztcblxuICAgIHRoaXMub2xkTG9va3VwID0gb2xkTG9va3VwO1xuICAgIHRoaXMubG9va3VwID0gbmV3TG9va3VwO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb3BLZXkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiBwcm9wcGVkS2V5KGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbVtrZXldO1xuICB9O1xufVxuXG5mdW5jdGlvbiBsaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICAgIHRoaXMuVmlldyA9IFZpZXc7XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLnBvb2wgPSBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG4gICAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gICAgdGhpcy5rZXlTZXQgPSBrZXkgIT0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBrZXlTZXQgfSA9IHRoaXM7XG4gICAgY29uc3Qgb2xkVmlld3MgPSB0aGlzLnZpZXdzO1xuXG4gICAgdGhpcy5wb29sLnVwZGF0ZShkYXRhIHx8IFtdLCBjb250ZXh0KTtcblxuICAgIGNvbnN0IHsgdmlld3MsIGxvb2t1cCB9ID0gdGhpcy5wb29sO1xuXG4gICAgaWYgKGtleVNldCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvbGRWaWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvbGRWaWV3ID0gb2xkVmlld3NbaV07XG4gICAgICAgIGNvbnN0IGlkID0gb2xkVmlldy5fX3JlZG9tX2lkO1xuXG4gICAgICAgIGlmIChsb29rdXBbaWRdID09IG51bGwpIHtcbiAgICAgICAgICBvbGRWaWV3Ll9fcmVkb21faW5kZXggPSBudWxsO1xuICAgICAgICAgIHVubW91bnQodGhpcywgb2xkVmlldyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdmlld3NbaV07XG5cbiAgICAgIHZpZXcuX19yZWRvbV9pbmRleCA9IGk7XG4gICAgfVxuXG4gICAgc2V0Q2hpbGRyZW4odGhpcywgdmlld3MpO1xuXG4gICAgaWYgKGtleVNldCkge1xuICAgICAgdGhpcy5sb29rdXAgPSBsb29rdXA7XG4gICAgfVxuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgfVxufVxuXG5MaXN0LmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBMaXN0LmJpbmQoTGlzdCwgcGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn07XG5cbmxpc3QuZXh0ZW5kID0gTGlzdC5leHRlbmQ7XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cblxuZnVuY3Rpb24gcGxhY2UoVmlldywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBQbGFjZShWaWV3LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIFBsYWNlIHtcbiAgY29uc3RydWN0b3IoVmlldywgaW5pdERhdGEpIHtcbiAgICB0aGlzLmVsID0gdGV4dChcIlwiKTtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdGhpcy5lbDtcblxuICAgIGlmIChWaWV3IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgIH0gZWxzZSBpZiAoVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIHRoaXMuX2VsID0gVmlldztcbiAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX1ZpZXcgPSBWaWV3O1xuICAgIH1cblxuICAgIHRoaXMuX2luaXREYXRhID0gaW5pdERhdGE7XG4gIH1cblxuICB1cGRhdGUodmlzaWJsZSwgZGF0YSkge1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZWwucGFyZW50Tm9kZTtcblxuICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCwgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IGdldEVsKHRoaXMuX2VsKTtcbiAgICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IFZpZXcgPSB0aGlzLl9WaWV3O1xuICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVmlldyh0aGlzLl9pbml0RGF0YSk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodmlldyk7XG4gICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcblxuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHZpZXcsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy5fZWwpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy5fZWwpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMudmlldyk7XG4gICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy52aWV3KTtcblxuICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVmKGN0eCwga2V5LCB2YWx1ZSkge1xuICBjdHhba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cblxuZnVuY3Rpb24gcm91dGVyKHBhcmVudCwgdmlld3MsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUm91dGVyKHBhcmVudCwgdmlld3MsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUm91dGVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLnZpZXdzID0gdmlld3M7XG4gICAgdGhpcy5WaWV3cyA9IHZpZXdzOyAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZShyb3V0ZSwgZGF0YSkge1xuICAgIGlmIChyb3V0ZSAhPT0gdGhpcy5yb3V0ZSkge1xuICAgICAgY29uc3Qgdmlld3MgPSB0aGlzLnZpZXdzO1xuICAgICAgY29uc3QgVmlldyA9IHZpZXdzW3JvdXRlXTtcblxuICAgICAgdGhpcy5yb3V0ZSA9IHJvdXRlO1xuXG4gICAgICBpZiAoVmlldyAmJiAoVmlldyBpbnN0YW5jZW9mIE5vZGUgfHwgVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpKSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXcgPSBWaWV3ICYmIG5ldyBWaWV3KHRoaXMuaW5pdERhdGEsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBzZXRDaGlsZHJlbih0aGlzLmVsLCBbdGhpcy52aWV3XSk7XG4gICAgfVxuICAgIHRoaXMudmlldz8udXBkYXRlPy4oZGF0YSwgcm91dGUpO1xuICB9XG59XG5cbmNvbnN0IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG5mdW5jdGlvbiBzdmcocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5LCBucyk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IFF1ZXJ5KC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5jb25zdCBzID0gc3ZnO1xuXG5zdmcuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kU3ZnKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHN2Zy5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuc3ZnLm5zID0gbnM7XG5cbmZ1bmN0aW9uIHZpZXdGYWN0b3J5KHZpZXdzLCBrZXkpIHtcbiAgaWYgKCF2aWV3cyB8fCB0eXBlb2Ygdmlld3MgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ2aWV3cyBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICBpZiAoIWtleSB8fCB0eXBlb2Yga2V5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwia2V5IG11c3QgYmUgYSBzdHJpbmdcIik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIGZhY3RvcnlWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKSB7XG4gICAgY29uc3Qgdmlld0tleSA9IGl0ZW1ba2V5XTtcbiAgICBjb25zdCBWaWV3ID0gdmlld3Nbdmlld0tleV07XG5cbiAgICBpZiAoVmlldykge1xuICAgICAgcmV0dXJuIG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYHZpZXcgJHt2aWV3S2V5fSBub3QgZm91bmRgKTtcbiAgfTtcbn1cblxuZXhwb3J0IHsgTGlzdCwgTGlzdFBvb2wsIFBsYWNlLCBSb3V0ZXIsIGRpc3BhdGNoLCBlbCwgaCwgaHRtbCwgbGlzdCwgbGlzdFBvb2wsIG1vdW50LCBwbGFjZSwgcmVmLCByb3V0ZXIsIHMsIHNldEF0dHIsIHNldENoaWxkcmVuLCBzZXREYXRhLCBzZXRTdHlsZSwgc2V0WGxpbmssIHN2ZywgdGV4dCwgdW5tb3VudCwgdmlld0ZhY3RvcnkgfTtcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgbGFuZ0lkOiAnbGFuZ0lkJ1xyXG59KTtcclxuIiwiaW1wb3J0IGxvY2FsU3RvcmFnZUl0ZW1zIGZyb20gXCIuL2xvY2FsU3RvcmFnZUl0ZW1zXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZGVmYXVsdExhbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2VJdGVtcy5sYW5nSWQpID8/ICdydSc7XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgICd0YXNrX21hbmFnZXInOiAn0JzQtdC90LXQtNC20LXRgCDQt9Cw0LTQsNGHJyxcclxuICAgICdsb2dpbic6ICfQktGF0L7QtCcsXHJcbiAgICAnbG9hZGluZ19uX3NlY29uZHNfbGVmdCc6IG4gPT4ge1xyXG4gICAgICAgIGxldCBzZWNvbmRQb3N0Zml4ID0gJyc7XHJcbiAgICAgICAgbGV0IGxlZnRQb3N0Zml4ID0gJ9C+0YHRjCc7XHJcbiAgICAgICAgY29uc3QgbkJldHdlZW4xMGFuZDIwID0gbiA+IDEwICYmIG4gPCAyMDtcclxuICAgICAgICBpZiAobiAlIDEwID09PSAxICYmICFuQmV0d2VlbjEwYW5kMjApIHtcclxuICAgICAgICAgICAgc2Vjb25kUG9zdGZpeCA9ICfQsCc7XHJcbiAgICAgICAgICAgIGxlZnRQb3N0Zml4ID0gJ9Cw0YHRjCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFsyLCAzLCA0XS5pbmNsdWRlcyhuICUgMTApICYmICFuQmV0d2VlbjEwYW5kMjApIHtcclxuICAgICAgICAgICAgc2Vjb25kUG9zdGZpeCA9ICfRiyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYNCX0LDQs9GA0YPQt9C60LAuLi4gKNCe0YHRgtCw0Lske2xlZnRQb3N0Zml4fSAke259INGB0LXQutGD0L3QtCR7c2Vjb25kUG9zdGZpeH0pYDtcclxuICAgIH0sXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ9Cf0LDRgNC+0LvRjCcsXHJcbiAgICAndG9fbG9naW4nOiAn0JLQvtC50YLQuCcsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAn0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPJyxcclxuICAgICdub19hY2NvdW50X3F1ZXN0aW9uJzogJ9Cd0LXRgiDQsNC60LrQsNGD0L3RgtCwPycsXHJcbiAgICAndG9fbG9nX291dCc6ICfQktGL0LnRgtC4JyxcclxuICAgICdyZWdpc3RyYXRpb24nOiAn0KDQtdCz0LjRgdGC0YDQsNGG0LjRjycsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ9Cf0L7QstGC0L7RgNC40YLQtSDQv9Cw0YDQvtC70YwnLFxyXG4gICAgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJzogJ9Cj0LbQtSDQtdGB0YLRjCDQsNC60LrQsNGD0L3Rgj8nLFxyXG4gICAgJ2VkaXRpbmcnOiAn0KDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtScsXHJcbiAgICAndGFza19uYW1lJzogJ9Cd0LDQt9Cy0LDQvdC40LUg0LfQsNC00LDRh9C4JyxcclxuICAgICdteV90YXNrJzogJ9Cc0L7RjyDQt9Cw0LTQsNGH0LAnLFxyXG4gICAgJ2RlYWRsaW5lJzogJ9CU0LXQtNC70LDQudC9JyxcclxuICAgICdpbXBvcnRhbnRfdGFzayc6ICfQktCw0LbQvdCw0Y8g0LfQsNC00LDRh9CwJyxcclxuICAgICdjYW5jZWwnOiAn0J7RgtC80LXQvdCwJyxcclxuICAgICd0b19zYXZlJzogJ9Ch0L7RhdGA0LDQvdC40YLRjCcsXHJcbiAgICAncnUnOiAn0KDRg9GB0YHQutC40LknLFxyXG4gICAgJ2VuJzogJ9CQ0L3Qs9C70LjQudGB0LrQuNC5J1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAndGFza19tYW5hZ2VyJzogJ1Rhc2sgbWFuYWdlcicsXHJcbiAgICAnbG9naW4nOiAnTG9naW4nLFxyXG4gICAgJ2xvYWRpbmdfbl9zZWNvbmRzX2xlZnQnOiBuID0+IGBMb2FkaW5nLi4uICgke259IHNlY29uZCR7biAlIDEwID09PSAxID8gJycgOiAncyd9IGxlZnQpYCxcclxuICAgICdlbWFpbCc6ICdFLW1haWwnLFxyXG4gICAgJ3NvbWVib2R5X2VtYWlsJzogJ3NvbWVib2R5QGdtYWlsLmNvbScsXHJcbiAgICAncGFzc3dvcmQnOiAnUGFzc3dvcmQnLFxyXG4gICAgJ3RvX2xvZ2luJzogJ0xvZyBpbicsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAnUmVnaXN0ZXInLFxyXG4gICAgJ25vX2FjY291bnRfcXVlc3Rpb24nOiAnTm8gYWNjb3VudD8nLFxyXG4gICAgJ3RvX2xvZ19vdXQnOiAnTG9nIG91dCcsXHJcbiAgICAncmVnaXN0cmF0aW9uJzogJ1JlZ2lzdHJhdGlvbicsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ1JlcGVhdCBwYXNzd29yZCcsXHJcbiAgICAnYWxyZWFkeV9oYXZlX2FjY291bnRfcXVlc3Rpb24nOiAnSGF2ZSBnb3QgYW4gYWNjb3VudD8nLFxyXG4gICAgJ2VkaXRpbmcnOiAnRWRpdGluZycsXHJcbiAgICAndGFza19uYW1lJzogJ1Rhc2sgbmFtZScsXHJcbiAgICAnbXlfdGFzayc6ICdNeSB0YXNrJyxcclxuICAgICdkZWFkbGluZSc6ICdEZWFkbGluZScsXHJcbiAgICAnaW1wb3J0YW50X3Rhc2snOiAnSW1wb3J0YW50IHRhc2snLFxyXG4gICAgJ2NhbmNlbCc6ICdDYW5jZWwnLFxyXG4gICAgJ3RvX3NhdmUnOiAnU2F2ZScsXHJcbiAgICAncnUnOiAnUnVzc2lhbicsXHJcbiAgICAnZW4nOiAnRW5nbGlzaCcsXHJcbn07XHJcbiIsImltcG9ydCBSVSBmcm9tICcuL3Q5bi5ydSc7XHJcbmltcG9ydCBFTiBmcm9tICcuL3Q5bi5lbic7XHJcblxyXG5mdW5jdGlvbiB1c2VUYWcoaHRtbEVsLCB0YWcpIHtcclxuICAgIGxldCByZXN1bHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICBpZiAodHlwZW9mIGh0bWxFbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gaHRtbEVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQuYXBwZW5kQ2hpbGQoaHRtbEVsKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVzZVRhZ3MoaHRtbEVsLCB0YWdzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gaHRtbEVsO1xyXG4gICAgdGFncy5mb3JFYWNoKHRhZyA9PiByZXN1bHQgPSB1c2VUYWcocmVzdWx0LCB0YWcpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChsYW5kSWQsIGNvZGUsIHRhZywgLi4uYXJncykgPT4ge1xyXG4gICAgaWYgKGNvZGUgPT0gbnVsbCB8fCBjb2RlLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xyXG5cclxuICAgIGlmICghWydydScsICdlbiddLmluY2x1ZGVzKGxhbmRJZCkpIHtcclxuICAgICAgICBsYW5kSWQgPSAncnUnO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBjb2RlO1xyXG5cclxuICAgIGlmIChsYW5kSWQgPT09ICdydScgJiYgUlVbY29kZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBSVVtjb2RlXTtcclxuICAgIH1cclxuICAgIGlmIChsYW5kSWQgPT09ICdlbicgJiYgRU5bY29kZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBFTltjb2RlXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCguLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFnKSB7XHJcbiAgICAgICAgaWYgKHRhZyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVzZVRhZ3MocmVzdWx0LCB0YWcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVzZVRhZyhyZXN1bHQsIHRhZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayA9IChlKSA9PiB7IGNvbnNvbGUubG9nKFwiY2xpY2tlZCBidXR0b25cIiwgZS50YXJnZXQpOyB9LFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGljb24sXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkLFxyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayxcclxuICAgICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgaWNvbiwgdHlwZSwgZGlzYWJsZWQsIG9uQ2xpY2ssIGNsYXNzTmFtZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGJ1dHRvbiB0aGlzPSdfdWlfYnV0dG9uJyBjbGFzc05hbWU9e2BidG4gYnRuLSR7dHlwZX0gJHtjbGFzc05hbWV9YH1cclxuICAgICAgICAgICAgICAgIG9uY2xpY2s9e29uQ2xpY2t9IGRpc2FibGVkPXtkaXNhYmxlZH0+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5fdWlfaWNvbihpY29uKX1cclxuICAgICAgICAgICAgICAgIDxzcGFuIHRoaXM9J191aV9zcGFuJz57dGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX2ljb24gPSAoaWNvbikgPT4ge1xyXG4gICAgICAgIHJldHVybiBpY29uID8gPGkgY2xhc3NOYW1lPXtgYmkgYmktJHtpY29ufSBtZS0yYH0+PC9pPiA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3NwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT0nc3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbWUtMicgLz5cclxuICAgIH1cclxuXHJcbiAgICBzdGFydExvYWRpbmcgPSAobG9hZGluZ0xhYmVsKSA9PiB7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IHRydWUsIHRleHQ6IGxvYWRpbmdMYWJlbCwgbG9hZGluZzogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmRMb2FkaW5nID0gKGxhYmVsKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoeyBkaXNhYmxlZDogZmFsc2UsIHRleHQ6IGxhYmVsLCBsb2FkaW5nOiBmYWxzZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMuX3Byb3AudGV4dCxcclxuICAgICAgICAgICAgaWNvbiA9IHRoaXMuX3Byb3AuaWNvbixcclxuICAgICAgICAgICAgdHlwZSA9IHRoaXMuX3Byb3AudHlwZSxcclxuICAgICAgICAgICAgZGlzYWJsZWQgPSB0aGlzLl9wcm9wLmRpc2FibGVkLFxyXG4gICAgICAgICAgICBsb2FkaW5nID0gdGhpcy5fcHJvcC5sb2FkaW5nLFxyXG4gICAgICAgICAgICBvbkNsaWNrID0gdGhpcy5fcHJvcC5vbkNsaWNrLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSB0aGlzLl9wcm9wLmNsYXNzTmFtZVxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAobG9hZGluZyAhPT0gdGhpcy5fcHJvcC5sb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZFRvUmVtb3ZlID0gdGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91aV9idXR0b24ucmVtb3ZlQ2hpbGQoY2hpbGRUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBsb2FkaW5nID8gdGhpcy5fdWlfc3Bpbm5lcigpIDogdGhpcy5fdWlfaWNvbihpY29uKTtcclxuICAgICAgICAgICAgY2hpbGQgJiYgdGhpcy5fdWlfYnV0dG9uLmluc2VydEJlZm9yZShjaGlsZCwgdGhpcy5fdWlfc3Bhbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpY29uICE9PSB0aGlzLl9wcm9wLmljb24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkVG9SZW1vdmUgPSB0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlc1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5yZW1vdmVDaGlsZChjaGlsZFRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuX3VpX2ljb24oaWNvbik7XHJcbiAgICAgICAgICAgIGNoaWxkICYmIHRoaXMuX3VpX2J1dHRvbi5pbnNlcnRCZWZvcmUodGhpcy5fdWlfaWNvbihpY29uKSwgdGhpcy5fdWlfc3Bhbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0ZXh0ICE9PSB0aGlzLl9wcm9wLnRleHQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3BhbkJvZHkgPSA8ZGl2Pnt0ZXh0fTwvZGl2PjtcclxuICAgICAgICAgICAgdGhpcy5fdWlfc3Bhbi5pbm5lckhUTUwgPSBzcGFuQm9keS5pbm5lckhUTUw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjbGFzc05hbWUgIT09IHRoaXMuX3Byb3AuY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5jbGFzc05hbWUgPSBgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXNhYmxlZCAhPT0gdGhpcy5fcHJvcC5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24uZGlzYWJsZWQgPSBkaXNhYmxlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9uQ2xpY2sgIT09IHRoaXMuX3Byb3Aub25DbGljaykge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24ub25jbGljayA9IG9uQ2xpY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyAuLi50aGlzLl9wcm9wLCB0ZXh0LCBpY29uLCB0eXBlLCBkaXNhYmxlZCwgbG9hZGluZywgb25DbGljaywgY2xhc3NOYW1lIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdPcHRpb24gMScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdvcHRpb24xJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB2YWx1ZSA9ICdvcHRpb24xJyxcclxuICAgICAgICAgICAgb25DaGFuZ2UgPSAodmFsdWUpID0+IHsgY29uc29sZS5sb2codmFsdWUpIH0sXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBvcHRpb25zLFxyXG4gICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgb25DaGFuZ2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHZhbHVlLCBvbkNoYW5nZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfb3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWxlY3QgdGhpcz0nX3VpX3NlbGVjdCcgY2xhc3NOYW1lPSdmb3JtLXNlbGVjdCcgb25jaGFuZ2U9e2UgPT4gb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfT5cclxuICAgICAgICAgICAgICAgIHtvcHRpb25zLm1hcChvcHRpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVpT3B0ID0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbi52YWx1ZX0gc2VsZWN0ZWQ9e3ZhbHVlID09PSBvcHRpb24udmFsdWV9PntvcHRpb24ubGFiZWx9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfb3B0aW9ucy5wdXNoKHVpT3B0KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlPcHQ7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUxhYmVscyA9IChsYWJlbHMpID0+IHtcclxuICAgICAgICBpZiAobGFiZWxzLmxlbmd0aCAhPT0gdGhpcy5fcHJvcC5vcHRpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIHNlbGVjdFxcJ3Mgb3B0aW9ucyBsYWJlbHMhXFxcclxuICAgICAgICAgICAgICAgICBMYWJlbHMgYXJyYXkgaXMgaW5jb21wYXRpYmxlIHdpdGggc2VsZWN0XFwnIG9wdGlvbnMgYXJyYXkuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX29wdGlvbnMuZm9yRWFjaCgodWlPcHRpb24sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHVpT3B0aW9uLmlubmVySFRNTCA9IGxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuICAgIF9ldmVudExpc3QgPSB7fTtcclxuXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgJ2V2ZW50MSc6IFtcclxuICAgIC8vICAgICAgICAgZjEsXHJcbiAgICAvLyAgICAgICAgIGYyXHJcbiAgICAvLyAgICAgXSxcclxuICAgIC8vICAgICAnZXZlbnQyJzogW1xyXG4gICAgLy8gICAgICAgICBmM1xyXG4gICAgLy8gICAgIF1cclxuICAgIC8vIH1cclxuXHJcbiAgICBzdWJzY3JpYmUgPSAobmFtZSwgbGlzdGVuZXIpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2V2ZW50TGlzdFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBhcmdzID0ge30pID0+IHtcclxuICAgICAgICBpZiAodGhpcy5fZXZlbnRMaXN0Lmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXS5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBjb21tb25FdmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKCk7IC8vIHNpbmdsZXRvblxyXG5leHBvcnQgeyBFdmVudE1hbmFnZXIgfTsgLy8gY2xhc3NcclxuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBjaGFuZ2VMYW5nOiAnY2hhbmdlTGFuZydcclxufSk7XHJcbiIsImltcG9ydCBTZWxlY3QgZnJvbSBcIi4uL2F0b20vc2VsZWN0XCI7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSBcIi4uL3V0aWxzL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBjb21tb25FdmVudE1hbmFnZXIgfSBmcm9tIFwiLi4vdXRpbHMvZXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4uL3V0aWxzL2V2ZW50c1wiO1xyXG5pbXBvcnQgdDluIGZyb20gXCIuLi91dGlscy90OW4vaW5kZXhcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdExhbmcge1xyXG4gICAgX2xhbmdJZHMgPSBbJ3J1JywgJ2VuJ107XHJcbiAgICBfbGFuZ1Q5bktleXMgPSBbJ3J1JywgJ2VuJ107XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF9sYW5nTGFiZWxzID0gKGxhbmdJZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sYW5nVDluS2V5cy5tYXAodDluS2V5ID0+IHQ5bihsYW5nSWQsIHQ5bktleSkpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdGhpcy5fbGFuZ0xhYmVscyhkZWZhdWx0TGFuZyk7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX2xhbmdJZHMubWFwKChsYW5nSWQsIGluZGV4KSA9PiAoe1xyXG4gICAgICAgICAgICB2YWx1ZTogbGFuZ0lkLFxyXG4gICAgICAgICAgICBsYWJlbDogbGFiZWxzW2luZGV4XVxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPFNlbGVjdCB0aGlzPSdfdWlfc2VsZWN0JyBvcHRpb25zPXtvcHRpb25zfSB2YWx1ZT17ZGVmYXVsdExhbmd9IFxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2xhbmdJZCA9PiBjb21tb25FdmVudE1hbmFnZXIuZGlzcGF0Y2goZXZlbnRzLmNoYW5nZUxhbmcsIGxhbmdJZCl9IC8+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG4gICAgICAgIGNvbnN0IGxhYmVscyA9IHRoaXMuX2xhbmdMYWJlbHMobGFuZyk7XHJcbiAgICAgICAgdGhpcy5fdWlfc2VsZWN0LnVwZGF0ZUxhYmVscyhsYWJlbHMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBTZWxlY3RMYW5nIGZyb20gJy4vc2VsZWN0TGFuZyc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcclxuaW1wb3J0IHQ5biBmcm9tICcuLi91dGlscy90OW4vaW5kZXgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgPSBmYWxzZSB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IGF1dGhvcml6ZWQgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDEgdGhpcz0nX3VpX2gxJyBjbGFzc05hbWU9J21lLTUnPnt0OW4oZGVmYXVsdExhbmcsICd0YXNrX21hbmFnZXInKX08L2gxPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8U2VsZWN0TGFuZyB0aGlzPSdfdWlfc2VsZWN0JyAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7IGF1dGhvcml6ZWQgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0aGlzPSdfdWlfYnRuJyB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPSdtcy1hdXRvJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICd0b19sb2dfb3V0Jyl9IC8+IH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhOyBcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfc2VsZWN0LnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLl91aV9oMS50ZXh0Q29udGVudCA9IHQ5bihsYW5nLCAndGFza19tYW5hZ2VyJyk7XHJcbiAgICAgICAgdGhpcy5fdWlfYnRuICYmIHRoaXMuX3VpX2J0bi51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX2xvZ19vdXQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNvbW1vbkV2ZW50TWFuYWdlciB9IGZyb20gXCIuL2V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50c1wiO1xyXG5pbXBvcnQgbG9jYWxTdG9yYWdlSXRlbXMgZnJvbSBcIi4vbG9jYWxTdG9yYWdlSXRlbXNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50TWFuYWdlciA9IGNvbW1vbkV2ZW50TWFuYWdlcikge1xyXG4gICAgICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoZXZlbnRzLmNoYW5nZUxhbmcsIGxhbmcgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh7IGxhbmcgfSk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZUl0ZW1zLmxhbmdJZCwgbGFuZyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4uL3dpZGdldC9oZWFkZXInO1xyXG5pbXBvcnQgTG9jYWxpemVkUGFnZSBmcm9tICcuL2xvY2FsaXplZFBhZ2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2l0aEhlYWRlciBleHRlbmRzIExvY2FsaXplZFBhZ2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgZWxlbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCA9IGZhbHNlIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgYXV0aG9yaXplZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2VsZW0gPSBlbGVtO1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FwcC1ib2R5Jz5cclxuICAgICAgICAgICAgICAgIDxIZWFkZXIgdGhpcz0nX3VpX2hlYWRlcicgYXV0aG9yaXplZD17YXV0aG9yaXplZH0gLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXIgY2VudGVyZWQnPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLl91aV9lbGVtfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuICAgICAgICB0aGlzLl91aV9oZWFkZXIudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3VpX2VsZW0udXBkYXRlKGRhdGEpO1xyXG4gICAgfVxyXG59O1xyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYWJlbCA9ICcnLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9ICcnLFxyXG4gICAgICAgICAgICBrZXkgPSAndW5kZWZpbmVkJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcixcclxuICAgICAgICAgICAga2V5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhYmVsLCBwbGFjZWhvbGRlciwga2V5IH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dElkID0gYGJhc2UtaW5wdXQtJHtrZXl9YDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHRoaXM9J191aV9sYWJlbCcgZm9yPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tbGFiZWwnPntsYWJlbH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHRoaXM9J191aV9pbnB1dCcgdHlwZT0ndGV4dCcgaWQ9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1jb250cm9sJyBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSB0aGlzLl9wcm9wLmxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9IHRoaXMuX3Byb3AucGxhY2Vob2xkZXJcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGxhYmVsICE9PSB0aGlzLl9wcm9wLmxhYmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2xhYmVsLnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwbGFjZWhvbGRlciAhPT0gdGhpcy5fcHJvcC5wbGFjZWhvbGRlcikge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9pbnB1dC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9wcm9wID0geyAuLi50aGlzLnByb3AsIGxhYmVsLCBwbGFjZWhvbGRlciB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9ICcnLFxyXG4gICAgICAgICAgICBocmVmID0gJycsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICB0ZXh0LFxyXG4gICAgICAgICAgICBocmVmXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBocmVmIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YSB0aGlzPSdfdWlfYScgaHJlZj17aHJlZn0+e3RleHR9PC9hPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLl9wcm9wLnRleHQsXHJcbiAgICAgICAgICAgIGhyZWYgPSB0aGlzLl9wcm9wLmhyZWZcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKHRleHQgIT09IHRoaXMuX3Byb3AudGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9hLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhyZWYgIT09IHRoaXMuX3Byb3AuaHJlZikge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9hLmhyZWYgPSBocmVmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgLi4udGhpcy5fcHJvcCwgdGV4dCwgaHJlZiB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b20vaW5wdXQnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2luQW5kUGFzc0Zvcm0ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi0zJz5cclxuICAgICAgICAgICAgICAgICAgICA8SW5wdXQgdGhpcz0nX3VpX2lucHV0X2VtYWlsJyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAnZW1haWwnKX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dDluKGRlZmF1bHRMYW5nLCAnc29tZWJvZHlfZW1haWwnKX0ga2V5PVwiZS1tYWlsXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPElucHV0IHRoaXM9J191aV9pbnB1dF9wd2QnIGxhYmVsPXt0OW4oZGVmYXVsdExhbmcsICdwYXNzd29yZCcpfSBwbGFjZWhvbGRlcj0nKioqKioqKionIGtleT1cInB3ZFwiLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9pbnB1dF9lbWFpbC51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdlbWFpbCcpLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdDluKGxhbmcsICdzb21lYm9keV9lbWFpbCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfcHdkLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ3Bhc3N3b3JkJyksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vYXRvbS9pbnB1dCc7XHJcbmltcG9ydCBMaW5rIGZyb20gJy4uL2F0b20vbGluayc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vYXRvbS9idXR0b24nO1xyXG5pbXBvcnQgTG9naW5BbmRQYXNzRm9ybSBmcm9tICcuLi93aWRnZXQvbG9naW5BbmRQYXNzRm9ybSc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnRnJvbSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nbWItNCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21iLTMnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TG9naW5BbmRQYXNzRm9ybSB0aGlzPSdfdWlfbG9naW5fYW5kX3Bhc3NfZm9ybScgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8SW5wdXQgdGhpcz0nX3VpX2lucHV0X3JlcGVhdF9wd2QnIGxhYmVsPXt0OW4oZGVmYXVsdExhbmcsICdyZXBlYXRfcGFzc3dvcmQnKX0gcGxhY2Vob2xkZXI9JyoqKioqKioqJyAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aGlzPSdfdWlfc3Bhbic+e3Q5bihkZWZhdWx0TGFuZywgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJyl9PC9zcGFuPiZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdGhpcz0nX3VpX2xpbmsnIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX2xvZ2luJyl9IGhyZWY9Jy4vbG9naW4uaHRtbCcgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0aGlzPSdfdWlfYnRuJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICd0b19yZWdpc3RlcicpfSBjbGFzc05hbWU9J3ctMTAwJyB0eXBlPSdwcmltYXJ5JyAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLl91aV9pbnB1dF9yZXBlYXRfcHdkLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ3JlcGVhdF9wYXNzd29yZCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfc3Bhbi5pbm5lckhUTUwgPSB0OW4obGFuZywgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJyk7XHJcbiAgICAgICAgdGhpcy5fdWlfbGluay51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX2xvZ2luJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9idG4udXBkYXRlKHtcclxuICAgICAgICAgICAgdGV4dDogdDluKGxhbmcsICd0b19yZWdpc3RlcicpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IFdpdGhIZWFkZXIgZnJvbSAnLi91dGlscy93aXRoSGVhZGVyJztcclxuaW1wb3J0IFJlZ0Zvcm0gZnJvbSAnLi93aWRnZXQvcmVnRm9ybSdcclxuXHJcbmNsYXNzIFJlZ1BhZ2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lci1tZCc+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWItMyc+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxIHRoaXM9J191aV9oMScgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+e3Q5bihkZWZhdWx0TGFuZywgJ3JlZ2lzdHJhdGlvbicpfTwvaDE+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxSZWdGb3JtIHRoaXM9J191aV9yZWdfZm9ybScgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9oMS5pbm5lckhUTUwgPSB0OW4obGFuZywgJ3JlZ2lzdHJhdGlvbicpO1xyXG4gICAgICAgIHRoaXMuX3VpX3JlZ19mb3JtLnVwZGF0ZShkYXRhKTtcclxuICAgIH1cclxufVxyXG5cclxubW91bnQoXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIiksXHJcbiAgICA8V2l0aEhlYWRlcj5cclxuICAgICAgICA8UmVnUGFnZSAvPlxyXG4gICAgPC9XaXRoSGVhZGVyPlxyXG4pO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInF1ZXJ5IiwibnMiLCJ0YWciLCJpZCIsImNsYXNzTmFtZSIsInBhcnNlIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiY2h1bmtzIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwidHJpbSIsImh0bWwiLCJhcmdzIiwidHlwZSIsIlF1ZXJ5IiwiRXJyb3IiLCJwYXJzZUFyZ3VtZW50c0ludGVybmFsIiwiZ2V0RWwiLCJlbCIsImV4dGVuZCIsImV4dGVuZEh0bWwiLCJiaW5kIiwiZG9Vbm1vdW50IiwiY2hpbGQiLCJjaGlsZEVsIiwicGFyZW50RWwiLCJob29rcyIsIl9fcmVkb21fbGlmZWN5Y2xlIiwiaG9va3NBcmVFbXB0eSIsInRyYXZlcnNlIiwiX19yZWRvbV9tb3VudGVkIiwidHJpZ2dlciIsInBhcmVudEhvb2tzIiwiaG9vayIsInBhcmVudE5vZGUiLCJrZXkiLCJob29rTmFtZXMiLCJzaGFkb3dSb290QXZhaWxhYmxlIiwid2luZG93IiwibW91bnQiLCJwYXJlbnQiLCJfY2hpbGQiLCJiZWZvcmUiLCJyZXBsYWNlIiwiX19yZWRvbV92aWV3Iiwid2FzTW91bnRlZCIsIm9sZFBhcmVudCIsImFwcGVuZENoaWxkIiwiZG9Nb3VudCIsImV2ZW50TmFtZSIsInZpZXciLCJob29rQ291bnQiLCJmaXJzdENoaWxkIiwibmV4dCIsIm5leHRTaWJsaW5nIiwicmVtb3VudCIsImhvb2tzRm91bmQiLCJob29rTmFtZSIsInRyaWdnZXJlZCIsIm5vZGVUeXBlIiwiTm9kZSIsIkRPQ1VNRU5UX05PREUiLCJTaGFkb3dSb290Iiwic2V0U3R5bGUiLCJhcmcxIiwiYXJnMiIsInNldFN0eWxlVmFsdWUiLCJ2YWx1ZSIsInN0eWxlIiwieGxpbmtucyIsInNldEF0dHJJbnRlcm5hbCIsImluaXRpYWwiLCJpc09iaiIsImlzU1ZHIiwiU1ZHRWxlbWVudCIsImlzRnVuYyIsInNldERhdGEiLCJzZXRYbGluayIsInNldENsYXNzTmFtZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImFkZGl0aW9uVG9DbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJiYXNlVmFsIiwic2V0QXR0cmlidXRlTlMiLCJyZW1vdmVBdHRyaWJ1dGVOUyIsImRhdGFzZXQiLCJ0ZXh0Iiwic3RyIiwiY3JlYXRlVGV4dE5vZGUiLCJhcmciLCJpc05vZGUiLCJPYmplY3QiLCJmcmVlemUiLCJsYW5nSWQiLCJkZWZhdWx0TGFuZyIsIl9sb2NhbFN0b3JhZ2UkZ2V0SXRlbSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJsb2NhbFN0b3JhZ2VJdGVtcyIsImxvYWRpbmdfbl9zZWNvbmRzX2xlZnQiLCJuIiwic2Vjb25kUG9zdGZpeCIsImxlZnRQb3N0Zml4IiwibkJldHdlZW4xMGFuZDIwIiwiaW5jbHVkZXMiLCJjb25jYXQiLCJsYW5kSWQiLCJjb2RlIiwicmVzdWx0IiwiUlUiLCJFTiIsIl9sZW4iLCJhcmd1bWVudHMiLCJBcnJheSIsIl9rZXkiLCJhcHBseSIsIkJ1dHRvbiIsIl9jcmVhdGVDbGFzcyIsIl90aGlzIiwic2V0dGluZ3MiLCJ1bmRlZmluZWQiLCJfY2xhc3NDYWxsQ2hlY2siLCJfZGVmaW5lUHJvcGVydHkiLCJfdGhpcyRfcHJvcCIsIl9wcm9wIiwiaWNvbiIsImRpc2FibGVkIiwib25DbGljayIsIm9uY2xpY2siLCJfdWlfaWNvbiIsImxvYWRpbmdMYWJlbCIsInVwZGF0ZSIsImxvYWRpbmciLCJsYWJlbCIsImRhdGEiLCJfZGF0YSR0ZXh0IiwiX2RhdGEkaWNvbiIsIl9kYXRhJHR5cGUiLCJfZGF0YSRkaXNhYmxlZCIsIl9kYXRhJGxvYWRpbmciLCJfZGF0YSRvbkNsaWNrIiwiX2RhdGEkY2xhc3NOYW1lIiwiX3VpX2J1dHRvbiIsImNoaWxkTm9kZXMiLCJjaGlsZFRvUmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJfdWlfc3Bpbm5lciIsImluc2VydEJlZm9yZSIsIl91aV9zcGFuIiwic3BhbkJvZHkiLCJpbm5lckhUTUwiLCJfb2JqZWN0U3ByZWFkIiwiX3NldHRpbmdzJHRleHQiLCJfc2V0dGluZ3MkaWNvbiIsIl9zZXR0aW5ncyR0eXBlIiwiX3NldHRpbmdzJGRpc2FibGVkIiwiX3NldHRpbmdzJG9uQ2xpY2siLCJlIiwiY29uc29sZSIsImxvZyIsInRhcmdldCIsIl9zZXR0aW5ncyRjbGFzc05hbWUiLCJfdWlfcmVuZGVyIiwiU2VsZWN0Iiwib3B0aW9ucyIsIm9uQ2hhbmdlIiwiX3VpX29wdGlvbnMiLCJvbmNoYW5nZSIsIm1hcCIsIm9wdGlvbiIsInVpT3B0Iiwic2VsZWN0ZWQiLCJwdXNoIiwibGFiZWxzIiwiZXJyb3IiLCJmb3JFYWNoIiwidWlPcHRpb24iLCJpbmRleCIsIl9zZXR0aW5ncyRvcHRpb25zIiwiX3NldHRpbmdzJHZhbHVlIiwiX3NldHRpbmdzJG9uQ2hhbmdlIiwiRXZlbnRNYW5hZ2VyIiwibmFtZSIsImxpc3RlbmVyIiwiX2V2ZW50TGlzdCIsImhhc093blByb3BlcnR5IiwiY29tbW9uRXZlbnRNYW5hZ2VyIiwiY2hhbmdlTGFuZyIsIlNlbGVjdExhbmciLCJfbGFuZ1Q5bktleXMiLCJ0OW5LZXkiLCJ0OW4iLCJfbGFuZ0xhYmVscyIsIl9sYW5nSWRzIiwiZGlzcGF0Y2giLCJldmVudHMiLCJfZGF0YSRsYW5nIiwibGFuZyIsIl91aV9zZWxlY3QiLCJ1cGRhdGVMYWJlbHMiLCJIZWFkZXIiLCJhdXRob3JpemVkIiwiX3VpX2gxIiwidGV4dENvbnRlbnQiLCJfdWlfYnRuIiwiX3NldHRpbmdzJGF1dGhvcml6ZWQiLCJfZGVmYXVsdCIsImV2ZW50TWFuYWdlciIsInN1YnNjcmliZSIsInNldEl0ZW0iLCJXaXRoSGVhZGVyIiwiX0xvY2FsaXplZFBhZ2UiLCJlbGVtIiwiX2NhbGxTdXBlciIsIl91aV9lbGVtIiwiX3VpX2hlYWRlciIsIl9pbmhlcml0cyIsIkxvY2FsaXplZFBhZ2UiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwiaW5wdXRJZCIsIl9kYXRhJGxhYmVsIiwiX2RhdGEkcGxhY2Vob2xkZXIiLCJfdWlfbGFiZWwiLCJfdWlfaW5wdXQiLCJwcm9wIiwiX3NldHRpbmdzJGxhYmVsIiwiX3NldHRpbmdzJHBsYWNlaG9sZGVyIiwiX3NldHRpbmdzJGtleSIsIkxpbmsiLCJocmVmIiwiX2RhdGEkaHJlZiIsIl91aV9hIiwiX3NldHRpbmdzJGhyZWYiLCJMb2dpbkFuZFBhc3NGb3JtIiwiX3VpX2lucHV0X2VtYWlsIiwiX3VpX2lucHV0X3B3ZCIsIlJlZ0Zyb20iLCJfdWlfbG9naW5fYW5kX3Bhc3NfZm9ybSIsIl91aV9pbnB1dF9yZXBlYXRfcHdkIiwiX3VpX2xpbmsiLCJSZWdQYWdlIiwiUmVnRm9ybSIsIl91aV9yZWdfZm9ybSIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFTQSxhQUFhQSxDQUFDQyxLQUFLLEVBQUVDLEVBQUUsRUFBRTtFQUNoQyxNQUFNO0lBQUVDLEdBQUc7SUFBRUMsRUFBRTtBQUFFQyxJQUFBQTtBQUFVLEdBQUMsR0FBR0MsS0FBSyxDQUFDTCxLQUFLLENBQUM7QUFDM0MsRUFBQSxNQUFNTSxPQUFPLEdBQUdMLEVBQUUsR0FDZE0sUUFBUSxDQUFDQyxlQUFlLENBQUNQLEVBQUUsRUFBRUMsR0FBRyxDQUFDLEdBQ2pDSyxRQUFRLENBQUNSLGFBQWEsQ0FBQ0csR0FBRyxDQUFDO0FBRS9CLEVBQUEsSUFBSUMsRUFBRSxFQUFFO0lBQ05HLE9BQU8sQ0FBQ0gsRUFBRSxHQUFHQSxFQUFFO0FBQ2pCO0FBRUEsRUFBQSxJQUFJQyxTQUFTLEVBQUU7QUFDYixJQUVPO01BQ0xFLE9BQU8sQ0FBQ0YsU0FBUyxHQUFHQSxTQUFTO0FBQy9CO0FBQ0Y7QUFFQSxFQUFBLE9BQU9FLE9BQU87QUFDaEI7QUFFQSxTQUFTRCxLQUFLQSxDQUFDTCxLQUFLLEVBQUU7QUFDcEIsRUFBQSxNQUFNUyxNQUFNLEdBQUdULEtBQUssQ0FBQ1UsS0FBSyxDQUFDLFFBQVEsQ0FBQztFQUNwQyxJQUFJTixTQUFTLEdBQUcsRUFBRTtFQUNsQixJQUFJ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
