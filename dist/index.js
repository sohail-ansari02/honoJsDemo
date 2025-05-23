var K = (t, e, s) => {
	return (r, n) => {
		let i = -1;
		return f(0);
		async function f(c) {
			if (c <= i) throw new Error("next() called multiple times");
			i = c;
			let o,
				l = !1,
				h;
			if (t[c]) (h = t[c][0][0]), (r.req.routeIndex = c);
			else h = (c === t.length && n) || void 0;
			if (h)
				try {
					o = await h(r, () => f(c + 1));
				} catch (u) {
					if (u instanceof Error && e)
						(r.error = u), (o = await e(u, r)), (l = !0);
					else throw u;
				}
			else if (r.finalized === !1 && s) o = await s(r);
			if (o && (r.finalized === !1 || l)) r.res = o;
			return r;
		}
	};
};
var tt = async (t, e = Object.create(null)) => {
	const { all: s = !1, dot: r = !1 } = e,
		i = (t instanceof D ? t.raw.headers : t.headers).get("Content-Type");
	if (
		i?.startsWith("multipart/form-data") ||
		i?.startsWith("application/x-www-form-urlencoded")
	)
		return Pt(t, { all: s, dot: r });
	return {};
};
async function Pt(t, e) {
	const s = await t.formData();
	if (s) return Rt(s, e);
	return {};
}
function Rt(t, e) {
	const s = Object.create(null);
	if (
		(t.forEach((r, n) => {
			if (!(e.all || n.endsWith("[]"))) s[n] = r;
			else wt(s, n, r);
		}),
		e.dot)
	)
		Object.entries(s).forEach(([r, n]) => {
			if (r.includes(".")) Ot(s, r, n), delete s[r];
		});
	return s;
}
var wt = (t, e, s) => {
		if (t[e] !== void 0)
			if (Array.isArray(t[e])) t[e].push(s);
			else t[e] = [t[e], s];
		else t[e] = s;
	},
	Ot = (t, e, s) => {
		let r = t,
			n = e.split(".");
		n.forEach((i, f) => {
			if (f === n.length - 1) r[i] = s;
			else {
				if (
					!r[i] ||
					typeof r[i] !== "object" ||
					Array.isArray(r[i]) ||
					r[i] instanceof File
				)
					r[i] = Object.create(null);
				r = r[i];
			}
		});
	};
var _ = (t) => {
		const e = t.split("/");
		if (e[0] === "") e.shift();
		return e;
	},
	et = (t) => {
		const { groups: e, path: s } = Ht(t),
			r = _(s);
		return Et(r, e);
	},
	Ht = (t) => {
		const e = [];
		return (
			(t = t.replace(/\{[^}]+\}/g, (s, r) => {
				const n = `@${r}`;
				return e.push([n, s]), n;
			})),
			{ groups: e, path: t }
		);
	},
	Et = (t, e) => {
		for (let s = e.length - 1; s >= 0; s--) {
			const [r] = e[s];
			for (let n = t.length - 1; n >= 0; n--)
				if (t[n].includes(r)) {
					t[n] = t[n].replace(r, e[s][1]);
					break;
				}
		}
		return t;
	},
	I = {},
	B = (t, e) => {
		if (t === "*") return "*";
		const s = t.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
		if (s) {
			const r = `${t}#${e}`;
			if (!I[r])
				if (s[2])
					I[r] =
						e && e[0] !== ":" && e[0] !== "*"
							? [r, s[1], new RegExp(`^${s[2]}(?=/${e})`)]
							: [t, s[1], new RegExp(`^${s[2]}$`)];
				else I[r] = [t, s[1], !0];
			return I[r];
		}
		return null;
	},
	V = (t, e) => {
		try {
			return e(t);
		} catch {
			return t.replace(/(?:%[0-9A-Fa-f]{2})+/g, (s) => {
				try {
					return e(s);
				} catch {
					return s;
				}
			});
		}
	},
	Nt = (t) => V(t, decodeURI),
	Q = (t) => {
		let e = t.url,
			s = e.indexOf("/", 8),
			r = s;
		for (; r < e.length; r++) {
			const n = e.charCodeAt(r);
			if (n === 37) {
				const i = e.indexOf("?", r),
					f = e.slice(s, i === -1 ? void 0 : i);
				return Nt(f.includes("%25") ? f.replace(/%25/g, "%2525") : f);
			} else if (n === 63) break;
		}
		return e.slice(s, r);
	};
var st = (t) => {
		const e = Q(t);
		return e.length > 1 && e.at(-1) === "/" ? e.slice(0, -1) : e;
	},
	R = (t, e, ...s) => {
		if (s.length) e = R(e, ...s);
		return `${t?.[0] === "/" ? "" : "/"}${t}${e === "/" ? "" : `${t?.at(-1) === "/" ? "" : "/"}${e?.[0] === "/" ? e.slice(1) : e}`}`;
	},
	L = (t) => {
		if (t.charCodeAt(t.length - 1) !== 63 || !t.includes(":")) return null;
		let e = t.split("/"),
			s = [],
			r = "";
		return (
			e.forEach((n) => {
				if (n !== "" && !/\:/.test(n)) r += "/" + n;
				else if (/\:/.test(n))
					if (/\?/.test(n)) {
						if (s.length === 0 && r === "") s.push("/");
						else s.push(r);
						const i = n.replace("?", "");
						(r += "/" + i), s.push(r);
					} else r += "/" + n;
			}),
			s.filter((n, i, f) => f.indexOf(n) === i)
		);
	},
	z = (t) => {
		if (!/[%+]/.test(t)) return t;
		if (t.indexOf("+") !== -1) t = t.replace(/\+/g, " ");
		return t.indexOf("%") !== -1 ? U(t) : t;
	},
	rt = (t, e, s) => {
		let r;
		if (!s && e && !/[%+]/.test(e)) {
			let f = t.indexOf(`?${e}`, 8);
			if (f === -1) f = t.indexOf(`&${e}`, 8);
			while (f !== -1) {
				const c = t.charCodeAt(f + e.length + 1);
				if (c === 61) {
					const o = f + e.length + 2,
						l = t.indexOf("&", o);
					return z(t.slice(o, l === -1 ? void 0 : l));
				} else if (c == 38 || isNaN(c)) return "";
				f = t.indexOf(`&${e}`, f + 1);
			}
			if (((r = /[%+]/.test(t)), !r)) return;
		}
		const n = {};
		r ??= /[%+]/.test(t);
		let i = t.indexOf("?", 8);
		while (i !== -1) {
			let f = t.indexOf("&", i + 1),
				c = t.indexOf("=", i);
			if (c > f && f !== -1) c = -1;
			let o = t.slice(i + 1, c === -1 ? (f === -1 ? void 0 : f) : c);
			if (r) o = z(o);
			if (((i = f), o === "")) continue;
			let l;
			if (c === -1) l = "";
			else if (((l = t.slice(c + 1, f === -1 ? void 0 : f)), r)) l = z(l);
			if (s) {
				if (!(n[o] && Array.isArray(n[o]))) n[o] = [];
				n[o].push(l);
			} else n[o] ??= l;
		}
		return e ? n[e] : n;
	},
	nt = rt,
	it = (t, e) => {
		return rt(t, e, !0);
	},
	U = decodeURIComponent;
var ot = (t) => V(t, U),
	D = class {
		raw;
		#e;
		#t;
		routeIndex = 0;
		path;
		bodyCache = {};
		constructor(t, e = "/", s = [[]]) {
			(this.raw = t), (this.path = e), (this.#t = s), (this.#e = {});
		}
		param(t) {
			return t ? this.#r(t) : this.#i();
		}
		#r(t) {
			const e = this.#t[0][this.routeIndex][1][t],
				s = this.#n(e);
			return s ? (/\%/.test(s) ? ot(s) : s) : void 0;
		}
		#i() {
			const t = {},
				e = Object.keys(this.#t[0][this.routeIndex][1]);
			for (const s of e) {
				const r = this.#n(this.#t[0][this.routeIndex][1][s]);
				if (r && typeof r === "string") t[s] = /\%/.test(r) ? ot(r) : r;
			}
			return t;
		}
		#n(t) {
			return this.#t[1] ? this.#t[1][t] : t;
		}
		query(t) {
			return nt(this.url, t);
		}
		queries(t) {
			return it(this.url, t);
		}
		header(t) {
			if (t) return this.raw.headers.get(t) ?? void 0;
			const e = {};
			return (
				this.raw.headers.forEach((s, r) => {
					e[r] = s;
				}),
				e
			);
		}
		async parseBody(t) {
			return (this.bodyCache.parsedBody ??= await tt(this, t));
		}
		#s = (t) => {
			const { bodyCache: e, raw: s } = this,
				r = e[t];
			if (r) return r;
			const n = Object.keys(e)[0];
			if (n)
				return e[n].then((i) => {
					if (n === "json") i = JSON.stringify(i);
					return new Response(i)[t]();
				});
			return (e[t] = s[t]());
		};
		json() {
			return this.#s("json");
		}
		text() {
			return this.#s("text");
		}
		arrayBuffer() {
			return this.#s("arrayBuffer");
		}
		blob() {
			return this.#s("blob");
		}
		formData() {
			return this.#s("formData");
		}
		addValidatedData(t, e) {
			this.#e[t] = e;
		}
		valid(t) {
			return this.#e[t];
		}
		get url() {
			return this.raw.url;
		}
		get method() {
			return this.raw.method;
		}
		get matchedRoutes() {
			return this.#t[0].map(([[, t]]) => t);
		}
		get routePath() {
			return this.#t[0].map(([[, t]]) => t)[this.routeIndex].path;
		}
	};
var ct = { Stringify: 1, BeforeStream: 2, Stream: 3 },
	$t = (t, e) => {
		const s = new String(t);
		return (s.isEscaped = !0), (s.callbacks = e), s;
	};
var W = async (t, e, s, r, n) => {
	if (typeof t === "object" && !(t instanceof String)) {
		if (!(t instanceof Promise)) t = t.toString();
		if (t instanceof Promise) t = await t;
	}
	const i = t.callbacks;
	if (!i?.length) return Promise.resolve(t);
	if (n) n[0] += t;
	else n = [t];
	const f = Promise.all(
		i.map((c) => c({ phase: e, buffer: n, context: r })),
	).then((c) =>
		Promise.all(c.filter(Boolean).map((o) => W(o, e, !1, r, n))).then(
			() => n[0],
		),
	);
	if (s) return $t(await f, i);
	else return f;
};
var jt = "text/plain; charset=UTF-8",
	X = (t, e = {}) => {
		for (const s of Object.keys(e)) t.set(s, e[s]);
		return t;
	},
	ft = class {
		#e;
		#t;
		env = {};
		#r;
		finalized = !1;
		error;
		#i = 200;
		#n;
		#s;
		#o;
		#f;
		#l = !0;
		#a;
		#h;
		#u;
		#d;
		#g;
		constructor(t, e) {
			if (((this.#e = t), e))
				(this.#n = e.executionCtx),
					(this.env = e.env),
					(this.#u = e.notFoundHandler),
					(this.#g = e.path),
					(this.#d = e.matchResult);
		}
		get req() {
			return (this.#t ??= new D(this.#e, this.#g, this.#d)), this.#t;
		}
		get event() {
			if (this.#n && "respondWith" in this.#n) return this.#n;
			else throw Error("This context has no FetchEvent");
		}
		get executionCtx() {
			if (this.#n) return this.#n;
			else throw Error("This context has no ExecutionContext");
		}
		get res() {
			return (
				(this.#l = !1),
				(this.#f ||= new Response("404 Not Found", { status: 404 }))
			);
		}
		set res(t) {
			if (((this.#l = !1), this.#f && t)) {
				t = new Response(t.body, t);
				for (const [e, s] of this.#f.headers.entries()) {
					if (e === "content-type") continue;
					if (e === "set-cookie") {
						const r = this.#f.headers.getSetCookie();
						t.headers.delete("set-cookie");
						for (const n of r) t.headers.append("set-cookie", n);
					} else t.headers.set(e, s);
				}
			}
			(this.#f = t), (this.finalized = !0);
		}
		render = (...t) => {
			return (this.#h ??= (e) => this.html(e)), this.#h(...t);
		};
		setLayout = (t) => (this.#a = t);
		getLayout = () => this.#a;
		setRenderer = (t) => {
			this.#h = t;
		};
		header = (t, e, s) => {
			if (this.finalized) this.#f = new Response(this.#f.body, this.#f);
			if (e === void 0) {
				if (this.#s) this.#s.delete(t);
				else if (this.#o) delete this.#o[t.toLocaleLowerCase()];
				if (this.finalized) this.res.headers.delete(t);
				return;
			}
			if (s?.append) {
				if (!this.#s)
					(this.#l = !1), (this.#s = new Headers(this.#o)), (this.#o = {});
				this.#s.append(t, e);
			} else if (this.#s) this.#s.set(t, e);
			else (this.#o ??= {}), (this.#o[t.toLowerCase()] = e);
			if (this.finalized)
				if (s?.append) this.res.headers.append(t, e);
				else this.res.headers.set(t, e);
		};
		status = (t) => {
			(this.#l = !1), (this.#i = t);
		};
		set = (t, e) => {
			(this.#r ??= new Map()), this.#r.set(t, e);
		};
		get = (t) => {
			return this.#r ? this.#r.get(t) : void 0;
		};
		get var() {
			if (!this.#r) return {};
			return Object.fromEntries(this.#r);
		}
		#c(t, e, s) {
			if (this.#l && !s && !e && this.#i === 200)
				return new Response(t, { headers: this.#o });
			if (e && typeof e !== "number") {
				const n = new Headers(e.headers);
				if (this.#s)
					this.#s.forEach((f, c) => {
						if (c === "set-cookie") n.append(c, f);
						else n.set(c, f);
					});
				const i = X(n, this.#o);
				return new Response(t, { headers: i, status: e.status ?? this.#i });
			}
			const r = typeof e === "number" ? e : this.#i;
			if (
				((this.#o ??= {}),
				(this.#s ??= new Headers()),
				X(this.#s, this.#o),
				this.#f)
			)
				this.#f.headers.forEach((n, i) => {
					if (i === "set-cookie") this.#s?.append(i, n);
					else this.#s?.set(i, n);
				}),
					X(this.#s, this.#o);
			s ??= {};
			for (const [n, i] of Object.entries(s))
				if (typeof i === "string") this.#s.set(n, i);
				else {
					this.#s.delete(n);
					for (const f of i) this.#s.append(n, f);
				}
			return new Response(t, { status: r, headers: this.#s });
		}
		newResponse = (...t) => this.#c(...t);
		body = (t, e, s) => {
			return typeof e === "number" ? this.#c(t, e, s) : this.#c(t, e);
		};
		text = (t, e, s) => {
			if (!this.#o) {
				if (this.#l && !s && !e) return new Response(t);
				this.#o = {};
			}
			if (((this.#o["content-type"] = jt), typeof e === "number"))
				return this.#c(t, e, s);
			return this.#c(t, e);
		};
		json = (t, e, s) => {
			const r = JSON.stringify(t);
			return (
				(this.#o ??= {}),
				(this.#o["content-type"] = "application/json"),
				typeof e === "number" ? this.#c(r, e, s) : this.#c(r, e)
			);
		};
		html = (t, e, s) => {
			if (
				((this.#o ??= {}),
				(this.#o["content-type"] = "text/html; charset=UTF-8"),
				typeof t === "object")
			)
				return W(t, ct.Stringify, !1, {}).then((r) => {
					return typeof e === "number" ? this.#c(r, e, s) : this.#c(r, e);
				});
			return typeof e === "number" ? this.#c(t, e, s) : this.#c(t, e);
		};
		redirect = (t, e) => {
			return (
				(this.#s ??= new Headers()),
				this.#s.set("Location", String(t)),
				this.newResponse(null, e ?? 302)
			);
		};
		notFound = () => {
			return (this.#u ??= () => new Response()), this.#u(this);
		};
	};
var g = "ALL",
	lt = "all",
	ht = ["get", "post", "put", "delete", "options", "patch"],
	F = "Can not add a route since the matcher is already built.",
	q = class extends Error {};
var ut = "__COMPOSED_HANDLER";
var St = (t) => {
		return t.text("404 Not Found", 404);
	},
	at = (t, e) => {
		if ("getResponse" in t) return t.getResponse();
		return console.error(t), e.text("Internal Server Error", 500);
	},
	G = class {
		get;
		post;
		put;
		delete;
		options;
		patch;
		all;
		on;
		use;
		router;
		getPath;
		_basePath = "/";
		#e = "/";
		routes = [];
		constructor(t = {}) {
			[...ht, lt].forEach((n) => {
				this[n] = (i, ...f) => {
					if (typeof i === "string") this.#e = i;
					else this.#i(n, this.#e, i);
					return (
						f.forEach((c) => {
							this.#i(n, this.#e, c);
						}),
						this
					);
				};
			}),
				(this.on = (n, i, ...f) => {
					for (const c of [i].flat()) {
						this.#e = c;
						for (const o of [n].flat())
							f.map((l) => {
								this.#i(o.toUpperCase(), this.#e, l);
							});
					}
					return this;
				}),
				(this.use = (n, ...i) => {
					if (typeof n === "string") this.#e = n;
					else (this.#e = "*"), i.unshift(n);
					return (
						i.forEach((f) => {
							this.#i(g, this.#e, f);
						}),
						this
					);
				});
			const { strict: s, ...r } = t;
			Object.assign(this, r),
				(this.getPath = (s ?? !0) ? (t.getPath ?? Q) : st);
		}
		#t() {
			const t = new G({ router: this.router, getPath: this.getPath });
			return (t.routes = this.routes), t;
		}
		#r = St;
		errorHandler = at;
		route(t, e) {
			const s = this.basePath(t);
			return (
				e.routes.map((r) => {
					let n;
					if (e.errorHandler === at) n = r.handler;
					else
						(n = async (i, f) =>
							(await K([], e.errorHandler)(i, () => r.handler(i, f))).res),
							(n[ut] = r.handler);
					s.#i(r.method, r.path, n);
				}),
				this
			);
		}
		basePath(t) {
			const e = this.#t();
			return (e._basePath = R(this._basePath, t)), e;
		}
		onError = (t) => {
			return (this.errorHandler = t), this;
		};
		notFound = (t) => {
			return (this.#r = t), this;
		};
		mount(t, e, s) {
			let r, n;
			if (s)
				if (typeof s === "function") n = s;
				else if (((n = s.optionHandler), s.replaceRequest === !1)) r = (c) => c;
				else r = s.replaceRequest;
			const i = n
				? (c) => {
						const o = n(c);
						return Array.isArray(o) ? o : [o];
					}
				: (c) => {
						let o = void 0;
						try {
							o = c.executionCtx;
						} catch {}
						return [c.env, o];
					};
			r ||= (() => {
				const c = R(this._basePath, t),
					o = c === "/" ? 0 : c.length;
				return (l) => {
					const h = new URL(l.url);
					return (h.pathname = h.pathname.slice(o) || "/"), new Request(h, l);
				};
			})();
			const f = async (c, o) => {
				const l = await e(r(c.req.raw), ...i(c));
				if (l) return l;
				await o();
			};
			return this.#i(g, R(t, "*"), f), this;
		}
		#i(t, e, s) {
			(t = t.toUpperCase()), (e = R(this._basePath, e));
			const r = { path: e, method: t, handler: s };
			this.router.add(t, e, [s, r]), this.routes.push(r);
		}
		#n(t, e) {
			if (t instanceof Error) return this.errorHandler(t, e);
			throw t;
		}
		#s(t, e, s, r) {
			if (r === "HEAD")
				return (async () =>
					new Response(null, await this.#s(t, e, s, "GET")))();
			const n = this.getPath(t, { env: s }),
				i = this.router.match(r, n),
				f = new ft(t, {
					path: n,
					matchResult: i,
					env: s,
					executionCtx: e,
					notFoundHandler: this.#r,
				});
			if (i[0].length === 1) {
				let o;
				try {
					o = i[0][0][0][0](f, async () => {
						f.res = await this.#r(f);
					});
				} catch (l) {
					return this.#n(l, f);
				}
				return o instanceof Promise
					? o
							.then((l) => l || (f.finalized ? f.res : this.#r(f)))
							.catch((l) => this.#n(l, f))
					: (o ?? this.#r(f));
			}
			const c = K(i[0], this.errorHandler, this.#r);
			return (async () => {
				try {
					const o = await c(f);
					if (!o.finalized)
						throw new Error(
							"Context is not finalized. Did you forget to return a Response object or `await next()`?",
						);
					return o.res;
				} catch (o) {
					return this.#n(o, f);
				}
			})();
		}
		fetch = (t, ...e) => {
			return this.#s(t, e[1], e[0], t.method);
		};
		request = (t, e, s, r) => {
			if (t instanceof Request)
				return this.fetch(e ? new Request(t, e) : t, s, r);
			return (
				(t = t.toString()),
				this.fetch(
					new Request(
						/^https?:\/\//.test(t) ? t : `http://localhost${R("/", t)}`,
						e,
					),
					s,
					r,
				)
			);
		};
		fire = () => {
			addEventListener("fetch", (t) => {
				t.respondWith(this.#s(t.request, t, void 0, t.request.method));
			});
		};
	};
var C = "[^/]+",
	N = ".*",
	$ = "(?:|/.*)",
	O = Symbol(),
	Dt = new Set(".\\+*[^]$()");
function It(t, e) {
	if (t.length === 1) return e.length === 1 ? (t < e ? -1 : 1) : -1;
	if (e.length === 1) return 1;
	if (t === N || t === $) return 1;
	else if (e === N || e === $) return -1;
	if (t === C) return 1;
	else if (e === C) return -1;
	return t.length === e.length ? (t < e ? -1 : 1) : e.length - t.length;
}
var A = class {
	#e;
	#t;
	#r = Object.create(null);
	insert(t, e, s, r, n) {
		if (t.length === 0) {
			if (this.#e !== void 0) throw O;
			if (n) return;
			this.#e = e;
			return;
		}
		let [i, ...f] = t,
			c =
				i === "*"
					? f.length === 0
						? ["", "", N]
						: ["", "", C]
					: i === "/*"
						? ["", "", $]
						: i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),
			o;
		if (c) {
			let l = c[1],
				h = c[2] || C;
			if (l && c[2]) {
				if (
					((h = h.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:")),
					/\((?!\?:)/.test(h))
				)
					throw O;
			}
			if (((o = this.#r[h]), !o)) {
				if (Object.keys(this.#r).some((u) => u !== N && u !== $)) throw O;
				if (n) return;
				if (((o = this.#r[h] = new A()), l !== "")) o.#t = r.varIndex++;
			}
			if (!n && l !== "") s.push([l, o.#t]);
		} else if (((o = this.#r[i]), !o)) {
			if (Object.keys(this.#r).some((l) => l.length > 1 && l !== N && l !== $))
				throw O;
			if (n) return;
			o = this.#r[i] = new A();
		}
		o.insert(f, e, s, r, n);
	}
	buildRegExpStr() {
		const e = Object.keys(this.#r)
			.sort(It)
			.map((s) => {
				const r = this.#r[s];
				return (
					(typeof r.#t === "number"
						? `(${s})@${r.#t}`
						: Dt.has(s)
							? `\\${s}`
							: s) + r.buildRegExpStr()
				);
			});
		if (typeof this.#e === "number") e.unshift(`#${this.#e}`);
		if (e.length === 0) return "";
		if (e.length === 1) return e[0];
		return "(?:" + e.join("|") + ")";
	}
};
var dt = class {
	#e = { varIndex: 0 };
	#t = new A();
	insert(t, e, s) {
		const r = [],
			n = [];
		for (let f = 0; ; ) {
			let c = !1;
			if (
				((t = t.replace(/\{[^}]+\}/g, (o) => {
					const l = `@\\${f}`;
					return (n[f] = [l, o]), f++, (c = !0), l;
				})),
				!c)
			)
				break;
		}
		const i = t.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
		for (let f = n.length - 1; f >= 0; f--) {
			const [c] = n[f];
			for (let o = i.length - 1; o >= 0; o--)
				if (i[o].indexOf(c) !== -1) {
					i[o] = i[o].replace(c, n[f][1]);
					break;
				}
		}
		return this.#t.insert(i, e, r, this.#e, s), r;
	}
	buildRegExp() {
		let t = this.#t.buildRegExpStr();
		if (t === "") return [/^$/, [], []];
		let e = 0,
			s = [],
			r = [];
		return (
			(t = t.replace(/#(\d+)|@(\d+)|\.\*\$/g, (n, i, f) => {
				if (i !== void 0) return (s[++e] = Number(i)), "$()";
				if (f !== void 0) return (r[Number(f)] = ++e), "";
				return "";
			})),
			[new RegExp(`^${t}`), s, r]
		);
	}
};
var gt = [],
	Lt = [/^$/, [], Object.create(null)],
	pt = Object.create(null);
function yt(t) {
	return (pt[t] ??= new RegExp(
		t === "*"
			? ""
			: `^${t.replace(/\/\*$|([.\\+*[^\]$()])/g, (e, s) => (s ? `\\${s}` : "(?:|/.*)"))}$`,
	));
}
function Ft() {
	pt = Object.create(null);
}
function qt(t) {
	const e = new dt(),
		s = [];
	if (t.length === 0) return Lt;
	const r = t
			.map((l) => [!/\*|\/:/.test(l[0]), ...l])
			.sort(([l, h], [u, d]) => (l ? 1 : u ? -1 : h.length - d.length)),
		n = Object.create(null);
	for (let l = 0, h = -1, u = r.length; l < u; l++) {
		const [d, p, a] = r[l];
		if (d) n[p] = [a.map(([x]) => [x, Object.create(null)]), gt];
		else h++;
		let y;
		try {
			y = e.insert(p, h, d);
		} catch (x) {
			throw x === O ? new q(p) : x;
		}
		if (d) continue;
		s[h] = a.map(([x, w]) => {
			const E = Object.create(null);
			w -= 1;
			for (; w >= 0; w--) {
				const [v, T] = y[w];
				E[v] = T;
			}
			return [x, E];
		});
	}
	const [i, f, c] = e.buildRegExp();
	for (let l = 0, h = s.length; l < h; l++)
		for (let u = 0, d = s[l].length; u < d; u++) {
			const p = s[l][u]?.[1];
			if (!p) continue;
			const a = Object.keys(p);
			for (let y = 0, x = a.length; y < x; y++) p[a[y]] = c[p[a[y]]];
		}
	const o = [];
	for (const l in f) o[l] = s[f[l]];
	return [i, o, n];
}
function H(t, e) {
	if (!t) return;
	for (const s of Object.keys(t).sort((r, n) => n.length - r.length))
		if (yt(s).test(e)) return [...t[s]];
	return;
}
var J = class {
	name = "RegExpRouter";
	#e;
	#t;
	constructor() {
		(this.#e = { [g]: Object.create(null) }),
			(this.#t = { [g]: Object.create(null) });
	}
	add(t, e, s) {
		const r = this.#e,
			n = this.#t;
		if (!r || !n) throw new Error(F);
		if (!r[t])
			[r, n].forEach((c) => {
				(c[t] = Object.create(null)),
					Object.keys(c[g]).forEach((o) => {
						c[t][o] = [...c[g][o]];
					});
			});
		if (e === "/*") e = "*";
		const i = (e.match(/\/:/g) || []).length;
		if (/\*$/.test(e)) {
			const c = yt(e);
			if (t === g)
				Object.keys(r).forEach((o) => {
					r[o][e] ||= H(r[o], e) || H(r[g], e) || [];
				});
			else r[t][e] ||= H(r[t], e) || H(r[g], e) || [];
			Object.keys(r).forEach((o) => {
				if (t === g || t === o)
					Object.keys(r[o]).forEach((l) => {
						c.test(l) && r[o][l].push([s, i]);
					});
			}),
				Object.keys(n).forEach((o) => {
					if (t === g || t === o)
						Object.keys(n[o]).forEach((l) => c.test(l) && n[o][l].push([s, i]));
				});
			return;
		}
		const f = L(e) || [e];
		for (let c = 0, o = f.length; c < o; c++) {
			const l = f[c];
			Object.keys(n).forEach((h) => {
				if (t === g || t === h)
					(n[h][l] ||= [...(H(r[h], l) || H(r[g], l) || [])]),
						n[h][l].push([s, i - o + c + 1]);
			});
		}
	}
	match(t, e) {
		Ft();
		const s = this.#r();
		return (
			(this.match = (r, n) => {
				const i = s[r] || s[g],
					f = i[2][n];
				if (f) return f;
				const c = n.match(i[0]);
				if (!c) return [[], gt];
				const o = c.indexOf("", 1);
				return [i[1][o], c];
			}),
			this.match(t, e)
		);
	}
	#r() {
		const t = Object.create(null);
		return (
			Object.keys(this.#t)
				.concat(Object.keys(this.#e))
				.forEach((e) => {
					t[e] ||= this.#i(e);
				}),
			(this.#e = this.#t = void 0),
			t
		);
	}
	#i(t) {
		let e = [],
			s = t === g;
		if (
			([this.#e, this.#t].forEach((r) => {
				const n = r[t] ? Object.keys(r[t]).map((i) => [i, r[t][i]]) : [];
				if (n.length !== 0) (s ||= !0), e.push(...n);
				else if (t !== g) e.push(...Object.keys(r[g]).map((i) => [i, r[g][i]]));
			}),
			!s)
		)
			return null;
		else return qt(e);
	}
};
var k = class {
	name = "SmartRouter";
	#e = [];
	#t = [];
	constructor(t) {
		this.#e = t.routers;
	}
	add(t, e, s) {
		if (!this.#t) throw new Error(F);
		this.#t.push([t, e, s]);
	}
	match(t, e) {
		if (!this.#t) throw new Error("Fatal error");
		let s = this.#e,
			r = this.#t,
			n = s.length,
			i = 0,
			f;
		for (; i < n; i++) {
			const c = s[i];
			try {
				for (let o = 0, l = r.length; o < l; o++) c.add(...r[o]);
				f = c.match(t, e);
			} catch (o) {
				if (o instanceof q) continue;
				throw o;
			}
			(this.match = c.match.bind(c)), (this.#e = [c]), (this.#t = void 0);
			break;
		}
		if (i === n) throw new Error("Fatal error");
		return (this.name = `SmartRouter + ${this.activeRouter.name}`), f;
	}
	get activeRouter() {
		if (this.#t || this.#e.length !== 1)
			throw new Error("No active router has been determined yet.");
		return this.#e[0];
	}
};
var j = Object.create(null),
	Z = class {
		#e;
		#t;
		#r;
		#i = 0;
		#n = j;
		constructor(t, e, s) {
			if (((this.#t = s || Object.create(null)), (this.#e = []), t && e)) {
				const r = Object.create(null);
				(r[t] = { handler: e, possibleKeys: [], score: 0 }), (this.#e = [r]);
			}
			this.#r = [];
		}
		insert(t, e, s) {
			this.#i = ++this.#i;
			let r = this,
				n = et(e),
				i = [];
			for (let o = 0, l = n.length; o < l; o++) {
				const h = n[o],
					u = n[o + 1],
					d = B(h, u),
					p = Array.isArray(d) ? d[0] : h;
				if (Object.keys(r.#t).includes(p)) {
					r = r.#t[p];
					const a = B(h, u);
					if (a) i.push(a[1]);
					continue;
				}
				if (((r.#t[p] = new Z()), d)) r.#r.push(d), i.push(d[1]);
				r = r.#t[p];
			}
			const f = Object.create(null),
				c = {
					handler: s,
					possibleKeys: i.filter((o, l, h) => h.indexOf(o) === l),
					score: this.#i,
				};
			return (f[t] = c), r.#e.push(f), r;
		}
		#s(t, e, s, r) {
			const n = [];
			for (let i = 0, f = t.#e.length; i < f; i++) {
				const c = t.#e[i],
					o = c[e] || c[g],
					l = {};
				if (o !== void 0) {
					if (
						((o.params = Object.create(null)),
						n.push(o),
						s !== j || (r && r !== j))
					)
						for (let h = 0, u = o.possibleKeys.length; h < u; h++) {
							const d = o.possibleKeys[h],
								p = l[o.score];
							(o.params[d] = r?.[d] && !p ? r[d] : (s[d] ?? r?.[d])),
								(l[o.score] = !0);
						}
				}
			}
			return n;
		}
		search(t, e) {
			const s = [];
			this.#n = j;
			let n = [this],
				i = _(e),
				f = [];
			for (let c = 0, o = i.length; c < o; c++) {
				const l = i[c],
					h = c === o - 1,
					u = [];
				for (let d = 0, p = n.length; d < p; d++) {
					const a = n[d],
						y = a.#t[l];
					if (y)
						if (((y.#n = a.#n), h)) {
							if (y.#t["*"]) s.push(...this.#s(y.#t["*"], t, a.#n));
							s.push(...this.#s(y, t, a.#n));
						} else u.push(y);
					for (let x = 0, w = a.#r.length; x < w; x++) {
						const E = a.#r[x],
							v = a.#n === j ? {} : { ...a.#n };
						if (E === "*") {
							const P = a.#t["*"];
							if (P) s.push(...this.#s(P, t, a.#n)), (P.#n = v), u.push(P);
							continue;
						}
						if (l === "") continue;
						const [T, M, S] = E,
							b = a.#t[T],
							vt = i.slice(c).join("/");
						if (S instanceof RegExp) {
							const P = S.exec(vt);
							if (P) {
								if (
									((v[M] = P[0]),
									s.push(...this.#s(b, t, a.#n, v)),
									Object.keys(b.#t).length)
								) {
									b.#n = v;
									const bt = P[0].match(/\//)?.length ?? 0;
									(f[bt] ||= []).push(b);
								}
								continue;
							}
						}
						if (S === !0 || S.test(l))
							if (((v[M] = l), h)) {
								if ((s.push(...this.#s(b, t, v, a.#n)), b.#t["*"]))
									s.push(...this.#s(b.#t["*"], t, v, a.#n));
							} else (b.#n = v), u.push(b);
					}
				}
				n = u.concat(f.shift() ?? []);
			}
			if (s.length > 1)
				s.sort((c, o) => {
					return c.score - o.score;
				});
			return [s.map(({ handler: c, params: o }) => [c, o])];
		}
	};
var Y = class {
	name = "TrieRouter";
	#e;
	constructor() {
		this.#e = new Z();
	}
	add(t, e, s) {
		const r = L(e);
		if (r) {
			for (let n = 0, i = r.length; n < i; n++) this.#e.insert(t, r[n], s);
			return;
		}
		this.#e.insert(t, e, s);
	}
	match(t, e) {
		return this.#e.search(t, e);
	}
};
var m = class extends G {
	constructor(t = {}) {
		super(t);
		this.router = t.router ?? new k({ routers: [new J(), new Y()] });
	}
};
var xt = new m();
xt.get("/", (t) => {
	return t.text("Hello Hono!");
});
var Qe = xt;
export { Qe as default };
