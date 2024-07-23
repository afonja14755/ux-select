var h = Object.defineProperty;
var p = (d, e, s) => e in d ? h(d, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : d[e] = s;
var c = (d, e, s) => (p(d, typeof e != "symbol" ? e + "" : e, s), s);
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
    const s = this.el.options, i = this.config.isGroupOptions, a = [];
    for (const t of s) {
      if (t.value === "")
        continue;
      let o = "empty";
      i && t.dataset.uxSelectGroup && (o = t.dataset.uxSelectGroup);
      let l;
      e && (l = this.uxEl.querySelector(`.ux-select-group__elem[data-value='${t.value}']`));
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
      }), a.push({
        attributes: {
          selected: t.selected,
          disabled: t.disabled,
          group: o
        },
        data: {
          text: t.textContent ? t.textContent.trim() : "",
          value: t.value
        },
        image: n,
        svg: r,
        element: t,
        uxOption: l
      });
    }
    return a;
  }
  extractGroups() {
    const e = this.el.options, s = this.config.isGroupOptions, i = /* @__PURE__ */ new Set();
    for (const a of e) {
      if (a.value === "")
        continue;
      let t = "empty";
      s && a.dataset.uxSelectGroup && (t = a.dataset.uxSelectGroup), i.add(t);
    }
    return Array.from(i);
  }
  setSelectState() {
    const e = this.uxEl.querySelector(".ux-select__title"), s = this.options.reduce((i, a) => (a.attributes.selected && i.push(a.data.text), i), []);
    if (s.length > 0 ? (s.length === 1 ? e.textContent = s[0] : this.state.multiple && (e.textContent = `${this.localization.selectedText} ${s.length}`), this.uxEl.classList.add("-filled")) : (e.textContent = this.localization.placeholder, this.uxEl.classList.remove("-filled")), this.config.isGroupOptions)
      for (const i of this.groups) {
        const a = this.uxEl.querySelector(`[data-ux-group="${i}"]`);
        if (!a)
          continue;
        const t = a.querySelector(".ux-select-group__list");
        if (!t)
          continue;
        const l = Array.from(t.querySelectorAll(".ux-select-group__elem")).every((n) => {
          n.classList.contains("-disabled");
        });
        a.classList.toggle("-disabled", l);
      }
    if (this.uxSelectAll) {
      this.uxSelectAll.querySelector(".ux-select-select-all__checkbox")?.classList.remove("-null", "-all", "-some");
      const i = this.options.every((o) => o.attributes.selected), a = this.options.some((o) => o.attributes.selected);
      this.state.isAllSelected = i;
      let t = "-null";
      i ? t = "-all" : a && (t = "-some"), this.uxSelectAll.querySelector(".ux-select-select-all__checkbox")?.classList.add(t);
    }
  }
  createGroupElement(e) {
    const s = document.createElement("div");
    if (s.classList.add("ux-select__group", "ux-select-group"), s.dataset.uxGroup = e, e === "empty")
      s.classList.add("-empty");
    else {
      const a = document.createElement("div");
      a.classList.add("ux-select-group__title"), a.textContent = e, s.appendChild(a);
    }
    const i = document.createElement("ul");
    return i.classList.add("ux-select-group__list"), s.appendChild(i), s;
  }
  createGroupAndOptions() {
    const e = document.createElement("div");
    if (e.classList.add("ux-select__dropdown"), this.state.multiple && this.config.selectAllOption) {
      const t = document.createElement("div");
      t.classList.add("ux-select__select-all");
      const o = document.createElement("div");
      o.classList.add("ux-select-select-all__checkbox");
      const l = document.createElement("div");
      l.classList.add("ux-select-select-all__text"), l.textContent = this.localization.selectAllText, t.append(o, l), this.uxSelectAll = t, this.uxSelectAll.addEventListener("click", this.onClickSelectAll.bind(this)), e.appendChild(t);
    }
    const s = document.createDocumentFragment(), i = {};
    for (const t of this.groups) {
      const o = this.createGroupElement(t);
      s.appendChild(o), i[t] = document.createDocumentFragment();
    }
    e.appendChild(s);
    for (const t of this.options) {
      const o = document.createElement("li");
      if (o.classList.add("ux-select-group__elem"), o.dataset.value = t.data.value, o.textContent = t.data.text, t.attributes.selected && o.classList.add("-selected"), t.attributes.disabled && o.classList.add("-disabled"), this.config.optionStyle === "image" && t.image) {
        const l = document.createElement("img");
        l.classList.add("ux-select-group-elem__image"), l.src = t.image.src, l.width = t.image.width, l.height = t.image.height, l.alt = t.image.alt, t.image.srcset && (l.srcset = `${t.image.src} 1x, ${t.image.srcset} 2x`), o.appendChild(l);
      }
      if (this.config.optionStyle === "image" && t.svg) {
        const l = document.createElementNS("http://www.w3.org/2000/svg", "svg"), n = document.createElementNS("http://www.w3.org/2000/svg", "use");
        l.classList.add("ux-select-group-elem__image"), l.setAttribute("viewBox", `0 0 ${String(t.svg.width)} ${String(t.svg.height)}`), l.setAttribute("width", String(t.svg.width)), l.setAttribute("height", String(t.svg.height)), n.setAttribute("href", t.svg.src), l.appendChild(n), o.appendChild(l);
      }
      o.addEventListener("click", this.onClickOption.bind(this)), i[t.attributes.group].appendChild(o), t.uxOption = o;
    }
    for (const t of this.groups) {
      const o = i[t], l = e.querySelector(`[data-ux-group="${t}"] .ux-select-group__list`);
      l && l.appendChild(o);
    }
    if (!this.uxBody)
      throw new Error("uxBody is undefined");
    const a = this.config.isSearchable ? 1 : 0;
    this.uxBody.childNodes[a] ? this.uxBody.replaceChild(e, this.uxBody.childNodes[a]) : this.uxBody.appendChild(e);
  }
  create() {
    const e = document.createElement("div");
    e.classList.add("ux-select__head");
    const s = document.createElement("div");
    if (s.classList.add("ux-select__title"), s.textContent = this.localization.placeholder, e.appendChild(s), this.config.closeButton) {
      const o = document.createElement("button");
      o.type = "button", o.classList.add("ux-select__clear"), o.title = this.localization.clearText, this.uxClearButton = o, e.appendChild(o);
    }
    const i = document.createElement("div");
    if (i.classList.add("ux-select__body"), this.uxBody = i, this.config.isSearchable) {
      const o = document.createElement("div");
      o.classList.add("ux-select__search");
      const l = document.createElement("input");
      l.type = "search", l.name = "ux-select-search", l.classList.add("ux-select-search__input"), l.placeholder = this.localization.searchText, this.uxSearchInput = l, o.appendChild(l), i.appendChild(o);
    }
    this.createGroupAndOptions();
    const a = document.createElement("div"), t = ["ux-select", this.el.classList];
    return this.state.multiple && t.push("-multiple"), this.state.disabled && t.push("-disabled"), this.config.optionStyle !== "default" && t.push(`-${this.config.optionStyle}`), a.className = t.join(" "), a.append(e, i), this.el.style.display = "none", this.el.insertAdjacentElement("afterend", a), this.el.nextElementSibling;
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
        const i = this.options.find((a) => a.uxOption === s);
        i && i.uxOption && (i.attributes.selected = !i.attributes.selected, i.element.selected = i.attributes.selected, i.uxOption.classList.toggle("-selected"));
      } else
        for (const i of this.options) {
          const a = i.uxOption === s;
          i.attributes.selected = a, i.element.selected = a, i.uxOption && i.uxOption.classList.toggle("-selected", a);
        }
      return this.config.hideOnSelect && this.uxEl.classList.remove("-shown"), this.update();
    }
  }
  onSearch(e) {
    if (e.target === null)
      return;
    const i = e.target.value.toLowerCase(), a = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), t = this.uxEl.querySelectorAll(".ux-select-group");
    if (i === "") {
      for (const l of this.options)
        l.uxOption && (l.uxOption.style.display = "");
      if (this.config.isGroupOptions)
        for (const l of t)
          l.style.display = "";
      return;
    }
    const o = new RegExp(a);
    for (const l of this.options) {
      const n = o.test(l.data.text.toLowerCase());
      l.uxOption && (l.uxOption.style.display = n ? "" : "none");
    }
    if (this.config.isGroupOptions)
      for (const l of t) {
        l.style.display = "";
        const n = l.querySelector(".ux-select-group__list");
        n && (l.style.display = n.clientHeight !== 0 ? "" : "none");
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
