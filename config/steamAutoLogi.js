steamAutoLoginAndroidJs = function t(t, e) {
	var r = window.navigator.userAgent,
		n = "";
	n = r.match(/android/i) ? "android" : r.match(/iphone|ipad|ipod/i) ? "ios" : "other", console.log("平台:", n), n ?
	{
		android: function() {
			"loginInputError" === t && window.WebViewJavascriptBridge.loginInputError(JSON.stringify(e ||
					{})), "loginError" === t && window.WebViewJavascriptBridge.loginError(JSON.stringify(
					e || {})), "checkAccountInit" === t && window.WebViewJavascriptBridge.checkAccountInit(
					JSON.stringify(e || {})), "reportInputType" === t && window.WebViewJavascriptBridge
				.reportInputType(JSON.stringify(e || {}))
		},
		ios: function() {
			"loginInputError" === t && window.webkit.messageHandlers.loginInputError.postMessage(e || {}),
				"loginError" === t && window.webkit.messageHandlers.loginError.postMessage(e || {}),
				"checkAccountInit" === t && window.webkit.messageHandlers.checkAccountInit.postMessage(e ||
				{}), "reportInputType" === t && window.webkit.messageHandlers.reportInputType.postMessage(
					e || {})
		},
		other: function() {
			console.log("平台有误，请使用iphone或安卓！")
		}
	} [n]() : console.log("请重试！")
}
var e = document.documentElement.getAttribute("lang") || "zh-cn",
	r = {
		"zh-cn": "登录",
		en: "Sign in"
	},
	n = {
		"zh-cn": "改为输入代码",
		en: "Enter a code instead"
	},
	o = {
		"zh-cn": "错误代码：",
		en: "Error Code:"
	},
	i = {
		"zh-cn": "重试",
		en: "Retry"
	};

function a(t) {
	var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 190,
		r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 500;
	return new Promise((function(n, o) {
		var i = 0;
		checkTimer = setInterval((function() {
			i++;
			var r = t(rootElement);
			if (r) {
				clearInterval(checkTimer), n(r)
			} else {
				var a = (l(rootElement) || {}).type;
				("error" === (void 0 === a ? "" : a) || i >= e) && (clearInterval(checkTimer),
					o("找不到目标元素"))
			}
		}), r)
	}))
}

function c(t) {
	var n = t.querySelector("form");
	if (n) {
		var o = n.querySelector("button[type='submit']");
		return !!o && (o.textContent === r[e] && 0 === o.children.length && {
			type: "loginForm",
			data: n
		})
	}
	return !1
}

function u(t) {
	var e = t.querySelectorAll("input");
	return 5 === e.length && {
		type: "codeInput",
		data: e[0]
	}
}

function l(t) {
	var r;
	return t.querySelectorAll("div").forEach((function(t) {
		(t.textContent.includes(o[e]) || t.textContent.includes(i[e])) && (r = t.textContent)
	})), !!r && {
		type: "error",
		data: r
	}
}
const s = function(e) {
	var r = e.querySelectorAll("input");
	r && r.forEach((function(e) {
		e.addEventListener("paste", (function(e) {
			var r, n, o;
			console.log("paste"), n = (r = e).target.getAttribute("type"), void 0 !== (o = {
				text: 0,
				password: 1
			} [n]) ? (console.log("粘贴input：", n, o), t("reportInputType", {
				inputType: o
			})) : console.log("未处理的输入框类型：", r.target)
		})), e.addEventListener("change", (function(t) {
			console.log("first", t.target), "text" === t.target.type && (accountName = t
				.target.value)
		}))
	}))
};

function f(t, e) {
	var r = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
	if (!r) {
		if (Array.isArray(t) || (r = function(t, e) {
				if (t) {
					if ("string" == typeof t) {
						return h(t, e)
					}
					var r = {}.toString.call(t).slice(8, -1);
					return "Object" === r && t.constructor && (r = t.constructor.name), "Map" === r || "Set" === r ?
						Array.from(t) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? h(
							t, e) : void 0
				}
			}(t)) || e && t && "number" == typeof t.length) {
			r && (t = r);
			var n = 0,
				o = function() {};
			return {
				s: o,
				n: function() {
					return n >= t.length ? {
						done: !0
					} : {
						done: !1,
						value: t[n++]
					}
				},
				e: function(t) {
					throw t
				},
				f: o
			}
		}
		throw new TypeError(
			"Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
		)
	}
	var i, a = !0,
		c = !1;
	return {
		s: function() {
			r = r.call(t)
		},
		n: function() {
			var t = r.next();
			return a = t.done, t
		},
		e: function(t) {
			c = !0, i = t
		},
		f: function() {
			try {
				a || null == r.return || r.return()
			} finally {
				if (c) {
					throw i
				}
			}
		}
	}
}

function h(t, e) {
	(null == e || e > t.length) && (e = t.length);
	for (var r = 0, n = Array(e); r < e; r++) {
		n[r] = t[r]
	}
	return n
}
var p = function() {
	function e() {
		for (var e = document.querySelectorAll("button"), n = 0; n < e.length; n++) {
			if (["重试", "Retry"].includes(e[n].textContent.trim())) {
				return t("loginError", {
					bizyType: "91"
				}), void r.disconnect()
			}
		}
	}
	e();
	var r = new MutationObserver((function(t) {
		var r, n = f(t);
		try {
			for (n.s(); !(r = n.n()).done;) {
				var o = r.value;
				if ("childList" === o.type) {
					e();
					break
				}
				if ("characterData" === o.type && "BUTTON" === o.target.parentNode.tagName) {
					e();
					break
				}
			}
		} catch (t) {
			n.e(t)
		} finally {
			n.f()
		}
	}));
	r.observe(document.body, {
		childList: !0,
		subtree: !0,
		characterData: !0
	})
};
const y = function(r) {
	r.addEventListener("submit", (function() {
		a((function(t) {
			return function(t) {
				var r;
				return t.querySelectorAll("div").forEach((function(t) {
					t.textContent === n[e] && (r = t)
				})), !!r && {
					type: "changeCodeBtn",
					data: r
				}
			}(t) || u(t) || l(t) || c(t)
		})).then((function(t) {
			switch (t.type) {
				case "changeCodeBtn":
					return t.data.click(), a(u);
				case "loginForm":
					throw new Error("登录账号密码错误");
				case "error":
					throw t;
				case "codeInput":
					return t;
				default:
					throw new Error("找不到登录后对应场景")
			}
		})).then((function(e) {
			if ("codeInput" !== e.type || !accountName) {
				throw new Error("错误场景：" + e.type)
			}
			t("checkAccountInit", {
				steamAccountName: accountName
			})
		})).catch((function(e) {
			var r = (e || {}).type,
				n = void 0 === r ? "" : r;
			console.log("异常场景：", e), "error" === n && t("loginError", {
				bizyType: "91"
			})
		}))
	})), p()
};

function d(t) {
	return d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
		return typeof t
	} : function(t) {
		return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" :
			typeof t
	}, d(t)
}

function v() {
	v = function() {
		return e
	};
	var t, e = {},
		r = Object.prototype,
		n = r.hasOwnProperty,
		o = Object.defineProperty || function(t, e, r) {
			t[e] = r.value
		},
		i = "function" == typeof Symbol ? Symbol : {},
		a = i.iterator || "@@iterator",
		c = i.asyncIterator || "@@asyncIterator",
		u = i.toStringTag || "@@toStringTag";

	function l(t, e, r) {
		return Object.defineProperty(t, e, {
			value: r,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}), t[e]
	}
	try {
		l({}, "")
	} catch (t) {
		l = function(t, e, r) {
			return t[e] = r
		}
	}

	function s(t, e, r, n) {
		var i = e && e.prototype instanceof w ? e : w,
			a = Object.create(i.prototype),
			c = new _(n || []);
		return o(a, "_invoke", {
			value: T(t, r, c)
		}), a
	}

	function f(t, e, r) {
		try {
			return {
				type: "normal",
				arg: t.call(e, r)
			}
		} catch (t) {
			return {
				type: "throw",
				arg: t
			}
		}
	}
	e.wrap = s;
	var h = "suspendedStart",
		p = "suspendedYield",
		y = "executing",
		g = "completed",
		m = {};

	function w() {}

	function b() {}

	function E() {}
	var x = {};
	l(x, a, (function() {
		return this
	}));
	var k = Object.getPrototypeOf,
		L = k && k(k(C([])));
	L && L !== r && n.call(L, a) && (x = L);
	var I = E.prototype = w.prototype = Object.create(x);

	function S(t) {
		["next", "throw", "return"].forEach((function(e) {
			l(t, e, (function(t) {
				return this._invoke(e, t)
			}))
		}))
	}

	function A(t, e) {
		function r(o, i, a, c) {
			var u = f(t[o], t, i);
			if ("throw" !== u.type) {
				var l = u.arg,
					s = l.value;
				return s && "object" == d(s) && n.call(s, "__await") ? e.resolve(s.__await).then((function(t) {
					r("next", t, a, c)
				}), (function(t) {
					r("throw", t, a, c)
				})) : e.resolve(s).then((function(t) {
					l.value = t, a(l)
				}), (function(t) {
					return r("throw", t, a, c)
				}))
			}
			c(u.arg)
		}
		var i;
		o(this, "_invoke", {
			value: function(t, n) {
				function o() {
					return new e((function(e, o) {
						r(t, n, e, o)
					}))
				}
				return i = i ? i.then(o, o) : o()
			}
		})
	}

	function T(e, r, n) {
		var o = h;
		return function(i, a) {
			if (o === y) {
				throw Error("Generator is already running")
			}
			if (o === g) {
				if ("throw" === i) {
					throw a
				}
				return {
					value: t,
					done: !0
				}
			}
			for (n.method = i, n.arg = a;;) {
				var c = n.delegate;
				if (c) {
					var u = O(c, n);
					if (u) {
						if (u === m) {
							continue
						}
						return u
					}
				}
				if ("next" === n.method) {
					n.sent = n._sent = n.arg
				} else if ("throw" === n.method) {
					if (o === h) {
						throw o = g, n.arg
					}
					n.dispatchException(n.arg)
				} else {
					"return" === n.method && n.abrupt("return", n.arg)
				}
				o = y;
				var l = f(e, r, n);
				if ("normal" === l.type) {
					if (o = n.done ? g : p, l.arg === m) {
						continue
					}
					return {
						value: l.arg,
						done: n.done
					}
				}
				"throw" === l.type && (o = g, n.method = "throw", n.arg = l.arg)
			}
		}
	}

	function O(e, r) {
		var n = r.method,
			o = e.iterator[n];
		if (o === t) {
			return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, O(e, r),
				"throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError(
				"The iterator does not provide a '" + n + "' method")), m
		}
		var i = f(o, e.iterator, r.arg);
		if ("throw" === i.type) {
			return r.method = "throw", r.arg = i.arg, r.delegate = null, m
		}
		var a = i.arg;
		return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next",
			r.arg = t), r.delegate = null, m) : a : (r.method = "throw", r.arg = new TypeError(
			"iterator result is not an object"), r.delegate = null, m)
	}

	function N(t) {
		var e = {
			tryLoc: t[0]
		};
		1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e)
	}

	function j(t) {
		var e = t.completion || {};
		e.type = "normal", delete e.arg, t.completion = e
	}

	function _(t) {
		this.tryEntries = [{
			tryLoc: "root"
		}], t.forEach(N, this), this.reset(!0)
	}

	function C(e) {
		if (e || "" === e) {
			var r = e[a];
			if (r) {
				return r.call(e)
			}
			if ("function" == typeof e.next) {
				return e
			}
			if (!isNaN(e.length)) {
				var o = -1,
					i = function r() {
						for (; ++o < e.length;) {
							if (n.call(e, o)) {
								return r.value = e[o], r.done = !1, r
							}
						}
						return r.value = t, r.done = !0, r
					};
				return i.next = i
			}
		}
		throw new TypeError(d(e) + " is not iterable")
	}
	return b.prototype = E, o(I, "constructor", {
		value: E,
		configurable: !0
	}), o(E, "constructor", {
		value: b,
		configurable: !0
	}), b.displayName = l(E, u, "GeneratorFunction"), e.isGeneratorFunction = function(t) {
		var e = "function" == typeof t && t.constructor;
		return !!e && (e === b || "GeneratorFunction" === (e.displayName || e.name))
	}, e.mark = function(t) {
		return Object.setPrototypeOf ? Object.setPrototypeOf(t, E) : (t.__proto__ = E, l(t, u,
			"GeneratorFunction")), t.prototype = Object.create(I), t
	}, e.awrap = function(t) {
		return {
			__await: t
		}
	}, S(A.prototype), l(A.prototype, c, (function() {
		return this
	})), e.AsyncIterator = A, e.async = function(t, r, n, o, i) {
		void 0 === i && (i = Promise);
		var a = new A(s(t, r, n, o), i);
		return e.isGeneratorFunction(r) ? a : a.next().then((function(t) {
			return t.done ? t.value : a.next()
		}))
	}, S(I), l(I, u, "Generator"), l(I, a, (function() {
		return this
	})), l(I, "toString", (function() {
		return "[object Generator]"
	})), e.keys = function(t) {
		var e = Object(t),
			r = [];
		for (var n in e) {
			r.push(n)
		}
		return r.reverse(),
			function t() {
				for (; r.length;) {
					var n = r.pop();
					if (n in e) {
						return t.value = n, t.done = !1, t
					}
				}
				return t.done = !0, t
			}
	}, e.values = C, _.prototype = {
		constructor: _,
		reset: function(e) {
			if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null,
				this.method = "next", this.arg = t, this.tryEntries.forEach(j), !e) {
				for (var r in this) {
					"t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t)
				}
			}
		},
		stop: function() {
			this.done = !0;
			var t = this.tryEntries[0].completion;
			if ("throw" === t.type) {
				throw t.arg
			}
			return this.rval
		},
		dispatchException: function(e) {
			if (this.done) {
				throw e
			}
			var r = this;

			function o(n, o) {
				return c.type = "throw", c.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o
			}
			for (var i = this.tryEntries.length - 1; i >= 0; --i) {
				var a = this.tryEntries[i],
					c = a.completion;
				if ("root" === a.tryLoc) {
					return o("end")
				}
				if (a.tryLoc <= this.prev) {
					var u = n.call(a, "catchLoc"),
						l = n.call(a, "finallyLoc");
					if (u && l) {
						if (this.prev < a.catchLoc) {
							return o(a.catchLoc, !0)
						}
						if (this.prev < a.finallyLoc) {
							return o(a.finallyLoc)
						}
					} else if (u) {
						if (this.prev < a.catchLoc) {
							return o(a.catchLoc, !0)
						}
					} else {
						if (!l) {
							throw Error("try statement without catch or finally")
						}
						if (this.prev < a.finallyLoc) {
							return o(a.finallyLoc)
						}
					}
				}
			}
		},
		abrupt: function(t, e) {
			for (var r = this.tryEntries.length - 1; r >= 0; --r) {
				var o = this.tryEntries[r];
				if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
					var i = o;
					break
				}
			}
			i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
			var a = i ? i.completion : {};
			return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, m) : this
				.complete(a)
		},
		complete: function(t, e) {
			if ("throw" === t.type) {
				throw t.arg
			}
			return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this
					.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t
				.type && e && (this.next = e), m
		},
		finish: function(t) {
			for (var e = this.tryEntries.length - 1; e >= 0; --e) {
				var r = this.tryEntries[e];
				if (r.finallyLoc === t) {
					return this.complete(r.completion, r.afterLoc), j(r), m
				}
			}
		},
		catch: function(t) {
			for (var e = this.tryEntries.length - 1; e >= 0; --e) {
				var r = this.tryEntries[e];
				if (r.tryLoc === t) {
					var n = r.completion;
					if ("throw" === n.type) {
						var o = n.arg;
						j(r)
					}
					return o
				}
			}
			throw Error("illegal catch attempt")
		},
		delegateYield: function(e, r, n) {
			return this.delegate = {
				iterator: C(e),
				resultName: r,
				nextLoc: n
			}, "next" === this.method && (this.arg = t), m
		}
	}, e
}

function g(t, e, r, n, o, i, a) {
	try {
		var c = t[i](a),
			u = c.value
	} catch (t) {
		return void r(t)
	}
	c.done ? e(u) : Promise.resolve(u).then(n, o)
}

function m(t) {
	return function() {
		var e = this,
			r = arguments;
		return new Promise((function(n, o) {
			var i = t.apply(e, r);

			function a(t) {
				g(i, n, o, a, c, "next", t)
			}

			function c(t) {
				g(i, n, o, a, c, "throw", t)
			}
			a(void 0)
		}))
	}
}

function w() {
	return b.apply(this, arguments)
}

function b() {
	return (b = m(v().mark((function t() {
		return v().wrap((function(t) {
			for (;;) {
				switch (t.prev = t.next) {
					case 0:
						rootElement = document.querySelector(
							"div[data-featuretarget='login']");
					case 1:
					case "end":
						return t.stop()
				}
			}
		}), t)
	})))).apply(this, arguments)
}

function E() {
	return x.apply(this, arguments)
}

function x() {
	return (x = m(v().mark((function e() {
		var r;
		return v().wrap((function(e) {
			for (;;) {
				switch (e.prev = e.next) {
					case 0:
						return e.prev = 0, e.next = 3, a(c);
					case 3:
						r = e.sent, s(r.data), y(r.data), e.next = 12;
						break;
					case 8:
						e.prev = 8, e.t0 = e.catch(0), console.log(e.t0), t(
							"loginInputError", {
								bizyType: "90"
							});
					case 12:
					case "end":
						return e.stop()
				}
			}
		}), e, null, [
			[0, 8]
		])
	})))).apply(this, arguments)
}
m(v().mark((function t() {
	var e, r;
	return v().wrap((function(t) {
		for (;;) {
			switch (t.prev = t.next) {
				case 0:
					return t.next = 2, w();
				case 2:
					if (rootElement) {
						t.next = 7;
						break
					}
					e = 0, r = setInterval(m(v().mark((function t() {
						return v().wrap((function(t) {
							for (;;) {
								switch (t.prev = t.next) {
									case 0:
										return t.next = 2,
											w();
									case 2:
										if (!rootElement) {
											t.next = 8;
											break
										}
										return clearInterval(
												r), t.next =
											6, E();
									case 6:
										t.next = 10;
										break;
									case 8:
										++e >= 120 &&
											clearInterval(
												r);
									case 10:
									case "end":
										return t.stop()
								}
							}
						}), t)
					}))), 500), t.next = 9;
					break;
				case 7:
					return t.next = 9, E();
				case 9:
				case "end":
					return t.stop()
			}
		}
	}), t)
})))(), window.setInputData = function() {
	var t = m(v().mark((function t(e) {
		var r, n, o, i;
		return v().wrap((function(t) {
			for (;;) {
				switch (t.prev = t.next) {
					case 0:
						return t.next = 2, w();
					case 2:
						(r = u(rootElement)).data && (n = r.data, (o = new DataTransfer)
							.setData("text/plain", e), i = new ClipboardEvent(
								"paste", {
									bubbles: !0,
									cancelable: !0,
									clipboardData: o
								}), n.dispatchEvent(i));
					case 4:
					case "end":
						return t.stop()
				}
			}
		}), t)
	})));
	return function(e) {
		return t.apply(this, arguments)
	}
}(), window.inputVerifyCode = function(t) {
	console.log("native返回的验证码---\x3e", t), setInputData(t)
};
