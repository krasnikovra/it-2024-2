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
    _this._ui_a.textContent = text;
    _this._ui_a.href = href;
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
      className: 'w-100',
      type: 'primary'
    })));
  });
  _defineProperty(this, "update", function (data) {
    var lang = data.lang;
    _this._ui_login_and_pass_form.update(data);
    _this._ui_link.update({
      text: t9n(lang, 'to_register')
    });
    _this._ui_span.textContent = t9n(lang, 'no_account_question');
    _this._ui_button.update({
      text: t9n(lang, 'to_login')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9idXR0b24uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2F0b20vbGluay5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9pbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5ydS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5lbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvbG9naW5BbmRQYXNzRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2xvZ2luRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvc2VsZWN0TGFuZy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2hlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxpemVkUGFnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvd2l0aEhlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvbG9naW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gJycsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICB0ZXh0LFxyXG4gICAgICAgICAgICBpY29uLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBpY29uLCB0eXBlLCBjbGFzc05hbWUgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxidXR0b24gdGhpcz0nX3VpX2J1dHRvbicgY2xhc3NOYW1lPXtgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWB9PlxyXG4gICAgICAgICAgICAgICAge3RoaXMuX3VpX2ljb24oaWNvbil9XHJcbiAgICAgICAgICAgICAgICB7dGV4dH1cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfaWNvbiA9IChpY29uKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGljb24gPyA8aSBjbGFzc05hbWU9e2BiaSBiaS0ke2ljb259YH0+PC9pPiA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLl9wcm9wLnRleHQsXHJcbiAgICAgICAgICAgIGljb24gPSB0aGlzLl9wcm9wLmljb24sXHJcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLl9wcm9wLnR5cGUsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IHRoaXMuX3Byb3AuY2xhc3NOYW1lXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi5pbm5lckhUTUwgPSBgJHt0aGlzLl91aV9pY29uKGljb24pID8/ICcnfSR7dGV4dH1gO1xyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi5jbGFzc05hbWUgPSBgYnRuIGJ0bi0ke3R5cGV9ICR7Y2xhc3NOYW1lfWA7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gJycsXHJcbiAgICAgICAgICAgIGhyZWYgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGhyZWZcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRleHQsIGhyZWYgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhIHRoaXM9J191aV9hJyBocmVmPXtocmVmfT57dGV4dH08L2E+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMuX3Byb3AudGV4dCxcclxuICAgICAgICAgICAgaHJlZiA9IHRoaXMuX3Byb3AuaHJlZlxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9hLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICB0aGlzLl91aV9hLmhyZWYgPSBocmVmO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJycsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJycsXHJcbiAgICAgICAgICAgIGtleSA9ICd1bmRlZmluZWQnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgbGFiZWwsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICBrZXlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFiZWwsIHBsYWNlaG9sZGVyLCBrZXkgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYmFzZS1pbnB1dC0ke2tleX1gO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgdGhpcz0nX3VpX2xhYmVsJyBmb3I9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1sYWJlbCc+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdGhpcz0nX3VpX2lucHV0JyB0eXBlPSd0ZXh0JyBpZD17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNvbnRyb2wnIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYWJlbCA9IHRoaXMuX3Byb3AubGFiZWwsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gdGhpcy5fcHJvcC5wbGFjZWhvbGRlclxyXG4gICAgICAgIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9sYWJlbC50ZXh0Q29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIHRoaXMuX3VpX2lucHV0LnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgJ3Rhc2tfbWFuYWdlcic6ICfQnNC10L3QtdC00LbQtdGAINC30LDQtNCw0YcnLFxyXG4gICAgJ2xvZ2luJzogJ9CS0YXQvtC0JyxcclxuICAgICdlbWFpbCc6ICdFLW1haWwnLFxyXG4gICAgJ3NvbWVib2R5X2VtYWlsJzogJ3NvbWVib2R5QGdtYWlsLmNvbScsXHJcbiAgICAncGFzc3dvcmQnOiAn0J/QsNGA0L7Qu9GMJyxcclxuICAgICd0b19sb2dpbic6ICfQktC+0LnRgtC4JyxcclxuICAgICd0b19yZWdpc3Rlcic6ICfQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y8nLFxyXG4gICAgJ25vX2FjY291bnRfcXVlc3Rpb24nOiAn0J3QtdGCINCw0LrQutCw0YPQvdGC0LA/JyxcclxuICAgICd0b19sb2dfb3V0JzogJ9CS0YvQudGC0LgnLFxyXG4gICAgJ3JlZ2lzdHJhdGlvbic6ICfQoNC10LPQuNGB0YLRgNCw0YbQuNGPJyxcclxuICAgICdyZXBlYXRfcGFzc3dvcmQnOiAn0J/QvtCy0YLQvtGA0LjRgtC1INC/0LDRgNC+0LvRjCcsXHJcbiAgICAnYWxyZWFkeV9oYXZlX2FjY291bnRfcXVlc3Rpb24nOiAn0KPQttC1INC10YHRgtGMINCw0LrQutCw0YPQvdGCPycsXHJcbiAgICAnZWRpdGluZyc6ICfQoNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1JyxcclxuICAgICd0YXNrX25hbWUnOiAn0J3QsNC30LLQsNC90LjQtSDQt9Cw0LTQsNGH0LgnLFxyXG4gICAgJ215X3Rhc2snOiAn0JzQvtGPINC30LDQtNCw0YfQsCcsXHJcbiAgICAnZGVhZGxpbmUnOiAn0JTQtdC00LvQsNC50L0nLFxyXG4gICAgJ2ltcG9ydGFudF90YXNrJzogJ9CS0LDQttC90LDRjyDQt9Cw0LTQsNGH0LAnLFxyXG4gICAgJ2NhbmNlbCc6ICfQntGC0LzQtdC90LAnLFxyXG4gICAgJ3RvX3NhdmUnOiAn0KHQvtGF0YDQsNC90LjRgtGMJyxcclxuICAgICdydSc6ICfQoNGD0YHRgdC60LjQuScsXHJcbiAgICAnZW4nOiAn0JDQvdCz0LvQuNC50YHQutC40LknXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgICd0YXNrX21hbmFnZXInOiAnVGFzayBtYW5hZ2VyJyxcclxuICAgICdsb2dpbic6ICdMb2dpbicsXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ1Bhc3N3b3JkJyxcclxuICAgICd0b19sb2dpbic6ICdMb2cgaW4nLFxyXG4gICAgJ3RvX3JlZ2lzdGVyJzogJ1JlZ2lzdGVyJyxcclxuICAgICdub19hY2NvdW50X3F1ZXN0aW9uJzogJ05vIGFjY291bnQ/JyxcclxuICAgICd0b19sb2dfb3V0JzogJ0xvZyBvdXQnLFxyXG4gICAgJ3JlZ2lzdHJhdGlvbic6ICdSZWdpc3RyYXRpb24nLFxyXG4gICAgJ3JlcGVhdF9wYXNzd29yZCc6ICdSZXBlYXQgcGFzc3dvcmQnLFxyXG4gICAgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJzogJ0hhdmUgZ290IGFuIGFjY291bnQ/JyxcclxuICAgICdlZGl0aW5nJzogJ0VkaXRpbmcnLFxyXG4gICAgJ3Rhc2tfbmFtZSc6ICdUYXNrIG5hbWUnLFxyXG4gICAgJ215X3Rhc2snOiAnTXkgdGFzaycsXHJcbiAgICAnZGVhZGxpbmUnOiAnRGVhZGxpbmUnLFxyXG4gICAgJ2ltcG9ydGFudF90YXNrJzogJ0ltcG9ydGFudCB0YXNrJyxcclxuICAgICdjYW5jZWwnOiAnQ2FuY2VsJyxcclxuICAgICd0b19zYXZlJzogJ1NhdmUnLFxyXG4gICAgJ3J1JzogJ1J1c3NpYW4nLFxyXG4gICAgJ2VuJzogJ0VuZ2xpc2gnLFxyXG59O1xyXG4iLCJpbXBvcnQgUlUgZnJvbSAnLi90OW4ucnUnO1xyXG5pbXBvcnQgRU4gZnJvbSAnLi90OW4uZW4nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgKGxhbmRJZCwgY29kZSkgPT4ge1xyXG4gICAgaWYgKGNvZGUgPT0gbnVsbCB8fCBjb2RlLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xyXG5cclxuICAgIGlmICghWydydScsICdlbiddLmluY2x1ZGVzKGxhbmRJZCkpIHtcclxuICAgICAgICBsYW5kSWQgPSAncnUnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChsYW5kSWQgPT09ICdydScgJiYgUlVbY29kZV0pIHJldHVybiBSVVtjb2RlXTtcclxuICAgIGlmIChsYW5kSWQgPT09ICdlbicgJiYgRU5bY29kZV0pIHJldHVybiBFTltjb2RlXTtcclxuXHJcbiAgICByZXR1cm4gY29kZTtcclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBPYmplY3QuZnJlZXplKHtcclxuICAgIGxhbmdJZDogJ2xhbmdJZCdcclxufSk7XHJcbiIsImltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tIFwiLi9sb2NhbFN0b3JhZ2VJdGVtc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRMYW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMubGFuZ0lkKSA/PyAncnUnO1xyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9hdG9tL2lucHV0JztcclxuaW1wb3J0IHQ5biBmcm9tICcuLi91dGlscy90OW4vaW5kZXgnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dpbkFuZFBhc3NGb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWItMyc+XHJcbiAgICAgICAgICAgICAgICAgICAgPElucHV0IHRoaXM9J191aV9pbnB1dF9lbWFpbCcgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ2VtYWlsJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3Q5bihkZWZhdWx0TGFuZywgJ3NvbWVib2R5X2VtYWlsJyl9IGtleT1cImUtbWFpbFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfcHdkJyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAncGFzc3dvcmQnKX0gcGxhY2Vob2xkZXI9JyoqKioqKioqJyBrZXk9XCJwd2RcIi8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfZW1haWwudXBkYXRlKHtcclxuICAgICAgICAgICAgbGFiZWw6IHQ5bihsYW5nLCAnZW1haWwnKSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHQ5bihsYW5nLCAnc29tZWJvZHlfZW1haWwnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2lucHV0X3B3ZC51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdwYXNzd29yZCcpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBMaW5rIGZyb20gJy4uL2F0b20vbGluayc7XHJcbmltcG9ydCBMb2dpbkFuZFBhc3NGb3JtIGZyb20gJy4vbG9naW5BbmRQYXNzRm9ybSc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9naW5Gb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWItNCc+XHJcbiAgICAgICAgICAgICAgICAgICAgPExvZ2luQW5kUGFzc0Zvcm0gdGhpcz0nX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0nIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHRoaXM9J191aV9zcGFuJz57dDluKGRlZmF1bHRMYW5nLCAnbm9fYWNjb3VudF9xdWVzdGlvbicpfTwvc3Bhbj4mbmJzcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRoaXM9J191aV9saW5rJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICd0b19yZWdpc3RlcicpfSBocmVmPScuL3JlZ2lzdGVyLmh0bWwnIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPlxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdGhpcz0nX3VpX2J1dHRvbicgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAndG9fbG9naW4nKX0gY2xhc3NOYW1lPSd3LTEwMCcgdHlwZT0ncHJpbWFyeScgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLl91aV9saW5rLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fcmVnaXN0ZXInKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9zcGFuLnRleHRDb250ZW50ID0gdDluKGxhbmcsICdub19hY2NvdW50X3F1ZXN0aW9uJyk7XHJcbiAgICAgICAgdGhpcy5fdWlfYnV0dG9uLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fbG9naW4nKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBvcHRpb25zID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnT3B0aW9uIDEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnb3B0aW9uMSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgdmFsdWUgPSAnb3B0aW9uMScsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlID0gKHZhbHVlKSA9PiB7IGNvbnNvbGUubG9nKHZhbHVlKSB9LFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgb3B0aW9ucyxcclxuICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBvcHRpb25zLCB2YWx1ZSwgb25DaGFuZ2UgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX29wdGlvbnMgPSBbXTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8c2VsZWN0IHRoaXM9J191aV9zZWxlY3QnIGNsYXNzTmFtZT0nZm9ybS1zZWxlY3QnIG9uY2hhbmdlPXtlID0+IG9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX0+XHJcbiAgICAgICAgICAgICAgICB7b3B0aW9ucy5tYXAob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1aU9wdCA9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb24udmFsdWV9IHNlbGVjdGVkPXt2YWx1ZSA9PT0gb3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpX29wdGlvbnMucHVzaCh1aU9wdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpT3B0O1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMYWJlbHMgPSAobGFiZWxzKSA9PiB7XHJcbiAgICAgICAgaWYgKGxhYmVscy5sZW5ndGggIT09IHRoaXMuX3Byb3Aub3B0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHVwZGF0ZSBzZWxlY3RcXCdzIG9wdGlvbnMgbGFiZWxzIVxcXHJcbiAgICAgICAgICAgICAgICAgTGFiZWxzIGFycmF5IGlzIGluY29tcGF0aWJsZSB3aXRoIHNlbGVjdFxcJyBvcHRpb25zIGFycmF5LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91aV9vcHRpb25zLmZvckVhY2goKHVpT3B0aW9uLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB1aU9wdGlvbi5pbm5lckhUTUwgPSBsYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIEV2ZW50TWFuYWdlciB7XHJcbiAgICBfZXZlbnRMaXN0ID0ge307XHJcblxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgICdldmVudDEnOiBbXHJcbiAgICAvLyAgICAgICAgIGYxLFxyXG4gICAgLy8gICAgICAgICBmMlxyXG4gICAgLy8gICAgIF0sXHJcbiAgICAvLyAgICAgJ2V2ZW50Mic6IFtcclxuICAgIC8vICAgICAgICAgZjNcclxuICAgIC8vICAgICBdXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc3Vic2NyaWJlID0gKG5hbWUsIGxpc3RlbmVyKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9ldmVudExpc3RbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0ucHVzaChsaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2ggPSAobmFtZSwgYXJncyA9IHt9KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TGlzdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0uZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGFyZ3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgY29tbW9uRXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcigpOyAvLyBzaW5nbGV0b25cclxuZXhwb3J0IHsgRXZlbnRNYW5hZ2VyIH07IC8vIGNsYXNzXHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgY2hhbmdlTGFuZzogJ2NoYW5nZUxhbmcnXHJcbn0pO1xyXG4iLCJpbXBvcnQgU2VsZWN0IGZyb20gXCIuLi9hdG9tL3NlbGVjdFwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gXCIuLi91dGlscy9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgY29tbW9uRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL2V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuLi91dGlscy9ldmVudHNcIjtcclxuaW1wb3J0IHQ5biBmcm9tIFwiLi4vdXRpbHMvdDluL2luZGV4XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RMYW5nIHtcclxuICAgIF9sYW5nSWRzID0gWydydScsICdlbiddO1xyXG4gICAgX2xhbmdUOW5LZXlzID0gWydydScsICdlbiddO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfbGFuZ0xhYmVscyA9IChsYW5nSWQpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGFuZ1Q5bktleXMubWFwKHQ5bktleSA9PiB0OW4obGFuZ0lkLCB0OW5LZXkpKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxhYmVscyA9IHRoaXMuX2xhbmdMYWJlbHMoZGVmYXVsdExhbmcpO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9sYW5nSWRzLm1hcCgobGFuZ0lkLCBpbmRleCkgPT4gKHtcclxuICAgICAgICAgICAgdmFsdWU6IGxhbmdJZCxcclxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsc1tpbmRleF1cclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxTZWxlY3QgdGhpcz0nX3VpX3NlbGVjdCcgb3B0aW9ucz17b3B0aW9uc30gdmFsdWU9e2RlZmF1bHRMYW5nfSBcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtsYW5nSWQgPT4gY29tbW9uRXZlbnRNYW5hZ2VyLmRpc3BhdGNoKGV2ZW50cy5jaGFuZ2VMYW5nLCBsYW5nSWQpfSAvPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLl9sYW5nTGFiZWxzKGxhbmcpO1xyXG4gICAgICAgIHRoaXMuX3VpX3NlbGVjdC51cGRhdGVMYWJlbHMobGFiZWxzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vYXRvbS9idXR0b24nO1xyXG5pbXBvcnQgU2VsZWN0TGFuZyBmcm9tICcuL3NlbGVjdExhbmcnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkID0gZmFsc2UgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyBhdXRob3JpemVkIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGgxIHRoaXM9J191aV9oMScgY2xhc3NOYW1lPSdtZS01Jz57dDluKGRlZmF1bHRMYW5nLCAndGFza19tYW5hZ2VyJyl9PC9oMT5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPFNlbGVjdExhbmcgdGhpcz0nX3VpX3NlbGVjdCcgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgeyBhdXRob3JpemVkICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdGhpcz0nX3VpX2J0bicgdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT0nbXMtYXV0bycgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAndG9fbG9nX291dCcpfSAvPiB9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfc2VsZWN0LnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLl91aV9oMS50ZXh0Q29udGVudCA9IHQ5bihsYW5nLCAndGFza19tYW5hZ2VyJyk7XHJcbiAgICAgICAgdGhpcy5fdWlfYnRuICYmIHRoaXMuX3VpX2J0bi51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX2xvZ19vdXQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNvbW1vbkV2ZW50TWFuYWdlciB9IGZyb20gXCIuL2V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50c1wiO1xyXG5pbXBvcnQgbG9jYWxTdG9yYWdlSXRlbXMgZnJvbSBcIi4vbG9jYWxTdG9yYWdlSXRlbXNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50TWFuYWdlciA9IGNvbW1vbkV2ZW50TWFuYWdlcikge1xyXG4gICAgICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoZXZlbnRzLmNoYW5nZUxhbmcsIGxhbmcgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh7IGxhbmcgfSk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZUl0ZW1zLmxhbmdJZCwgbGFuZyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4uL3dpZGdldC9oZWFkZXInO1xyXG5pbXBvcnQgTG9jYWxpemVkUGFnZSBmcm9tICcuL2xvY2FsaXplZFBhZ2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2l0aEhlYWRlciBleHRlbmRzIExvY2FsaXplZFBhZ2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgZWxlbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCA9IGZhbHNlIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgYXV0aG9yaXplZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2VsZW0gPSBlbGVtO1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FwcC1ib2R5Jz5cclxuICAgICAgICAgICAgICAgIDxIZWFkZXIgdGhpcz0nX3VpX2hlYWRlcicgYXV0aG9yaXplZD17YXV0aG9yaXplZH0gLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXIgY2VudGVyZWQnPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLl91aV9lbGVtfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuICAgICAgICB0aGlzLl91aV9oZWFkZXIudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3VpX2VsZW0udXBkYXRlKGRhdGEpO1xyXG4gICAgfVxyXG59O1xyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBMb2dpbkZvcm0gZnJvbSAnLi93aWRnZXQvbG9naW5Gb3JtJztcclxuaW1wb3J0IHQ5biBmcm9tICcuL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgV2l0aEhlYWRlciBmcm9tICcuL3V0aWxzL3dpdGhIZWFkZXInO1xyXG5cclxuY2xhc3MgTG9naW5QYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXItbWQnPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21iLTMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMSB0aGlzPVwiX3VpX2gxXCIgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+e3Q5bihkZWZhdWx0TGFuZywgJ2xvZ2luJyl9PC9oMT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPExvZ2luRm9ybSB0aGlzPVwiX3VpX2xvZ2luX2Zvcm1cIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2gxLnRleHRDb250ZW50ID0gdDluKGxhbmcsICdsb2dpbicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2xvZ2luX2Zvcm0udXBkYXRlKGRhdGEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb3VudChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSxcclxuICAgIDxXaXRoSGVhZGVyPlxyXG4gICAgICAgIDxMb2dpblBhZ2UgLz5cclxuICAgIDwvV2l0aEhlYWRlcj5cclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiQnV0dG9uIiwiX2NyZWF0ZUNsYXNzIiwiX3RoaXMiLCJzZXR0aW5ncyIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIl9jbGFzc0NhbGxDaGVjayIsIl9kZWZpbmVQcm9wZXJ0eSIsIl90aGlzJF9wcm9wIiwiX3Byb3AiLCJpY29uIiwiY29uY2F0IiwiX3VpX2ljb24iLCJkYXRhIiwiX3RoaXMkX3VpX2ljb24iLCJfZGF0YSR0ZXh0IiwiX2RhdGEkaWNvbiIsIl9kYXRhJHR5cGUiLCJfZGF0YSRjbGFzc05hbWUiLCJfdWlfYnV0dG9uIiwiaW5uZXJIVE1MIiwiX3NldHRpbmdzJHRleHQiLCJfc2V0dGluZ3MkaWNvbiIsIl9zZXR0aW5ncyR0eXBlIiwiX3NldHRpbmdzJGNsYXNzTmFtZSIsIl91aV9yZW5kZXIiLCJMaW5rIiwiaHJlZiIsIl9kYXRhJGhyZWYiLCJfdWlfYSIsInRleHRDb250ZW50IiwiX3NldHRpbmdzJGhyZWYiLCJJbnB1dCIsImxhYmVsIiwicGxhY2Vob2xkZXIiLCJpbnB1dElkIiwiX2RhdGEkbGFiZWwiLCJfZGF0YSRwbGFjZWhvbGRlciIsIl91aV9sYWJlbCIsIl91aV9pbnB1dCIsIl9zZXR0aW5ncyRsYWJlbCIsIl9zZXR0aW5ncyRwbGFjZWhvbGRlciIsIl9zZXR0aW5ncyRrZXkiLCJsYW5kSWQiLCJjb2RlIiwiaW5jbHVkZXMiLCJSVSIsIkVOIiwiT2JqZWN0IiwiZnJlZXplIiwibGFuZ0lkIiwiZGVmYXVsdExhbmciLCJfbG9jYWxTdG9yYWdlJGdldEl0ZW0iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwibG9jYWxTdG9yYWdlSXRlbXMiLCJMb2dpbkFuZFBhc3NGb3JtIiwidDluIiwibGFuZyIsIl91aV9pbnB1dF9lbWFpbCIsInVwZGF0ZSIsIl91aV9pbnB1dF9wd2QiLCJMb2dpbkZvcm0iLCJfdWlfbG9naW5fYW5kX3Bhc3NfZm9ybSIsIl91aV9saW5rIiwiX3VpX3NwYW4iLCJTZWxlY3QiLCJvcHRpb25zIiwib25DaGFuZ2UiLCJfdWlfb3B0aW9ucyIsIm9uY2hhbmdlIiwiZSIsInRhcmdldCIsIm1hcCIsIm9wdGlvbiIsInVpT3B0Iiwic2VsZWN0ZWQiLCJwdXNoIiwibGFiZWxzIiwiY29uc29sZSIsImVycm9yIiwiZm9yRWFjaCIsInVpT3B0aW9uIiwiaW5kZXgiLCJfc2V0dGluZ3Mkb3B0aW9ucyIsIl9zZXR0aW5ncyR2YWx1ZSIsIl9zZXR0aW5ncyRvbkNoYW5nZSIsImxvZyIsIkV2ZW50TWFuYWdlciIsIm5hbWUiLCJsaXN0ZW5lciIsIl9ldmVudExpc3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNvbW1vbkV2ZW50TWFuYWdlciIsImNoYW5nZUxhbmciLCJTZWxlY3RMYW5nIiwiX2xhbmdUOW5LZXlzIiwidDluS2V5IiwiX2xhbmdMYWJlbHMiLCJfbGFuZ0lkcyIsImRpc3BhdGNoIiwiZXZlbnRzIiwiX2RhdGEkbGFuZyIsIl91aV9zZWxlY3QiLCJ1cGRhdGVMYWJlbHMiLCJIZWFkZXIiLCJhdXRob3JpemVkIiwiX3VpX2gxIiwiX3VpX2J0biIsIl9zZXR0aW5ncyRhdXRob3JpemVkIiwiX2RlZmF1bHQiLCJldmVudE1hbmFnZXIiLCJzdWJzY3JpYmUiLCJzZXRJdGVtIiwiV2l0aEhlYWRlciIsIl9Mb2NhbGl6ZWRQYWdlIiwiZWxlbSIsIl9jYWxsU3VwZXIiLCJfdWlfZWxlbSIsIl91aV9oZWFkZXIiLCJfaW5oZXJpdHMiLCJMb2NhbGl6ZWRQYWdlIiwiTG9naW5QYWdlIiwiX3VpX2xvZ2luX2Zv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
