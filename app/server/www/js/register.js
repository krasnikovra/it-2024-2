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

var RegFrom = /*#__PURE__*/_createClass(function RegFrom() {
  var _this = this;
  _classCallCheck(this, RegFrom);
  _defineProperty(this, "_ui_render", function () {
    return el("div", null, el("div", null, el("div", {
      className: 'mb-3'
    }, this['_ui_login_and_pass_form'] = new LoginAndPassForm({})), this['_ui_input_repeat_pwd'] = new Input({
      label: t9n(defaultLang$1, 'repeat_password'),
      type: 'password',
      placeholder: '********'
    }), el("div", {
      className: "my-2 text-center"
    }, el("small", null, this['_ui_span'] = el("span", null, t9n(defaultLang$1, 'already_have_account_question')), "\xA0", this['_ui_link'] = new Link({
      text: t9n(defaultLang$1, 'to_login'),
      href: './login.html'
    })))), el("div", {
      className: 'text-center'
    }, this['_ui_button'] = new Button({
      text: t9n(defaultLang$1, 'to_register'),
      className: 'w-100',
      type: 'primary',
      onClick: _this._get_on_btn_click(defaultLang$1)
    })));
  });
  _defineProperty(this, "_get_on_btn_click", function (lang) {
    return /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var login, password, passwordRepeat, response, status, detail, error$1;
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
            passwordRepeat = _this._ui_input_repeat_pwd.get_value();
            _this._ui_button.start_loading(t9n(lang, 'loading', 'em'));
            _context.next = 8;
            return fake_fetch('/api/v1/register', {
              login: login,
              password: password,
              passwordRepeat: passwordRepeat
            });
          case 8:
            response = _context.sent;
            _this._ui_button.end_loading(t9n(lang, 'to_register'));
            status = response.status, detail = response.detail;
            if (!(status === responseStatus.ok)) {
              _context.next = 15;
              break;
            }
            window.location.href = './login.html';
            _context.next = 35;
            break;
          case 15:
            error$1 = detail.error;
            _context.t0 = error$1;
            _context.next = _context.t0 === error.emptyLogin ? 19 : _context.t0 === error.emptyPwd ? 23 : _context.t0 === error.emptyPwdRepeat ? 27 : _context.t0 === error.loginAlreadyRegistered ? 31 : 35;
            break;
          case 19:
            _this._ui_login_and_pass_form.invalidateLogin(t9n(lang, 'enter_nonempty_login'));
            _this._ui_login_and_pass_form.removeInvalidityOfPassword();
            _this._ui_input_repeat_pwd.removeInvalidity();
            return _context.abrupt("break", 35);
          case 23:
            _this._ui_login_and_pass_form.invalidatePassword(t9n(lang, 'enter_nonempty_password'));
            _this._ui_login_and_pass_form.removeInvalidityOfLogin();
            _this._ui_input_repeat_pwd.removeInvalidity();
            return _context.abrupt("break", 35);
          case 27:
            _this._ui_login_and_pass_form.removeInvalidityOfLogin();
            _this._ui_login_and_pass_form.removeInvalidityOfPassword();
            _this._ui_input_repeat_pwd.invalidate(t9n(lang, 'enter_nonempty_password'));
            return _context.abrupt("break", 35);
          case 31:
            _this._ui_login_and_pass_form.invalidateLogin(t9n(lang, 'login_already_registered'));
            _this._ui_login_and_pass_form.removeInvalidityOfPassword();
            _this._ui_input_repeat_pwd.removeInvalidity();
            return _context.abrupt("break", 35);
          case 35:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
  });
  _defineProperty(this, "_validate", function (lang) {
    var valid = _this._ui_login_and_pass_form.validate(lang);
    var password = _this._ui_login_and_pass_form.get_password();
    var passwordRepeat = _this._ui_input_repeat_pwd.get_value();
    if (password !== passwordRepeat) {
      _this._ui_login_and_pass_form.invalidatePassword();
      _this._ui_input_repeat_pwd.invalidate(t9n(lang, 'passwords_are_not_equal'));
      valid = false;
    } else {
      if (valid) {
        _this._ui_login_and_pass_form.removeInvalidityOfPassword();
      }
      _this._ui_input_repeat_pwd.removeInvalidity();
    }
    return valid;
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
    _this._ui_button.update({
      text: t9n(lang, 'to_register'),
      onClick: _this._get_on_btn_click(lang)
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
  _defineProperty(this, "onmount", function () {
    var token = localStorage.getItem(localStorageItems.token);
    if (token) {
      window.location.href = './edit.html';
    }
  });
  this.el = this._ui_render();
});
mount(document.getElementById("root"), new WithHeader({}, new RegPage({})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxTdG9yYWdlSXRlbXMuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2NvbnN0YW50cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5ydS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL3Q5bi5lbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvdDluL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hdG9tL2J1dHRvbi5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9zZWxlY3QuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL3V0aWxzL2V2ZW50TWFuYWdlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvc2VsZWN0TGFuZy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvd2lkZ2V0L2hlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvbG9jYWxpemVkUGFnZS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdXRpbHMvd2l0aEhlYWRlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9pbnB1dC5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXRvbS9saW5rLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvbG9naW5BbmRQYXNzRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXBpL3N0YXR1cy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXBpL2Vycm9yLmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy9hcGkvbG9naW4uanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2FwaS9yZWdpc3Rlci5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvYXBpL2luZGV4LmpzIiwiLi4vLi4vLi4vY2xpZW50L3NyYy93aWRnZXQvcmVnRm9ybS5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvcmVnaXN0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBsYW5nSWQ6ICdsYW5nSWQnLFxyXG4gICAgdG9rZW46ICd0b2tlbidcclxufSk7XHJcbiIsImltcG9ydCBsb2NhbFN0b3JhZ2VJdGVtcyBmcm9tIFwiLi9sb2NhbFN0b3JhZ2VJdGVtc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRMYW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlSXRlbXMubGFuZ0lkKSA/PyAncnUnO1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICAndGFza19tYW5hZ2VyJzogJ9Cc0LXQvdC10LTQttC10YAg0LfQsNC00LDRhycsXHJcbiAgICAnbG9naW4nOiAn0JLRhdC+0LQnLFxyXG4gICAgJ2xvYWRpbmcnOiAn0JfQsNCz0YDRg9C30LrQsCcsXHJcbiAgICAnbG9hZGluZ19uX3NlY29uZHNfbGVmdCc6IG4gPT4ge1xyXG4gICAgICAgIGxldCBzZWNvbmRQb3N0Zml4ID0gJyc7XHJcbiAgICAgICAgbGV0IGxlZnRQb3N0Zml4ID0gJ9C+0YHRjCc7XHJcbiAgICAgICAgY29uc3QgbkJldHdlZW4xMGFuZDIwID0gbiA+IDEwICYmIG4gPCAyMDtcclxuICAgICAgICBpZiAobiAlIDEwID09PSAxICYmICFuQmV0d2VlbjEwYW5kMjApIHtcclxuICAgICAgICAgICAgc2Vjb25kUG9zdGZpeCA9ICfQsCc7XHJcbiAgICAgICAgICAgIGxlZnRQb3N0Zml4ID0gJ9Cw0YHRjCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKFsyLCAzLCA0XS5pbmNsdWRlcyhuICUgMTApICYmICFuQmV0d2VlbjEwYW5kMjApIHtcclxuICAgICAgICAgICAgc2Vjb25kUG9zdGZpeCA9ICfRiyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYNCX0LDQs9GA0YPQt9C60LAuLi4gKNCe0YHRgtCw0Lske2xlZnRQb3N0Zml4fSAke259INGB0LXQutGD0L3QtCR7c2Vjb25kUG9zdGZpeH0pYDtcclxuICAgIH0sXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ2VudGVyX25vbmVtcHR5X2xvZ2luJzogJ9CS0LLQtdC00LjRgtC1INC90LXQv9GD0YHRgtC+0LkgZS1tYWlsJyxcclxuICAgICdlbnRlcl9ub25lbXB0eV9wYXNzd29yZCc6ICfQktCy0LXQtNC40YLQtSDQvdC10L/Rg9GB0YLQvtC5INC/0LDRgNC+0LvRjCcsXHJcbiAgICAnd3JvbmdfbG9naW5fb3JfcHdkJzogJ9Cd0LXQstC10YDQvdGL0Lkg0LvQvtCz0LjQvSDQuNC70Lgg0L/QsNGA0L7Qu9GMJyxcclxuICAgICdwYXNzd29yZHNfYXJlX25vdF9lcXVhbCc6ICfQn9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YInLFxyXG4gICAgJ2xvZ2luX2FscmVhZHlfcmVnaXN0ZXJlZCc6ICfQotCw0LrQvtC5INC70L7Qs9C40L0g0YPQttC1INC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDQvScsXHJcbiAgICAncGFzc3dvcmQnOiAn0J/QsNGA0L7Qu9GMJyxcclxuICAgICd0b19sb2dpbic6ICfQktC+0LnRgtC4JyxcclxuICAgICd0b19yZWdpc3Rlcic6ICfQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y8nLFxyXG4gICAgJ25vX2FjY291bnRfcXVlc3Rpb24nOiAn0J3QtdGCINCw0LrQutCw0YPQvdGC0LA/JyxcclxuICAgICd0b19sb2dfb3V0JzogJ9CS0YvQudGC0LgnLFxyXG4gICAgJ3JlZ2lzdHJhdGlvbic6ICfQoNC10LPQuNGB0YLRgNCw0YbQuNGPJyxcclxuICAgICdyZXBlYXRfcGFzc3dvcmQnOiAn0J/QvtCy0YLQvtGA0LjRgtC1INC/0LDRgNC+0LvRjCcsXHJcbiAgICAnYWxyZWFkeV9oYXZlX2FjY291bnRfcXVlc3Rpb24nOiAn0KPQttC1INC10YHRgtGMINCw0LrQutCw0YPQvdGCPycsXHJcbiAgICAnZWRpdGluZyc6ICfQoNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1JyxcclxuICAgICd0YXNrX25hbWUnOiAn0J3QsNC30LLQsNC90LjQtSDQt9Cw0LTQsNGH0LgnLFxyXG4gICAgJ215X3Rhc2snOiAn0JzQvtGPINC30LDQtNCw0YfQsCcsXHJcbiAgICAnZGVhZGxpbmUnOiAn0JTQtdC00LvQsNC50L0nLFxyXG4gICAgJ2ltcG9ydGFudF90YXNrJzogJ9CS0LDQttC90LDRjyDQt9Cw0LTQsNGH0LAnLFxyXG4gICAgJ2NhbmNlbCc6ICfQntGC0LzQtdC90LAnLFxyXG4gICAgJ3RvX3NhdmUnOiAn0KHQvtGF0YDQsNC90LjRgtGMJyxcclxuICAgICdydSc6ICfQoNGD0YHRgdC60LjQuScsXHJcbiAgICAnZW4nOiAn0JDQvdCz0LvQuNC50YHQutC40LknXHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgICd0YXNrX21hbmFnZXInOiAnVGFzayBtYW5hZ2VyJyxcclxuICAgICdsb2dpbic6ICdMb2dpbicsXHJcbiAgICAnbG9hZGluZyc6ICdMb2FkaW5nJyxcclxuICAgICdsb2FkaW5nX25fc2Vjb25kc19sZWZ0JzogbiA9PiBgTG9hZGluZy4uLiAoJHtufSBzZWNvbmQke24gJSAxMCA9PT0gMSA/ICcnIDogJ3MnfSBsZWZ0KWAsXHJcbiAgICAnZW1haWwnOiAnRS1tYWlsJyxcclxuICAgICdzb21lYm9keV9lbWFpbCc6ICdzb21lYm9keUBnbWFpbC5jb20nLFxyXG4gICAgJ2VudGVyX25vbmVtcHR5X2xvZ2luJzogJ0VudGVyIG5vbi1lbXB0eSBlLW1haWwnLFxyXG4gICAgJ2VudGVyX25vbmVtcHR5X3Bhc3N3b3JkJzogJ0VudGVyIG5vbi1lbXB0eSBwYXNzd29yZCcsXHJcbiAgICAnd3JvbmdfbG9naW5fb3JfcHdkJzogJ1dyb25nIGxvZ2luIG9yIHBhc3N3b3JkJyxcclxuICAgICdwYXNzd29yZHNfYXJlX25vdF9lcXVhbCc6ICdQYXNzd29yZHMgYXJlIG5vdCBlcXVhbCcsXHJcbiAgICAnbG9naW5fYWxyZWFkeV9yZWdpc3RlcmVkJzogJ1N1Y2ggbG9naW4gYWxyZWFkeSByZWdpc3RlcmVkJyxcclxuICAgICdwYXNzd29yZCc6ICdQYXNzd29yZCcsXHJcbiAgICAndG9fbG9naW4nOiAnTG9nIGluJyxcclxuICAgICd0b19yZWdpc3Rlcic6ICdSZWdpc3RlcicsXHJcbiAgICAnbm9fYWNjb3VudF9xdWVzdGlvbic6ICdObyBhY2NvdW50PycsXHJcbiAgICAndG9fbG9nX291dCc6ICdMb2cgb3V0JyxcclxuICAgICdyZWdpc3RyYXRpb24nOiAnUmVnaXN0cmF0aW9uJyxcclxuICAgICdyZXBlYXRfcGFzc3dvcmQnOiAnUmVwZWF0IHBhc3N3b3JkJyxcclxuICAgICdhbHJlYWR5X2hhdmVfYWNjb3VudF9xdWVzdGlvbic6ICdIYXZlIGdvdCBhbiBhY2NvdW50PycsXHJcbiAgICAnZWRpdGluZyc6ICdFZGl0aW5nJyxcclxuICAgICd0YXNrX25hbWUnOiAnVGFzayBuYW1lJyxcclxuICAgICdteV90YXNrJzogJ015IHRhc2snLFxyXG4gICAgJ2RlYWRsaW5lJzogJ0RlYWRsaW5lJyxcclxuICAgICdpbXBvcnRhbnRfdGFzayc6ICdJbXBvcnRhbnQgdGFzaycsXHJcbiAgICAnY2FuY2VsJzogJ0NhbmNlbCcsXHJcbiAgICAndG9fc2F2ZSc6ICdTYXZlJyxcclxuICAgICdydSc6ICdSdXNzaWFuJyxcclxuICAgICdlbic6ICdFbmdsaXNoJyxcclxufTtcclxuIiwiaW1wb3J0IFJVIGZyb20gJy4vdDluLnJ1JztcclxuaW1wb3J0IEVOIGZyb20gJy4vdDluLmVuJztcclxuXHJcbmZ1bmN0aW9uIHVzZVRhZyhodG1sRWwsIHRhZykge1xyXG4gICAgbGV0IHJlc3VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcclxuICAgIGlmICh0eXBlb2YgaHRtbEVsID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJlc3VsdC5pbm5lckhUTUwgPSBodG1sRWw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdC5hcHBlbmRDaGlsZChodG1sRWwpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gdXNlVGFncyhodG1sRWwsIHRhZ3MpIHtcclxuICAgIGxldCByZXN1bHQgPSBodG1sRWw7XHJcbiAgICB0YWdzLmZvckVhY2godGFnID0+IHJlc3VsdCA9IHVzZVRhZyhyZXN1bHQsIHRhZykpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKGxhbmRJZCwgY29kZSwgdGFnLCAuLi5hcmdzKSA9PiB7XHJcbiAgICBpZiAoY29kZSA9PSBudWxsIHx8IGNvZGUubGVuZ3RoID09PSAwKSByZXR1cm4gJyc7XHJcblxyXG4gICAgaWYgKCFbJ3J1JywgJ2VuJ10uaW5jbHVkZXMobGFuZElkKSkge1xyXG4gICAgICAgIGxhbmRJZCA9ICdydSc7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlc3VsdCA9IGNvZGU7XHJcblxyXG4gICAgaWYgKGxhbmRJZCA9PT0gJ3J1JyAmJiBSVVtjb2RlXSkge1xyXG4gICAgICAgIHJlc3VsdCA9IFJVW2NvZGVdO1xyXG4gICAgfVxyXG4gICAgaWYgKGxhbmRJZCA9PT0gJ2VuJyAmJiBFTltjb2RlXSkge1xyXG4gICAgICAgIHJlc3VsdCA9IEVOW2NvZGVdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0KC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWcpIHtcclxuICAgICAgICBpZiAodGFnIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdXNlVGFncyhyZXN1bHQsIHRhZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdXNlVGFnKHJlc3VsdCwgdGFnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b24ge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgdGV4dCA9ICcnLFxyXG4gICAgICAgICAgICBpY29uID0gbnVsbCxcclxuICAgICAgICAgICAgdHlwZSA9ICdwcmltYXJ5JywgLy8gJ3ByaW1hcnknLCAnc2Vjb25kYXJ5J1xyXG4gICAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBvbkNsaWNrID0gKGUpID0+IHsgY29uc29sZS5sb2coXCJjbGlja2VkIGJ1dHRvblwiLCBlLnRhcmdldCk7IH0sXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9ICcnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgdGV4dCxcclxuICAgICAgICAgICAgaWNvbixcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgZGlzYWJsZWQsXHJcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICBvbkNsaWNrLFxyXG4gICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB0ZXh0LCBpY29uLCB0eXBlLCBkaXNhYmxlZCwgb25DbGljaywgY2xhc3NOYW1lIH0gPSB0aGlzLl9wcm9wO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YnV0dG9uIHRoaXM9J191aV9idXR0b24nIGNsYXNzTmFtZT17YGJ0biBidG4tJHt0eXBlfSAke2NsYXNzTmFtZX1gfVxyXG4gICAgICAgICAgICAgICAgb25jbGljaz17b25DbGlja30gZGlzYWJsZWQ9e2Rpc2FibGVkfT5cclxuICAgICAgICAgICAgICAgIHt0aGlzLl91aV9pY29uKGljb24pfVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gdGhpcz0nX3VpX3NwYW4nPnt0ZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfaWNvbiA9IChpY29uKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGljb24gPyA8aSBjbGFzc05hbWU9e2BiaSBiaS0ke2ljb259IG1lLTJgfT48L2k+IDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfc3Bpbm5lciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPSdzcGlubmVyLWJvcmRlciBzcGlubmVyLWJvcmRlci1zbSBtZS0yJyAvPlxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0X2xvYWRpbmcgPSAobG9hZGluZ0xhYmVsKSA9PiB7IFxyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IHRydWUsIHRleHQ6IGxvYWRpbmdMYWJlbCwgbG9hZGluZzogdHJ1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmRfbG9hZGluZyA9IChsYWJlbCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlKHsgZGlzYWJsZWQ6IGZhbHNlLCB0ZXh0OiBsYWJlbCwgbG9hZGluZzogZmFsc2UgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSB0aGlzLl9wcm9wLnRleHQsXHJcbiAgICAgICAgICAgIGljb24gPSB0aGlzLl9wcm9wLmljb24sXHJcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLl9wcm9wLnR5cGUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkID0gdGhpcy5fcHJvcC5kaXNhYmxlZCxcclxuICAgICAgICAgICAgbG9hZGluZyA9IHRoaXMuX3Byb3AubG9hZGluZyxcclxuICAgICAgICAgICAgb25DbGljayA9IHRoaXMuX3Byb3Aub25DbGljayxcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gdGhpcy5fcHJvcC5jbGFzc05hbWVcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGxvYWRpbmcgIT09IHRoaXMuX3Byb3AubG9hZGluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRUb1JlbW92ZSA9IHRoaXMuX3VpX2J1dHRvbi5jaGlsZE5vZGVzWzBdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLnJlbW92ZUNoaWxkKGNoaWxkVG9SZW1vdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gbG9hZGluZyA/IHRoaXMuX3VpX3NwaW5uZXIoKSA6IHRoaXMuX3VpX2ljb24oaWNvbik7XHJcbiAgICAgICAgICAgIGNoaWxkICYmIHRoaXMuX3VpX2J1dHRvbi5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX3VpX3NwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaWNvbiAhPT0gdGhpcy5fcHJvcC5pY29uKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91aV9idXR0b24uY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZFRvUmVtb3ZlID0gdGhpcy5fdWlfYnV0dG9uLmNoaWxkTm9kZXNbMF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl91aV9idXR0b24ucmVtb3ZlQ2hpbGQoY2hpbGRUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLl91aV9pY29uKGljb24pO1xyXG4gICAgICAgICAgICBjaGlsZCAmJiB0aGlzLl91aV9idXR0b24uaW5zZXJ0QmVmb3JlKHRoaXMuX3VpX2ljb24oaWNvbiksIHRoaXMuX3VpX3NwYW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGV4dCAhPT0gdGhpcy5fcHJvcC50ZXh0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYW5Cb2R5ID0gPGRpdj57dGV4dH08L2Rpdj47XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX3NwYW4uaW5uZXJIVE1MID0gc3BhbkJvZHkuaW5uZXJIVE1MO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2xhc3NOYW1lICE9PSB0aGlzLl9wcm9wLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9idXR0b24uY2xhc3NOYW1lID0gYGJ0biBidG4tJHt0eXBlfSAke2NsYXNzTmFtZX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzYWJsZWQgIT09IHRoaXMuX3Byb3AuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLmRpc2FibGVkID0gZGlzYWJsZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvbkNsaWNrICE9PSB0aGlzLl9wcm9wLm9uQ2xpY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLm9uY2xpY2sgPSBvbkNsaWNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgLi4udGhpcy5fcHJvcCwgdGV4dCwgaWNvbiwgdHlwZSwgZGlzYWJsZWQsIGxvYWRpbmcsIG9uQ2xpY2ssIGNsYXNzTmFtZSB9O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICBvcHRpb25zID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnT3B0aW9uIDEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnb3B0aW9uMSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgdmFsdWUgPSAnb3B0aW9uMScsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlID0gKHZhbHVlKSA9PiB7IGNvbnNvbGUubG9nKHZhbHVlKSB9LFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgb3B0aW9ucyxcclxuICAgICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBvcHRpb25zLCB2YWx1ZSwgb25DaGFuZ2UgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX29wdGlvbnMgPSBbXTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8c2VsZWN0IHRoaXM9J191aV9zZWxlY3QnIGNsYXNzTmFtZT0nZm9ybS1zZWxlY3QnIG9uY2hhbmdlPXtlID0+IG9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX0+XHJcbiAgICAgICAgICAgICAgICB7b3B0aW9ucy5tYXAob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1aU9wdCA9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPXtvcHRpb24udmFsdWV9IHNlbGVjdGVkPXt2YWx1ZSA9PT0gb3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpX29wdGlvbnMucHVzaCh1aU9wdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVpT3B0O1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVMYWJlbHMgPSAobGFiZWxzKSA9PiB7XHJcbiAgICAgICAgaWYgKGxhYmVscy5sZW5ndGggIT09IHRoaXMuX3Byb3Aub3B0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHVwZGF0ZSBzZWxlY3RcXCdzIG9wdGlvbnMgbGFiZWxzIVxcXHJcbiAgICAgICAgICAgICAgICAgTGFiZWxzIGFycmF5IGlzIGluY29tcGF0aWJsZSB3aXRoIHNlbGVjdFxcJyBvcHRpb25zIGFycmF5LicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91aV9vcHRpb25zLmZvckVhY2goKHVpT3B0aW9uLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICB1aU9wdGlvbi5pbm5lckhUTUwgPSBsYWJlbHNbaW5kZXhdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIEV2ZW50TWFuYWdlciB7XHJcbiAgICBfZXZlbnRMaXN0ID0ge307XHJcblxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgICdldmVudDEnOiBbXHJcbiAgICAvLyAgICAgICAgIGYxLFxyXG4gICAgLy8gICAgICAgICBmMlxyXG4gICAgLy8gICAgIF0sXHJcbiAgICAvLyAgICAgJ2V2ZW50Mic6IFtcclxuICAgIC8vICAgICAgICAgZjNcclxuICAgIC8vICAgICBdXHJcbiAgICAvLyB9XHJcblxyXG4gICAgc3Vic2NyaWJlID0gKG5hbWUsIGxpc3RlbmVyKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9ldmVudExpc3RbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGlzdFtuYW1lXSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0ucHVzaChsaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGF0Y2ggPSAobmFtZSwgYXJncyA9IHt9KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TGlzdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExpc3RbbmFtZV0uZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGFyZ3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgY29tbW9uRXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcigpOyAvLyBzaW5nbGV0b25cclxuZXhwb3J0IHsgRXZlbnRNYW5hZ2VyIH07IC8vIGNsYXNzXHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgY2hhbmdlTGFuZzogJ2NoYW5nZUxhbmcnXHJcbn0pO1xyXG4iLCJpbXBvcnQgU2VsZWN0IGZyb20gXCIuLi9hdG9tL3NlbGVjdFwiO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gXCIuLi91dGlscy9jb25zdGFudHNcIjtcclxuaW1wb3J0IHsgY29tbW9uRXZlbnRNYW5hZ2VyIH0gZnJvbSBcIi4uL3V0aWxzL2V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgZXZlbnRzIGZyb20gXCIuLi91dGlscy9ldmVudHNcIjtcclxuaW1wb3J0IHQ5biBmcm9tIFwiLi4vdXRpbHMvdDluL2luZGV4XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RMYW5nIHtcclxuICAgIF9sYW5nSWRzID0gWydydScsICdlbiddO1xyXG4gICAgX2xhbmdUOW5LZXlzID0gWydydScsICdlbiddO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfbGFuZ0xhYmVscyA9IChsYW5nSWQpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGFuZ1Q5bktleXMubWFwKHQ5bktleSA9PiB0OW4obGFuZ0lkLCB0OW5LZXkpKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxhYmVscyA9IHRoaXMuX2xhbmdMYWJlbHMoZGVmYXVsdExhbmcpO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9sYW5nSWRzLm1hcCgobGFuZ0lkLCBpbmRleCkgPT4gKHtcclxuICAgICAgICAgICAgdmFsdWU6IGxhbmdJZCxcclxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsc1tpbmRleF1cclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxTZWxlY3QgdGhpcz0nX3VpX3NlbGVjdCcgb3B0aW9ucz17b3B0aW9uc30gdmFsdWU9e2RlZmF1bHRMYW5nfSBcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtsYW5nSWQgPT4gY29tbW9uRXZlbnRNYW5hZ2VyLmRpc3BhdGNoKGV2ZW50cy5jaGFuZ2VMYW5nLCBsYW5nSWQpfSAvPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTtcclxuICAgICAgICBjb25zdCBsYWJlbHMgPSB0aGlzLl9sYW5nTGFiZWxzKGxhbmcpO1xyXG4gICAgICAgIHRoaXMuX3VpX3NlbGVjdC51cGRhdGVMYWJlbHMobGFiZWxzKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vYXRvbS9idXR0b24nO1xyXG5pbXBvcnQgU2VsZWN0TGFuZyBmcm9tICcuL3NlbGVjdExhbmcnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi4vdXRpbHMvdDluL2luZGV4JztcclxuaW1wb3J0IGxvY2FsU3RvcmFnZUl0ZW1zIGZyb20gJy4uL3V0aWxzL2xvY2FsU3RvcmFnZUl0ZW1zJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XHJcbiAgICAgICAgY29uc3QgeyBhdXRob3JpemVkID0gZmFsc2UgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0geyBhdXRob3JpemVkIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgYXV0aG9yaXplZCB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGgxIHRoaXM9J191aV9oMScgY2xhc3NOYW1lPSdtZS01Jz57dDluKGRlZmF1bHRMYW5nLCAndGFza19tYW5hZ2VyJyl9PC9oMT5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPFNlbGVjdExhbmcgdGhpcz0nX3VpX3NlbGVjdCcgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgeyBhdXRob3JpemVkICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdGhpcz0nX3VpX2J0bicgdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT0nbXMtYXV0bycgdGV4dD17dDluKGRlZmF1bHRMYW5nLCAndG9fbG9nX291dCcpfSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShsb2NhbFN0b3JhZ2VJdGVtcy50b2tlbik7IHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vbG9naW4uaHRtbCcgfX0vPiB9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zdCB7IGxhbmcgPSBkZWZhdWx0TGFuZyB9ID0gZGF0YTsgXHJcblxyXG4gICAgICAgIHRoaXMuX3VpX3NlbGVjdC51cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5fdWlfaDEudGV4dENvbnRlbnQgPSB0OW4obGFuZywgJ3Rhc2tfbWFuYWdlcicpO1xyXG4gICAgICAgIHRoaXMuX3VpX2J0biAmJiB0aGlzLl91aV9idG4udXBkYXRlKHtcclxuICAgICAgICAgICAgdGV4dDogdDluKGxhbmcsICd0b19sb2dfb3V0JylcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBjb21tb25FdmVudE1hbmFnZXIgfSBmcm9tIFwiLi9ldmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tIFwiLi9ldmVudHNcIjtcclxuaW1wb3J0IGxvY2FsU3RvcmFnZUl0ZW1zIGZyb20gXCIuL2xvY2FsU3RvcmFnZUl0ZW1zXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihldmVudE1hbmFnZXIgPSBjb21tb25FdmVudE1hbmFnZXIpIHtcclxuICAgICAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKGV2ZW50cy5jaGFuZ2VMYW5nLCBsYW5nID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoeyBsYW5nIH0pO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShsb2NhbFN0b3JhZ2VJdGVtcy5sYW5nSWQsIGxhbmcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IEhlYWRlciBmcm9tICcuLi93aWRnZXQvaGVhZGVyJztcclxuaW1wb3J0IExvY2FsaXplZFBhZ2UgZnJvbSAnLi9sb2NhbGl6ZWRQYWdlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdpdGhIZWFkZXIgZXh0ZW5kcyBMb2NhbGl6ZWRQYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIGVsZW0pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgPSBmYWxzZSB9ID0gc2V0dGluZ3M7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7XHJcbiAgICAgICAgICAgIGF1dGhvcml6ZWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl91aV9lbGVtID0gZWxlbTtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCB7IGF1dGhvcml6ZWQgfSA9IHRoaXMuX3Byb3A7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhcHAtYm9keSc+XHJcbiAgICAgICAgICAgICAgICA8SGVhZGVyIHRoaXM9J191aV9oZWFkZXInIGF1dGhvcml6ZWQ9e2F1dGhvcml6ZWR9IC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyIGNlbnRlcmVkJz5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5fdWlfZWxlbX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5fdWlfaGVhZGVyLnVwZGF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLl91aV9lbGVtLnVwZGF0ZShkYXRhKTtcclxuICAgIH1cclxufTtcclxuIiwiaW1wb3J0IHsgbW91bnQsIGVsIH0gZnJvbSAnLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXQge1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSAnJyxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSAnJyxcclxuICAgICAgICAgICAgdHlwZSA9ICd0ZXh0JyxcclxuICAgICAgICAgICAga2V5ID0gJ3VuZGVmaW5lZCcsXHJcbiAgICAgICAgfSA9IHNldHRpbmdzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wID0ge1xyXG4gICAgICAgICAgICBsYWJlbCxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXIsXHJcbiAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgIGtleVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbCA9IHRoaXMuX3VpX3JlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIF91aV9yZW5kZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYWJlbCwgcGxhY2Vob2xkZXIsIHR5cGUsIGtleSB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgY29uc3QgaW5wdXRJZCA9IGBiYXNlLWlucHV0LSR7a2V5fWA7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiB0aGlzPSdfdWlfY29udGFpbmVyJz5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCB0aGlzPSdfdWlfbGFiZWwnIGZvcj17aW5wdXRJZH0gY2xhc3NOYW1lPSdmb3JtLWxhYmVsJz57bGFiZWx9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0aGlzPSdfdWlfaW5wdXQnIHR5cGU9e3R5cGV9IGlkPXtpbnB1dElkfSBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCcgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfSAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiB0aGlzPSdfdWlfaW52YWxpZF9mZWVkYmFjaycgY2xhc3NOYW1lPVwiaW52YWxpZC1mZWVkYmFja1wiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbGFiZWwgPSB0aGlzLl9wcm9wLmxhYmVsLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9IHRoaXMuX3Byb3AucGxhY2Vob2xkZXIsXHJcbiAgICAgICAgICAgIHR5cGUgPSB0aGlzLl9wcm9wLnR5cGVcclxuICAgICAgICB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGxhYmVsICE9PSB0aGlzLl9wcm9wLmxhYmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2xhYmVsLnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwbGFjZWhvbGRlciAhPT0gdGhpcy5fcHJvcC5wbGFjZWhvbGRlcikge1xyXG4gICAgICAgICAgICB0aGlzLl91aV9pbnB1dC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZSAhPT0gdGhpcy5fcHJvcC50eXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2lucHV0LnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHsgLi4udGhpcy5wcm9wLCBsYWJlbCwgcGxhY2Vob2xkZXIsIHR5cGUgfTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRfdmFsdWUgPSAoKSA9PiB0aGlzLl91aV9pbnB1dC52YWx1ZTtcclxuXHJcbiAgICBpbnZhbGlkYXRlID0gKHRleHQgPSAnJykgPT4ge1xyXG4gICAgICAgIHRoaXMuX3VpX2ludmFsaWRfZmVlZGJhY2suaW5uZXJIVE1MID0gdGV4dDtcclxuICAgICAgICB0aGlzLl91aV9pbnB1dC5zZXRDdXN0b21WYWxpZGl0eSgnZW1wdHknKTtcclxuICAgICAgICB0aGlzLl91aV9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnd2FzLXZhbGlkYXRlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUludmFsaWRpdHkgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdWlfaW52YWxpZF9mZWVkYmFjay5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICB0aGlzLl91aV9jb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnd2FzLXZhbGlkYXRlZCcpO1xyXG4gICAgICAgIHRoaXMuX3VpX2lucHV0LnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rIHtcclxuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7XHJcbiAgICAgICAgICAgIHRleHQgPSAnJyxcclxuICAgICAgICAgICAgaHJlZiA9ICcnLFxyXG4gICAgICAgIH0gPSBzZXR0aW5ncztcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvcCA9IHtcclxuICAgICAgICAgICAgdGV4dCxcclxuICAgICAgICAgICAgaHJlZlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgdGV4dCwgaHJlZiB9ID0gdGhpcy5fcHJvcDtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGEgdGhpcz0nX3VpX2EnIGhyZWY9e2hyZWZ9Pnt0ZXh0fTwvYT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy5fcHJvcC50ZXh0LFxyXG4gICAgICAgICAgICBocmVmID0gdGhpcy5fcHJvcC5ocmVmXHJcbiAgICAgICAgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0ICE9PSB0aGlzLl9wcm9wLnRleHQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChocmVmICE9PSB0aGlzLl9wcm9wLmhyZWYpIHtcclxuICAgICAgICAgICAgdGhpcy5fdWlfYS5ocmVmID0gaHJlZjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3AgPSB7IC4uLnRoaXMuX3Byb3AsIHRleHQsIGhyZWYgfTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9hdG9tL2lucHV0JztcclxuaW1wb3J0IHQ5biBmcm9tICcuLi91dGlscy90OW4vaW5kZXgnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dpbkFuZFBhc3NGb3JtIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZWwgPSB0aGlzLl91aV9yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfdWlfcmVuZGVyID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWItMyc+XHJcbiAgICAgICAgICAgICAgICAgICAgPElucHV0IHRoaXM9J191aV9pbnB1dF9lbWFpbCcgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ2VtYWlsJyl9IFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3Q5bihkZWZhdWx0TGFuZywgJ3NvbWVib2R5X2VtYWlsJyl9IGtleT1cImUtbWFpbFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfcHdkJyBsYWJlbD17dDluKGRlZmF1bHRMYW5nLCAncGFzc3dvcmQnKX0gcGxhY2Vob2xkZXI9JyoqKioqKioqJyB0eXBlPSdwYXNzd29yZCcga2V5PVwicHdkXCIvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgdmFsaWRhdGUgPSAobGFuZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxvZ2luID0gdGhpcy5nZXRfbG9naW4oKTtcclxuICAgICAgICBjb25zdCBwYXNzd29yZCA9IHRoaXMuZ2V0X3Bhc3N3b3JkKCk7XHJcblxyXG4gICAgICAgIGxldCB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKGxvZ2luLnRyaW0oKSA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlTG9naW4oXHJcbiAgICAgICAgICAgICAgICB0OW4obGFuZywgJ2VudGVyX25vbmVtcHR5X2xvZ2luJylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUludmFsaWRpdHlPZkxvZ2luKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFzc3dvcmQudHJpbSgpID09PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLmludmFsaWRhdGVQYXNzd29yZChcclxuICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAnZW50ZXJfbm9uZW1wdHlfcGFzc3dvcmQnKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlSW52YWxpZGl0eU9mUGFzc3dvcmQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2YWxpZDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHsgbGFuZyB9ID0gZGF0YTtcclxuXHJcbiAgICAgICAgdGhpcy5fdWlfaW5wdXRfZW1haWwudXBkYXRlKHtcclxuICAgICAgICAgICAgbGFiZWw6IHQ5bihsYW5nLCAnZW1haWwnKSxcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHQ5bihsYW5nLCAnc29tZWJvZHlfZW1haWwnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2lucHV0X3B3ZC51cGRhdGUoe1xyXG4gICAgICAgICAgICBsYWJlbDogdDluKGxhbmcsICdwYXNzd29yZCcpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlbW92ZUludmFsaWRpdHlPZkxvZ2luKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVJbnZhbGlkaXR5T2ZQYXNzd29yZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldF9sb2dpbiA9ICgpID0+IHRoaXMuX3VpX2lucHV0X2VtYWlsLmdldF92YWx1ZSgpO1xyXG5cclxuICAgIGdldF9wYXNzd29yZCA9ICgpID0+IHRoaXMuX3VpX2lucHV0X3B3ZC5nZXRfdmFsdWUoKTtcclxuXHJcbiAgICBpbnZhbGlkYXRlTG9naW4gPSAodGV4dCA9ICcnKSA9PiB0aGlzLl91aV9pbnB1dF9lbWFpbC5pbnZhbGlkYXRlKHRleHQpO1xyXG5cclxuICAgIHJlbW92ZUludmFsaWRpdHlPZkxvZ2luID0gKCkgPT4gdGhpcy5fdWlfaW5wdXRfZW1haWwucmVtb3ZlSW52YWxpZGl0eSgpO1xyXG5cclxuICAgIGludmFsaWRhdGVQYXNzd29yZCA9ICh0ZXh0ID0gJycpID0+IHRoaXMuX3VpX2lucHV0X3B3ZC5pbnZhbGlkYXRlKHRleHQpO1xyXG5cclxuICAgIHJlbW92ZUludmFsaWRpdHlPZlBhc3N3b3JkPSAoKSA9PiB0aGlzLl91aV9pbnB1dF9wd2QucmVtb3ZlSW52YWxpZGl0eSgpO1xyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgb2s6ICdvaycsXHJcbiAgICBmYWlsZWQ6ICdmYWlsZWQnLFxyXG4gICAgZXJyb3I6ICdlcnJvcidcclxufSk7XHJcbiIsImV4cG9ydCBkZWZhdWx0IE9iamVjdC5mcmVlemUoe1xyXG4gICAgbm90Rm91bmQ6ICdub3RfZm91bmQnLFxyXG59KTtcclxuIiwiaW1wb3J0IHJlc3BvbnNlU3RhdHVzIGZyb20gXCIuL3N0YXR1c1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luKGJvZHkpIHtcclxuICAgIGNvbnN0IHsgbG9naW4sIHBhc3N3b3JkIH0gPSBib2R5O1xyXG5cclxuICAgIGlmIChsb2dpbi50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5TG9naW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwYXNzd29yZC50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5UHdkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobG9naW4gIT09ICdhZG1pbicgfHwgcGFzc3dvcmQgIT09ICdhZG1pbicpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLmZhaWxlZCxcclxuICAgICAgICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3Iud3JvbmdMb2dpbk9yUHdkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdGF0dXM6IHJlc3BvbnNlU3RhdHVzLm9rLFxyXG4gICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICB0b2tlbjogJ2FiY2RlJyxcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBlcnJvciA9IE9iamVjdC5mcmVlemUoe1xyXG4gICAgd3JvbmdMb2dpbk9yUHdkOiAnd3JvbmdfbG9naW5fb3JfcHdkJyxcclxuICAgIGVtcHR5TG9naW46ICdlbXB0eV9sb2dpbicsXHJcbiAgICBlbXB0eVB3ZDogJ2VtcHR5X3B3ZCcsXHJcbn0pO1xyXG4iLCJpbXBvcnQgcmVzcG9uc2VTdGF0dXMgZnJvbSBcIi4vc3RhdHVzXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoYm9keSkge1xyXG4gICAgY29uc3QgeyBsb2dpbiwgcGFzc3dvcmQsIHBhc3N3b3JkUmVwZWF0IH0gPSBib2R5O1xyXG5cclxuICAgIGlmIChsb2dpbi50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5TG9naW5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwYXNzd29yZC50cmltKCkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmVtcHR5UHdkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAocGFzc3dvcmRSZXBlYXQudHJpbSgpID09PSAnJykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2VTdGF0dXMuZmFpbGVkLFxyXG4gICAgICAgICAgICBkZXRhaWw6IHtcclxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvci5lbXB0eVB3ZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGxvZ2luID09PSAnYWRtaW4nKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZVN0YXR1cy5mYWlsZWQsXHJcbiAgICAgICAgICAgIGRldGFpbDoge1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLmxvZ2luQWxyZWFkeVJlZ2lzdGVyZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXR1czogcmVzcG9uc2VTdGF0dXMub2ssXHJcbiAgICAgICAgZGV0YWlsOiB7IH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGVycm9yID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgICBlbXB0eUxvZ2luOiAnZW1wdHlfbG9naW4nLFxyXG4gICAgZW1wdHlQd2Q6ICdlbXB0eV9wd2QnLFxyXG4gICAgZW1wdHlQd2RSZXBlYXQ6ICdlbXB0eV9wd2RfcmVwZWF0JyxcclxuICAgIGxvZ2luQWxyZWFkeVJlZ2lzdGVyZWQ6ICdsb2dpbl9hbHJlYWR5X3JlZ2lzdGVyZWQnXHJcbn0pO1xyXG4iLCJpbXBvcnQgcmVzcG9uc2VTdGF0dXMgZnJvbSAnLi9zdGF0dXMnO1xyXG5pbXBvcnQgZXJyb3IgZnJvbSAnLi9lcnJvcic7XHJcbmltcG9ydCB7IGxvZ2luIH0gZnJvbSAnLi9sb2dpbic7XHJcbmltcG9ydCB7IHJlZ2lzdGVyIH0gZnJvbSAnLi9yZWdpc3Rlcic7XHJcblxyXG5jb25zdCBkZWZhdWx0UGVuZGluZ01zID0gMjAwMDtcclxuXHJcbmZ1bmN0aW9uIGZha2VfcGVuZGluZyhtcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBmYWtlX2ZldGNoKHVybCwgYm9keSwgZGVzaXJlZFJlc3BvbnNlKSB7XHJcbiAgICBhd2FpdCBmYWtlX3BlbmRpbmcoZGVmYXVsdFBlbmRpbmdNcyk7XHJcbiAgICBpZiAoZGVzaXJlZFJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlc2lyZWRSZXNwb25zZTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2godXJsKSB7XHJcbiAgICAgICAgY2FzZSAnL2FwaS92MS9sb2dpbic6XHJcbiAgICAgICAgICAgIHJldHVybiBsb2dpbihib2R5KTtcclxuICAgICAgICBjYXNlICcvYXBpL3YxL3JlZ2lzdGVyJzpcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdGVyKGJvZHkpXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2VTdGF0dXMuZmFpbGVkLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLm5vdEZvdW5kXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcyc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9hdG9tL2lucHV0JztcclxuaW1wb3J0IExpbmsgZnJvbSAnLi4vYXRvbS9saW5rJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9hdG9tL2J1dHRvbic7XHJcbmltcG9ydCBMb2dpbkFuZFBhc3NGb3JtIGZyb20gJy4uL3dpZGdldC9sb2dpbkFuZFBhc3NGb3JtJztcclxuaW1wb3J0IHQ5biBmcm9tICcuLi91dGlscy90OW4vaW5kZXgnO1xyXG5pbXBvcnQgeyBkZWZhdWx0TGFuZyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCBmYWtlX2ZldGNoIGZyb20gJy4uL2FwaS9pbmRleCc7XHJcbmltcG9ydCByZXNwb25zZVN0YXR1cyBmcm9tICcuLi9hcGkvc3RhdHVzJztcclxuaW1wb3J0IHsgZXJyb3IgYXMgcmVnRXJyb3IgfSBmcm9tICcuLi9hcGkvcmVnaXN0ZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnRnJvbSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbWItMyc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMb2dpbkFuZFBhc3NGb3JtIHRoaXM9J191aV9sb2dpbl9hbmRfcGFzc19mb3JtJyAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxJbnB1dCB0aGlzPSdfdWlfaW5wdXRfcmVwZWF0X3B3ZCcgbGFiZWw9e3Q5bihkZWZhdWx0TGFuZywgJ3JlcGVhdF9wYXNzd29yZCcpfSB0eXBlPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9JyoqKioqKioqJyAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXktMiB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c21hbGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiB0aGlzPSdfdWlfc3Bhbic+e3Q5bihkZWZhdWx0TGFuZywgJ2FscmVhZHlfaGF2ZV9hY2NvdW50X3F1ZXN0aW9uJyl9PC9zcGFuPiZuYnNwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPExpbmsgdGhpcz0nX3VpX2xpbmsnIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX2xvZ2luJyl9IGhyZWY9Jy4vbG9naW4uaHRtbCcgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RleHQtY2VudGVyJz5cclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHRoaXM9J191aV9idXR0b24nIHRleHQ9e3Q5bihkZWZhdWx0TGFuZywgJ3RvX3JlZ2lzdGVyJyl9IGNsYXNzTmFtZT0ndy0xMDAnIHR5cGU9J3ByaW1hcnknXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuX2dldF9vbl9idG5fY2xpY2soZGVmYXVsdExhbmcpfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBfZ2V0X29uX2J0bl9jbGljayA9IChsYW5nKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl92YWxpZGF0ZShsYW5nKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBsb2dpbiA9IHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0uZ2V0X2xvZ2luKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS5nZXRfcGFzc3dvcmQoKTtcclxuICAgICAgICAgICAgY29uc3QgcGFzc3dvcmRSZXBlYXQgPSB0aGlzLl91aV9pbnB1dF9yZXBlYXRfcHdkLmdldF92YWx1ZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdWlfYnV0dG9uLnN0YXJ0X2xvYWRpbmcoXHJcbiAgICAgICAgICAgICAgICB0OW4obGFuZywgJ2xvYWRpbmcnLCAnZW0nKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZha2VfZmV0Y2goJy9hcGkvdjEvcmVnaXN0ZXInLCB7IGxvZ2luLCBwYXNzd29yZCwgcGFzc3dvcmRSZXBlYXQgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2J1dHRvbi5lbmRfbG9hZGluZyhcclxuICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAndG9fcmVnaXN0ZXInKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRldGFpbCB9ID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IHJlc3BvbnNlU3RhdHVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2xvZ2luLmh0bWwnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyBlcnJvciB9ID0gZGV0YWlsO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHJlZ0Vycm9yLmVtcHR5TG9naW46XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0uaW52YWxpZGF0ZUxvZ2luKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdDluKGxhbmcsICdlbnRlcl9ub25lbXB0eV9sb2dpbicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0ucmVtb3ZlSW52YWxpZGl0eU9mUGFzc3dvcmQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfaW5wdXRfcmVwZWF0X3B3ZC5yZW1vdmVJbnZhbGlkaXR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgcmVnRXJyb3IuZW1wdHlQd2Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0uaW52YWxpZGF0ZVBhc3N3b3JkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdDluKGxhbmcsICdlbnRlcl9ub25lbXB0eV9wYXNzd29yZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0ucmVtb3ZlSW52YWxpZGl0eU9mTG9naW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfaW5wdXRfcmVwZWF0X3B3ZC5yZW1vdmVJbnZhbGlkaXR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgcmVnRXJyb3IuZW1wdHlQd2RSZXBlYXQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0ucmVtb3ZlSW52YWxpZGl0eU9mTG9naW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS5yZW1vdmVJbnZhbGlkaXR5T2ZQYXNzd29yZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9pbnB1dF9yZXBlYXRfcHdkLmludmFsaWRhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0OW4obGFuZywgJ2VudGVyX25vbmVtcHR5X3Bhc3N3b3JkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSByZWdFcnJvci5sb2dpbkFscmVhZHlSZWdpc3RlcmVkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLmludmFsaWRhdGVMb2dpbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAnbG9naW5fYWxyZWFkeV9yZWdpc3RlcmVkJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS5yZW1vdmVJbnZhbGlkaXR5T2ZQYXNzd29yZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91aV9pbnB1dF9yZXBlYXRfcHdkLnJlbW92ZUludmFsaWRpdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX3ZhbGlkYXRlID0gKGxhbmcpID0+IHtcclxuICAgICAgICBsZXQgdmFsaWQgPSB0aGlzLl91aV9sb2dpbl9hbmRfcGFzc19mb3JtLnZhbGlkYXRlKGxhbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBwYXNzd29yZCA9IHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0uZ2V0X3Bhc3N3b3JkKCk7XHJcbiAgICAgICAgY29uc3QgcGFzc3dvcmRSZXBlYXQgPSB0aGlzLl91aV9pbnB1dF9yZXBlYXRfcHdkLmdldF92YWx1ZSgpO1xyXG5cclxuICAgICAgICBpZiAocGFzc3dvcmQgIT09IHBhc3N3b3JkUmVwZWF0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0uaW52YWxpZGF0ZVBhc3N3b3JkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2lucHV0X3JlcGVhdF9wd2QuaW52YWxpZGF0ZShcclxuICAgICAgICAgICAgICAgIHQ5bihsYW5nLCAncGFzc3dvcmRzX2FyZV9ub3RfZXF1YWwnKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh2YWxpZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdWlfbG9naW5fYW5kX3Bhc3NfZm9ybS5yZW1vdmVJbnZhbGlkaXR5T2ZQYXNzd29yZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3VpX2lucHV0X3JlcGVhdF9wd2QucmVtb3ZlSW52YWxpZGl0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2xvZ2luX2FuZF9wYXNzX2Zvcm0udXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIHRoaXMuX3VpX2lucHV0X3JlcGVhdF9wd2QudXBkYXRlKHtcclxuICAgICAgICAgICAgbGFiZWw6IHQ5bihsYW5nLCAncmVwZWF0X3Bhc3N3b3JkJylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl91aV9zcGFuLmlubmVySFRNTCA9IHQ5bihsYW5nLCAnYWxyZWFkeV9oYXZlX2FjY291bnRfcXVlc3Rpb24nKTtcclxuICAgICAgICB0aGlzLl91aV9saW5rLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRleHQ6IHQ5bihsYW5nLCAndG9fbG9naW4nKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpX2J1dHRvbi51cGRhdGUoe1xyXG4gICAgICAgICAgICB0ZXh0OiB0OW4obGFuZywgJ3RvX3JlZ2lzdGVyJyksXHJcbiAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuX2dldF9vbl9idG5fY2xpY2sobGFuZylcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG1vdW50LCBlbCB9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzJztcclxuaW1wb3J0IHsgZGVmYXVsdExhbmcgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XHJcbmltcG9ydCB0OW4gZnJvbSAnLi91dGlscy90OW4vaW5kZXgnO1xyXG5pbXBvcnQgV2l0aEhlYWRlciBmcm9tICcuL3V0aWxzL3dpdGhIZWFkZXInO1xyXG5pbXBvcnQgUmVnRm9ybSBmcm9tICcuL3dpZGdldC9yZWdGb3JtJztcclxuaW1wb3J0IGxvY2FsU3RvcmFnZUl0ZW1zIGZyb20gJy4vdXRpbHMvbG9jYWxTdG9yYWdlSXRlbXMnO1xyXG5cclxuY2xhc3MgUmVnUGFnZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsID0gdGhpcy5fdWlfcmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX3VpX3JlbmRlciA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29udGFpbmVyLW1kJz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdtYi0zJz5cclxuICAgICAgICAgICAgICAgICAgICA8aDEgdGhpcz0nX3VpX2gxJyBjbGFzc05hbWU9J3RleHQtY2VudGVyJz57dDluKGRlZmF1bHRMYW5nLCAncmVnaXN0cmF0aW9uJyl9PC9oMT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPFJlZ0Zvcm0gdGhpcz0nX3VpX3JlZ19mb3JtJyAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyBsYW5nID0gZGVmYXVsdExhbmcgfSA9IGRhdGE7XHJcblxyXG4gICAgICAgIHRoaXMuX3VpX2gxLmlubmVySFRNTCA9IHQ5bihsYW5nLCAncmVnaXN0cmF0aW9uJyk7XHJcbiAgICAgICAgdGhpcy5fdWlfcmVnX2Zvcm0udXBkYXRlKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIG9ubW91bnQgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2VJdGVtcy50b2tlbik7XHJcbiAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vZWRpdC5odG1sJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vdW50KFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpLFxyXG4gICAgPFdpdGhIZWFkZXI+XHJcbiAgICAgICAgPFJlZ1BhZ2UgLz5cclxuICAgIDwvV2l0aEhlYWRlcj5cclxuKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUVsZW1lbnQiLCJxdWVyeSIsIm5zIiwidGFnIiwiaWQiLCJjbGFzc05hbWUiLCJwYXJzZSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsImNodW5rcyIsInNwbGl0IiwiaSIsImxlbmd0aCIsInRyaW0iLCJodG1sIiwiYXJncyIsInR5cGUiLCJRdWVyeSIsIkVycm9yIiwicGFyc2VBcmd1bWVudHNJbnRlcm5hbCIsImdldEVsIiwiZWwiLCJleHRlbmQiLCJleHRlbmRIdG1sIiwiYmluZCIsImRvVW5tb3VudCIsImNoaWxkIiwiY2hpbGRFbCIsInBhcmVudEVsIiwiaG9va3MiLCJfX3JlZG9tX2xpZmVjeWNsZSIsImhvb2tzQXJlRW1wdHkiLCJ0cmF2ZXJzZSIsIl9fcmVkb21fbW91bnRlZCIsInRyaWdnZXIiLCJwYXJlbnRIb29rcyIsImhvb2siLCJwYXJlbnROb2RlIiwia2V5IiwiaG9va05hbWVzIiwic2hhZG93Um9vdEF2YWlsYWJsZSIsIndpbmRvdyIsIm1vdW50IiwicGFyZW50IiwiX2NoaWxkIiwiYmVmb3JlIiwicmVwbGFjZSIsIl9fcmVkb21fdmlldyIsIndhc01vdW50ZWQiLCJvbGRQYXJlbnQiLCJhcHBlbmRDaGlsZCIsImRvTW91bnQiLCJldmVudE5hbWUiLCJ2aWV3IiwiaG9va0NvdW50IiwiZmlyc3RDaGlsZCIsIm5leHQiLCJuZXh0U2libGluZyIsInJlbW91bnQiLCJob29rc0ZvdW5kIiwiaG9va05hbWUiLCJ0cmlnZ2VyZWQiLCJub2RlVHlwZSIsIk5vZGUiLCJET0NVTUVOVF9OT0RFIiwiU2hhZG93Um9vdCIsInNldFN0eWxlIiwiYXJnMSIsImFyZzIiLCJzZXRTdHlsZVZhbHVlIiwidmFsdWUiLCJzdHlsZSIsInhsaW5rbnMiLCJzZXRBdHRySW50ZXJuYWwiLCJpbml0aWFsIiwiaXNPYmoiLCJpc1NWRyIsIlNWR0VsZW1lbnQiLCJpc0Z1bmMiLCJzZXREYXRhIiwic2V0WGxpbmsiLCJzZXRDbGFzc05hbWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJhZGRpdGlvblRvQ2xhc3NOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwiYmFzZVZhbCIsInNldEF0dHJpYnV0ZU5TIiwicmVtb3ZlQXR0cmlidXRlTlMiLCJkYXRhc2V0IiwidGV4dCIsInN0ciIsImNyZWF0ZVRleHROb2RlIiwiYXJnIiwiaXNOb2RlIiwiT2JqZWN0IiwiZnJlZXplIiwibGFuZ0lkIiwidG9rZW4iLCJkZWZhdWx0TGFuZyIsIl9sb2NhbFN0b3JhZ2UkZ2V0SXRlbSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJsb2NhbFN0b3JhZ2VJdGVtcyIsImxvYWRpbmdfbl9zZWNvbmRzX2xlZnQiLCJuIiwic2Vjb25kUG9zdGZpeCIsImxlZnRQb3N0Zml4IiwibkJldHdlZW4xMGFuZDIwIiwiaW5jbHVkZXMiLCJjb25jYXQiLCJ1c2VUYWciLCJodG1sRWwiLCJyZXN1bHQiLCJpbm5lckhUTUwiLCJ1c2VUYWdzIiwidGFncyIsImZvckVhY2giLCJsYW5kSWQiLCJjb2RlIiwiUlUiLCJFTiIsIl9sZW4iLCJhcmd1bWVudHMiLCJBcnJheSIsIl9rZXkiLCJhcHBseSIsIkJ1dHRvbiIsIl9jcmVhdGVDbGFzcyIsIl90aGlzIiwic2V0dGluZ3MiLCJ1bmRlZmluZWQiLCJfY2xhc3NDYWxsQ2hlY2siLCJfZGVmaW5lUHJvcGVydHkiLCJfdGhpcyRfcHJvcCIsIl9wcm9wIiwiaWNvbiIsImRpc2FibGVkIiwib25DbGljayIsIm9uY2xpY2siLCJfdWlfaWNvbiIsImxvYWRpbmdMYWJlbCIsInVwZGF0ZSIsImxvYWRpbmciLCJsYWJlbCIsImRhdGEiLCJfZGF0YSR0ZXh0IiwiX2RhdGEkaWNvbiIsIl9kYXRhJHR5cGUiLCJfZGF0YSRkaXNhYmxlZCIsIl9kYXRhJGxvYWRpbmciLCJfZGF0YSRvbkNsaWNrIiwiX2RhdGEkY2xhc3NOYW1lIiwiX3VpX2J1dHRvbiIsImNoaWxkTm9kZXMiLCJjaGlsZFRvUmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJfdWlfc3Bpbm5lciIsImluc2VydEJlZm9yZSIsIl91aV9zcGFuIiwic3BhbkJvZHkiLCJfb2JqZWN0U3ByZWFkIiwiX3NldHRpbmdzJHRleHQiLCJfc2V0dGluZ3MkaWNvbiIsIl9zZXR0aW5ncyR0eXBlIiwiX3NldHRpbmdzJGRpc2FibGVkIiwiX3NldHRpbmdzJG9uQ2xpY2siLCJlIiwiY29uc29sZSIsImxvZyIsInRhcmdldCIsIl9zZXR0aW5ncyRjbGFzc05hbWUiLCJfdWlfcmVuZGVyIiwiU2VsZWN0Iiwib3B0aW9ucyIsIm9uQ2hhbmdlIiwiX3VpX29wdGlvbnMiLCJvbmNoYW5nZSIsIm1hcCIsIm9wdGlvbiIsInVpT3B0Iiwic2VsZWN0ZWQiLCJwdXNoIiwibGFiZWxzIiwiZXJyb3IiLCJ1aU9wdGlvbiIsImluZGV4IiwiX3NldHRpbmdzJG9wdGlvbnMiLCJfc2V0dGluZ3MkdmFsdWUiLCJfc2V0dGluZ3Mkb25DaGFuZ2UiLCJFdmVudE1hbmFnZXIiLCJuYW1lIiwibGlzdGVuZXIiLCJfZXZlbnRMaXN0IiwiaGFzT3duUHJvcGVydHkiLCJjb21tb25FdmVudE1hbmFnZXIiLCJjaGFuZ2VMYW5nIiwiU2VsZWN0TGFuZyIsIl9sYW5nVDluS2V5cyIsInQ5bktleSIsInQ5biIsIl9sYW5nTGFiZWxzIiwiX2xhbmdJZHMiLCJkaXNwYXRjaCIsImV2ZW50cyIsIl9kYXRhJGxhbmciLCJsYW5nIiwiX3VpX3NlbGVjdCIsInVwZGF0ZUxhYmVscyIsIkhlYWRlciIsImF1dGhvcml6ZWQiLCJyZW1vdmVJdGVtIiwibG9jYXRpb24iLCJocmVmIiwiX3VpX2gxIiwidGV4dENvbnRlbnQiLCJfdWlfYnRuIiwiX3NldHRpbmdzJGF1dGhvcml6ZWQiLCJfZGVmYXVsdCIsImV2ZW50TWFuYWdlciIsInN1YnNjcmliZSIsInNldEl0ZW0iLCJXaXRoSGVhZGVyIiwiX0xvY2FsaXplZFBhZ2UiLCJlbGVtIiwiX2NhbGxTdXBlciIsIl91aV9lbGVtIiwiX3VpX2hlYWRlciIsIl9pbmhlcml0cyIsIkxvY2FsaXplZFBhZ2UiLCJJbnB1dCIsInBsYWNlaG9sZGVyIiwiaW5wdXRJZCIsIl9kYXRhJGxhYmVsIiwiX2RhdGEkcGxhY2Vob2xkZXIiLCJfdWlfbGFiZWwiLCJfdWlfaW5wdXQiLCJwcm9wIiwiX3VpX2ludmFsaWRfZmVlZGJhY2siLCJzZXRDdXN0b21WYWxpZGl0eSIsIl91aV9jb250YWluZXIiLCJyZW1vdmUiLCJfc2V0dGluZ3MkbGFiZWwiLCJfc2V0dGluZ3MkcGxhY2Vob2xkZXIiLCJfc2V0dGluZ3Mka2V5IiwiTGluayIsIl9kYXRhJGhyZWYiLCJfdWlfYSIsIl9zZXR0aW5ncyRocmVmIiwiTG9naW5BbmRQYXNzRm9ybSIsImxvZ2luIiwiZ2V0X2xvZ2luIiwicGFzc3dvcmQiLCJnZXRfcGFzc3dvcmQiLCJ2YWxpZCIsImludmFsaWRhdGVMb2dpbiIsInJlbW92ZUludmFsaWRpdHlPZkxvZ2luIiwiaW52YWxpZGF0ZVBhc3N3b3JkIiwicmVtb3ZlSW52YWxpZGl0eU9mUGFzc3dvcmQiLCJfdWlfaW5wdXRfZW1haWwiLCJfdWlfaW5wdXRfcHdkIiwiZ2V0X3ZhbHVlIiwiaW52YWxpZGF0ZSIsInJlbW92ZUludmFsaWRpdHkiLCJvayIsImZhaWxlZCIsIm5vdEZvdW5kIiwiYm9keSIsInN0YXR1cyIsInJlc3BvbnNlU3RhdHVzIiwiZGV0YWlsIiwiZW1wdHlMb2dpbiIsImVtcHR5UHdkIiwid3JvbmdMb2dpbk9yUHdkIiwicmVnaXN0ZXIiLCJwYXNzd29yZFJlcGVhdCIsImxvZ2luQWxyZWFkeVJlZ2lzdGVyZWQiLCJlbXB0eVB3ZFJlcGVhdCIsImRlZmF1bHRQZW5kaW5nTXMiLCJmYWtlX3BlbmRpbmciLCJtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsImZha2VfZmV0Y2giLCJfeCIsIl94MiIsIl94MyIsIl9mYWtlX2ZldGNoIiwiX2FzeW5jVG9HZW5lcmF0b3IiLCJfcmVnZW5lcmF0b3JSdW50aW1lIiwibWFyayIsIl9jYWxsZWUiLCJ1cmwiLCJkZXNpcmVkUmVzcG9uc2UiLCJ3cmFwIiwiX2NhbGxlZSQiLCJfY29udGV4dCIsInByZXYiLCJhYnJ1cHQiLCJ0MCIsInN0b3AiLCJSZWdGcm9tIiwiX2dldF9vbl9idG5fY2xpY2siLCJyZXNwb25zZSIsIl92YWxpZGF0ZSIsIl91aV9sb2dpbl9hbmRfcGFzc19mb3JtIiwiX3VpX2lucHV0X3JlcGVhdF9wd2QiLCJzdGFydF9sb2FkaW5nIiwic2VudCIsImVuZF9sb2FkaW5nIiwicmVnRXJyb3IiLCJ2YWxpZGF0ZSIsIl91aV9saW5rIiwiUmVnUGFnZSIsIlJlZ0Zvcm0iLCJfdWlfcmVnX2Zvcm0iLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFTQSxhQUFhQSxDQUFDQyxLQUFLLEVBQUVDLEVBQUUsRUFBRTtFQUNoQyxNQUFNO0lBQUVDLEdBQUc7SUFBRUMsRUFBRTtBQUFFQyxJQUFBQTtBQUFVLEdBQUMsR0FBR0MsS0FBSyxDQUFDTCxLQUFLLENBQUM7QUFDM0MsRUFBQSxNQUFNTSxPQUFPLEdBQUdMLEVBQUUsR0FDZE0sUUFBUSxDQUFDQyxlQUFlLENBQUNQLEVBQUUsRUFBRUMsR0FBRyxDQUFDLEdBQ2pDSyxRQUFRLENBQUNSLGFBQWEsQ0FBQ0csR0FBRyxDQUFDO0FB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
