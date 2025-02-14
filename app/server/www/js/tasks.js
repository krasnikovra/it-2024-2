'use strict';

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

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _createClass(e, r, t) {
  return Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

var Header = /*#__PURE__*/_createClass(function Header(props) {
  _classCallCheck(this, Header);
  this.el = el("div", {
    "class": "header"
  }, el("h1", null, "\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0437\u0430\u0434\u0430\u0447"), el("button", {
    type: "button",
    "class": "btn"
  }, "\u0412\u044B\u0445\u043E\u0434"));
});

function mountWithHeader(root, element) {
  console.log(root);
  var appDiv = Object.assign(document.createElement("div"), {
    className: "container centered"
  });
  appDiv.appendChild(element);
  mount(root, el("div", {
    "class": "app-body"
  }, new Header({}), appDiv));
}

var _excluded$1 = ["text"];
var FormHeader = /*#__PURE__*/_createClass(function FormHeader(props) {
  _classCallCheck(this, FormHeader);
  props.text;
    var otherProps = _objectWithoutProperties(props, _excluded$1);
  this.el = el("h1", _extends({
    "class": "text-center"
  }, otherProps), props.text);
});

var _excluded = ["label", "key"];
var FormCheckbox = /*#__PURE__*/_createClass(function FormCheckbox(props) {
  _classCallCheck(this, FormCheckbox);
  var label = props.label,
    key = props.key,
    otherProps = _objectWithoutProperties(props, _excluded);
  var checkboxId = "checkbox-".concat(key);
  this.el = el("div", {
    "class": "form-check"
  }, el("input", _extends({
    "class": "form-check-input",
    type: "checkbox",
    id: checkboxId
  }, otherProps)), el("label", {
    "class": "form-check-label",
    "for": checkboxId
  }, label));
});

var Icon = /*#__PURE__*/_createClass(function Icon(props) {
  _classCallCheck(this, Icon);
  this.el = el("img", {
    src: "./icons/".concat(props.src),
    style: "width:".concat(props.w, "px;height:").concat(props.h, "px;")
  });
});

var TaskIconButton = /*#__PURE__*/_createClass(function TaskIconButton(props) {
  _classCallCheck(this, TaskIconButton);
  // This instantiation is needed because
  // redom + babel fails to render a jsx with
  // complex className i.e. <div class="class other-class"/>
  var btn = Object.assign(document.createElement("button"), {
    type: "button",
    className: "btn task-icon-button"
  });
  var icon = new Icon({
    src: props.src,
    w: props.w,
    h: props.h
  });
  btn.appendChild(icon.el);
  this.el = btn;
});

var TaskControlButtons = /*#__PURE__*/_createClass(function TaskControlButtons(props) {
  _classCallCheck(this, TaskControlButtons);
  this.el = el("div", {
    "class": "task-control-buttons-container"
  }, new TaskIconButton({
    src: "ic-pencil-16x16.svg",
    w: 16,
    h: 16
  }), new TaskIconButton({
    src: "ic-trash-16x16.svg",
    w: 16,
    h: 16
  }));
});

var TaskDeadline = /*#__PURE__*/_createClass(function TaskDeadline(props) {
  _classCallCheck(this, TaskDeadline);
  this.el = el("div", {
    "class": "task-deadline-container"
  }, new Icon({
    src: "ic-calendar-16x16.svg",
    w: 16,
    h: 16
  }), el("small", null, props.date));
});

var Task = /*#__PURE__*/_createClass(function Task(props) {
  _classCallCheck(this, Task);
  this.el = el("div", {
    "class": "task-container"
  }, el("div", {
    "class": "task-checkbox-container"
  }, new FormCheckbox({
    label: props.name,
    key: props.key
  })), new TaskDeadline({
    date: props.deadline
  }), new TaskControlButtons({}));
});

var TaskNewButton = /*#__PURE__*/_createClass(function TaskNewButton(props) {
  _classCallCheck(this, TaskNewButton);
  var btn = Object.assign(document.createElement("button"), {
    type: "button",
    className: "btn btn-primary w-100",
    textContent: "Новая задача"
  });
  this.el = btn;
});

var testTasksData = [{
  name: "Первая задача",
  deadline: "01.01.2025"
}, {
  name: "Вторая задача с очень длинным названием",
  deadline: "30.03.2026"
}, {
  name: "Третья задача",
  deadline: "20.02.2025"
}];
var Tasks = el("div", null, el("div", {
  "class": "mb-3"
}, new FormHeader({
  text: "Список задач"
})), el("div", {
  "class": "tasks-list-container"
}, testTasksData.map(function (taskData, index) {
  return new Task({
    name: taskData.name,
    deadline: taskData.deadline,
    key: "task-".concat(index)
  });
}), new TaskNewButton({})));
mountWithHeader(document.getElementById("root"), Tasks);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFza3MuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lcy5qcyIsIi4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9IZWFkZXIuanN4IiwiLi4vLi4vLi4vY2xpZW50L3NyYy91dGlscy9tb3VudFdpdGhIZWFkZXIuanMiLCIuLi8uLi8uLi9jbGllbnQvc3JjL2NvbXBvbmVudHMvZm9ybXMvRm9ybUhlYWRlci5qc3giLCIuLi8uLi8uLi9jbGllbnQvc3JjL2NvbXBvbmVudHMvZm9ybXMvRm9ybUNoZWNrYm94LmpzeCIsIi4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy9JY29uLmpzeCIsIi4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy90YXNrL1Rhc2tJY29uQnV0dG9uLmpzeCIsIi4uLy4uLy4uL2NsaWVudC9zcmMvY29tcG9uZW50cy90YXNrL1Rhc2tDb250cm9sQnV0dG9ucy5qc3giLCIuLi8uLi8uLi9jbGllbnQvc3JjL2NvbXBvbmVudHMvdGFzay9UYXNrRGVhZGxpbmUuanN4IiwiLi4vLi4vLi4vY2xpZW50L3NyYy9jb21wb25lbnRzL3Rhc2svVGFzay5qc3giLCIuLi8uLi8uLi9jbGllbnQvc3JjL2NvbXBvbmVudHMvdGFzay9UYXNrTmV3QnV0dG9uLmpzeCIsIi4uLy4uLy4uL2NsaWVudC9zcmMvdGFza3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY3JlYXRlRWxlbWVudChxdWVyeSwgbnMpIHtcbiAgY29uc3QgeyB0YWcsIGlkLCBjbGFzc05hbWUgfSA9IHBhcnNlKHF1ZXJ5KTtcbiAgY29uc3QgZWxlbWVudCA9IG5zXG4gICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIHRhZylcbiAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcblxuICBpZiAoaWQpIHtcbiAgICBlbGVtZW50LmlkID0gaWQ7XG4gIH1cblxuICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgaWYgKG5zKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZShxdWVyeSkge1xuICBjb25zdCBjaHVua3MgPSBxdWVyeS5zcGxpdCgvKFsuI10pLyk7XG4gIGxldCBjbGFzc05hbWUgPSBcIlwiO1xuICBsZXQgaWQgPSBcIlwiO1xuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgc3dpdGNoIChjaHVua3NbaV0pIHtcbiAgICAgIGNhc2UgXCIuXCI6XG4gICAgICAgIGNsYXNzTmFtZSArPSBgICR7Y2h1bmtzW2kgKyAxXX1gO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIiNcIjpcbiAgICAgICAgaWQgPSBjaHVua3NbaSArIDFdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBjbGFzc05hbWUudHJpbSgpLFxuICAgIHRhZzogY2h1bmtzWzBdIHx8IFwiZGl2XCIsXG4gICAgaWQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWwocXVlcnksIC4uLmFyZ3MpIHtcbiAgbGV0IGVsZW1lbnQ7XG5cbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBxdWVyeTtcblxuICBpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KHF1ZXJ5KTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGVsID0gaHRtbDtcbmNvbnN0IGggPSBodG1sO1xuXG5odG1sLmV4dGVuZCA9IGZ1bmN0aW9uIGV4dGVuZEh0bWwoLi4uYXJncykge1xuICByZXR1cm4gaHRtbC5iaW5kKHRoaXMsIC4uLmFyZ3MpO1xufTtcblxuZnVuY3Rpb24gdW5tb3VudChwYXJlbnQsIF9jaGlsZCkge1xuICBsZXQgY2hpbGQgPSBfY2hpbGQ7XG4gIGNvbnN0IHBhcmVudEVsID0gZ2V0RWwocGFyZW50KTtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcblxuICBpZiAoY2hpbGQgPT09IGNoaWxkRWwgJiYgY2hpbGRFbC5fX3JlZG9tX3ZpZXcpIHtcbiAgICAvLyB0cnkgdG8gbG9vayB1cCB0aGUgdmlldyBpZiBub3QgcHJvdmlkZWRcbiAgICBjaGlsZCA9IGNoaWxkRWwuX19yZWRvbV92aWV3O1xuICB9XG5cbiAgaWYgKGNoaWxkRWwucGFyZW50Tm9kZSkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpO1xuXG4gICAgcGFyZW50RWwucmVtb3ZlQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgcGFyZW50RWwpIHtcbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuXG4gIGlmIChob29rc0FyZUVtcHR5KGhvb2tzKSkge1xuICAgIGNoaWxkRWwuX19yZWRvbV9saWZlY3ljbGUgPSB7fTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgdHJhdmVyc2UgPSBwYXJlbnRFbDtcblxuICBpZiAoY2hpbGRFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICB0cmlnZ2VyKGNoaWxkRWwsIFwib251bm1vdW50XCIpO1xuICB9XG5cbiAgd2hpbGUgKHRyYXZlcnNlKSB7XG4gICAgY29uc3QgcGFyZW50SG9va3MgPSB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSB8fCB7fTtcblxuICAgIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgICAgaWYgKHBhcmVudEhvb2tzW2hvb2tdKSB7XG4gICAgICAgIHBhcmVudEhvb2tzW2hvb2tdIC09IGhvb2tzW2hvb2tdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChob29rc0FyZUVtcHR5KHBhcmVudEhvb2tzKSkge1xuICAgICAgdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGUgPSBudWxsO1xuICAgIH1cblxuICAgIHRyYXZlcnNlID0gdHJhdmVyc2UucGFyZW50Tm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBob29rc0FyZUVtcHR5KGhvb2tzKSB7XG4gIGlmIChob29rcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gaG9va3MpIHtcbiAgICBpZiAoaG9va3Nba2V5XSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUsIFNoYWRvd1Jvb3QgKi9cblxuXG5jb25zdCBob29rTmFtZXMgPSBbXCJvbm1vdW50XCIsIFwib25yZW1vdW50XCIsIFwib251bm1vdW50XCJdO1xuY29uc3Qgc2hhZG93Um9vdEF2YWlsYWJsZSA9XG4gIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgXCJTaGFkb3dSb290XCIgaW4gd2luZG93O1xuXG5mdW5jdGlvbiBtb3VudChwYXJlbnQsIF9jaGlsZCwgYmVmb3JlLCByZXBsYWNlKSB7XG4gIGxldCBjaGlsZCA9IF9jaGlsZDtcbiAgY29uc3QgcGFyZW50RWwgPSBnZXRFbChwYXJlbnQpO1xuICBjb25zdCBjaGlsZEVsID0gZ2V0RWwoY2hpbGQpO1xuXG4gIGlmIChjaGlsZCA9PT0gY2hpbGRFbCAmJiBjaGlsZEVsLl9fcmVkb21fdmlldykge1xuICAgIC8vIHRyeSB0byBsb29rIHVwIHRoZSB2aWV3IGlmIG5vdCBwcm92aWRlZFxuICAgIGNoaWxkID0gY2hpbGRFbC5fX3JlZG9tX3ZpZXc7XG4gIH1cblxuICBpZiAoY2hpbGQgIT09IGNoaWxkRWwpIHtcbiAgICBjaGlsZEVsLl9fcmVkb21fdmlldyA9IGNoaWxkO1xuICB9XG5cbiAgY29uc3Qgd2FzTW91bnRlZCA9IGNoaWxkRWwuX19yZWRvbV9tb3VudGVkO1xuICBjb25zdCBvbGRQYXJlbnQgPSBjaGlsZEVsLnBhcmVudE5vZGU7XG5cbiAgaWYgKHdhc01vdW50ZWQgJiYgb2xkUGFyZW50ICE9PSBwYXJlbnRFbCkge1xuICAgIGRvVW5tb3VudChjaGlsZCwgY2hpbGRFbCwgb2xkUGFyZW50KTtcbiAgfVxuXG4gIGlmIChiZWZvcmUgIT0gbnVsbCkge1xuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBjb25zdCBiZWZvcmVFbCA9IGdldEVsKGJlZm9yZSk7XG5cbiAgICAgIGlmIChiZWZvcmVFbC5fX3JlZG9tX21vdW50ZWQpIHtcbiAgICAgICAgdHJpZ2dlcihiZWZvcmVFbCwgXCJvbnVubW91bnRcIik7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudEVsLnJlcGxhY2VDaGlsZChjaGlsZEVsLCBiZWZvcmVFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudEVsLmluc2VydEJlZm9yZShjaGlsZEVsLCBnZXRFbChiZWZvcmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50RWwuYXBwZW5kQ2hpbGQoY2hpbGRFbCk7XG4gIH1cblxuICBkb01vdW50KGNoaWxkLCBjaGlsZEVsLCBwYXJlbnRFbCwgb2xkUGFyZW50KTtcblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbmZ1bmN0aW9uIHRyaWdnZXIoZWwsIGV2ZW50TmFtZSkge1xuICBpZiAoZXZlbnROYW1lID09PSBcIm9ubW91bnRcIiB8fCBldmVudE5hbWUgPT09IFwib25yZW1vdW50XCIpIHtcbiAgICBlbC5fX3JlZG9tX21vdW50ZWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gXCJvbnVubW91bnRcIikge1xuICAgIGVsLl9fcmVkb21fbW91bnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBlbC5fX3JlZG9tX2xpZmVjeWNsZTtcblxuICBpZiAoIWhvb2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGVsLl9fcmVkb21fdmlldztcbiAgbGV0IGhvb2tDb3VudCA9IDA7XG5cbiAgdmlldz8uW2V2ZW50TmFtZV0/LigpO1xuXG4gIGZvciAoY29uc3QgaG9vayBpbiBob29rcykge1xuICAgIGlmIChob29rKSB7XG4gICAgICBob29rQ291bnQrKztcbiAgICB9XG4gIH1cblxuICBpZiAoaG9va0NvdW50KSB7XG4gICAgbGV0IHRyYXZlcnNlID0gZWwuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgICAgY29uc3QgbmV4dCA9IHRyYXZlcnNlLm5leHRTaWJsaW5nO1xuXG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCBldmVudE5hbWUpO1xuXG4gICAgICB0cmF2ZXJzZSA9IG5leHQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRvTW91bnQoY2hpbGQsIGNoaWxkRWwsIHBhcmVudEVsLCBvbGRQYXJlbnQpIHtcbiAgaWYgKCFjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICB9XG5cbiAgY29uc3QgaG9va3MgPSBjaGlsZEVsLl9fcmVkb21fbGlmZWN5Y2xlO1xuICBjb25zdCByZW1vdW50ID0gcGFyZW50RWwgPT09IG9sZFBhcmVudDtcbiAgbGV0IGhvb2tzRm91bmQgPSBmYWxzZTtcblxuICBmb3IgKGNvbnN0IGhvb2tOYW1lIG9mIGhvb2tOYW1lcykge1xuICAgIGlmICghcmVtb3VudCkge1xuICAgICAgLy8gaWYgYWxyZWFkeSBtb3VudGVkLCBza2lwIHRoaXMgcGhhc2VcbiAgICAgIGlmIChjaGlsZCAhPT0gY2hpbGRFbCkge1xuICAgICAgICAvLyBvbmx5IFZpZXdzIGNhbiBoYXZlIGxpZmVjeWNsZSBldmVudHNcbiAgICAgICAgaWYgKGhvb2tOYW1lIGluIGNoaWxkKSB7XG4gICAgICAgICAgaG9va3NbaG9va05hbWVdID0gKGhvb2tzW2hvb2tOYW1lXSB8fCAwKSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhvb2tzW2hvb2tOYW1lXSkge1xuICAgICAgaG9va3NGb3VuZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFob29rc0ZvdW5kKSB7XG4gICAgY2hpbGRFbC5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB0cmF2ZXJzZSA9IHBhcmVudEVsO1xuICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7XG5cbiAgaWYgKHJlbW91bnQgfHwgdHJhdmVyc2U/Ll9fcmVkb21fbW91bnRlZCkge1xuICAgIHRyaWdnZXIoY2hpbGRFbCwgcmVtb3VudCA/IFwib25yZW1vdW50XCIgOiBcIm9ubW91bnRcIik7XG4gICAgdHJpZ2dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICh0cmF2ZXJzZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHRyYXZlcnNlLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoIXRyYXZlcnNlLl9fcmVkb21fbGlmZWN5Y2xlKSB7XG4gICAgICB0cmF2ZXJzZS5fX3JlZG9tX2xpZmVjeWNsZSA9IHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudEhvb2tzID0gdHJhdmVyc2UuX19yZWRvbV9saWZlY3ljbGU7XG5cbiAgICBmb3IgKGNvbnN0IGhvb2sgaW4gaG9va3MpIHtcbiAgICAgIHBhcmVudEhvb2tzW2hvb2tdID0gKHBhcmVudEhvb2tzW2hvb2tdIHx8IDApICsgaG9va3NbaG9va107XG4gICAgfVxuXG4gICAgaWYgKHRyaWdnZXJlZCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRyYXZlcnNlLm5vZGVUeXBlID09PSBOb2RlLkRPQ1VNRU5UX05PREUgfHxcbiAgICAgIChzaGFkb3dSb290QXZhaWxhYmxlICYmIHRyYXZlcnNlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgfHxcbiAgICAgIHBhcmVudD8uX19yZWRvbV9tb3VudGVkXG4gICAgKSB7XG4gICAgICB0cmlnZ2VyKHRyYXZlcnNlLCByZW1vdW50ID8gXCJvbnJlbW91bnRcIiA6IFwib25tb3VudFwiKTtcbiAgICAgIHRyaWdnZXJlZCA9IHRydWU7XG4gICAgfVxuICAgIHRyYXZlcnNlID0gcGFyZW50O1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgY29uc3QgZWwgPSBnZXRFbCh2aWV3KTtcblxuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRTdHlsZVZhbHVlKGVsLCBrZXksIGFyZzFba2V5XSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHNldFN0eWxlVmFsdWUoZWwsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlVmFsdWUoZWwsIGtleSwgdmFsdWUpIHtcbiAgZWwuc3R5bGVba2V5XSA9IHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWU7XG59XG5cbi8qIGdsb2JhbCBTVkdFbGVtZW50ICovXG5cblxuY29uc3QgeGxpbmtucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiO1xuXG5mdW5jdGlvbiBzZXRBdHRyKHZpZXcsIGFyZzEsIGFyZzIpIHtcbiAgc2V0QXR0ckludGVybmFsKHZpZXcsIGFyZzEsIGFyZzIpO1xufVxuXG5mdW5jdGlvbiBzZXRBdHRySW50ZXJuYWwodmlldywgYXJnMSwgYXJnMiwgaW5pdGlhbCkge1xuICBjb25zdCBlbCA9IGdldEVsKHZpZXcpO1xuXG4gIGNvbnN0IGlzT2JqID0gdHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCI7XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0QXR0ckludGVybmFsKGVsLCBrZXksIGFyZzFba2V5XSwgaW5pdGlhbCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGlzU1ZHID0gZWwgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuICAgIGNvbnN0IGlzRnVuYyA9IHR5cGVvZiBhcmcyID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICBpZiAoYXJnMSA9PT0gXCJzdHlsZVwiICYmIHR5cGVvZiBhcmcyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBzZXRTdHlsZShlbCwgYXJnMik7XG4gICAgfSBlbHNlIGlmIChpc1NWRyAmJiBpc0Z1bmMpIHtcbiAgICAgIGVsW2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2UgaWYgKGFyZzEgPT09IFwiZGF0YXNldFwiKSB7XG4gICAgICBzZXREYXRhKGVsLCBhcmcyKTtcbiAgICB9IGVsc2UgaWYgKCFpc1NWRyAmJiAoYXJnMSBpbiBlbCB8fCBpc0Z1bmMpICYmIGFyZzEgIT09IFwibGlzdFwiKSB7XG4gICAgICBlbFthcmcxXSA9IGFyZzI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc1NWRyAmJiBhcmcxID09PSBcInhsaW5rXCIpIHtcbiAgICAgICAgc2V0WGxpbmsoZWwsIGFyZzIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5pdGlhbCAmJiBhcmcxID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgc2V0Q2xhc3NOYW1lKGVsLCBhcmcyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGFyZzIgPT0gbnVsbCkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXJnMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoYXJnMSwgYXJnMik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzTmFtZShlbCwgYWRkaXRpb25Ub0NsYXNzTmFtZSkge1xuICBpZiAoYWRkaXRpb25Ub0NsYXNzTmFtZSA9PSBudWxsKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIik7XG4gIH0gZWxzZSBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChhZGRpdGlvblRvQ2xhc3NOYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICB0eXBlb2YgZWwuY2xhc3NOYW1lID09PSBcIm9iamVjdFwiICYmXG4gICAgZWwuY2xhc3NOYW1lICYmXG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWxcbiAgKSB7XG4gICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPVxuICAgICAgYCR7ZWwuY2xhc3NOYW1lLmJhc2VWYWx9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5jbGFzc05hbWUgPSBgJHtlbC5jbGFzc05hbWV9ICR7YWRkaXRpb25Ub0NsYXNzTmFtZX1gLnRyaW0oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRYbGluayhlbCwgYXJnMSwgYXJnMikge1xuICBpZiAodHlwZW9mIGFyZzEgPT09IFwib2JqZWN0XCIpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmcxKSB7XG4gICAgICBzZXRYbGluayhlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGVOUyh4bGlua25zLCBhcmcxLCBhcmcyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtucywgYXJnMSwgYXJnMik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldERhdGEoZWwsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXJnMSkge1xuICAgICAgc2V0RGF0YShlbCwga2V5LCBhcmcxW2tleV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYXJnMiAhPSBudWxsKSB7XG4gICAgICBlbC5kYXRhc2V0W2FyZzFdID0gYXJnMjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGVsLmRhdGFzZXRbYXJnMV07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRleHQoc3RyKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShzdHIgIT0gbnVsbCA/IHN0ciA6IFwiXCIpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50c0ludGVybmFsKGVsZW1lbnQsIGFyZ3MsIGluaXRpYWwpIHtcbiAgZm9yIChjb25zdCBhcmcgb2YgYXJncykge1xuICAgIGlmIChhcmcgIT09IDAgJiYgIWFyZykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBhcmc7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmcoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInN0cmluZ1wiIHx8IHR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dChhcmcpKTtcbiAgICB9IGVsc2UgaWYgKGlzTm9kZShnZXRFbChhcmcpKSkge1xuICAgICAgbW91bnQoZWxlbWVudCwgYXJnKTtcbiAgICB9IGVsc2UgaWYgKGFyZy5sZW5ndGgpIHtcbiAgICAgIHBhcnNlQXJndW1lbnRzSW50ZXJuYWwoZWxlbWVudCwgYXJnLCBpbml0aWFsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHNldEF0dHJJbnRlcm5hbChlbGVtZW50LCBhcmcsIG51bGwsIGluaXRpYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVFbChwYXJlbnQpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgPyBodG1sKHBhcmVudCkgOiBnZXRFbChwYXJlbnQpO1xufVxuXG5mdW5jdGlvbiBnZXRFbChwYXJlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAocGFyZW50Lm5vZGVUeXBlICYmIHBhcmVudCkgfHwgKCFwYXJlbnQuZWwgJiYgcGFyZW50KSB8fCBnZXRFbChwYXJlbnQuZWwpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShhcmcpIHtcbiAgcmV0dXJuIGFyZz8ubm9kZVR5cGU7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKGNoaWxkLCBkYXRhLCBldmVudE5hbWUgPSBcInJlZG9tXCIpIHtcbiAgY29uc3QgY2hpbGRFbCA9IGdldEVsKGNoaWxkKTtcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogZGF0YSB9KTtcbiAgY2hpbGRFbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gc2V0Q2hpbGRyZW4ocGFyZW50LCAuLi5jaGlsZHJlbikge1xuICBjb25zdCBwYXJlbnRFbCA9IGdldEVsKHBhcmVudCk7XG4gIGxldCBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZHJlbiwgcGFyZW50RWwuZmlyc3RDaGlsZCk7XG5cbiAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICBjb25zdCBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZztcblxuICAgIHVubW91bnQocGFyZW50LCBjdXJyZW50KTtcblxuICAgIGN1cnJlbnQgPSBuZXh0O1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudCwgY2hpbGRyZW4sIF9jdXJyZW50KSB7XG4gIGxldCBjdXJyZW50ID0gX2N1cnJlbnQ7XG5cbiAgY29uc3QgY2hpbGRFbHMgPSBBcnJheShjaGlsZHJlbi5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZEVsc1tpXSA9IGNoaWxkcmVuW2ldICYmIGdldEVsKGNoaWxkcmVuW2ldKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRFbCA9IGNoaWxkRWxzW2ldO1xuXG4gICAgaWYgKGNoaWxkRWwgPT09IGN1cnJlbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50Lm5leHRTaWJsaW5nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGlzTm9kZShjaGlsZEVsKSkge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQ/Lm5leHRTaWJsaW5nO1xuICAgICAgY29uc3QgZXhpc3RzID0gY2hpbGQuX19yZWRvbV9pbmRleCAhPSBudWxsO1xuICAgICAgY29uc3QgcmVwbGFjZSA9IGV4aXN0cyAmJiBuZXh0ID09PSBjaGlsZEVsc1tpICsgMV07XG5cbiAgICAgIG1vdW50KHBhcmVudCwgY2hpbGQsIGN1cnJlbnQsIHJlcGxhY2UpO1xuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgIH1cblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBjdXJyZW50ID0gdHJhdmVyc2UocGFyZW50LCBjaGlsZCwgY3VycmVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGxpc3RQb29sKFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbn1cblxuY2xhc3MgTGlzdFBvb2wge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy5vbGRMb29rdXAgPSB7fTtcbiAgICB0aGlzLmxvb2t1cCA9IHt9O1xuICAgIHRoaXMub2xkVmlld3MgPSBbXTtcbiAgICB0aGlzLnZpZXdzID0gW107XG5cbiAgICBpZiAoa2V5ICE9IG51bGwpIHtcbiAgICAgIHRoaXMua2V5ID0gdHlwZW9mIGtleSA9PT0gXCJmdW5jdGlvblwiID8ga2V5IDogcHJvcEtleShrZXkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShkYXRhLCBjb250ZXh0KSB7XG4gICAgY29uc3QgeyBWaWV3LCBrZXksIGluaXREYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGtleVNldCA9IGtleSAhPSBudWxsO1xuXG4gICAgY29uc3Qgb2xkTG9va3VwID0gdGhpcy5sb29rdXA7XG4gICAgY29uc3QgbmV3TG9va3VwID0ge307XG5cbiAgICBjb25zdCBuZXdWaWV3cyA9IEFycmF5KGRhdGEubGVuZ3RoKTtcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBkYXRhW2ldO1xuICAgICAgbGV0IHZpZXc7XG5cbiAgICAgIGlmIChrZXlTZXQpIHtcbiAgICAgICAgY29uc3QgaWQgPSBrZXkoaXRlbSk7XG5cbiAgICAgICAgdmlldyA9IG9sZExvb2t1cFtpZF0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgICBuZXdMb29rdXBbaWRdID0gdmlldztcbiAgICAgICAgdmlldy5fX3JlZG9tX2lkID0gaWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWV3ID0gb2xkVmlld3NbaV0gfHwgbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgICAgfVxuICAgICAgdmlldy51cGRhdGU/LihpdGVtLCBpLCBkYXRhLCBjb250ZXh0KTtcblxuICAgICAgY29uc3QgZWwgPSBnZXRFbCh2aWV3LmVsKTtcblxuICAgICAgZWwuX19yZWRvbV92aWV3ID0gdmlldztcbiAgICAgIG5ld1ZpZXdzW2ldID0gdmlldztcbiAgICB9XG5cbiAgICB0aGlzLm9sZFZpZXdzID0gb2xkVmlld3M7XG4gICAgdGhpcy52aWV3cyA9IG5ld1ZpZXdzO1xuXG4gICAgdGhpcy5vbGRMb29rdXAgPSBvbGRMb29rdXA7XG4gICAgdGhpcy5sb29rdXAgPSBuZXdMb29rdXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJvcEtleShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHByb3BwZWRLZXkoaXRlbSkge1xuICAgIHJldHVybiBpdGVtW2tleV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGxpc3QocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gIHJldHVybiBuZXcgTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBMaXN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBWaWV3LCBrZXksIGluaXREYXRhKSB7XG4gICAgdGhpcy5WaWV3ID0gVmlldztcbiAgICB0aGlzLmluaXREYXRhID0gaW5pdERhdGE7XG4gICAgdGhpcy52aWV3cyA9IFtdO1xuICAgIHRoaXMucG9vbCA9IG5ldyBMaXN0UG9vbChWaWV3LCBrZXksIGluaXREYXRhKTtcbiAgICB0aGlzLmVsID0gZW5zdXJlRWwocGFyZW50KTtcbiAgICB0aGlzLmtleVNldCA9IGtleSAhPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEsIGNvbnRleHQpIHtcbiAgICBjb25zdCB7IGtleVNldCB9ID0gdGhpcztcbiAgICBjb25zdCBvbGRWaWV3cyA9IHRoaXMudmlld3M7XG5cbiAgICB0aGlzLnBvb2wudXBkYXRlKGRhdGEgfHwgW10sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgeyB2aWV3cywgbG9va3VwIH0gPSB0aGlzLnBvb2w7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9sZFZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9sZFZpZXcgPSBvbGRWaWV3c1tpXTtcbiAgICAgICAgY29uc3QgaWQgPSBvbGRWaWV3Ll9fcmVkb21faWQ7XG5cbiAgICAgICAgaWYgKGxvb2t1cFtpZF0gPT0gbnVsbCkge1xuICAgICAgICAgIG9sZFZpZXcuX19yZWRvbV9pbmRleCA9IG51bGw7XG4gICAgICAgICAgdW5tb3VudCh0aGlzLCBvbGRWaWV3KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcblxuICAgICAgdmlldy5fX3JlZG9tX2luZGV4ID0gaTtcbiAgICB9XG5cbiAgICBzZXRDaGlsZHJlbih0aGlzLCB2aWV3cyk7XG5cbiAgICBpZiAoa2V5U2V0KSB7XG4gICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgdGhpcy52aWV3cyA9IHZpZXdzO1xuICB9XG59XG5cbkxpc3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kTGlzdChwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpIHtcbiAgcmV0dXJuIExpc3QuYmluZChMaXN0LCBwYXJlbnQsIFZpZXcsIGtleSwgaW5pdERhdGEpO1xufTtcblxubGlzdC5leHRlbmQgPSBMaXN0LmV4dGVuZDtcblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiBwbGFjZShWaWV3LCBpbml0RGF0YSkge1xuICByZXR1cm4gbmV3IFBsYWNlKFZpZXcsIGluaXREYXRhKTtcbn1cblxuY2xhc3MgUGxhY2Uge1xuICBjb25zdHJ1Y3RvcihWaWV3LCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSB0ZXh0KFwiXCIpO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB0aGlzLmVsO1xuXG4gICAgaWYgKFZpZXcgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICB0aGlzLl9lbCA9IFZpZXc7XG4gICAgfSBlbHNlIGlmIChWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgdGhpcy5fZWwgPSBWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fVmlldyA9IFZpZXc7XG4gICAgfVxuXG4gICAgdGhpcy5faW5pdERhdGEgPSBpbml0RGF0YTtcbiAgfVxuXG4gIHVwZGF0ZSh2aXNpYmxlLCBkYXRhKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5lbC5wYXJlbnROb2RlO1xuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHRoaXMuX2VsLCBwbGFjZWhvbGRlcik7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlcik7XG5cbiAgICAgICAgICB0aGlzLmVsID0gZ2V0RWwodGhpcy5fZWwpO1xuICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgVmlldyA9IHRoaXMuX1ZpZXc7XG4gICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBWaWV3KHRoaXMuX2luaXREYXRhKTtcblxuICAgICAgICAgIHRoaXMuZWwgPSBnZXRFbCh2aWV3KTtcbiAgICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuXG4gICAgICAgICAgbW91bnQocGFyZW50Tm9kZSwgdmlldywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgIHVubW91bnQocGFyZW50Tm9kZSwgcGxhY2Vob2xkZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXc/LnVwZGF0ZT8uKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbCkge1xuICAgICAgICAgIG1vdW50KHBhcmVudE5vZGUsIHBsYWNlaG9sZGVyLCB0aGlzLl9lbCk7XG4gICAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLl9lbCk7XG5cbiAgICAgICAgICB0aGlzLmVsID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb3VudChwYXJlbnROb2RlLCBwbGFjZWhvbGRlciwgdGhpcy52aWV3KTtcbiAgICAgICAgdW5tb3VudChwYXJlbnROb2RlLCB0aGlzLnZpZXcpO1xuXG4gICAgICAgIHRoaXMuZWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWYoY3R4LCBrZXksIHZhbHVlKSB7XG4gIGN0eFtrZXldID0gdmFsdWU7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyogZ2xvYmFsIE5vZGUgKi9cblxuXG5mdW5jdGlvbiByb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpIHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIocGFyZW50LCB2aWV3cywgaW5pdERhdGEpO1xufVxuXG5jbGFzcyBSb3V0ZXIge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZpZXdzLCBpbml0RGF0YSkge1xuICAgIHRoaXMuZWwgPSBlbnN1cmVFbChwYXJlbnQpO1xuICAgIHRoaXMudmlld3MgPSB2aWV3cztcbiAgICB0aGlzLlZpZXdzID0gdmlld3M7IC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgdGhpcy5pbml0RGF0YSA9IGluaXREYXRhO1xuICB9XG5cbiAgdXBkYXRlKHJvdXRlLCBkYXRhKSB7XG4gICAgaWYgKHJvdXRlICE9PSB0aGlzLnJvdXRlKSB7XG4gICAgICBjb25zdCB2aWV3cyA9IHRoaXMudmlld3M7XG4gICAgICBjb25zdCBWaWV3ID0gdmlld3Nbcm91dGVdO1xuXG4gICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG5cbiAgICAgIGlmIChWaWV3ICYmIChWaWV3IGluc3RhbmNlb2YgTm9kZSB8fCBWaWV3LmVsIGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gVmlldztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmlldyA9IFZpZXcgJiYgbmV3IFZpZXcodGhpcy5pbml0RGF0YSwgZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIHNldENoaWxkcmVuKHRoaXMuZWwsIFt0aGlzLnZpZXddKTtcbiAgICB9XG4gICAgdGhpcy52aWV3Py51cGRhdGU/LihkYXRhLCByb3V0ZSk7XG4gIH1cbn1cblxuY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG5cbmZ1bmN0aW9uIHN2ZyhxdWVyeSwgLi4uYXJncykge1xuICBsZXQgZWxlbWVudDtcblxuICBjb25zdCB0eXBlID0gdHlwZW9mIHF1ZXJ5O1xuXG4gIGlmICh0eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQocXVlcnksIG5zKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjb25zdCBRdWVyeSA9IHF1ZXJ5O1xuICAgIGVsZW1lbnQgPSBuZXcgUXVlcnkoLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIGFyZ3VtZW50IHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgcGFyc2VBcmd1bWVudHNJbnRlcm5hbChnZXRFbChlbGVtZW50KSwgYXJncywgdHJ1ZSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IHMgPSBzdmc7XG5cbnN2Zy5leHRlbmQgPSBmdW5jdGlvbiBleHRlbmRTdmcoLi4uYXJncykge1xuICByZXR1cm4gc3ZnLmJpbmQodGhpcywgLi4uYXJncyk7XG59O1xuXG5zdmcubnMgPSBucztcblxuZnVuY3Rpb24gdmlld0ZhY3Rvcnkodmlld3MsIGtleSkge1xuICBpZiAoIXZpZXdzIHx8IHR5cGVvZiB2aWV3cyAhPT0gXCJvYmplY3RcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcInZpZXdzIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICB9XG4gIGlmICgha2V5IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJrZXkgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gZmFjdG9yeVZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpIHtcbiAgICBjb25zdCB2aWV3S2V5ID0gaXRlbVtrZXldO1xuICAgIGNvbnN0IFZpZXcgPSB2aWV3c1t2aWV3S2V5XTtcblxuICAgIGlmIChWaWV3KSB7XG4gICAgICByZXR1cm4gbmV3IFZpZXcoaW5pdERhdGEsIGl0ZW0sIGksIGRhdGEpO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgdmlldyAke3ZpZXdLZXl9IG5vdCBmb3VuZGApO1xuICB9O1xufVxuXG5leHBvcnQgeyBMaXN0LCBMaXN0UG9vbCwgUGxhY2UsIFJvdXRlciwgZGlzcGF0Y2gsIGVsLCBoLCBodG1sLCBsaXN0LCBsaXN0UG9vbCwgbW91bnQsIHBsYWNlLCByZWYsIHJvdXRlciwgcywgc2V0QXR0ciwgc2V0Q2hpbGRyZW4sIHNldERhdGEsIHNldFN0eWxlLCBzZXRYbGluaywgc3ZnLCB0ZXh0LCB1bm1vdW50LCB2aWV3RmFjdG9yeSB9O1xuIiwiaW1wb3J0IHsgZWwgfSBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXNcIjtcclxuXHJcbmNsYXNzIEhlYWRlciB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHRoaXMuZWwgPVxyXG4gICAgICA8ZGl2IGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPGgxPtCc0LXQvdC10LTQttC10YAg0LfQsNC00LDRhzwvaDE+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5cIj7QktGL0YXQvtC0PC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyO1xyXG4iLCJpbXBvcnQgeyBtb3VudCwgZWwgfSBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXNcIjtcclxuaW1wb3J0IEhlYWRlciBmcm9tIFwiLi4vY29tcG9uZW50cy9IZWFkZXIuanN4XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtb3VudFdpdGhIZWFkZXIocm9vdCwgZWxlbWVudCkge1xyXG4gIGNvbnNvbGUubG9nKHJvb3QpO1xyXG5cclxuICBjb25zdCBhcHBEaXYgPSBPYmplY3QuYXNzaWduKFxyXG4gICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcclxuICAgIHtcclxuICAgICAgY2xhc3NOYW1lOiBcImNvbnRhaW5lciBjZW50ZXJlZFwiXHJcbiAgICB9XHJcbiAgKVxyXG4gIGFwcERpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHJcbiAgbW91bnQoXHJcbiAgICByb290LFxyXG4gICAgPGRpdiBjbGFzcz1cImFwcC1ib2R5XCI+XHJcbiAgICAgIDxIZWFkZXIgLz5cclxuICAgICAge2FwcERpdn1cclxuICAgIDwvZGl2PlxyXG4gIClcclxufTtcclxuIiwiaW1wb3J0IHsgZWwgfSBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXNcIjtcclxuXHJcbmNsYXNzIEZvcm1IZWFkZXIge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBjb25zdCB7dGV4dCwgLi4ub3RoZXJQcm9wc30gPSBwcm9wcztcclxuXHJcbiAgICB0aGlzLmVsID1cclxuICAgICAgPGgxIGNsYXNzPVwidGV4dC1jZW50ZXJcIiB7Li4ub3RoZXJQcm9wc30+e3Byb3BzLnRleHR9PC9oMT5cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZvcm1IZWFkZXI7XHJcbiIsImltcG9ydCB7IGVsIH0gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzXCI7XHJcblxyXG5jbGFzcyBGb3JtQ2hlY2tib3gge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBjb25zdCB7bGFiZWwsIGtleSwgLi4ub3RoZXJQcm9wc30gPSBwcm9wcztcclxuXHJcbiAgICBjb25zdCBjaGVja2JveElkID0gYGNoZWNrYm94LSR7a2V5fWA7XHJcbiAgICB0aGlzLmVsID0gXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNoZWNrXCI+XHJcbiAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jaGVjay1pbnB1dFwiIHR5cGU9XCJjaGVja2JveFwiIGlkPXtjaGVja2JveElkfSB7Li4ub3RoZXJQcm9wc30gLz5cclxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWNoZWNrLWxhYmVsXCIgZm9yPXtjaGVja2JveElkfT5cclxuICAgICAgICAgIHtsYWJlbH1cclxuICAgICAgICA8L2xhYmVsPlxyXG4gICAgICA8L2Rpdj5cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZvcm1DaGVja2JveDtcclxuIiwiaW1wb3J0IHsgZWwgfSBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXNcIjtcclxuXHJcbmNsYXNzIEljb24ge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICB0aGlzLmVsID1cclxuICAgICAgPGltZyBzcmM9e2AuL2ljb25zLyR7cHJvcHMuc3JjfWB9IHN0eWxlPXtgd2lkdGg6JHtwcm9wcy53fXB4O2hlaWdodDoke3Byb3BzLmh9cHg7YH0vPlxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSWNvbjtcclxuIiwiaW1wb3J0IHsgZWwgfSBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXMuanNcIjtcclxuaW1wb3J0IEljb24gZnJvbSBcIi4uL0ljb24uanN4XCI7XHJcblxyXG5jbGFzcyBUYXNrSWNvbkJ1dHRvbiB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIC8vIFRoaXMgaW5zdGFudGlhdGlvbiBpcyBuZWVkZWQgYmVjYXVzZVxyXG4gICAgLy8gcmVkb20gKyBiYWJlbCBmYWlscyB0byByZW5kZXIgYSBqc3ggd2l0aFxyXG4gICAgLy8gY29tcGxleCBjbGFzc05hbWUgaS5lLiA8ZGl2IGNsYXNzPVwiY2xhc3Mgb3RoZXItY2xhc3NcIi8+XHJcbiAgICBjb25zdCBidG4gPSBPYmplY3QuYXNzaWduKFxyXG4gICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpLFxyXG4gICAgICB7XHJcbiAgICAgICAgdHlwZTogXCJidXR0b25cIixcclxuICAgICAgICBjbGFzc05hbWU6IFwiYnRuIHRhc2staWNvbi1idXR0b25cIixcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBpY29uID0gPEljb24gc3JjPXtwcm9wcy5zcmN9IHc9e3Byb3BzLnd9IGg9e3Byb3BzLmh9Lz5cclxuICAgIGJ0bi5hcHBlbmRDaGlsZChpY29uLmVsKTtcclxuXHJcbiAgICB0aGlzLmVsID0gYnRuO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFza0ljb25CdXR0b247XHJcbiIsImltcG9ydCB7IGVsIH0gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzXCI7XHJcbmltcG9ydCBUYXNrSWNvbkJ1dHRvbiBmcm9tIFwiLi9UYXNrSWNvbkJ1dHRvbi5qc3hcIjtcclxuXHJcbmNsYXNzIFRhc2tDb250cm9sQnV0dG9ucyB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHRoaXMuZWwgPVxyXG4gICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250cm9sLWJ1dHRvbnMtY29udGFpbmVyXCI+XHJcbiAgICAgICAgPFRhc2tJY29uQnV0dG9uIHNyYz1cImljLXBlbmNpbC0xNngxNi5zdmdcIiB3PXsxNn0gaD17MTZ9Lz5cclxuICAgICAgICA8VGFza0ljb25CdXR0b24gc3JjPVwiaWMtdHJhc2gtMTZ4MTYuc3ZnXCIgdz17MTZ9IGg9ezE2fS8+XHJcbiAgICAgIDwvZGl2PlxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFza0NvbnRyb2xCdXR0b25zO1xyXG4iLCJpbXBvcnQgeyBlbCB9IGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVkb20vZGlzdC9yZWRvbS5lc1wiO1xyXG5pbXBvcnQgSWNvbiBmcm9tIFwiLi4vSWNvbi5qc3hcIjtcclxuXHJcbmNsYXNzIFRhc2tEZWFkbGluZSB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHRoaXMuZWwgPVxyXG4gICAgICA8ZGl2IGNsYXNzPVwidGFzay1kZWFkbGluZS1jb250YWluZXJcIj5cclxuICAgICAgICA8SWNvbiBzcmM9XCJpYy1jYWxlbmRhci0xNngxNi5zdmdcIiB3PXsxNn0gaD17MTZ9Lz5cclxuICAgICAgICA8c21hbGw+e3Byb3BzLmRhdGV9PC9zbWFsbD5cclxuICAgICAgPC9kaXY+XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYXNrRGVhZGxpbmU7XHJcbiIsImltcG9ydCB7IGVsIH0gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzXCI7XHJcbmltcG9ydCBGb3JtQ2hlY2tib3ggZnJvbSBcIi4uL2Zvcm1zL0Zvcm1DaGVja2JveC5qc3hcIjtcclxuaW1wb3J0IFRhc2tDb250cm9sQnV0dG9ucyBmcm9tIFwiLi9UYXNrQ29udHJvbEJ1dHRvbnMuanN4XCI7XHJcbmltcG9ydCBUYXNrRGVhZGxpbmUgZnJvbSBcIi4vVGFza0RlYWRsaW5lLmpzeFwiO1xyXG5cclxuY2xhc3MgVGFzayB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHRoaXMuZWwgPVxyXG4gICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jaGVja2JveC1jb250YWluZXJcIj5cclxuICAgICAgICAgIDxGb3JtQ2hlY2tib3ggbGFiZWw9e3Byb3BzLm5hbWV9IGtleT17cHJvcHMua2V5fS8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPFRhc2tEZWFkbGluZSBkYXRlPXtwcm9wcy5kZWFkbGluZX0vPlxyXG4gICAgICAgIDxUYXNrQ29udHJvbEJ1dHRvbnMvPlxyXG4gICAgICA8L2Rpdj5cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhc2s7XHJcbiIsImltcG9ydCB7IGVsIH0gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWRvbS9kaXN0L3JlZG9tLmVzLmpzXCI7XHJcblxyXG5jbGFzcyBUYXNrTmV3QnV0dG9uIHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgY29uc3QgYnRuID0gT2JqZWN0LmFzc2lnbihcclxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKSxcclxuICAgICAge1xyXG4gICAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeSB3LTEwMFwiLFxyXG4gICAgICAgIHRleHRDb250ZW50OiBcItCd0L7QstCw0Y8g0LfQsNC00LDRh9CwXCJcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmVsID0gYnRuO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFza05ld0J1dHRvbjtcclxuIiwiaW1wb3J0IHsgZWwgfSBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL3JlZG9tL2Rpc3QvcmVkb20uZXNcIjtcclxuaW1wb3J0IG1vdW50V2l0aEhlYWRlciBmcm9tIFwiLi91dGlscy9tb3VudFdpdGhIZWFkZXIuanNcIjtcclxuaW1wb3J0IEZvcm1IZWFkZXIgZnJvbSBcIi4vY29tcG9uZW50cy9mb3Jtcy9Gb3JtSGVhZGVyLmpzeFwiO1xyXG5pbXBvcnQgVGFzayBmcm9tIFwiLi9jb21wb25lbnRzL3Rhc2svVGFzay5qc3hcIjtcclxuaW1wb3J0IFRhc2tOZXdCdXR0b24gZnJvbSBcIi4vY29tcG9uZW50cy90YXNrL1Rhc2tOZXdCdXR0b24uanN4XCI7XHJcblxyXG5jb25zdCB0ZXN0VGFza3NEYXRhID0gW1xyXG4gIHtcclxuICAgIG5hbWU6IFwi0J/QtdGA0LLQsNGPINC30LDQtNCw0YfQsFwiLFxyXG4gICAgZGVhZGxpbmU6IFwiMDEuMDEuMjAyNVwiXHJcbiAgfSxcclxuICB7XHJcbiAgICBuYW1lOiBcItCS0YLQvtGA0LDRjyDQt9Cw0LTQsNGH0LAg0YEg0L7Rh9C10L3RjCDQtNC70LjQvdC90YvQvCDQvdCw0LfQstCw0L3QuNC10LxcIixcclxuICAgIGRlYWRsaW5lOiBcIjMwLjAzLjIwMjZcIlxyXG4gIH0sXHJcbiAge1xyXG4gICAgbmFtZTogXCLQotGA0LXRgtGM0Y8g0LfQsNC00LDRh9CwXCIsXHJcbiAgICBkZWFkbGluZTogXCIyMC4wMi4yMDI1XCJcclxuICB9LFxyXG5dXHJcblxyXG5jb25zdCBUYXNrcyA9XHJcbiAgPGRpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJtYi0zXCI+XHJcbiAgICAgIDxGb3JtSGVhZGVyIHRleHQ9XCLQodC/0LjRgdC+0Log0LfQsNC00LDRh1wiLz5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInRhc2tzLWxpc3QtY29udGFpbmVyXCI+XHJcbiAgICAgIHt0ZXN0VGFza3NEYXRhLm1hcCgodGFza0RhdGEsIGluZGV4KSA9PiBcclxuICAgICAgICA8VGFzayBuYW1lPXt0YXNrRGF0YS5uYW1lfSBkZWFkbGluZT17dGFza0RhdGEuZGVhZGxpbmV9IGtleT17YHRhc2stJHtpbmRleH1gfS8+XHJcbiAgICAgICl9XHJcbiAgICAgIDxUYXNrTmV3QnV0dG9uLz5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PjtcclxuXHJcbm1vdW50V2l0aEhlYWRlcihcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSxcclxuICAgIFRhc2tzXHJcbik7XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVFbGVtZW50IiwicXVlcnkiLCJucyIsInRhZyIsImlkIiwiY2xhc3NOYW1lIiwicGFyc2UiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50TlMiLCJjaHVua3MiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJ0cmltIiwiaHRtbCIsImFyZ3MiLCJ0eXBlIiwiUXVlcnkiLCJFcnJvciIsInBhcnNlQXJndW1lbnRzSW50ZXJuYWwiLCJnZXRFbCIsImVsIiwiZXh0ZW5kIiwiZXh0ZW5kSHRtbCIsImJpbmQiLCJkb1VubW91bnQiLCJjaGlsZCIsImNoaWxkRWwiLCJwYXJlbnRFbCIsImhvb2tzIiwiX19yZWRvbV9saWZlY3ljbGUiLCJob29rc0FyZUVtcHR5IiwidHJhdmVyc2UiLCJfX3JlZG9tX21vdW50ZWQiLCJ0cmlnZ2VyIiwicGFyZW50SG9va3MiLCJob29rIiwicGFyZW50Tm9kZSIsImtleSIsImhvb2tOYW1lcyIsInNoYWRvd1Jvb3RBdmFpbGFibGUiLCJ3aW5kb3ciLCJtb3VudCIsInBhcmVudCIsIl9jaGlsZCIsImJlZm9yZSIsInJlcGxhY2UiLCJfX3JlZG9tX3ZpZXciLCJ3YXNNb3VudGVkIiwib2xkUGFyZW50IiwiYXBwZW5kQ2hpbGQiLCJkb01vdW50IiwiZXZlbnROYW1lIiwidmlldyIsImhvb2tDb3VudCIsImZpcnN0Q2hpbGQiLCJuZXh0IiwibmV4dFNpYmxpbmciLCJyZW1vdW50IiwiaG9va3NGb3VuZCIsImhvb2tOYW1lIiwidHJpZ2dlcmVkIiwibm9kZVR5cGUiLCJOb2RlIiwiRE9DVU1FTlRfTk9ERSIsIlNoYWRvd1Jvb3QiLCJzZXRTdHlsZSIsImFyZzEiLCJhcmcyIiwic2V0U3R5bGVWYWx1ZSIsInZhbHVlIiwic3R5bGUiLCJ4bGlua25zIiwic2V0QXR0ckludGVybmFsIiwiaW5pdGlhbCIsImlzT2JqIiwiaXNTVkciLCJTVkdFbGVtZW50IiwiaXNGdW5jIiwic2V0RGF0YSIsInNldFhsaW5rIiwic2V0Q2xhc3NOYW1lIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiYWRkaXRpb25Ub0NsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsImJhc2VWYWwiLCJzZXRBdHRyaWJ1dGVOUyIsInJlbW92ZUF0dHJpYnV0ZU5TIiwiZGF0YXNldCIsInRleHQiLCJzdHIiLCJjcmVhdGVUZXh0Tm9kZSIsImFyZyIsImlzTm9kZSIsIkhlYWRlciIsIl9jcmVhdGVDbGFzcyIsInByb3BzIiwiX2NsYXNzQ2FsbENoZWNrIiwibW91bnRXaXRoSGVhZGVyIiwicm9vdCIsImNvbnNvbGUiLCJsb2ciLCJhcHBEaXYiLCJPYmplY3QiLCJhc3NpZ24iLCJGb3JtSGVhZGVyIiwib3RoZXJQcm9wcyIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllcyIsIl9leGNsdWRlZCIsIl9leHRlbmRzIiwiRm9ybUNoZWNrYm94IiwibGFiZWwiLCJjaGVja2JveElkIiwiY29uY2F0IiwiSWNvbiIsInNyYyIsInciLCJoIiwiVGFza0ljb25CdXR0b24iLCJidG4iLCJpY29uIiwiVGFza0NvbnRyb2xCdXR0b25zIiwiVGFza0RlYWRsaW5lIiwiZGF0ZSIsIlRhc2siLCJuYW1lIiwiZGVhZGxpbmUiLCJUYXNrTmV3QnV0dG9uIiwidGV4dENvbnRlbnQiLCJ0ZXN0VGFza3NEYXRhIiwiVGFza3MiLCJtYXAiLCJ0YXNrRGF0YSIsImluZGV4IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBU0EsYUFBYUEsQ0FBQ0MsS0FBSyxFQUFFQyxFQUFFLEVBQUU7RUFDaEMsTUFBTTtJQUFFQyxHQUFHO0lBQUVDLEVBQUU7QUFBRUMsSUFBQUE7QUFBVSxHQUFDLEdBQUdDLEtBQUssQ0FBQ0wsS0FBSyxDQUFDO0FBQzNDLEVBQUEsTUFBTU0sT0FBTyxHQUFHTCxFQUFFLEdBQ2RNLFFBQVEsQ0FBQ0MsZUFBZSxDQUFDUCxFQUFFLEVBQUVDLEdBQUcsQ0FBQyxHQUNqQ0ssUUFBUSxDQUFDUixhQUFhLENBQUNHLEdBQUcsQ0FBQztBQUUvQixFQUFBLElBQUlDLEVBQUUsRUFBRTtJQUNORyxPQUFPLENBQUNILEVBQUUsR0FBR0EsRUFBRTtBQUNqQjtBQUVBLEVBQUEsSUFBSUMsU0FBUyxFQUFFO0FBQ2IsSUFFTztNQUNMRSxPQUFPLENBQUNGLFNBQVMsR0FBR0EsU0FBUztBQUMvQjtBQUNGO0FBRUEsRUFBQSxPQUFPRSxPQUFPO0FBQ2hCO0FBRUEsU0FBU0QsS0FBS0EsQ0FBQ0wsS0FBSyxFQUFFO0FBQ3BCLEVBQUEsTUFBTVMsTUFBTSxHQUFHVCxLQUFLLENBQUNVLEtBQUssQ0FBQyxRQUFRLENBQUM7RUFDcEMsSUFBSU4sU0FBUyxHQUFHLEVBQUU7RUFDbEIsSUFBSUQsRUFBRSxHQUFHLEVBQUU7QUFFWCxFQUFBLEtBQUssSUFBSVEsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHRixNQUFNLENBQUNHLE1BQU0sRUFBRUQsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN6QyxRQUFRRixNQUFNLENBQUNFLENBQUMsQ0FBQztBQUNmLE1BQUEsS0FBSyxHQUFHO1FBQ05QLFNBQVMsSUFBSSxJQUFJSyxNQUFNLENBQUNFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRSxD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
