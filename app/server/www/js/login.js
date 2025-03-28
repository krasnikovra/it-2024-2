'use strict';

function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
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
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: true,
      configurable: true,
      writable: true
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: true
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(true);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = false, next;
            return next.value = t, next.done = true, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: true
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: true
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = false, next;
      }
      return next.done = true, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = false, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = true;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, true);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, true);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
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
  langId: 'langId',
  token: 'token'
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

var responseStatus = Object.freeze({
  ok: 'ok',
  failed: 'failed',
  error: 'error'
});

var error$1 = Object.freeze({
  notFound: 'not_found'
});

function login(body) {
  var login = body.login,
    password = body.password;
  if (login.trim() === '') {
    return {
      status: responseStatus.failed,
      detail: {
        error: error.emptyLogin
      }
    };
  }
  if (password.trim() === '') {
    return {
      status: responseStatus.failed,
      detail: {
        error: error.emptyPwd
      }
    };
  }
  if (login !== 'admin' || password !== 'admin') {
    return {
      status: responseStatus.failed,
      detail: {
        error: error.wrongLoginOrPwd
      }
    };
  }
  return {
    status: responseStatus.ok,
    detail: {
      token: 'abcde'
    }
  };
}
var error = Object.freeze({
  wrongLoginOrPwd: 'wrong_login_or_pwd',
  emptyLogin: 'empty_login',
  emptyPwd: 'empty_pwd'
});

var defaultPendingMs = 1000;
function fake_pending(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
function fake_fetch(_x, _x2, _x3) {
  return _fake_fetch.apply(this, arguments);
}
function _fake_fetch() {
  _fake_fetch = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(url, body, desiredResponse) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return fake_pending(defaultPendingMs);
        case 2:
          if (!desiredResponse) {
            _context.next = 4;
            break;
          }
          return _context.abrupt("return", desiredResponse);
        case 4:
          _context.t0 = url;
          _context.next = _context.t0 === '/api/v1/login' ? 7 : 8;
          break;
        case 7:
          return _context.abrupt("return", login(body));
        case 8:
          return _context.abrupt("return", {
            status: responseStatus.failed,
            detail: {
              error: error$1.notFound
            }
          });
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _fake_fetch.apply(this, arguments);
}

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
    return /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var login, password, response, status, detail, token, error;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            login = _this._ui_login_and_pass_form.get_login();
            password = _this._ui_login_and_pass_form.get_password();
            _this._ui_button.start_loading(t9n(lang, 'loading', 'em'));
            _context.next = 5;
            return fake_fetch('/api/v1/login', {
              login: login,
              password: password
            });
          case 5:
            response = _context.sent;
            _this._ui_button.end_loading(t9n(lang, 'to_login'));
            status = response.status, detail = response.detail;
            if (status === responseStatus.ok) {
              token = detail.token;
              localStorage.setItem(localStorageItems.token, token);
              window.location.href = './edit.html';
            } else {
              error = detail.error;
              console.error('status', status, 'error', error);
            }
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9idXR0b24uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2F0b20vbGluay5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9pbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5ydS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5lbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvbG9naW5BbmRQYXNzRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXBpL3N0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXBpL2Vycm9yLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hcGkvbG9naW4uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2FwaS9pbmRleC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2xvZ2luRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvc2VsZWN0TGFuZy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2hlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxpemVkUGFnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvd2l0aEhlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvbG9naW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaWNvbiA9IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGUgPSAncHJpbWFyeScsIC8vICdwcmltYXJ5JywgJ3NlY29uZGFyeSdcclxuICAgICAgICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayA9IChlKSA9PiB7IGNvbnNvbGUubG9nKFwiY2xpY2tlZCBidXR0b25cIiwgZS50YXJnZXQpOyB9LFxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSAnJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIHRleHQsXHJcbiAgICAgICAgICAgIGljb24sXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkLFxyXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgb25DbGljayxcclxuICAgICAgICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgaWNvbiwgdHlwZSwgZGlzYWJsZWQsIG9uQ2xpY2ssIGNsYXNzTmFtZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGJ1dHRvbiB0aGlzPSdfdWlfYnV0dG9uJyBjbGFzc05hbWU9e2BidG4gYnRuLSR7dHlwZX0gJHtjbGFzc05hbWV9YH1cclxuICAgICAgICAgICAgICAgIG9uY2xpY2s9e29uQ2xpY2t9IGRpc2FibGVkPXtkaXNhYmxlZH0+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5fdWlfaWNvbihpY29uKX1cclxuICAgICAgICAgICAgICAgIDxzcGFuIHRoaXM9J191aV9zcGFuJz57dGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX2ljb24gPSAoaWNvbikgPT4ge1xyXG4gICAgICAgIHJldHVybiBpY29uID8gPGkgY2xhc3NOYW1lPXtgYmkgYmktJHtpY29ufSBtZS0yYH0+PC9pPiA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3NwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT0nc3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc20gbWUtMicgLz5cclxuICAgIH1cclxuXHJcbiAgICBzdGFydF9sb2FkaW5nID0gKGxvYWRpbmdMYWJlbCkgPT4geyBcclxuICAgICAgICB0aGlzLnVwZGF0ZSh7IGRpc2FibGVkOiB0cnVlLCB0ZXh0OiBsb2FkaW5nTGFiZWwsIGxvYWRpbmc6IHRydWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZW5kX2xvYWRpbmcgPSAobGFiZWwpID0+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZSh7IGRpc2FibGVkOiBmYWxzZSwgdGV4dDogbGFiZWwsIGxvYWRpbmc6IGZhbHNlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy5fcHJvcC50ZXh0LFxyXG4gICAgICAgICAgICBpY29uID0gdGhpcy5fcHJvcC5pY29uLFxyXG4gICAgICAgICAgICB0eXBlID0gdGhpcy5fcHJvcC50eXBlLFxyXG4gICAgICAgICAgICBkaXNhYmxlZCA9IHRoaXMuX3Byb3AuZGlzYWJsZWQsXHJcbiAgICAgICAgICAgIGxvYWRpbmcgPSB0aGlzLl9wcm9wLmxvYWRpbmcsXHJcbiAgICAgICAgICAgIG9uQ2xpY2sgPSB0aGlzLl9wcm9wLm9uQ2xpY2ssXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IHRoaXMuX3Byb3AuY2xhc3NOYW1lXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmIChsb2FkaW5nICE9PSB0aGlzLl9wcm9wLmxvYWRpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkVG9SZW1vdmUgPSB0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlc1swXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5yZW1vdmVDaGlsZChjaGlsZFRvUmVtb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IGxvYWRpbmcgPyB0aGlzLl91aV9zcGlubmVyKCkgOiB0aGlzLl91aV9pY29uKGljb24pO1xyXG4gICAgICAgICAgICBjaGlsZCAmJiB0aGlzLl91aV9idXR0b24uaW5zZXJ0QmVmb3JlKGNoaWxkLCB0aGlzLl91aV9zcGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGljb24gIT09IHRoaXMuX3Byb3AuaWNvbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRUb1JlbW92ZSA9IHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLnJlbW92ZUNoaWxkKGNoaWxkVG9SZW1vdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5fdWlfaWNvbihpY29uKTtcclxuICAgICAgICAgICAgY2hpbGQgJiYgdGhpcy5fdWlfYnV0dG9uLmluc2VydEJlZm9yZSh0aGlzLl91aV9pY29uKGljb24pLCB0aGlzLl91aV9zcGFuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRleHQgIT09IHRoaXMuX3Byb3AudGV4dCkge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFuQm9keSA9IDxkaXY+e3RleHR9PC9kaXY+O1xyXG4gICAgICAgICAgICB0aGlzLl91aV9zcGFuLmlubmVySFRNTCA9IHNwYW5Cb2R5LmlubmVySFRNTDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYXNzTmFtZSAhPT0gdGhpcy5fcHJvcC5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLmNsYXNzTmFtZSA9IGBidG4gYnRuLSR7dHlwZX0gJHtjbGFzc05hbWV9YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpc2FibGVkICE9PSB0aGlzLl9wcm9wLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5kaXNhYmxlZCA9IGRpc2FibGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob25DbGljayAhPT0gdGhpcy5fcHJvcC5vbkNsaWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5vbmNsaWNrID0gb25DbGljaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IC4uLnRoaXMuX3Byb3AsIHRleHQsIGljb24sIHR5cGUsIGRpc2FibGVkLCBsb2FkaW5nLCBvbkNsaWNrLCBjbGFzc05hbWUgfTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaHJlZiA9ICcnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgdGV4dCxcclxuICAgICAgICAgICAgaHJlZlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgaHJlZiB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGEgdGhpcz0nX3VpX2EnIGhyZWY9e2hyZWZ9Pnt0ZXh0fTwvYT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy5fcHJvcC50ZXh0LFxyXG4gICAgICAgICAgICBocmVmID0gdGhpcy5fcHJvcC5ocmVmXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0ICE9PSB0aGlzLl9wcm9wLnRleHQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChocmVmICE9PSB0aGlzLl9wcm9wLmhyZWYpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYS5ocmVmID0gaHJlZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IC4uLnRoaXMuX3Byb3AsIHRleHQsIGhyZWYgfTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnB1dCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBsYWJlbCA9ICcnLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9ICcnLFxyXG4gICAgICAgICAgICB0eXBlID0gJ3RleHQnLFxyXG4gICAgICAgICAgICBrZXkgPSAndW5kZWZpbmVkJyxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcixcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAga2V5XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhYmVsLCBwbGFjZWhvbGRlciwgdHlwZSwga2V5IH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dElkID0gYGJhc2UtaW5wdXQtJHtrZXl9YDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIHRoaXM9J191aV9sYWJlbCcgZm9yPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tbGFiZWwnPntsYWJlbH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHRoaXM9J191aV9pbnB1dCcgdHlwZT17dHlwZX0gaWQ9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1jb250cm9sJyBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSB0aGlzLl9wcm9wLmxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9IHRoaXMuX3Byb3AucGxhY2Vob2xkZXIsXHJcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLl9wcm9wLnR5cGVcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGxhYmVsICE9PSB0aGlzLl9wcm9wLmxhYmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2xhYmVsLnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwbGFjZWhvbGRlciAhPT0gdGhpcy5fcHJvcC5wbGFjZWhvbGRlcikge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9pbnB1dC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSAhPT0gdGhpcy5fcHJvcC50eXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2lucHV0LnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9wcm9wID0geyAuLi50aGlzLnByb3AsIGxhYmVsLCBwbGFjZWhvbGRlciwgdHlwZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIGdldF92YWx1ZSA9ICgpID0+IHRoaXMuX3VpX2lucHV0LnZhbHVlO1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgICd0YXNrX21hbmFnZXInOiAn0JzQtdC90LXQtNC20LXRgCDQt9Cw0LTQsNGHJyxcclxuICAgICdsb2dpbic6ICfQktGF0L7QtCcsXHJcbiAgICAnbG9hZGluZyc6ICfQl9Cw0LPRgNGD0LfQutCwJyxcclxuICAgICdsb2FkaW5nX25fc2Vjb25kc19sZWZ0JzogbiA9PiB7XHJcbiAgICAgICAgbGV0IHNlY29uZFBvc3RmaXggPSAnJztcclxuICAgICAgICBsZXQgbGVmdFBvc3RmaXggPSAn0L7RgdGMJztcclxuICAgICAgICBjb25zdCBuQmV0d2VlbjEwYW5kMjAgPSBuID4gMTAgJiYgbiA8IDIwO1xyXG4gICAgICAgIGlmIChuICUgMTAgPT09IDEgJiYgIW5CZXR3ZWVuMTBhbmQyMCkge1xyXG4gICAgICAgICAgICBzZWNvbmRQb3N0Zml4ID0gJ9CwJztcclxuICAgICAgICAgICAgbGVmdFBvc3RmaXggPSAn0LDRgdGMJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoWzIsIDMsIDRdLmluY2x1ZGVzKG4gJSAxMCkgJiYgIW5CZXR3ZWVuMTBhbmQyMCkge1xyXG4gICAgICAgICAgICBzZWNvbmRQb3N0Zml4ID0gJ9GLJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBg0JfQsNCz0YDRg9C30LrQsC4uLiAo0J7RgdGC0LDQuyR7bGVmdFBvc3RmaXh9ICR7bn0g0YHQtdC60YPQvdC0JHtzZWNvbmRQb3N0Zml4fSlgO1xyXG4gICAgfSxcclxuICAgICdlbWFpbCc6ICdFLW1haWwnLFxyXG4gICAgJ3NvbWVib2R5X2VtYWlsJzogJ3NvbWVib2R5QGdtYWlsLmNvbScsXHJcbiAgICAncGFzc3dvcmQnOiAn0J/QsNGA0L7Qu9GMJyxcclxuICAgICd0b19sb2dpbic6ICfQktC+0LnRgtC4JyxcclxuICAgICd0b19yZWdpc3Rlcic6ICfQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y8nLFxyXG4gICAgJ25vX2FjY291bnRfcXVlc3Rpb24nOiAn0J3QtdGCINCw0LrQutCw0YPQvdGC0LA/JyxcclxuICAgICd0b19sb2dfb3V0JzogJ9CS0YvQudGC0LgnLFxyXG4gICAgJ3JlZ2lzdHJhdGlvbic6ICfQoNC10LPQuNGB0YLRgNCw0YbQuNGPJyxcclxuICAgICdyZXBlYXRfcGFzc3dvcmQnOiAn0J/QvtCy0YLQvtGA0LjRgtC1INC/0LDRgNC+0LvRjCcsXHJcbiAgICAnYWxyZWFkeV9oYXZlX2FjY291bnRfcXVlc3Rpb24nOiAn0KPQttC1INC10YHRgtGMINCw0LrQutCw0YPQvdGCPycsXHJcbiAgICAnZWRpdGluZyc6ICfQoNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1JyxcclxuICAgICd0YXNrX25hbWUnOiAn0J3QsNC30LLQsNC90LjQtSDQt9Cw0LTQsNGH0LgnLFxyXG4gICAgJ215X3Rhc2snOiAn0JzQvtGPINC30LDQtNCw0YfQsCcsXHJcbiAgICAnZGVhZGxpbmUnOiAn0JTQtdC00LvQsNC50L0nLFxyXG4gICAgJ2ltcG9ydGFudF90YXNrJzogJ9CS0LDQttC90LDRjyDQt9Cw0LTQsNGH0LAnLFxyXG4gICAgJ2NhbmNlbCc6ICfQntGC0LzQtdC90LAnLFxyXG4gICAgJ3RvX3NhdmUnOiAn0KHQvtGF0YDQsNC90LjRgtGMJyxcclxuICAgICdydSc6ICfQoNGD0YHRgdC60LjQuScsXHJcbiAgICAnZW4nOiAn0JDQvdCz0LvQuNC50YHQutC40LknXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgICd0YXNrX21hbmFnZXInOiAnVGFzayBtYW5hZ2VyJyxcclxuICAgICdsb2dpbic6ICdMb2dpbicsXHJcbiAgICAnbG9hZGluZyc6ICdMb2FkaW5nJyxcclxuICAgICdsb2FkaW5nX25fc2Vjb25kc19sZWZ0JzogbiA9PiBgTG9hZGluZy4uLiAoJHtufSBzZWNvbmQke24gJSAxMCA9PT0gMSA/ICcnIDogJ3MnfSBsZWZ0KWAsXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ1Bhc3N3b3JkJyxcclxuICAgICd0b19sb2dpbic6ICdMb2cgaW4nLFxyXG4gICAgJ3RvX3JlZ2lzdGVyJzogJ1JlZ2lzdGVyJyxcclxuICAgICdub19hY2NvdW50X3F1ZXN0aW9uJzogJ05vIGFjY291bnQ/JyxcclxuICAgICd0b19sb2dfb3V0JzogJ0xvZyBvdXQnLFxyXG4gICAgJ3JlZ2lzdHJhdGlvbic6ICdSZWdpc3RyYXRpb24nLFxyXG4gICAgJ3JlcGVhdF9wYXNzd29yZCc6ICdSZXBlYXQgcGFzc3dvcmQnLFxyXG4gICAgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJzogJ0hhdmUgZ290IGFuIGFjY291bnQ/JyxcclxuICAgICdlZGl0aW5nJzogJ0VkaXRpbmcnLFxyXG4gICAgJ3Rhc2tfbmFtZSc6ICdUYXNrIG5hbWUnLFxyXG4gICAgJ215X3Rhc2snOiAnTXkgdGFzaycsXHJcbiAgICAnZGVhZGxpbmUnOiAnRGVhZGxpbmUnLFxyXG4gICAgJ2ltcG9ydGFudF90YXNrJzogJ0ltcG9ydGFudCB0YXNrJyxcclxuICAgICdjYW5jZWwnOiAnQ2FuY2VsJyxcclxuICAgICd0b19zYXZlJzogJ1NhdmUnLFxyXG4gICAgJ3J1JzogJ1J1c3NpYW4nLFxyXG4gICAgJ2VuJzogJ0VuZ2xpc2gnLFxyXG59O1xyXG4iLCJpbXBvcnQgUlUgZnJvbSAnLi90OW4ucnUnO1xyXG5pbXBvcnQgRU4gZnJvbSAnLi90OW4uZW4nO1xyXG5cclxuZnVuY3Rpb24gdXNlVGFnKGh0bWxFbCwgdGFnKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xyXG4gICAgaWYgKHR5cGVvZiBodG1sRWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmVzdWx0LmlubmVySFRNTCA9IGh0bWxFbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0LmFwcGVuZENoaWxkKGh0bWxFbCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiB1c2VUYWdzKGh0bWxFbCwgdGFncykge1xyXG4gICAgbGV0IHJlc3VsdCA9IGh0bWxFbDtcclxuICAgIHRhZ3MuZm9yRWFjaCh0YWcgPT4gcmVzdWx0ID0gdXNlVGFnKHJlc3VsdCwgdGFnKSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCAobGFuZElkLCBjb2RlLCB0YWcsIC4uLmFyZ3MpID0+IHtcclxuICAgIGlmIChjb2RlID09IG51bGwgfHwgY29kZS5sZW5ndGggPT09IDApIHJldHVybiAnJztcclxuXHJcbiAgICBpZiAoIVsncnUnLCAnZW4nXS5pbmNsdWRlcyhsYW5kSWQpKSB7XHJcbiAgICAgICAgbGFuZElkID0gJ3J1JztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0ID0gY29kZTtcclxuXHJcbiAgICBpZiAobGFuZElkID09PSAncnUnICYmIFJVW2NvZGVdKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gUlVbY29kZV07XHJcbiAgICB9XHJcbiAgICBpZiAobGFuZElkID09PSAnZW4nICYmIEVOW2NvZGVdKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gRU5bY29kZV07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQoLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhZykge1xyXG4gICAgICAgIGlmICh0YWcgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB1c2VUYWdzKHJlc3VsdCwgdGFnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB1c2VUYWcocmVzdWx0LCB0YWcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgbGFuZ0lkOiAnbGFuZ0lkJyxcclxuICAgIHRva2VuOiAndG9rZW4nXHJcbn0pO1xyXG4iLCJpbXBvcnQgbG9jYWxTdG9yYWdlSXRlbXMgZnJvbSBcIi4vbG9jYWxTdG9yYWdlSXRlbXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0TGFuZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZUl0ZW1zLmxhbmdJZCkgPz8gJ3J1JztcclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vYXRvbS9pbnB1dCc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9naW5BbmRQYXNzRm9ybSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21iLTMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfZW1haWwnIGxhYmVsPXt0OW4oZGVmYXVsdExhbmcsICdlbWFpbCcpfSBcclxuICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0OW4oZGVmYXVsdExhbmcsICdzb21lYm9keV9lbWFpbCcpfSBrZXk9XCJlLW1haWxcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8SW5wdXQgdGhpcz0nX3VpX2lucHV0X3B3ZCcgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ3Bhc3N3b3JkJyl9IHBsYWNlaG9sZGVyPScqKioqKioqKicgdHlwZT0ncGFzc3dvcmQnIGtleT1cInB3ZFwiLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9pbnB1dF9lbWFpbC51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdlbWFpbCcpLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdDluKGxhbmcsICdzb21lYm9keV9lbWFpbCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfcHdkLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGxhYmVsOiB0OW4obGFuZywgJ3Bhc3N3b3JkJyksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0X2xvZ2luID0gKCkgPT4gdGhpcy5fdWlfaW5wdXRfZW1haWwuZ2V0X3ZhbHVlKCk7XHJcblxyXG4gICAgZ2V0X3Bhc3N3b3JkID0gKCkgPT4gdGhpcy5fdWlfaW5wdXRfcHdkLmdldF92YWx1ZSgpO1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgb2s6ICdvaycsXHJcbiAgICBmYWlsZWQ6ICdmYWlsZWQnLFxyXG4gICAgZXJyb3I6ICdlcnJvcidcclxufSk7XHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgbm90Rm91bmQ6ICdub3RfZm91bmQnLFxyXG59KTtcclxuIiwiaW1wb3J0IHJlc3BvbnNlU3RhdHVzIGZyb20gXCIuL3N0YXR1c1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luKGJvZHkpIHtcclxuICAgIGNvbnN0IHsgbG9naW4sIHBhc3N3b3JkIH0gPSBib2R5O1xyXG5cclxuICAgIGlmIChsb2dpbi50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5TG9naW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwYXNzd29yZC50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5UHdkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobG9naW4gIT09ICdhZG1pbicgfHwgcGFzc3dvcmQgIT09ICdhZG1pbicpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLmZhaWxlZCxcclxuICAgICAgICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3Iud3JvbmdMb2dpbk9yUHdkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLm9rLFxyXG4gICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICB0b2tlbjogJ2FiY2RlJyxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBlcnJvciA9IE9iamVjdC5mcmVlemUoe1xyXG4gICAgd3JvbmdMb2dpbk9yUHdkOiAnd3JvbmdfbG9naW5fb3JfcHdkJyxcclxuICAgIGVtcHR5TG9naW46ICdlbXB0eV9sb2dpbicsXHJcbiAgICBlbXB0eVB3ZDogJ2VtcHR5X3B3ZCcsXHJcbn0pO1xyXG4iLCJpbXBvcnQgcmVzcG9uc2VTdGF0dXMgZnJvbSAnLi9zdGF0dXMnO1xyXG5pbXBvcnQgZXJyb3IgZnJvbSAnLi9lcnJvcic7XHJcbmltcG9ydCB7IGxvZ2luIH0gZnJvbSAnLi9sb2dpbic7XHJcblxyXG5jb25zdCBkZWZhdWx0UGVuZGluZ01zID0gMTAwMDtcclxuXHJcbmZ1bmN0aW9uIGZha2VfcGVuZGluZyhtcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBmYWtlX2ZldGNoKHVybCwgYm9keSwgZGVzaXJlZFJlc3BvbnNlKSB7XHJcbiAgICBhd2FpdCBmYWtlX3BlbmRpbmcoZGVmYXVsdFBlbmRpbmdNcyk7XHJcbiAgICBpZiAoZGVzaXJlZFJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlc2lyZWRSZXNwb25zZTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2godXJsKSB7XHJcbiAgICAgICAgY2FzZSAnL2FwaS92MS9sb2dpbic6XHJcbiAgICAgICAgICAgIHJldHVybiBsb2dpbihib2R5KTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3Iubm90Rm91bmRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBMaW5rIGZyb20gJy4uL2F0b20vbGluayc7XHJcbmltcG9ydCBMb2dpbkFuZFBhc3NGb3JtIGZyb20gJy4vbG9naW5BbmRQYXNzRm9ybSc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgZmFrZV9mZXRjaCBmcm9tICcuLi9hcGkvaW5kZXgnO1xyXG5pbXBvcnQgcmVzcG9uc2VTdGF0dXMgZnJvbSAnLi4vYXBpL3N0YXR1cyc7XHJcbmltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tICcuLi91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dpbkZvcm0ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi00Jz5cclxuICAgICAgICAgICAgICAgICAgICA8TG9naW5BbmRQYXNzRm9ybSB0aGlzPSdfdWlfbG9naW5fYW5kX3Bhc3NfZm9ybScgLz5cclxuICAgICAgICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGhpcz0nX3VpX3NwYW4nPnt0OW4oZGVmYXVsdExhbmcsICdub19hY2NvdW50X3F1ZXN0aW9uJyl9PC9zcGFuPiZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdGhpcz0nX3VpX2xpbmsnIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX3JlZ2lzdGVyJyl9IGhyZWY9Jy4vcmVnaXN0ZXIuaHRtbCcgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+XHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0aGlzPSdfdWlfYnV0dG9uJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICd0b19sb2dpbicpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLl9nZXRfb25fYnRuX2NsaWNrKGRlZmF1bHRMYW5nKX0gY2xhc3NOYW1lPSd3LTEwMCcgdHlwZT0ncHJpbWFyeScgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIF9nZXRfb25fYnRuX2NsaWNrID0gKGxhbmcpID0+IHtcclxuICAgICAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBsb2dpbiA9IHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0uZ2V0X2xvZ2luKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS5nZXRfcGFzc3dvcmQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5zdGFydF9sb2FkaW5nKFxyXG4gICAgICAgICAgICAgICAgdDluKGxhbmcsICdsb2FkaW5nJywgJ2VtJylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmYWtlX2ZldGNoKCcvYXBpL3YxL2xvZ2luJywgeyBsb2dpbiwgcGFzc3dvcmQgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5lbmRfbG9hZGluZyhcclxuICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAndG9fbG9naW4nKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRldGFpbCB9ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IHJlc3BvbnNlU3RhdHVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IHRva2VuIH0gPSBkZXRhaWxcclxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZUl0ZW1zLnRva2VuLCB0b2tlbik7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2VkaXQuaHRtbCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IGVycm9yIH0gPSBkZXRhaWw7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdzdGF0dXMnLCBzdGF0dXMsICdlcnJvcicsIGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfbGluay51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX3JlZ2lzdGVyJyksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfc3Bhbi50ZXh0Q29udGVudCA9IHQ5bihsYW5nLCAnbm9fYWNjb3VudF9xdWVzdGlvbicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX2xvZ2luJyksXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuX2dldF9vbl9idG5fY2xpY2sobGFuZylcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdPcHRpb24gMScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdvcHRpb24xJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB2YWx1ZSA9ICdvcHRpb24xJyxcclxuICAgICAgICAgICAgb25DaGFuZ2UgPSAodmFsdWUpID0+IHsgY29uc29sZS5sb2codmFsdWUpIH0sXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBvcHRpb25zLFxyXG4gICAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgICAgb25DaGFuZ2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IG9wdGlvbnMsIHZhbHVlLCBvbkNoYW5nZSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfb3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWxlY3QgdGhpcz0nX3VpX3NlbGVjdCcgY2xhc3NOYW1lPSdmb3JtLXNlbGVjdCcgb25jaGFuZ2U9e2UgPT4gb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfT5cclxuICAgICAgICAgICAgICAgIHtvcHRpb25zLm1hcChvcHRpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVpT3B0ID0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9e29wdGlvbi52YWx1ZX0gc2VsZWN0ZWQ9e3ZhbHVlID09PSBvcHRpb24udmFsdWV9PntvcHRpb24ubGFiZWx9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfb3B0aW9ucy5wdXNoKHVpT3B0KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdWlPcHQ7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUxhYmVscyA9IChsYWJlbHMpID0+IHtcclxuICAgICAgICBpZiAobGFiZWxzLmxlbmd0aCAhPT0gdGhpcy5fcHJvcC5vcHRpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIHNlbGVjdFxcJ3Mgb3B0aW9ucyBsYWJlbHMhXFxcclxuICAgICAgICAgICAgICAgICBMYWJlbHMgYXJyYXkgaXMgaW5jb21wYXRpYmxlIHdpdGggc2VsZWN0XFwnIG9wdGlvbnMgYXJyYXkuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX29wdGlvbnMuZm9yRWFjaCgodWlPcHRpb24sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHVpT3B0aW9uLmlubmVySFRNTCA9IGxhYmVsc1tpbmRleF07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuICAgIF9ldmVudExpc3QgPSB7fTtcclxuXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgJ2V2ZW50MSc6IFtcclxuICAgIC8vICAgICAgICAgZjEsXHJcbiAgICAvLyAgICAgICAgIGYyXHJcbiAgICAvLyAgICAgXSxcclxuICAgIC8vICAgICAnZXZlbnQyJzogW1xyXG4gICAgLy8gICAgICAgICBmM1xyXG4gICAgLy8gICAgIF1cclxuICAgIC8vIH1cclxuXHJcbiAgICBzdWJzY3JpYmUgPSAobmFtZSwgbGlzdGVuZXIpID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2V2ZW50TGlzdFtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwYXRjaCA9IChuYW1lLCBhcmdzID0ge30pID0+IHtcclxuICAgICAgICBpZiAodGhpcy5fZXZlbnRMaXN0Lmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXS5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoYXJncyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBjb21tb25FdmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKCk7IC8vIHNpbmdsZXRvblxyXG5leHBvcnQgeyBFdmVudE1hbmFnZXIgfTsgLy8gY2xhc3NcclxuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBjaGFuZ2VMYW5nOiAnY2hhbmdlTGFuZydcclxufSk7XHJcbiIsImltcG9ydCBTZWxlY3QgZnJvbSBcIi4uL2F0b20vc2VsZWN0XCI7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSBcIi4uL3V0aWxzL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgeyBjb21tb25FdmVudE1hbmFnZXIgfSBmcm9tIFwiLi4vdXRpbHMvZXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4uL3V0aWxzL2V2ZW50c1wiO1xyXG5pbXBvcnQgdDluIGZyb20gXCIuLi91dGlscy90OW4vaW5kZXhcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdExhbmcge1xyXG4gICAgX2xhbmdJZHMgPSBbJ3J1JywgJ2VuJ107XHJcbiAgICBfbGFuZ1Q5bktleXMgPSBbJ3J1JywgJ2VuJ107XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF9sYW5nTGFiZWxzID0gKGxhbmdJZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sYW5nVDluS2V5cy5tYXAodDluS2V5ID0+IHQ5bihsYW5nSWQsIHQ5bktleSkpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdGhpcy5fbGFuZ0xhYmVscyhkZWZhdWx0TGFuZyk7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX2xhbmdJZHMubWFwKChsYW5nSWQsIGluZGV4KSA9PiAoe1xyXG4gICAgICAgICAgICB2YWx1ZTogbGFuZ0lkLFxyXG4gICAgICAgICAgICBsYWJlbDogbGFiZWxzW2luZGV4XVxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPFNlbGVjdCB0aGlzPSdfdWlfc2VsZWN0JyBvcHRpb25zPXtvcHRpb25zfSB2YWx1ZT17ZGVmYXVsdExhbmd9IFxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2xhbmdJZCA9PiBjb21tb25FdmVudE1hbmFnZXIuZGlzcGF0Y2goZXZlbnRzLmNoYW5nZUxhbmcsIGxhbmdJZCl9IC8+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG4gICAgICAgIGNvbnN0IGxhYmVscyA9IHRoaXMuX2xhbmdMYWJlbHMobGFuZyk7XHJcbiAgICAgICAgdGhpcy5fdWlfc2VsZWN0LnVwZGF0ZUxhYmVscyhsYWJlbHMpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBTZWxlY3RMYW5nIGZyb20gJy4vc2VsZWN0TGFuZyc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcclxuaW1wb3J0IHQ5biBmcm9tICcuLi91dGlscy90OW4vaW5kZXgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgPSBmYWxzZSB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IGF1dGhvcml6ZWQgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDEgdGhpcz0nX3VpX2gxJyBjbGFzc05hbWU9J21lLTUnPnt0OW4oZGVmYXVsdExhbmcsICd0YXNrX21hbmFnZXInKX08L2gxPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8U2VsZWN0TGFuZyB0aGlzPSdfdWlfc2VsZWN0JyAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7IGF1dGhvcml6ZWQgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB0aGlzPSdfdWlfYnRuJyB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPSdtcy1hdXRvJyB0ZXh0PXt0OW4oZGVmYXVsdExhbmcsICd0b19sb2dfb3V0Jyl9IC8+IH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhOyBcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfc2VsZWN0LnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLl91aV9oMS50ZXh0Q29udGVudCA9IHQ5bihsYW5nLCAndGFza19tYW5hZ2VyJyk7XHJcbiAgICAgICAgdGhpcy5fdWlfYnRuICYmIHRoaXMuX3VpX2J0bi51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX2xvZ19vdXQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNvbW1vbkV2ZW50TWFuYWdlciB9IGZyb20gXCIuL2V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuL2V2ZW50c1wiO1xyXG5pbXBvcnQgbG9jYWxTdG9yYWdlSXRlbXMgZnJvbSBcIi4vbG9jYWxTdG9yYWdlSXRlbXNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50TWFuYWdlciA9IGNvbW1vbkV2ZW50TWFuYWdlcikge1xyXG4gICAgICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoZXZlbnRzLmNoYW5nZUxhbmcsIGxhbmcgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh7IGxhbmcgfSk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsU3RvcmFnZUl0ZW1zLmxhbmdJZCwgbGFuZyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4uL3dpZGdldC9oZWFkZXInO1xyXG5pbXBvcnQgTG9jYWxpemVkUGFnZSBmcm9tICcuL2xvY2FsaXplZFBhZ2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2l0aEhlYWRlciBleHRlbmRzIExvY2FsaXplZFBhZ2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgZWxlbSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCA9IGZhbHNlIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgYXV0aG9yaXplZFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2VsZW0gPSBlbGVtO1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2FwcC1ib2R5Jz5cclxuICAgICAgICAgICAgICAgIDxIZWFkZXIgdGhpcz0nX3VpX2hlYWRlcicgYXV0aG9yaXplZD17YXV0aG9yaXplZH0gLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXIgY2VudGVyZWQnPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLl91aV9lbGVtfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuICAgICAgICB0aGlzLl91aV9oZWFkZXIudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3VpX2VsZW0udXBkYXRlKGRhdGEpO1xyXG4gICAgfVxyXG59O1xyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBMb2dpbkZvcm0gZnJvbSAnLi93aWRnZXQvbG9naW5Gb3JtJztcclxuaW1wb3J0IHQ5biBmcm9tICcuL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgV2l0aEhlYWRlciBmcm9tICcuL3V0aWxzL3dpdGhIZWFkZXInO1xyXG5cclxuY2xhc3MgTG9naW5QYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb250YWluZXItbWQnPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J21iLTMnPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMSB0aGlzPVwiX3VpX2gxXCIgY2xhc3NOYW1lPSd0ZXh0LWNlbnRlcic+e3Q5bihkZWZhdWx0TGFuZywgJ2xvZ2luJyl9PC9oMT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPExvZ2luRm9ybSB0aGlzPVwiX3VpX2xvZ2luX2Zvcm1cIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2gxLnRleHRDb250ZW50ID0gdDluKGxhbmcsICdsb2dpbicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2xvZ2luX2Zvcm0udXBkYXRlKGRhdGEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb3VudChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSxcclxuICAgIDxXaXRoSGVhZGVyPlxyXG4gICAgICAgIDxMb2dpblBhZ2UgLz5cclxuICAgIDwvV2l0aEhlYWRlcj5cclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiQnV0dG9uIiwiX2NyZWF0ZUNsYXNzIiwiX3RoaXMiLCJzZXR0aW5ncyIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIl9jbGFzc0NhbGxDaGVjayIsIl9kZWZpbmVQcm9wZXJ0eSIsIl90aGlzJF9wcm9wIiwiX3Byb3AiLCJpY29uIiwiZGlzYWJsZWQiLCJvbkNsaWNrIiwiY29uY2F0Iiwib25jbGljayIsIl91aV9pY29uIiwibG9hZGluZ0xhYmVsIiwidXBkYXRlIiwibG9hZGluZyIsImxhYmVsIiwiZGF0YSIsIl9kYXRhJHRleHQiLCJfZGF0YSRpY29uIiwiX2RhdGEkdHlwZSIsIl9kYXRhJGRpc2FibGVkIiwiX2RhdGEkbG9hZGluZyIsIl9kYXRhJG9uQ2xpY2siLCJfZGF0YSRjbGFzc05hbWUiLCJfdWlfYnV0dG9uIiwiY2hpbGROb2RlcyIsImNoaWxkVG9SZW1vdmUiLCJyZW1vdmVDaGlsZCIsIl91aV9zcGlubmVyIiwiaW5zZXJ0QmVmb3JlIiwiX3VpX3NwYW4iLCJzcGFuQm9keSIsImlubmVySFRNTCIsIl9vYmplY3RTcHJlYWQiLCJfc2V0dGluZ3MkdGV4dCIsIl9zZXR0aW5ncyRpY29uIiwiX3NldHRpbmdzJHR5cGUiLCJfc2V0dGluZ3MkZGlzYWJsZWQiLCJfc2V0dGluZ3Mkb25DbGljayIsImUiLCJjb25zb2xlIiwibG9nIiwidGFyZ2V0IiwiX3NldHRpbmdzJGNsYXNzTmFtZSIsIl91aV9yZW5kZXIiLCJMaW5rIiwiaHJlZiIsIl9kYXRhJGhyZWYiLCJfdWlfYSIsInRleHRDb250ZW50IiwiX3NldHRpbmdzJGhyZWYiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwiaW5wdXRJZCIsIl9kYXRhJGxhYmVsIiwiX2RhdGEkcGxhY2Vob2xkZXIiLCJfdWlfbGFiZWwiLCJfdWlfaW5wdXQiLCJwcm9wIiwiX3NldHRpbmdzJGxhYmVsIiwiX3NldHRpbmdzJHBsYWNlaG9sZGVyIiwiX3NldHRpbmdzJGtleSIsImxvYWRpbmdfbl9zZWNvbmRzX2xlZnQiLCJuIiwic2Vjb25kUG9zdGZpeCIsImxlZnRQb3N0Zml4IiwibkJldHdlZW4xMGFuZDIwIiwiaW5jbHVkZXMiLCJ1c2VUYWciLCJodG1sRWwiLCJyZXN1bHQiLCJ1c2VUYWdzIiwidGFncyIsImZvckVhY2giLCJsYW5kSWQiLCJjb2RlIiwiUlUiLCJFTiIsIl9sZW4iLCJBcnJheSIsIl9rZXkiLCJhcHBseSIsIk9iamVjdCIsImZyZWV6ZSIsImxhbmdJZCIsInRva2VuIiwiZGVmYXVsdExhbmciLCJfbG9jYWxTdG9yYWdlJGdldEl0ZW0iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwibG9jYWxTdG9yYWdlSXRlbXMiLCJMb2dpbkFuZFBhc3NGb3JtIiwidDluIiwibGFuZyIsIl91aV9pbnB1dF9lbWFpbCIsIl91aV9pbnB1dF9wd2QiLCJnZXRfdmFsdWUiLCJvayIsImZhaWxlZCIsImVycm9yIiwibm90Rm91bmQiLCJsb2dpbiIsImJvZHkiLCJwYXNzd29yZCIsInN0YXR1cyIsInJlc3BvbnNlU3RhdHVzIiwiZGV0YWlsIiwiZW1wdHlMb2dpbiIsImVtcHR5UHdkIiwid3JvbmdMb2dpbk9yUHdkIiwiZGVmYXVsdFBlbmRpbmdNcyIsImZha2VfcGVuZGluZyIsIm1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiZmFrZV9mZXRjaCIsIl94IiwiX3gyIiwiX3gzIiwiX2Zha2VfZmV0Y2giLCJfYXN5bmNUb0dlbmVyYXRvciIsIl9yZWdlbmVyYXRvclJ1bnRpbWUiLCJtYXJrIiwiX2NhbGxlZSIsInVybCIsImRlc2lyZWRSZXNwb25zZSIsIndyYXAiLCJfY2FsbGVlJCIsIl9jb250ZXh0IiwicHJldiIsImFicnVwdCIsInQwIiwic3RvcCIsIkxvZ2luRm9ybSIsIl9nZXRfb25fYnRuX2NsaWNrIiwicmVzcG9uc2UiLCJfdWlfbG9naW5fYW5kX3Bhc3NfZm9ybSIsImdldF9sb2dpbiIsImdldF9wYXNzd29yZCIsInN0YXJ0X2xvYWRpbmciLCJzZW50IiwiZW5kX2xvYWRpbmciLCJzZXRJdGVtIiwibG9jYXRpb24iLCJfdWlfbGluayIsIlNlbGVjdCIsIm9wdGlvbnMiLCJvbkNoYW5nZSIsIl91aV9vcHRpb25zIiwib25jaGFuZ2UiLCJtYXAiLCJvcHRpb24iLCJ1aU9wdCIsInNlbGVjdGVkIiwicHVzaCIsImxhYmVscyIsInVpT3B0aW9uIiwiaW5kZXgiLCJfc2V0dGluZ3Mkb3B0aW9ucyIsIl9zZXR0aW5ncyR2YWx1ZSIsIl9zZXR0aW5ncyRvbkNoYW5nZSIsIkV2ZW50TWFuYWdlciIsIm5hbWUiLCJsaXN0ZW5lciIsIl9ldmVudExpc3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNvbW1vbkV2ZW50TWFuYWdlciIsImNoYW5nZUxhbmciLCJTZWxlY3RMYW5nIiwiX2xhbmdUOW5LZXlzIiwidDluS2V5IiwiX2xhbmdMYWJlbHMiLCJfbGFuZ0lkcyIsImRpc3BhdGNoIiwiZXZlbnRzIiwiX2RhdGEkbGFuZyIsIl91aV9zZWxlY3QiLCJ1cGRhdGVMYWJlbHMiLCJIZWFkZXIiLCJhdXRob3JpemVkIiwiX3VpX2gxIiwiX3VpX2J0biIsIl9zZXR0aW5ncyRhdXRob3JpemVkIiwiX2RlZmF1bHQiLCJldmVudE1hbmFnZXIiLCJzdWJzY3JpYmUiLCJXaXRoSGVhZGVyIiwiX0xvY2FsaXplZFBhZ2UiLCJlbGVtIiwiX2NhbGxTdXBlciIsIl91aV9lbGVtIiwiX3VpX2hlYWRlciIsIl9pbmhlcml0cyIsIkxvY2FsaXplZFBhZ2UiLCJMb2dpblBhZ2UiLCJfdWlfbG9naW5fZm9ybSIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFNBQVNBLGFBQWFBLENBQUNDLEtBQUssRUFBRUMsRUFBRSxFQUFFO0VBQ2hDLE1BQU07SUFBRUMsR0FBRztJQUFFQyxFQUFFO0FBQUVDLElBQUFBO0FBQVUsR0FBQyxHQUFHQyxLQUFLLENBQUNMLEtBQUssQ0FBQztBQUMzQyxFQUFBLE1BQU1NLE9BQU8sR0FBR0wsRUFBRSxHQUNkTSxRQUFRLENBQUNDLGVBQWUsQ0FBQ1AsRUFBRSxFQUFFQyxHQUFHLENBQUMsR0FDakNLLFFBQVEsQ0FBQ1IsYUFBYSxDQUFDRyxHQUFHLENBQUM7QUFFL0IsRUFBQSxJQUFJQyxFQUFFLEVBQUU7SUFDTkcsT0FBTyxDQUFDSCxFQUFFLEdBQUdBLEVBQUU7QUFDakI7QUFFQSxFQUFBLElBQUlDLFNBQVMsRUFBRTtBQUNiLElBRU87TUFDTEUsT0FBTyxDQUFDRixTQUFTLEdBQUdBLFNBQVM7QUFDL0I7QUFDRjtBQUVBLEVBQUEsT0FBT0UsT0FBTztBQUNoQjtBQUVBLFNBQVNELEtBQUtBLENBQUNMLEtBQUssRUFBRTtBQUNwQixFQUFBLE1BQU1TLE1BQU0sR0FBR1QsS0FBSyxDQUFDVSxLQUFLLENBQUMsUUFBUSxDQUFDO0VBQ3BDLElBQUlOLFNBQVMsR0FBRyxFQUFFO0VBQ2xCLElBQUlELEVBQUUsR0FBRyxFQUFFO0FBRVgsRUFBQSxLQUFLLElBQUlRLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0YsTUFBTSxDQUFDRyxNQUFNLEVBQUVELENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDekMsUUFBUUYsTUFBTSxDQUFDRSxDQUFDLENBQUM7QUFDZixNQUFBLEtBQUssR0FBRztRQUNOUCxTQUFTLElBQUksSUFBSUssTUFBTSxDQUFDRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUUsQ0FBQTtBQUNoQyxRQUFBO0FBRUYsTUFBQSxLQUFLLEdBQUc7QUFDTlIsUUFBQUEsRUFBRSxHQUFHTSxNQUFNLENBQUNFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEI7QUFDRjtFQUVBLE9BQU87QUFDTFAsSUFBQUEsU0FBUyxFQUFFQSxTQUFTLENBQUNTLElBQUksRUFBRTtBQUMzQlgsSUFBQUEsR0FBRyxFQUFFTyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSztBQUN2Qk4sSUFBQUE7R0FDRDtBQUNIO0FBRUEsU0FBU1csSUFBSUEsQ0FBQ2QsS0FBSyxFQUFFLEdBQUdlLElBQUksRUFBRTtBQUM1QixFQUFBLElBQUlULE9BQU87RUFFWCxNQUFNVSxJQUFJLEdBQUcsT0FBT2hCLEtBQUs7RUFFekIsSUFBSWdCLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDckJWLElBQUFBLE9BQU8sR0FBR1AsYUFBYSxDQUFDQyxLQUFLLENBQUM7QUFDaEMsR0FBQyxNQUFNLElBQUlnQixJQUFJLEtBQUssVUFBVSxFQUFFO0lBQzlCLE1BQU1DLEtBQUssR0FBR2pCLEtBQUs7QUFDbkJNLElBQUFBLE9BQU8sR0FBRyxJQUFJVyxLQUFLLENBQUMsR0FBR0YsSUFBSSxDQUFDO0FBQzlCLEdBQUMsTUFBTTtBQUNMLElBQUEsTUFBTSxJQUFJRyxLQUFLLENBQUMsZ0NBQWdDLENBQUM7QUFDbkQ7RUFFQUMsc0JBQXNCLENBQUNDLEtBQUssQ0FBQ2QsT0FBTyxDQUFDLEVBQUVTLElBQVUsQ0FBQztBQUVsRCxFQUFBLE9BQU9ULE9BQU87QUFDaEI7QUFFQSxNQUFNZSxFQUFFLEdBQUdQLElBQUk7QUFHZkEsSUFBSSxDQUFDUSxNQUFNLEdBQUcsU0FBU0MsVUFBVUEsQ0FBQyxHQUFHUixJQUFJLEVBQUU7RUFDekMsT0FBT0QsSUFBSSxDQUFDVSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUdULElBQUksQ0FBQztBQUNqQyxDQUFDO0FBcUJELFNBQVNVLFNBQVNBLENBQUNDLEtBQUssRUFBRUMsT0FBTyxFQUFFQyxRQUFRLEVBQUU7QUFDM0MsRUFBQSxNQUFNQyxLQUFLLEdBQUdGLE9BQU8sQ0FBQ0csaUJBQWlCO0FBRXZDLEVBQUEsSUFBSUMsYUFBYSxDQUFDRixLQUFLLENBQUMsRUFBRTtBQUN4QkYsSUFBQUEsT0FBTyxDQUFDRyxpQkFBaUIsR0FBRyxFQUFFO0FBQzlCLElBQUE7QUFDRjtFQUVBLElBQUlFLFFBQVEsR0FBR0osUUFBUTtFQUV2QixJQUFJRCxPQUFPLENBQUNNLGVBQWUsRUFBRTtBQUMzQkMsSUFBQUEsT0FBTyxDQUFDUCxPQUFPLEVBQUUsV0FBVyxDQUFDO0FBQy9CO0FBRUEsRUFBQSxPQUFPSyxRQUFRLEVBQUU7QUFDZixJQUFBLE1BQU1HLFdBQVcsR0FBR0gsUUFBUSxDQUFDRixpQkFBaUIsSUFBSSxFQUFFO0FBRXBELElBQUEsS0FBSyxNQUFNTSxJQUFJLElBQUlQLEtBQUssRUFBRTtBQUN4QixNQUFBLElBQUlNLFdBQVcsQ0FBQ0MsSUFBSSxDQUFDLEVBQUU7QUFDckJELFFBQUFBLFdBQVcsQ0FBQ0MsSUFBSSxDQUFDLElBQUlQLEtBQUssQ0FBQ08sSUFBSSxDQUFDO0FBQ2xDO0FBQ0Y7QUFFQSxJQUFBLElBQUlMLGFBQWEsQ0FBQ0ksV0FBVyxDQUFDLEVBQUU7TUFDOUJILFFBQVEsQ0FBQ0YsaUJBQWlCLEdBQUcsSUFBSTtBQUNuQztJQUVBRSxRQUFRLEdBQUdBLFFBQVEsQ0FBQ0ssVUFBVTtBQUNoQztBQUNGO0FBRUEsU0FBU04sYUFBYUEsQ0FBQ0YsS0FBSyxFQUFFO0VBQzVCLElBQUlBLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDakIsSUFBQSxPQUFPLElBQUk7QUFDYjtBQUNBLEVBQUEsS0FBSyxNQUFNUyxHQUFHLElBQUlULEtBQUssRUFBRTtBQUN2QixJQUFBLElBQUlBLEtBQUssQ0FBQ1MsR0FBRyxDQUFDLEVBQUU7QUFDZCxNQUFBLE9BQU8sS0FBSztBQUNkO0FBQ0Y7QUFDQSxFQUFBLE9BQU8sSUFBSTtBQUNiOztBQUVBOztBQUdBLE1BQU1DLFNBQVMsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDO0FBQ3ZELE1BQU1DLG1CQUFtQixHQUN2QixPQUFPQyxNQUFNLEtBQUssV0FBVyxJQUFJLFlBQVksSUFBSUEsTUFBTTtBQUV6RCxTQUFTQyxLQUFLQSxDQUFDQyxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxPQUFPLEVBQUU7RUFDOUMsSUFBSXBCLEtBQUssR0FBR2tCLE1BQU07QUFDbEIsRUFBQSxNQUFNaEIsUUFBUSxHQUFHUixLQUFLLENBQUN1QixNQUFNLENBQUM7QUFDOUIsRUFBQSxNQUFNaEIsT0FBTyxHQUFHUCxLQUFLLENBQUNNLEtBQUssQ0FBQztBQUU1QixFQUFBLElBQUlBLEtBQUssS0FBS0MsT0FBTyxJQUFJQSxPQUFPLENBQUNvQixZQUFZLEVBQUU7QUFDN0M7SUFDQXJCLEtBQUssR0FBR0MsT0FBTyxDQUFDb0IsWUFBWTtBQUM5QjtFQUVBLElBQUlyQixLQUFLLEtBQUtDLE9BQU8sRUFBRTtJQUNyQkEsT0FBTyxDQUFDb0IsWUFBWSxHQUFHckIsS0FBSztBQUM5QjtBQUVBLEVBQUEsTUFBTXNCLFVBQVUsR0FBR3JCLE9BQU8sQ0FBQ00sZUFBZTtBQUMxQyxFQUFBLE1BQU1nQixTQUFTLEdBQUd0QixPQUFPLENBQUNVLFVBQVU7QUFFcEMsRUFBQSxJQUFJVyxVQUFVLElBQUlDLFNBQVMsS0FBS3JCLFFBQVEsRUFBRTtBQUN4Q0gsSUFBQUEsU0FBUyxDQUFDQyxLQUFLLEVBQUVDLE9BQU8sRUFBRXNCLFNBQVMsQ0FBQztBQUN0QztFQWNPO0FBQ0xyQixJQUFBQSxRQUFRLENBQUNzQixXQUFXLENBQUN2QixPQUFPLENBQUM7QUFDL0I7RUFFQXdCLE9BQU8sQ0FBQ3pCLEtBQUssRUFBRUMsT0FBTyxFQUFFQyxRQUFRLEVBQUVxQixTQUFTLENBQUM7QUFFNUMsRUFBQSxPQUFPdkIsS0FBSztBQUNkO0FBRUEsU0FBU1EsT0FBT0EsQ0FBQ2IsRUFBRSxFQUFFK0IsU0FBUyxFQUFFO0FBQzlCLEVBQUEsSUFBSUEsU0FBUyxLQUFLLFNBQVMsSUFBSUEsU0FBUyxLQUFLLFdBQVcsRUFBRTtJQUN4RC9CLEVBQUUsQ0FBQ1ksZUFBZSxHQUFHLElBQUk7QUFDM0IsR0FBQyxNQUFNLElBQUltQixTQUFTLEtBQUssV0FBVyxFQUFFO0lBQ3BDL0IsRUFBRSxDQUFDWSxlQUFlLEdBQUcsS0FBSztBQUM1QjtBQUVBLEVBQUEsTUFBTUosS0FBSyxHQUFHUixFQUFFLENBQUNTLGlCQUFpQjtFQUVsQyxJQUFJLENBQUNELEtBQUssRUFBRTtBQUNWLElBQUE7QUFDRjtBQUVBLEVBQUEsTUFBTXdCLElBQUksR0FBR2hDLEVBQUUsQ0FBQzBCLFlBQVk7RUFDNUIsSUFBSU8sU0FBUyxHQUFHLENBQUM7QUFFakJELEVBQUFBLElBQUksR0FBR0QsU0FBUyxDQUFDLElBQUk7QUFFckIsRUFBQSxLQUFLLE1BQU1oQixJQUFJLElBQUlQLEtBQUssRUFBRTtBQUN4QixJQUFBLElBQUlPLElBQUksRUFBRTtBQUNSa0IsTUFBQUEsU0FBUyxFQUFFO0FBQ2I7QUFDRjtBQUVBLEVBQUEsSUFBSUEsU0FBUyxFQUFFO0FBQ2IsSUFBQSxJQUFJdEIsUUFBUSxHQUFHWCxFQUFFLENBQUNrQyxVQUFVO0FBRTVCLElBQUEsT0FBT3ZCLFFBQVEsRUFBRTtBQUNmLE1BQUEsTUFBTXdCLElBQUksR0FBR3hCLFFBQVEsQ0FBQ3lCLFdBQVc7QUFFakN2QixNQUFBQSxPQUFPLENBQUNGLFFBQVEsRUFBRW9CLFNBQVMsQ0FBQztBQUU1QnBCLE1BQUFBLFFBQVEsR0FBR3dCLElBQUk7QUFDakI7QUFDRjtBQUNGO0FBRUEsU0FBU0wsT0FBT0EsQ0FBQ3pCLEtBQUssRUFBRUMsT0FBTyxFQUFFQyxRQUFRLEVBQUVxQixTQUFTLEVBQUU7QUFDcEQsRUFBQSxJQUFJLENBQUN0QixPQUFPLENBQUNHLGlCQUFpQixFQUFFO0FBQzlCSCxJQUFBQSxPQUFPLENBQUNHLGlCQUFpQixHQUFHLEVBQUU7QUFDaEM7QUFFQSxFQUFBLE1BQU1ELEtBQUssR0FBR0YsT0FBTyxDQUFDRyxpQkFBaUI7QUFDdkMsRUFBQSxNQUFNNEIsT0FBTyxHQUFHOUIsUUFBUSxLQUFLcUIsU0FBUztFQUN0QyxJQUFJVSxVQUFVLEdBQUcsS0FBSztBQUV0QixFQUFBLEtBQUssTUFBTUMsUUFBUSxJQUFJckIsU0FBUyxFQUFFO0lBQ2hDLElBQUksQ0FBQ21CLE9BQU8sRUFBRTtBQUNaO01BQ0EsSUFBSWhDLEtBQUssS0FBS0MsT0FBTyxFQUFFO0FBQ3JCO1FBQ0EsSUFBSWlDLFFBQVEsSUFBSWxDLEtBQUssRUFBRTtBQUNyQkcsVUFBQUEsS0FBSyxDQUFDK0IsUUFBUSxDQUFDLEdBQUcsQ0FBQy9CLEtBQUssQ0FBQytCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzlDO0FBQ0Y7QUFDRjtBQUNBLElBQUEsSUFBSS9CLEtBQUssQ0FBQytCLFFBQVEsQ0FBQyxFQUFFO0FBQ25CRCxNQUFBQSxVQUFVLEdBQUcsSUFBSTtBQUNuQjtBQUNGO0VBRUEsSUFBSSxDQUFDQSxVQUFVLEVBQUU7QUFDZmhDLElBQUFBLE9BQU8sQ0FBQ0csaUJBQWlCLEdBQUcsRUFBRTtBQUM5QixJQUFBO0FBQ0Y7RUFFQSxJQUFJRSxRQUFRLEdBQUdKLFFBQVE7RUFDdkIsSUFBSWlDLFNBQVMsR0FBRyxLQUFLO0FBRXJCLEVBQUEsSUFBSUgsT0FBTyxJQUFJMUIsUUFBUSxFQUFFQyxlQUFlLEVBQUU7SUFDeENDLE9BQU8sQ0FBQ1AsT0FBTyxFQUFFK0IsT0FBTyxHQUFHLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFDbkRHLElBQUFBLFNBQVMsR0FBRyxJQUFJO0FBQ2xCO0FBRUEsRUFBQSxPQUFPN0IsUUFBUSxFQUFFO0FBQ2YsSUFBQSxNQUFNVyxNQUFNLEdBQUdYLFFBQVEsQ0FBQ0ssVUFBVTtBQUVsQyxJQUFBLElBQUksQ0FBQ0wsUUFBUSxDQUFDRixpQkFBaUIsRUFBRTtBQUMvQkUsTUFBQUEsUUFBUSxDQUFDRixpQkFBaUIsR0FBRyxFQUFFO0FBQ2pDO0FBRUEsSUFBQSxNQUFNSyxXQUFXLEdBQUdILFFBQVEsQ0FBQ0YsaUJBQWlCO0FBRTlDLElBQUEsS0FBSyxNQUFNTSxJQUFJLElBQUlQLEtBQUssRUFBRTtBQUN4Qk0sTUFBQUEsV0FBVyxDQUFDQyxJQUFJLENBQUMsR0FBRyxDQUFDRCxXQUFXLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSVAsS0FBSyxDQUFDTyxJQUFJLENBQUM7QUFDNUQ7QUFFQSxJQUFBLElBQUl5QixTQUFTLEVBQUU7QUFDYixNQUFBO0FBQ0Y7QUFDQSxJQUFBLElBQ0U3QixRQUFRLENBQUM4QixRQUFRLEtBQUtDLElBQUksQ0FBQ0MsYUFBYSxJQUN2Q3hCLG1CQUFtQixJQUFJUixRQUFRLFlBQVlpQyxVQUFXLElBQ3ZEdEIsTUFBTSxFQUFFVixlQUFlLEVBQ3ZCO01BQ0FDLE9BQU8sQ0FBQ0YsUUFBUSxFQUFFMEIsT0FBTyxHQUFHLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFDcERHLE1BQUFBLFNBQVMsR0FBRyxJQUFJO0FBQ2xCO0FBQ0E3QixJQUFBQSxRQUFRLEdBQUdXLE1BQU07QUFDbkI7QUFDRjtBQUVBLFNBQVN1QixRQUFRQSxDQUFDYixJQUFJLEVBQUVjLElBQUksRUFBRUMsSUFBSSxFQUFFO0FBQ2xDLEVBQUEsTUFBTS9DLEVBQUUsR0FBR0QsS0FBSyxDQUFDaUMsSUFBSSxDQUFDO0FBRXRCLEVBQUEsSUFBSSxPQUFPYyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzVCLElBQUEsS0FBSyxNQUFNN0IsR0FBRyxJQUFJNkIsSUFBSSxFQUFFO01BQ3RCRSxhQUFhLENBQUNoRCxFQUFFLEVBQUVpQixHQUFHLEVBQUU2QixJQUFJLENBQUM3QixHQUFHLENBQUMsQ0FBQztBQUNuQztBQUNGLEdBQUMsTUFBTTtBQUNMK0IsSUFBQUEsYUFBYSxDQUFDaEQsRUFBRSxFQUFFOEMsSUFBSSxFQUFFQyxJQUFJLENBQUM7QUFDL0I7QUFDRjtBQUVBLFNBQVNDLGFBQWFBLENBQUNoRCxFQUFFLEVBQUVpQixHQUFHLEVBQUVnQyxLQUFLLEVBQUU7QUFDckNqRCxFQUFBQSxFQUFFLENBQUNrRCxLQUFLLENBQUNqQyxHQUFHLENBQUMsR0FBR2dDLEtBQUssSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHQSxLQUFLO0FBQzVDOztBQUVBOztBQUdBLE1BQU1FLE9BQU8sR0FBRyw4QkFBOEI7QUFNOUMsU0FBU0MsZUFBZUEsQ0FBQ3BCLElBQUksRUFBRWMsSUFBSSxFQUFFQyxJQUFJLEVBQUVNLE9BQU8sRUFBRTtBQUNsRCxFQUFBLE1BQU1yRCxFQUFFLEdBQUdELEtBQUssQ0FBQ2lDLElBQUksQ0FBQztBQUV0QixFQUFBLE1BQU1zQixLQUFLLEdBQUcsT0FBT1IsSUFBSSxLQUFLLFFBQVE7QUFFdEMsRUFBQSxJQUFJUSxLQUFLLEVBQUU7QUFDVCxJQUFBLEtBQUssTUFBTXJDLEdBQUcsSUFBSTZCLElBQUksRUFBRTtNQUN0Qk0sZUFBZSxDQUFDcEQsRUFBRSxFQUFFaUIsR0FBRyxFQUFFNkIsSUFBSSxDQUFDN0IsR0FBRyxDQUFVLENBQUM7QUFDOUM7QUFDRixHQUFDLE1BQU07QUFDTCxJQUFBLE1BQU1zQyxLQUFLLEdBQUd2RCxFQUFFLFlBQVl3RCxVQUFVO0FBQ3RDLElBQUEsTUFBTUMsTUFBTSxHQUFHLE9BQU9WLElBQUksS0FBSyxVQUFVO0lBRXpDLElBQUlELElBQUksS0FBSyxPQUFPLElBQUksT0FBT0MsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNoREYsTUFBQUEsUUFBUSxDQUFDN0MsRUFBRSxFQUFFK0MsSUFBSSxDQUFDO0FBQ3BCLEtBQUMsTUFBTSxJQUFJUSxLQUFLLElBQUlFLE1BQU0sRUFBRTtBQUMxQnpELE1BQUFBLEVBQUUsQ0FBQzhDLElBQUksQ0FBQyxHQUFHQyxJQUFJO0FBQ2pCLEtBQUMsTUFBTSxJQUFJRCxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQzdCWSxNQUFBQSxPQUFPLENBQUMxRCxFQUFFLEVBQUUrQyxJQUFJLENBQUM7QUFDbkIsS0FBQyxNQUFNLElBQUksQ0FBQ1EsS0FBSyxLQUFLVCxJQUFJLElBQUk5QyxFQUFFLElBQUl5RCxNQUFNLENBQUMsSUFBSVgsSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUM5RDlDLE1BQUFBLEVBQUUsQ0FBQzhDLElBQUksQ0FBQyxHQUFHQyxJQUFJO0FBQ2pCLEtBQUMsTUFBTTtBQUNMLE1BQUEsSUFBSVEsS0FBSyxJQUFJVCxJQUFJLEtBQUssT0FBTyxFQUFFO0FBQzdCYSxRQUFBQSxRQUFRLENBQUMzRCxFQUFFLEVBQUUrQyxJQUFJLENBQUM7QUFDbEIsUUFBQTtBQUNGO0FBQ0EsTUFBQSxJQUFlRCxJQUFJLEtBQUssT0FBTyxFQUFFO0FBQy9CYyxRQUFBQSxZQUFZLENBQUM1RCxFQUFFLEVBQUUrQyxJQUFJLENBQUM7QUFDdEIsUUFBQTtBQUNGO01BQ0EsSUFBSUEsSUFBSSxJQUFJLElBQUksRUFBRTtBQUNoQi9DLFFBQUFBLEVBQUUsQ0FBQzZELGVBQWUsQ0FBQ2YsSUFBSSxDQUFDO0FBQzFCLE9BQUMsTUFBTTtBQUNMOUMsUUFBQUEsRUFBRSxDQUFDOEQsWUFBWSxDQUFDaEIsSUFBSSxFQUFFQyxJQUFJLENBQUM7QUFDN0I7QUFDRjtBQUNGO0FBQ0Y7QUFFQSxTQUFTYSxZQUFZQSxDQUFDNUQsRUFBRSxFQUFFK0QsbUJBQW1CLEVBQUU7RUFDN0MsSUFBSUEsbUJBQW1CLElBQUksSUFBSSxFQUFFO0FBQy9CL0QsSUFBQUEsRUFBRSxDQUFDNkQsZUFBZSxDQUFDLE9BQU8sQ0FBQztBQUM3QixHQUFDLE1BQU0sSUFBSTdELEVBQUUsQ0FBQ2dFLFNBQVMsRUFBRTtBQUN2QmhFLElBQUFBLEVBQUUsQ0FBQ2dFLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDRixtQkFBbUIsQ0FBQztBQUN2QyxHQUFDLE1BQU0sSUFDTCxPQUFPL0QsRUFBRSxDQUFDakIsU0FBUyxLQUFLLFFBQVEsSUFDaENpQixFQUFFLENBQUNqQixTQUFTLElBQ1ppQixFQUFFLENBQUNqQixTQUFTLENBQUNtRixPQUFPLEVBQ3BCO0FBQ0FsRSxJQUFBQSxFQUFFLENBQUNqQixTQUFTLENBQUNtRixPQUFPLEdBQ2xCLEdBQUdsRSxFQUFFLENBQUNqQixTQUFTLENBQUNtRixPQUFPLENBQUlILENBQUFBLEVBQUFBLG1CQUFtQixFQUFFLENBQUN2RSxJQUFJLEVBQUU7QUFDM0QsR0FBQyxNQUFNO0FBQ0xRLElBQUFBLEVBQUUsQ0FBQ2pCLFNBQVMsR0FBRyxDQUFBLEVBQUdpQixFQUFFLENBQUNqQixTQUFTLENBQUEsQ0FBQSxFQUFJZ0YsbUJBQW1CLENBQUEsQ0FBRSxDQUFDdkUsSUFBSSxFQUFFO0FBQ2hFO0FBQ0Y7QUFFQSxTQUFTbUUsUUFBUUEsQ0FBQzNELEVBQUUsRUFBRThDLElBQUksRUFBRUMsSUFBSSxFQUFFO0FBQ2hDLEVBQUEsSUFBSSxPQUFPRCxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzVCLElBQUEsS0FBSyxNQUFNN0IsR0FBRyxJQUFJNkIsSUFBSSxFQUFFO01BQ3RCYSxRQUFRLENBQUMzRCxFQUFFLEVBQUVpQixHQUFHLEVBQUU2QixJQUFJLENBQUM3QixHQUFHLENBQUMsQ0FBQztBQUM5QjtBQUNGLEdBQUMsTUFBTTtJQUNMLElBQUk4QixJQUFJLElBQUksSUFBSSxFQUFFO01BQ2hCL0MsRUFBRSxDQUFDbUUsY0FBYyxDQUFDaEIsT0FBTyxFQUFFTCxJQUFJLEVBQUVDLElBQUksQ0FBQztBQUN4QyxLQUFDLE1BQU07TUFDTC9DLEVBQUUsQ0FBQ29FLGlCQUFpQixDQUFDakIsT0FBTyxFQUFFTCxJQUFJLEVBQUVDLElBQUksQ0FBQztBQUMzQztBQUNGO0FBQ0Y7QUFFQSxTQUFTVyxPQUFPQSxDQUFDMUQsRUFBRSxFQUFFOEMsSUFBSSxFQUFFQyxJQUFJLEVBQUU7QUFDL0IsRUFBQSxJQUFJLE9BQU9ELElBQUksS0FBSyxRQUFRLEVBQUU7QUFDNUIsSUFBQSxLQUFLLE1BQU03QixHQUFHLElBQUk2QixJQUFJLEVBQUU7TUFDdEJZLE9BQU8sQ0FBQzFELEVBQUUsRUFBRWlCLEdBQUcsRUFBRTZCLElBQUksQ0FBQzdCLEdBQUcsQ0FBQyxDQUFDO0FBQzdCO0FBQ0YsR0FBQyxNQUFNO0lBQ0wsSUFBSThCLElBQUksSUFBSSxJQUFJLEVBQUU7QUFDaEIvQyxNQUFBQSxFQUFFLENBQUNxRSxPQUFPLENBQUN2QixJQUFJLENBQUMsR0FBR0MsSUFBSTtBQUN6QixLQUFDLE1BQU07QUFDTCxNQUFBLE9BQU8vQyxFQUFFLENBQUNxRSxPQUFPLENBQUN2QixJQUFJLENBQUM7QUFDekI7QUFDRjtBQUNGO0FBRUEsU0FBU3dCLElBQUlBLENBQUNDLEdBQUcsRUFBRTtFQUNqQixPQUFPckYsUUFBUSxDQUFDc0YsY0FBYyxDQUFDRCxHQUFHLElBQUksSUFBSSxHQUFHQSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ3hEO0FBRUEsU0FBU3pFLHNCQUFzQkEsQ0FBQ2IsT0FBTyxFQUFFUyxJQUFJLEVBQUUyRCxPQUFPLEVBQUU7QUFDdEQsRUFBQSxLQUFLLE1BQU1vQixHQUFHLElBQUkvRSxJQUFJLEVBQUU7QUFDdEIsSUFBQSxJQUFJK0UsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDQSxHQUFHLEVBQUU7QUFDckIsTUFBQTtBQUNGO0lBRUEsTUFBTTlFLElBQUksR0FBRyxPQUFPOEUsR0FBRztJQUV2QixJQUFJOUUsSUFBSSxLQUFLLFVBQVUsRUFBRTtNQUN2QjhFLEdBQUcsQ0FBQ3hGLE9BQU8sQ0FBQztLQUNiLE1BQU0sSUFBSVUsSUFBSSxLQUFLLFFBQVEsSUFBSUEsSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNqRFYsTUFBQUEsT0FBTyxDQUFDNEMsV0FBVyxDQUFDeUMsSUFBSSxDQUFDRyxHQUFHLENBQUMsQ0FBQztLQUMvQixNQUFNLElBQUlDLE1BQU0sQ0FBQzNFLEtBQUssQ0FBQzBFLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDN0JwRCxNQUFBQSxLQUFLLENBQUNwQyxPQUFPLEVBQUV3RixHQUFHLENBQUM7QUFDckIsS0FBQyxNQUFNLElBQUlBLEdBQUcsQ0FBQ2xGLE1BQU0sRUFBRTtBQUNyQk8sTUFBQUEsc0JBQXNCLENBQUNiLE9BQU8sRUFBRXdGLEdBQVksQ0FBQztBQUMvQyxLQUFDLE1BQU0sSUFBSTlFLElBQUksS0FBSyxRQUFRLEVBQUU7TUFDNUJ5RCxlQUFlLENBQUNuRSxPQUFPLEVBQUV3RixHQUFHLEVBQUUsSUFBYSxDQUFDO0FBQzlDO0FBQ0Y7QUFDRjtBQU1BLFNBQVMxRSxLQUFLQSxDQUFDdUIsTUFBTSxFQUFFO0FBQ3JCLEVBQUEsT0FDR0EsTUFBTSxDQUFDbUIsUUFBUSxJQUFJbkIsTUFBTSxJQUFNLENBQUNBLE1BQU0sQ0FBQ3RCLEVBQUUsSUFBSXNCLE1BQU8sSUFBSXZCLEtBQUssQ0FBQ3VCLE1BQU0sQ0FBQ3RCLEVBQUUsQ0FBQztBQUU3RTtBQUVBLFNBQVMwRSxNQUFNQSxDQUFDRCxHQUFHLEVBQUU7RUFDbkIsT0FBT0EsR0FBRyxFQUFFaEMsUUFBUTtBQUN0Qjs7QUM5YW1FLElBRTlDa0MsTUFBTSxnQkFBQUMsWUFBQSxDQUN2QixTQUFBRCxTQUEyQjtBQUFBLEVBQUEsSUFBQUUsS0FBQSxHQUFBLElBQUE7QUFBQSxFQUFBLElBQWZDLFFBQVEsR0FBQUMsU0FBQSxDQUFBeEYsTUFBQSxHQUFBLENBQUEsSUFBQXdGLFNBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQUMsU0FBQSxHQUFBRCxTQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUcsRUFBRTtBQUFBRSxFQUFBQSxlQUFBLE9BQUFOLE1BQUEsQ0FBQTtBQUFBTyxFQUFBQSxlQUFBLHFCQXVCWixZQUFNO0FBQ2YsSUFBQSxJQUFBQyxXQUFBLEdBQTJETixLQUFJLENBQUNPLEtBQUs7TUFBN0RkLElBQUksR0FBQWEsV0FBQSxDQUFKYixJQUFJO01BQUVlLElBQUksR0FBQUYsV0FBQSxDQUFKRSxJQUFJO01BQUUxRixJQUFJLEdBQUF3RixXQUFBLENBQUp4RixJQUFJO01BQUUyRixRQUFRLEdBQUFILFdBQUEsQ0FBUkcsUUFBUTtNQUFFQyxPQUFPLEdBQUFKLFdBQUEsQ0FBUEksT0FBTztNQUFFeEcsU0FBUyxHQUFBb0csV0FBQSxDQUFUcEcsU0FBUztJQUV0RCxPQUNpQixJQUFBLENBQUEsWUFBWSxJQUF6QmlCLEVBQUEsQ0FBQSxRQUFBLEVBQUE7TUFBMEJqQixTQUFTLEVBQUEsVUFBQSxDQUFBeUcsTUFBQSxDQUFhN0YsSUFBSSxPQUFBNkYsTUFBQSxDQUFJekcsU0FBUyxDQUFHO0FBQ2hFMEcsTUFBQUEsT0FBTyxFQUFFRixPQUFRO0FBQUNELE1BQUFBLFFBQVEsRUFBRUE7QUFBUyxLQUFBLEVBQ3BDVCxLQUFJLENBQUNhLFFBQVEsQ0FBQ0wsSUFBSSxDQUFDLEVBQ1QsSUFBQSxDQUFBLFVBQVUsQ0FBckJyRixHQUFBQSxFQUFBLENBQXVCc0UsTUFBQUEsRUFBQUEsSUFBQUEsRUFBQUEsSUFBVyxDQUM5QixDQUFDO0dBRWhCLENBQUE7RUFBQVksZUFBQSxDQUFBLElBQUEsRUFBQSxVQUFBLEVBRVUsVUFBQ0csSUFBSSxFQUFLO0lBQ2pCLE9BQU9BLElBQUksR0FBR3JGLEVBQUEsQ0FBQSxHQUFBLEVBQUE7TUFBR2pCLFNBQVMsRUFBQSxRQUFBLENBQUF5RyxNQUFBLENBQVdILElBQUksRUFBQSxPQUFBO0tBQVksQ0FBQyxHQUFHLElBQUk7R0FDaEUsQ0FBQTtBQUFBSCxFQUFBQSxlQUFBLHNCQUVhLFlBQU07QUFDaEIsSUFBQSxPQUFPbEYsRUFBQSxDQUFBLE1BQUEsRUFBQTtBQUFNakIsTUFBQUEsU0FBUyxFQUFDO0FBQXVDLEtBQUUsQ0FBQztHQUNwRSxDQUFBO0VBQUFtRyxlQUFBLENBQUEsSUFBQSxFQUFBLGVBQUEsRUFFZSxVQUFDUyxZQUFZLEVBQUs7SUFDOUJkLEtBQUksQ0FBQ2UsTUFBTSxDQUFDO0FBQUVOLE1BQUFBLFFBQVEsRUFBRSxJQUFJO0FBQUVoQixNQUFBQSxJQUFJLEVBQUVxQixZQUFZO0FBQUVFLE1BQUFBLE9BQU8sRUFBRTtBQUFLLEtBQUMsQ0FBQztHQUNyRSxDQUFBO0VBQUFYLGVBQUEsQ0FBQSxJQUFBLEVBQUEsYUFBQSxFQUVhLFVBQUNZLEtBQUssRUFBSztJQUNyQmpCLEtBQUksQ0FBQ2UsTUFBTSxDQUFDO0FBQUVOLE1BQUFBLFFBQVEsRUFBRSxLQUFLO0FBQUVoQixNQUFBQSxJQUFJLEVBQUV3QixLQUFLO0FBQUVELE1BQUFBLE9BQU8sRUFBRTtBQUFNLEtBQUMsQ0FBQztHQUNoRSxDQUFBO0VBQUFYLGVBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxFQUVRLFVBQUNhLElBQUksRUFBSztBQUNmLElBQUEsSUFBQUMsVUFBQSxHQVFJRCxJQUFJLENBUEp6QixJQUFJO01BQUpBLElBQUksR0FBQTBCLFVBQUEsS0FBR25CLE1BQUFBLEdBQUFBLEtBQUksQ0FBQ08sS0FBSyxDQUFDZCxJQUFJLEdBQUEwQixVQUFBO01BQUFDLFVBQUEsR0FPdEJGLElBQUksQ0FOSlYsSUFBSTtNQUFKQSxJQUFJLEdBQUFZLFVBQUEsS0FBR3BCLE1BQUFBLEdBQUFBLEtBQUksQ0FBQ08sS0FBSyxDQUFDQyxJQUFJLEdBQUFZLFVBQUE7TUFBQUMsVUFBQSxHQU10QkgsSUFBSSxDQUxKcEcsSUFBSTtNQUFKQSxJQUFJLEdBQUF1RyxVQUFBLEtBQUdyQixNQUFBQSxHQUFBQSxLQUFJLENBQUNPLEtBQUssQ0FBQ3pGLElBQUksR0FBQXVHLFVBQUE7TUFBQUMsY0FBQSxHQUt0QkosSUFBSSxDQUpKVCxRQUFRO01BQVJBLFFBQVEsR0FBQWEsY0FBQSxLQUFHdEIsTUFBQUEsR0FBQUEsS0FBSSxDQUFDTyxLQUFLLENBQUNFLFFBQVEsR0FBQWEsY0FBQTtNQUFBQyxhQUFBLEdBSTlCTCxJQUFJLENBSEpGLE9BQU87TUFBUEEsT0FBTyxHQUFBTyxhQUFBLEtBQUd2QixNQUFBQSxHQUFBQSxLQUFJLENBQUNPLEtBQUssQ0FBQ1MsT0FBTyxHQUFBTyxhQUFBO01BQUFDLGFBQUEsR0FHNUJOLElBQUksQ0FGSlIsT0FBTztNQUFQQSxPQUFPLEdBQUFjLGFBQUEsS0FBR3hCLE1BQUFBLEdBQUFBLEtBQUksQ0FBQ08sS0FBSyxDQUFDRyxPQUFPLEdBQUFjLGFBQUE7TUFBQUMsZUFBQSxHQUU1QlAsSUFBSSxDQURKaEgsU0FBUztNQUFUQSxTQUFTLEdBQUF1SCxlQUFBLEtBQUd6QixNQUFBQSxHQUFBQSxLQUFJLENBQUNPLEtBQUssQ0FBQ3JHLFNBQVMsR0FBQXVILGVBQUE7QUFHcEMsSUFBQSxJQUFJVCxPQUFPLEtBQUtoQixLQUFJLENBQUNPLEtBQUssQ0FBQ1MsT0FBTyxFQUFFO01BQ2hDLElBQUloQixLQUFJLENBQUMwQixVQUFVLENBQUNDLFVBQVUsQ0FBQ2pILE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDdkMsSUFBTWtILGFBQWEsR0FBRzVCLEtBQUksQ0FBQzBCLFVBQVUsQ0FBQ0MsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNuRDNCLFFBQUFBLEtBQUksQ0FBQzBCLFVBQVUsQ0FBQ0csV0FBVyxDQUFDRCxhQUFhLENBQUM7QUFDOUM7QUFDQSxNQUFBLElBQU1wRyxLQUFLLEdBQUd3RixPQUFPLEdBQUdoQixLQUFJLENBQUM4QixXQUFXLEVBQUUsR0FBRzlCLEtBQUksQ0FBQ2EsUUFBUSxDQUFDTCxJQUFJLENBQUM7QUFDaEVoRixNQUFBQSxLQUFLLElBQUl3RSxLQUFJLENBQUMwQixVQUFVLENBQUNLLFlBQVksQ0FBQ3ZHLEtBQUssRUFBRXdFLEtBQUksQ0FBQ2dDLFFBQVEsQ0FBQztBQUMvRDtBQUNBLElBQUEsSUFBSXhCLElBQUksS0FBS1IsS0FBSSxDQUFDTyxLQUFLLENBQUNDLElBQUksRUFBRTtNQUMxQixJQUFJUixLQUFJLENBQUMwQixVQUFVLENBQUNDLFVBQVUsQ0FBQ2pILE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDdkMsSUFBTWtILGNBQWEsR0FBRzVCLEtBQUksQ0FBQzBCLFVBQVUsQ0FBQ0MsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNuRDNCLFFBQUFBLEtBQUksQ0FBQzBCLFVBQVUsQ0FBQ0csV0FBVyxDQUFDRCxjQUFhLENBQUM7QUFDOUM7QUFDQSxNQUFBLElBQU1wRyxNQUFLLEdBQUd3RSxLQUFJLENBQUNhLFFBQVEsQ0FBQ0wsSUFBSSxDQUFDO0FBQ2pDaEYsTUFBQUEsTUFBSyxJQUFJd0UsS0FBSSxDQUFDMEIsVUFBVSxDQUFDSyxZQUFZLENBQUMvQixLQUFJLENBQUNhLFFBQVEsQ0FBQ0wsSUFBSSxDQUFDLEVBQUVSLEtBQUksQ0FBQ2dDLFFBQVEsQ0FBQztBQUM3RTtBQUNBLElBQUEsSUFBSXZDLElBQUksS0FBS08sS0FBSSxDQUFDTyxLQUFLLENBQUNkLElBQUksRUFBRTtBQUMxQixNQUFBLElBQU13QyxRQUFRLEdBQUc5RyxFQUFBLENBQUEsS0FBQSxFQUFBLElBQUEsRUFBTXNFLElBQVUsQ0FBQztBQUNsQ08sTUFBQUEsS0FBSSxDQUFDZ0MsUUFBUSxDQUFDRSxTQUFTLEdBQUdELFFBQVEsQ0FBQ0MsU0FBUztBQUNoRDtBQUNBLElBQUEsSUFBSWhJLFNBQVMsS0FBSzhGLEtBQUksQ0FBQ08sS0FBSyxDQUFDckcsU0FBUyxFQUFFO0FBQ3BDOEYsTUFBQUEsS0FBSSxDQUFDMEIsVUFBVSxDQUFDeEgsU0FBUyxHQUFBeUcsVUFBQUEsQ0FBQUEsTUFBQSxDQUFjN0YsSUFBSSxFQUFBNkYsR0FBQUEsQ0FBQUEsQ0FBQUEsTUFBQSxDQUFJekcsU0FBUyxDQUFFO0FBQzlEO0FBQ0EsSUFBQSxJQUFJdUcsUUFBUSxLQUFLVCxLQUFJLENBQUNPLEtBQUssQ0FBQ0UsUUFBUSxFQUFFO0FBQ2xDVCxNQUFBQSxLQUFJLENBQUMwQixVQUFVLENBQUNqQixRQUFRLEdBQUdBLFFBQVE7QUFDdkM7QUFDQSxJQUFBLElBQUlDLE9BQU8sS0FBS1YsS0FBSSxDQUFDTyxLQUFLLENBQUNHLE9BQU8sRUFBRTtBQUNoQ1YsTUFBQUEsS0FBSSxDQUFDMEIsVUFBVSxDQUFDZCxPQUFPLEdBQUdGLE9BQU87QUFDckM7SUFFQVYsS0FBSSxDQUFDTyxLQUFLLEdBQUE0QixjQUFBLENBQUFBLGNBQUEsQ0FBQSxFQUFBLEVBQVFuQyxLQUFJLENBQUNPLEtBQUssQ0FBQSxFQUFBLEVBQUEsRUFBQTtBQUFFZCxNQUFBQSxJQUFJLEVBQUpBLElBQUk7QUFBRWUsTUFBQUEsSUFBSSxFQUFKQSxJQUFJO0FBQUUxRixNQUFBQSxJQUFJLEVBQUpBLElBQUk7QUFBRTJGLE1BQUFBLFFBQVEsRUFBUkEsUUFBUTtBQUFFTyxNQUFBQSxPQUFPLEVBQVBBLE9BQU87QUFBRU4sTUFBQUEsT0FBTyxFQUFQQSxPQUFPO0FBQUV4RyxNQUFBQSxTQUFTLEVBQVRBO0tBQVcsQ0FBQTtHQUMxRixDQUFBO0FBNUZHLEVBQUEsSUFBQWtJLGNBQUEsR0FPSW5DLFFBQVEsQ0FOUlIsSUFBSTtBQUFKQSxJQUFBQSxLQUFJLEdBQUEyQyxjQUFBLEtBQUcsTUFBQSxHQUFBLEVBQUUsR0FBQUEsY0FBQTtJQUFBQyxjQUFBLEdBTVRwQyxRQUFRLENBTFJPLElBQUk7QUFBSkEsSUFBQUEsS0FBSSxHQUFBNkIsY0FBQSxLQUFHLE1BQUEsR0FBQSxJQUFJLEdBQUFBLGNBQUE7SUFBQUMsY0FBQSxHQUtYckMsUUFBUSxDQUpSbkYsSUFBSTtBQUFKQSxJQUFBQSxLQUFJLEdBQUF3SCxjQUFBLEtBQUcsTUFBQSxHQUFBLFNBQVMsR0FBQUEsY0FBQTtJQUFBQyxrQkFBQSxHQUloQnRDLFFBQVEsQ0FIUlEsUUFBUTtBQUFSQSxJQUFBQSxTQUFRLEdBQUE4QixrQkFBQSxLQUFHLE1BQUEsR0FBQSxLQUFLLEdBQUFBLGtCQUFBO0lBQUFDLGlCQUFBLEdBR2hCdkMsUUFBUSxDQUZSUyxPQUFPO0FBQVBBLElBQUFBLFFBQU8sR0FBQThCLGlCQUFBLEtBQUcsTUFBQSxHQUFBLFVBQUNDLENBQUMsRUFBSztNQUFFQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRUYsQ0FBQyxDQUFDRyxNQUFNLENBQUM7QUFBRSxLQUFDLEdBQUFKLGlCQUFBO0lBQUFLLG1CQUFBLEdBRTdENUMsUUFBUSxDQURSL0YsU0FBUztBQUFUQSxJQUFBQSxVQUFTLEdBQUEySSxtQkFBQSxLQUFHLE1BQUEsR0FBQSxFQUFFLEdBQUFBLG1CQUFBO0VBR2xCLElBQUksQ0FBQ3RDLEtBQUssR0FBRztBQUNUZCxJQUFBQSxJQUFJLEVBQUpBLEtBQUk7QUFDSmUsSUFBQUEsSUFBSSxFQUFKQSxLQUFJO0FBQ0oxRixJQUFBQSxJQUFJLEVBQUpBLEtBQUk7QUFDSjJGLElBQUFBLFFBQVEsRUFBUkEsU0FBUTtBQUNSTyxJQUFBQSxPQUFPLEVBQUUsS0FBSztBQUNkTixJQUFBQSxPQUFPLEVBQVBBLFFBQU87QUFDUHhHLElBQUFBLFNBQVMsRUFBVEE7R0FDSDtBQUVELEVBQUEsSUFBSSxDQUFDaUIsRUFBRSxHQUFHLElBQUksQ0FBQzJILFVBQVUsRUFBRTtBQUMvQixDQUFDLENBQUE7O0FDeEI4RCxJQUU5Q0MsSUFBSSxnQkFBQWhELFlBQUEsQ0FDckIsU0FBQWdELE9BQTJCO0FBQUEsRUFBQSxJQUFBL0MsS0FBQSxHQUFBLElBQUE7QUFBQSxFQUFBLElBQWZDLFFBQVEsR0FBQUMsU0FBQSxDQUFBeEYsTUFBQSxHQUFBLENBQUEsSUFBQXdGLFNBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQUMsU0FBQSxHQUFBRCxTQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUcsRUFBRTtBQUFBRSxFQUFBQSxlQUFBLE9BQUEyQyxJQUFBLENBQUE7QUFBQTFDLEVBQUFBLGVBQUEscUJBY1osWUFBTTtBQUNmLElBQUEsSUFBQUMsV0FBQSxHQUF1Qk4sS0FBSSxDQUFDTyxLQUFLO01BQXpCZCxJQUFJLEdBQUFhLFdBQUEsQ0FBSmIsSUFBSTtNQUFFdUQsSUFBSSxHQUFBMUMsV0FBQSxDQUFKMEMsSUFBSTtJQUVsQixPQUNZLElBQUEsQ0FBQSxPQUFPLElBQWY3SCxFQUFBLENBQUEsR0FBQSxFQUFBO0FBQWdCNkgsTUFBQUEsSUFBSSxFQUFFQTtBQUFLLEtBQUEsRUFBRXZELElBQVEsQ0FBQztHQUU3QyxDQUFBO0VBQUFZLGVBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxFQUVRLFVBQUNhLElBQUksRUFBSztBQUNmLElBQUEsSUFBQUMsVUFBQSxHQUdJRCxJQUFJLENBRkp6QixJQUFJO01BQUpBLElBQUksR0FBQTBCLFVBQUEsS0FBR25CLE1BQUFBLEdBQUFBLEtBQUksQ0FBQ08sS0FBSyxDQUFDZCxJQUFJLEdBQUEwQixVQUFBO01BQUE4QixVQUFBLEdBRXRCL0IsSUFBSSxDQURKOEIsSUFBSTtNQUFKQSxJQUFJLEdBQUFDLFVBQUEsS0FBR2pELE1BQUFBLEdBQUFBLEtBQUksQ0FBQ08sS0FBSyxDQUFDeUMsSUFBSSxHQUFBQyxVQUFBO0FBRzFCLElBQUEsSUFBSXhELElBQUksS0FBS08sS0FBSSxDQUFDTyxLQUFLLENBQUNkLElBQUksRUFBRTtBQUMxQk8sTUFBQUEsS0FBSSxDQUFDa0QsS0FBSyxDQUFDQyxXQUFXLEdBQUcxRCxJQUFJO0FBQ2pDO0FBQ0EsSUFBQSxJQUFJdUQsSUFBSSxLQUFLaEQsS0FBSSxDQUFDTyxLQUFLLENBQUN5QyxJQUFJLEVBQUU7QUFDMUJoRCxNQUFBQSxLQUFJLENBQUNrRCxLQUFLLENBQUNGLElBQUksR0FBR0EsSUFBSTtBQUMxQjtJQUVBaEQsS0FBSSxDQUFDTyxLQUFLLEdBQUE0QixjQUFBLENBQUFBLGNBQUEsQ0FBQSxFQUFBLEVBQVFuQyxLQUFJLENBQUNPLEtBQUssQ0FBQSxFQUFBLEVBQUEsRUFBQTtBQUFFZCxNQUFBQSxJQUFJLEVBQUpBLElBQUk7QUFBRXVELE1BQUFBLElBQUksRUFBSkE7S0FBTSxDQUFBO0dBQzdDLENBQUE7QUFuQ0csRUFBQSxJQUFBWixjQUFBLEdBR0luQyxRQUFRLENBRlJSLElBQUk7QUFBSkEsSUFBQUEsS0FBSSxHQUFBMkMsY0FBQSxLQUFHLE1BQUEsR0FBQSxFQUFFLEdBQUFBLGNBQUE7SUFBQWdCLGNBQUEsR0FFVG5ELFFBQVEsQ0FEUitDLElBQUk7QUFBSkEsSUFBQUEsS0FBSSxHQUFBSSxjQUFBLEtBQUcsTUFBQSxHQUFBLEVBQUUsR0FBQUEsY0FBQTtFQUdiLElBQUksQ0FBQzdDLEtBQUssR0FBRztBQUNUZCxJQUFBQSxJQUFJLEVBQUpBLEtBQUk7QUFDSnVELElBQUFBLElBQUksRUFBSkE7R0FDSDtBQUVELEVBQUEsSUFBSSxDQUFDN0gsRUFBRSxHQUFHLElBQUksQ0FBQzJILFVBQVUsRUFBRTtBQUMvQixDQUFDLENBQUE7O0FDZjhELElBRTlDTyxLQUFLLGdCQUFBdEQsWUFBQSxDQUN0QixTQUFBc0QsUUFBMkI7QUFBQSxFQUFBLElBQUFyRCxLQUFBLEdBQUEsSUFBQTtBQUFBLEVBQUEsSUFBZkMsUUFBUSxHQUFBQyxTQUFBLENBQUF4RixNQUFBLEdBQUEsQ0FBQSxJQUFBd0YsU0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBQyxTQUFBLEdBQUFELFNBQUEsQ0FBQSxDQUFBLENBQUEsR0FBRyxFQUFFO0FBQUFFLEVBQUFBLGVBQUEsT0FBQWlELEtBQUEsQ0FBQTtBQUFBaEQsRUFBQUEsZUFBQSxxQkFrQlosWUFBTTtBQUNmLElBQUEsSUFBQUMsV0FBQSxHQUEwQ04sS0FBSSxDQUFDTyxLQUFLO01BQTVDVSxLQUFLLEdBQUFYLFdBQUEsQ0FBTFcsS0FBSztNQUFFcUMsV0FBVyxHQUFBaEQsV0FBQSxDQUFYZ0QsV0FBVztNQUFFeEksSUFBSSxHQUFBd0YsV0FBQSxDQUFKeEYsSUFBSTtNQUFFc0IsR0FBRyxHQUFBa0UsV0FBQSxDQUFIbEUsR0FBRztBQUVyQyxJQUFBLElBQU1tSCxPQUFPLEdBQUEsYUFBQSxDQUFBNUMsTUFBQSxDQUFpQnZFLEdBQUcsQ0FBRTtBQUNuQyxJQUFBLE9BQ0lqQixFQUFBLENBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLENBQ2dCLFdBQVcsQ0FBQSxHQUF2QkEsRUFBQSxDQUFBLE9BQUEsRUFBQTtBQUF3QixNQUFBLEtBQUEsRUFBS29JLE9BQVE7QUFBQ3JKLE1BQUFBLFNBQVMsRUFBQztBQUFZLEtBQUEsRUFBRStHLEtBQWEsQ0FBQyxFQUNoRSxJQUFBLENBQUEsV0FBVyxJQUF2QjlGLEVBQUEsQ0FBQSxPQUFBLEVBQUE7QUFBd0JMLE1BQUFBLElBQUksRUFBRUEsSUFBSztBQUFDYixNQUFBQSxFQUFFLEVBQUVzSixPQUFRO0FBQUNySixNQUFBQSxTQUFTLEVBQUMsY0FBYztBQUFDb0osTUFBQUEsV0FBVyxFQUFFQTtBQUFZLEtBQUUsQ0FDcEcsQ0FBQztHQUViLENBQUE7RUFBQWpELGVBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxFQUVRLFVBQUNhLElBQUksRUFBSztBQUNmLElBQUEsSUFBQXNDLFdBQUEsR0FJSXRDLElBQUksQ0FISkQsS0FBSztNQUFMQSxLQUFLLEdBQUF1QyxXQUFBLEtBQUd4RCxNQUFBQSxHQUFBQSxLQUFJLENBQUNPLEtBQUssQ0FBQ1UsS0FBSyxHQUFBdUMsV0FBQTtNQUFBQyxpQkFBQSxHQUd4QnZDLElBQUksQ0FGSm9DLFdBQVc7TUFBWEEsV0FBVyxHQUFBRyxpQkFBQSxLQUFHekQsTUFBQUEsR0FBQUEsS0FBSSxDQUFDTyxLQUFLLENBQUMrQyxXQUFXLEdBQUFHLGlCQUFBO01BQUFwQyxVQUFBLEdBRXBDSCxJQUFJLENBREpwRyxJQUFJO01BQUpBLElBQUksR0FBQXVHLFVBQUEsS0FBR3JCLE1BQUFBLEdBQUFBLEtBQUksQ0FBQ08sS0FBSyxDQUFDekYsSUFBSSxHQUFBdUcsVUFBQTtBQUcxQixJQUFBLElBQUlKLEtBQUssS0FBS2pCLEtBQUksQ0FBQ08sS0FBSyxDQUFDVSxLQUFLLEVBQUU7QUFDNUJqQixNQUFBQSxLQUFJLENBQUMwRCxTQUFTLENBQUNQLFdBQVcsR0FBR2xDLEtBQUs7QUFDdEM7QUFDQSxJQUFBLElBQUlxQyxXQUFXLEtBQUt0RCxLQUFJLENBQUNPLEtBQUssQ0FBQytDLFdBQVcsRUFBRTtBQUN4Q3RELE1BQUFBLEtBQUksQ0FBQzJELFNBQVMsQ0FBQ0wsV0FBVyxHQUFHQSxXQUFXO0FBQzVDO0FBQ0EsSUFBQSxJQUFJeEksSUFBSSxLQUFLa0YsS0FBSSxDQUFDTyxLQUFLLENBQUN6RixJQUFJLEVBQUU7QUFDMUJrRixNQUFBQSxLQUFJLENBQUMyRCxTQUFTLENBQUM3SSxJQUFJLEdBQUdBLElBQUk7QUFDOUI7SUFFQWtGLEtBQUksQ0FBQ08sS0FBSyxHQUFBNEIsY0FBQSxDQUFBQSxjQUFBLENBQUEsRUFBQSxFQUFRbkMsS0FBSSxDQUFDNEQsSUFBSSxDQUFBLEVBQUEsRUFBQSxFQUFBO0FBQUUzQyxNQUFBQSxLQUFLLEVBQUxBLEtBQUs7QUFBRXFDLE1BQUFBLFdBQVcsRUFBWEEsV0FBVztBQUFFeEksTUFBQUEsSUFBSSxFQUFKQTtLQUFNLENBQUE7R0FDMUQsQ0FBQTtBQUFBdUYsRUFBQUEsZUFBQSxDQUVXLElBQUEsRUFBQSxXQUFBLEVBQUEsWUFBQTtBQUFBLElBQUEsT0FBTUwsS0FBSSxDQUFDMkQsU0FBUyxDQUFDdkYsS0FBSztBQUFBLEdBQUEsQ0FBQTtBQWpEbEMsRUFBQSxJQUFBeUYsZUFBQSxHQUtJNUQsUUFBUSxDQUpSZ0IsS0FBSztBQUFMQSxJQUFBQSxNQUFLLEdBQUE0QyxlQUFBLEtBQUcsTUFBQSxHQUFBLEVBQUUsR0FBQUEsZUFBQTtJQUFBQyxxQkFBQSxHQUlWN0QsUUFBUSxDQUhScUQsV0FBVztBQUFYQSxJQUFBQSxZQUFXLEdBQUFRLHFCQUFBLEtBQUcsTUFBQSxHQUFBLEVBQUUsR0FBQUEscUJBQUE7SUFBQXhCLGNBQUEsR0FHaEJyQyxRQUFRLENBRlJuRixJQUFJO0FBQUpBLElBQUFBLEtBQUksR0FBQXdILGNBQUEsS0FBRyxNQUFBLEdBQUEsTUFBTSxHQUFBQSxjQUFBO0lBQUF5QixhQUFBLEdBRWI5RCxRQUFRLENBRFI3RCxHQUFHO0FBQUhBLElBQUFBLElBQUcsR0FBQTJILGFBQUEsS0FBRyxNQUFBLEdBQUEsV0FBVyxHQUFBQSxhQUFBO0VBR3JCLElBQUksQ0FBQ3hELEtBQUssR0FBRztBQUNUVSxJQUFBQSxLQUFLLEVBQUxBLE1BQUs7QUFDTHFDLElBQUFBLFdBQVcsRUFBWEEsWUFBVztBQUNYeEksSUFBQUEsSUFBSSxFQUFKQSxLQUFJO0FBQ0pzQixJQUFBQSxHQUFHLEVBQUhBO0dBQ0g7QUFFRCxFQUFBLElBQUksQ0FBQ2pCLEVBQUUsR0FBRyxJQUFJLENBQUMySCxVQUFVLEVBQUU7QUFDL0IsQ0FBQyxDQUFBOztBQ25CTCxTQUFlO0FBQ1gsRUFBQSxjQUFjLEVBQUUsZ0JBQWdCO0FBQ2hDLEVBQUEsT0FBTyxFQUFFLE1BQU07QUFDZixFQUFBLFNBQVMsRUFBRSxVQUFVO0FBQ3JCLEVBQUEsd0JBQXdCLEVBQUUsU0FBMUJrQixzQkFBd0JBLENBQUVDLENBQUMsRUFBSTtJQUMzQixJQUFJQyxhQUFhLEdBQUcsRUFBRTtJQUN0QixJQUFJQyxXQUFXLEdBQUcsS0FBSztJQUN2QixJQUFNQyxlQUFlLEdBQUdILENBQUMsR0FBRyxFQUFFLElBQUlBLENBQUMsR0FBRyxFQUFFO0lBQ3hDLElBQUlBLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUNHLGVBQWUsRUFBRTtBQUNsQ0YsTUFBQUEsYUFBYSxHQUFHLEdBQUc7QUFDbkJDLE1BQUFBLFdBQVcsR0FBRyxLQUFLO0FBQ3ZCLEtBQUMsTUFDSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQ0UsUUFBUSxDQUFDSixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQ0csZUFBZSxFQUFFO0FBQ3JERixNQUFBQSxhQUFhLEdBQUcsR0FBRztBQUN2QjtJQUVBLE9BQUF2RCxxRkFBQUEsQ0FBQUEsTUFBQSxDQUE0QndELFdBQVcsRUFBQXhELEdBQUFBLENBQUFBLENBQUFBLE1BQUEsQ0FBSXNELENBQUMsRUFBQSx1Q0FBQSxDQUFBLENBQUF0RCxNQUFBLENBQVV1RCxhQUFhLEVBQUEsR0FBQSxDQUFBO0dBQ3RFO0FBQ0QsRUFBQSxPQUFPLEVBQUUsUUFBUTtBQUNqQixFQUFBLGdCQUFnQixFQUFFLG9CQUFvQjtBQUN0QyxFQUFBLFVBQVUsRUFBRSxRQUFRO0FBQ3BCLEVBQUEsVUFBVSxFQUFFLE9BQU87QUFDbkIsRUFBQSxhQUFhLEVBQUUsb0JBQW9CO0FBQ25DLEVBQUEscUJBQXFCLEVBQUUsZUFBZTtBQUN0QyxFQUFBLFlBQVksRUFBRSxPQUFPO0FBQ3JCLEVBQUEsY0FBYyxFQUFFLGFBQWE7QUFDN0IsRUFBQSxpQkFBaUIsRUFBRSxrQkFBa0I7QUFDckMsRUFBQSwrQkFBK0IsRUFBRSxtQkFBbUI7QUFDcEQsRUFBQSxTQUFTLEVBQUUsZ0JBQWdCO0FBQzNCLEVBQUEsV0FBVyxFQUFFLGlCQUFpQjtBQUM5QixFQUFBLFNBQVMsRUFBRSxZQUFZO0FBQ3ZCLEVBQUEsVUFBVSxFQUFFLFNBQVM7QUFDckIsRUFBQSxnQkFBZ0IsRUFBRSxlQUFlO0FBQ2pDLEVBQUEsUUFBUSxFQUFFLFFBQVE7QUFDbEIsRUFBQSxTQUFTLEVBQUUsV0FBVztBQUN0QixFQUFBLElBQUksRUFBRSxTQUFTO0FBQ2YsRUFBQSxJQUFJLEVBQUU7QUFDVixDQUFDOztBQ3JDRCxTQUFlO0FBQ1gsRUFBQSxjQUFjLEVBQUUsY0FBYztBQUM5QixFQUFBLE9BQU8sRUFBRSxPQUFPO0FBQ2hCLEVBQUEsU0FBUyxFQUFFLFNBQVM7QUFDcEIsRUFBQSx3QkFBd0IsRUFBRSxTQUExQkYsc0JBQXdCQSxDQUFFQyxDQUFDLEVBQUE7QUFBQSxJQUFBLE9BQUEsY0FBQSxDQUFBdEQsTUFBQSxDQUFtQnNELENBQUMsRUFBQSxTQUFBLENBQUEsQ0FBQXRELE1BQUEsQ0FBVXNELENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUEsUUFBQSxDQUFBO0dBQVE7QUFDeEYsRUFBQSxPQUFPLEVBQUUsUUFBUTtBQUNqQixFQUFBLGdCQUFnQixFQUFFLG9CQUFvQjtBQUN0QyxFQUFBLFVBQVUsRUFBRSxVQUFVO0FBQ3RCLEVBQUEsVUFBVSxFQUFFLFFBQVE7QUFDcEIsRUFBQSxhQUFhLEVBQUUsVUFBVTtBQUN6QixFQUFBLHFCQUFxQixFQUFFLGFBQWE7QUFDcEMsRUFBQSxZQUFZLEVBQUUsU0FBUztBQUN2QixFQUFBLGNBQWMsRUFBRSxjQUFjO0FBQzlCLEVBQUEsaUJBQWlCLEVBQUUsaUJBQWlCO0FBQ3BDLEVBQUEsK0JBQStCLEVBQUUsc0JBQXNCO0FBQ3ZELEVBQUEsU0FBUyxFQUFFLFNBQVM7QUFDcEIsRUFBQSxXQUFXLEVBQUUsV0FBVztBQUN4QixFQUFBLFNBQVMsRUFBRSxTQUFTO0FBQ3BCLEVBQUEsVUFBVSxFQUFFLFVBQVU7QUFDdEIsRUFBQSxnQkFBZ0IsRUFBRSxnQkFBZ0I7QUFDbEMsRUFBQSxRQUFRLEVBQUUsUUFBUTtBQUNsQixFQUFBLFNBQVMsRUFBRSxNQUFNO0FBQ2pCLEVBQUEsSUFBSSxFQUFFLFNBQVM7QUFDZixFQUFBLElBQUksRUFBRTtBQUNWLENBQUM7O0FDckJELFNBQVNLLE1BQU1BLENBQUNDLE1BQU0sRUFBRXZLLEdBQUcsRUFBRTtBQUN6QixFQUFBLElBQUl3SyxNQUFNLEdBQUduSyxRQUFRLENBQUNSLGFBQWEsQ0FBQ0csR0FBRyxDQUFDO0FBQ3hDLEVBQUEsSUFBSSxPQUFPdUssTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM1QkMsTUFBTSxDQUFDdEMsU0FBUyxHQUFHcUMsTUFBTTtBQUM3QixHQUFDLE1BQU07QUFDSEMsSUFBQUEsTUFBTSxDQUFDeEgsV0FBVyxDQUFDdUgsTUFBTSxDQUFDO0FBQzlCO0FBQ0EsRUFBQSxPQUFPQyxNQUFNO0FBQ2pCO0FBRUEsU0FBU0MsT0FBT0EsQ0FBQ0YsTUFBTSxFQUFFRyxJQUFJLEVBQUU7RUFDM0IsSUFBSUYsTUFBTSxHQUFHRCxNQUFNO0FBQ25CRyxFQUFBQSxJQUFJLENBQUNDLE9BQU8sQ0FBQyxVQUFBM0ssR0FBRyxFQUFBO0FBQUEsSUFBQSxPQUFJd0ssTUFBTSxHQUFHRixNQUFNLENBQUNFLE1BQU0sRUFBRXhLLEdBQUcsQ0FBQztHQUFDLENBQUE7QUFDakQsRUFBQSxPQUFPd0ssTUFBTTtBQUNqQjtBQUVBLFVBQUEsQ0FBZSxVQUFDSSxNQUFNLEVBQUVDLElBQUksRUFBRTdLLEdBQUcsRUFBYztFQUMzQyxJQUFJNkssSUFBSSxJQUFJLElBQUksSUFBSUEsSUFBSSxDQUFDbkssTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUU7RUFFaEQsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDMkosUUFBUSxDQUFDTyxNQUFNLENBQUMsRUFBRTtBQUNoQ0EsSUFBQUEsTUFBTSxHQUFHLElBQUk7QUFDakI7RUFFQSxJQUFJSixNQUFNLEdBQUdLLElBQUk7RUFFakIsSUFBSUQsTUFBTSxLQUFLLElBQUksSUFBSUUsRUFBRSxDQUFDRCxJQUFJLENBQUMsRUFBRTtBQUM3QkwsSUFBQUEsTUFBTSxHQUFHTSxFQUFFLENBQUNELElBQUksQ0FBQztBQUNyQjtFQUNBLElBQUlELE1BQU0sS0FBSyxJQUFJLElBQUlHLEVBQUUsQ0FBQ0YsSUFBSSxDQUFDLEVBQUU7QUFDN0JMLElBQUFBLE1BQU0sR0FBR08sRUFBRSxDQUFDRixJQUFJLENBQUM7QUFDckI7QUFFQSxFQUFBLElBQUksT0FBT0wsTUFBTSxLQUFLLFVBQVUsRUFBRTtJQUFBLEtBQUFRLElBQUFBLElBQUEsR0FBQTlFLFNBQUEsQ0FBQXhGLE1BQUEsRUFoQkFHLElBQUksT0FBQW9LLEtBQUEsQ0FBQUQsSUFBQSxHQUFBQSxDQUFBQSxHQUFBQSxJQUFBLFdBQUFFLElBQUEsR0FBQSxDQUFBLEVBQUFBLElBQUEsR0FBQUYsSUFBQSxFQUFBRSxJQUFBLEVBQUEsRUFBQTtBQUFKckssTUFBQUEsSUFBSSxDQUFBcUssSUFBQSxHQUFBaEYsQ0FBQUEsQ0FBQUEsR0FBQUEsU0FBQSxDQUFBZ0YsSUFBQSxDQUFBO0FBQUE7QUFpQmxDVixJQUFBQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQVcsS0FBQSxDQUFBLE1BQUEsRUFBSXRLLElBQUksQ0FBQztBQUM1QjtBQUVBLEVBQUEsSUFBSWIsR0FBRyxFQUFFO0lBQ0wsSUFBSUEsR0FBRyxZQUFZaUwsS0FBSyxFQUFFO0FBQ3RCVCxNQUFBQSxNQUFNLEdBQUdDLE9BQU8sQ0FBQ0QsTUFBTSxFQUFFeEssR0FBRyxDQUFDO0FBQ2pDLEtBQUMsTUFBTTtBQUNId0ssTUFBQUEsTUFBTSxHQUFHRixNQUFNLENBQUNFLE1BQU0sRUFBRXhLLEdBQUcsQ0FBQztBQUNoQztBQUNKO0FBRUEsRUFBQSxPQUFPd0ssTUFBTTtBQUNqQixDQUFDOztBQ2hERCx3QkFBZVksTUFBTSxDQUFDQyxNQUFNLENBQUM7QUFDekJDLEVBQUFBLE1BQU0sRUFBRSxRQUFRO0FBQ2hCQyxFQUFBQSxLQUFLLEVBQUU7QUFDWCxDQUFDLENBQUM7OztBQ0RLLElBQU1DLGFBQVcsR0FBQSxDQUFBQyxxQkFBQSxHQUFHQyxZQUFZLENBQUNDLE9BQU8sQ0FBQ0MsaUJBQWlCLENBQUNOLE1BQU0sQ0FBQyxNQUFBLElBQUEsSUFBQUcscUJBQUEsS0FBQUEsTUFBQUEsR0FBQUEscUJBQUEsR0FBSSxJQUFJOztBQ0NoQyxJQUU1QkksZ0JBQWdCLGdCQUFBOUYsWUFBQSxDQUNqQyxTQUFBOEYsbUJBQWM7QUFBQSxFQUFBLElBQUE3RixLQUFBLEdBQUEsSUFBQTtBQUFBSSxFQUFBQSxlQUFBLE9BQUF5RixnQkFBQSxDQUFBO0FBQUF4RixFQUFBQSxlQUFBLHFCQUlELFlBQU07SUFDZixPQUNJbEYsRUFBQSxjQUNJQSxFQUFBLENBQUEsS0FBQSxFQUFBO0FBQUtqQixNQUFBQSxTQUFTLEVBQUM7S0FDQyxFQUFBLElBQUEsQ0FBQSxpQkFBaUIsUUFBQW1KLEtBQUEsQ0FBQTtBQUFDcEMsTUFBQUEsS0FBSyxFQUFFNkUsR0FBRyxDQUFDTixhQUFXLEVBQUUsT0FBTyxDQUFFO0FBQzdEbEMsTUFBQUEsV0FBVyxFQUFFd0MsR0FBRyxDQUFDTixhQUFXLEVBQUUsZ0JBQWdCLENBQUU7QUFBQ3BKLE1BQUFBLEdBQUcsRUFBQztBQUFRLEtBQUEsQ0FDOUQsQ0FBQyxFQUFBLElBQUEsQ0FDTSxlQUFlLENBQUEsR0FBQSxJQUFBaUgsS0FBQSxDQUFBO0FBQUNwQyxNQUFBQSxLQUFLLEVBQUU2RSxHQUFHLENBQUNOLGFBQVcsRUFBRSxVQUFVLENBQUU7QUFBQ2xDLE1BQUFBLFdBQVcsRUFBQyxVQUFVO0FBQUN4SSxNQUFBQSxJQUFJLEVBQUMsVUFBVTtBQUFDc0IsTUFBQUEsR0FBRyxFQUFDO0FBQUssS0FBQSxDQUNoSCxDQUFDO0dBRWIsQ0FBQTtFQUFBaUUsZUFBQSxDQUFBLElBQUEsRUFBQSxRQUFBLEVBRVEsVUFBQ2EsSUFBSSxFQUFLO0FBQ2YsSUFBQSxJQUFRNkUsSUFBSSxHQUFLN0UsSUFBSSxDQUFiNkUsSUFBSTtBQUVaL0YsSUFBQUEsS0FBSSxDQUFDZ0csZUFBZSxDQUFDakYsTUFBTSxDQUFDO0FBQ3hCRSxNQUFBQSxLQUFLLEVBQUU2RSxHQUFHLENBQUNDLElBQUksRUFBRSxPQUFPLENBQUM7QUFDekJ6QyxNQUFBQSxXQUFXLEVBQUV3QyxHQUFHLENBQUNDLElBQUksRUFBRSxnQkFBZ0I7QUFDM0MsS0FBQyxDQUFDO0FBQ0YvRixJQUFBQSxLQUFJLENBQUNpRyxhQUFhLENBQUNsRixNQUFNLENBQUM7QUFDdEJFLE1BQUFBLEtBQUssRUFBRTZFLEdBQUcsQ0FBQ0MsSUFBSSxFQUFFLFVBQVU7QUFDL0IsS0FBQyxDQUFDO0dBQ0wsQ0FBQTtBQUFBMUYsRUFBQUEsZUFBQSxDQUVXLElBQUEsRUFBQSxXQUFBLEVBQUEsWUFBQTtBQUFBLElBQUEsT0FBTUwsS0FBSSxDQUFDZ0csZUFBZSxDQUFDRSxTQUFTLEVBQUU7QUFBQSxHQUFBLENBQUE7QUFBQTdGLEVBQUFBLGVBQUEsQ0FFbkMsSUFBQSxFQUFBLGNBQUEsRUFBQSxZQUFBO0FBQUEsSUFBQSxPQUFNTCxLQUFJLENBQUNpRyxhQUFhLENBQUNDLFNBQVMsRUFBRTtBQUFBLEdBQUEsQ0FBQTtBQTdCL0MsRUFBQSxJQUFJLENBQUMvSyxFQUFFLEdBQUcsSUFBSSxDQUFDMkgsVUFBVSxFQUFFO0FBQy9CLENBQUMsQ0FBQTs7QUNSTCxxQkFBZXNDLE1BQU0sQ0FBQ0MsTUFBTSxDQUFDO0FBQ3pCYyxFQUFBQSxFQUFFLEVBQUUsSUFBSTtBQUNSQyxFQUFBQSxNQUFNLEVBQUUsUUFBUTtBQUNoQkMsRUFBQUEsS0FBSyxFQUFFO0FBQ1gsQ0FBQyxDQUFDOztBQ0pGLGNBQWVqQixNQUFNLENBQUNDLE1BQU0sQ0FBQztBQUN6QmlCLEVBQUFBLFFBQVEsRUFBRTtBQUNkLENBQUMsQ0FBQzs7QUNBSyxTQUFTQyxLQUFLQSxDQUFDQyxJQUFJLEVBQUU7QUFDeEIsRUFBQSxJQUFRRCxLQUFLLEdBQWVDLElBQUksQ0FBeEJELEtBQUs7SUFBRUUsUUFBUSxHQUFLRCxJQUFJLENBQWpCQyxRQUFRO0FBRXZCLEVBQUEsSUFBSUYsS0FBSyxDQUFDNUwsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQ3JCLE9BQU87TUFDSCtMLE1BQU0sRUFBRUMsY0FBYyxDQUFDUCxNQUFNO0FBQzdCUSxNQUFBQSxNQUFNLEVBQUU7UUFDSlAsS0FBSyxFQUFFQSxLQUFLLENBQUNRO0FBQ2pCO0tBQ0g7QUFDTDtBQUNBLEVBQUEsSUFBSUosUUFBUSxDQUFDOUwsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQ3hCLE9BQU87TUFDSCtMLE1BQU0sRUFBRUMsY0FBYyxDQUFDUCxNQUFNO0FBQzdCUSxNQUFBQSxNQUFNLEVBQUU7UUFDSlAsS0FBSyxFQUFFQSxLQUFLLENBQUNTO0FBQ2pCO0tBQ0g7QUFDTDtBQUNBLEVBQUEsSUFBSVAsS0FBSyxLQUFLLE9BQU8sSUFBSUUsUUFBUSxLQUFLLE9BQU8sRUFBRTtJQUMzQyxPQUFPO01BQ0hDLE1BQU0sRUFBRUMsY0FBYyxDQUFDUCxNQUFNO0FBQzdCUSxNQUFBQSxNQUFNLEVBQUU7UUFDSlAsS0FBSyxFQUFFQSxLQUFLLENBQUNVO0FBQ2pCO0tBQ0g7QUFDTDtFQUVBLE9BQU87SUFDSEwsTUFBTSxFQUFFQyxjQUFjLENBQUNSLEVBQUU7QUFDekJTLElBQUFBLE1BQU0sRUFBRTtBQUNKckIsTUFBQUEsS0FBSyxFQUFFO0FBQ1g7R0FDSDtBQUNMO0FBRU8sSUFBTWMsS0FBSyxHQUFHakIsTUFBTSxDQUFDQyxNQUFNLENBQUM7QUFDL0IwQixFQUFBQSxlQUFlLEVBQUUsb0JBQW9CO0FBQ3JDRixFQUFBQSxVQUFVLEVBQUUsYUFBYTtBQUN6QkMsRUFBQUEsUUFBUSxFQUFFO0FBQ2QsQ0FBQyxDQUFDOztBQ3RDRixJQUFNRSxnQkFBZ0IsR0FBRyxJQUFJO0FBRTdCLFNBQVNDLFlBQVlBLENBQUNDLEVBQUUsRUFBRTtBQUN0QixFQUFBLE9BQU8sSUFBSUMsT0FBTyxDQUFDLFVBQUFDLE9BQU8sRUFBQTtBQUFBLElBQUEsT0FBSUMsVUFBVSxDQUFDRCxPQUFPLEVBQUVGLEVBQUUsQ0FBQztHQUFDLENBQUE7QUFDMUQ7QUFFQSxTQUE4QkksVUFBVUEsQ0FBQUMsRUFBQSxFQUFBQyxHQUFBLEVBQUFDLEdBQUEsRUFBQTtBQUFBLEVBQUEsT0FBQUMsV0FBQSxDQUFBdkMsS0FBQSxDQUFBLElBQUEsRUFBQWpGLFNBQUEsQ0FBQTtBQUFBO0FBaUJ2QyxTQUFBd0gsV0FBQSxHQUFBO0FBQUFBLEVBQUFBLFdBQUEsR0FBQUMsaUJBQUEsY0FBQUMsbUJBQUEsRUFBQUMsQ0FBQUEsSUFBQSxDQWpCYyxTQUFBQyxPQUEwQkMsQ0FBQUEsR0FBRyxFQUFFdkIsSUFBSSxFQUFFd0IsZUFBZSxFQUFBO0FBQUEsSUFBQSxPQUFBSixtQkFBQSxFQUFBLENBQUFLLElBQUEsQ0FBQSxTQUFBQyxTQUFBQyxRQUFBLEVBQUE7QUFBQSxNQUFBLE9BQUEsQ0FBQSxFQUFBLFFBQUFBLFFBQUEsQ0FBQUMsSUFBQSxHQUFBRCxRQUFBLENBQUE3SyxJQUFBO0FBQUEsUUFBQSxLQUFBLENBQUE7QUFBQTZLLFVBQUFBLFFBQUEsQ0FBQTdLLElBQUEsR0FBQSxDQUFBO1VBQUEsT0FDekQySixZQUFZLENBQUNELGdCQUFnQixDQUFDO0FBQUEsUUFBQSxLQUFBLENBQUE7QUFBQSxVQUFBLElBQUEsQ0FDaENnQixlQUFlLEVBQUE7QUFBQUcsWUFBQUEsUUFBQSxDQUFBN0ssSUFBQSxHQUFBLENBQUE7QUFBQSxZQUFBO0FBQUE7QUFBQSxVQUFBLE9BQUE2SyxRQUFBLENBQUFFLE1BQUEsQ0FBQSxRQUFBLEVBQ1JMLGVBQWUsQ0FBQTtBQUFBLFFBQUEsS0FBQSxDQUFBO1VBQUFHLFFBQUEsQ0FBQUcsRUFBQSxHQUduQlAsR0FBRztBQUFBSSxVQUFBQSxRQUFBLENBQUE3SyxJQUFBLEdBQUE2SyxRQUFBLENBQUFHLEVBQUEsS0FDRCxlQUFlLEdBQUEsQ0FBQSxHQUFBLENBQUE7QUFBQSxVQUFBO0FBQUEsUUFBQSxLQUFBLENBQUE7QUFBQSxVQUFBLE9BQUFILFFBQUEsQ0FBQUUsTUFBQSxXQUNUOUIsS0FBSyxDQUFDQyxJQUFJLENBQUMsQ0FBQTtBQUFBLFFBQUEsS0FBQSxDQUFBO1VBQUEsT0FBQTJCLFFBQUEsQ0FBQUUsTUFBQSxDQUVYLFFBQUEsRUFBQTtZQUNIM0IsTUFBTSxFQUFFQyxjQUFjLENBQUNQLE1BQU07QUFDN0JRLFlBQUFBLE1BQU0sRUFBRTtjQUNKUCxLQUFLLEVBQUVBLE9BQUssQ0FBQ0M7QUFDakI7V0FDSCxDQUFBO0FBQUEsUUFBQSxLQUFBLENBQUE7QUFBQSxRQUFBLEtBQUEsS0FBQTtVQUFBLE9BQUE2QixRQUFBLENBQUFJLElBQUEsRUFBQTtBQUFBO0FBQUEsS0FBQSxFQUFBVCxPQUFBLENBQUE7R0FFWixDQUFBLENBQUE7QUFBQSxFQUFBLE9BQUFKLFdBQUEsQ0FBQXZDLEtBQUEsQ0FBQSxJQUFBLEVBQUFqRixTQUFBLENBQUE7QUFBQTs7QUNuQjBELElBRXRDc0ksU0FBUyxnQkFBQXpJLFlBQUEsQ0FDMUIsU0FBQXlJLFlBQWM7QUFBQSxFQUFBLElBQUF4SSxLQUFBLEdBQUEsSUFBQTtBQUFBSSxFQUFBQSxlQUFBLE9BQUFvSSxTQUFBLENBQUE7QUFBQW5JLEVBQUFBLGVBQUEscUJBSUQsWUFBTTtJQUNmLE9BQ0lsRixFQUFBLGNBQ0lBLEVBQUEsQ0FBQSxLQUFBLEVBQUE7QUFBS2pCLE1BQUFBLFNBQVMsRUFBQztLQUNZLEVBQUEsSUFBQSxDQUFBLHlCQUF5QixRQUFBMkwsZ0JBQUEsQ0FBQSxFQUFBLENBQUEsRUFDaEQxSyxFQUFBLENBQ0lBLEdBQUFBLEVBQUFBLElBQUFBLEVBQUFBLEVBQUEsQ0FDZSxPQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsQ0FBQSxVQUFVLENBQXJCQSxHQUFBQSxFQUFBLGVBQXVCMkssR0FBRyxDQUFDTixhQUFXLEVBQUUscUJBQXFCLENBQVEsQ0FBQyxFQUFBLE1BQUEsRUFBQSxJQUFBLENBQzNELFVBQVUsQ0FBQSxHQUFBLElBQUF6QyxJQUFBLENBQUE7QUFBQ3RELE1BQUFBLElBQUksRUFBRXFHLEdBQUcsQ0FBQ04sYUFBVyxFQUFFLGFBQWEsQ0FBRTtBQUFDeEMsTUFBQUEsSUFBSSxFQUFDO0FBQWlCLEtBQUEsQ0FDaEYsQ0FDUixDQUNGLENBQUMsRUFDTjdILEVBQUEsQ0FBQSxLQUFBLEVBQUE7QUFBS2pCLE1BQUFBLFNBQVMsRUFBQztLQUNFLEVBQUEsSUFBQSxDQUFBLFlBQVksUUFBQTRGLE1BQUEsQ0FBQTtBQUFDTCxNQUFBQSxJQUFJLEVBQUVxRyxHQUFHLENBQUNOLGFBQVcsRUFBRSxVQUFVLENBQUU7QUFDekQ5RSxNQUFBQSxPQUFPLEVBQUVWLEtBQUksQ0FBQ3lJLGlCQUFpQixDQUFDakQsYUFBVyxDQUFFO0FBQUN0TCxNQUFBQSxTQUFTLEVBQUMsT0FBTztBQUFDWSxNQUFBQSxJQUFJLEVBQUM7QUFBUyxLQUFBLENBQ2pGLENBQ0osQ0FBQztHQUViLENBQUE7RUFBQXVGLGVBQUEsQ0FBQSxJQUFBLEVBQUEsbUJBQUEsRUFFbUIsVUFBQzBGLElBQUksRUFBSztBQUMxQixJQUFBLG9CQUFBNEIsaUJBQUEsY0FBQUMsbUJBQUEsR0FBQUMsSUFBQSxDQUFPLFNBQUFDLE9BQUEsR0FBQTtBQUFBLE1BQUEsSUFBQXZCLEtBQUEsRUFBQUUsUUFBQSxFQUFBaUMsUUFBQSxFQUFBaEMsTUFBQSxFQUFBRSxNQUFBLEVBQUFyQixLQUFBLEVBQUFjLEtBQUE7QUFBQSxNQUFBLE9BQUF1QixtQkFBQSxFQUFBLENBQUFLLElBQUEsQ0FBQSxTQUFBQyxTQUFBQyxRQUFBLEVBQUE7QUFBQSxRQUFBLE9BQUEsQ0FBQSxFQUFBLFFBQUFBLFFBQUEsQ0FBQUMsSUFBQSxHQUFBRCxRQUFBLENBQUE3SyxJQUFBO0FBQUEsVUFBQSxLQUFBLENBQUE7QUFDR2lKLFlBQUFBLEtBQUssR0FBR3ZHLEtBQUksQ0FBQzJJLHVCQUF1QixDQUFDQyxTQUFTLEVBQUU7QUFDaERuQyxZQUFBQSxRQUFRLEdBQUd6RyxLQUFJLENBQUMySSx1QkFBdUIsQ0FBQ0UsWUFBWSxFQUFFO0FBRTVEN0ksWUFBQUEsS0FBSSxDQUFDMEIsVUFBVSxDQUFDb0gsYUFBYSxDQUN6QmhELEdBQUcsQ0FBQ0MsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQzdCLENBQUM7QUFBQ29DLFlBQUFBLFFBQUEsQ0FBQTdLLElBQUEsR0FBQSxDQUFBO1lBQUEsT0FDcUJnSyxVQUFVLENBQUMsZUFBZSxFQUFFO0FBQUVmLGNBQUFBLEtBQUssRUFBTEEsS0FBSztBQUFFRSxjQUFBQSxRQUFRLEVBQVJBO0FBQVMsYUFBQyxDQUFDO0FBQUEsVUFBQSxLQUFBLENBQUE7WUFBakVpQyxRQUFRLEdBQUFQLFFBQUEsQ0FBQVksSUFBQTtZQUNkL0ksS0FBSSxDQUFDMEIsVUFBVSxDQUFDc0gsV0FBVyxDQUN2QmxELEdBQUcsQ0FBQ0MsSUFBSSxFQUFFLFVBQVUsQ0FDeEIsQ0FBQztZQUVPVyxNQUFNLEdBQWFnQyxRQUFRLENBQTNCaEMsTUFBTSxFQUFFRSxNQUFNLEdBQUs4QixRQUFRLENBQW5COUIsTUFBTTtBQUN0QixZQUFBLElBQUlGLE1BQU0sS0FBS0MsY0FBYyxDQUFDUixFQUFFLEVBQUU7Y0FDdEJaLEtBQUssR0FBS3FCLE1BQU0sQ0FBaEJyQixLQUFLO2NBQ2JHLFlBQVksQ0FBQ3VELE9BQU8sQ0FBQ3JELGlCQUFpQixDQUFDTCxLQUFLLEVBQUVBLEtBQUssQ0FBQztBQUNwRGhKLGNBQUFBLE1BQU0sQ0FBQzJNLFFBQVEsQ0FBQ2xHLElBQUksR0FBRyxhQUFhO0FBQ3hDLGFBQUMsTUFBTTtjQUNLcUQsS0FBSyxHQUFLTyxNQUFNLENBQWhCUCxLQUFLO2NBQ2IzRCxPQUFPLENBQUMyRCxLQUFLLENBQUMsUUFBUSxFQUFFSyxNQUFNLEVBQUUsT0FBTyxFQUFFTCxLQUFLLENBQUM7QUFDbkQ7QUFBQyxVQUFBLEtBQUEsQ0FBQTtBQUFBLFVBQUEsS0FBQSxLQUFBO1lBQUEsT0FBQThCLFFBQUEsQ0FBQUksSUFBQSxFQUFBO0FBQUE7QUFBQSxPQUFBLEVBQUFULE9BQUEsQ0FBQTtLQUNKLENBQUEsQ0FBQTtHQUNKLENBQUE7RUFBQXpILGVBQUEsQ0FBQSxJQUFBLEVBQUEsUUFBQSxFQUVRLFVBQUNhLElBQUksRUFBSztBQUNmLElBQUEsSUFBUTZFLElBQUksR0FBSzdFLElBQUksQ0FBYjZFLElBQUk7QUFFWi9GLElBQUFBLEtBQUksQ0FBQzJJLHVCQUF1QixDQUFDNUgsTUFBTSxDQUFDRyxJQUFJLENBQUM7QUFDekNsQixJQUFBQSxLQUFJLENBQUNtSixRQUFRLENBQUNwSSxNQUFNLENBQUM7QUFDakJ0QixNQUFBQSxJQUFJLEVBQUVxRyxHQUFHLENBQUNDLElBQUksRUFBRSxhQUFhO0FBQ2pDLEtBQUMsQ0FBQztJQUNGL0YsS0FBSSxDQUFDZ0MsUUFBUSxDQUFDbUIsV0FBVyxHQUFHMkMsR0FBRyxDQUFDQyxJQUFJLEVBQUUscUJBQXFCLENBQUM7QUFDNUQvRixJQUFBQSxLQUFJLENBQUMwQixVQUFVLENBQUNYLE1BQU0sQ0FBQztBQUNuQnRCLE1BQUFBLElBQUksRUFBRXFHLEdBQUcsQ0FBQ0MsSUFBSSxFQUFFLFVBQVUsQ0FBQztBQUMzQnJGLE1BQUFBLE9BQU8sRUFBRVYsS0FBSSxDQUFDeUksaUJBQWlCLENBQUMxQyxJQUFJO0FBQ3hDLEtBQUMsQ0FBQztHQUNMLENBQUE7QUE1REcsRUFBQSxJQUFJLENBQUM1SyxFQUFFLEdBQUcsSUFBSSxDQUFDMkgsVUFBVSxFQUFFO0FBQy9CLENBQUMsQ0FBQTs7QUNiOEQsSUFFOUNzRyxNQUFNLGdCQUFBckosWUFBQSxDQUN2QixTQUFBcUosU0FBMkI7QUFBQSxFQUFBLElBQUFwSixLQUFBLEdBQUEsSUFBQTtBQUFBLEVBQUEsSUFBZkMsUUFBUSxHQUFBQyxTQUFBLENBQUF4RixNQUFBLEdBQUEsQ0FBQSxJQUFBd0YsU0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBQyxTQUFBLEdBQUFELFNBQUEsQ0FBQSxDQUFBLENBQUEsR0FBRyxFQUFFO0FBQUFFLEVBQUFBLGVBQUEsT0FBQWdKLE1BQUEsQ0FBQTtBQUFBL0ksRUFBQUEsZUFBQSxxQkFxQlosWUFBTTtBQUNmLElBQUEsSUFBQUMsV0FBQSxHQUFxQ04sS0FBSSxDQUFDTyxLQUFLO01BQXZDOEksT0FBTyxHQUFBL0ksV0FBQSxDQUFQK0ksT0FBTztNQUFFakwsS0FBSyxHQUFBa0MsV0FBQSxDQUFMbEMsS0FBSztNQUFFa0wsUUFBUSxHQUFBaEosV0FBQSxDQUFSZ0osUUFBUTtJQUVoQ3RKLEtBQUksQ0FBQ3VKLFdBQVcsR0FBRyxFQUFFO0lBQ3JCLE9BQ2lCLElBQUEsQ0FBQSxZQUFZLElBQXpCcE8sRUFBQSxDQUFBLFFBQUEsRUFBQTtBQUEwQmpCLE1BQUFBLFNBQVMsRUFBQyxhQUFhO0FBQUNzUCxNQUFBQSxRQUFRLEVBQUUsU0FBVkEsUUFBUUEsQ0FBRS9HLENBQUMsRUFBQTtBQUFBLFFBQUEsT0FBSTZHLFFBQVEsQ0FBQzdHLENBQUMsQ0FBQ0csTUFBTSxDQUFDeEUsS0FBSyxDQUFDO0FBQUE7QUFBQyxLQUFBLEVBQ3JGaUwsT0FBTyxDQUFDSSxHQUFHLENBQUMsVUFBQUMsTUFBTSxFQUFJO01BQ25CLElBQU1DLEtBQUssR0FDUHhPLEVBQUEsQ0FBQSxRQUFBLEVBQUE7UUFBUWlELEtBQUssRUFBRXNMLE1BQU0sQ0FBQ3RMLEtBQU07QUFBQ3dMLFFBQUFBLFFBQVEsRUFBRXhMLEtBQUssS0FBS3NMLE1BQU0sQ0FBQ3RMO09BQVFzTCxFQUFBQSxNQUFNLENBQUN6SSxLQUFjLENBQUM7QUFDMUZqQixNQUFBQSxLQUFJLENBQUN1SixXQUFXLENBQUNNLElBQUksQ0FBQ0YsS0FBSyxDQUFDO0FBQzVCLE1BQUEsT0FBT0EsS0FBSztBQUNoQixLQUFDLENBQ0csQ0FBQztHQUVoQixDQUFBO0VBQUF0SixlQUFBLENBQUEsSUFBQSxFQUFBLGNBQUEsRUFFYyxVQUFDeUosTUFBTSxFQUFLO0lBQ3ZCLElBQUlBLE1BQU0sQ0FBQ3BQLE1BQU0sS0FBS3NGLEtBQUksQ0FBQ08sS0FBSyxDQUFDOEksT0FBTyxDQUFDM08sTUFBTSxFQUFFO01BQzdDZ0ksT0FBTyxDQUFDMkQsS0FBSyxDQUFDO0FBQzFCLDJFQUEyRSxDQUFDO0FBQ2hFLE1BQUE7QUFDSjtJQUVBckcsS0FBSSxDQUFDdUosV0FBVyxDQUFDNUUsT0FBTyxDQUFDLFVBQUNvRixRQUFRLEVBQUVDLEtBQUssRUFBSztBQUMxQ0QsTUFBQUEsUUFBUSxDQUFDN0gsU0FBUyxHQUFHNEgsTUFBTSxDQUFDRSxLQUFLLENBQUM7QUFDdEMsS0FBQyxDQUFDO0dBQ0wsQ0FBQTtBQTlDRyxFQUFBLElBQUFDLGlCQUFBLEdBU0loSyxRQUFRLENBUlJvSixPQUFPO0lBQVBBLFFBQU8sR0FBQVksaUJBQUEsS0FBQSxNQUFBLEdBQUcsQ0FDTjtBQUNJaEosTUFBQUEsS0FBSyxFQUFFLFVBQVU7QUFDakI3QyxNQUFBQSxLQUFLLEVBQUU7S0FDVixDQUNKLEdBQUE2TCxpQkFBQTtJQUFBQyxlQUFBLEdBR0RqSyxRQUFRLENBRlI3QixLQUFLO0FBQUxBLElBQUFBLE1BQUssR0FBQThMLGVBQUEsS0FBRyxNQUFBLEdBQUEsU0FBUyxHQUFBQSxlQUFBO0lBQUFDLGtCQUFBLEdBRWpCbEssUUFBUSxDQURScUosUUFBUTtBQUFSQSxJQUFBQSxTQUFRLEdBQUFhLGtCQUFBLEtBQUcsTUFBQSxHQUFBLFVBQUMvTCxLQUFLLEVBQUs7QUFBRXNFLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDdkUsS0FBSyxDQUFDO0FBQUMsS0FBQyxHQUFBK0wsa0JBQUE7RUFHaEQsSUFBSSxDQUFDNUosS0FBSyxHQUFHO0FBQ1Q4SSxJQUFBQSxPQUFPLEVBQVBBLFFBQU87QUFDUGpMLElBQUFBLEtBQUssRUFBTEEsTUFBSztBQUNMa0wsSUFBQUEsUUFBUSxFQUFSQTtHQUNIO0FBRUQsRUFBQSxJQUFJLENBQUNuTyxFQUFFLEdBQUcsSUFBSSxDQUFDMkgsVUFBVSxFQUFFO0FBQy9CLENBQUMsQ0FBQTs7SUN0QkNzSCxZQUFZLGdCQUFBckssWUFBQSxDQUFBLFNBQUFxSyxZQUFBLEdBQUE7QUFBQSxFQUFBLElBQUFwSyxLQUFBLEdBQUEsSUFBQTtBQUFBSSxFQUFBQSxlQUFBLE9BQUFnSyxZQUFBLENBQUE7RUFBQS9KLGVBQUEsQ0FBQSxJQUFBLEVBQUEsWUFBQSxFQUNELEVBQUUsQ0FBQTtBQUVmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBQSxFQUFBQSxlQUFBLENBRVksSUFBQSxFQUFBLFdBQUEsRUFBQSxVQUFDZ0ssSUFBSSxFQUFFQyxRQUFRLEVBQUs7SUFDNUIsSUFBSSxPQUFPdEssS0FBSSxDQUFDdUssVUFBVSxDQUFDRixJQUFJLENBQUMsS0FBSyxXQUFXLEVBQUU7QUFDOUNySyxNQUFBQSxLQUFJLENBQUN1SyxVQUFVLENBQUNGLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDOUI7SUFDQXJLLEtBQUksQ0FBQ3VLLFVBQVUsQ0FBQ0YsSUFBSSxDQUFDLENBQUNSLElBQUksQ0FBQ1MsUUFBUSxDQUFDO0dBQ3ZDLENBQUE7RUFBQWpLLGVBQUEsQ0FBQSxJQUFBLEVBQUEsVUFBQSxFQUVVLFVBQUNnSyxJQUFJLEVBQWdCO0FBQUEsSUFBQSxJQUFkeFAsSUFBSSxHQUFBcUYsU0FBQSxDQUFBeEYsTUFBQSxHQUFBLENBQUEsSUFBQXdGLFNBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQUMsU0FBQSxHQUFBRCxTQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUcsRUFBRTtJQUN2QixJQUFJRixLQUFJLENBQUN1SyxVQUFVLENBQUNDLGNBQWMsQ0FBQ0gsSUFBSSxDQUFDLEVBQUU7TUFDdENySyxLQUFJLENBQUN1SyxVQUFVLENBQUNGLElBQUksQ0FBQyxDQUFDMUYsT0FBTyxDQUFDLFVBQUMyRixRQUFRLEVBQUs7UUFDeENBLFFBQVEsQ0FBQ3pQLElBQUksQ0FBQztBQUNsQixPQUFDLENBQUM7QUFDTjtHQUNILENBQUE7QUFBQSxDQUFBLENBQUE7QUFHRSxJQUFJNFAsa0JBQWtCLEdBQUcsSUFBSUwsWUFBWSxFQUFFLENBQUM7QUFDM0I7O0FDOUJ4QixhQUFlaEYsTUFBTSxDQUFDQyxNQUFNLENBQUM7QUFDekJxRixFQUFBQSxVQUFVLEVBQUU7QUFDaEIsQ0FBQyxDQUFDOztBQ0VtQyxJQUVoQkMsVUFBVSxnQkFBQTVLLFlBQUEsQ0FJM0IsU0FBQTRLLGFBQWM7QUFBQSxFQUFBLElBQUEzSyxLQUFBLEdBQUEsSUFBQTtBQUFBSSxFQUFBQSxlQUFBLE9BQUF1SyxVQUFBLENBQUE7QUFBQXRLLEVBQUFBLGVBQUEsQ0FISCxJQUFBLEVBQUEsVUFBQSxFQUFBLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQUFBLEVBQUFBLGVBQUEsQ0FDUixJQUFBLEVBQUEsY0FBQSxFQUFBLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0VBQUFBLGVBQUEsQ0FBQSxJQUFBLEVBQUEsYUFBQSxFQU1iLFVBQUNpRixNQUFNLEVBQUs7QUFDdEIsSUFBQSxPQUFPdEYsS0FBSSxDQUFDNEssWUFBWSxDQUFDbkIsR0FBRyxDQUFDLFVBQUFvQixNQUFNLEVBQUE7QUFBQSxNQUFBLE9BQUkvRSxHQUFHLENBQUNSLE1BQU0sRUFBRXVGLE1BQU0sQ0FBQztLQUFDLENBQUE7R0FDOUQsQ0FBQTtBQUFBeEssRUFBQUEsZUFBQSxxQkFFWSxZQUFNO0FBQ2YsSUFBQSxJQUFNeUosTUFBTSxHQUFHOUosS0FBSSxDQUFDOEssV0FBVyxDQUFDdEYsYUFBVyxDQUFDO0lBQzVDLElBQU02RCxPQUFPLEdBQUdySixLQUFJLENBQUMrSyxRQUFRLENBQUN0QixHQUFHLENBQUMsVUFBQ25FLE1BQU0sRUFBRTBFLEtBQUssRUFBQTtNQUFBLE9BQU07QUFDbEQ1TCxRQUFBQSxLQUFLLEVBQUVrSCxNQUFNO1FBQ2JyRSxLQUFLLEVBQUU2SSxNQUFNLENBQUNFLEtBQUs7T0FDdEI7QUFBQSxLQUFDLENBQUM7SUFFSCxPQUNpQixJQUFBLENBQUEsWUFBWSxRQUFBWixNQUFBLENBQUE7QUFBQ0MsTUFBQUEsT0FBTyxFQUFFQSxPQUFRO0FBQUNqTCxNQUFBQSxLQUFLLEVBQUVvSCxhQUFZO0FBQzNEOEQsTUFBQUEsUUFBUSxFQUFFLFNBQVZBLFFBQVFBLENBQUVoRSxNQUFNLEVBQUE7UUFBQSxPQUFJbUYsa0JBQWtCLENBQUNPLFFBQVEsQ0FBQ0MsTUFBTSxDQUFDUCxVQUFVLEVBQUVwRixNQUFNLENBQUM7QUFBQTtBQUFDLEtBQUEsQ0FBQTtHQUV0RixDQUFBO0VBQUFqRixlQUFBLENBQUEsSUFBQSxFQUFBLFFBQUEsRUFFUSxVQUFDYSxJQUFJLEVBQUs7QUFDZixJQUFBLElBQUFnSyxVQUFBLEdBQStCaEssSUFBSSxDQUEzQjZFLElBQUk7QUFBSkEsTUFBQUEsSUFBSSxHQUFBbUYsVUFBQSxLQUFHMUYsTUFBQUEsR0FBQUEsYUFBVyxHQUFBMEYsVUFBQTtBQUMxQixJQUFBLElBQU1wQixNQUFNLEdBQUc5SixLQUFJLENBQUM4SyxXQUFXLENBQUMvRSxJQUFJLENBQUM7QUFDckMvRixJQUFBQSxLQUFJLENBQUNtTCxVQUFVLENBQUNDLFlBQVksQ0FBQ3RCLE1BQU0sQ0FBQztHQUN2QyxDQUFBO0FBeEJHLEVBQUEsSUFBSSxDQUFDM08sRUFBRSxHQUFHLElBQUksQ0FBQzJILFVBQVUsRUFBRTtBQUMvQixDQUFDLENBQUE7O0FDUmdDLElBRWhCdUksTUFBTSxnQkFBQXRMLFlBQUEsQ0FDdkIsU0FBQXNMLFNBQTJCO0FBQUEsRUFBQSxJQUFBckwsS0FBQSxHQUFBLElBQUE7QUFBQSxFQUFBLElBQWZDLFFBQVEsR0FBQUMsU0FBQSxDQUFBeEYsTUFBQSxHQUFBLENBQUEsSUFBQXdGLFNBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQUMsU0FBQSxHQUFBRCxTQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUcsRUFBRTtBQUFBRSxFQUFBQSxlQUFBLE9BQUFpTCxNQUFBLENBQUE7QUFBQWhMLEVBQUFBLGVBQUEscUJBUVosWUFBTTtBQUNmLElBQUEsSUFBUWlMLFVBQVUsR0FBS3RMLEtBQUksQ0FBQ08sS0FBSyxDQUF6QitLLFVBQVU7QUFFbEIsSUFBQSxPQUNJblEsRUFBQSxDQUFBLEtBQUEsRUFBQTtNQUFLLE9BQU0sRUFBQTtLQUNFLEVBQUEsSUFBQSxDQUFBLFFBQVEsSUFBakJBLEVBQUEsQ0FBQSxJQUFBLEVBQUE7QUFBa0JqQixNQUFBQSxTQUFTLEVBQUM7S0FBUTRMLEVBQUFBLEdBQUcsQ0FBQ04sYUFBVyxFQUFFLGNBQWMsQ0FBTSxDQUFDLEVBQzFFckssRUFBQSxDQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxDQUNxQixZQUFZLENBQUF3UCxHQUFBQSxJQUFBQSxVQUFBLElBQzVCLENBQUMsRUFDSlcsVUFBVSxLQUNLLElBQUEsQ0FBQSxTQUFTLFFBQUF4TCxNQUFBLENBQUE7QUFBQ2hGLE1BQUFBLElBQUksRUFBQyxRQUFRO0FBQUNaLE1BQUFBLFNBQVMsRUFBQyxTQUFTO0FBQUN1RixNQUFBQSxJQUFJLEVBQUVxRyxHQUFHLENBQUNOLGFBQVcsRUFBRSxZQUFZO0FBQUUsS0FBQSxDQUFBLENBQ2pHLENBQUM7R0FFYixDQUFBO0VBQUFuRixlQUFBLENBQUEsSUFBQSxFQUFBLFFBQUEsRUFFUSxVQUFDYSxJQUFJLEVBQUs7QUFDZixJQUFBLElBQUFnSyxVQUFBLEdBQStCaEssSUFBSSxDQUEzQjZFLElBQUk7QUFBSkEsTUFBQUEsSUFBSSxHQUFBbUYsVUFBQSxLQUFHMUYsTUFBQUEsR0FBQUEsYUFBVyxHQUFBMEYsVUFBQTtBQUUxQmxMLElBQUFBLEtBQUksQ0FBQ21MLFVBQVUsQ0FBQ3BLLE1BQU0sQ0FBQ0csSUFBSSxDQUFDO0lBQzVCbEIsS0FBSSxDQUFDdUwsTUFBTSxDQUFDcEksV0FBVyxHQUFHMkMsR0FBRyxDQUFDQyxJQUFJLEVBQUUsY0FBYyxDQUFDO0lBQ25EL0YsS0FBSSxDQUFDd0wsT0FBTyxJQUFJeEwsS0FBSSxDQUFDd0wsT0FBTyxDQUFDekssTUFBTSxDQUFDO0FBQ2hDdEIsTUFBQUEsSUFBSSxFQUFFcUcsR0FBRyxDQUFDQyxJQUFJLEVBQUUsWUFBWTtBQUNoQyxLQUFDLENBQUM7R0FDTCxDQUFBO0FBOUJHLEVBQUEsSUFBQTBGLG9CQUFBLEdBQStCeEwsUUFBUSxDQUEvQnFMLFVBQVU7QUFBVkEsSUFBQUEsV0FBVSxHQUFBRyxvQkFBQSxLQUFHLE1BQUEsR0FBQSxLQUFLLEdBQUFBLG9CQUFBO0VBRTFCLElBQUksQ0FBQ2xMLEtBQUssR0FBRztBQUFFK0ssSUFBQUEsVUFBVSxFQUFWQTtHQUFZO0FBRTNCLEVBQUEsSUFBSSxDQUFDblEsRUFBRSxHQUFHLElBQUksQ0FBQzJILFVBQVUsRUFBRTtBQUMvQixDQUFDLENBQUE7O0FDWCtDLElBQUE0SSxRQUFBLGdCQUFBM0wsWUFBQSxDQUdoRCxTQUFBMkwsV0FBK0M7QUFBQSxFQUFBLElBQUExTCxLQUFBLEdBQUEsSUFBQTtBQUFBLEVBQUEsSUFBbkMyTCxZQUFZLEdBQUF6TCxTQUFBLENBQUF4RixNQUFBLEdBQUEsQ0FBQSxJQUFBd0YsU0FBQSxDQUFBLENBQUEsQ0FBQSxLQUFBQyxTQUFBLEdBQUFELFNBQUEsQ0FBQSxDQUFBLENBQUEsR0FBR3VLLGtCQUFrQjtBQUFBckssRUFBQUEsZUFBQSxPQUFBc0wsUUFBQSxDQUFBO0VBQ3pDQyxZQUFZLENBQUNDLFNBQVMsQ0FBQ1gsTUFBTSxDQUFDUCxVQUFVLEVBQUUsVUFBQTNFLElBQUksRUFBSTtJQUM5Qy9GLEtBQUksQ0FBQ2UsTUFBTSxDQUFDO0FBQUVnRixNQUFBQSxJQUFJLEVBQUpBO0FBQUssS0FBQyxDQUFDO0lBQ3JCTCxZQUFZLENBQUN1RCxPQUFPLENBQUNyRCxpQkFBaUIsQ0FBQ04sTUFBTSxFQUFFUyxJQUFJLENBQUM7QUFDeEQsR0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFBOztBQ1J1QyxJQUV2QjhGLFVBQVUsMEJBQUFDLGNBQUEsRUFBQTtBQUMzQixFQUFBLFNBQUFELGFBQWlDO0FBQUEsSUFBQSxJQUFBN0wsS0FBQTtBQUFBLElBQUEsSUFBckJDLFFBQVEsR0FBQUMsU0FBQSxDQUFBeEYsTUFBQSxHQUFBLENBQUEsSUFBQXdGLFNBQUEsQ0FBQSxDQUFBLENBQUEsS0FBQUMsU0FBQSxHQUFBRCxTQUFBLENBQUEsQ0FBQSxDQUFBLEdBQUcsRUFBRTtJQUFBLElBQUU2TCxJQUFJLEdBQUE3TCxTQUFBLENBQUF4RixNQUFBLEdBQUF3RixDQUFBQSxHQUFBQSxTQUFBLE1BQUFDLFNBQUE7QUFBQUMsSUFBQUEsZUFBQSxPQUFBeUwsVUFBQSxDQUFBO0lBQzNCN0wsS0FBQSxHQUFBZ00sVUFBQSxDQUFBLElBQUEsRUFBQUgsVUFBQSxDQUFBO0lBQVF4TCxlQUFBLENBQUFMLEtBQUEsRUFBQSxZQUFBLEVBWUMsWUFBTTtBQUNmLE1BQUEsSUFBUXNMLFVBQVUsR0FBS3RMLEtBQUEsQ0FBS08sS0FBSyxDQUF6QitLLFVBQVU7QUFFbEIsTUFBQSxPQUNJblEsRUFBQSxDQUFBLEtBQUEsRUFBQTtBQUFLakIsUUFBQUEsU0FBUyxFQUFDO09BQ0UsRUFBQSxJQUFBLENBQUEsWUFBWSxRQUFBbVIsTUFBQSxDQUFBO0FBQUNDLFFBQUFBLFVBQVUsRUFBRUE7QUFBVyxPQUFBLENBQUEsRUFDakRuUSxFQUFBLENBQUEsS0FBQSxFQUFBO0FBQUtqQixRQUFBQSxTQUFTLEVBQUM7QUFBb0IsT0FBQSxFQUM5QjhGLEtBQUEsQ0FBS2lNLFFBQ0wsQ0FDSixDQUFDO0tBRWIsQ0FBQTtBQUFBNUwsSUFBQUEsZUFBQSxDQUFBTCxLQUFBLEVBRVEsUUFBQSxFQUFBLFVBQUNrQixJQUFJLEVBQUs7QUFDZixNQUFBLElBQUFnSyxVQUFBLEdBQStCaEssSUFBSSxDQUEzQjZFLElBQUk7QUFBSkEsUUFBSW1GLFVBQUEsS0FBRzFGLE1BQUFBLEdBQUFBLFdBQVcsR0FBQTBGO0FBQzFCbEwsTUFBQUEsS0FBQSxDQUFLa00sVUFBVSxDQUFDbkwsTUFBTSxDQUFDRyxJQUFJLENBQUM7QUFDNUJsQixNQUFBQSxLQUFBLENBQUtpTSxRQUFRLENBQUNsTCxNQUFNLENBQUNHLElBQUksQ0FBQztLQUM3QixDQUFBO0FBM0JHLElBQUEsSUFBQXVLLG9CQUFBLEdBQStCeEwsUUFBUSxDQUEvQnFMLFVBQVU7QUFBVkEsTUFBQUEsV0FBVSxHQUFBRyxvQkFBQSxLQUFHLE1BQUEsR0FBQSxLQUFLLEdBQUFBLG9CQUFBO0lBRTFCekwsS0FBQSxDQUFLTyxLQUFLLEdBQUc7QUFDVCtLLE1BQUFBLFVBQVUsRUFBVkE7S0FDSDtJQUVEdEwsS0FBQSxDQUFLaU0sUUFBUSxHQUFHRixJQUFJO0FBQ3BCL0wsSUFBQUEsS0FBQSxDQUFLN0UsRUFBRSxHQUFHNkUsS0FBQSxDQUFLOEMsVUFBVSxFQUFFO0FBQUMsSUFBQSxPQUFBOUMsS0FBQTtBQUNoQztFQUFDbU0sU0FBQSxDQUFBTixVQUFBLEVBQUFDLGNBQUEsQ0FBQTtFQUFBLE9BQUEvTCxZQUFBLENBQUE4TCxVQUFBLENBQUE7QUFBQSxDQUFBLENBWm1DTyxRQUFhLENBQUE7O0FDQVQsSUFFdENDLFNBQVMsZ0JBQUF0TSxZQUFBLENBQ1gsU0FBQXNNLFlBQWM7QUFBQSxFQUFBLElBQUFyTSxLQUFBLEdBQUEsSUFBQTtBQUFBSSxFQUFBQSxlQUFBLE9BQUFpTSxTQUFBLENBQUE7QUFBQWhNLEVBQUFBLGVBQUEscUJBSUQsWUFBTTtBQUNmLElBQUEsT0FDSWxGLEVBQUEsQ0FBQSxLQUFBLEVBQUE7QUFBS2pCLE1BQUFBLFNBQVMsRUFBQztBQUFjLEtBQUEsRUFDekJpQixFQUFBLENBQUEsS0FBQSxFQUFBO0FBQUtqQixNQUFBQSxTQUFTLEVBQUM7S0FDRixFQUFBLElBQUEsQ0FBQSxRQUFRLElBQWpCaUIsRUFBQSxDQUFBLElBQUEsRUFBQTtBQUFrQmpCLE1BQUFBLFNBQVMsRUFBQztBQUFhLEtBQUEsRUFBRTRMLEdBQUcsQ0FBQ04sYUFBVyxFQUFFLE9BQU8sQ0FBTSxDQUN4RSxDQUFDLEVBQ1UsSUFBQSxDQUFBLGdCQUFnQixDQUFBZ0QsR0FBQUEsSUFBQUEsU0FBQSxJQUMvQixDQUFDO0dBRWIsQ0FBQTtFQUFBbkksZUFBQSxDQUFBLElBQUEsRUFBQSxRQUFBLEVBRVEsVUFBQ2EsSUFBSSxFQUFLO0FBQ2YsSUFBQSxJQUFBZ0ssVUFBQSxHQUErQmhLLElBQUksQ0FBM0I2RSxJQUFJO0FBQUpBLE1BQUFBLElBQUksR0FBQW1GLFVBQUEsS0FBRzFGLE1BQUFBLEdBQUFBLGFBQVcsR0FBQTBGLFVBQUE7SUFFMUJsTCxLQUFJLENBQUN1TCxNQUFNLENBQUNwSSxXQUFXLEdBQUcyQyxHQUFHLENBQUNDLElBQUksRUFBRSxPQUFPLENBQUM7QUFDNUMvRixJQUFBQSxLQUFJLENBQUNzTSxjQUFjLENBQUN2TCxNQUFNLENBQUNHLElBQUksQ0FBQztHQUNuQyxDQUFBO0FBbkJHLEVBQUEsSUFBSSxDQUFDL0YsRUFBRSxHQUFHLElBQUksQ0FBQzJILFVBQVUsRUFBRTtBQUMvQixDQUFDLENBQUE7QUFxQkx0RyxLQUFLLENBQ0RuQyxRQUFRLENBQUNrUyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUEsSUFBQVYsVUFBQSxDQUFBLEVBQUEsRUFBQSxJQUFBUSxTQUFBLENBQUEsRUFBQSxDQUFBLENBSW5DLENBQUM7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXX0=
