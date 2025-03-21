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
    _this._prop = {
      text: text,
      icon: icon,
      type: type,
      disabled: disabled,
      loading: loading,
      onClick: onClick,
      className: className
    };
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
    _this._ui_label.textContent = label;
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
  _defineProperty(this, "updateLabel", function (label) {
    // TODO:
    console.log('input. change lang', label);
  });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vdDluLnJ1LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vdDluLmVuLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3dpZGdldC9zZWxlY3RMYW5nLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvaGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbGl6ZWRQYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy93aXRoSGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2NoZWNrYm94LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2lucHV0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvZWRpdEZvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2VkaXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBsYW5nSWQ6ICdsYW5nSWQnXHJcbn0pO1xyXG4iLCJpbXBvcnQgbG9jYWxTdG9yYWdlSXRlbXMgZnJvbSBcIi4vbG9jYWxTdG9yYWdlSXRlbXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0TGFuZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUl0ZW1zLmxhbmdJZCkgPz8gJ3J1JztcclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayA9IChlKSA9PiB7IGNvbnNvbGUubG9nKFwiY2xpY2tlZCBidXR0b25cIiwgZS50YXJnZXQpOyB9LFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGljb24sXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkLFxyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayxcclxuICAgICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgaWNvbiwgdHlwZSwgZGlzYWJsZWQsIG9uQ2xpY2ssIGNsYXNzTmFtZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGJ1dHRvbiB0aGlzPSdfdWlfYnV0dG9uJyBjbGFzc05hbWU9e2BidG4gYnRuLSR7dHlwZX0gJHtjbGFzc05hbWV9YH1cclxuICAgICAgICAgICAgICAgIG9uY2xpY2s9e29uQ2xpY2t9IGRpc2FibGVkPXtkaXNhYmxlZH0+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5fdWlfaWNvbihpY29uKX1cclxuICAgICAgICAgICAgICAgIDxzcGFuIHRoaXM9J191aV9zcGFuJz57dGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX2ljb24gPSAoaWNvbikgPT4ge1xyXG4gICAgICAgIHJldHVybiBpY29uID8gPGkgY2xhc3NOYW1lPXtgYmkgYmktJHtpY29ufSBtZS0yYH0+PC9pPiA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3NwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT0nc3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbWUtMicgLz5cclxuICAgIH1cclxuXHJcbiAgICBzdGFydExvYWRpbmcgPSAobG9hZGluZ0xhYmVsKSA9PiB7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IHRydWUsIHRleHQ6IGxvYWRpbmdMYWJlbCwgbG9hZGluZzogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmRMb2FkaW5nID0gKGxhYmVsKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoeyBkaXNhYmxlZDogZmFsc2UsIHRleHQ6IGxhYmVsLCBsb2FkaW5nOiBmYWxzZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMuX3Byb3AudGV4dCxcclxuICAgICAgICAgICAgaWNvbiA9IHRoaXMuX3Byb3AuaWNvbixcclxuICAgICAgICAgICAgdHlwZSA9IHRoaXMuX3Byb3AudHlwZSxcclxuICAgICAgICAgICAgZGlzYWJsZWQgPSB0aGlzLl9wcm9wLmRpc2FibGVkLFxyXG4gICAgICAgICAgICBsb2FkaW5nID0gdGhpcy5fcHJvcC5sb2FkaW5nLFxyXG4gICAgICAgICAgICBvbkNsaWNrID0gdGhpcy5fcHJvcC5vbkNsaWNrLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSB0aGlzLl9wcm9wLmNsYXNzTmFtZVxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICBpZiAobG9hZGluZyAhPT0gdGhpcy5fcHJvcC5sb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZFRvUmVtb3ZlID0gdGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91aV9idXR0b24ucmVtb3ZlQ2hpbGQoY2hpbGRUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBsb2FkaW5nID8gdGhpcy5fdWlfc3Bpbm5lcigpIDogdGhpcy5fdWlfaWNvbihpY29uKTtcclxuICAgICAgICAgICAgY2hpbGQgJiYgdGhpcy5fdWlfYnV0dG9uLmluc2VydEJlZm9yZShjaGlsZCwgdGhpcy5fdWlfc3Bhbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpY29uICE9PSB0aGlzLl9wcm9wLmljb24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkVG9SZW1vdmUgPSB0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlc1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5yZW1vdmVDaGlsZChjaGlsZFRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuX3VpX2ljb24oaWNvbik7XHJcbiAgICAgICAgICAgIGNoaWxkICYmIHRoaXMuX3VpX2J1dHRvbi5pbnNlcnRCZWZvcmUodGhpcy5fdWlfaWNvbihpY29uKSwgdGhpcy5fdWlfc3Bhbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0ZXh0ICE9PSB0aGlzLl9wcm9wLnRleHQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3BhbkJvZHkgPSA8ZGl2Pnt0ZXh0fTwvZGl2PjtcclxuICAgICAgICAgICAgdGhpcy5fdWlfc3Bhbi5pbm5lckhUTUwgPSBzcGFuQm9keS5pbm5lckhUTUw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjbGFzc05hbWUgIT09IHRoaXMuX3Byb3AuY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5jbGFzc05hbWUgPSBgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkaXNhYmxlZCAhPT0gdGhpcy5fcHJvcC5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24uZGlzYWJsZWQgPSBkaXNhYmxlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9uQ2xpY2sgIT09IHRoaXMuX3Byb3Aub25DbGljaykge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24ub25jbGljayA9IG9uQ2xpY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyB0ZXh0LCBpY29uLCB0eXBlLCBkaXNhYmxlZCwgbG9hZGluZywgb25DbGljaywgY2xhc3NOYW1lIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdPcHRpb24gMScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdvcHRpb24xJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB2YWx1ZSA9ICdvcHRpb24xJyxcclxuICAgICAgICAgICAgb25DaGFuZ2UgPSAodmFsdWUpID0+IHsgY29uc29sZS5sb2codmFsdWUpIH0sXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBvcHRpb25zLFxyXG4gICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgb25DaGFuZ2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHZhbHVlLCBvbkNoYW5nZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfb3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWxlY3QgdGhpcz0nX3VpX3NlbGVjdCcgY2xhc3NOYW1lPSdmb3JtLXNlbGVjdCcgb25jaGFuZ2U9e2UgPT4gb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfT5cclxuICAgICAgICAgICAgICAgIHtvcHRpb25zLm1hcChvcHRpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVpT3B0ID0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbi52YWx1ZX0gc2VsZWN0ZWQ9e3ZhbHVlID09PSBvcHRpb24udmFsdWV9PntvcHRpb24ubGFiZWx9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfb3B0aW9ucy5wdXNoKHVpT3B0KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlPcHQ7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUxhYmVscyA9IChsYWJlbHMpID0+IHtcclxuICAgICAgICBpZiAobGFiZWxzLmxlbmd0aCAhPT0gdGhpcy5fcHJvcC5vcHRpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIHNlbGVjdFxcJ3Mgb3B0aW9ucyBsYWJlbHMhXFxcclxuICAgICAgICAgICAgICAgICBMYWJlbHMgYXJyYXkgaXMgaW5jb21wYXRpYmxlIHdpdGggc2VsZWN0XFwnIG9wdGlvbnMgYXJyYXkuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX29wdGlvbnMuZm9yRWFjaCgodWlPcHRpb24sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHVpT3B0aW9uLmlubmVySFRNTCA9IGxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuICAgIF9ldmVudExpc3QgPSB7fTtcclxuXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgJ2V2ZW50MSc6IFtcclxuICAgIC8vICAgICAgICAgZjEsXHJcbiAgICAvLyAgICAgICAgIGYyXHJcbiAgICAvLyAgICAgXSxcclxuICAgIC8vICAgICAnZXZlbnQyJzogW1xyXG4gICAgLy8gICAgICAgICBmM1xyXG4gICAgLy8gICAgIF1cclxuICAgIC8vIH1cclxuXHJcbiAgICBzdWJzY3JpYmUgPSAobmFtZSwgbGlzdGVuZXIpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2V2ZW50TGlzdFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBhcmdzID0ge30pID0+IHtcclxuICAgICAgICBpZiAodGhpcy5fZXZlbnRMaXN0Lmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXS5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBjb21tb25FdmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKCk7IC8vIHNpbmdsZXRvblxyXG5leHBvcnQgeyBFdmVudE1hbmFnZXIgfTsgLy8gY2xhc3NcclxuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBjaGFuZ2VMYW5nOiAnY2hhbmdlTGFuZydcclxufSk7XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgICd0YXNrX21hbmFnZXInOiAn0JzQtdC90LXQtNC20LXRgCDQt9Cw0LTQsNGHJyxcclxuICAgICdsb2dpbic6ICfQktGF0L7QtCcsXHJcbiAgICAnbG9hZGluZ19uX3NlY29uZHNfbGVmdCc6IG4gPT4ge1xyXG4gICAgICAgIGxldCBzZWNvbmRQb3N0Zml4ID0gJyc7XHJcbiAgICAgICAgbGV0IGxlZnRQb3N0Zml4ID0gJ9C+0YHRjCc7XHJcbiAgICAgICAgY29uc3QgbkJldHdlZW4xMGFuZDIwID0gbiA+IDEwICYmIG4gPCAyMDtcclxuICAgICAgICBpZiAobiAlIDEwID09PSAxICYmICFuQmV0d2VlbjEwYW5kMjApIHtcclxuICAgICAgICAgICAgc2Vjb25kUG9zdGZpeCA9ICfQsCc7XHJcbiAgICAgICAgICAgIGxlZnRQb3N0Zml4ID0gJ9Cw0YHRjCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFsyLCAzLCA0XS5pbmNsdWRlcyhuICUgMTApICYmICFuQmV0d2VlbjEwYW5kMjApIHtcclxuICAgICAgICAgICAgc2Vjb25kUG9zdGZpeCA9ICfRiyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYNCX0LDQs9GA0YPQt9C60LAuLi4gKNCe0YHRgtCw0Lske2xlZnRQb3N0Zml4fSAke259INGB0LXQutGD0L3QtCR7c2Vjb25kUG9zdGZpeH0pYDtcclxuICAgIH0sXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ9Cf0LDRgNC+0LvRjCcsXHJcbiAgICAndG9fbG9naW4nOiAn0JLQvtC50YLQuCcsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAn0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPJyxcclxuICAgICdub19hY2NvdW50X3F1ZXN0aW9uJzogJ9Cd0LXRgiDQsNC60LrQsNGD0L3RgtCwPycsXHJcbiAgICAndG9fbG9nX291dCc6ICfQktGL0LnRgtC4JyxcclxuICAgICdyZWdpc3RyYXRpb24nOiAn0KDQtdCz0LjRgdGC0YDQsNGG0LjRjycsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ9Cf0L7QstGC0L7RgNC40YLQtSDQv9Cw0YDQvtC70YwnLFxyXG4gICAgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJzogJ9Cj0LbQtSDQtdGB0YLRjCDQsNC60LrQsNGD0L3Rgj8nLFxyXG4gICAgJ2VkaXRpbmcnOiAn0KDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtScsXHJcbiAgICAndGFza19uYW1lJzogJ9Cd0LDQt9Cy0LDQvdC40LUg0LfQsNC00LDRh9C4JyxcclxuICAgICdteV90YXNrJzogJ9Cc0L7RjyDQt9Cw0LTQsNGH0LAnLFxyXG4gICAgJ2RlYWRsaW5lJzogJ9CU0LXQtNC70LDQudC9JyxcclxuICAgICdpbXBvcnRhbnRfdGFzayc6ICfQktCw0LbQvdCw0Y8g0LfQsNC00LDRh9CwJyxcclxuICAgICdjYW5jZWwnOiAn0J7RgtC80LXQvdCwJyxcclxuICAgICd0b19zYXZlJzogJ9Ch0L7RhdGA0LDQvdC40YLRjCcsXHJcbiAgICAncnUnOiAn0KDRg9GB0YHQutC40LknLFxyXG4gICAgJ2VuJzogJ9CQ0L3Qs9C70LjQudGB0LrQuNC5J1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAndGFza19tYW5hZ2VyJzogJ1Rhc2sgbWFuYWdlcicsXHJcbiAgICAnbG9naW4nOiAnTG9naW4nLFxyXG4gICAgJ2xvYWRpbmdfbl9zZWNvbmRzX2xlZnQnOiBuID0+IGBMb2FkaW5nLi4uICgke259IHNlY29uZCR7biAlIDEwID09PSAxID8gJycgOiAncyd9IGxlZnQpYCxcclxuICAgICdlbWFpbCc6ICdFLW1haWwnLFxyXG4gICAgJ3NvbWVib2R5X2VtYWlsJzogJ3NvbWVib2R5QGdtYWlsLmNvbScsXHJcbiAgICAncGFzc3dvcmQnOiAnUGFzc3dvcmQnLFxyXG4gICAgJ3RvX2xvZ2luJzogJ0xvZyBpbicsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAnUmVnaXN0ZXInLFxyXG4gICAgJ25vX2FjY291bnRfcXVlc3Rpb24nOiAnTm8gYWNjb3VudD8nLFxyXG4gICAgJ3RvX2xvZ19vdXQnOiAnTG9nIG91dCcsXHJcbiAgICAncmVnaXN0cmF0aW9uJzogJ1JlZ2lzdHJhdGlvbicsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ1JlcGVhdCBwYXNzd29yZCcsXHJcbiAgICAnYWxyZWFkeV9oYXZlX2FjY291bnRfcXVlc3Rpb24nOiAnSGF2ZSBnb3QgYW4gYWNjb3VudD8nLFxyXG4gICAgJ2VkaXRpbmcnOiAnRWRpdGluZycsXHJcbiAgICAndGFza19uYW1lJzogJ1Rhc2sgbmFtZScsXHJcbiAgICAnbXlfdGFzayc6ICdNeSB0YXNrJyxcclxuICAgICdkZWFkbGluZSc6ICdEZWFkbGluZScsXHJcbiAgICAnaW1wb3J0YW50X3Rhc2snOiAnSW1wb3J0YW50IHRhc2snLFxyXG4gICAgJ2NhbmNlbCc6ICdDYW5jZWwnLFxyXG4gICAgJ3RvX3NhdmUnOiAnU2F2ZScsXHJcbiAgICAncnUnOiAnUnVzc2lhbicsXHJcbiAgICAnZW4nOiAnRW5nbGlzaCcsXHJcbn07XHJcbiIsImltcG9ydCBSVSBmcm9tICcuL3Q5bi5ydSc7XHJcbmltcG9ydCBFTiBmcm9tICcuL3Q5bi5lbic7XHJcblxyXG5mdW5jdGlvbiB1c2VUYWcoaHRtbEVsLCB0YWcpIHtcclxuICAgIGxldCByZXN1bHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICBpZiAodHlwZW9mIGh0bWxFbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gaHRtbEVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQuYXBwZW5kQ2hpbGQoaHRtbEVsKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVzZVRhZ3MoaHRtbEVsLCB0YWdzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gaHRtbEVsO1xyXG4gICAgdGFncy5mb3JFYWNoKHRhZyA9PiByZXN1bHQgPSB1c2VUYWcocmVzdWx0LCB0YWcpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChsYW5kSWQsIGNvZGUsIHRhZywgLi4uYXJncykgPT4ge1xyXG4gICAgaWYgKGNvZGUgPT0gbnVsbCB8fCBjb2RlLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xyXG5cclxuICAgIGlmICghWydydScsICdlbiddLmluY2x1ZGVzKGxhbmRJZCkpIHtcclxuICAgICAgICBsYW5kSWQgPSAncnUnO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBjb2RlO1xyXG5cclxuICAgIGlmIChsYW5kSWQgPT09ICdydScgJiYgUlVbY29kZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBSVVtjb2RlXTtcclxuICAgIH1cclxuICAgIGlmIChsYW5kSWQgPT09ICdlbicgJiYgRU5bY29kZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBFTltjb2RlXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCguLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFnKSB7XHJcbiAgICAgICAgaWYgKHRhZyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVzZVRhZ3MocmVzdWx0LCB0YWcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVzZVRhZyhyZXN1bHQsIHRhZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIiwiaW1wb3J0IFNlbGVjdCBmcm9tIFwiLi4vYXRvbS9zZWxlY3RcIjtcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tIFwiLi4vdXRpbHMvY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNvbW1vbkV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi91dGlscy9ldmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi4vdXRpbHMvZXZlbnRzXCI7XHJcbmltcG9ydCB0OW4gZnJvbSBcIi4uL3V0aWxzL3Q5bi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0TGFuZyB7XHJcbiAgICBfbGFuZ0lkcyA9IFsncnUnLCAnZW4nXTtcclxuICAgIF9sYW5nVDluS2V5cyA9IFsncnUnLCAnZW4nXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2xhbmdMYWJlbHMgPSAobGFuZ0lkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmdUOW5LZXlzLm1hcCh0OW5LZXkgPT4gdDluKGxhbmdJZCwgdDluS2V5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLl9sYW5nTGFiZWxzKGRlZmF1bHRMYW5nKTtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fbGFuZ0lkcy5tYXAoKGxhbmdJZCwgaW5kZXgpID0+ICh7XHJcbiAgICAgICAgICAgIHZhbHVlOiBsYW5nSWQsXHJcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbHNbaW5kZXhdXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8U2VsZWN0IHRoaXM9J191aV9zZWxlY3QnIG9wdGlvbnM9e29wdGlvbnN9IHZhbHVlPXtkZWZhdWx0TGFuZ30gXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17bGFuZ0lkID0+IGNvbW1vbkV2ZW50TWFuYWdlci5kaXNwYXRjaChldmVudHMuY2hhbmdlTGFuZywgbGFuZ0lkKX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdGhpcy5fbGFuZ0xhYmVscyhsYW5nKTtcclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlTGFiZWxzKGxhYmVscyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2F0b20vYnV0dG9uJztcclxuaW1wb3J0IFNlbGVjdExhbmcgZnJvbSAnLi9zZWxlY3RMYW5nJztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCA9IGZhbHNlIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgYXV0aG9yaXplZCB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMSB0aGlzPSdfdWlfaDEnIGNsYXNzTmFtZT0nbWUtNSc+e3Q5bihkZWZhdWx0TGFuZywgJ3Rhc2tfbWFuYWdlcicpfTwvaDE+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxTZWxlY3RMYW5nIHRoaXM9J191aV9zZWxlY3QnIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsgYXV0aG9yaXplZCAmJiBcclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idG4nIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9J21zLWF1dG8nIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX2xvZ19vdXQnKX0gLz4gfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7IFxyXG5cclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3VpX2gxLnRleHRDb250ZW50ID0gdDluKGxhbmcsICd0YXNrX21hbmFnZXInKTtcclxuICAgICAgICB0aGlzLl91aV9idG4gJiYgdGhpcy5fdWlfYnRuLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fbG9nX291dCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY29tbW9uRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4vZXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XHJcbmltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tIFwiLi9sb2NhbFN0b3JhZ2VJdGVtc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gICAgY29uc3RydWN0b3IoZXZlbnRNYW5hZ2VyID0gY29tbW9uRXZlbnRNYW5hZ2VyKSB7XHJcbiAgICAgICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShldmVudHMuY2hhbmdlTGFuZywgbGFuZyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHsgbGFuZyB9KTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMubGFuZ0lkLCBsYW5nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi4vd2lkZ2V0L2hlYWRlcic7XHJcbmltcG9ydCBMb2NhbGl6ZWRQYWdlIGZyb20gJy4vbG9jYWxpemVkUGFnZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaXRoSGVhZGVyIGV4dGVuZHMgTG9jYWxpemVkUGFnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBlbGVtKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkID0gZmFsc2UgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBhdXRob3JpemVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfZWxlbSA9IGVsZW07XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXBwLWJvZHknPlxyXG4gICAgICAgICAgICAgICAgPEhlYWRlciB0aGlzPSdfdWlfaGVhZGVyJyBhdXRob3JpemVkPXthdXRob3JpemVkfSAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lciBjZW50ZXJlZCc+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMuX3VpX2VsZW19XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuX3VpX2hlYWRlci51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfZWxlbS51cGRhdGUoZGF0YSk7XHJcbiAgICB9XHJcbn07XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoZWNrYm94IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJycsXHJcbiAgICAgICAgICAgIGtleSA9ICd1bmRlZmluZWQnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgbGFiZWwsXHJcbiAgICAgICAgICAgIGtleVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYWJlbCwga2V5IH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dElkID0gYGJhc2UtY2hlY2stJHtrZXl9YDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPSdmb3JtLWNoZWNrJz5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCB0aGlzPSdfdWlfbGFiZWwnIGZvcj17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNoZWNrLWxhYmVsJz57bGFiZWx9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSdjaGVja2JveCcgaWQ9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1jaGVjay1pbnB1dCcgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYWJlbCA9IHRoaXMuX3Byb3AubGFiZWwsXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2xhYmVsLnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSAnJyxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSAnJyxcclxuICAgICAgICAgICAga2V5ID0gJ3VuZGVmaW5lZCcsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIsXHJcbiAgICAgICAgICAgIGtleVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUxhYmVsID0gKGxhYmVsKSA9PiB7XHJcbiAgICAgICAgLy8gVE9ETzpcclxuICAgICAgICBjb25zb2xlLmxvZygnaW5wdXQuIGNoYW5nZSBsYW5nJywgbGFiZWwpXHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhYmVsLCBwbGFjZWhvbGRlciwga2V5IH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dElkID0gYGJhc2UtaW5wdXQtJHtrZXl9YDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHRoaXM9J191aV9sYWJlbCcgZm9yPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tbGFiZWwnPntsYWJlbH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHRoaXM9J191aV9pbnB1dCcgdHlwZT0ndGV4dCcgaWQ9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1jb250cm9sJyBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSB0aGlzLl9wcm9wLmxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9IHRoaXMuX3Byb3AucGxhY2Vob2xkZXJcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfbGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICB0aGlzLl91aV9pbnB1dC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBDaGVja2JveCBmcm9tICcuLi9hdG9tL2NoZWNrYm94JztcclxuaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b20vaW5wdXQnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRGb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfdGFza19uYW1lJyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAndGFza19uYW1lJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dDluKGRlZmF1bHRMYW5nLCAnbXlfdGFzaycpfSBrZXk9XCJ0YXNrLW5hbWVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfZGVhZGxpbmUnIGxhYmVsPXt0OW4oZGVmYXVsdExhbmcsICdkZWFkbGluZScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjAxLjAxLjIwMjVcIiBrZXk9XCJkZWFkbGluZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPENoZWNrYm94IHRoaXM9J191aV9jaGVja2JveCcgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ2ltcG9ydGFudF90YXNrJyl9IGtleT1cImltcG9ydGFudC10YXNrXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0aGlzPSdfdWlfYnRuX2NhbmNlbCcgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAnY2FuY2VsJyl9IHR5cGU9XCJzZWNvbmRhcnlcIiBjbGFzc05hbWU9XCJ3LTEwMFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idG5fc2F2ZScgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAndG9fc2F2ZScpfSB0eXBlPVwicHJpbWFyeVwiIGNsYXNzTmFtZT1cInctMTAwXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfdGFza19uYW1lLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ3Rhc2tfbmFtZScpLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdDluKGxhbmcsICdteV90YXNrJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9pbnB1dF9kZWFkbGluZS51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdkZWFkbGluZScpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2NoZWNrYm94LnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ2ltcG9ydGFudF90YXNrJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9idG5fY2FuY2VsLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAnY2FuY2VsJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9idG5fc2F2ZS51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX3NhdmUnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gXCIuLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lc1wiO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gXCIuL3V0aWxzL2NvbnN0YW50cy5qc1wiO1xyXG5pbXBvcnQgV2l0aEhlYWRlciBmcm9tIFwiLi91dGlscy93aXRoSGVhZGVyLmpzXCI7XHJcbmltcG9ydCBFZGl0Rm9ybSBmcm9tIFwiLi93aWRnZXQvZWRpdEZvcm0uanNcIjtcclxuaW1wb3J0IHQ5biBmcm9tIFwiLi91dGlscy90OW4vaW5kZXguanNcIjtcclxuXHJcbmNsYXNzIEVkaXQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxIHRoaXM9J191aV9oMScgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+e3Q5bihkZWZhdWx0TGFuZywgJ2VkaXRpbmcnKX08L2gxPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8RWRpdEZvcm0gdGhpcz0nX3VpX2VkaXRfZm9ybScgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9oMS5pbm5lckhUTUwgPSB0OW4obGFuZywgJ2VkaXRpbmcnKTtcclxuICAgICAgICB0aGlzLl91aV9lZGl0X2Zvcm0udXBkYXRlKGRhdGEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb3VudChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSxcclxuICAgIDxXaXRoSGVhZGVyIGF1dGhvcml6ZWQ+XHJcbiAgICAgIDxFZGl0Lz5cclxuICAgIDwvV2l0aEhlYWRlcj5cclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiT2JqZWN0IiwiZnJlZXplIiwibGFuZ0lkIiwiZGVmYXVsdExhbmciLCJfbG9jYWxTdG9yYWdlJGdldEl0ZW0iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwibG9jYWxTdG9yYWdlSXRlbXMiLCJCdXR0b24iLCJfY3JlYXRlQ2xhc3MiLCJfdGhpcyIsInNldHRpbmdzIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiX2NsYXNzQ2FsbENoZWNrIiwiX2RlZmluZVByb3BlcnR5IiwiX3RoaXMkX3Byb3AiLCJfcHJvcCIsImljb24iLCJkaXNhYmxlZCIsIm9uQ2xpY2siLCJjb25jYXQiLCJvbmNsaWNrIiwiX3VpX2ljb24iLCJsb2FkaW5nTGFiZWwiLCJ1cGRhdGUiLCJsb2FkaW5nIiwibGFiZWwiLCJkYXRhIiwiX2RhdGEkdGV4dCIsIl9kYXRhJGljb24iLCJfZGF0YSR0eXBlIiwiX2RhdGEkZGlzYWJsZWQiLCJfZGF0YSRsb2FkaW5nIiwiX2RhdGEkb25DbGljayIsIl9kYXRhJGNsYXNzTmFtZSIsIl91aV9idXR0b24iLCJjaGlsZE5vZGVzIiwiY2hpbGRUb1JlbW92ZSIsInJlbW92ZUNoaWxkIiwiX3VpX3NwaW5uZXIiLCJpbnNlcnRCZWZvcmUiLCJfdWlfc3BhbiIsInNwYW5Cb2R5IiwiaW5uZXJIVE1MIiwiX3NldHRpbmdzJHRleHQiLCJfc2V0dGluZ3MkaWNvbiIsIl9zZXR0aW5ncyR0eXBlIiwiX3NldHRpbmdzJGRpc2FibGVkIiwiX3NldHRpbmdzJG9uQ2xpY2siLCJlIiwiY29uc29sZSIsImxvZyIsInRhcmdldCIsIl9zZXR0aW5ncyRjbGFzc05hbWUiLCJfdWlfcmVuZGVyIiwiU2VsZWN0Iiwib3B0aW9ucyIsIm9uQ2hhbmdlIiwiX3VpX29wdGlvbnMiLCJvbmNoYW5nZSIsIm1hcCIsIm9wdGlvbiIsInVpT3B0Iiwic2VsZWN0ZWQiLCJwdXNoIiwibGFiZWxzIiwiZXJyb3IiLCJmb3JFYWNoIiwidWlPcHRpb24iLCJpbmRleCIsIl9zZXR0aW5ncyRvcHRpb25zIiwiX3NldHRpbmdzJHZhbHVlIiwiX3NldHRpbmdzJG9uQ2hhbmdlIiwiRXZlbnRNYW5hZ2VyIiwibmFtZSIsImxpc3RlbmVyIiwiX2V2ZW50TGlzdCIsImhhc093blByb3BlcnR5IiwiY29tbW9uRXZlbnRNYW5hZ2VyIiwiY2hhbmdlTGFuZyIsImxvYWRpbmdfbl9zZWNvbmRzX2xlZnQiLCJuIiwic2Vjb25kUG9zdGZpeCIsImxlZnRQb3N0Zml4IiwibkJldHdlZW4xMGFuZDIwIiwiaW5jbHVkZXMiLCJsYW5kSWQiLCJjb2RlIiwicmVzdWx0IiwiUlUiLCJFTiIsIl9sZW4iLCJBcnJheSIsIl9rZXkiLCJhcHBseSIsIlNlbGVjdExhbmciLCJfbGFuZ1Q5bktleXMiLCJ0OW5LZXkiLCJ0OW4iLCJfbGFuZ0xhYmVscyIsIl9sYW5nSWRzIiwiZGlzcGF0Y2giLCJldmVudHMiLCJfZGF0YSRsYW5nIiwibGFuZyIsIl91aV9zZWxlY3QiLCJ1cGRhdGVMYWJlbHMiLCJIZWFkZXIiLCJhdXRob3JpemVkIiwiX3VpX2gxIiwidGV4dENvbnRlbnQiLCJfdWlfYnRuIiwiX3NldHRpbmdzJGF1dGhvcml6ZWQiLCJfZGVmYXVsdCIsImV2ZW50TWFuYWdlciIsInN1YnNjcmliZSIsInNldEl0ZW0iLCJXaXRoSGVhZGVyIiwiX0xvY2FsaXplZFBhZ2UiLCJlbGVtIiwiX2NhbGxTdXBlciIsIl91aV9lbGVtIiwiX3VpX2hlYWRlciIsIl9pbmhlcml0cyIsIkxvY2FsaXplZFBhZ2UiLCJDaGVja2JveCIsImlucHV0SWQiLCJfZGF0YSRsYWJlbCIsIl91aV9sYWJlbCIsIl9zZXR0aW5ncyRsYWJlbCIsIl9zZXR0aW5ncyRrZXkiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwiX2RhdGEkcGxhY2Vob2xkZXIiLCJfdWlfaW5wdXQiLCJfc2V0dGluZ3MkcGxhY2Vob2xkZXIiLCJFZGl0Rm9ybSIsIl91aV9pbnB1dF90YXNrX25hbWUiLCJfdWlfaW5wdXRfZGVhZGxpbmUiLCJfdWlfY2hlY2tib3giLCJfdWlfYnRuX2NhbmNl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
