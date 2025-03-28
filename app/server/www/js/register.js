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
      type: 'password',
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
  _defineProperty(this, "get_login", function () {
    return _this._ui_input_email.get_value();
  });
  _defineProperty(this, "get_password", function () {
    return _this._ui_input_pwd.get_value();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxTdG9yYWdlSXRlbXMuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2NvbnN0YW50cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5ydS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5lbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvc2VsZWN0TGFuZy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2hlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxpemVkUGFnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvd2l0aEhlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9pbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9saW5rLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvbG9naW5BbmRQYXNzRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L3JlZ0Zvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3JlZ2lzdGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKSB7XG4gIGNvbnN0IHsgdGFnLCBpZCwgY2xhc3NOYW1lIH0gPSBwYXJzZShxdWVyeSk7XG4gIGNvbnN0IGVsZW1lbnQgPSBuc1xuICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCB0YWcpXG4gICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cbiAgaWYgKGlkKSB7XG4gICAgZWxlbWVudC5pZCA9IGlkO1xuICB9XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGlmIChucykge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZnVuY3Rpb24gcGFyc2UocXVlcnkpIHtcbiAgY29uc3QgY2h1bmtzID0gcXVlcnkuc3BsaXQoLyhbLiNdKS8pO1xuICBsZXQgY2xhc3NOYW1lID0gXCJcIjtcbiAgbGV0IGlkID0gXCJcIjtcblxuICBmb3IgKGxldCBpID0gMTsgaSA8IGNodW5rcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHN3aXRjaCAoY2h1bmtzW2ldKSB7XG4gICAgICBjYXNlIFwiLlwiOlxuICAgICAgICBjbGFzc05hbWUgKz0gYCAke2NodW5rc1tpICsgMV19YDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCIjXCI6XG4gICAgICAgIGlkID0gY2h1bmtzW2kgKyAxXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNsYXNzTmFtZTogY2xhc3NOYW1lLnRyaW0oKSxcbiAgICB0YWc6IGNodW5rc1swXSB8fCBcImRpdlwiLFxuICAgIGlkLFxuICB9O1xufVxuXG5mdW5jdGlvbiBodG1sKHF1ZXJ5LCAuLi5hcmdzKSB7XG4gIGxldCBlbGVtZW50O1xuXG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgcXVlcnk7XG5cbiAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChxdWVyeSk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IFF1ZXJ5KC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5jb25zdCBlbCA9IGh0bWw7XG5jb25zdCBoID0gaHRtbDtcblxuaHRtbC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRIdG1sKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGh0bWwuYmluZCh0aGlzLCAuLi5hcmdzKTtcbn07XG5cbmZ1bmN0aW9uIHVubW91bnQocGFyZW50LCBfY2hpbGQpIHtcbiAgbGV0IGNoaWxkID0gX2NoaWxkO1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZEVsLnBhcmVudE5vZGUpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKTtcblxuICAgIHBhcmVudEVsLnJlbW92ZUNoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsKSB7XG4gIGNvbnN0IGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoaG9va3NBcmVFbXB0eShob29rcykpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRyYXZlcnNlID0gcGFyZW50RWw7XG5cbiAgaWYgKGNoaWxkRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgdHJpZ2dlcihjaGlsZEVsLCBcIm9udW5tb3VudFwiKTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgfHwge307XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIGlmIChwYXJlbnRIb29rc1tob29rXSkge1xuICAgICAgICBwYXJlbnRIb29rc1tob29rXSAtPSBob29rc1tob29rXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaG9va3NBcmVFbXB0eShwYXJlbnRIb29rcykpIHtcbiAgICAgIHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cmF2ZXJzZSA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaG9va3NBcmVFbXB0eShob29rcykge1xuICBpZiAoaG9va3MgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2tzW2tleV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qIGdsb2JhbCBOb2RlLCBTaGFkb3dSb290ICovXG5cblxuY29uc3QgaG9va05hbWVzID0gW1wib25tb3VudFwiLCBcIm9ucmVtb3VudFwiLCBcIm9udW5tb3VudFwiXTtcbmNvbnN0IHNoYWRvd1Jvb3RBdmFpbGFibGUgPVxuICB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIFwiU2hhZG93Um9vdFwiIGluIHdpbmRvdztcblxuZnVuY3Rpb24gbW91bnQocGFyZW50LCBfY2hpbGQsIGJlZm9yZSwgcmVwbGFjZSkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX3ZpZXcgPSBjaGlsZDtcbiAgfVxuXG4gIGNvbnN0IHdhc01vdW50ZWQgPSBjaGlsZEVsLl9fcmVkb21fbW91bnRlZDtcbiAgY29uc3Qgb2xkUGFyZW50ID0gY2hpbGRFbC5wYXJlbnROb2RlO1xuXG4gIGlmICh3YXNNb3VudGVkICYmIG9sZFBhcmVudCAhPT0gcGFyZW50RWwpIHtcbiAgICBkb1VubW91bnQoY2hpbGQsIGNoaWxkRWwsIG9sZFBhcmVudCk7XG4gIH1cblxuICBpZiAoYmVmb3JlICE9IG51bGwpIHtcbiAgICBpZiAocmVwbGFjZSkge1xuICAgICAgY29uc3QgYmVmb3JlRWwgPSBnZXRFbChiZWZvcmUpO1xuXG4gICAgICBpZiAoYmVmb3JlRWwuX19yZWRvbV9tb3VudGVkKSB7XG4gICAgICAgIHRyaWdnZXIoYmVmb3JlRWwsIFwib251bm1vdW50XCIpO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnRFbC5yZXBsYWNlQ2hpbGQoY2hpbGRFbCwgYmVmb3JlRWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRFbC5pbnNlcnRCZWZvcmUoY2hpbGRFbCwgZ2V0RWwoYmVmb3JlKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKGNoaWxkRWwpO1xuICB9XG5cbiAgZG9Nb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwsIG9sZFBhcmVudCk7XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG5mdW5jdGlvbiB0cmlnZ2VyKGVsLCBldmVudE5hbWUpIHtcbiAgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbm1vdW50XCIgfHwgZXZlbnROYW1lID09PSBcIm9ucmVtb3VudFwiKSB7XG4gICAgZWwuX19yZWRvbV9tb3VudGVkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChldmVudE5hbWUgPT09IFwib251bm1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGhvb2tzID0gZWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKCFob29rcykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHZpZXcgPSBlbC5fX3JlZG9tX3ZpZXc7XG4gIGxldCBob29rQ291bnQgPSAwO1xuXG4gIHZpZXc/LltldmVudE5hbWVdPy4oKTtcblxuICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9vaykge1xuICAgICAgaG9va0NvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGhvb2tDb3VudCkge1xuICAgIGxldCB0cmF2ZXJzZSA9IGVsLmZpcnN0Q2hpbGQ7XG5cbiAgICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICAgIGNvbnN0IG5leHQgPSB0cmF2ZXJzZS5uZXh0U2libGluZztcblxuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgZXZlbnROYW1lKTtcblxuICAgICAgdHJhdmVyc2UgPSBuZXh0O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KSB7XG4gIGlmICghY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgfVxuXG4gIGNvbnN0IGhvb2tzID0gY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZTtcbiAgY29uc3QgcmVtb3VudCA9IHBhcmVudEVsID09PSBvbGRQYXJlbnQ7XG4gIGxldCBob29rc0ZvdW5kID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBob29rTmFtZSBvZiBob29rTmFtZXMpIHtcbiAgICBpZiAoIXJlbW91bnQpIHtcbiAgICAgIC8vIGlmIGFscmVhZHkgbW91bnRlZCwgc2tpcCB0aGlzIHBoYXNlXG4gICAgICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICAgICAgLy8gb25seSBWaWV3cyBjYW4gaGF2ZSBsaWZlY3ljbGUgZXZlbnRzXG4gICAgICAgIGlmIChob29rTmFtZSBpbiBjaGlsZCkge1xuICAgICAgICAgIGhvb2tzW2hvb2tOYW1lXSA9IChob29rc1tob29rTmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChob29rc1tob29rTmFtZV0pIHtcbiAgICAgIGhvb2tzRm91bmQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9va3NGb3VuZCkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcbiAgbGV0IHRyaWdnZXJlZCA9IGZhbHNlO1xuXG4gIGlmIChyZW1vdW50IHx8IHRyYXZlcnNlPy5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIHJlbW91bnQgPyBcIm9ucmVtb3VudFwiIDogXCJvbm1vdW50XCIpO1xuICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gIH1cblxuICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuXG4gICAgaWYgKCF0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gICAgZm9yIChjb25zdCBob29rIGluIGhvb2tzKSB7XG4gICAgICBwYXJlbnRIb29rc1tob29rXSA9IChwYXJlbnRIb29rc1tob29rXSB8fCAwKSArIGhvb2tzW2hvb2tdO1xuICAgIH1cblxuICAgIGlmICh0cmlnZ2VyZWQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0cmF2ZXJzZS5ub2RlVHlwZSA9PT0gTm9kZS5ET0NVTUVOVF9OT0RFIHx8XG4gICAgICAoc2hhZG93Um9vdEF2YWlsYWJsZSAmJiB0cmF2ZXJzZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHx8XG4gICAgICBwYXJlbnQ/Ll9fcmVkb21fbW91bnRlZFxuICAgICkge1xuICAgICAgdHJpZ2dlcih0cmF2ZXJzZSwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICAgIH1cbiAgICB0cmF2ZXJzZSA9IHBhcmVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZSh2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIGNvbnN0IGVsID0gZ2V0RWwodmlldyk7XG5cbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0U3R5bGVWYWx1ZShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzZXRTdHlsZVZhbHVlKGVsLCBhcmcxLCBhcmcyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIHZhbHVlKSB7XG4gIGVsLnN0eWxlW2tleV0gPSB2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlO1xufVxuXG4vKiBnbG9iYWwgU1ZHRWxlbWVudCAqL1xuXG5cbmNvbnN0IHhsaW5rbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIjtcblxuZnVuY3Rpb24gc2V0QXR0cih2aWV3LCBhcmcxLCBhcmcyKSB7XG4gIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyKTtcbn1cblxuZnVuY3Rpb24gc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIsIGluaXRpYWwpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBjb25zdCBpc09iaiA9IHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiO1xuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbCwga2V5LCBhcmcxW2tleV0sIGluaXRpYWwpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpc1NWRyA9IGVsIGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcbiAgICBjb25zdCBpc0Z1bmMgPSB0eXBlb2YgYXJnMiA9PT0gXCJmdW5jdGlvblwiO1xuXG4gICAgaWYgKGFyZzEgPT09IFwic3R5bGVcIiAmJiB0eXBlb2YgYXJnMiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgc2V0U3R5bGUoZWwsIGFyZzIpO1xuICAgIH0gZWxzZSBpZiAoaXNTVkcgJiYgaXNGdW5jKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIGlmIChhcmcxID09PSBcImRhdGFzZXRcIikge1xuICAgICAgc2V0RGF0YShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmICghaXNTVkcgJiYgKGFyZzEgaW4gZWwgfHwgaXNGdW5jKSAmJiBhcmcxICE9PSBcImxpc3RcIikge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTVkcgJiYgYXJnMSA9PT0gXCJ4bGlua1wiKSB7XG4gICAgICAgIHNldFhsaW5rKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGluaXRpYWwgJiYgYXJnMSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgIHNldENsYXNzTmFtZShlbCwgYXJnMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChhcmcyID09IG51bGwpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGFyZzEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKGFyZzEsIGFyZzIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRDbGFzc05hbWUoZWwsIGFkZGl0aW9uVG9DbGFzc05hbWUpIHtcbiAgaWYgKGFkZGl0aW9uVG9DbGFzc05hbWUgPT0gbnVsbCkge1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpO1xuICB9IGVsc2UgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoYWRkaXRpb25Ub0NsYXNzTmFtZSk7XG4gIH0gZWxzZSBpZiAoXG4gICAgdHlwZW9mIGVsLmNsYXNzTmFtZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgIGVsLmNsYXNzTmFtZSAmJlxuICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsXG4gICkge1xuICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsID1cbiAgICAgIGAke2VsLmNsYXNzTmFtZS5iYXNlVmFsfSAke2FkZGl0aW9uVG9DbGFzc05hbWV9YC50cmltKCk7XG4gIH0gZWxzZSB7XG4gICAgZWwuY2xhc3NOYW1lID0gYCR7ZWwuY2xhc3NOYW1lfSAke2FkZGl0aW9uVG9DbGFzc05hbWV9YC50cmltKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0WGxpbmsoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0WGxpbmsoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGFyZzIgIT0gbnVsbCkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXREYXRhKGVsLCBhcmcxLCBhcmcyKSB7XG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldERhdGEoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGFyZzIgIT0gbnVsbCkge1xuICAgICAgZWwuZGF0YXNldFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBlbC5kYXRhc2V0W2FyZzFdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0ZXh0KHN0cikge1xuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc3RyICE9IG51bGwgPyBzdHIgOiBcIlwiKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VBcmd1bWVudHNJbnRlcm5hbChlbGVtZW50LCBhcmdzLCBpbml0aWFsKSB7XG4gIGZvciAoY29uc3QgYXJnIG9mIGFyZ3MpIHtcbiAgICBpZiAoYXJnICE9PSAwICYmICFhcmcpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgYXJnO1xuXG4gICAgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYXJnKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlID09PSBcIm51bWJlclwiKSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRleHQoYXJnKSk7XG4gICAgfSBlbHNlIGlmIChpc05vZGUoZ2V0RWwoYXJnKSkpIHtcbiAgICAgIG1vdW50KGVsZW1lbnQsIGFyZyk7XG4gICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoKSB7XG4gICAgICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZywgaW5pdGlhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRBdHRySW50ZXJuYWwoZWxlbWVudCwgYXJnLCBudWxsLCBpbml0aWFsKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5zdXJlRWwocGFyZW50KSB7XG4gIHJldHVybiB0eXBlb2YgcGFyZW50ID09PSBcInN0cmluZ1wiID8gaHRtbChwYXJlbnQpIDogZ2V0RWwocGFyZW50KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWwocGFyZW50KSB7XG4gIHJldHVybiAoXG4gICAgKHBhcmVudC5ub2RlVHlwZSAmJiBwYXJlbnQpIHx8ICghcGFyZW50LmVsICYmIHBhcmVudCkgfHwgZ2V0RWwocGFyZW50LmVsKVxuICApO1xufVxuXG5mdW5jdGlvbiBpc05vZGUoYXJnKSB7XG4gIHJldHVybiBhcmc/Lm5vZGVUeXBlO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaChjaGlsZCwgZGF0YSwgZXZlbnROYW1lID0gXCJyZWRvbVwiKSB7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IGRhdGEgfSk7XG4gIGNoaWxkRWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbmZ1bmN0aW9uIHNldENoaWxkcmVuKHBhcmVudCwgLi4uY2hpbGRyZW4pIHtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBsZXQgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIHBhcmVudEVsLmZpcnN0Q2hpbGQpO1xuXG4gIHdoaWxlIChjdXJyZW50KSB7XG4gICAgY29uc3QgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG5cbiAgICB1bm1vdW50KHBhcmVudCwgY3VycmVudCk7XG5cbiAgICBjdXJyZW50ID0gbmV4dDtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBfY3VycmVudCkge1xuICBsZXQgY3VycmVudCA9IF9jdXJyZW50O1xuXG4gIGNvbnN0IGNoaWxkRWxzID0gQXJyYXkoY2hpbGRyZW4ubGVuZ3RoKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hpbGRFbHNbaV0gPSBjaGlsZHJlbltpXSAmJiBnZXRFbChjaGlsZHJlbltpXSk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXTtcblxuICAgIGlmICghY2hpbGQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkRWwgPSBjaGlsZEVsc1tpXTtcblxuICAgIGlmIChjaGlsZEVsID09PSBjdXJyZW50KSB7XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0U2libGluZztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChpc05vZGUoY2hpbGRFbCkpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBjdXJyZW50Py5uZXh0U2libGluZztcbiAgICAgIGNvbnN0IGV4aXN0cyA9IGNoaWxkLl9fcmVkb21faW5kZXggIT0gbnVsbDtcbiAgICAgIGNvbnN0IHJlcGxhY2UgPSBleGlzdHMgJiYgbmV4dCA9PT0gY2hpbGRFbHNbaSArIDFdO1xuXG4gICAgICBtb3VudChwYXJlbnQsIGNoaWxkLCBjdXJyZW50LCByZXBsYWNlKTtcblxuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5sZW5ndGggIT0gbnVsbCkge1xuICAgICAgY3VycmVudCA9IHRyYXZlcnNlKHBhcmVudCwgY2hpbGQsIGN1cnJlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBsaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIExpc3RQb29sIHtcbiAgY29uc3RydWN0b3IoVmlldywga2V5LCBpbml0RGF0YSkge1xuICAgIHRoaXMuVmlldyA9IFZpZXc7XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICAgIHRoaXMub2xkTG9va3VwID0ge307XG4gICAgdGhpcy5sb29rdXAgPSB7fTtcbiAgICB0aGlzLm9sZFZpZXdzID0gW107XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuXG4gICAgaWYgKGtleSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmtleSA9IHR5cGVvZiBrZXkgPT09IFwiZnVuY3Rpb25cIiA/IGtleSA6IHByb3BLZXkoa2V5KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUoZGF0YSwgY29udGV4dCkge1xuICAgIGNvbnN0IHsgVmlldywga2V5LCBpbml0RGF0YSB9ID0gdGhpcztcbiAgICBjb25zdCBrZXlTZXQgPSBrZXkgIT0gbnVsbDtcblxuICAgIGNvbnN0IG9sZExvb2t1cCA9IHRoaXMubG9va3VwO1xuICAgIGNvbnN0IG5ld0xvb2t1cCA9IHt9O1xuXG4gICAgY29uc3QgbmV3Vmlld3MgPSBBcnJheShkYXRhLmxlbmd0aCk7XG4gICAgY29uc3Qgb2xkVmlld3MgPSB0aGlzLnZpZXdzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtID0gZGF0YVtpXTtcbiAgICAgIGxldCB2aWV3O1xuXG4gICAgICBpZiAoa2V5U2V0KSB7XG4gICAgICAgIGNvbnN0IGlkID0ga2V5KGl0ZW0pO1xuXG4gICAgICAgIHZpZXcgPSBvbGRMb29rdXBbaWRdIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgICAgbmV3TG9va3VwW2lkXSA9IHZpZXc7XG4gICAgICAgIHZpZXcuX19yZWRvbV9pZCA9IGlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlldyA9IG9sZFZpZXdzW2ldIHx8IG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICAgIH1cbiAgICAgIHZpZXcudXBkYXRlPy4oaXRlbSwgaSwgZGF0YSwgY29udGV4dCk7XG5cbiAgICAgIGNvbnN0IGVsID0gZ2V0RWwodmlldy5lbCk7XG5cbiAgICAgIGVsLl9fcmVkb21fdmlldyA9IHZpZXc7XG4gICAgICBuZXdWaWV3c1tpXSA9IHZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5vbGRWaWV3cyA9IG9sZFZpZXdzO1xuICAgIHRoaXMudmlld3MgPSBuZXdWaWV3cztcblxuICAgIHRoaXMub2xkTG9va3VwID0gb2xkTG9va3VwO1xuICAgIHRoaXMubG9va3VwID0gbmV3TG9va3VwO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByb3BLZXkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbiBwcm9wcGVkS2V5KGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbVtrZXldO1xuICB9O1xufVxuXG5mdW5jdGlvbiBsaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICAgIHRoaXMuVmlldyA9IFZpZXc7XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLnBvb2wgPSBuZXcgTGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSk7XG4gICAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gICAgdGhpcy5rZXlTZXQgPSBrZXkgIT0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBrZXlTZXQgfSA9IHRoaXM7XG4gICAgY29uc3Qgb2xkVmlld3MgPSB0aGlzLnZpZXdzO1xuXG4gICAgdGhpcy5wb29sLnVwZGF0ZShkYXRhIHx8IFtdLCBjb250ZXh0KTtcblxuICAgIGNvbnN0IHsgdmlld3MsIGxvb2t1cCB9ID0gdGhpcy5wb29sO1xuXG4gICAgaWYgKGtleVNldCkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvbGRWaWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvbGRWaWV3ID0gb2xkVmlld3NbaV07XG4gICAgICAgIGNvbnN0IGlkID0gb2xkVmlldy5fX3JlZG9tX2lkO1xuXG4gICAgICAgIGlmIChsb29rdXBbaWRdID09IG51bGwpIHtcbiAgICAgICAgICBvbGRWaWV3Ll9fcmVkb21faW5kZXggPSBudWxsO1xuICAgICAgICAgIHVubW91bnQodGhpcywgb2xkVmlldyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdmlld3NbaV07XG5cbiAgICAgIHZpZXcuX19yZWRvbV9pbmRleCA9IGk7XG4gICAgfVxuXG4gICAgc2V0Q2hpbGRyZW4odGhpcywgdmlld3MpO1xuXG4gICAgaWYgKGtleVNldCkge1xuICAgICAgdGhpcy5sb29rdXAgPSBsb29rdXA7XG4gICAgfVxuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgfVxufVxuXG5MaXN0LmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZExpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBMaXN0LmJpbmQoTGlzdCwgcGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKTtcbn07XG5cbmxpc3QuZXh0ZW5kID0gTGlzdC5leHRlbmQ7XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cblxuZnVuY3Rpb24gcGxhY2UoVmlldywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBQbGFjZShWaWV3LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIFBsYWNlIHtcbiAgY29uc3RydWN0b3IoVmlldywgaW5pdERhdGEpIHtcbiAgICB0aGlzLmVsID0gdGV4dChcIlwiKTtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdGhpcy5lbDtcblxuICAgIGlmIChWaWV3IGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgIH0gZWxzZSBpZiAoVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIHRoaXMuX2VsID0gVmlldztcbiAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX1ZpZXcgPSBWaWV3O1xuICAgIH1cblxuICAgIHRoaXMuX2luaXREYXRhID0gaW5pdERhdGE7XG4gIH1cblxuICB1cGRhdGUodmlzaWJsZSwgZGF0YSkge1xuICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5fcGxhY2Vob2xkZXI7XG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMuZWwucGFyZW50Tm9kZTtcblxuICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCwgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IGdldEVsKHRoaXMuX2VsKTtcbiAgICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IFZpZXcgPSB0aGlzLl9WaWV3O1xuICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgVmlldyh0aGlzLl9pbml0RGF0YSk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodmlldyk7XG4gICAgICAgICAgdGhpcy52aWV3ID0gdmlldztcblxuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHZpZXcsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMudmlzaWJsZSkge1xuICAgICAgICBpZiAodGhpcy5fZWwpIHtcbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy5fZWwpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy5fZWwpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMudmlldyk7XG4gICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgdGhpcy52aWV3KTtcblxuICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVmKGN0eCwga2V5LCB2YWx1ZSkge1xuICBjdHhba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBOb2RlICovXG5cblxuZnVuY3Rpb24gcm91dGVyKHBhcmVudCwgdmlld3MsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUm91dGVyKHBhcmVudCwgdmlld3MsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUm91dGVyIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLnZpZXdzID0gdmlld3M7XG4gICAgdGhpcy5WaWV3cyA9IHZpZXdzOyAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZShyb3V0ZSwgZGF0YSkge1xuICAgIGlmIChyb3V0ZSAhPT0gdGhpcy5yb3V0ZSkge1xuICAgICAgY29uc3Qgdmlld3MgPSB0aGlzLnZpZXdzO1xuICAgICAgY29uc3QgVmlldyA9IHZpZXdzW3JvdXRlXTtcblxuICAgICAgdGhpcy5yb3V0ZSA9IHJvdXRlO1xuXG4gICAgICBpZiAoVmlldyAmJiAoVmlldyBpbnN0YW5jZW9mIE5vZGUgfHwgVmlldy5lbCBpbnN0YW5jZW9mIE5vZGUpKSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXcgPSBWaWV3ICYmIG5ldyBWaWV3KHRoaXMuaW5pdERhdGEsIGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBzZXRDaGlsZHJlbih0aGlzLmVsLCBbdGhpcy52aWV3XSk7XG4gICAgfVxuICAgIHRoaXMudmlldz8udXBkYXRlPy4oZGF0YSwgcm91dGUpO1xuICB9XG59XG5cbmNvbnN0IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG5mdW5jdGlvbiBzdmcocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5LCBucyk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgUXVlcnkgPSBxdWVyeTtcbiAgICBlbGVtZW50ID0gbmV3IFF1ZXJ5KC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBhcmd1bWVudCByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZ2V0RWwoZWxlbWVudCksIGFyZ3MsIHRydWUpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5jb25zdCBzID0gc3ZnO1xuXG5zdmcuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kU3ZnKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIHN2Zy5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuc3ZnLm5zID0gbnM7XG5cbmZ1bmN0aW9uIHZpZXdGYWN0b3J5KHZpZXdzLCBrZXkpIHtcbiAgaWYgKCF2aWV3cyB8fCB0eXBlb2Ygdmlld3MgIT09IFwib2JqZWN0XCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ2aWV3cyBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgfVxuICBpZiAoIWtleSB8fCB0eXBlb2Yga2V5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwia2V5IG11c3QgYmUgYSBzdHJpbmdcIik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIGZhY3RvcnlWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKSB7XG4gICAgY29uc3Qgdmlld0tleSA9IGl0ZW1ba2V5XTtcbiAgICBjb25zdCBWaWV3ID0gdmlld3Nbdmlld0tleV07XG5cbiAgICBpZiAoVmlldykge1xuICAgICAgcmV0dXJuIG5ldyBWaWV3KGluaXREYXRhLCBpdGVtLCBpLCBkYXRhKTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYHZpZXcgJHt2aWV3S2V5fSBub3QgZm91bmRgKTtcbiAgfTtcbn1cblxuZXhwb3J0IHsgTGlzdCwgTGlzdFBvb2wsIFBsYWNlLCBSb3V0ZXIsIGRpc3BhdGNoLCBlbCwgaCwgaHRtbCwgbGlzdCwgbGlzdFBvb2wsIG1vdW50LCBwbGFjZSwgcmVmLCByb3V0ZXIsIHMsIHNldEF0dHIsIHNldENoaWxkcmVuLCBzZXREYXRhLCBzZXRTdHlsZSwgc2V0WGxpbmssIHN2ZywgdGV4dCwgdW5tb3VudCwgdmlld0ZhY3RvcnkgfTtcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgbGFuZ0lkOiAnbGFuZ0lkJyxcclxuICAgIHRva2VuOiAndG9rZW4nXHJcbn0pO1xyXG4iLCJpbXBvcnQgbG9jYWxTdG9yYWdlSXRlbXMgZnJvbSBcIi4vbG9jYWxTdG9yYWdlSXRlbXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0TGFuZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUl0ZW1zLmxhbmdJZCkgPz8gJ3J1JztcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgJ3Rhc2tfbWFuYWdlcic6ICfQnNC10L3QtdC00LbQtdGAINC30LDQtNCw0YcnLFxyXG4gICAgJ2xvZ2luJzogJ9CS0YXQvtC0JyxcclxuICAgICdsb2FkaW5nJzogJ9CX0LDQs9GA0YPQt9C60LAnLFxyXG4gICAgJ2xvYWRpbmdfbl9zZWNvbmRzX2xlZnQnOiBuID0+IHtcclxuICAgICAgICBsZXQgc2Vjb25kUG9zdGZpeCA9ICcnO1xyXG4gICAgICAgIGxldCBsZWZ0UG9zdGZpeCA9ICfQvtGB0YwnO1xyXG4gICAgICAgIGNvbnN0IG5CZXR3ZWVuMTBhbmQyMCA9IG4gPiAxMCAmJiBuIDwgMjA7XHJcbiAgICAgICAgaWYgKG4gJSAxMCA9PT0gMSAmJiAhbkJldHdlZW4xMGFuZDIwKSB7XHJcbiAgICAgICAgICAgIHNlY29uZFBvc3RmaXggPSAn0LAnO1xyXG4gICAgICAgICAgICBsZWZ0UG9zdGZpeCA9ICfQsNGB0YwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChbMiwgMywgNF0uaW5jbHVkZXMobiAlIDEwKSAmJiAhbkJldHdlZW4xMGFuZDIwKSB7XHJcbiAgICAgICAgICAgIHNlY29uZFBvc3RmaXggPSAn0YsnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGDQl9Cw0LPRgNGD0LfQutCwLi4uICjQntGB0YLQsNC7JHtsZWZ0UG9zdGZpeH0gJHtufSDRgdC10LrRg9C90LQke3NlY29uZFBvc3RmaXh9KWA7XHJcbiAgICB9LFxyXG4gICAgJ2VtYWlsJzogJ0UtbWFpbCcsXHJcbiAgICAnc29tZWJvZHlfZW1haWwnOiAnc29tZWJvZHlAZ21haWwuY29tJyxcclxuICAgICdwYXNzd29yZCc6ICfQn9Cw0YDQvtC70YwnLFxyXG4gICAgJ3RvX2xvZ2luJzogJ9CS0L7QudGC0LgnLFxyXG4gICAgJ3RvX3JlZ2lzdGVyJzogJ9CX0LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRjycsXHJcbiAgICAnbm9fYWNjb3VudF9xdWVzdGlvbic6ICfQndC10YIg0LDQutC60LDRg9C90YLQsD8nLFxyXG4gICAgJ3RvX2xvZ19vdXQnOiAn0JLRi9C50YLQuCcsXHJcbiAgICAncmVnaXN0cmF0aW9uJzogJ9Cg0LXQs9C40YHRgtGA0LDRhtC40Y8nLFxyXG4gICAgJ3JlcGVhdF9wYXNzd29yZCc6ICfQn9C+0LLRgtC+0YDQuNGC0LUg0L/QsNGA0L7Qu9GMJyxcclxuICAgICdhbHJlYWR5X2hhdmVfYWNjb3VudF9xdWVzdGlvbic6ICfQo9C20LUg0LXRgdGC0Ywg0LDQutC60LDRg9C90YI/JyxcclxuICAgICdlZGl0aW5nJzogJ9Cg0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUnLFxyXG4gICAgJ3Rhc2tfbmFtZSc6ICfQndCw0LfQstCw0L3QuNC1INC30LDQtNCw0YfQuCcsXHJcbiAgICAnbXlfdGFzayc6ICfQnNC+0Y8g0LfQsNC00LDRh9CwJyxcclxuICAgICdkZWFkbGluZSc6ICfQlNC10LTQu9Cw0LnQvScsXHJcbiAgICAnaW1wb3J0YW50X3Rhc2snOiAn0JLQsNC20L3QsNGPINC30LDQtNCw0YfQsCcsXHJcbiAgICAnY2FuY2VsJzogJ9Ce0YLQvNC10L3QsCcsXHJcbiAgICAndG9fc2F2ZSc6ICfQodC+0YXRgNCw0L3QuNGC0YwnLFxyXG4gICAgJ3J1JzogJ9Cg0YPRgdGB0LrQuNC5JyxcclxuICAgICdlbic6ICfQkNC90LPQu9C40LnRgdC60LjQuSdcclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgJ3Rhc2tfbWFuYWdlcic6ICdUYXNrIG1hbmFnZXInLFxyXG4gICAgJ2xvZ2luJzogJ0xvZ2luJyxcclxuICAgICdsb2FkaW5nJzogJ0xvYWRpbmcnLFxyXG4gICAgJ2xvYWRpbmdfbl9zZWNvbmRzX2xlZnQnOiBuID0+IGBMb2FkaW5nLi4uICgke259IHNlY29uZCR7biAlIDEwID09PSAxID8gJycgOiAncyd9IGxlZnQpYCxcclxuICAgICdlbWFpbCc6ICdFLW1haWwnLFxyXG4gICAgJ3NvbWVib2R5X2VtYWlsJzogJ3NvbWVib2R5QGdtYWlsLmNvbScsXHJcbiAgICAncGFzc3dvcmQnOiAnUGFzc3dvcmQnLFxyXG4gICAgJ3RvX2xvZ2luJzogJ0xvZyBpbicsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAnUmVnaXN0ZXInLFxyXG4gICAgJ25vX2FjY291bnRfcXVlc3Rpb24nOiAnTm8gYWNjb3VudD8nLFxyXG4gICAgJ3RvX2xvZ19vdXQnOiAnTG9nIG91dCcsXHJcbiAgICAncmVnaXN0cmF0aW9uJzogJ1JlZ2lzdHJhdGlvbicsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ1JlcGVhdCBwYXNzd29yZCcsXHJcbiAgICAnYWxyZWFkeV9oYXZlX2FjY291bnRfcXVlc3Rpb24nOiAnSGF2ZSBnb3QgYW4gYWNjb3VudD8nLFxyXG4gICAgJ2VkaXRpbmcnOiAnRWRpdGluZycsXHJcbiAgICAndGFza19uYW1lJzogJ1Rhc2sgbmFtZScsXHJcbiAgICAnbXlfdGFzayc6ICdNeSB0YXNrJyxcclxuICAgICdkZWFkbGluZSc6ICdEZWFkbGluZScsXHJcbiAgICAnaW1wb3J0YW50X3Rhc2snOiAnSW1wb3J0YW50IHRhc2snLFxyXG4gICAgJ2NhbmNlbCc6ICdDYW5jZWwnLFxyXG4gICAgJ3RvX3NhdmUnOiAnU2F2ZScsXHJcbiAgICAncnUnOiAnUnVzc2lhbicsXHJcbiAgICAnZW4nOiAnRW5nbGlzaCcsXHJcbn07XHJcbiIsImltcG9ydCBSVSBmcm9tICcuL3Q5bi5ydSc7XHJcbmltcG9ydCBFTiBmcm9tICcuL3Q5bi5lbic7XHJcblxyXG5mdW5jdGlvbiB1c2VUYWcoaHRtbEVsLCB0YWcpIHtcclxuICAgIGxldCByZXN1bHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICBpZiAodHlwZW9mIGh0bWxFbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gaHRtbEVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQuYXBwZW5kQ2hpbGQoaHRtbEVsKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVzZVRhZ3MoaHRtbEVsLCB0YWdzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gaHRtbEVsO1xyXG4gICAgdGFncy5mb3JFYWNoKHRhZyA9PiByZXN1bHQgPSB1c2VUYWcocmVzdWx0LCB0YWcpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChsYW5kSWQsIGNvZGUsIHRhZywgLi4uYXJncykgPT4ge1xyXG4gICAgaWYgKGNvZGUgPT0gbnVsbCB8fCBjb2RlLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xyXG5cclxuICAgIGlmICghWydydScsICdlbiddLmluY2x1ZGVzKGxhbmRJZCkpIHtcclxuICAgICAgICBsYW5kSWQgPSAncnUnO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBjb2RlO1xyXG5cclxuICAgIGlmIChsYW5kSWQgPT09ICdydScgJiYgUlVbY29kZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBSVVtjb2RlXTtcclxuICAgIH1cclxuICAgIGlmIChsYW5kSWQgPT09ICdlbicgJiYgRU5bY29kZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBFTltjb2RlXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCguLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFnKSB7XHJcbiAgICAgICAgaWYgKHRhZyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVzZVRhZ3MocmVzdWx0LCB0YWcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVzZVRhZyhyZXN1bHQsIHRhZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayA9IChlKSA9PiB7IGNvbnNvbGUubG9nKFwiY2xpY2tlZCBidXR0b25cIiwgZS50YXJnZXQpOyB9LFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGljb24sXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkLFxyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayxcclxuICAgICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgaWNvbiwgdHlwZSwgZGlzYWJsZWQsIG9uQ2xpY2ssIGNsYXNzTmFtZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGJ1dHRvbiB0aGlzPSdfdWlfYnV0dG9uJyBjbGFzc05hbWU9e2BidG4gYnRuLSR7dHlwZX0gJHtjbGFzc05hbWV9YH1cclxuICAgICAgICAgICAgICAgIG9uY2xpY2s9e29uQ2xpY2t9IGRpc2FibGVkPXtkaXNhYmxlZH0+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5fdWlfaWNvbihpY29uKX1cclxuICAgICAgICAgICAgICAgIDxzcGFuIHRoaXM9J191aV9zcGFuJz57dGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX2ljb24gPSAoaWNvbikgPT4ge1xyXG4gICAgICAgIHJldHVybiBpY29uID8gPGkgY2xhc3NOYW1lPXtgYmkgYmktJHtpY29ufSBtZS0yYH0+PC9pPiA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3NwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT0nc3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbWUtMicgLz5cclxuICAgIH1cclxuXHJcbiAgICBzdGFydF9sb2FkaW5nID0gKGxvYWRpbmdMYWJlbCkgPT4geyBcclxuICAgICAgICB0aGlzLnVwZGF0ZSh7IGRpc2FibGVkOiB0cnVlLCB0ZXh0OiBsb2FkaW5nTGFiZWwsIGxvYWRpbmc6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZW5kX2xvYWRpbmcgPSAobGFiZWwpID0+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZSh7IGRpc2FibGVkOiBmYWxzZSwgdGV4dDogbGFiZWwsIGxvYWRpbmc6IGZhbHNlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy5fcHJvcC50ZXh0LFxyXG4gICAgICAgICAgICBpY29uID0gdGhpcy5fcHJvcC5pY29uLFxyXG4gICAgICAgICAgICB0eXBlID0gdGhpcy5fcHJvcC50eXBlLFxyXG4gICAgICAgICAgICBkaXNhYmxlZCA9IHRoaXMuX3Byb3AuZGlzYWJsZWQsXHJcbiAgICAgICAgICAgIGxvYWRpbmcgPSB0aGlzLl9wcm9wLmxvYWRpbmcsXHJcbiAgICAgICAgICAgIG9uQ2xpY2sgPSB0aGlzLl9wcm9wLm9uQ2xpY2ssXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IHRoaXMuX3Byb3AuY2xhc3NOYW1lXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmIChsb2FkaW5nICE9PSB0aGlzLl9wcm9wLmxvYWRpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkVG9SZW1vdmUgPSB0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlc1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5yZW1vdmVDaGlsZChjaGlsZFRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IGxvYWRpbmcgPyB0aGlzLl91aV9zcGlubmVyKCkgOiB0aGlzLl91aV9pY29uKGljb24pO1xyXG4gICAgICAgICAgICBjaGlsZCAmJiB0aGlzLl91aV9idXR0b24uaW5zZXJ0QmVmb3JlKGNoaWxkLCB0aGlzLl91aV9zcGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGljb24gIT09IHRoaXMuX3Byb3AuaWNvbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRUb1JlbW92ZSA9IHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLnJlbW92ZUNoaWxkKGNoaWxkVG9SZW1vdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5fdWlfaWNvbihpY29uKTtcclxuICAgICAgICAgICAgY2hpbGQgJiYgdGhpcy5fdWlfYnV0dG9uLmluc2VydEJlZm9yZSh0aGlzLl91aV9pY29uKGljb24pLCB0aGlzLl91aV9zcGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRleHQgIT09IHRoaXMuX3Byb3AudGV4dCkge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFuQm9keSA9IDxkaXY+e3RleHR9PC9kaXY+O1xyXG4gICAgICAgICAgICB0aGlzLl91aV9zcGFuLmlubmVySFRNTCA9IHNwYW5Cb2R5LmlubmVySFRNTDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYXNzTmFtZSAhPT0gdGhpcy5fcHJvcC5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLmNsYXNzTmFtZSA9IGBidG4gYnRuLSR7dHlwZX0gJHtjbGFzc05hbWV9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpc2FibGVkICE9PSB0aGlzLl9wcm9wLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5kaXNhYmxlZCA9IGRpc2FibGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob25DbGljayAhPT0gdGhpcy5fcHJvcC5vbkNsaWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5vbmNsaWNrID0gb25DbGljaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IC4uLnRoaXMuX3Byb3AsIHRleHQsIGljb24sIHR5cGUsIGRpc2FibGVkLCBsb2FkaW5nLCBvbkNsaWNrLCBjbGFzc05hbWUgfTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Qge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ09wdGlvbiAxJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ29wdGlvbjEnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHZhbHVlID0gJ29wdGlvbjEnLFxyXG4gICAgICAgICAgICBvbkNoYW5nZSA9ICh2YWx1ZSkgPT4geyBjb25zb2xlLmxvZyh2YWx1ZSkgfSxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBvbkNoYW5nZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgb3B0aW9ucywgdmFsdWUsIG9uQ2hhbmdlIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9vcHRpb25zID0gW107XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlbGVjdCB0aGlzPSdfdWlfc2VsZWN0JyBjbGFzc05hbWU9J2Zvcm0tc2VsZWN0JyBvbmNoYW5nZT17ZSA9PiBvbkNoYW5nZShlLnRhcmdldC52YWx1ZSl9PlxyXG4gICAgICAgICAgICAgICAge29wdGlvbnMubWFwKG9wdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdWlPcHQgPSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uLnZhbHVlfSBzZWxlY3RlZD17dmFsdWUgPT09IG9wdGlvbi52YWx1ZX0+e29wdGlvbi5sYWJlbH08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9vcHRpb25zLnB1c2godWlPcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aU9wdDtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGFiZWxzID0gKGxhYmVscykgPT4ge1xyXG4gICAgICAgIGlmIChsYWJlbHMubGVuZ3RoICE9PSB0aGlzLl9wcm9wLm9wdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byB1cGRhdGUgc2VsZWN0XFwncyBvcHRpb25zIGxhYmVscyFcXFxyXG4gICAgICAgICAgICAgICAgIExhYmVscyBhcnJheSBpcyBpbmNvbXBhdGlibGUgd2l0aCBzZWxlY3RcXCcgb3B0aW9ucyBhcnJheS4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdWlfb3B0aW9ucy5mb3JFYWNoKCh1aU9wdGlvbiwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdWlPcHRpb24uaW5uZXJIVE1MID0gbGFiZWxzW2luZGV4XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xyXG4gICAgX2V2ZW50TGlzdCA9IHt9O1xyXG5cclxuICAgIC8vIHtcclxuICAgIC8vICAgICAnZXZlbnQxJzogW1xyXG4gICAgLy8gICAgICAgICBmMSxcclxuICAgIC8vICAgICAgICAgZjJcclxuICAgIC8vICAgICBdLFxyXG4gICAgLy8gICAgICdldmVudDInOiBbXHJcbiAgICAvLyAgICAgICAgIGYzXHJcbiAgICAvLyAgICAgXVxyXG4gICAgLy8gfVxyXG5cclxuICAgIHN1YnNjcmliZSA9IChuYW1lLCBsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fZXZlbnRMaXN0W25hbWVdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoID0gKG5hbWUsIGFyZ3MgPSB7fSkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudExpc3QuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcihhcmdzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgbGV0IGNvbW1vbkV2ZW50TWFuYWdlciA9IG5ldyBFdmVudE1hbmFnZXIoKTsgLy8gc2luZ2xldG9uXHJcbmV4cG9ydCB7IEV2ZW50TWFuYWdlciB9OyAvLyBjbGFzc1xyXG4iLCJleHBvcnQgZGVmYXVsdCBPYmplY3QuZnJlZXplKHtcclxuICAgIGNoYW5nZUxhbmc6ICdjaGFuZ2VMYW5nJ1xyXG59KTtcclxuIiwiaW1wb3J0IFNlbGVjdCBmcm9tIFwiLi4vYXRvbS9zZWxlY3RcIjtcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tIFwiLi4vdXRpbHMvY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNvbW1vbkV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi91dGlscy9ldmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi4vdXRpbHMvZXZlbnRzXCI7XHJcbmltcG9ydCB0OW4gZnJvbSBcIi4uL3V0aWxzL3Q5bi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0TGFuZyB7XHJcbiAgICBfbGFuZ0lkcyA9IFsncnUnLCAnZW4nXTtcclxuICAgIF9sYW5nVDluS2V5cyA9IFsncnUnLCAnZW4nXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2xhbmdMYWJlbHMgPSAobGFuZ0lkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmdUOW5LZXlzLm1hcCh0OW5LZXkgPT4gdDluKGxhbmdJZCwgdDluS2V5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLl9sYW5nTGFiZWxzKGRlZmF1bHRMYW5nKTtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fbGFuZ0lkcy5tYXAoKGxhbmdJZCwgaW5kZXgpID0+ICh7XHJcbiAgICAgICAgICAgIHZhbHVlOiBsYW5nSWQsXHJcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbHNbaW5kZXhdXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8U2VsZWN0IHRoaXM9J191aV9zZWxlY3QnIG9wdGlvbnM9e29wdGlvbnN9IHZhbHVlPXtkZWZhdWx0TGFuZ30gXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17bGFuZ0lkID0+IGNvbW1vbkV2ZW50TWFuYWdlci5kaXNwYXRjaChldmVudHMuY2hhbmdlTGFuZywgbGFuZ0lkKX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdGhpcy5fbGFuZ0xhYmVscyhsYW5nKTtcclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlTGFiZWxzKGxhYmVscyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2F0b20vYnV0dG9uJztcclxuaW1wb3J0IFNlbGVjdExhbmcgZnJvbSAnLi9zZWxlY3RMYW5nJztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCA9IGZhbHNlIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgYXV0aG9yaXplZCB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMSB0aGlzPSdfdWlfaDEnIGNsYXNzTmFtZT0nbWUtNSc+e3Q5bihkZWZhdWx0TGFuZywgJ3Rhc2tfbWFuYWdlcicpfTwvaDE+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxTZWxlY3RMYW5nIHRoaXM9J191aV9zZWxlY3QnIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsgYXV0aG9yaXplZCAmJiBcclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idG4nIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9J21zLWF1dG8nIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX2xvZ19vdXQnKX0gLz4gfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7IFxyXG5cclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3VpX2gxLnRleHRDb250ZW50ID0gdDluKGxhbmcsICd0YXNrX21hbmFnZXInKTtcclxuICAgICAgICB0aGlzLl91aV9idG4gJiYgdGhpcy5fdWlfYnRuLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fbG9nX291dCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY29tbW9uRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4vZXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XHJcbmltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tIFwiLi9sb2NhbFN0b3JhZ2VJdGVtc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gICAgY29uc3RydWN0b3IoZXZlbnRNYW5hZ2VyID0gY29tbW9uRXZlbnRNYW5hZ2VyKSB7XHJcbiAgICAgICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShldmVudHMuY2hhbmdlTGFuZywgbGFuZyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHsgbGFuZyB9KTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMubGFuZ0lkLCBsYW5nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi4vd2lkZ2V0L2hlYWRlcic7XHJcbmltcG9ydCBMb2NhbGl6ZWRQYWdlIGZyb20gJy4vbG9jYWxpemVkUGFnZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaXRoSGVhZGVyIGV4dGVuZHMgTG9jYWxpemVkUGFnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBlbGVtKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkID0gZmFsc2UgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBhdXRob3JpemVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfZWxlbSA9IGVsZW07XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXBwLWJvZHknPlxyXG4gICAgICAgICAgICAgICAgPEhlYWRlciB0aGlzPSdfdWlfaGVhZGVyJyBhdXRob3JpemVkPXthdXRob3JpemVkfSAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lciBjZW50ZXJlZCc+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMuX3VpX2VsZW19XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuX3VpX2hlYWRlci51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfZWxlbS51cGRhdGUoZGF0YSk7XHJcbiAgICB9XHJcbn07XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJycsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJycsXHJcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCcsXHJcbiAgICAgICAgICAgIGtleSA9ICd1bmRlZmluZWQnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgbGFiZWwsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBrZXlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFiZWwsIHBsYWNlaG9sZGVyLCB0eXBlLCBrZXkgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYmFzZS1pbnB1dC0ke2tleX1gO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgdGhpcz0nX3VpX2xhYmVsJyBmb3I9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1sYWJlbCc+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdGhpcz0nX3VpX2lucHV0JyB0eXBlPXt0eXBlfSBpZD17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNvbnRyb2wnIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYWJlbCA9IHRoaXMuX3Byb3AubGFiZWwsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gdGhpcy5fcHJvcC5wbGFjZWhvbGRlcixcclxuICAgICAgICAgICAgdHlwZSA9IHRoaXMuX3Byb3AudHlwZVxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAobGFiZWwgIT09IHRoaXMuX3Byb3AubGFiZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfbGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyICE9PSB0aGlzLl9wcm9wLnBsYWNlaG9sZGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2lucHV0LnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlICE9PSB0aGlzLl9wcm9wLnR5cGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfaW5wdXQudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IC4uLnRoaXMucHJvcCwgbGFiZWwsIHBsYWNlaG9sZGVyLCB0eXBlIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0X3ZhbHVlID0gKCkgPT4gdGhpcy5fdWlfaW5wdXQudmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gJycsXHJcbiAgICAgICAgICAgIGhyZWYgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGhyZWZcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGhyZWYgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIHRoaXM9J191aV9hJyBocmVmPXtocmVmfT57dGV4dH08L2E+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMuX3Byb3AudGV4dCxcclxuICAgICAgICAgICAgaHJlZiA9IHRoaXMuX3Byb3AuaHJlZlxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAodGV4dCAhPT0gdGhpcy5fcHJvcC50ZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2EudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaHJlZiAhPT0gdGhpcy5fcHJvcC5ocmVmKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2EuaHJlZiA9IGhyZWY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyAuLi50aGlzLl9wcm9wLCB0ZXh0LCBocmVmIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vYXRvbS9pbnB1dCc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9naW5BbmRQYXNzRm9ybSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21iLTMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfZW1haWwnIGxhYmVsPXt0OW4oZGVmYXVsdExhbmcsICdlbWFpbCcpfSBcclxuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0OW4oZGVmYXVsdExhbmcsICdzb21lYm9keV9lbWFpbCcpfSBrZXk9XCJlLW1haWxcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8SW5wdXQgdGhpcz0nX3VpX2lucHV0X3B3ZCcgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ3Bhc3N3b3JkJyl9IHBsYWNlaG9sZGVyPScqKioqKioqKicgdHlwZT0ncGFzc3dvcmQnIGtleT1cInB3ZFwiLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9pbnB1dF9lbWFpbC51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdlbWFpbCcpLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdDluKGxhbmcsICdzb21lYm9keV9lbWFpbCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfcHdkLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ3Bhc3N3b3JkJyksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0X2xvZ2luID0gKCkgPT4gdGhpcy5fdWlfaW5wdXRfZW1haWwuZ2V0X3ZhbHVlKCk7XHJcblxyXG4gICAgZ2V0X3Bhc3N3b3JkID0gKCkgPT4gdGhpcy5fdWlfaW5wdXRfcHdkLmdldF92YWx1ZSgpO1xyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b20vaW5wdXQnO1xyXG5pbXBvcnQgTGluayBmcm9tICcuLi9hdG9tL2xpbmsnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2F0b20vYnV0dG9uJztcclxuaW1wb3J0IExvZ2luQW5kUGFzc0Zvcm0gZnJvbSAnLi4vd2lkZ2V0L2xvZ2luQW5kUGFzc0Zvcm0nO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ0Zyb20ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J21iLTQnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi0zJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPExvZ2luQW5kUGFzc0Zvcm0gdGhpcz0nX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0nIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPElucHV0IHRoaXM9J191aV9pbnB1dF9yZXBlYXRfcHdkJyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAncmVwZWF0X3Bhc3N3b3JkJyl9IHBsYWNlaG9sZGVyPScqKioqKioqKicgLz5cclxuICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGhpcz0nX3VpX3NwYW4nPnt0OW4oZGVmYXVsdExhbmcsICdhbHJlYWR5X2hhdmVfYWNjb3VudF9xdWVzdGlvbicpfTwvc3Bhbj4mbmJzcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRoaXM9J191aV9saW5rJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICd0b19sb2dpbicpfSBocmVmPScuL2xvZ2luLmh0bWwnIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPlxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdGhpcz0nX3VpX2J0bicgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAndG9fcmVnaXN0ZXInKX0gY2xhc3NOYW1lPSd3LTEwMCcgdHlwZT0ncHJpbWFyeScgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfcmVwZWF0X3B3ZC51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdyZXBlYXRfcGFzc3dvcmQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX3NwYW4uaW5uZXJIVE1MID0gdDluKGxhbmcsICdhbHJlYWR5X2hhdmVfYWNjb3VudF9xdWVzdGlvbicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2xpbmsudXBkYXRlKHtcclxuICAgICAgICAgICAgdGV4dDogdDluKGxhbmcsICd0b19sb2dpbicpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfYnRuLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fcmVnaXN0ZXInKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4vdXRpbHMvY29uc3RhbnRzJztcclxuaW1wb3J0IHQ5biBmcm9tICcuL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCBXaXRoSGVhZGVyIGZyb20gJy4vdXRpbHMvd2l0aEhlYWRlcic7XHJcbmltcG9ydCBSZWdGb3JtIGZyb20gJy4vd2lkZ2V0L3JlZ0Zvcm0nXHJcblxyXG5jbGFzcyBSZWdQYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXItbWQnPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21iLTMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMSB0aGlzPSdfdWlfaDEnIGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPnt0OW4oZGVmYXVsdExhbmcsICdyZWdpc3RyYXRpb24nKX08L2gxPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8UmVnRm9ybSB0aGlzPSdfdWlfcmVnX2Zvcm0nIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfaDEuaW5uZXJIVE1MID0gdDluKGxhbmcsICdyZWdpc3RyYXRpb24nKTtcclxuICAgICAgICB0aGlzLl91aV9yZWdfZm9ybS51cGRhdGUoZGF0YSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vdW50KFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpLFxyXG4gICAgPFdpdGhIZWFkZXI+XHJcbiAgICAgICAgPFJlZ1BhZ2UgLz5cclxuICAgIDwvV2l0aEhlYWRlcj5cclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiT2JqZWN0IiwiZnJlZXplIiwibGFuZ0lkIiwidG9rZW4iLCJkZWZhdWx0TGFuZyIsIl9sb2NhbFN0b3JhZ2UkZ2V0SXRlbSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJsb2NhbFN0b3JhZ2VJdGVtcyIsImxvYWRpbmdfbl9zZWNvbmRzX2xlZnQiLCJuIiwic2Vjb25kUG9zdGZpeCIsImxlZnRQb3N0Zml4IiwibkJldHdlZW4xMGFuZDIwIiwiaW5jbHVkZXMiLCJjb25jYXQiLCJsYW5kSWQiLCJjb2RlIiwicmVzdWx0IiwiUlUiLCJFTiIsIl9sZW4iLCJhcmd1bWVudHMiLCJBcnJheSIsIl9rZXkiLCJhcHBseSIsIkJ1dHRvbiIsIl9jcmVhdGVDbGFzcyIsIl90aGlzIiwic2V0dGluZ3MiLCJ1bmRlZmluZWQiLCJfY2xhc3NDYWxsQ2hlY2siLCJfZGVmaW5lUHJvcGVydHkiLCJfdGhpcyRfcHJvcCIsIl9wcm9wIiwiaWNvbiIsImRpc2FibGVkIiwib25DbGljayIsIm9uY2xpY2siLCJfdWlfaWNvbiIsImxvYWRpbmdMYWJlbCIsInVwZGF0ZSIsImxvYWRpbmciLCJsYWJlbCIsImRhdGEiLCJfZGF0YSR0ZXh0IiwiX2RhdGEkaWNvbiIsIl9kYXRhJHR5cGUiLCJfZGF0YSRkaXNhYmxlZCIsIl9kYXRhJGxvYWRpbmciLCJfZGF0YSRvbkNsaWNrIiwiX2RhdGEkY2xhc3NOYW1lIiwiX3VpX2J1dHRvbiIsImNoaWxkTm9kZXMiLCJjaGlsZFRvUmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJfdWlfc3Bpbm5lciIsImluc2VydEJlZm9yZSIsIl91aV9zcGFuIiwic3BhbkJvZHkiLCJpbm5lckhUTUwiLCJfb2JqZWN0U3ByZWFkIiwiX3NldHRpbmdzJHRleHQiLCJfc2V0dGluZ3MkaWNvbiIsIl9zZXR0aW5ncyR0eXBlIiwiX3NldHRpbmdzJGRpc2FibGVkIiwiX3NldHRpbmdzJG9uQ2xpY2siLCJlIiwiY29uc29sZSIsImxvZyIsInRhcmdldCIsIl9zZXR0aW5ncyRjbGFzc05hbWUiLCJfdWlfcmVuZGVyIiwiU2VsZWN0Iiwib3B0aW9ucyIsIm9uQ2hhbmdlIiwiX3VpX29wdGlvbnMiLCJvbmNoYW5nZSIsIm1hcCIsIm9wdGlvbiIsInVpT3B0Iiwic2VsZWN0ZWQiLCJwdXNoIiwibGFiZWxzIiwiZXJyb3IiLCJmb3JFYWNoIiwidWlPcHRpb24iLCJpbmRleCIsIl9zZXR0aW5ncyRvcHRpb25zIiwiX3NldHRpbmdzJHZhbHVlIiwiX3NldHRpbmdzJG9uQ2hhbmdlIiwiRXZlbnRNYW5hZ2VyIiwibmFtZSIsImxpc3RlbmVyIiwiX2V2ZW50TGlzdCIsImhhc093blByb3BlcnR5IiwiY29tbW9uRXZlbnRNYW5hZ2VyIiwiY2hhbmdlTGFuZyIsIlNlbGVjdExhbmciLCJfbGFuZ1Q5bktleXMiLCJ0OW5LZXkiLCJ0OW4iLCJfbGFuZ0xhYmVscyIsIl9sYW5nSWRzIiwiZGlzcGF0Y2giLCJldmVudHMiLCJfZGF0YSRsYW5nIiwibGFuZyIsIl91aV9zZWxlY3QiLCJ1cGRhdGVMYWJlbHMiLCJIZWFkZXIiLCJhdXRob3JpemVkIiwiX3VpX2gxIiwidGV4dENvbnRlbnQiLCJfdWlfYnRuIiwiX3NldHRpbmdzJGF1dGhvcml6ZWQiLCJfZGVmYXVsdCIsImV2ZW50TWFuYWdlciIsInN1YnNjcmliZSIsInNldEl0ZW0iLCJXaXRoSGVhZGVyIiwiX0xvY2FsaXplZFBhZ2UiLCJlbGVtIiwiX2NhbGxTdXBlciIsIl91aV9lbGVtIiwiX3VpX2hlYWRlciIsIl9pbmhlcml0cyIsIkxvY2FsaXplZFBhZ2UiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwiaW5wdXRJZCIsIl9kYXRhJGxhYmVsIiwiX2RhdGEkcGxhY2Vob2xkZXIiLCJfdWlfbGFiZWwiLCJfdWlfaW5wdXQiLCJwcm9wIiwiX3NldHRpbmdzJGxhYmVsIiwiX3NldHRpbmdzJHBsYWNlaG9sZGVyIiwiX3NldHRpbmdzJGtleSIsIkxpbmsiLCJocmVmIiwiX2RhdGEkaHJlZiIsIl91aV9hIiwiX3NldHRpbmdzJGhyZWYiLCJMb2dpbkFuZFBhc3NGb3JtIiwiX3VpX2lucHV0X2VtYWlsIiwiX3VpX2lucHV0X3B3ZCIsImdldF92YWx1ZSIsIlJlZ0Zyb20iLCJfdWlfbG9naW5fYW5kX3Bhc3NfZm9ybSIsIl91aV9pbnB1dF9yZXBlYXRfcHdkIiwiX3VpX2xpbmsiLCJSZWdQYWdlIiwiUmVnRm9ybSIsIl91aV9yZWdfZm9ybSIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFTQSxhQUFhQSxDQUFDQyxLQUFLLEVBQUVDLEVBQUUsRUFB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
