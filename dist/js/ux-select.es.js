var h = Object.defineProperty;
var p = (d, e, s) => e in d ? h(d, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : d[e] = s;
var c = (d, e, s) => p(d, typeof e != "symbol" ? e + "" : e, s);
function u(d) {
  const e = new Event("change");
  d.dispatchEvent(e);
}
function g(d) {
  const e = new Event("input");
  d.dispatchEvent(e);
}
class f {
  constructor(e, s = {}) {
    c(this, "el");
    c(this, "config");
    c(this, "localization");
    c(this, "state");
    c(this, "options");
    c(this, "groups");
    c(this, "uxEl");
    c(this, "uxBody");
    c(this, "uxSearchInput");
    c(this, "uxClearButton");
    c(this, "uxSelectAll");
    this.el = e, this.config = {
      isSearchable: this.el.dataset.isSearchable !== void 0 ? this.el.dataset.isSearchable === "true" : s.isSearchable ?? !1,
      isSearchFocus: this.el.dataset.isSearchFocus !== void 0 ? this.el.dataset.isSearchFocus === "true" : s.isSearchFocus ?? !1,
      isGroupOptions: this.el.dataset.isGroupOptions !== void 0 ? this.el.dataset.isGroupOptions === "true" : s.isGroupOptions ?? !1,
      hideOnClear: this.el.dataset.hideOnClear !== void 0 ? this.el.dataset.hideOnClear === "true" : s.hideOnClear ?? !0,
      hideOnSelect: this.el.dataset.hideOnSelect !== void 0 ? this.el.dataset.hideOnSelect === "true" : s.hideOnSelect ?? !1,
      optionStyle: this.el.dataset.optionStyle ?? s.optionStyle ?? "default",
      closeButton: this.el.dataset.closeButton !== void 0 ? this.el.dataset.closeButton === "true" : s.closeButton ?? !0,
      selectAllOption: this.el.dataset.selectAllOption !== void 0 ? this.el.dataset.selectAllOption === "true" : s.selectAllOption ?? !1
    }, this.localization = {
      placeholder: this.el.dataset.placeholder ?? s.placeholder ?? "Select an option",
      searchText: this.el.dataset.searchText ?? s.searchText ?? "Search",
      clearText: this.el.dataset.clearText ?? s.clearText ?? "Clear option(s)",
      selectedText: this.el.dataset.selectedText ?? s.selectedText ?? "Selected:",
      selectAllText: this.el.dataset.selectAllText ?? s.selectAllText ?? "Select all"
    }, this.state = {
      multiple: this.el.multiple,
      disabled: this.el.disabled,
      isAllSelected: !1
    }, this.options = this.extractOptions(), this.groups = this.extractGroups(), this.uxEl = this.create(), this.setSelectState(), this.bindEvents();
  }
  extractOptions(e = !1) {
    const s = this.el.options, i = this.config.isGroupOptions, o = [];
    for (const t of s) {
      if (t.value === "") continue;
      let l = "empty";
      i && t.dataset.uxSelectGroup && (l = t.dataset.uxSelectGroup);
      let a;
      e && (a = this.uxEl.querySelector(`.ux-select-group__elem[data-value='${t.value}']`));
      let n, r;
      this.config.optionStyle === "image" && t.dataset.imageSrc ? n = {
        src: t.dataset.imageSrc,
        srcset: t.dataset.imageSrcset ?? void 0,
        alt: t.dataset.imageAlt ?? "",
        width: t.dataset.imageWidth ? Number(t.dataset.imageWidth) : 24,
        height: t.dataset.imageHeight ? Number(t.dataset.imageHeight) : 24
      } : this.config.optionStyle === "image" && t.dataset.svgSrc && (r = {
        src: t.dataset.svgSrc,
        width: t.dataset.svgWidth ? Number(t.dataset.svgWidth) : 24,
        height: t.dataset.svgHeight ? Number(t.dataset.svgHeight) : 24
      }), o.push({
        attributes: {
          selected: t.selected,
          disabled: t.disabled,
          group: l
        },
        data: {
          text: t.textContent ? t.textContent.trim() : "",
          value: t.value
        },
        image: n,
        svg: r,
        element: t,
        uxOption: a
      });
    }
    return o;
  }
  extractGroups() {
    const e = this.el.options, s = this.config.isGroupOptions, i = /* @__PURE__ */ new Set();
    for (const o of e) {
      if (o.value === "") continue;
      let t = "empty";
      s && o.dataset.uxSelectGroup && (t = o.dataset.uxSelectGroup), i.add(t);
    }
    return Array.from(i);
  }
  setSelectState() {
    const e = this.uxEl.querySelector(".ux-select__title"), s = this.options.reduce((i, o) => (o.attributes.selected && i.push(o.data.text), i), []);
    if (s.length > 0 ? (s.length === 1 ? e.textContent = s[0] : this.state.multiple && (e.textContent = `${this.localization.selectedText} ${s.length}`), this.uxEl.classList.add("-filled")) : (e.textContent = this.localization.placeholder, this.uxEl.classList.remove("-filled")), this.config.isGroupOptions)
      for (const i of this.groups) {
        const o = this.uxEl.querySelector(`[data-ux-group="${i}"]`);
        if (!o) continue;
        const t = o.querySelector(".ux-select-group__list");
        if (!t) continue;
        const a = Array.from(t.querySelectorAll(".ux-select-group__elem")).every((n) => {
          n.classList.contains("-disabled");
        });
        o.classList.toggle("-disabled", a);
      }
    if (this.uxSelectAll) {
      this.uxSelectAll.querySelector(".ux-select-select-all__checkbox")?.classList.remove("-null", "-all", "-some");
      const i = this.options.every((l) => l.attributes.selected), o = this.options.some((l) => l.attributes.selected);
      this.state.isAllSelected = i;
      let t = "-null";
      i ? t = "-all" : o && (t = "-some"), this.uxSelectAll.querySelector(".ux-select-select-all__checkbox")?.classList.add(t);
    }
  }
  createGroupElement(e) {
    const s = document.createElement("div");
    if (s.classList.add("ux-select__group", "ux-select-group"), s.dataset.uxGroup = e, e === "empty")
      s.classList.add("-empty");
    else {
      const o = document.createElement("div");
      o.classList.add("ux-select-group__title"), o.textContent = e, s.appendChild(o);
    }
    const i = document.createElement("ul");
    return i.classList.add("ux-select-group__list"), s.appendChild(i), s;
  }
  createGroupAndOptions() {
    const e = document.createElement("div");
    if (e.classList.add("ux-select__dropdown"), this.state.multiple && this.config.selectAllOption) {
      const t = document.createElement("div");
      t.classList.add("ux-select__select-all");
      const l = document.createElement("div");
      l.classList.add("ux-select-select-all__checkbox");
      const a = document.createElement("div");
      a.classList.add("ux-select-select-all__text"), a.textContent = this.localization.selectAllText, t.append(l, a), this.uxSelectAll = t, this.uxSelectAll.addEventListener("click", this.onClickSelectAll.bind(this)), e.appendChild(t);
    }
    const s = document.createDocumentFragment(), i = {};
    for (const t of this.groups) {
      const l = this.createGroupElement(t);
      s.appendChild(l), i[t] = document.createDocumentFragment();
    }
    e.appendChild(s);
    for (const t of this.options) {
      const l = document.createElement("li");
      if (l.classList.add("ux-select-group__elem"), l.dataset.value = t.data.value, l.textContent = t.data.text, t.attributes.selected && l.classList.add("-selected"), t.attributes.disabled && l.classList.add("-disabled"), this.config.optionStyle === "image" && t.image) {
        const a = document.createElement("img");
        a.classList.add("ux-select-group-elem__image"), a.src = t.image.src, a.width = t.image.width, a.height = t.image.height, a.alt = t.image.alt, t.image.srcset && (a.srcset = `${t.image.src} 1x, ${t.image.srcset} 2x`), l.appendChild(a);
      }
      if (this.config.optionStyle === "image" && t.svg) {
        const a = document.createElementNS("http://www.w3.org/2000/svg", "svg"), n = document.createElementNS("http://www.w3.org/2000/svg", "use");
        a.classList.add("ux-select-group-elem__image"), a.setAttribute(
          "viewBox",
          `0 0 ${String(t.svg.width)} ${String(t.svg.height)}`
        ), a.setAttribute("width", String(t.svg.width)), a.setAttribute("height", String(t.svg.height)), n.setAttribute("href", t.svg.src), a.appendChild(n), l.appendChild(a);
      }
      l.addEventListener("click", this.onClickOption.bind(this)), i[t.attributes.group].appendChild(l), t.uxOption = l;
    }
    for (const t of this.groups) {
      const l = i[t], a = e.querySelector(
        `[data-ux-group="${t}"] .ux-select-group__list`
      );
      a && a.appendChild(l);
    }
    if (!this.uxBody) throw new Error("uxBody is undefined");
    const o = this.config.isSearchable ? 1 : 0;
    this.uxBody.childNodes[o] ? this.uxBody.replaceChild(e, this.uxBody.childNodes[o]) : this.uxBody.appendChild(e);
  }
  create() {
    const e = document.createElement("div");
    e.classList.add("ux-select__head");
    const s = document.createElement("div");
    if (s.classList.add("ux-select__title"), s.textContent = this.localization.placeholder, e.appendChild(s), this.config.closeButton) {
      const l = document.createElement("button");
      l.type = "button", l.classList.add("ux-select__clear"), l.title = this.localization.clearText, this.uxClearButton = l, e.appendChild(l);
    }
    const i = document.createElement("div");
    if (i.classList.add("ux-select__body"), this.uxBody = i, this.config.isSearchable) {
      const l = document.createElement("div");
      l.classList.add("ux-select__search");
      const a = document.createElement("input");
      a.type = "search", a.name = "ux-select-search", a.classList.add("ux-select-search__input"), a.placeholder = this.localization.searchText, this.uxSearchInput = a, l.appendChild(a), i.appendChild(l);
    }
    this.createGroupAndOptions();
    const o = document.createElement("div"), t = ["ux-select", this.el.classList];
    return this.state.multiple && t.push("-multiple"), this.state.disabled && t.push("-disabled"), this.config.optionStyle !== "default" && t.push(`-${this.config.optionStyle}`), o.className = t.join(" "), o.append(e, i), this.el.style.display = "none", this.el.insertAdjacentElement("afterend", o), this.el.nextElementSibling;
  }
  enable() {
    this.state.disabled && (this.el.disabled = !1, this.uxEl.classList.remove("-disabled"), this.state.disabled = !1);
  }
  disable() {
    this.state.disabled || (this.el.disabled = !0, this.uxEl.classList.add("-disabled"), this.state.disabled = !0);
  }
  /**
   *
   * @param {Boolean} [isTriggerChange] Skip triggering "change" event
   */
  update(e = !0) {
    const s = JSON.stringify(this.options);
    this.options = this.extractOptions(!0), this.groups = this.extractGroups(), s !== JSON.stringify(this.options) && this.createGroupAndOptions(), this.setSelectState(), this.el.disabled ? this.disable() : this.enable(), e && u(this.el);
  }
  clear() {
    for (const e of this.options)
      e.attributes.selected && (e.attributes.selected = !1, e.element.selected = !1, e.uxOption && e.uxOption.classList.remove("-selected"));
    this.setSelectState(), u(this.el);
  }
  destroy() {
    this.uxEl.remove(), this.el.style.display = "";
  }
  onToggleShown(e) {
    e.preventDefault();
    const s = e.target;
    if (!this.state.disabled && !(this.uxClearButton && e.target === this.uxClearButton) && !(this.uxBody && this.uxBody.contains(s))) {
      if (this.uxEl.classList.contains("-shown")) {
        this.uxEl.classList.remove("-shown");
        return;
      }
      this.uxEl.classList.add("-shown"), this.config.isSearchable && this.uxSearchInput && (this.uxSearchInput.value = "", this.uxSearchInput.dispatchEvent(new Event("input")), this.config.isSearchFocus && this.uxSearchInput.focus());
    }
  }
  onClickOutside(e) {
    const s = e.target;
    this.uxEl.contains(s) || this.uxEl.classList.remove("-shown");
  }
  onClickClear(e) {
    if (e.preventDefault(), !this.state.disabled)
      return this.config.hideOnClear && this.uxEl.classList.remove("-shown"), this.clear();
  }
  onClickSelectAll(e) {
    e.preventDefault();
    const s = this.options.every((i) => i.attributes.selected);
    for (const i of this.options)
      i.attributes.disabled || (i.attributes.selected = !s, i.element.selected = !s, i.uxOption?.classList.toggle("-selected", !s));
    return this.config.hideOnSelect && this.uxEl.classList.remove("-shown"), this.update();
  }
  onClickOption(e) {
    e.preventDefault();
    const s = e.target;
    if (!s.classList.contains("-disabled") && !(!this.state.multiple && s.classList.contains("-selected"))) {
      if (this.state.multiple) {
        e.stopPropagation();
        const i = this.options.find((o) => o.uxOption === s);
        i && i.uxOption && (i.attributes.selected = !i.attributes.selected, i.element.selected = i.attributes.selected, i.uxOption.classList.toggle("-selected"));
      } else
        for (const i of this.options) {
          const o = i.uxOption === s;
          i.attributes.selected = o, i.element.selected = o, i.uxOption && i.uxOption.classList.toggle("-selected", o);
        }
      return this.config.hideOnSelect && this.uxEl.classList.remove("-shown"), this.update();
    }
  }
  onSearch(e) {
    if (e.target === null) return;
    const s = (n) => n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), i = e.target, o = s(i.value), t = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), l = this.uxEl.querySelectorAll(".ux-select-group");
    if (o === "") {
      for (const n of this.options)
        n.uxOption && (n.uxOption.style.display = "");
      if (this.config.isGroupOptions)
        for (const n of l)
          n.style.display = "";
      return;
    }
    const a = new RegExp(t);
    for (const n of this.options) {
      const r = a.test(s(n.data.text));
      n.uxOption && (n.uxOption.style.display = r ? "" : "none");
    }
    if (this.config.isGroupOptions)
      for (const n of l) {
        n.style.display = "";
        const r = n.querySelector(".ux-select-group__list");
        r && (n.style.display = r.clientHeight !== 0 ? "" : "none");
      }
    g(this.el);
  }
  bindEvents() {
    this.uxEl.addEventListener("click", this.onToggleShown.bind(this)), this.uxClearButton && this.uxClearButton.addEventListener("click", this.onClickClear.bind(this)), window.addEventListener("click", this.onClickOutside.bind(this)), this.config.isSearchable && this.uxSearchInput && this.uxSearchInput.addEventListener("input", this.onSearch.bind(this));
  }
}
export {
  f as default
};
//# sourceMappingURL=ux-select.es.js.map
