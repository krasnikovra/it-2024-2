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
  langId: 'langId',
  token: 'token'
});

var _localStorage$getItem;
var defaultLang$1 = (_localStorage$getItem = localStorage.getItem(localStorageItems.langId)) !== null && _localStorage$getItem !== void 0 ? _localStorage$getItem : 'ru';

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
  _defineProperty(this, "start_loading", function (loadingLabel) {
    _this.update({
      disabled: true,
      text: loadingLabel,
      loading: true
    });
  });
  _defineProperty(this, "end_loading", function (label) {
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

var RU = {
  'task_manager': 'Менеджер задач',
  'login': 'Вход',
  'loading': 'Загрузка',
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
  'loading': 'Loading',
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
    }, this['_ui_label'] = el("label", {
      "for": inputId,
      className: 'form-check-label'
    }, label), el("input", {
      type: 'checkbox',
      id: inputId,
      className: 'form-check-input'
    }));
  });
  _defineProperty(this, "update", function (data) {
    var _data$label = data.label,
      label = _data$label === void 0 ? _this._prop.label : _data$label;
    if (label !== _this._prop.label) {
      _this._ui_label.textContent = label;
    }
    _this._prop = _objectSpread2(_objectSpread2({}, _this._prop), {}, {
      label: label
    });
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
      type = _this$_prop.type,
      key = _this$_prop.key;
    var inputId = "base-input-".concat(key);
    return el("div", null, this['_ui_label'] = el("label", {
      "for": inputId,
      className: 'form-label'
    }, label), this['_ui_input'] = el("input", {
      type: type,
      id: inputId,
      className: 'form-control',
      placeholder: placeholder
    }));
  });
  _defineProperty(this, "update", function (data) {
    var _data$label = data.label,
      label = _data$label === void 0 ? _this._prop.label : _data$label,
      _data$placeholder = data.placeholder,
      placeholder = _data$placeholder === void 0 ? _this._prop.placeholder : _data$placeholder,
      _data$type = data.type,
      type = _data$type === void 0 ? _this._prop.type : _data$type;
    if (label !== _this._prop.label) {
      _this._ui_label.textContent = label;
    }
    if (placeholder !== _this._prop.placeholder) {
      _this._ui_input.placeholder = placeholder;
    }
    if (type !== _this._prop.type) {
      _this._ui_input.type = type;
    }
    _this._prop = _objectSpread2(_objectSpread2({}, _this.prop), {}, {
      label: label,
      placeholder: placeholder,
      type: type
    });
  });
  _defineProperty(this, "get_value", function () {
    return _this._ui_input.value;
  });
  var _settings$label = settings.label,
    _label = _settings$label === void 0 ? '' : _settings$label,
    _settings$placeholder = settings.placeholder,
    _placeholder = _settings$placeholder === void 0 ? '' : _settings$placeholder,
    _settings$type = settings.type,
    _type = _settings$type === void 0 ? 'text' : _settings$type,
    _settings$key = settings.key,
    _key = _settings$key === void 0 ? 'undefined' : _settings$key;
  this._prop = {
    label: _label,
    placeholder: _placeholder,
    type: _type,
    key: _key
  };
  this.el = this._ui_render();
});

var EditForm = /*#__PURE__*/_createClass(function EditForm() {
  var _this = this;
  _classCallCheck(this, EditForm);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      "class": "mb-3"
    }, this['_ui_input_task_name'] = new Input({
      label: t9n(defaultLang$1, 'task_name'),
      placeholder: t9n(defaultLang$1, 'my_task'),
      key: "task-name"
    })), el("div", {
      "class": "mb-3"
    }, this['_ui_input_deadline'] = new Input({
      label: t9n(defaultLang$1, 'deadline'),
      placeholder: "01.01.2025",
      key: "deadline"
    })), el("div", {
      "class": "mb-4"
    }, this['_ui_checkbox'] = new Checkbox({
      label: t9n(defaultLang$1, 'important_task'),
      key: "important-task"
    })), el("div", {
      "class": "row"
    }, el("div", {
      "class": "col"
    }, this['_ui_btn_cancel'] = new Button({
      text: t9n(defaultLang$1, 'cancel'),
      type: "secondary",
      className: "w-100"
    })), el("div", {
      "class": "col"
    }, this['_ui_btn_save'] = new Button({
      text: t9n(defaultLang$1, 'to_save'),
      type: "primary",
      className: "w-100"
    }))));
  });
  _defineProperty(this, "update", function (data) {
    var _data$lang = data.lang,
      lang = _data$lang === void 0 ? defaultLang$1 : _data$lang;
    _this._ui_input_task_name.update({
      label: t9n(lang, 'task_name'),
      placeholder: t9n(lang, 'my_task')
    });
    _this._ui_input_deadline.update({
      label: t9n(lang, 'deadline')
    });
    _this._ui_checkbox.update({
      label: t9n(lang, 'important_task')
    });
    _this._ui_btn_cancel.update({
      text: t9n(lang, 'cancel')
    });
    _this._ui_btn_save.update({
      text: t9n(lang, 'to_save')
    });
  });
  this.el = this._ui_render();
});

var Edit = /*#__PURE__*/_createClass(function Edit() {
  var _this = this;
  _classCallCheck(this, Edit);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", {
      "class": "mb-3"
    }, this['_ui_h1'] = el("h1", {
      className: 'text-center'
    }, t9n(defaultLang$1, 'editing'))), this['_ui_edit_form'] = new EditForm({}));
  });
  _defineProperty(this, "update", function (data) {
    var _data$lang = data.lang,
      lang = _data$lang === void 0 ? defaultLang$1 : _data$lang;
    _this._ui_h1.innerHTML = t9n(lang, 'editing');
    _this._ui_edit_form.update(data);
  });
  this.el = this._ui_render();
});
mount(document.getElementById("root"), new WithHeader({
  authorized: true
}, new Edit({})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vdDluLnJ1LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vdDluLmVuLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3dpZGdldC9zZWxlY3RMYW5nLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvaGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbGl6ZWRQYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy93aXRoSGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2NoZWNrYm94LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2lucHV0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvZWRpdEZvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2VkaXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBsYW5nSWQ6ICdsYW5nSWQnLFxyXG4gICAgdG9rZW46ICd0b2tlbidcclxufSk7XHJcbiIsImltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tIFwiLi9sb2NhbFN0b3JhZ2VJdGVtc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRMYW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMubGFuZ0lkKSA/PyAncnUnO1xyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b24ge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9ICcnLFxyXG4gICAgICAgICAgICBpY29uID0gbnVsbCxcclxuICAgICAgICAgICAgdHlwZSA9ICdwcmltYXJ5JywgLy8gJ3ByaW1hcnknLCAnc2Vjb25kYXJ5J1xyXG4gICAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBvbkNsaWNrID0gKGUpID0+IHsgY29uc29sZS5sb2coXCJjbGlja2VkIGJ1dHRvblwiLCBlLnRhcmdldCk7IH0sXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgdGV4dCxcclxuICAgICAgICAgICAgaWNvbixcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgZGlzYWJsZWQsXHJcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBvbkNsaWNrLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBpY29uLCB0eXBlLCBkaXNhYmxlZCwgb25DbGljaywgY2xhc3NOYW1lIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YnV0dG9uIHRoaXM9J191aV9idXR0b24nIGNsYXNzTmFtZT17YGJ0biBidG4tJHt0eXBlfSAke2NsYXNzTmFtZX1gfVxyXG4gICAgICAgICAgICAgICAgb25jbGljaz17b25DbGlja30gZGlzYWJsZWQ9e2Rpc2FibGVkfT5cclxuICAgICAgICAgICAgICAgIHt0aGlzLl91aV9pY29uKGljb24pfVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gdGhpcz0nX3VpX3NwYW4nPnt0ZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfaWNvbiA9IChpY29uKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGljb24gPyA8aSBjbGFzc05hbWU9e2BiaSBiaS0ke2ljb259IG1lLTJgfT48L2k+IDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfc3Bpbm5lciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPSdzcGlubmVyLWJvcmRlciBzcGlubmVyLWJvcmRlci1zbSBtZS0yJyAvPlxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0X2xvYWRpbmcgPSAobG9hZGluZ0xhYmVsKSA9PiB7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IHRydWUsIHRleHQ6IGxvYWRpbmdMYWJlbCwgbG9hZGluZzogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmRfbG9hZGluZyA9IChsYWJlbCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IGZhbHNlLCB0ZXh0OiBsYWJlbCwgbG9hZGluZzogZmFsc2UgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLl9wcm9wLnRleHQsXHJcbiAgICAgICAgICAgIGljb24gPSB0aGlzLl9wcm9wLmljb24sXHJcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLl9wcm9wLnR5cGUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkID0gdGhpcy5fcHJvcC5kaXNhYmxlZCxcclxuICAgICAgICAgICAgbG9hZGluZyA9IHRoaXMuX3Byb3AubG9hZGluZyxcclxuICAgICAgICAgICAgb25DbGljayA9IHRoaXMuX3Byb3Aub25DbGljayxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gdGhpcy5fcHJvcC5jbGFzc05hbWVcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGxvYWRpbmcgIT09IHRoaXMuX3Byb3AubG9hZGluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRUb1JlbW92ZSA9IHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLnJlbW92ZUNoaWxkKGNoaWxkVG9SZW1vdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gbG9hZGluZyA/IHRoaXMuX3VpX3NwaW5uZXIoKSA6IHRoaXMuX3VpX2ljb24oaWNvbik7XHJcbiAgICAgICAgICAgIGNoaWxkICYmIHRoaXMuX3VpX2J1dHRvbi5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX3VpX3NwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaWNvbiAhPT0gdGhpcy5fcHJvcC5pY29uKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZFRvUmVtb3ZlID0gdGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91aV9idXR0b24ucmVtb3ZlQ2hpbGQoY2hpbGRUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLl91aV9pY29uKGljb24pO1xyXG4gICAgICAgICAgICBjaGlsZCAmJiB0aGlzLl91aV9idXR0b24uaW5zZXJ0QmVmb3JlKHRoaXMuX3VpX2ljb24oaWNvbiksIHRoaXMuX3VpX3NwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGV4dCAhPT0gdGhpcy5fcHJvcC50ZXh0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYW5Cb2R5ID0gPGRpdj57dGV4dH08L2Rpdj47XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX3NwYW4uaW5uZXJIVE1MID0gc3BhbkJvZHkuaW5uZXJIVE1MO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2xhc3NOYW1lICE9PSB0aGlzLl9wcm9wLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24uY2xhc3NOYW1lID0gYGJ0biBidG4tJHt0eXBlfSAke2NsYXNzTmFtZX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzYWJsZWQgIT09IHRoaXMuX3Byb3AuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvbkNsaWNrICE9PSB0aGlzLl9wcm9wLm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLm9uY2xpY2sgPSBvbkNsaWNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgLi4udGhpcy5fcHJvcCwgdGV4dCwgaWNvbiwgdHlwZSwgZGlzYWJsZWQsIGxvYWRpbmcsIG9uQ2xpY2ssIGNsYXNzTmFtZSB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBvcHRpb25zID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnT3B0aW9uIDEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnb3B0aW9uMSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgdmFsdWUgPSAnb3B0aW9uMScsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlID0gKHZhbHVlKSA9PiB7IGNvbnNvbGUubG9nKHZhbHVlKSB9LFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgb3B0aW9ucyxcclxuICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBvcHRpb25zLCB2YWx1ZSwgb25DaGFuZ2UgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX29wdGlvbnMgPSBbXTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8c2VsZWN0IHRoaXM9J191aV9zZWxlY3QnIGNsYXNzTmFtZT0nZm9ybS1zZWxlY3QnIG9uY2hhbmdlPXtlID0+IG9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX0+XHJcbiAgICAgICAgICAgICAgICB7b3B0aW9ucy5tYXAob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1aU9wdCA9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb24udmFsdWV9IHNlbGVjdGVkPXt2YWx1ZSA9PT0gb3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpX29wdGlvbnMucHVzaCh1aU9wdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpT3B0O1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMYWJlbHMgPSAobGFiZWxzKSA9PiB7XHJcbiAgICAgICAgaWYgKGxhYmVscy5sZW5ndGggIT09IHRoaXMuX3Byb3Aub3B0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHVwZGF0ZSBzZWxlY3RcXCdzIG9wdGlvbnMgbGFiZWxzIVxcXHJcbiAgICAgICAgICAgICAgICAgTGFiZWxzIGFycmF5IGlzIGluY29tcGF0aWJsZSB3aXRoIHNlbGVjdFxcJyBvcHRpb25zIGFycmF5LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91aV9vcHRpb25zLmZvckVhY2goKHVpT3B0aW9uLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB1aU9wdGlvbi5pbm5lckhUTUwgPSBsYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIEV2ZW50TWFuYWdlciB7XHJcbiAgICBfZXZlbnRMaXN0ID0ge307XHJcblxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgICdldmVudDEnOiBbXHJcbiAgICAvLyAgICAgICAgIGYxLFxyXG4gICAgLy8gICAgICAgICBmMlxyXG4gICAgLy8gICAgIF0sXHJcbiAgICAvLyAgICAgJ2V2ZW50Mic6IFtcclxuICAgIC8vICAgICAgICAgZjNcclxuICAgIC8vICAgICBdXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc3Vic2NyaWJlID0gKG5hbWUsIGxpc3RlbmVyKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9ldmVudExpc3RbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0ucHVzaChsaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2ggPSAobmFtZSwgYXJncyA9IHt9KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TGlzdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0uZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGFyZ3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgY29tbW9uRXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcigpOyAvLyBzaW5nbGV0b25cclxuZXhwb3J0IHsgRXZlbnRNYW5hZ2VyIH07IC8vIGNsYXNzXHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgY2hhbmdlTGFuZzogJ2NoYW5nZUxhbmcnXHJcbn0pO1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAndGFza19tYW5hZ2VyJzogJ9Cc0LXQvdC10LTQttC10YAg0LfQsNC00LDRhycsXHJcbiAgICAnbG9naW4nOiAn0JLRhdC+0LQnLFxyXG4gICAgJ2xvYWRpbmcnOiAn0JfQsNCz0YDRg9C30LrQsCcsXHJcbiAgICAnbG9hZGluZ19uX3NlY29uZHNfbGVmdCc6IG4gPT4ge1xyXG4gICAgICAgIGxldCBzZWNvbmRQb3N0Zml4ID0gJyc7XHJcbiAgICAgICAgbGV0IGxlZnRQb3N0Zml4ID0gJ9C+0YHRjCc7XHJcbiAgICAgICAgY29uc3QgbkJldHdlZW4xMGFuZDIwID0gbiA+IDEwICYmIG4gPCAyMDtcclxuICAgICAgICBpZiAobiAlIDEwID09PSAxICYmICFuQmV0d2VlbjEwYW5kMjApIHtcclxuICAgICAgICAgICAgc2Vjb25kUG9zdGZpeCA9ICfQsCc7XHJcbiAgICAgICAgICAgIGxlZnRQb3N0Zml4ID0gJ9Cw0YHRjCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFsyLCAzLCA0XS5pbmNsdWRlcyhuICUgMTApICYmICFuQmV0d2VlbjEwYW5kMjApIHtcclxuICAgICAgICAgICAgc2Vjb25kUG9zdGZpeCA9ICfRiyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYNCX0LDQs9GA0YPQt9C60LAuLi4gKNCe0YHRgtCw0Lske2xlZnRQb3N0Zml4fSAke259INGB0LXQutGD0L3QtCR7c2Vjb25kUG9zdGZpeH0pYDtcclxuICAgIH0sXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ9Cf0LDRgNC+0LvRjCcsXHJcbiAgICAndG9fbG9naW4nOiAn0JLQvtC50YLQuCcsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAn0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPJyxcclxuICAgICdub19hY2NvdW50X3F1ZXN0aW9uJzogJ9Cd0LXRgiDQsNC60LrQsNGD0L3RgtCwPycsXHJcbiAgICAndG9fbG9nX291dCc6ICfQktGL0LnRgtC4JyxcclxuICAgICdyZWdpc3RyYXRpb24nOiAn0KDQtdCz0LjRgdGC0YDQsNGG0LjRjycsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ9Cf0L7QstGC0L7RgNC40YLQtSDQv9Cw0YDQvtC70YwnLFxyXG4gICAgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJzogJ9Cj0LbQtSDQtdGB0YLRjCDQsNC60LrQsNGD0L3Rgj8nLFxyXG4gICAgJ2VkaXRpbmcnOiAn0KDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtScsXHJcbiAgICAndGFza19uYW1lJzogJ9Cd0LDQt9Cy0LDQvdC40LUg0LfQsNC00LDRh9C4JyxcclxuICAgICdteV90YXNrJzogJ9Cc0L7RjyDQt9Cw0LTQsNGH0LAnLFxyXG4gICAgJ2RlYWRsaW5lJzogJ9CU0LXQtNC70LDQudC9JyxcclxuICAgICdpbXBvcnRhbnRfdGFzayc6ICfQktCw0LbQvdCw0Y8g0LfQsNC00LDRh9CwJyxcclxuICAgICdjYW5jZWwnOiAn0J7RgtC80LXQvdCwJyxcclxuICAgICd0b19zYXZlJzogJ9Ch0L7RhdGA0LDQvdC40YLRjCcsXHJcbiAgICAncnUnOiAn0KDRg9GB0YHQutC40LknLFxyXG4gICAgJ2VuJzogJ9CQ0L3Qs9C70LjQudGB0LrQuNC5J1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAndGFza19tYW5hZ2VyJzogJ1Rhc2sgbWFuYWdlcicsXHJcbiAgICAnbG9naW4nOiAnTG9naW4nLFxyXG4gICAgJ2xvYWRpbmcnOiAnTG9hZGluZycsXHJcbiAgICAnbG9hZGluZ19uX3NlY29uZHNfbGVmdCc6IG4gPT4gYExvYWRpbmcuLi4gKCR7bn0gc2Vjb25kJHtuICUgMTAgPT09IDEgPyAnJyA6ICdzJ30gbGVmdClgLFxyXG4gICAgJ2VtYWlsJzogJ0UtbWFpbCcsXHJcbiAgICAnc29tZWJvZHlfZW1haWwnOiAnc29tZWJvZHlAZ21haWwuY29tJyxcclxuICAgICdwYXNzd29yZCc6ICdQYXNzd29yZCcsXHJcbiAgICAndG9fbG9naW4nOiAnTG9nIGluJyxcclxuICAgICd0b19yZWdpc3Rlcic6ICdSZWdpc3RlcicsXHJcbiAgICAnbm9fYWNjb3VudF9xdWVzdGlvbic6ICdObyBhY2NvdW50PycsXHJcbiAgICAndG9fbG9nX291dCc6ICdMb2cgb3V0JyxcclxuICAgICdyZWdpc3RyYXRpb24nOiAnUmVnaXN0cmF0aW9uJyxcclxuICAgICdyZXBlYXRfcGFzc3dvcmQnOiAnUmVwZWF0IHBhc3N3b3JkJyxcclxuICAgICdhbHJlYWR5X2hhdmVfYWNjb3VudF9xdWVzdGlvbic6ICdIYXZlIGdvdCBhbiBhY2NvdW50PycsXHJcbiAgICAnZWRpdGluZyc6ICdFZGl0aW5nJyxcclxuICAgICd0YXNrX25hbWUnOiAnVGFzayBuYW1lJyxcclxuICAgICdteV90YXNrJzogJ015IHRhc2snLFxyXG4gICAgJ2RlYWRsaW5lJzogJ0RlYWRsaW5lJyxcclxuICAgICdpbXBvcnRhbnRfdGFzayc6ICdJbXBvcnRhbnQgdGFzaycsXHJcbiAgICAnY2FuY2VsJzogJ0NhbmNlbCcsXHJcbiAgICAndG9fc2F2ZSc6ICdTYXZlJyxcclxuICAgICdydSc6ICdSdXNzaWFuJyxcclxuICAgICdlbic6ICdFbmdsaXNoJyxcclxufTtcclxuIiwiaW1wb3J0IFJVIGZyb20gJy4vdDluLnJ1JztcclxuaW1wb3J0IEVOIGZyb20gJy4vdDluLmVuJztcclxuXHJcbmZ1bmN0aW9uIHVzZVRhZyhodG1sRWwsIHRhZykge1xyXG4gICAgbGV0IHJlc3VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgIGlmICh0eXBlb2YgaHRtbEVsID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJlc3VsdC5pbm5lckhUTUwgPSBodG1sRWw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdC5hcHBlbmRDaGlsZChodG1sRWwpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gdXNlVGFncyhodG1sRWwsIHRhZ3MpIHtcclxuICAgIGxldCByZXN1bHQgPSBodG1sRWw7XHJcbiAgICB0YWdzLmZvckVhY2godGFnID0+IHJlc3VsdCA9IHVzZVRhZyhyZXN1bHQsIHRhZykpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKGxhbmRJZCwgY29kZSwgdGFnLCAuLi5hcmdzKSA9PiB7XHJcbiAgICBpZiAoY29kZSA9PSBudWxsIHx8IGNvZGUubGVuZ3RoID09PSAwKSByZXR1cm4gJyc7XHJcblxyXG4gICAgaWYgKCFbJ3J1JywgJ2VuJ10uaW5jbHVkZXMobGFuZElkKSkge1xyXG4gICAgICAgIGxhbmRJZCA9ICdydSc7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IGNvZGU7XHJcblxyXG4gICAgaWYgKGxhbmRJZCA9PT0gJ3J1JyAmJiBSVVtjb2RlXSkge1xyXG4gICAgICAgIHJlc3VsdCA9IFJVW2NvZGVdO1xyXG4gICAgfVxyXG4gICAgaWYgKGxhbmRJZCA9PT0gJ2VuJyAmJiBFTltjb2RlXSkge1xyXG4gICAgICAgIHJlc3VsdCA9IEVOW2NvZGVdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0KC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWcpIHtcclxuICAgICAgICBpZiAodGFnIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdXNlVGFncyhyZXN1bHQsIHRhZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdXNlVGFnKHJlc3VsdCwgdGFnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4iLCJpbXBvcnQgU2VsZWN0IGZyb20gXCIuLi9hdG9tL3NlbGVjdFwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gXCIuLi91dGlscy9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgY29tbW9uRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL2V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuLi91dGlscy9ldmVudHNcIjtcclxuaW1wb3J0IHQ5biBmcm9tIFwiLi4vdXRpbHMvdDluL2luZGV4XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RMYW5nIHtcclxuICAgIF9sYW5nSWRzID0gWydydScsICdlbiddO1xyXG4gICAgX2xhbmdUOW5LZXlzID0gWydydScsICdlbiddO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfbGFuZ0xhYmVscyA9IChsYW5nSWQpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGFuZ1Q5bktleXMubWFwKHQ5bktleSA9PiB0OW4obGFuZ0lkLCB0OW5LZXkpKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxhYmVscyA9IHRoaXMuX2xhbmdMYWJlbHMoZGVmYXVsdExhbmcpO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9sYW5nSWRzLm1hcCgobGFuZ0lkLCBpbmRleCkgPT4gKHtcclxuICAgICAgICAgICAgdmFsdWU6IGxhbmdJZCxcclxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsc1tpbmRleF1cclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxTZWxlY3QgdGhpcz0nX3VpX3NlbGVjdCcgb3B0aW9ucz17b3B0aW9uc30gdmFsdWU9e2RlZmF1bHRMYW5nfSBcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtsYW5nSWQgPT4gY29tbW9uRXZlbnRNYW5hZ2VyLmRpc3BhdGNoKGV2ZW50cy5jaGFuZ2VMYW5nLCBsYW5nSWQpfSAvPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLl9sYW5nTGFiZWxzKGxhbmcpO1xyXG4gICAgICAgIHRoaXMuX3VpX3NlbGVjdC51cGRhdGVMYWJlbHMobGFiZWxzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vYXRvbS9idXR0b24nO1xyXG5pbXBvcnQgU2VsZWN0TGFuZyBmcm9tICcuL3NlbGVjdExhbmcnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkID0gZmFsc2UgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyBhdXRob3JpemVkIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGgxIHRoaXM9J191aV9oMScgY2xhc3NOYW1lPSdtZS01Jz57dDluKGRlZmF1bHRMYW5nLCAndGFza19tYW5hZ2VyJyl9PC9oMT5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPFNlbGVjdExhbmcgdGhpcz0nX3VpX3NlbGVjdCcgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgeyBhdXRob3JpemVkICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdGhpcz0nX3VpX2J0bicgdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT0nbXMtYXV0bycgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAndG9fbG9nX291dCcpfSAvPiB9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTsgXHJcblxyXG4gICAgICAgIHRoaXMuX3VpX3NlbGVjdC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfaDEudGV4dENvbnRlbnQgPSB0OW4obGFuZywgJ3Rhc2tfbWFuYWdlcicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2J0biAmJiB0aGlzLl91aV9idG4udXBkYXRlKHtcclxuICAgICAgICAgICAgdGV4dDogdDluKGxhbmcsICd0b19sb2dfb3V0JylcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjb21tb25FdmVudE1hbmFnZXIgfSBmcm9tIFwiLi9ldmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IGxvY2FsU3RvcmFnZUl0ZW1zIGZyb20gXCIuL2xvY2FsU3RvcmFnZUl0ZW1zXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihldmVudE1hbmFnZXIgPSBjb21tb25FdmVudE1hbmFnZXIpIHtcclxuICAgICAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKGV2ZW50cy5jaGFuZ2VMYW5nLCBsYW5nID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoeyBsYW5nIH0pO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShsb2NhbFN0b3JhZ2VJdGVtcy5sYW5nSWQsIGxhbmcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEhlYWRlciBmcm9tICcuLi93aWRnZXQvaGVhZGVyJztcclxuaW1wb3J0IExvY2FsaXplZFBhZ2UgZnJvbSAnLi9sb2NhbGl6ZWRQYWdlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdpdGhIZWFkZXIgZXh0ZW5kcyBMb2NhbGl6ZWRQYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIGVsZW0pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgPSBmYWxzZSB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIGF1dGhvcml6ZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl91aV9lbGVtID0gZWxlbTtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhcHAtYm9keSc+XHJcbiAgICAgICAgICAgICAgICA8SGVhZGVyIHRoaXM9J191aV9oZWFkZXInIGF1dGhvcml6ZWQ9e2F1dGhvcml6ZWR9IC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyIGNlbnRlcmVkJz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5fdWlfZWxlbX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5fdWlfaGVhZGVyLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLl91aV9lbGVtLnVwZGF0ZShkYXRhKTtcclxuICAgIH1cclxufTtcclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlY2tib3gge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSAnJyxcclxuICAgICAgICAgICAga2V5ID0gJ3VuZGVmaW5lZCcsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgICAga2V5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhYmVsLCBrZXkgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYmFzZS1jaGVjay0ke2tleX1gO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9J2Zvcm0tY2hlY2snPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHRoaXM9J191aV9sYWJlbCcgZm9yPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tY2hlY2stbGFiZWwnPntsYWJlbH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J2NoZWNrYm94JyBpZD17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNoZWNrLWlucHV0JyAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5fcHJvcC5sYWJlbCxcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGxhYmVsICE9PSB0aGlzLl9wcm9wLmxhYmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2xhYmVsLnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyAuLi50aGlzLl9wcm9wLCBsYWJlbCB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJycsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJycsXHJcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCcsXHJcbiAgICAgICAgICAgIGtleSA9ICd1bmRlZmluZWQnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgbGFiZWwsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBrZXlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFiZWwsIHBsYWNlaG9sZGVyLCB0eXBlLCBrZXkgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYmFzZS1pbnB1dC0ke2tleX1gO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgdGhpcz0nX3VpX2xhYmVsJyBmb3I9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1sYWJlbCc+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdGhpcz0nX3VpX2lucHV0JyB0eXBlPXt0eXBlfSBpZD17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNvbnRyb2wnIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYWJlbCA9IHRoaXMuX3Byb3AubGFiZWwsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gdGhpcy5fcHJvcC5wbGFjZWhvbGRlcixcclxuICAgICAgICAgICAgdHlwZSA9IHRoaXMuX3Byb3AudHlwZVxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAobGFiZWwgIT09IHRoaXMuX3Byb3AubGFiZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfbGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyICE9PSB0aGlzLl9wcm9wLnBsYWNlaG9sZGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2lucHV0LnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlICE9PSB0aGlzLl9wcm9wLnR5cGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfaW5wdXQudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IC4uLnRoaXMucHJvcCwgbGFiZWwsIHBsYWNlaG9sZGVyLCB0eXBlIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0X3ZhbHVlID0gKCkgPT4gdGhpcy5fdWlfaW5wdXQudmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2F0b20vYnV0dG9uJztcclxuaW1wb3J0IENoZWNrYm94IGZyb20gJy4uL2F0b20vY2hlY2tib3gnO1xyXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vYXRvbS9pbnB1dCc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdEZvcm0ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPElucHV0IHRoaXM9J191aV9pbnB1dF90YXNrX25hbWUnIGxhYmVsPXt0OW4oZGVmYXVsdExhbmcsICd0YXNrX25hbWUnKX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0OW4oZGVmYXVsdExhbmcsICdteV90YXNrJyl9IGtleT1cInRhc2stbmFtZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPElucHV0IHRoaXM9J191aV9pbnB1dF9kZWFkbGluZScgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ2RlYWRsaW5lJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiMDEuMDEuMjAyNVwiIGtleT1cImRlYWRsaW5lXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1iLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Q2hlY2tib3ggdGhpcz0nX3VpX2NoZWNrYm94JyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAnaW1wb3J0YW50X3Rhc2snKX0ga2V5PVwiaW1wb3J0YW50LXRhc2tcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idG5fY2FuY2VsJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICdjYW5jZWwnKX0gdHlwZT1cInNlY29uZGFyeVwiIGNsYXNzTmFtZT1cInctMTAwXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdGhpcz0nX3VpX2J0bl9zYXZlJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICd0b19zYXZlJyl9IHR5cGU9XCJwcmltYXJ5XCIgY2xhc3NOYW1lPVwidy0xMDBcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9pbnB1dF90YXNrX25hbWUudXBkYXRlKHtcclxuICAgICAgICAgICAgbGFiZWw6IHQ5bihsYW5nLCAndGFza19uYW1lJyksXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiB0OW4obGFuZywgJ215X3Rhc2snKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2lucHV0X2RlYWRsaW5lLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ2RlYWRsaW5lJyksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfY2hlY2tib3gudXBkYXRlKHtcclxuICAgICAgICAgICAgbGFiZWw6IHQ5bihsYW5nLCAnaW1wb3J0YW50X3Rhc2snKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2J0bl9jYW5jZWwudXBkYXRlKHtcclxuICAgICAgICAgICAgdGV4dDogdDluKGxhbmcsICdjYW5jZWwnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2J0bl9zYXZlLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fc2F2ZScpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzXCI7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSBcIi4vdXRpbHMvY29uc3RhbnRzLmpzXCI7XHJcbmltcG9ydCBXaXRoSGVhZGVyIGZyb20gXCIuL3V0aWxzL3dpdGhIZWFkZXIuanNcIjtcclxuaW1wb3J0IEVkaXRGb3JtIGZyb20gXCIuL3dpZGdldC9lZGl0Rm9ybS5qc1wiO1xyXG5pbXBvcnQgdDluIGZyb20gXCIuL3V0aWxzL3Q5bi9pbmRleC5qc1wiO1xyXG5cclxuY2xhc3MgRWRpdCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1iLTNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDEgdGhpcz0nX3VpX2gxJyBjbGFzc05hbWU9J3RleHQtY2VudGVyJz57dDluKGRlZmF1bHRMYW5nLCAnZWRpdGluZycpfTwvaDE+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxFZGl0Rm9ybSB0aGlzPSdfdWlfZWRpdF9mb3JtJyAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2gxLmlubmVySFRNTCA9IHQ5bihsYW5nLCAnZWRpdGluZycpO1xyXG4gICAgICAgIHRoaXMuX3VpX2VkaXRfZm9ybS51cGRhdGUoZGF0YSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vdW50KFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpLFxyXG4gICAgPFdpdGhIZWFkZXIgYXV0aG9yaXplZD5cclxuICAgICAgPEVkaXQvPlxyXG4gICAgPC9XaXRoSGVhZGVyPlxyXG4pO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlRWxlbWVudCIsInF1ZXJ5IiwibnMiLCJ0YWciLCJpZCIsImNsYXNzTmFtZSIsInBhcnNlIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwiY2h1bmtzIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwidHJpbSIsImh0bWwiLCJhcmdzIiwidHlwZSIsIlF1ZXJ5IiwiRXJyb3IiLCJwYXJzZUFyZ3VtZW50c0ludGVybmFsIiwiZ2V0RWwiLCJlbCIsImV4dGVuZCIsImV4dGVuZEh0bWwiLCJiaW5kIiwiZG9Vbm1vdW50IiwiY2hpbGQiLCJjaGlsZEVsIiwicGFyZW50RWwiLCJob29rcyIsIl9fcmVkb21fbGlmZWN5Y2xlIiwiaG9va3NBcmVFbXB0eSIsInRyYXZlcnNlIiwiX19yZWRvbV9tb3VudGVkIiwidHJpZ2dlciIsInBhcmVudEhvb2tzIiwiaG9vayIsInBhcmVudE5vZGUiLCJrZXkiLCJob29rTmFtZXMiLCJzaGFkb3dSb290QXZhaWxhYmxlIiwid2luZG93IiwibW91bnQiLCJwYXJlbnQiLCJfY2hpbGQiLCJiZWZvcmUiLCJyZXBsYWNlIiwiX19yZWRvbV92aWV3Iiwid2FzTW91bnRlZCIsIm9sZFBhcmVudCIsImFwcGVuZENoaWxkIiwiZG9Nb3VudCIsImV2ZW50TmFtZSIsInZpZXciLCJob29rQ291bnQiLCJmaXJzdENoaWxkIiwibmV4dCIsIm5leHRTaWJsaW5nIiwicmVtb3VudCIsImhvb2tzRm91bmQiLCJob29rTmFtZSIsInRyaWdnZXJlZCIsIm5vZGVUeXBlIiwiTm9kZSIsIkRPQ1VNRU5UX05PREUiLCJTaGFkb3dSb290Iiwic2V0U3R5bGUiLCJhcmcxIiwiYXJnMiIsInNldFN0eWxlVmFsdWUiLCJ2YWx1ZSIsInN0eWxlIiwieGxpbmtucyIsInNldEF0dHJJbnRlcm5hbCIsImluaXRpYWwiLCJpc09iaiIsImlzU1ZHIiwiU1ZHRWxlbWVudCIsImlzRnVuYyIsInNldERhdGEiLCJzZXRYbGluayIsInNldENsYXNzTmFtZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImFkZGl0aW9uVG9DbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJiYXNlVmFsIiwic2V0QXR0cmlidXRlTlMiLCJyZW1vdmVBdHRyaWJ1dGVOUyIsImRhdGFzZXQiLCJ0ZXh0Iiwic3RyIiwiY3JlYXRlVGV4dE5vZGUiLCJhcmciLCJpc05vZGUiLCJPYmplY3QiLCJmcmVlemUiLCJsYW5nSWQiLCJ0b2tlbiIsImRlZmF1bHRMYW5nIiwiX2xvY2FsU3RvcmFnZSRnZXRJdGVtIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImxvY2FsU3RvcmFnZUl0ZW1zIiwiQnV0dG9uIiwiX2NyZWF0ZUNsYXNzIiwiX3RoaXMiLCJzZXR0aW5ncyIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIl9jbGFzc0NhbGxDaGVjayIsIl9kZWZpbmVQcm9wZXJ0eSIsIl90aGlzJF9wcm9wIiwiX3Byb3AiLCJpY29uIiwiZGlzYWJsZWQiLCJvbkNsaWNrIiwiY29uY2F0Iiwib25jbGljayIsIl91aV9pY29uIiwibG9hZGluZ0xhYmVsIiwidXBkYXRlIiwibG9hZGluZyIsImxhYmVsIiwiZGF0YSIsIl9kYXRhJHRleHQiLCJfZGF0YSRpY29uIiwiX2RhdGEkdHlwZSIsIl9kYXRhJGRpc2FibGVkIiwiX2RhdGEkbG9hZGluZyIsIl9kYXRhJG9uQ2xpY2siLCJfZGF0YSRjbGFzc05hbWUiLCJfdWlfYnV0dG9uIiwiY2hpbGROb2RlcyIsImNoaWxkVG9SZW1vdmUiLCJyZW1vdmVDaGlsZCIsIl91aV9zcGlubmVyIiwiaW5zZXJ0QmVmb3JlIiwiX3VpX3NwYW4iLCJzcGFuQm9keSIsImlubmVySFRNTCIsIl9vYmplY3RTcHJlYWQiLCJfc2V0dGluZ3MkdGV4dCIsIl9zZXR0aW5ncyRpY29uIiwiX3NldHRpbmdzJHR5cGUiLCJfc2V0dGluZ3MkZGlzYWJsZWQiLCJfc2V0dGluZ3Mkb25DbGljayIsImUiLCJjb25zb2xlIiwibG9nIiwidGFyZ2V0IiwiX3NldHRpbmdzJGNsYXNzTmFtZSIsIl91aV9yZW5kZXIiLCJTZWxlY3QiLCJvcHRpb25zIiwib25DaGFuZ2UiLCJfdWlfb3B0aW9ucyIsIm9uY2hhbmdlIiwibWFwIiwib3B0aW9uIiwidWlPcHQiLCJzZWxlY3RlZCIsInB1c2giLCJsYWJlbHMiLCJlcnJvciIsImZvckVhY2giLCJ1aU9wdGlvbiIsImluZGV4IiwiX3NldHRpbmdzJG9wdGlvbnMiLCJfc2V0dGluZ3MkdmFsdWUiLCJfc2V0dGluZ3Mkb25DaGFuZ2UiLCJFdmVudE1hbmFnZXIiLCJuYW1lIiwibGlzdGVuZXIiLCJfZXZlbnRMaXN0IiwiaGFzT3duUHJvcGVydHkiLCJjb21tb25FdmVudE1hbmFnZXIiLCJjaGFuZ2VMYW5nIiwibG9hZGluZ19uX3NlY29uZHNfbGVmdCIsIm4iLCJzZWNvbmRQb3N0Zml4IiwibGVmdFBvc3RmaXgiLCJuQmV0d2VlbjEwYW5kMjAiLCJpbmNsdWRlcyIsImxhbmRJZCIsImNvZGUiLCJyZXN1bHQiLCJSVSIsIkVOIiwiX2xlbiIsIkFycmF5IiwiX2tleSIsImFwcGx5IiwiU2VsZWN0TGFuZyIsIl9sYW5nVDluS2V5cyIsInQ5bktleSIsInQ5biIsIl9sYW5nTGFiZWxzIiwiX2xhbmdJZHMiLCJkaXNwYXRjaCIsImV2ZW50cyIsIl9kYXRhJGxhbmciLCJsYW5nIiwiX3VpX3NlbGVjdCIsInVwZGF0ZUxhYmVscyIsIkhlYWRlciIsImF1dGhvcml6ZWQiLCJfdWlfaDEiLCJ0ZXh0Q29udGVudCIsIl91aV9idG4iLCJfc2V0dGluZ3MkYXV0aG9yaXplZCIsIl9kZWZhdWx0IiwiZXZlbnRNYW5hZ2VyIiwic3Vic2NyaWJlIiwic2V0SXRlbSIsIldpdGhIZWFkZXIiLCJfTG9jYWxpemVkUGFnZSIsImVsZW0iLCJfY2FsbFN1cGVyIiwiX3VpX2VsZW0iLCJfdWlfaGVhZGVyIiwiX2luaGVyaXRzIiwiTG9jYWxpemVkUGFnZSIsIkNoZWNrYm94IiwiaW5wdXRJZCIsIl9kYXRhJGxhYmVsIiwiX3VpX2xhYmVsIiwiX3NldHRpbmdzJGxhYmVsIiwiX3NldHRpbmdzJGtleSIsIklucHV0IiwicGxhY2Vob2xkZXIiLCJfZGF0YSRwbGFjZWhvbGRlciIsIl91aV9pbnB1dCIsInByb3AiLCJfc2V0dGluZ3MkcGxhY2Vob2xkZXIiLCJFZGl0Rm9ybSIsIl91aV9pbnB1dF90YXNrX25hbWUiLCJfdWlfaW5wdXRfZGVhZGxpbmUiLCJfdWlfY2hlY2tib3giLCJfdWlfYnRuX2NhbmNlbCIsIl91aV9idG5fc2F2ZSIsIkVkaXQiLCJfdWlfZWRpdF9mb3JtIiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFNBQVNBLGFBQWFBLENBQUNDLEtBQUssRUFBRUMsRUFBRSxFQUFFO0VBQ2hDLE1BQU07SUFBRUMsR0FBRztJQUFFQyxFQUFFO0FBQUVDLElBQUFBO0FBQVUsR0FBQyxHQUFHQyxLQUFLLENBQUNMLEtBQUssQ0FBQztBQUMzQyxFQUFB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
