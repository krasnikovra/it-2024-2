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
    return this['_ui_container'] = el("div", null, this['_ui_label'] = el("label", {
      "for": inputId,
      className: 'form-label'
    }, label), this['_ui_input'] = el("input", {
      type: type,
      id: inputId,
      className: 'form-control',
      placeholder: placeholder
    }), this['_ui_invalid_feedback'] = el("div", {
      className: "invalid-feedback"
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
  _defineProperty(this, "invalidate", function () {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    _this._ui_invalid_feedback.innerHTML = text;
    _this._ui_input.setCustomValidity('empty');
    _this._ui_container.classList.add('was-validated');
  });
  _defineProperty(this, "removeInvalidity", function () {
    _this._ui_invalid_feedback.innerHTML = '';
    _this._ui_container.classList.remove('was-validated');
    _this._ui_input.setCustomValidity('');
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
  'enter_nonempty_login': 'Введите непустой e-mail',
  'enter_nonempty_password': 'Введите непустой пароль',
  'wrong_login_or_pwd': 'Неверный логин или пароль',
  'passwords_are_not_equal': 'Пароли не совпадают',
  'login_already_registered': 'Такой логин уже зарегистрирован',
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
  'enter_nonempty_login': 'Enter non-empty e-mail',
  'enter_nonempty_password': 'Enter non-empty password',
  'wrong_login_or_pwd': 'Wrong login or password',
  'passwords_are_not_equal': 'Passwords are not equal',
  'login_already_registered': 'Such login already registered',
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
  _defineProperty(this, "validate", function (lang) {
    var login = _this.get_login();
    var password = _this.get_password();
    var valid = true;
    if (login.trim() === '') {
      _this.invalidateLogin(t9n(lang, 'enter_nonempty_login'));
      valid = false;
    } else {
      _this.removeInvalidityOfLogin();
    }
    if (password.trim() === '') {
      _this.invalidatePassword(t9n(lang, 'enter_nonempty_password'));
      valid = false;
    } else {
      _this.removeInvalidityOfPassword();
    }
    return valid;
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
    _this.removeInvalidityOfLogin();
    _this.removeInvalidityOfPassword();
  });
  _defineProperty(this, "get_login", function () {
    return _this._ui_input_email.get_value();
  });
  _defineProperty(this, "get_password", function () {
    return _this._ui_input_pwd.get_value();
  });
  _defineProperty(this, "invalidateLogin", function () {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return _this._ui_input_email.invalidate(text);
  });
  _defineProperty(this, "removeInvalidityOfLogin", function () {
    return _this._ui_input_email.removeInvalidity();
  });
  _defineProperty(this, "invalidatePassword", function () {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return _this._ui_input_pwd.invalidate(text);
  });
  _defineProperty(this, "removeInvalidityOfPassword", function () {
    return _this._ui_input_pwd.removeInvalidity();
  });
  this.el = this._ui_render();
});

var responseStatus = Object.freeze({
  ok: 'ok',
  failed: 'failed',
  error: 'error'
});

var error$2 = Object.freeze({
  notFound: 'not_found'
});

function login(body) {
  var login = body.login,
    password = body.password;
  if (login.trim() === '') {
    return {
      status: responseStatus.failed,
      detail: {
        error: error$1.emptyLogin
      }
    };
  }
  if (password.trim() === '') {
    return {
      status: responseStatus.failed,
      detail: {
        error: error$1.emptyPwd
      }
    };
  }
  if (login !== 'admin' || password !== 'admin') {
    return {
      status: responseStatus.failed,
      detail: {
        error: error$1.wrongLoginOrPwd
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
var error$1 = Object.freeze({
  wrongLoginOrPwd: 'wrong_login_or_pwd',
  emptyLogin: 'empty_login',
  emptyPwd: 'empty_pwd'
});

function register(body) {
  var login = body.login,
    password = body.password,
    passwordRepeat = body.passwordRepeat;
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
  if (passwordRepeat.trim() === '') {
    return {
      status: responseStatus.failed,
      detail: {
        error: error.emptyPwd
      }
    };
  }
  if (login === 'admin') {
    return {
      status: responseStatus.failed,
      detail: {
        error: error.loginAlreadyRegistered
      }
    };
  }
  return {
    status: responseStatus.ok,
    detail: {}
  };
}
var error = Object.freeze({
  emptyLogin: 'empty_login',
  emptyPwd: 'empty_pwd',
  emptyPwdRepeat: 'empty_pwd_repeat',
  loginAlreadyRegistered: 'login_already_registered'
});

var defaultPendingMs = 2000;
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
          _context.next = _context.t0 === '/api/v1/login' ? 7 : _context.t0 === '/api/v1/register' ? 8 : 9;
          break;
        case 7:
          return _context.abrupt("return", login(body));
        case 8:
          return _context.abrupt("return", register(body));
        case 9:
          return _context.abrupt("return", {
            status: responseStatus.failed,
            detail: {
              error: error$2.notFound
            }
          });
        case 10:
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
    return el("div", null, el("div", null, this['_ui_login_and_pass_form'] = new LoginAndPassForm({}), el("div", {
      className: "my-2 text-center"
    }, el("small", null, this['_ui_span'] = el("span", null, t9n(defaultLang$1, 'no_account_question')), "\xA0", this['_ui_link'] = new Link({
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
            if (_this._validate(lang)) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            login = _this._ui_login_and_pass_form.get_login();
            password = _this._ui_login_and_pass_form.get_password();
            _this._ui_button.start_loading(t9n(lang, 'loading', 'em'));
            _context.next = 7;
            return fake_fetch('/api/v1/login', {
              login: login,
              password: password
            });
          case 7:
            response = _context.sent;
            _this._ui_button.end_loading(t9n(lang, 'to_login'));
            status = response.status, detail = response.detail;
            if (!(status === responseStatus.ok)) {
              _context.next = 16;
              break;
            }
            token = detail.token;
            localStorage.setItem(localStorageItems.token, token);
            window.location.href = './edit.html';
            _context.next = 29;
            break;
          case 16:
            error = detail.error;
            _context.t0 = error;
            _context.next = _context.t0 === error$1.emptyLogin ? 20 : _context.t0 === error$1.emptyPwd ? 23 : _context.t0 === error$1.wrongLoginOrPwd ? 26 : 29;
            break;
          case 20:
            _this._ui_login_and_pass_form.invalidateLogin(t9n(lang, 'enter_nonempty_login'));
            _this._ui_login_and_pass_form.removeInvalidityOfPassword();
            return _context.abrupt("break", 29);
          case 23:
            _this._ui_login_and_pass_form.invalidatePassword(t9n(lang, 'enter_nonempty_password'));
            _this._ui_login_and_pass_form.removeInvalidityOfLogin();
            return _context.abrupt("break", 29);
          case 26:
            _this._ui_login_and_pass_form.invalidateLogin();
            _this._ui_login_and_pass_form.invalidatePassword(t9n(lang, 'wrong_login_or_pwd'));
            return _context.abrupt("break", 29);
          case 29:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
  });
  _defineProperty(this, "_validate", function (lang) {
    return _this._ui_login_and_pass_form.validate(lang);
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
      text: t9n(defaultLang$1, 'to_log_out'),
      onClick: function onClick() {
        localStorage.removeItem(localStorageItems.token);
        window.location.href = './login.html';
      }
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
  _defineProperty(this, "onmount", function () {
    var token = localStorage.getItem(localStorageItems.token);
    if (token) {
      window.location.href = './edit.html';
    }
  });
  this.el = this._ui_render();
});
mount(document.getElementById("root"), new WithHeader({}, new LoginPage({})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9idXR0b24uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2F0b20vbGluay5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9pbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5ydS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5lbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvY29uc3RhbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvbG9naW5BbmRQYXNzRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXBpL3N0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXBpL2Vycm9yLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hcGkvbG9naW4uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2FwaS9yZWdpc3Rlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXBpL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvbG9naW5Gb3JtLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL3NlbGVjdC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRNYW5hZ2VyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9ldmVudHMuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3dpZGdldC9zZWxlY3RMYW5nLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvaGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9sb2NhbGl6ZWRQYWdlLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy93aXRoSGVhZGVyLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9sb2dpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHF1ZXJ5LCBucykge1xuICBjb25zdCB7IHRhZywgaWQsIGNsYXNzTmFtZSB9ID0gcGFyc2UocXVlcnkpO1xuICBjb25zdCBlbGVtZW50ID0gbnNcbiAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgdGFnKVxuICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuXG4gIGlmIChpZCkge1xuICAgIGVsZW1lbnQuaWQgPSBpZDtcbiAgfVxuXG4gIGlmIChjbGFzc05hbWUpIHtcbiAgICBpZiAobnMpIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKHF1ZXJ5KSB7XG4gIGNvbnN0IGNodW5rcyA9IHF1ZXJ5LnNwbGl0KC8oWy4jXSkvKTtcbiAgbGV0IGNsYXNzTmFtZSA9IFwiXCI7XG4gIGxldCBpZCA9IFwiXCI7XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBjaHVua3MubGVuZ3RoOyBpICs9IDIpIHtcbiAgICBzd2l0Y2ggKGNodW5rc1tpXSkge1xuICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgY2xhc3NOYW1lICs9IGAgJHtjaHVua3NbaSArIDFdfWA7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwiI1wiOlxuICAgICAgICBpZCA9IGNodW5rc1tpICsgMV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjbGFzc05hbWU6IGNsYXNzTmFtZS50cmltKCksXG4gICAgdGFnOiBjaHVua3NbMF0gfHwgXCJkaXZcIixcbiAgICBpZCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaHRtbChxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnkpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNvbnN0IFF1ZXJ5ID0gcXVlcnk7XG4gICAgZWxlbWVudCA9IG5ldyBRdWVyeSguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdCBsZWFzdCBvbmUgYXJndW1lbnQgcmVxdWlyZWRcIik7XG4gIH1cblxuICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGdldEVsKGVsZW1lbnQpLCBhcmdzLCB0cnVlKTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuY29uc3QgZWwgPSBodG1sO1xuY29uc3QgaCA9IGh0bWw7XG5cbmh0bWwuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kSHRtbCguLi5hcmdzKSB7XG4gIHJldHVybiBodG1sLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5mdW5jdGlvbiB1bm1vdW50KHBhcmVudCwgX2NoaWxkKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGRFbC5wYXJlbnROb2RlKSB7XG4gICAgZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCk7XG5cbiAgICBwYXJlbnRFbC5yZW1vdmVDaGlsZChjaGlsZEVsKTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCkge1xuICBjb25zdCBob29rcyA9IGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgaWYgKGhvb2tzQXJlRW1wdHkoaG9va3MpKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuXG4gIGlmIChjaGlsZEVsLl9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgXCJvbnVubW91bnRcIik7XG4gIH1cblxuICB3aGlsZSAodHJhdmVyc2UpIHtcbiAgICBjb25zdCBwYXJlbnRIb29rcyA9IHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlIHx8IHt9O1xuXG4gICAgZm9yIChjb25zdCBob29rIGluIGhvb2tzKSB7XG4gICAgICBpZiAocGFyZW50SG9va3NbaG9va10pIHtcbiAgICAgICAgcGFyZW50SG9va3NbaG9va10gLT0gaG9va3NbaG9va107XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhvb2tzQXJlRW1wdHkocGFyZW50SG9va3MpKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgdHJhdmVyc2UgPSB0cmF2ZXJzZS5wYXJlbnROb2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhvb2tzQXJlRW1wdHkoaG9va3MpIHtcbiAgaWYgKGhvb2tzID09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKGNvbnN0IGtleSBpbiBob29rcykge1xuICAgIGlmIChob29rc1trZXldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiBnbG9iYWwgTm9kZSwgU2hhZG93Um9vdCAqL1xuXG5cbmNvbnN0IGhvb2tOYW1lcyA9IFtcIm9ubW91bnRcIiwgXCJvbnJlbW91bnRcIiwgXCJvbnVubW91bnRcIl07XG5jb25zdCBzaGFkb3dSb290QXZhaWxhYmxlID1cbiAgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBcIlNoYWRvd1Jvb3RcIiBpbiB3aW5kb3c7XG5cbmZ1bmN0aW9uIG1vdW50KHBhcmVudCwgX2NoaWxkLCBiZWZvcmUsIHJlcGxhY2UpIHtcbiAgbGV0IGNoaWxkID0gX2NoaWxkO1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGNvbnN0IGNoaWxkRWwgPSBnZXRFbChjaGlsZCk7XG5cbiAgaWYgKGNoaWxkID09PSBjaGlsZEVsICYmIGNoaWxkRWwuX19yZWRvbV92aWV3KSB7XG4gICAgLy8gdHJ5IHRvIGxvb2sgdXAgdGhlIHZpZXcgaWYgbm90IHByb3ZpZGVkXG4gICAgY2hpbGQgPSBjaGlsZEVsLl9fcmVkb21fdmlldztcbiAgfVxuXG4gIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgIGNoaWxkRWwuX19yZWRvbV92aWV3ID0gY2hpbGQ7XG4gIH1cblxuICBjb25zdCB3YXNNb3VudGVkID0gY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQ7XG4gIGNvbnN0IG9sZFBhcmVudCA9IGNoaWxkRWwucGFyZW50Tm9kZTtcblxuICBpZiAod2FzTW91bnRlZCAmJiBvbGRQYXJlbnQgIT09IHBhcmVudEVsKSB7XG4gICAgZG9Vbm1vdW50KGNoaWxkLCBjaGlsZEVsLCBvbGRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKGJlZm9yZSAhPSBudWxsKSB7XG4gICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgIGNvbnN0IGJlZm9yZUVsID0gZ2V0RWwoYmVmb3JlKTtcblxuICAgICAgaWYgKGJlZm9yZUVsLl9fcmVkb21fbW91bnRlZCkge1xuICAgICAgICB0cmlnZ2VyKGJlZm9yZUVsLCBcIm9udW5tb3VudFwiKTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50RWwucmVwbGFjZUNoaWxkKGNoaWxkRWwsIGJlZm9yZUVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50RWwuaW5zZXJ0QmVmb3JlKGNoaWxkRWwsIGdldEVsKGJlZm9yZSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChjaGlsZEVsKTtcbiAgfVxuXG4gIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpO1xuXG4gIHJldHVybiBjaGlsZDtcbn1cblxuZnVuY3Rpb24gdHJpZ2dlcihlbCwgZXZlbnROYW1lKSB7XG4gIGlmIChldmVudE5hbWUgPT09IFwib25tb3VudFwiIHx8IGV2ZW50TmFtZSA9PT0gXCJvbnJlbW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSBcIm9udW5tb3VudFwiKSB7XG4gICAgZWwuX19yZWRvbV9tb3VudGVkID0gZmFsc2U7XG4gIH1cblxuICBjb25zdCBob29rcyA9IGVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmICghaG9va3MpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB2aWV3ID0gZWwuX19yZWRvbV92aWV3O1xuICBsZXQgaG9va0NvdW50ID0gMDtcblxuICB2aWV3Py5bZXZlbnROYW1lXT8uKCk7XG5cbiAgZm9yIChjb25zdCBob29rIGluIGhvb2tzKSB7XG4gICAgaWYgKGhvb2spIHtcbiAgICAgIGhvb2tDb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChob29rQ291bnQpIHtcbiAgICBsZXQgdHJhdmVyc2UgPSBlbC5maXJzdENoaWxkO1xuXG4gICAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgICBjb25zdCBuZXh0ID0gdHJhdmVyc2UubmV4dFNpYmxpbmc7XG5cbiAgICAgIHRyaWdnZXIodHJhdmVyc2UsIGV2ZW50TmFtZSk7XG5cbiAgICAgIHRyYXZlcnNlID0gbmV4dDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZG9Nb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwsIG9sZFBhcmVudCkge1xuICBpZiAoIWNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gIH1cblxuICBjb25zdCBob29rcyA9IGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGU7XG4gIGNvbnN0IHJlbW91bnQgPSBwYXJlbnRFbCA9PT0gb2xkUGFyZW50O1xuICBsZXQgaG9va3NGb3VuZCA9IGZhbHNlO1xuXG4gIGZvciAoY29uc3QgaG9va05hbWUgb2YgaG9va05hbWVzKSB7XG4gICAgaWYgKCFyZW1vdW50KSB7XG4gICAgICAvLyBpZiBhbHJlYWR5IG1vdW50ZWQsIHNraXAgdGhpcyBwaGFzZVxuICAgICAgaWYgKGNoaWxkICE9PSBjaGlsZEVsKSB7XG4gICAgICAgIC8vIG9ubHkgVmlld3MgY2FuIGhhdmUgbGlmZWN5Y2xlIGV2ZW50c1xuICAgICAgICBpZiAoaG9va05hbWUgaW4gY2hpbGQpIHtcbiAgICAgICAgICBob29rc1tob29rTmFtZV0gPSAoaG9va3NbaG9va05hbWVdIHx8IDApICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaG9va3NbaG9va05hbWVdKSB7XG4gICAgICBob29rc0ZvdW5kID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWhvb2tzRm91bmQpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHRyYXZlcnNlID0gcGFyZW50RWw7XG4gIGxldCB0cmlnZ2VyZWQgPSBmYWxzZTtcblxuICBpZiAocmVtb3VudCB8fCB0cmF2ZXJzZT8uX19yZWRvbV9tb3VudGVkKSB7XG4gICAgdHJpZ2dlcihjaGlsZEVsLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcblxuICAgIGlmICghdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUpIHtcbiAgICAgIHRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgcGFyZW50SG9va3NbaG9va10gPSAocGFyZW50SG9va3NbaG9va10gfHwgMCkgKyBob29rc1tob29rXTtcbiAgICB9XG5cbiAgICBpZiAodHJpZ2dlcmVkKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKFxuICAgICAgdHJhdmVyc2Uubm9kZVR5cGUgPT09IE5vZGUuRE9DVU1FTlRfTk9ERSB8fFxuICAgICAgKHNoYWRvd1Jvb3RBdmFpbGFibGUgJiYgdHJhdmVyc2UgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB8fFxuICAgICAgcGFyZW50Py5fX3JlZG9tX21vdW50ZWRcbiAgICApIHtcbiAgICAgIHRyaWdnZXIodHJhdmVyc2UsIHJlbW91bnQgPyBcIm9ucmVtb3VudFwiIDogXCJvbm1vdW50XCIpO1xuICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgdHJhdmVyc2UgPSBwYXJlbnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0U3R5bGUodmlldywgYXJnMSwgYXJnMikge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgYXJnMVtrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgc2V0U3R5bGVWYWx1ZShlbCwgYXJnMSwgYXJnMik7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0U3R5bGVWYWx1ZShlbCwga2V5LCB2YWx1ZSkge1xuICBlbC5zdHlsZVtrZXldID0gdmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIFNWR0VsZW1lbnQgKi9cblxuXG5jb25zdCB4bGlua25zID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI7XG5cbmZ1bmN0aW9uIHNldEF0dHIodmlldywgYXJnMSwgYXJnMikge1xuICBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMik7XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJJbnRlcm5hbCh2aWV3LCBhcmcxLCBhcmcyLCBpbml0aWFsKSB7XG4gIGNvbnN0IGVsID0gZ2V0RWwodmlldyk7XG5cbiAgY29uc3QgaXNPYmogPSB0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIjtcblxuICBpZiAoaXNPYmopIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRBdHRySW50ZXJuYWwoZWwsIGtleSwgYXJnMVtrZXldLCBpbml0aWFsKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaXNTVkcgPSBlbCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQ7XG4gICAgY29uc3QgaXNGdW5jID0gdHlwZW9mIGFyZzIgPT09IFwiZnVuY3Rpb25cIjtcblxuICAgIGlmIChhcmcxID09PSBcInN0eWxlXCIgJiYgdHlwZW9mIGFyZzIgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldFN0eWxlKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKGlzU1ZHICYmIGlzRnVuYykge1xuICAgICAgZWxbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSBpZiAoYXJnMSA9PT0gXCJkYXRhc2V0XCIpIHtcbiAgICAgIHNldERhdGEoZWwsIGFyZzIpO1xuICAgIH0gZWxzZSBpZiAoIWlzU1ZHICYmIChhcmcxIGluIGVsIHx8IGlzRnVuYykgJiYgYXJnMSAhPT0gXCJsaXN0XCIpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzU1ZHICYmIGFyZzEgPT09IFwieGxpbmtcIikge1xuICAgICAgICBzZXRYbGluayhlbCwgYXJnMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChpbml0aWFsICYmIGFyZzEgPT09IFwiY2xhc3NcIikge1xuICAgICAgICBzZXRDbGFzc05hbWUoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoYXJnMiA9PSBudWxsKSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhcmcxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhcmcxLCBhcmcyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0Q2xhc3NOYW1lKGVsLCBhZGRpdGlvblRvQ2xhc3NOYW1lKSB7XG4gIGlmIChhZGRpdGlvblRvQ2xhc3NOYW1lID09IG51bGwpIHtcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgfSBlbHNlIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKGFkZGl0aW9uVG9DbGFzc05hbWUpO1xuICB9IGVsc2UgaWYgKFxuICAgIHR5cGVvZiBlbC5jbGFzc05hbWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICBlbC5jbGFzc05hbWUgJiZcbiAgICBlbC5jbGFzc05hbWUuYmFzZVZhbFxuICApIHtcbiAgICBlbC5jbGFzc05hbWUuYmFzZVZhbCA9XG4gICAgICBgJHtlbC5jbGFzc05hbWUuYmFzZVZhbH0gJHthZGRpdGlvblRvQ2xhc3NOYW1lfWAudHJpbSgpO1xuICB9IGVsc2Uge1xuICAgIGVsLmNsYXNzTmFtZSA9IGAke2VsLmNsYXNzTmFtZX0gJHthZGRpdGlvblRvQ2xhc3NOYW1lfWAudHJpbSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFhsaW5rKGVsLCBhcmcxLCBhcmcyKSB7XG4gIGlmICh0eXBlb2YgYXJnMSA9PT0gXCJvYmplY3RcIikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGFyZzEpIHtcbiAgICAgIHNldFhsaW5rKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rbnMsIGFyZzEsIGFyZzIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0RGF0YShlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXREYXRhKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChhcmcyICE9IG51bGwpIHtcbiAgICAgIGVsLmRhdGFzZXRbYXJnMV0gPSBhcmcyO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZWwuZGF0YXNldFthcmcxXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdGV4dChzdHIpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0ciAhPSBudWxsID8gc3RyIDogXCJcIik7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJncywgaW5pdGlhbCkge1xuICBmb3IgKGNvbnN0IGFyZyBvZiBhcmdzKSB7XG4gICAgaWYgKGFyZyAhPT0gMCAmJiAhYXJnKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIGFyZztcblxuICAgIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGFyZyhlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIgfHwgdHlwZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0KGFyZykpO1xuICAgIH0gZWxzZSBpZiAoaXNOb2RlKGdldEVsKGFyZykpKSB7XG4gICAgICBtb3VudChlbGVtZW50LCBhcmcpO1xuICAgIH0gZWxzZSBpZiAoYXJnLmxlbmd0aCkge1xuICAgICAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChlbGVtZW50LCBhcmcsIGluaXRpYWwpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsZW1lbnQsIGFyZywgbnVsbCwgaW5pdGlhbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUVsKHBhcmVudCkge1xuICByZXR1cm4gdHlwZW9mIHBhcmVudCA9PT0gXCJzdHJpbmdcIiA/IGh0bWwocGFyZW50KSA6IGdldEVsKHBhcmVudCk7XG59XG5cbmZ1bmN0aW9uIGdldEVsKHBhcmVudCkge1xuICByZXR1cm4gKFxuICAgIChwYXJlbnQubm9kZVR5cGUgJiYgcGFyZW50KSB8fCAoIXBhcmVudC5lbCAmJiBwYXJlbnQpIHx8IGdldEVsKHBhcmVudC5lbClcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlKGFyZykge1xuICByZXR1cm4gYXJnPy5ub2RlVHlwZTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2goY2hpbGQsIGRhdGEsIGV2ZW50TmFtZSA9IFwicmVkb21cIikge1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiBkYXRhIH0pO1xuICBjaGlsZEVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBzZXRDaGlsZHJlbihwYXJlbnQsIC4uLmNoaWxkcmVuKSB7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgbGV0IGN1cnJlbnQgPSB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkcmVuLCBwYXJlbnRFbC5maXJzdENoaWxkKTtcblxuICB3aGlsZSAoY3VycmVudCkge1xuICAgIGNvbnN0IG5leHQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuXG4gICAgdW5tb3VudChwYXJlbnQsIGN1cnJlbnQpO1xuXG4gICAgY3VycmVudCA9IG5leHQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgX2N1cnJlbnQpIHtcbiAgbGV0IGN1cnJlbnQgPSBfY3VycmVudDtcblxuICBjb25zdCBjaGlsZEVscyA9IEFycmF5KGNoaWxkcmVuLmxlbmd0aCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGNoaWxkRWxzW2ldID0gY2hpbGRyZW5baV0gJiYgZ2V0RWwoY2hpbGRyZW5baV0pO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG5cbiAgICBpZiAoIWNoaWxkKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZEVsID0gY2hpbGRFbHNbaV07XG5cbiAgICBpZiAoY2hpbGRFbCA9PT0gY3VycmVudCkge1xuICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoaXNOb2RlKGNoaWxkRWwpKSB7XG4gICAgICBjb25zdCBuZXh0ID0gY3VycmVudD8ubmV4dFNpYmxpbmc7XG4gICAgICBjb25zdCBleGlzdHMgPSBjaGlsZC5fX3JlZG9tX2luZGV4ICE9IG51bGw7XG4gICAgICBjb25zdCByZXBsYWNlID0gZXhpc3RzICYmIG5leHQgPT09IGNoaWxkRWxzW2kgKyAxXTtcblxuICAgICAgbW91bnQocGFyZW50LCBjaGlsZCwgY3VycmVudCwgcmVwbGFjZSk7XG5cbiAgICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgfVxuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQubGVuZ3RoICE9IG51bGwpIHtcbiAgICAgIGN1cnJlbnQgPSB0cmF2ZXJzZShwYXJlbnQsIGNoaWxkLCBjdXJyZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gbGlzdFBvb2woVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IExpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0UG9vbCB7XG4gIGNvbnN0cnVjdG9yKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgICB0aGlzLlZpZXcgPSBWaWV3O1xuICAgIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgICB0aGlzLm9sZExvb2t1cCA9IHt9O1xuICAgIHRoaXMubG9va3VwID0ge307XG4gICAgdGhpcy5vbGRWaWV3cyA9IFtdO1xuICAgIHRoaXMudmlld3MgPSBbXTtcblxuICAgIGlmIChrZXkgIT0gbnVsbCkge1xuICAgICAgdGhpcy5rZXkgPSB0eXBlb2Yga2V5ID09PSBcImZ1bmN0aW9uXCIgPyBrZXkgOiBwcm9wS2V5KGtleSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IFZpZXcsIGtleSwgaW5pdERhdGEgfSA9IHRoaXM7XG4gICAgY29uc3Qga2V5U2V0ID0ga2V5ICE9IG51bGw7XG5cbiAgICBjb25zdCBvbGRMb29rdXAgPSB0aGlzLmxvb2t1cDtcbiAgICBjb25zdCBuZXdMb29rdXAgPSB7fTtcblxuICAgIGNvbnN0IG5ld1ZpZXdzID0gQXJyYXkoZGF0YS5sZW5ndGgpO1xuICAgIGNvbnN0IG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbSA9IGRhdGFbaV07XG4gICAgICBsZXQgdmlldztcblxuICAgICAgaWYgKGtleVNldCkge1xuICAgICAgICBjb25zdCBpZCA9IGtleShpdGVtKTtcblxuICAgICAgICB2aWV3ID0gb2xkTG9va3VwW2lkXSB8fCBuZXcgVmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSk7XG4gICAgICAgIG5ld0xvb2t1cFtpZF0gPSB2aWV3O1xuICAgICAgICB2aWV3Ll9fcmVkb21faWQgPSBpZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZXcgPSBvbGRWaWV3c1tpXSB8fCBuZXcgVmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSk7XG4gICAgICB9XG4gICAgICB2aWV3LnVwZGF0ZT8uKGl0ZW0sIGksIGRhdGEsIGNvbnRleHQpO1xuXG4gICAgICBjb25zdCBlbCA9IGdldEVsKHZpZXcuZWwpO1xuXG4gICAgICBlbC5fX3JlZG9tX3ZpZXcgPSB2aWV3O1xuICAgICAgbmV3Vmlld3NbaV0gPSB2aWV3O1xuICAgIH1cblxuICAgIHRoaXMub2xkVmlld3MgPSBvbGRWaWV3cztcbiAgICB0aGlzLnZpZXdzID0gbmV3Vmlld3M7XG5cbiAgICB0aGlzLm9sZExvb2t1cCA9IG9sZExvb2t1cDtcbiAgICB0aGlzLmxvb2t1cCA9IG5ld0xvb2t1cDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwcm9wS2V5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24gcHJvcHBlZEtleShpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW1ba2V5XTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIExpc3Qge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgICB0aGlzLlZpZXcgPSBWaWV3O1xuICAgIHRoaXMuaW5pdERhdGEgPSBpbml0RGF0YTtcbiAgICB0aGlzLnZpZXdzID0gW107XG4gICAgdGhpcy5wb29sID0gbmV3IExpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpO1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMua2V5U2V0ID0ga2V5ICE9IG51bGw7XG4gIH1cblxuICB1cGRhdGUoZGF0YSwgY29udGV4dCkge1xuICAgIGNvbnN0IHsga2V5U2V0IH0gPSB0aGlzO1xuICAgIGNvbnN0IG9sZFZpZXdzID0gdGhpcy52aWV3cztcblxuICAgIHRoaXMucG9vbC51cGRhdGUoZGF0YSB8fCBbXSwgY29udGV4dCk7XG5cbiAgICBjb25zdCB7IHZpZXdzLCBsb29rdXAgfSA9IHRoaXMucG9vbDtcblxuICAgIGlmIChrZXlTZXQpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2xkVmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb2xkVmlldyA9IG9sZFZpZXdzW2ldO1xuICAgICAgICBjb25zdCBpZCA9IG9sZFZpZXcuX19yZWRvbV9pZDtcblxuICAgICAgICBpZiAobG9va3VwW2lkXSA9PSBudWxsKSB7XG4gICAgICAgICAgb2xkVmlldy5fX3JlZG9tX2luZGV4ID0gbnVsbDtcbiAgICAgICAgICB1bm1vdW50KHRoaXMsIG9sZFZpZXcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2aWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdmlldyA9IHZpZXdzW2ldO1xuXG4gICAgICB2aWV3Ll9fcmVkb21faW5kZXggPSBpO1xuICAgIH1cblxuICAgIHNldENoaWxkcmVuKHRoaXMsIHZpZXdzKTtcblxuICAgIGlmIChrZXlTZXQpIHtcbiAgICAgIHRoaXMubG9va3VwID0gbG9va3VwO1xuICAgIH1cbiAgICB0aGlzLnZpZXdzID0gdmlld3M7XG4gIH1cbn1cblxuTGlzdC5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRMaXN0KHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSkge1xuICByZXR1cm4gTGlzdC5iaW5kKExpc3QsIHBhcmVudCwgVmlldywga2V5LCBpbml0RGF0YSk7XG59O1xuXG5saXN0LmV4dGVuZCA9IExpc3QuZXh0ZW5kO1xuXG4vKiBnbG9iYWwgTm9kZSAqL1xuXG5cbmZ1bmN0aW9uIHBsYWNlKFZpZXcsIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgUGxhY2UoVmlldywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBQbGFjZSB7XG4gIGNvbnN0cnVjdG9yKFZpZXcsIGluaXREYXRhKSB7XG4gICAgdGhpcy5lbCA9IHRleHQoXCJcIik7XG4gICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHRoaXMuZWw7XG5cbiAgICBpZiAoVmlldyBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgIHRoaXMuX2VsID0gVmlldztcbiAgICB9IGVsc2UgaWYgKFZpZXcuZWwgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgICB0aGlzLnZpZXcgPSBWaWV3O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9WaWV3ID0gVmlldztcbiAgICB9XG5cbiAgICB0aGlzLl9pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHZpc2libGUsIGRhdGEpIHtcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuX3BsYWNlaG9sZGVyO1xuICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLmVsLnBhcmVudE5vZGU7XG5cbiAgICBpZiAodmlzaWJsZSkge1xuICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VsKSB7XG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdGhpcy5fZWwsIHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh0aGlzLl9lbCk7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBWaWV3ID0gdGhpcy5fVmlldztcbiAgICAgICAgICBjb25zdCB2aWV3ID0gbmV3IFZpZXcodGhpcy5faW5pdERhdGEpO1xuXG4gICAgICAgICAgdGhpcy5lbCA9IGdldEVsKHZpZXcpO1xuICAgICAgICAgIHRoaXMudmlldyA9IHZpZXc7XG5cbiAgICAgICAgICBtb3VudChwYXJlbnROb2RlLCB2aWV3LCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMudmlldz8udXBkYXRlPy4oZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnZpc2libGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VsKSB7XG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIsIHRoaXMuX2VsKTtcbiAgICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLnZpZXcpO1xuICAgICAgICB1bm1vdW50KHBhcmVudE5vZGUsIHRoaXMudmlldyk7XG5cbiAgICAgICAgdGhpcy5lbCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlZihjdHgsIGtleSwgdmFsdWUpIHtcbiAgY3R4W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKiBnbG9iYWwgTm9kZSAqL1xuXG5cbmZ1bmN0aW9uIHJvdXRlcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFJvdXRlcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSk7XG59XG5cbmNsYXNzIFJvdXRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgdmlld3MsIGluaXREYXRhKSB7XG4gICAgdGhpcy5lbCA9IGVuc3VyZUVsKHBhcmVudCk7XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICAgIHRoaXMuVmlld3MgPSB2aWV3czsgLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gIH1cblxuICB1cGRhdGUocm91dGUsIGRhdGEpIHtcbiAgICBpZiAocm91dGUgIT09IHRoaXMucm91dGUpIHtcbiAgICAgIGNvbnN0IHZpZXdzID0gdGhpcy52aWV3cztcbiAgICAgIGNvbnN0IFZpZXcgPSB2aWV3c1tyb3V0ZV07XG5cbiAgICAgIHRoaXMucm91dGUgPSByb3V0ZTtcblxuICAgICAgaWYgKFZpZXcgJiYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlIHx8IFZpZXcuZWwgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgICAgICB0aGlzLnZpZXcgPSBWaWV3O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldyAmJiBuZXcgVmlldyh0aGlzLmluaXREYXRhLCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgc2V0Q2hpbGRyZW4odGhpcy5lbCwgW3RoaXMudmlld10pO1xuICAgIH1cbiAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEsIHJvdXRlKTtcbiAgfVxufVxuXG5jb25zdCBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcblxuZnVuY3Rpb24gc3ZnKHF1ZXJ5LCAuLi5hcmdzKSB7XG4gIGxldCBlbGVtZW50O1xuXG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgcXVlcnk7XG5cbiAgaWYgKHR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGNvbnN0IFF1ZXJ5ID0gcXVlcnk7XG4gICAgZWxlbWVudCA9IG5ldyBRdWVyeSguLi5hcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdCBsZWFzdCBvbmUgYXJndW1lbnQgcmVxdWlyZWRcIik7XG4gIH1cblxuICBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGdldEVsKGVsZW1lbnQpLCBhcmdzLCB0cnVlKTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuY29uc3QgcyA9IHN2Zztcblxuc3ZnLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZFN2ZyguLi5hcmdzKSB7XG4gIHJldHVybiBzdmcuYmluZCh0aGlzLCAuLi5hcmdzKTtcbn07XG5cbnN2Zy5ucyA9IG5zO1xuXG5mdW5jdGlvbiB2aWV3RmFjdG9yeSh2aWV3cywga2V5KSB7XG4gIGlmICghdmlld3MgfHwgdHlwZW9mIHZpZXdzICE9PSBcIm9iamVjdFwiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidmlld3MgbXVzdCBiZSBhbiBvYmplY3RcIik7XG4gIH1cbiAgaWYgKCFrZXkgfHwgdHlwZW9mIGtleSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImtleSBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiBmYWN0b3J5Vmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSkge1xuICAgIGNvbnN0IHZpZXdLZXkgPSBpdGVtW2tleV07XG4gICAgY29uc3QgVmlldyA9IHZpZXdzW3ZpZXdLZXldO1xuXG4gICAgaWYgKFZpZXcpIHtcbiAgICAgIHJldHVybiBuZXcgVmlldyhpbml0RGF0YSwgaXRlbSwgaSwgZGF0YSk7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGB2aWV3ICR7dmlld0tleX0gbm90IGZvdW5kYCk7XG4gIH07XG59XG5cbmV4cG9ydCB7IExpc3QsIExpc3RQb29sLCBQbGFjZSwgUm91dGVyLCBkaXNwYXRjaCwgZWwsIGgsIGh0bWwsIGxpc3QsIGxpc3RQb29sLCBtb3VudCwgcGxhY2UsIHJlZiwgcm91dGVyLCBzLCBzZXRBdHRyLCBzZXRDaGlsZHJlbiwgc2V0RGF0YSwgc2V0U3R5bGUsIHNldFhsaW5rLCBzdmcsIHRleHQsIHVubW91bnQsIHZpZXdGYWN0b3J5IH07XG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b24ge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9ICcnLFxyXG4gICAgICAgICAgICBpY29uID0gbnVsbCxcclxuICAgICAgICAgICAgdHlwZSA9ICdwcmltYXJ5JywgLy8gJ3ByaW1hcnknLCAnc2Vjb25kYXJ5J1xyXG4gICAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBvbkNsaWNrID0gKGUpID0+IHsgY29uc29sZS5sb2coXCJjbGlja2VkIGJ1dHRvblwiLCBlLnRhcmdldCk7IH0sXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgdGV4dCxcclxuICAgICAgICAgICAgaWNvbixcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgZGlzYWJsZWQsXHJcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBvbkNsaWNrLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBpY29uLCB0eXBlLCBkaXNhYmxlZCwgb25DbGljaywgY2xhc3NOYW1lIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YnV0dG9uIHRoaXM9J191aV9idXR0b24nIGNsYXNzTmFtZT17YGJ0biBidG4tJHt0eXBlfSAke2NsYXNzTmFtZX1gfVxyXG4gICAgICAgICAgICAgICAgb25jbGljaz17b25DbGlja30gZGlzYWJsZWQ9e2Rpc2FibGVkfT5cclxuICAgICAgICAgICAgICAgIHt0aGlzLl91aV9pY29uKGljb24pfVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gdGhpcz0nX3VpX3NwYW4nPnt0ZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfaWNvbiA9IChpY29uKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGljb24gPyA8aSBjbGFzc05hbWU9e2BiaSBiaS0ke2ljb259IG1lLTJgfT48L2k+IDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfc3Bpbm5lciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPSdzcGlubmVyLWJvcmRlciBzcGlubmVyLWJvcmRlci1zbSBtZS0yJyAvPlxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0X2xvYWRpbmcgPSAobG9hZGluZ0xhYmVsKSA9PiB7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IHRydWUsIHRleHQ6IGxvYWRpbmdMYWJlbCwgbG9hZGluZzogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmRfbG9hZGluZyA9IChsYWJlbCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IGZhbHNlLCB0ZXh0OiBsYWJlbCwgbG9hZGluZzogZmFsc2UgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLl9wcm9wLnRleHQsXHJcbiAgICAgICAgICAgIGljb24gPSB0aGlzLl9wcm9wLmljb24sXHJcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLl9wcm9wLnR5cGUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkID0gdGhpcy5fcHJvcC5kaXNhYmxlZCxcclxuICAgICAgICAgICAgbG9hZGluZyA9IHRoaXMuX3Byb3AubG9hZGluZyxcclxuICAgICAgICAgICAgb25DbGljayA9IHRoaXMuX3Byb3Aub25DbGljayxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gdGhpcy5fcHJvcC5jbGFzc05hbWVcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGxvYWRpbmcgIT09IHRoaXMuX3Byb3AubG9hZGluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRUb1JlbW92ZSA9IHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLnJlbW92ZUNoaWxkKGNoaWxkVG9SZW1vdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gbG9hZGluZyA/IHRoaXMuX3VpX3NwaW5uZXIoKSA6IHRoaXMuX3VpX2ljb24oaWNvbik7XHJcbiAgICAgICAgICAgIGNoaWxkICYmIHRoaXMuX3VpX2J1dHRvbi5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX3VpX3NwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaWNvbiAhPT0gdGhpcy5fcHJvcC5pY29uKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZFRvUmVtb3ZlID0gdGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91aV9idXR0b24ucmVtb3ZlQ2hpbGQoY2hpbGRUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLl91aV9pY29uKGljb24pO1xyXG4gICAgICAgICAgICBjaGlsZCAmJiB0aGlzLl91aV9idXR0b24uaW5zZXJ0QmVmb3JlKHRoaXMuX3VpX2ljb24oaWNvbiksIHRoaXMuX3VpX3NwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGV4dCAhPT0gdGhpcy5fcHJvcC50ZXh0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYW5Cb2R5ID0gPGRpdj57dGV4dH08L2Rpdj47XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX3NwYW4uaW5uZXJIVE1MID0gc3BhbkJvZHkuaW5uZXJIVE1MO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2xhc3NOYW1lICE9PSB0aGlzLl9wcm9wLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24uY2xhc3NOYW1lID0gYGJ0biBidG4tJHt0eXBlfSAke2NsYXNzTmFtZX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzYWJsZWQgIT09IHRoaXMuX3Byb3AuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvbkNsaWNrICE9PSB0aGlzLl9wcm9wLm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLm9uY2xpY2sgPSBvbkNsaWNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgLi4udGhpcy5fcHJvcCwgdGV4dCwgaWNvbiwgdHlwZSwgZGlzYWJsZWQsIGxvYWRpbmcsIG9uQ2xpY2ssIGNsYXNzTmFtZSB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9ICcnLFxyXG4gICAgICAgICAgICBocmVmID0gJycsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICB0ZXh0LFxyXG4gICAgICAgICAgICBocmVmXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBocmVmIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YSB0aGlzPSdfdWlfYScgaHJlZj17aHJlZn0+e3RleHR9PC9hPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLl9wcm9wLnRleHQsXHJcbiAgICAgICAgICAgIGhyZWYgPSB0aGlzLl9wcm9wLmhyZWZcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKHRleHQgIT09IHRoaXMuX3Byb3AudGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9hLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhyZWYgIT09IHRoaXMuX3Byb3AuaHJlZikge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9hLmhyZWYgPSBocmVmO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgLi4udGhpcy5fcHJvcCwgdGV4dCwgaHJlZiB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElucHV0IHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gJycsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gJycsXHJcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCcsXHJcbiAgICAgICAgICAgIGtleSA9ICd1bmRlZmluZWQnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgbGFiZWwsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBrZXlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFiZWwsIHBsYWNlaG9sZGVyLCB0eXBlLCBrZXkgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYmFzZS1pbnB1dC0ke2tleX1gO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgdGhpcz0nX3VpX2NvbnRhaW5lcic+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgdGhpcz0nX3VpX2xhYmVsJyBmb3I9e2lucHV0SWR9IGNsYXNzTmFtZT0nZm9ybS1sYWJlbCc+e2xhYmVsfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdGhpcz0nX3VpX2lucHV0JyB0eXBlPXt0eXBlfSBpZD17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWNvbnRyb2wnIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn0gLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgdGhpcz0nX3VpX2ludmFsaWRfZmVlZGJhY2snIGNsYXNzTmFtZT1cImludmFsaWQtZmVlZGJhY2tcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5fcHJvcC5sYWJlbCxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSB0aGlzLl9wcm9wLnBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICB0eXBlID0gdGhpcy5fcHJvcC50eXBlXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmIChsYWJlbCAhPT0gdGhpcy5fcHJvcC5sYWJlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9sYWJlbC50ZXh0Q29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGxhY2Vob2xkZXIgIT09IHRoaXMuX3Byb3AucGxhY2Vob2xkZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfaW5wdXQucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGUgIT09IHRoaXMuX3Byb3AudHlwZSkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9pbnB1dC50eXBlID0gdHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IC4uLnRoaXMucHJvcCwgbGFiZWwsIHBsYWNlaG9sZGVyLCB0eXBlIH07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0X3ZhbHVlID0gKCkgPT4gdGhpcy5fdWlfaW5wdXQudmFsdWU7XHJcblxyXG4gICAgaW52YWxpZGF0ZSA9ICh0ZXh0ID0gJycpID0+IHtcclxuICAgICAgICB0aGlzLl91aV9pbnZhbGlkX2ZlZWRiYWNrLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXQuc2V0Q3VzdG9tVmFsaWRpdHkoJ2VtcHR5Jyk7XHJcbiAgICAgICAgdGhpcy5fdWlfY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3dhcy12YWxpZGF0ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVJbnZhbGlkaXR5ID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3VpX2ludmFsaWRfZmVlZGJhY2suaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgdGhpcy5fdWlfY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcy12YWxpZGF0ZWQnKTtcclxuICAgICAgICB0aGlzLl91aV9pbnB1dC5zZXRDdXN0b21WYWxpZGl0eSgnJyk7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgJ3Rhc2tfbWFuYWdlcic6ICfQnNC10L3QtdC00LbQtdGAINC30LDQtNCw0YcnLFxyXG4gICAgJ2xvZ2luJzogJ9CS0YXQvtC0JyxcclxuICAgICdsb2FkaW5nJzogJ9CX0LDQs9GA0YPQt9C60LAnLFxyXG4gICAgJ2xvYWRpbmdfbl9zZWNvbmRzX2xlZnQnOiBuID0+IHtcclxuICAgICAgICBsZXQgc2Vjb25kUG9zdGZpeCA9ICcnO1xyXG4gICAgICAgIGxldCBsZWZ0UG9zdGZpeCA9ICfQvtGB0YwnO1xyXG4gICAgICAgIGNvbnN0IG5CZXR3ZWVuMTBhbmQyMCA9IG4gPiAxMCAmJiBuIDwgMjA7XHJcbiAgICAgICAgaWYgKG4gJSAxMCA9PT0gMSAmJiAhbkJldHdlZW4xMGFuZDIwKSB7XHJcbiAgICAgICAgICAgIHNlY29uZFBvc3RmaXggPSAn0LAnO1xyXG4gICAgICAgICAgICBsZWZ0UG9zdGZpeCA9ICfQsNGB0YwnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChbMiwgMywgNF0uaW5jbHVkZXMobiAlIDEwKSAmJiAhbkJldHdlZW4xMGFuZDIwKSB7XHJcbiAgICAgICAgICAgIHNlY29uZFBvc3RmaXggPSAn0YsnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGDQl9Cw0LPRgNGD0LfQutCwLi4uICjQntGB0YLQsNC7JHtsZWZ0UG9zdGZpeH0gJHtufSDRgdC10LrRg9C90LQke3NlY29uZFBvc3RmaXh9KWA7XHJcbiAgICB9LFxyXG4gICAgJ2VtYWlsJzogJ0UtbWFpbCcsXHJcbiAgICAnc29tZWJvZHlfZW1haWwnOiAnc29tZWJvZHlAZ21haWwuY29tJyxcclxuICAgICdlbnRlcl9ub25lbXB0eV9sb2dpbic6ICfQktCy0LXQtNC40YLQtSDQvdC10L/Rg9GB0YLQvtC5IGUtbWFpbCcsXHJcbiAgICAnZW50ZXJfbm9uZW1wdHlfcGFzc3dvcmQnOiAn0JLQstC10LTQuNGC0LUg0L3QtdC/0YPRgdGC0L7QuSDQv9Cw0YDQvtC70YwnLFxyXG4gICAgJ3dyb25nX2xvZ2luX29yX3B3ZCc6ICfQndC10LLQtdGA0L3Ri9C5INC70L7Qs9C40L0g0LjQu9C4INC/0LDRgNC+0LvRjCcsXHJcbiAgICAncGFzc3dvcmRzX2FyZV9ub3RfZXF1YWwnOiAn0J/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCJyxcclxuICAgICdsb2dpbl9hbHJlYWR5X3JlZ2lzdGVyZWQnOiAn0KLQsNC60L7QuSDQu9C+0LPQuNC9INGD0LbQtSDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0L0nLFxyXG4gICAgJ3Bhc3N3b3JkJzogJ9Cf0LDRgNC+0LvRjCcsXHJcbiAgICAndG9fbG9naW4nOiAn0JLQvtC50YLQuCcsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAn0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPJyxcclxuICAgICdub19hY2NvdW50X3F1ZXN0aW9uJzogJ9Cd0LXRgiDQsNC60LrQsNGD0L3RgtCwPycsXHJcbiAgICAndG9fbG9nX291dCc6ICfQktGL0LnRgtC4JyxcclxuICAgICdyZWdpc3RyYXRpb24nOiAn0KDQtdCz0LjRgdGC0YDQsNGG0LjRjycsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ9Cf0L7QstGC0L7RgNC40YLQtSDQv9Cw0YDQvtC70YwnLFxyXG4gICAgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJzogJ9Cj0LbQtSDQtdGB0YLRjCDQsNC60LrQsNGD0L3Rgj8nLFxyXG4gICAgJ2VkaXRpbmcnOiAn0KDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtScsXHJcbiAgICAndGFza19uYW1lJzogJ9Cd0LDQt9Cy0LDQvdC40LUg0LfQsNC00LDRh9C4JyxcclxuICAgICdteV90YXNrJzogJ9Cc0L7RjyDQt9Cw0LTQsNGH0LAnLFxyXG4gICAgJ2RlYWRsaW5lJzogJ9CU0LXQtNC70LDQudC9JyxcclxuICAgICdpbXBvcnRhbnRfdGFzayc6ICfQktCw0LbQvdCw0Y8g0LfQsNC00LDRh9CwJyxcclxuICAgICdjYW5jZWwnOiAn0J7RgtC80LXQvdCwJyxcclxuICAgICd0b19zYXZlJzogJ9Ch0L7RhdGA0LDQvdC40YLRjCcsXHJcbiAgICAncnUnOiAn0KDRg9GB0YHQutC40LknLFxyXG4gICAgJ2VuJzogJ9CQ0L3Qs9C70LjQudGB0LrQuNC5J1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAndGFza19tYW5hZ2VyJzogJ1Rhc2sgbWFuYWdlcicsXHJcbiAgICAnbG9naW4nOiAnTG9naW4nLFxyXG4gICAgJ2xvYWRpbmcnOiAnTG9hZGluZycsXHJcbiAgICAnbG9hZGluZ19uX3NlY29uZHNfbGVmdCc6IG4gPT4gYExvYWRpbmcuLi4gKCR7bn0gc2Vjb25kJHtuICUgMTAgPT09IDEgPyAnJyA6ICdzJ30gbGVmdClgLFxyXG4gICAgJ2VtYWlsJzogJ0UtbWFpbCcsXHJcbiAgICAnc29tZWJvZHlfZW1haWwnOiAnc29tZWJvZHlAZ21haWwuY29tJyxcclxuICAgICdlbnRlcl9ub25lbXB0eV9sb2dpbic6ICdFbnRlciBub24tZW1wdHkgZS1tYWlsJyxcclxuICAgICdlbnRlcl9ub25lbXB0eV9wYXNzd29yZCc6ICdFbnRlciBub24tZW1wdHkgcGFzc3dvcmQnLFxyXG4gICAgJ3dyb25nX2xvZ2luX29yX3B3ZCc6ICdXcm9uZyBsb2dpbiBvciBwYXNzd29yZCcsXHJcbiAgICAncGFzc3dvcmRzX2FyZV9ub3RfZXF1YWwnOiAnUGFzc3dvcmRzIGFyZSBub3QgZXF1YWwnLFxyXG4gICAgJ2xvZ2luX2FscmVhZHlfcmVnaXN0ZXJlZCc6ICdTdWNoIGxvZ2luIGFscmVhZHkgcmVnaXN0ZXJlZCcsXHJcbiAgICAncGFzc3dvcmQnOiAnUGFzc3dvcmQnLFxyXG4gICAgJ3RvX2xvZ2luJzogJ0xvZyBpbicsXHJcbiAgICAndG9fcmVnaXN0ZXInOiAnUmVnaXN0ZXInLFxyXG4gICAgJ25vX2FjY291bnRfcXVlc3Rpb24nOiAnTm8gYWNjb3VudD8nLFxyXG4gICAgJ3RvX2xvZ19vdXQnOiAnTG9nIG91dCcsXHJcbiAgICAncmVnaXN0cmF0aW9uJzogJ1JlZ2lzdHJhdGlvbicsXHJcbiAgICAncmVwZWF0X3Bhc3N3b3JkJzogJ1JlcGVhdCBwYXNzd29yZCcsXHJcbiAgICAnYWxyZWFkeV9oYXZlX2FjY291bnRfcXVlc3Rpb24nOiAnSGF2ZSBnb3QgYW4gYWNjb3VudD8nLFxyXG4gICAgJ2VkaXRpbmcnOiAnRWRpdGluZycsXHJcbiAgICAndGFza19uYW1lJzogJ1Rhc2sgbmFtZScsXHJcbiAgICAnbXlfdGFzayc6ICdNeSB0YXNrJyxcclxuICAgICdkZWFkbGluZSc6ICdEZWFkbGluZScsXHJcbiAgICAnaW1wb3J0YW50X3Rhc2snOiAnSW1wb3J0YW50IHRhc2snLFxyXG4gICAgJ2NhbmNlbCc6ICdDYW5jZWwnLFxyXG4gICAgJ3RvX3NhdmUnOiAnU2F2ZScsXHJcbiAgICAncnUnOiAnUnVzc2lhbicsXHJcbiAgICAnZW4nOiAnRW5nbGlzaCcsXHJcbn07XHJcbiIsImltcG9ydCBSVSBmcm9tICcuL3Q5bi5ydSc7XHJcbmltcG9ydCBFTiBmcm9tICcuL3Q5bi5lbic7XHJcblxyXG5mdW5jdGlvbiB1c2VUYWcoaHRtbEVsLCB0YWcpIHtcclxuICAgIGxldCByZXN1bHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICBpZiAodHlwZW9mIGh0bWxFbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXN1bHQuaW5uZXJIVE1MID0gaHRtbEVsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQuYXBwZW5kQ2hpbGQoaHRtbEVsKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVzZVRhZ3MoaHRtbEVsLCB0YWdzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gaHRtbEVsO1xyXG4gICAgdGFncy5mb3JFYWNoKHRhZyA9PiByZXN1bHQgPSB1c2VUYWcocmVzdWx0LCB0YWcpKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChsYW5kSWQsIGNvZGUsIHRhZywgLi4uYXJncykgPT4ge1xyXG4gICAgaWYgKGNvZGUgPT0gbnVsbCB8fCBjb2RlLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnO1xyXG5cclxuICAgIGlmICghWydydScsICdlbiddLmluY2x1ZGVzKGxhbmRJZCkpIHtcclxuICAgICAgICBsYW5kSWQgPSAncnUnO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXN1bHQgPSBjb2RlO1xyXG5cclxuICAgIGlmIChsYW5kSWQgPT09ICdydScgJiYgUlVbY29kZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBSVVtjb2RlXTtcclxuICAgIH1cclxuICAgIGlmIChsYW5kSWQgPT09ICdlbicgJiYgRU5bY29kZV0pIHtcclxuICAgICAgICByZXN1bHQgPSBFTltjb2RlXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCguLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFnKSB7XHJcbiAgICAgICAgaWYgKHRhZyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVzZVRhZ3MocmVzdWx0LCB0YWcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHVzZVRhZyhyZXN1bHQsIHRhZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBsYW5nSWQ6ICdsYW5nSWQnLFxyXG4gICAgdG9rZW46ICd0b2tlbidcclxufSk7XHJcbiIsImltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tIFwiLi9sb2NhbFN0b3JhZ2VJdGVtc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRMYW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMubGFuZ0lkKSA/PyAncnUnO1xyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9hdG9tL2lucHV0JztcclxuaW1wb3J0IHQ5biBmcm9tICcuLi91dGlscy90OW4vaW5kZXgnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dpbkFuZFBhc3NGb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWItMyc+XHJcbiAgICAgICAgICAgICAgICAgICAgPElucHV0IHRoaXM9J191aV9pbnB1dF9lbWFpbCcgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ2VtYWlsJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3Q5bihkZWZhdWx0TGFuZywgJ3NvbWVib2R5X2VtYWlsJyl9IGtleT1cImUtbWFpbFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfcHdkJyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAncGFzc3dvcmQnKX0gcGxhY2Vob2xkZXI9JyoqKioqKioqJyB0eXBlPSdwYXNzd29yZCcga2V5PVwicHdkXCIvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGUgPSAobGFuZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxvZ2luID0gdGhpcy5nZXRfbG9naW4oKTtcclxuICAgICAgICBjb25zdCBwYXNzd29yZCA9IHRoaXMuZ2V0X3Bhc3N3b3JkKCk7XHJcblxyXG4gICAgICAgIGxldCB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGxvZ2luLnRyaW0oKSA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlTG9naW4oXHJcbiAgICAgICAgICAgICAgICB0OW4obGFuZywgJ2VudGVyX25vbmVtcHR5X2xvZ2luJylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUludmFsaWRpdHlPZkxvZ2luKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFzc3dvcmQudHJpbSgpID09PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGVQYXNzd29yZChcclxuICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAnZW50ZXJfbm9uZW1wdHlfcGFzc3dvcmQnKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW52YWxpZGl0eU9mUGFzc3dvcmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWxpZDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfZW1haWwudXBkYXRlKHtcclxuICAgICAgICAgICAgbGFiZWw6IHQ5bihsYW5nLCAnZW1haWwnKSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHQ5bihsYW5nLCAnc29tZWJvZHlfZW1haWwnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2lucHV0X3B3ZC51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdwYXNzd29yZCcpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZUludmFsaWRpdHlPZkxvZ2luKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVJbnZhbGlkaXR5T2ZQYXNzd29yZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldF9sb2dpbiA9ICgpID0+IHRoaXMuX3VpX2lucHV0X2VtYWlsLmdldF92YWx1ZSgpO1xyXG5cclxuICAgIGdldF9wYXNzd29yZCA9ICgpID0+IHRoaXMuX3VpX2lucHV0X3B3ZC5nZXRfdmFsdWUoKTtcclxuXHJcbiAgICBpbnZhbGlkYXRlTG9naW4gPSAodGV4dCA9ICcnKSA9PiB0aGlzLl91aV9pbnB1dF9lbWFpbC5pbnZhbGlkYXRlKHRleHQpO1xyXG5cclxuICAgIHJlbW92ZUludmFsaWRpdHlPZkxvZ2luID0gKCkgPT4gdGhpcy5fdWlfaW5wdXRfZW1haWwucmVtb3ZlSW52YWxpZGl0eSgpO1xyXG5cclxuICAgIGludmFsaWRhdGVQYXNzd29yZCA9ICh0ZXh0ID0gJycpID0+IHRoaXMuX3VpX2lucHV0X3B3ZC5pbnZhbGlkYXRlKHRleHQpO1xyXG5cclxuICAgIHJlbW92ZUludmFsaWRpdHlPZlBhc3N3b3JkPSAoKSA9PiB0aGlzLl91aV9pbnB1dF9wd2QucmVtb3ZlSW52YWxpZGl0eSgpO1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgb2s6ICdvaycsXHJcbiAgICBmYWlsZWQ6ICdmYWlsZWQnLFxyXG4gICAgZXJyb3I6ICdlcnJvcidcclxufSk7XHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgbm90Rm91bmQ6ICdub3RfZm91bmQnLFxyXG59KTtcclxuIiwiaW1wb3J0IHJlc3BvbnNlU3RhdHVzIGZyb20gXCIuL3N0YXR1c1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luKGJvZHkpIHtcclxuICAgIGNvbnN0IHsgbG9naW4sIHBhc3N3b3JkIH0gPSBib2R5O1xyXG5cclxuICAgIGlmIChsb2dpbi50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5TG9naW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwYXNzd29yZC50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5UHdkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobG9naW4gIT09ICdhZG1pbicgfHwgcGFzc3dvcmQgIT09ICdhZG1pbicpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLmZhaWxlZCxcclxuICAgICAgICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3Iud3JvbmdMb2dpbk9yUHdkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLm9rLFxyXG4gICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICB0b2tlbjogJ2FiY2RlJyxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBlcnJvciA9IE9iamVjdC5mcmVlemUoe1xyXG4gICAgd3JvbmdMb2dpbk9yUHdkOiAnd3JvbmdfbG9naW5fb3JfcHdkJyxcclxuICAgIGVtcHR5TG9naW46ICdlbXB0eV9sb2dpbicsXHJcbiAgICBlbXB0eVB3ZDogJ2VtcHR5X3B3ZCcsXHJcbn0pO1xyXG4iLCJpbXBvcnQgcmVzcG9uc2VTdGF0dXMgZnJvbSBcIi4vc3RhdHVzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoYm9keSkge1xyXG4gICAgY29uc3QgeyBsb2dpbiwgcGFzc3dvcmQsIHBhc3N3b3JkUmVwZWF0IH0gPSBib2R5O1xyXG5cclxuICAgIGlmIChsb2dpbi50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5TG9naW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwYXNzd29yZC50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5UHdkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAocGFzc3dvcmRSZXBlYXQudHJpbSgpID09PSAnJykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2VTdGF0dXMuZmFpbGVkLFxyXG4gICAgICAgICAgICBkZXRhaWw6IHtcclxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvci5lbXB0eVB3ZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGxvZ2luID09PSAnYWRtaW4nKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmxvZ2luQWxyZWFkeVJlZ2lzdGVyZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXR1czogcmVzcG9uc2VTdGF0dXMub2ssXHJcbiAgICAgICAgZGV0YWlsOiB7IH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGVycm9yID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBlbXB0eUxvZ2luOiAnZW1wdHlfbG9naW4nLFxyXG4gICAgZW1wdHlQd2Q6ICdlbXB0eV9wd2QnLFxyXG4gICAgZW1wdHlQd2RSZXBlYXQ6ICdlbXB0eV9wd2RfcmVwZWF0JyxcclxuICAgIGxvZ2luQWxyZWFkeVJlZ2lzdGVyZWQ6ICdsb2dpbl9hbHJlYWR5X3JlZ2lzdGVyZWQnXHJcbn0pO1xyXG4iLCJpbXBvcnQgcmVzcG9uc2VTdGF0dXMgZnJvbSAnLi9zdGF0dXMnO1xyXG5pbXBvcnQgZXJyb3IgZnJvbSAnLi9lcnJvcic7XHJcbmltcG9ydCB7IGxvZ2luIH0gZnJvbSAnLi9sb2dpbic7XHJcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnLi9yZWdpc3Rlcic7XHJcblxyXG5jb25zdCBkZWZhdWx0UGVuZGluZ01zID0gMjAwMDtcclxuXHJcbmZ1bmN0aW9uIGZha2VfcGVuZGluZyhtcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBmYWtlX2ZldGNoKHVybCwgYm9keSwgZGVzaXJlZFJlc3BvbnNlKSB7XHJcbiAgICBhd2FpdCBmYWtlX3BlbmRpbmcoZGVmYXVsdFBlbmRpbmdNcyk7XHJcbiAgICBpZiAoZGVzaXJlZFJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlc2lyZWRSZXNwb25zZTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2godXJsKSB7XHJcbiAgICAgICAgY2FzZSAnL2FwaS92MS9sb2dpbic6XHJcbiAgICAgICAgICAgIHJldHVybiBsb2dpbihib2R5KTtcclxuICAgICAgICBjYXNlICcvYXBpL3YxL3JlZ2lzdGVyJzpcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdGVyKGJvZHkpXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2VTdGF0dXMuZmFpbGVkLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLm5vdEZvdW5kXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vYXRvbS9idXR0b24nO1xyXG5pbXBvcnQgTGluayBmcm9tICcuLi9hdG9tL2xpbmsnO1xyXG5pbXBvcnQgTG9naW5BbmRQYXNzRm9ybSBmcm9tICcuL2xvZ2luQW5kUGFzc0Zvcm0nO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCB7IGRlZmF1bHRMYW5nIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzJztcclxuaW1wb3J0IGZha2VfZmV0Y2ggZnJvbSAnLi4vYXBpL2luZGV4JztcclxuaW1wb3J0IHJlc3BvbnNlU3RhdHVzIGZyb20gJy4uL2FwaS9zdGF0dXMnO1xyXG5pbXBvcnQgbG9jYWxTdG9yYWdlSXRlbXMgZnJvbSAnLi4vdXRpbHMvbG9jYWxTdG9yYWdlSXRlbXMnO1xyXG5pbXBvcnQgeyBlcnJvciBhcyBsb2dpbkVycm9yIH0gZnJvbSAnLi4vYXBpL2xvZ2luJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2luRm9ybSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8TG9naW5BbmRQYXNzRm9ybSB0aGlzPSdfdWlfbG9naW5fYW5kX3Bhc3NfZm9ybScgLz5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm15LTIgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNtYWxsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gdGhpcz0nX3VpX3NwYW4nPnt0OW4oZGVmYXVsdExhbmcsICdub19hY2NvdW50X3F1ZXN0aW9uJyl9PC9zcGFuPiZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdGhpcz0nX3VpX2xpbmsnIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX3JlZ2lzdGVyJyl9IGhyZWY9Jy4vcmVnaXN0ZXIuaHRtbCcgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RleHQtY2VudGVyJz5cclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idXR0b24nIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX2xvZ2luJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX2dldF9vbl9idG5fY2xpY2soZGVmYXVsdExhbmcpfSBjbGFzc05hbWU9J3ctMTAwJyB0eXBlPSdwcmltYXJ5JyAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgX2dldF9vbl9idG5fY2xpY2sgPSAobGFuZykgPT4ge1xyXG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsaWRhdGUobGFuZykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbG9naW4gPSB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLmdldF9sb2dpbigpO1xyXG4gICAgICAgICAgICBjb25zdCBwYXNzd29yZCA9IHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0uZ2V0X3Bhc3N3b3JkKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24uc3RhcnRfbG9hZGluZyhcclxuICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAnbG9hZGluZycsICdlbScpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmFrZV9mZXRjaCgnL2FwaS92MS9sb2dpbicsIHsgbG9naW4sIHBhc3N3b3JkIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24uZW5kX2xvYWRpbmcoXHJcbiAgICAgICAgICAgICAgICB0OW4obGFuZywgJ3RvX2xvZ2luJylcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkZXRhaWwgfSA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSByZXNwb25zZVN0YXR1cy5vaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyB0b2tlbiB9ID0gZGV0YWlsXHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShsb2NhbFN0b3JhZ2VJdGVtcy50b2tlbiwgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9lZGl0Lmh0bWwnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyBlcnJvciB9ID0gZGV0YWlsO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgbG9naW5FcnJvci5lbXB0eUxvZ2luOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLmludmFsaWRhdGVMb2dpbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAnZW50ZXJfbm9uZW1wdHlfbG9naW4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLnJlbW92ZUludmFsaWRpdHlPZlBhc3N3b3JkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgbG9naW5FcnJvci5lbXB0eVB3ZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS5pbnZhbGlkYXRlUGFzc3dvcmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0OW4obGFuZywgJ2VudGVyX25vbmVtcHR5X3Bhc3N3b3JkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS5yZW1vdmVJbnZhbGlkaXR5T2ZMb2dpbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGxvZ2luRXJyb3Iud3JvbmdMb2dpbk9yUHdkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLmludmFsaWRhdGVMb2dpbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLmludmFsaWRhdGVQYXNzd29yZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAnd3JvbmdfbG9naW5fb3JfcHdkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3ZhbGlkYXRlID0gKGxhbmcpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS52YWxpZGF0ZShsYW5nKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfbGluay51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX3JlZ2lzdGVyJyksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fdWlfc3Bhbi50ZXh0Q29udGVudCA9IHQ5bihsYW5nLCAnbm9fYWNjb3VudF9xdWVzdGlvbicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX2xvZ2luJyksXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuX2dldF9vbl9idG5fY2xpY2sobGFuZylcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Qge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ09wdGlvbiAxJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ29wdGlvbjEnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHZhbHVlID0gJ29wdGlvbjEnLFxyXG4gICAgICAgICAgICBvbkNoYW5nZSA9ICh2YWx1ZSkgPT4geyBjb25zb2xlLmxvZyh2YWx1ZSkgfSxcclxuICAgICAgICB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMsXHJcbiAgICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgICBvbkNoYW5nZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgb3B0aW9ucywgdmFsdWUsIG9uQ2hhbmdlIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9vcHRpb25zID0gW107XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlbGVjdCB0aGlzPSdfdWlfc2VsZWN0JyBjbGFzc05hbWU9J2Zvcm0tc2VsZWN0JyBvbmNoYW5nZT17ZSA9PiBvbkNoYW5nZShlLnRhcmdldC52YWx1ZSl9PlxyXG4gICAgICAgICAgICAgICAge29wdGlvbnMubWFwKG9wdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdWlPcHQgPSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uLnZhbHVlfSBzZWxlY3RlZD17dmFsdWUgPT09IG9wdGlvbi52YWx1ZX0+e29wdGlvbi5sYWJlbH08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9vcHRpb25zLnB1c2godWlPcHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1aU9wdDtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlTGFiZWxzID0gKGxhYmVscykgPT4ge1xyXG4gICAgICAgIGlmIChsYWJlbHMubGVuZ3RoICE9PSB0aGlzLl9wcm9wLm9wdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byB1cGRhdGUgc2VsZWN0XFwncyBvcHRpb25zIGxhYmVscyFcXFxyXG4gICAgICAgICAgICAgICAgIExhYmVscyBhcnJheSBpcyBpbmNvbXBhdGlibGUgd2l0aCBzZWxlY3RcXCcgb3B0aW9ucyBhcnJheS4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdWlfb3B0aW9ucy5mb3JFYWNoKCh1aU9wdGlvbiwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgdWlPcHRpb24uaW5uZXJIVE1MID0gbGFiZWxzW2luZGV4XTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJjbGFzcyBFdmVudE1hbmFnZXIge1xyXG4gICAgX2V2ZW50TGlzdCA9IHt9O1xyXG5cclxuICAgIC8vIHtcclxuICAgIC8vICAgICAnZXZlbnQxJzogW1xyXG4gICAgLy8gICAgICAgICBmMSxcclxuICAgIC8vICAgICAgICAgZjJcclxuICAgIC8vICAgICBdLFxyXG4gICAgLy8gICAgICdldmVudDInOiBbXHJcbiAgICAvLyAgICAgICAgIGYzXHJcbiAgICAvLyAgICAgXVxyXG4gICAgLy8gfVxyXG5cclxuICAgIHN1YnNjcmliZSA9IChuYW1lLCBsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fZXZlbnRMaXN0W25hbWVdID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BhdGNoID0gKG5hbWUsIGFyZ3MgPSB7fSkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudExpc3QuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMaXN0W25hbWVdLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcihhcmdzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgbGV0IGNvbW1vbkV2ZW50TWFuYWdlciA9IG5ldyBFdmVudE1hbmFnZXIoKTsgLy8gc2luZ2xldG9uXHJcbmV4cG9ydCB7IEV2ZW50TWFuYWdlciB9OyAvLyBjbGFzc1xyXG4iLCJleHBvcnQgZGVmYXVsdCBPYmplY3QuZnJlZXplKHtcclxuICAgIGNoYW5nZUxhbmc6ICdjaGFuZ2VMYW5nJ1xyXG59KTtcclxuIiwiaW1wb3J0IFNlbGVjdCBmcm9tIFwiLi4vYXRvbS9zZWxlY3RcIjtcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tIFwiLi4vdXRpbHMvY29uc3RhbnRzXCI7XHJcbmltcG9ydCB7IGNvbW1vbkV2ZW50TWFuYWdlciB9IGZyb20gXCIuLi91dGlscy9ldmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi4vdXRpbHMvZXZlbnRzXCI7XHJcbmltcG9ydCB0OW4gZnJvbSBcIi4uL3V0aWxzL3Q5bi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VsZWN0TGFuZyB7XHJcbiAgICBfbGFuZ0lkcyA9IFsncnUnLCAnZW4nXTtcclxuICAgIF9sYW5nVDluS2V5cyA9IFsncnUnLCAnZW4nXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2xhbmdMYWJlbHMgPSAobGFuZ0lkKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmdUOW5LZXlzLm1hcCh0OW5LZXkgPT4gdDluKGxhbmdJZCwgdDluS2V5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLl9sYW5nTGFiZWxzKGRlZmF1bHRMYW5nKTtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fbGFuZ0lkcy5tYXAoKGxhbmdJZCwgaW5kZXgpID0+ICh7XHJcbiAgICAgICAgICAgIHZhbHVlOiBsYW5nSWQsXHJcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbHNbaW5kZXhdXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8U2VsZWN0IHRoaXM9J191aV9zZWxlY3QnIG9wdGlvbnM9e29wdGlvbnN9IHZhbHVlPXtkZWZhdWx0TGFuZ30gXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17bGFuZ0lkID0+IGNvbW1vbkV2ZW50TWFuYWdlci5kaXNwYXRjaChldmVudHMuY2hhbmdlTGFuZywgbGFuZ0lkKX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcbiAgICAgICAgY29uc3QgbGFiZWxzID0gdGhpcy5fbGFuZ0xhYmVscyhsYW5nKTtcclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlTGFiZWxzKGxhYmVscyk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2F0b20vYnV0dG9uJztcclxuaW1wb3J0IFNlbGVjdExhbmcgZnJvbSAnLi9zZWxlY3RMYW5nJztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuLi91dGlscy9jb25zdGFudHMnO1xyXG5pbXBvcnQgdDluIGZyb20gJy4uL3V0aWxzL3Q5bi9pbmRleCc7XHJcbmltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tICcuLi91dGlscy9sb2NhbFN0b3JhZ2VJdGVtcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCA9IGZhbHNlIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgYXV0aG9yaXplZCB9O1xyXG5cclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMSB0aGlzPSdfdWlfaDEnIGNsYXNzTmFtZT0nbWUtNSc+e3Q5bihkZWZhdWx0TGFuZywgJ3Rhc2tfbWFuYWdlcicpfTwvaDE+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxTZWxlY3RMYW5nIHRoaXM9J191aV9zZWxlY3QnIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHsgYXV0aG9yaXplZCAmJiBcclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idG4nIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9J21zLWF1dG8nIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX2xvZ19vdXQnKX0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0obG9jYWxTdG9yYWdlSXRlbXMudG9rZW4pOyB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2xvZ2luLmh0bWwnIH19Lz4gfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7IFxyXG5cclxuICAgICAgICB0aGlzLl91aV9zZWxlY3QudXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3VpX2gxLnRleHRDb250ZW50ID0gdDluKGxhbmcsICd0YXNrX21hbmFnZXInKTtcclxuICAgICAgICB0aGlzLl91aV9idG4gJiYgdGhpcy5fdWlfYnRuLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fbG9nX291dCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgY29tbW9uRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4vZXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSBcIi4vZXZlbnRzXCI7XHJcbmltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tIFwiLi9sb2NhbFN0b3JhZ2VJdGVtc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gICAgY29uc3RydWN0b3IoZXZlbnRNYW5hZ2VyID0gY29tbW9uRXZlbnRNYW5hZ2VyKSB7XHJcbiAgICAgICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShldmVudHMuY2hhbmdlTGFuZywgbGFuZyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHsgbGFuZyB9KTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMubGFuZ0lkLCBsYW5nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi4vd2lkZ2V0L2hlYWRlcic7XHJcbmltcG9ydCBMb2NhbGl6ZWRQYWdlIGZyb20gJy4vbG9jYWxpemVkUGFnZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaXRoSGVhZGVyIGV4dGVuZHMgTG9jYWxpemVkUGFnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBlbGVtKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkID0gZmFsc2UgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBhdXRob3JpemVkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfZWxlbSA9IGVsZW07XHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXBwLWJvZHknPlxyXG4gICAgICAgICAgICAgICAgPEhlYWRlciB0aGlzPSdfdWlfaGVhZGVyJyBhdXRob3JpemVkPXthdXRob3JpemVkfSAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbnRhaW5lciBjZW50ZXJlZCc+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMuX3VpX2VsZW19XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuX3VpX2hlYWRlci51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfZWxlbS51cGRhdGUoZGF0YSk7XHJcbiAgICB9XHJcbn07XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IExvZ2luRm9ybSBmcm9tICcuL3dpZGdldC9sb2dpbkZvcm0nO1xyXG5pbXBvcnQgdDluIGZyb20gJy4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCBXaXRoSGVhZGVyIGZyb20gJy4vdXRpbHMvd2l0aEhlYWRlcic7XHJcbmltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tICcuL3V0aWxzL2xvY2FsU3RvcmFnZUl0ZW1zJztcclxuXHJcbmNsYXNzIExvZ2luUGFnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyLW1kJz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi0zJz5cclxuICAgICAgICAgICAgICAgICAgICA8aDEgdGhpcz1cIl91aV9oMVwiIGNsYXNzTmFtZT0ndGV4dC1jZW50ZXInPnt0OW4oZGVmYXVsdExhbmcsICdsb2dpbicpfTwvaDE+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxMb2dpbkZvcm0gdGhpcz1cIl91aV9sb2dpbl9mb3JtXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyA9IGRlZmF1bHRMYW5nIH0gPSBkYXRhO1xyXG5cclxuICAgICAgICB0aGlzLl91aV9oMS50ZXh0Q29udGVudCA9IHQ5bihsYW5nLCAnbG9naW4nKTtcclxuICAgICAgICB0aGlzLl91aV9sb2dpbl9mb3JtLnVwZGF0ZShkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBvbm1vdW50ID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMudG9rZW4pO1xyXG4gICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2VkaXQuaHRtbCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb3VudChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSxcclxuICAgIDxXaXRoSGVhZGVyPlxyXG4gICAgICAgIDxMb2dpblBhZ2UgLz5cclxuICAgIDwvV2l0aEhlYWRlcj5cclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiQnV0dG9uIiwiX2NyZWF0ZUNsYXNzIiwiX3RoaXMiLCJzZXR0aW5ncyIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIl9jbGFzc0NhbGxDaGVjayIsIl9kZWZpbmVQcm9wZXJ0eSIsIl90aGlzJF9wcm9wIiwiX3Byb3AiLCJpY29uIiwiZGlzYWJsZWQiLCJvbkNsaWNrIiwiY29uY2F0Iiwib25jbGljayIsIl91aV9pY29uIiwibG9hZGluZ0xhYmVsIiwidXBkYXRlIiwibG9hZGluZyIsImxhYmVsIiwiZGF0YSIsIl9kYXRhJHRleHQiLCJfZGF0YSRpY29uIiwiX2RhdGEkdHlwZSIsIl9kYXRhJGRpc2FibGVkIiwiX2RhdGEkbG9hZGluZyIsIl9kYXRhJG9uQ2xpY2siLCJfZGF0YSRjbGFzc05hbWUiLCJfdWlfYnV0dG9uIiwiY2hpbGROb2RlcyIsImNoaWxkVG9SZW1vdmUiLCJyZW1vdmVDaGlsZCIsIl91aV9zcGlubmVyIiwiaW5zZXJ0QmVmb3JlIiwiX3VpX3NwYW4iLCJzcGFuQm9keSIsImlubmVySFRNTCIsIl9vYmplY3RTcHJlYWQiLCJfc2V0dGluZ3MkdGV4dCIsIl9zZXR0aW5ncyRpY29uIiwiX3NldHRpbmdzJHR5cGUiLCJfc2V0dGluZ3MkZGlzYWJsZWQiLCJfc2V0dGluZ3Mkb25DbGljayIsImUiLCJjb25zb2xlIiwibG9nIiwidGFyZ2V0IiwiX3NldHRpbmdzJGNsYXNzTmFtZSIsIl91aV9yZW5kZXIiLCJMaW5rIiwiaHJlZiIsIl9kYXRhJGhyZWYiLCJfdWlfYSIsInRleHRDb250ZW50IiwiX3NldHRpbmdzJGhyZWYiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwiaW5wdXRJZCIsIl9kYXRhJGxhYmVsIiwiX2RhdGEkcGxhY2Vob2xkZXIiLCJfdWlfbGFiZWwiLCJfdWlfaW5wdXQiLCJwcm9wIiwiX3VpX2ludmFsaWRfZmVlZGJhY2siLCJzZXRDdXN0b21WYWxpZGl0eSIsIl91aV9jb250YWluZXIiLCJyZW1vdmUiLCJfc2V0dGluZ3MkbGFiZWwiLCJfc2V0dGluZ3MkcGxhY2Vob2xkZXIiLCJfc2V0dGluZ3Mka2V5IiwibG9hZGluZ19uX3NlY29uZHNfbGVmdCIsIm4iLCJzZWNvbmRQb3N0Zml4IiwibGVmdFBvc3RmaXgiLCJuQmV0d2VlbjEwYW5kMjAiLCJpbmNsdWRlcyIsInVzZVRhZyIsImh0bWxFbCIsInJlc3VsdCIsInVzZVRhZ3MiLCJ0YWdzIiwiZm9yRWFjaCIsImxhbmRJZCIsImNvZGUiLCJSVSIsIkVOIiwiX2xlbiIsIkFycmF5IiwiX2tleSIsImFwcGx5IiwiT2JqZWN0IiwiZnJlZXplIiwibGFuZ0lkIiwidG9rZW4iLCJkZWZhdWx0TGFuZyIsIl9sb2NhbFN0b3JhZ2UkZ2V0SXRlbSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJsb2NhbFN0b3JhZ2VJdGVtcyIsIkxvZ2luQW5kUGFzc0Zvcm0iLCJ0OW4iLCJsYW5nIiwibG9naW4iLCJnZXRfbG9naW4iLCJwYXNzd29yZCIsImdldF9wYXNzd29yZCIsInZhbGlkIiwiaW52YWxpZGF0ZUxvZ2luIiwicmVtb3ZlSW52YWxpZGl0eU9mTG9naW4iLCJpbnZhbGlkYXRlUGFzc3dvcmQiLCJyZW1vdmVJbnZhbGlkaXR5T2ZQYXNzd29yZCIsIl91aV9pbnB1dF9lbWFpbCIsIl91aV9pbnB1dF9wd2QiLCJnZXRfdmFsdWUiLCJpbnZhbGlkYXRlIiwicmVtb3ZlSW52YWxpZGl0eSIsIm9rIiwiZmFpbGVkIiwiZXJyb3IiLCJub3RGb3VuZCIsImJvZHkiLCJzdGF0dXMiLCJyZXNwb25zZVN0YXR1cyIsImRldGFpbCIsImVtcHR5TG9naW4iLCJlbXB0eVB3ZCIsIndyb25nTG9naW5PclB3ZCIsInJlZ2lzdGVyIiwicGFzc3dvcmRSZXBlYXQiLCJsb2dpbkFscmVhZHlSZWdpc3RlcmVkIiwiZW1wdHlQd2RSZXBlYXQiLCJkZWZhdWx0UGVuZGluZ01zIiwiZmFrZV9wZW5kaW5nIiwibXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJmYWtlX2ZldGNoIiwiX3giLCJfeDIiLCJfeDMiLCJfZmFrZV9mZXRjaCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiX3JlZ2VuZXJhdG9yUnVudGltZSIsIm1hcmsiLCJfY2FsbGVlIiwidXJsIiwiZGVzaXJlZFJlc3BvbnNlIiwid3JhcCIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJwcmV2IiwiYWJydXB0IiwidDAiLCJzdG9wIiwiTG9naW5Gb3JtIiwiX2dldF9vbl9idG5fY2xpY2siLCJyZXNwb25zZSIsIl92YWxpZGF0ZSIsIl91aV9sb2dpbl9hbmRfcGFzc19mb3JtIiwic3RhcnRfbG9hZGluZyIsInNlbnQiLCJlbmRfbG9hZGluZyIsInNldEl0ZW0iLCJsb2NhdGlvbiIsImxvZ2luRXJyb3IiLCJ2YWxpZGF0ZSIsIl91aV9saW5rIiwiU2VsZWN0Iiwib3B0aW9ucyIsIm9uQ2hhbmdlIiwiX3VpX29wdGlvbnMiLCJvbmNoYW5nZSIsIm1hcCIsIm9wdGlvbiIsInVpT3B0Iiwic2VsZWN0ZWQiLCJwdXNoIiwibGFiZWxzIiwidWlPcHRpb24iLCJpbmRleCIsIl9zZXR0aW5ncyRvcHRpb25zIiwiX3NldHRpbmdzJHZhbHVlIiwiX3NldHRpbmdzJG9uQ2hhbmdlIiwiRXZlbnRNYW5hZ2VyIiwibmFtZSIsImxpc3RlbmVyIiwiX2V2ZW50TGlzdCIsImhhc093blByb3BlcnR5IiwiY29tbW9uRXZlbnRNYW5hZ2VyIiwiY2hhbmdlTGFuZyIsIlNlbGVjdExhbmciLCJfbGFuZ1Q5bktleXMiLCJ0OW5LZXkiLCJfbGFuZ0xhYmVscyIsIl9sYW5nSWRzIiwiZGlzcGF0Y2giLCJldmVudHMiLCJfZGF0YSRsYW5nIiwiX3VpX3NlbGVjdCIsInVwZGF0ZUxhYmVscyIsIkhlYWRlciIsImF1dGhvcml6ZWQiLCJyZW1vdmVJdGVtIiwiX3VpX2gxIiwiX3VpX2J0biIsIl9zZXR0aW5ncyRhdXRob3JpemVkIiwiX2RlZmF1bHQiLCJldmVudE1hbmFnZXIiLCJzdWJzY3JpYmUiLCJXaXRoSGVhZGVyIiwiX0xvY2FsaXplZFBhZ2UiLCJlbGVtIiwiX2NhbGxTdXBlciIsIl91aV9lbGVtIiwiX3VpX2hlYWRlciIsIl9pbmhlcml0cyIsIkxvY2FsaXplZFBhZ2UiLCJMb2dpblBhZ2UiLCJfdWlfbG9naW5fZm9ybSIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFNBQVNBLGFBQWFBLENBQUNDLEtBQUssRUFBRUMsRUFBRSxFQUFFO0VBQ2hDLE1BQU07SUFBRUMsR0FBRztJQUFFQyxFQUFFO0FBQUVDLElBQUFBO0FBQVUsR0FBQyxHQUFHQyxLQUFLLENBQUNMLEtBQUssQ0FBQztBQUMzQyxFQUFBLE1BQU1NLE9BQU8sR0FBR0ws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
