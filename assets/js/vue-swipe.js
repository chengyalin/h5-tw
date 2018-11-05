! function(t, e) {
	"object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.VueSwipe = e() : t.VueSwipe = e()
}(this, function() {
	return function(t) {
		function e(i) {
			if(n[i]) return n[i].exports;
			var s = n[i] = {
				exports: {},
				id: i,
				loaded: !1
			};
			return t[i].call(s.exports, s, s.exports, e), s.loaded = !0, s.exports
		}
		var n = {};
		return e.m = t, e.c = n, e.p = "", e(0)
	}([function(t, e, n) {
		"use strict";

		function i(t) {
			return t && t.__esModule ? t : {
				"default": t
			}
		}
		Object.defineProperty(e, "__esModule", {
			value: !0
		}), e.SwipeItem = e.Swipe = void 0;
		var s = n(7),
			a = i(s),
			r = n(6),
			o = i(r);
		e.Swipe = a["default"], e.SwipeItem = o["default"]
	}, function(t, e) {
		"use strict";
		Object.defineProperty(e, "__esModule", {
			value: !0
		}), e["default"] = {
			name: "mt-swipe-item",
			mounted: function() {
				this.$parent && this.$parent.swipeItemCreated(this)
			},
			destroyed: function() {
				this.$parent && this.$parent.swipeItemDestroyed(this)
			}
		}
	}, function(t, e, n) {
		"use strict";
		Object.defineProperty(e, "__esModule", {
			value: !0
		});
		var i = n(4),
			s = n(3);
		e["default"] = {
			name: "mt-swipe",
			created: function() {
				this.dragState = {}
			},
			data: function() {
				return {
					ready: !1,
					dragging: !1,
					userScrolling: !1,
					animating: !1,
					index: 0,
					pages: [],
					timer: null,
					reInitTimer: null,
					noDrag: !1
				}
			},
			props: {
				speed: {
					type: Number,
					"default": 300
				},
				auto: {
					type: Number,
					"default": 6e3
				},
				continuous: {
					type: Boolean,
					"default": !0
				},
				showIndicators: {
					type: Boolean,
					"default": !0
				},
				noDragWhenSingle: {
					type: Boolean,
					"default": !0
				},
				prevent: {
					type: Boolean,
					"default": !1
				}
			},
			methods: {
				swipeItemCreated: function() {
					var t = this;
					this.ready && (clearTimeout(this.reInitTimer), this.reInitTimer = setTimeout(function() {
						t.reInitPages()
					}, 100))
				},
				swipeItemDestroyed: function() {
					var t = this;
					this.ready && (clearTimeout(this.reInitTimer), this.reInitTimer = setTimeout(function() {
						t.reInitPages()
					}, 100))
				},
				translate: function(t, e, n, s) {
					var a = this,
						r = arguments;
					if(n) {
						this.animating = !0, t.style.webkitTransition = "-webkit-transform " + n + "ms ease-in-out", setTimeout(function() {
							t.style.webkitTransform = "translate3d(" + e + "px, 0, 0)"
						}, 50);
						var o = !1,
							l = function() {
								o || (o = !0, a.animating = !1, t.style.webkitTransition = "", t.style.webkitTransform = "", s && s.apply(a, r))
							};
						(0, i.once)(t, "webkitTransitionEnd", l), setTimeout(l, n + 100)
					} else t.style.webkitTransition = "", t.style.webkitTransform = "translate3d(" + e + "px, 0, 0)"
				},
				reInitPages: function() {
					var t = this.$children;
					this.noDrag = 1 === t.length && this.noDragWhenSingle;
					var e = [];
					this.index = 0, t.forEach(function(t, n) {
						e.push(t.$el), (0, s.removeClass)(t.$el, "is-active"), 0 === n && (0, s.addClass)(t.$el, "is-active")
					}), this.pages = e
				},
				doAnimate: function(t, e) {
					var n = this;
					if(0 !== this.$children.length && (e || !(this.$children.length < 2))) {
						var i, a, r, o, l, u = this.speed || 300,
							c = this.index,
							d = this.pages,
							h = d.length;
						e ? (i = e.prevPage, r = e.currentPage, a = e.nextPage, o = e.pageWidth, l = e.offsetLeft) : (o = this.$el.clientWidth, r = d[c], i = d[c - 1], a = d[c + 1], this.continuous && d.length > 1 && (i || (i = d[d.length - 1]), a || (a = d[0])), i && (i.style.display = "block", this.translate(i, -o)), a && (a.style.display = "block", this.translate(a, o)));
						var f, p = this.$children[c].$el;
						"prev" === t ? (c > 0 && (f = c - 1), this.continuous && 0 === c && (f = h - 1)) : "next" === t && (h - 1 > c && (f = c + 1), this.continuous && c === h - 1 && (f = 0));
						var g = function() {
							if(void 0 !== f) {
								var t = n.$children[f].$el;
								(0, s.removeClass)(p, "is-active"), (0, s.addClass)(t, "is-active"), n.index = f
							}
							i && (i.style.display = ""), a && (a.style.display = "")
						};
						setTimeout(function() {
							"next" === t ? (n.translate(r, -o, u, g), a && n.translate(a, 0, u)) : "prev" === t ? (n.translate(r, o, u, g), i && n.translate(i, 0, u)) : (n.translate(r, 0, u, g), "undefined" != typeof l ? (i && l > 0 && n.translate(i, -1 * o, u), a && 0 > l && n.translate(a, o, u)) : (i && n.translate(i, -1 * o, u), a && n.translate(a, o, u)))
						}, 10)
					}
				},
				next: function() {
					this.doAnimate("next")
				},
				prev: function() {
					this.doAnimate("prev")
				},
				doOnTouchStart: function(t) {
					if(!this.noDrag) {
						var e = this.$el,
							n = this.dragState,
							i = t.touches[0];
						n.startTime = new Date, n.startLeft = i.pageX, n.startTop = i.pageY, n.startTopAbsolute = i.clientY, n.pageWidth = e.offsetWidth, n.pageHeight = e.offsetHeight;
						var s = this.$children[this.index - 1],
							a = this.$children[this.index],
							r = this.$children[this.index + 1];
						this.continuous && this.pages.length > 1 && (s || (s = this.$children[this.$children.length - 1]), r || (r = this.$children[0])), n.prevPage = s ? s.$el : null, n.dragPage = a ? a.$el : null, n.nextPage = r ? r.$el : null, n.prevPage && (n.prevPage.style.display = "block"), n.nextPage && (n.nextPage.style.display = "block")
					}
				},
				doOnTouchMove: function(t) {
					if(!this.noDrag) {
						var e = this.dragState,
							n = t.touches[0];
						e.currentLeft = n.pageX, e.currentTop = n.pageY, e.currentTopAbsolute = n.clientY;
						var i = e.currentLeft - e.startLeft,
							s = e.currentTopAbsolute - e.startTopAbsolute,
							a = Math.abs(i),
							r = Math.abs(s);
						if(5 > a || a >= 5 && r >= 1.73 * a) return void(this.userScrolling = !0);
						this.userScrolling = !1, t.preventDefault(), i = Math.min(Math.max(-e.pageWidth + 1, i), e.pageWidth - 1);
						var o = 0 > i ? "next" : "prev";
						e.prevPage && "prev" === o && this.translate(e.prevPage, i - e.pageWidth), this.translate(e.dragPage, i), e.nextPage && "next" === o && this.translate(e.nextPage, i + e.pageWidth)
					}
				},
				doOnTouchEnd: function() {
					if(!this.noDrag) {
						var t = this.dragState,
							e = new Date - t.startTime,
							n = null,
							i = t.currentLeft - t.startLeft,
							s = t.currentTop - t.startTop,
							a = t.pageWidth,
							r = this.index,
							o = this.pages.length;
						if(300 > e) {
							var l = Math.abs(i) < 5 && Math.abs(s) < 5;
							(isNaN(i) || isNaN(s)) && (l = !0), l && this.$children[this.index].$emit("tap")
						}
						300 > e && void 0 === t.currentLeft || ((300 > e || Math.abs(i) > a / 2) && (n = 0 > i ? "next" : "prev"), this.continuous || (0 === r && "prev" === n || r === o - 1 && "next" === n) && (n = null), this.$children.length < 2 && (n = null), this.doAnimate(n, {
							offsetLeft: i,
							pageWidth: t.pageWidth,
							prevPage: t.prevPage,
							currentPage: t.dragPage,
							nextPage: t.nextPage
						}), this.dragState = {})
					}
				}
			},
			destroyed: function() {
				this.timer && (clearInterval(this.timer), this.timer = null), this.reInitTimer && (clearTimeout(this.reInitTimer), this.reInitTimer = null)
			},
			mounted: function() {
				var t = this;
				this.ready = !0, this.auto > 0 && (this.timer = setInterval(function() {
					t.dragging || t.animating || t.next()
				}, this.auto)), this.reInitPages();
				var e = this.$el;
				e.addEventListener("touchstart", function(e) {
					t.prevent && e.preventDefault(), t.animating || (t.dragging = !0, t.userScrolling = !1, t.doOnTouchStart(e))
				}), e.addEventListener("touchmove", function(e) {
					t.dragging && t.doOnTouchMove(e)
				}), e.addEventListener("touchend", function(e) {
					return t.userScrolling ? (t.dragging = !1, void(t.dragState = {})) : void(t.dragging && (t.doOnTouchEnd(e), t.dragging = !1))
				})
			}
		}
	}, function(t, e) {
		"use strict";
		var n = function(t) {
				return(t || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "")
			},
			i = function(t, e) {
				if(!t || !e) return !1;
				if(-1 != e.indexOf(" ")) throw new Error("className should not contain space.");
				return t.classList ? t.classList.contains(e) : (" " + t.className + " ").indexOf(" " + e + " ") > -1
			},
			s = function(t, e) {
				if(t) {
					for(var n = t.className, s = (e || "").split(" "), a = 0, r = s.length; r > a; a++) {
						var o = s[a];
						o && (t.classList ? t.classList.add(o) : i(t, o) || (n += " " + o))
					}
					t.classList || (t.className = n)
				}
			},
			a = function(t, e) {
				if(t && e) {
					for(var s = e.split(" "), a = " " + t.className + " ", r = 0, o = s.length; o > r; r++) {
						var l = s[r];
						l && (t.classList ? t.classList.remove(l) : i(t, l) && (a = a.replace(" " + l + " ", " ")))
					}
					t.classList || (t.className = n(a))
				}
			};
		t.exports = {
			hasClass: i,
			addClass: s,
			removeClass: a
		}
	}, function(t, e) {
		"use strict";
		var n = function() {
				return document.addEventListener ? function(t, e, n) {
					t && e && n && t.addEventListener(e, n, !1)
				} : function(t, e, n) {
					t && e && n && t.attachEvent("on" + e, n)
				}
			}(),
			i = function() {
				return document.removeEventListener ? function(t, e, n) {
					t && e && t.removeEventListener(e, n, !1)
				} : function(t, e, n) {
					t && e && t.detachEvent("on" + e, n)
				}
			}(),
			s = function(t, e, s) {
				var a = function r() {
					s && s.apply(this, arguments), i(t, e, r)
				};
				n(t, e, a)
			};
		t.exports = {
			on: n,
			off: i,
			once: s
		}
	}, function(t, e) {}, function(t, e, n) {
		var i, s;
		i = n(1);
		var a = n(9);
		s = i = i || {}, ("object" == typeof i["default"] || "function" == typeof i["default"]) && (s = i = i["default"]), "function" == typeof s && (s = s.options), s.render = a.render, s.staticRenderFns = a.staticRenderFns, t.exports = i
	}, function(t, e, n) {
		var i, s;
		n(5), i = n(2);
		var a = n(8);
		s = i = i || {}, ("object" == typeof i["default"] || "function" == typeof i["default"]) && (s = i = i["default"]), "function" == typeof s && (s = s.options), s.render = a.render, s.staticRenderFns = a.staticRenderFns, t.exports = i
	}, function(t, e) {
		t.exports = {
			render: function() {
				var t = this,
					e = t.$createElement,
					n = t._self._c || e;
				return n("div", {
					staticClass: "mint-swipe"
				}, [n("div", {
					ref: "wrap",
					staticClass: "mint-swipe-items-wrap"
				}, [t._t("default")], 2), t._v(" "), n("div", {
					directives: [{
						name: "show",
						rawName: "v-show",
						value: t.showIndicators,
						expression: "showIndicators"
					}],
					staticClass: "mint-swipe-indicators"
				}, t._l(t.pages, function(e, i) {
					return n("div", {
						staticClass: "mint-swipe-indicator",
						"class": {
							"is-active": i === t.index
						}
					})
				}))])
			},
			staticRenderFns: []
		}
	}, function(t, e) {
		t.exports = {
			render: function() {
				var t = this,
					e = t.$createElement,
					n = t._self._c || e;
				return n("div", {
					staticClass: "mint-swipe-item"
				}, [t._t("default")], 2)
			},
			staticRenderFns: []
		}
	}])
});