var h = Object.defineProperty;
var p = (r, e, s) => e in r ? h(r, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[e] = s;
var c = (r, e, s) => (p(r, typeof e != "symbol" ? e + "" : e, s), s);
function u(r) {
  const e = new Event("change");
  r.dispatchEvent(e);
}
function g(r) {
  const e = new Event("input");
  r.dispatchEvent(e);
}
class x {
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
    this.el = e, this.config = {
      isSearchable: this.el.dataset.isSearchable !== void 0 ? this.el.dataset.isSearchable === "true" : s.isSearchable ?? !1,
      isSearchFocus: this.el.dataset.isSearchFocus !== void 0 ? this.el.dataset.isSearchFocus === "true" : s.isSearchFocus ?? !1,
      isGroupOptions: this.el.dataset.isGroupOptions !== void 0 ? this.el.dataset.isGroupOptions === "true" : s.isGroupOptions ?? !1,
      hideOnClear: this.el.dataset.hideOnClear !== void 0 ? this.el.dataset.hideOnClear === "true" : s.hideOnClear ?? !0,
      hideOnSelect: this.el.dataset.hideOnSelect !== void 0 ? this.el.dataset.hideOnSelect === "true" : s.hideOnSelect ?? !1,
      optionStyle: this.el.dataset.optionStyle ?? s.optionStyle ?? "default",
      closeButton: this.el.dataset.closeButton !== void 0 ? this.el.dataset.closeButton === "true" : s.closeButton ?? !0
    }, this.localization = {
      placeholder: this.el.dataset.placeholder ?? s.placeholder ?? "Select an option",
      searchText: this.el.dataset.searchText ?? s.searchText ?? "Search",
      clearText: this.el.dataset.clearText ?? s.clearText ?? "Clear option(s)",
      selectedText: this.el.dataset.selectedText ?? s.selectedText ?? "Selected:"
    }, this.state = {
      multiple: this.el.multiple,
      disabled: this.el.disabled
    }, this.options = this.extractOptions(), this.groups = this.extractGroups(), this.uxEl = this.create(), this.setSelectState(), this.bindEvents();
  }
  extractOptions(e = !1) {
    const s = this.el.options, o = this.config.isGroupOptions, l = [];
    for (const t of s) {
      if (t.value === "")
        continue;
      let a = "empty";
      o && t.dataset.uxSelectGroup && (a = t.dataset.uxSelectGroup);
      let i;
      e && (i = this.uxEl.querySelector(`.ux-select-group__elem[data-value='${t.value}']`));
      let n, d;
      this.config.optionStyle === "image" && t.dataset.imageSrc ? n = {
        src: t.dataset.imageSrc,
        srcset: t.dataset.imageSrcset ?? void 0,
        alt: t.dataset.imageAlt ?? "",
        width: t.dataset.imageWidth ? Number(t.dataset.imageWidth) : 24,
        height: t.dataset.imageHeight ? Number(t.dataset.imageHeight) : 24
      } : this.config.optionStyle === "image" && t.dataset.svgSrc && (d = {
        src: t.dataset.svgSrc,
        width: t.dataset.svgWidth ? Number(t.dataset.svgWidth) : 24,
        height: t.dataset.svgHeight ? Number(t.dataset.svgHeight) : 24
      }), l.push({
        attributes: {
          selected: t.selected,
          disabled: t.disabled,
          group: a
        },
        data: {
          text: t.textContent ? t.textContent.trim() : "",
          value: t.value
        },
        image: n,
        svg: d,
        element: t,
        uxOption: i
      });
    }
    return l;
  }
  extractGroups() {
    const e = this.el.options, s = this.config.isGroupOptions, o = /* @__PURE__ */ new Set();
    for (const l of e) {
      if (l.value === "")
        continue;
      let t = "empty";
      s && l.dataset.uxSelectGroup && (t = l.dataset.uxSelectGroup), o.add(t);
    }
    return Array.from(o);
  }
  setSelectState() {
    const e = this.uxEl.querySelector(".ux-select__title"), s = this.options.reduce((o, l) => (l.attributes.selected && o.push(l.data.text), o), []);
    if (s.length > 0 ? (s.length === 1 ? e.textContent = s[0] : this.state.multiple && (e.textContent = `${this.localization.selectedText} ${s.length}`), this.uxEl.classList.add("-filled")) : (e.textContent = this.localization.placeholder, this.uxEl.classList.remove("-filled")), this.config.isGroupOptions)
      for (const o of this.groups) {
        const l = this.uxEl.querySelector(`[data-ux-group="${o}"]`);
        if (!l)
          continue;
        const t = l.querySelector(".ux-select-group__list");
        if (!t)
          continue;
        const i = Array.from(t.querySelectorAll(".ux-select-group__elem")).every((n) => {
          n.classList.contains("-disabled");
        });
        l.classList.toggle("-disabled", i);
      }
  }
  createGroupElement(e) {
    const s = document.createElement("div");
    if (s.classList.add("ux-select__group", "ux-select-group"), s.dataset.uxGroup = e, e === "empty")
      s.classList.add("-empty");
    else {
      const l = document.createElement("div");
      l.classList.add("ux-select-group__title"), l.textContent = e, s.appendChild(l);
    }
    const o = document.createElement("ul");
    return o.classList.add("ux-select-group__list"), s.appendChild(o), s;
  }
  createGroupAndOptions() {
    const e = document.createElement("div");
    e.classList.add("ux-select__dropdown");
    const s = document.createDocumentFragment(), o = {};
    for (const t of this.groups) {
      const a = this.createGroupElement(t);
      s.appendChild(a), o[t] = document.createDocumentFragment();
    }
    e.appendChild(s);
    for (const t of this.options) {
      const a = document.createElement("li");
      if (a.classList.add("ux-select-group__elem"), a.dataset.value = t.data.value, a.textContent = t.data.text, t.attributes.selected && a.classList.add("-selected"), t.attributes.disabled && a.classList.add("-disabled"), this.config.optionStyle === "image" && t.image) {
        const i = document.createElement("img");
        i.classList.add("ux-select-group-elem__image"), i.src = t.image.src, i.width = t.image.width, i.height = t.image.height, i.alt = t.image.alt, t.image.srcset && (i.srcset = `${t.image.src} 1x, ${t.image.srcset} 2x`), a.appendChild(i);
      }
      if (this.config.optionStyle === "image" && t.svg) {
        const i = document.createElementNS("http://www.w3.org/2000/svg", "svg"), n = document.createElementNS("http://www.w3.org/2000/svg", "use");
        i.classList.add("ux-select-group-elem__image"), i.setAttribute("viewBox", `0 0 ${String(t.svg.width)} ${String(t.svg.height)}`), i.setAttribute("width", String(t.svg.width)), i.setAttribute("height", String(t.svg.height)), n.setAttribute("href", t.svg.src), i.appendChild(n), a.appendChild(i);
      }
      a.addEventListener("click", this.onClickOption.bind(this)), o[t.attributes.group].appendChild(a), t.uxOption = a;
    }
    for (const t of this.groups) {
      const a = o[t], i = e.querySelector(`[data-ux-group="${t}"] .ux-select-group__list`);
      i && i.appendChild(a);
    }
    if (!this.uxBody)
      throw new Error("uxBody is undefined");
    const l = this.config.isSearchable ? 1 : 0;
    this.uxBody.childNodes[l] ? this.uxBody.replaceChild(e, this.uxBody.childNodes[l]) : this.uxBody.appendChild(e);
  }
  create() {
    const e = document.createElement("div");
    e.classList.add("ux-select__head");
    const s = document.createElement("div");
    if (s.classList.add("ux-select__title"), s.textContent = this.localization.placeholder, e.appendChild(s), this.config.closeButton) {
      const a = document.createElement("button");
      a.type = "button", a.classList.add("ux-select__clear"), a.title = this.localization.clearText, this.uxClearButton = a, e.appendChild(a);
    }
    const o = document.createElement("div");
    if (o.classList.add("ux-select__body"), this.uxBody = o, this.config.isSearchable) {
      const a = document.createElement("div");
      a.classList.add("ux-select__search");
      const i = document.createElement("input");
      i.type = "search", i.classList.add("ux-select-search__input"), i.placeholder = this.localization.searchText, this.uxSearchInput = i, a.appendChild(i), o.appendChild(a);
    }
    this.createGroupAndOptions();
    const l = document.createElement("div"), t = ["ux-select", this.el.classList];
    return this.state.multiple && t.push("-multiple"), this.state.disabled && t.push("-disabled"), this.config.optionStyle !== "default" && t.push(`-${this.config.optionStyle}`), l.className = t.join(" "), l.append(e, o), this.el.style.display = "none", this.el.insertAdjacentElement("afterend", l), this.el.nextElementSibling;
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
  onClickOption(e) {
    e.preventDefault();
    const s = e.target;
    if (!s.classList.contains("-disabled") && !(!this.state.multiple && s.classList.contains("-selected"))) {
      if (this.state.multiple) {
        e.stopPropagation();
        const o = this.options.find((l) => l.uxOption === s);
        o && o.uxOption && (o.attributes.selected = !o.attributes.selected, o.element.selected = o.attributes.selected, o.uxOption.classList.toggle("-selected"));
      } else
        for (const o of this.options) {
          const l = o.uxOption === s;
          o.attributes.selected = l, o.element.selected = l, o.uxOption && o.uxOption.classList.toggle("-selected", l);
        }
      return this.config.hideOnSelect && this.uxEl.classList.remove("-shown"), this.update();
    }
  }
  onSearch(e) {
    if (e.target === null)
      return;
    const o = e.target.value.toLowerCase(), l = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), t = this.uxEl.querySelectorAll(".ux-select-group");
    if (o === "") {
      for (const i of this.options)
        i.uxOption && (i.uxOption.style.display = "");
      if (this.config.isGroupOptions)
        for (const i of t)
          i.style.display = "";
      return;
    }
    const a = new RegExp(l);
    for (const i of this.options) {
      const n = a.test(i.data.text.toLowerCase());
      i.uxOption && (i.uxOption.style.display = n ? "" : "none");
    }
    if (this.config.isGroupOptions)
      for (const i of t) {
        i.style.display = "";
        const n = i.querySelector(".ux-select-group__list");
        n && (i.style.display = n.clientHeight !== 0 ? "" : "none");
      }
    g(this.el);
  }
  bindEvents() {
    this.uxEl.addEventListener("click", this.onToggleShown.bind(this)), this.uxClearButton && this.uxClearButton.addEventListener("click", this.onClickClear.bind(this)), window.addEventListener("click", this.onClickOutside.bind(this)), this.config.isSearchable && this.uxSearchInput && this.uxSearchInput.addEventListener("input", this.onSearch.bind(this));
  }
}
export {
  x as default
};
//# sourceMappingURL=ux-select.es.js.map
