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
      className = _this$_prop.className;
    return this['_ui_button'] = el("button", {
      className: "btn btn-".concat(type, " ").concat(className)
    }, _this._ui_icon(icon), text);
  });
  _defineProperty(this, "_ui_icon", function (icon) {
    return icon ? el("i", {
      className: "bi bi-".concat(icon)
    }) : null;
  });
  _defineProperty(this, "update", function (data) {
    var _this$_ui_icon;
    var _data$text = data.text,
      text = _data$text === void 0 ? _this._prop.text : _data$text,
      _data$icon = data.icon,
      icon = _data$icon === void 0 ? _this._prop.icon : _data$icon,
      _data$type = data.type,
      type = _data$type === void 0 ? _this._prop.type : _data$type,
      _data$className = data.className,
      className = _data$className === void 0 ? _this._prop.className : _data$className;
    _this._ui_button.innerHTML = "".concat((_this$_ui_icon = _this._ui_icon(icon)) !== null && _this$_ui_icon !== void 0 ? _this$_ui_icon : '').concat(text);
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

var t9n = (function (landId, code) {
  if (code == null || code.length === 0) return '';
  if (!['ru', 'en'].includes(landId)) {
    landId = 'ru';
  }
  if (landId === 'ru' && RU[code]) return RU[code];
  if (landId === 'en' && EN[code]) return EN[code];
  return code;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY2xpZW50L25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vdDluLnJ1LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vdDluLmVuLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy90OW4vaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3dpZGdldC9zZWxlY3RMYW5nLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvaGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbGl6ZWRQYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy93aXRoSGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2NoZWNrYm94LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2lucHV0LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvZWRpdEZvcm0uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2VkaXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBsYW5nSWQ6ICdsYW5nSWQnXHJcbn0pO1xyXG4iLCJpbXBvcnQgbG9jYWxTdG9yYWdlSXRlbXMgZnJvbSBcIi4vbG9jYWxTdG9yYWdlSXRlbXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0TGFuZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUl0ZW1zLmxhbmdJZCkgPz8gJ3J1JztcclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gJycsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICB0ZXh0LFxyXG4gICAgICAgICAgICBpY29uLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBpY29uLCB0eXBlLCBjbGFzc05hbWUgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxidXR0b24gdGhpcz0nX3VpX2J1dHRvbicgY2xhc3NOYW1lPXtgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWB9PlxyXG4gICAgICAgICAgICAgICAge3RoaXMuX3VpX2ljb24oaWNvbil9XHJcbiAgICAgICAgICAgICAgICB7dGV4dH1cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfaWNvbiA9IChpY29uKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGljb24gPyA8aSBjbGFzc05hbWU9e2BiaSBiaS0ke2ljb259YH0+PC9pPiA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLl9wcm9wLnRleHQsXHJcbiAgICAgICAgICAgIGljb24gPSB0aGlzLl9wcm9wLmljb24sXHJcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLl9wcm9wLnR5cGUsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IHRoaXMuX3Byb3AuY2xhc3NOYW1lXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi5pbm5lckhUTUwgPSBgJHt0aGlzLl91aV9pY29uKGljb24pID8/ICcnfSR7dGV4dH1gO1xyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi5jbGFzc05hbWUgPSBgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWA7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdPcHRpb24gMScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdvcHRpb24xJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB2YWx1ZSA9ICdvcHRpb24xJyxcclxuICAgICAgICAgICAgb25DaGFuZ2UgPSAodmFsdWUpID0+IHsgY29uc29sZS5sb2codmFsdWUpIH0sXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBvcHRpb25zLFxyXG4gICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgb25DaGFuZ2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHZhbHVlLCBvbkNoYW5nZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfb3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWxlY3QgdGhpcz0nX3VpX3NlbGVjdCcgY2xhc3NOYW1lPSdmb3JtLXNlbGVjdCcgb25jaGFuZ2U9e2UgPT4gb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfT5cclxuICAgICAgICAgICAgICAgIHtvcHRpb25zLm1hcChvcHRpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVpT3B0ID0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbi52YWx1ZX0gc2VsZWN0ZWQ9e3ZhbHVlID09PSBvcHRpb24udmFsdWV9PntvcHRpb24ubGFiZWx9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfb3B0aW9ucy5wdXNoKHVpT3B0KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlPcHQ7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUxhYmVscyA9IChsYWJlbHMpID0+IHtcclxuICAgICAgICBpZiAobGFiZWxzLmxlbmd0aCAhPT0gdGhpcy5fcHJvcC5vcHRpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIHNlbGVjdFxcJ3Mgb3B0aW9ucyBsYWJlbHMhXFxcclxuICAgICAgICAgICAgICAgICBMYWJlbHMgYXJyYXkgaXMgaW5jb21wYXRpYmxlIHdpdGggc2VsZWN0XFwnIG9wdGlvbnMgYXJyYXkuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX29wdGlvbnMuZm9yRWFjaCgodWlPcHRpb24sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHVpT3B0aW9uLmlubmVySFRNTCA9IGxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuICAgIF9ldmVudExpc3QgPSB7fTtcclxuXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgJ2V2ZW50MSc6IFtcclxuICAgIC8vICAgICAgICAgZjEsXHJcbiAgICAvLyAgICAgICAgIGYyXHJcbiAgICAvLyAgICAgXSxcclxuICAgIC8vICAgICAnZXZlbnQyJzogW1xyXG4gICAgLy8gICAgICAgICBmM1xyXG4gICAgLy8gICAgIF1cclxuICAgIC8vIH1cclxuXHJcbiAgICBzdWJzY3JpYmUgPSAobmFtZSwgbGlzdGVuZXIpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2V2ZW50TGlzdFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBhcmdzID0ge30pID0+IHtcclxuICAgICAgICBpZiAodGhpcy5fZXZlbnRMaXN0Lmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXS5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBjb21tb25FdmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKCk7IC8vIHNpbmdsZXRvblxyXG5leHBvcnQgeyBFdmVudE1hbmFnZXIgfTsgLy8gY2xhc3NcclxuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBjaGFuZ2VMYW5nOiAnY2hhbmdlTGFuZydcclxufSk7XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgICd0YXNrX21hbmFnZXInOiAn0JzQtdC90LXQtNC20LXRgCDQt9Cw0LTQsNGHJyxcclxuICAgICdsb2dpbic6ICfQktGF0L7QtCcsXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ9Cf0LDRgNC+0LvRjCcsXHJcbiAgICAndG9fbG9naW4nOiAn0JLQvtC50YLQuCcsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAn0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPJyxcclxuICAgICdub19hY2NvdW50X3F1ZXN0aW9uJzogJ9Cd0LXRgiDQsNC60LrQsNGD0L3RgtCwPycsXHJcbiAgICAndG9fbG9nX291dCc6ICfQktGL0LnRgtC4JyxcclxuICAgICdyZWdpc3RyYXRpb24nOiAn0KDQtdCz0LjRgdGC0YDQsNGG0LjRjycsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ9Cf0L7QstGC0L7RgNC40YLQtSDQv9Cw0YDQvtC70YwnLFxyXG4gICAgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJzogJ9Cj0LbQtSDQtdGB0YLRjCDQsNC60LrQsNGD0L3Rgj8nLFxyXG4gICAgJ2VkaXRpbmcnOiAn0KDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtScsXHJcbiAgICAndGFza19uYW1lJzogJ9Cd0LDQt9Cy0LDQvdC40LUg0LfQsNC00LDRh9C4JyxcclxuICAgICdteV90YXNrJzogJ9Cc0L7RjyDQt9Cw0LTQsNGH0LAnLFxyXG4gICAgJ2RlYWRsaW5lJzogJ9CU0LXQtNC70LDQudC9JyxcclxuICAgICdpbXBvcnRhbnRfdGFzayc6ICfQktCw0LbQvdCw0Y8g0LfQsNC00LDRh9CwJyxcclxuICAgICdjYW5jZWwnOiAn0J7RgtC80LXQvdCwJyxcclxuICAgICd0b19zYXZlJzogJ9Ch0L7RhdGA0LDQvdC40YLRjCcsXHJcbiAgICAncnUnOiAn0KDRg9GB0YHQutC40LknLFxyXG4gICAgJ2VuJzogJ9CQ0L3Qs9C70LjQudGB0LrQuNC5J1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAndGFza19tYW5hZ2VyJzogJ1Rhc2sgbWFuYWdlcicsXHJcbiAgICAnbG9naW4nOiAnTG9naW4nLFxyXG4gICAgJ2VtYWlsJzogJ0UtbWFpbCcsXHJcbiAgICAnc29tZWJvZHlfZW1haWwnOiAnc29tZWJvZHlAZ21haWwuY29tJyxcclxuICAgICdwYXNzd29yZCc6ICdQYXNzd29yZCcsXHJcbiAgICAndG9fbG9naW4nOiAnTG9nIGluJyxcclxuICAgICd0b19yZWdpc3Rlcic6ICdSZWdpc3RlcicsXHJcbiAgICAnbm9fYWNjb3VudF9xdWVzdGlvbic6ICdObyBhY2NvdW50PycsXHJcbiAgICAndG9fbG9nX291dCc6ICdMb2cgb3V0JyxcclxuICAgICdyZWdpc3RyYXRpb24nOiAnUmVnaXN0cmF0aW9uJyxcclxuICAgICdyZXBlYXRfcGFzc3dvcmQnOiAnUmVwZWF0IHBhc3N3b3JkJyxcclxuICAgICdhbHJlYWR5X2hhdmVfYWNjb3VudF9xdWVzdGlvbic6ICdIYXZlIGdvdCBhbiBhY2NvdW50PycsXHJcbiAgICAnZWRpdGluZyc6ICdFZGl0aW5nJyxcclxuICAgICd0YXNrX25hbWUnOiAnVGFzayBuYW1lJyxcclxuICAgICdteV90YXNrJzogJ015IHRhc2snLFxyXG4gICAgJ2RlYWRsaW5lJzogJ0RlYWRsaW5lJyxcclxuICAgICdpbXBvcnRhbnRfdGFzayc6ICdJbXBvcnRhbnQgdGFzaycsXHJcbiAgICAnY2FuY2VsJzogJ0NhbmNlbCcsXHJcbiAgICAndG9fc2F2ZSc6ICdTYXZlJyxcclxuICAgICdydSc6ICdSdXNzaWFuJyxcclxuICAgICdlbic6ICdFbmdsaXNoJyxcclxufTtcclxuIiwiaW1wb3J0IFJVIGZyb20gJy4vdDluLnJ1JztcclxuaW1wb3J0IEVOIGZyb20gJy4vdDluLmVuJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IChsYW5kSWQsIGNvZGUpID0+IHtcclxuICAgIGlmIChjb2RlID09IG51bGwgfHwgY29kZS5sZW5ndGggPT09IDApIHJldHVybiAnJztcclxuXHJcbiAgICBpZiAoIVsncnUnLCAnZW4nXS5pbmNsdWRlcyhsYW5kSWQpKSB7XHJcbiAgICAgICAgbGFuZElkID0gJ3J1JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAobGFuZElkID09PSAncnUnICYmIFJVW2NvZGVdKSByZXR1cm4gUlVbY29kZV07XHJcbiAgICBpZiAobGFuZElkID09PSAnZW4nICYmIEVOW2NvZGVdKSByZXR1cm4gRU5bY29kZV07XHJcblxyXG4gICAgcmV0dXJuIGNvZGU7XHJcbn1cclxuIiwiaW1wb3J0IFNlbGVjdCBmcm9tIFwiLi4vYXRvbS9zZWxlY3RcIjtcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tIFwiLi4vdXRpbHMvY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNvbW1vbkV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi91dGlscy9ldmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi4vdXRpbHMvZXZlbnRzXCI7XHJcbmltcG9ydCB0OW4gZnJvbSBcIi4uL3V0aWxzL3Q5bi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0TGFuZyB7XHJcbiAgICBfbGFuZ0lkcyA9IFsncnUnLCAnZW4nXTtcclxuICAgIF9sYW5nVDluS2V5cyA9IFsncnUnLCAnZW4nXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2xhbmdMYWJlbHMgPSAobGFuZ0lkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmdUOW5LZXlzLm1hcCh0OW5LZXkgPT4gdDluKGxhbmdJZCwgdDluS2V5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLl9sYW5nTGFiZWxzKGRlZmF1bHRMYW5nKTtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fbGFuZ0lkcy5tYXAoKGxhbmdJZCwgaW5kZXgpID0+ICh7XHJcbiAgICAgICAgICAgIHZhbHVlOiBsYW5nSWQsXHJcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbHNbaW5kZXhdXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8U2VsZWN0IHRoaXM9J191aV9zZWxlY3QnIG9wdGlvbnM9e29wdGlvbnN9IHZhbHVlPXtkZWZhdWx0TGFuZ30gXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17bGFuZ0lkID0+IGNvbW1vbkV2ZW50TWFuYWdlci5kaXNwYXRjaChldmVudHMuY2hhbmdlTGFuZywgbGFuZ0lkKX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdGhpcy5fbGFuZ0xhYmVscyhsYW5nKTtcclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlTGFiZWxzKGxhYmVscyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2F0b20vYnV0dG9uJztcclxuaW1wb3J0IFNlbGVjdExhbmcgZnJvbSAnLi9zZWxlY3RMYW5nJztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCA9IGZhbHNlIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgYXV0aG9yaXplZCB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMSB0aGlzPSdfdWlfaDEnIGNsYXNzTmFtZT0nbWUtNSc+e3Q5bihkZWZhdWx0TGFuZywgJ3Rhc2tfbWFuYWdlcicpfTwvaDE+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxTZWxlY3RMYW5nIHRoaXM9J191aV9zZWxlY3QnIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsgYXV0aG9yaXplZCAmJiBcclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idG4nIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9J21zLWF1dG8nIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX2xvZ19vdXQnKX0gLz4gfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX3NlbGVjdC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfaDEudGV4dENvbnRlbnQgPSB0OW4obGFuZywgJ3Rhc2tfbWFuYWdlcicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2J0biAmJiB0aGlzLl91aV9idG4udXBkYXRlKHtcclxuICAgICAgICAgICAgdGV4dDogdDluKGxhbmcsICd0b19sb2dfb3V0JylcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjb21tb25FdmVudE1hbmFnZXIgfSBmcm9tIFwiLi9ldmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IGxvY2FsU3RvcmFnZUl0ZW1zIGZyb20gXCIuL2xvY2FsU3RvcmFnZUl0ZW1zXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihldmVudE1hbmFnZXIgPSBjb21tb25FdmVudE1hbmFnZXIpIHtcclxuICAgICAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKGV2ZW50cy5jaGFuZ2VMYW5nLCBsYW5nID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoeyBsYW5nIH0pO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShsb2NhbFN0b3JhZ2VJdGVtcy5sYW5nSWQsIGxhbmcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEhlYWRlciBmcm9tICcuLi93aWRnZXQvaGVhZGVyJztcclxuaW1wb3J0IExvY2FsaXplZFBhZ2UgZnJvbSAnLi9sb2NhbGl6ZWRQYWdlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdpdGhIZWFkZXIgZXh0ZW5kcyBMb2NhbGl6ZWRQYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIGVsZW0pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgPSBmYWxzZSB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIGF1dGhvcml6ZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl91aV9lbGVtID0gZWxlbTtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhcHAtYm9keSc+XHJcbiAgICAgICAgICAgICAgICA8SGVhZGVyIHRoaXM9J191aV9oZWFkZXInIGF1dGhvcml6ZWQ9e2F1dGhvcml6ZWR9IC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyIGNlbnRlcmVkJz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5fdWlfZWxlbX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5fdWlfaGVhZGVyLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLl91aV9lbGVtLnVwZGF0ZShkYXRhKTtcclxuICAgIH1cclxufTtcclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hlY2tib3gge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSAnJyxcclxuICAgICAgICAgICAga2V5ID0gJ3VuZGVmaW5lZCcsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgICAga2V5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhYmVsLCBrZXkgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYmFzZS1jaGVjay0ke2tleX1gO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9J2Zvcm0tY2hlY2snPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHRoaXM9J191aV9sYWJlbCcgZm9yPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tY2hlY2stbGFiZWwnPntsYWJlbH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9J2NoZWNrYm94JyBpZD17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNoZWNrLWlucHV0JyAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5fcHJvcC5sYWJlbCxcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfbGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYWJlbCA9ICcnLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9ICcnLFxyXG4gICAgICAgICAgICBrZXkgPSAndW5kZWZpbmVkJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcixcclxuICAgICAgICAgICAga2V5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhYmVsLCBwbGFjZWhvbGRlciwga2V5IH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dElkID0gYGJhc2UtaW5wdXQtJHtrZXl9YDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHRoaXM9J191aV9sYWJlbCcgZm9yPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tbGFiZWwnPntsYWJlbH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHRoaXM9J191aV9pbnB1dCcgdHlwZT0ndGV4dCcgaWQ9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1jb250cm9sJyBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSB0aGlzLl9wcm9wLmxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9IHRoaXMuX3Byb3AucGxhY2Vob2xkZXJcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfbGFiZWwudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICB0aGlzLl91aV9pbnB1dC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBDaGVja2JveCBmcm9tICcuLi9hdG9tL2NoZWNrYm94JztcclxuaW1wb3J0IElucHV0IGZyb20gJy4uL2F0b20vaW5wdXQnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRGb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfdGFza19uYW1lJyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAndGFza19uYW1lJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dDluKGRlZmF1bHRMYW5nLCAnbXlfdGFzaycpfSBrZXk9XCJ0YXNrLW5hbWVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfZGVhZGxpbmUnIGxhYmVsPXt0OW4oZGVmYXVsdExhbmcsICdkZWFkbGluZScpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjAxLjAxLjIwMjVcIiBrZXk9XCJkZWFkbGluZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPENoZWNrYm94IHRoaXM9J191aV9jaGVja2JveCcgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ2ltcG9ydGFudF90YXNrJyl9IGtleT1cImltcG9ydGFudC10YXNrXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0aGlzPSdfdWlfYnRuX2NhbmNlbCcgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAnY2FuY2VsJyl9IHR5cGU9XCJzZWNvbmRhcnlcIiBjbGFzc05hbWU9XCJ3LTEwMFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idG5fc2F2ZScgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAndG9fc2F2ZScpfSB0eXBlPVwicHJpbWFyeVwiIGNsYXNzTmFtZT1cInctMTAwXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfdGFza19uYW1lLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ3Rhc2tfbmFtZScpLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdDluKGxhbmcsICdteV90YXNrJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9pbnB1dF9kZWFkbGluZS51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdkZWFkbGluZScpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2NoZWNrYm94LnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ2ltcG9ydGFudF90YXNrJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9idG5fY2FuY2VsLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAnY2FuY2VsJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9idG5fc2F2ZS51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX3NhdmUnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gXCIuLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lc1wiO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gXCIuL3V0aWxzL2NvbnN0YW50cy5qc1wiO1xyXG5pbXBvcnQgV2l0aEhlYWRlciBmcm9tIFwiLi91dGlscy93aXRoSGVhZGVyLmpzXCI7XHJcbmltcG9ydCBFZGl0Rm9ybSBmcm9tIFwiLi93aWRnZXQvZWRpdEZvcm0uanNcIjtcclxuaW1wb3J0IHQ5biBmcm9tIFwiLi91dGlscy90OW4vaW5kZXguanNcIjtcclxuXHJcbmNsYXNzIEVkaXQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGgxIHRoaXM9J191aV9oMScgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+e3Q5bihkZWZhdWx0TGFuZywgJ2VkaXRpbmcnKX08L2gxPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8RWRpdEZvcm0gdGhpcz0nX3VpX2VkaXRfZm9ybScgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9oMS5pbm5lckhUTUwgPSB0OW4obGFuZywgJ2VkaXRpbmcnKTtcclxuICAgICAgICB0aGlzLl91aV9lZGl0X2Zvcm0udXBkYXRlKGRhdGEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb3VudChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSxcclxuICAgIDxXaXRoSGVhZGVyIGF1dGhvcml6ZWQ+XHJcbiAgICAgIDxFZGl0Lz5cclxuICAgIDwvV2l0aEhlYWRlcj5cclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiT2JqZWN0IiwiZnJlZXplIiwibGFuZ0lkIiwiZGVmYXVsdExhbmciLCJfbG9jYWxTdG9yYWdlJGdldEl0ZW0iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwibG9jYWxTdG9yYWdlSXRlbXMiLCJCdXR0b24iLCJfY3JlYXRlQ2xhc3MiLCJfdGhpcyIsInNldHRpbmdzIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiX2NsYXNzQ2FsbENoZWNrIiwiX2RlZmluZVByb3BlcnR5IiwiX3RoaXMkX3Byb3AiLCJfcHJvcCIsImljb24iLCJjb25jYXQiLCJfdWlfaWNvbiIsImRhdGEiLCJfdGhpcyRfdWlfaWNvbiIsIl9kYXRhJHRleHQiLCJfZGF0YSRpY29uIiwiX2RhdGEkdHlwZSIsIl9kYXRhJGNsYXNzTmFtZSIsIl91aV9idXR0b24iLCJpbm5lckhUTUwiLCJfc2V0dGluZ3MkdGV4dCIsIl9zZXR0aW5ncyRpY29uIiwiX3NldHRpbmdzJHR5cGUiLCJfc2V0dGluZ3MkY2xhc3NOYW1lIiwiX3VpX3JlbmRlciIsIlNlbGVjdCIsIm9wdGlvbnMiLCJvbkNoYW5nZSIsIl91aV9vcHRpb25zIiwib25jaGFuZ2UiLCJlIiwidGFyZ2V0IiwibWFwIiwib3B0aW9uIiwidWlPcHQiLCJzZWxlY3RlZCIsImxhYmVsIiwicHVzaCIsImxhYmVscyIsImNvbnNvbGUiLCJlcnJvciIsImZvckVhY2giLCJ1aU9wdGlvbiIsImluZGV4IiwiX3NldHRpbmdzJG9wdGlvbnMiLCJfc2V0dGluZ3MkdmFsdWUiLCJfc2V0dGluZ3Mkb25DaGFuZ2UiLCJsb2ciLCJFdmVudE1hbmFnZXIiLCJuYW1lIiwibGlzdGVuZXIiLCJfZXZlbnRMaXN0IiwiaGFzT3duUHJvcGVydHkiLCJjb21tb25FdmVudE1hbmFnZXIiLCJjaGFuZ2VMYW5nIiwibGFuZElkIiwiY29kZSIsImluY2x1ZGVzIiwiUlUiLCJFTiIsIlNlbGVjdExhbmciLCJfbGFuZ1Q5bktleXMiLCJ0OW5LZXkiLCJ0OW4iLCJfbGFuZ0xhYmVscyIsIl9sYW5nSWRzIiwiZGlzcGF0Y2giLCJldmVudHMiLCJfZGF0YSRsYW5nIiwibGFuZyIsIl91aV9zZWxlY3QiLCJ1cGRhdGVMYWJlbHMiLCJIZWFkZXIiLCJhdXRob3JpemVkIiwidXBkYXRlIiwiX3VpX2gxIiwidGV4dENvbnRlbnQiLCJfdWlfYnRuIiwiX3NldHRpbmdzJGF1dGhvcml6ZWQiLCJfZGVmYXVsdCIsImV2ZW50TWFuYWdlciIsInN1YnNjcmliZSIsInNldEl0ZW0iLCJXaXRoSGVhZGVyIiwiX0xvY2FsaXplZFBhZ2UiLCJlbGVtIiwiX2NhbGxTdXBlciIsIl91aV9lbGVtIiwiX3VpX2hlYWRlciIsIl9pbmhlcml0cyIsIkxvY2FsaXplZFBhZ2UiLCJDaGVja2JveCIsImlucHV0SWQiLCJfZGF0YSRsYWJlbCIsIl91aV9sYWJlbCIsIl9zZXR0aW5ncyRsYWJlbCIsIl9zZXR0aW5ncyRrZXkiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwiX2RhdGEkcGxhY2Vob2xkZXIiLCJfdWlfaW5wdXQiLCJfc2V0dGluZ3MkcGxhY2Vob2xkZXIiLCJFZGl0Rm9ybSIsIl91aV9pbnB1dF90YXNrX25hbWUiLCJfdWlfaW5wdXRfZGVhZGxpbmUiLCJfdWlfY2hlY2tib3giLCJfdWlfYnRuX2NhbmNlbCIsIl91aV9idG5fc2F2ZSIsIkVkaXQiLCJfdWlfZWRpdF9mb3JtIiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFNBQVNBLGFBQWFBLENBQUNDLEtBQUssRUFBRUMsRUFBRSxFQUFFO0VBQ2hDLE1BQU07SUFBRUMsR0FBRztJQUFFQyxFQUFFO0FBQUVDLElBQUFBO0FBQVUsR0FBQyxHQUFHQyxLQUFLLENBQUNMLEtBQUssQ0FBQztBQUMzQyxFQUFBLE1BQU1NLE9BQU8sR0FBR0wsRUFBRSxHQUNkTSxRQUFRLENBQUNDLGVBQWUsQ0FBQ1AsRUFBRSxFQUFFQyxHQUFHLENBQUMsR0FDakNLLFFBQVEsQ0FBQ1IsYUFBYSxDQUFDRyxHQUFHLENBQUM7QUFFL0IsRUFBQSxJQUFJQyxFQUFFLEVBQUU7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
