var p = Object.defineProperty;
var x = (r, e, s) => e in r ? p(r, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[e] = s;
var d = (r, e, s) => x(r, typeof e != "symbol" ? e + "" : e, s);
function h(r) {
  const e = new Event("change");
  r.dispatchEvent(e);
}
function g(r) {
  const e = new Event("input");
  r.dispatchEvent(e);
}
class m {
  constructor(e, s = {}) {
    d(this, "el");
    d(this, "config");
    d(this, "localization");
    d(this, "state");
    d(this, "options");
    d(this, "groups");
    d(this, "uxEl");
    d(this, "uxBody");
    d(this, "uxSearchInput");
    d(this, "uxSearchOverlay");
    d(this, "uxClearButton");
    d(this, "uxSelectAll");
    this.el = e, this.config = {
      isSearchable: this.el.dataset.isSearchable !== void 0 ? this.el.dataset.isSearchable === "true" : s.isSearchable ?? !1,
      isSearchFocus: this.el.dataset.isSearchFocus !== void 0 ? this.el.dataset.isSearchFocus === "true" : s.isSearchFocus ?? !1,
      searchName: this.el.dataset.searchName !== void 0 ? this.el.dataset.searchName : s.searchName ?? "",
      isDisplaySelectedItems: this.el.dataset.isDisplaySelectedItems !== void 0 ? this.el.dataset.isDisplaySelectedItems === "true" : s.isDisplaySelectedItems ?? !1,
      isGroupOptions: this.el.dataset.isGroupOptions !== void 0 ? this.el.dataset.isGroupOptions === "true" : s.isGroupOptions ?? !1,
      hideOnClear: this.el.dataset.hideOnClear !== void 0 ? this.el.dataset.hideOnClear === "true" : s.hideOnClear ?? !0,
      hideOnSelect: this.el.dataset.hideOnSelect !== void 0 ? this.el.dataset.hideOnSelect === "true" : s.hideOnSelect ?? !1,
      optionStyle: this.el.dataset.optionStyle ?? s.optionStyle ?? "default",
      closeButton: this.el.dataset.closeButton !== void 0 ? this.el.dataset.closeButton === "true" : s.closeButton ?? !0,
      selectAllOption: this.el.dataset.selectAllOption !== void 0 ? this.el.dataset.selectAllOption === "true" : s.selectAllOption ?? !1
    }, this.localization = {
      placeholder: this.el.dataset.placeholder ?? s.placeholder ?? "Select an option",
      searchText: this.el.dataset.searchText ?? s.searchText ?? "Search",
      emptySearchText: this.el.dataset.emptySearchText ?? s.emptySearchText ?? "No results found",
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
      if (t.value === "") continue;
      let l = "empty";
      i && t.dataset.uxSelectGroup && (l = t.dataset.uxSelectGroup);
      let o;
      e && (o = this.uxEl.querySelector(`.ux-select-group__elem[data-value='${t.value}']`));
      let n, c;
      this.config.optionStyle === "image" && t.dataset.imageSrc ? n = {
        src: t.dataset.imageSrc,
        srcset: t.dataset.imageSrcset ?? void 0,
        alt: t.dataset.imageAlt ?? "",
        width: t.dataset.imageWidth ? Number(t.dataset.imageWidth) : 24,
        height: t.dataset.imageHeight ? Number(t.dataset.imageHeight) : 24
      } : this.config.optionStyle === "image" && t.dataset.svgSrc && (c = {
        src: t.dataset.svgSrc,
        width: t.dataset.svgWidth ? Number(t.dataset.svgWidth) : 24,
        height: t.dataset.svgHeight ? Number(t.dataset.svgHeight) : 24
      }), a.push({
        attributes: {
          selected: t.selected,
          disabled: t.disabled,
          group: l
        },
        data: {
          text: t.textContent ? t.textContent.trim() : "",
          value: t.value,
          selectedDisplayText: t.dataset.selectedDisplayText
        },
        image: n,
        svg: c,
        element: t,
        uxOption: o
      });
    }
    return a;
  }
  extractGroups() {
    const e = this.el.options, s = this.config.isGroupOptions, i = /* @__PURE__ */ new Set();
    for (const a of e) {
      if (a.value === "") continue;
      let t = "empty";
      s && a.dataset.uxSelectGroup && (t = a.dataset.uxSelectGroup), i.add(t);
    }
    return Array.from(i);
  }
  setSelectState() {
    const e = this.uxEl.querySelector(".ux-select__title"), s = this.options.reduce((i, a) => (a.attributes.selected && i.push(a.data.selectedDisplayText || a.data.text), i), []);
    if (s.length > 0 ? (s.length === 1 ? e.textContent = s[0] : this.state.multiple && (e.textContent = this.config.isDisplaySelectedItems ? s.join(", ") : `${this.localization.selectedText} ${s.length}`), this.uxEl.classList.add("-filled")) : (e.textContent = this.localization.placeholder, this.uxEl.classList.remove("-filled")), this.config.isGroupOptions)
      for (const i of this.groups) {
        const a = this.uxEl.querySelector(`[data-ux-group="${i}"]`);
        if (!a) continue;
        const t = a.querySelector(".ux-select-group__list");
        if (!t) continue;
        const o = Array.from(t.querySelectorAll(".ux-select-group__elem")).every((n) => {
          n.classList.contains("-disabled");
        });
        a.classList.toggle("-disabled", o);
      }
    if (this.uxSelectAll) {
      this.uxSelectAll.querySelector(".ux-select-select-all__checkbox")?.classList.remove("-null", "-all", "-some");
      const i = this.options.every((l) => l.attributes.selected), a = this.options.some((l) => l.attributes.selected);
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
      const l = document.createElement("div");
      l.classList.add("ux-select-select-all__checkbox");
      const o = document.createElement("div");
      o.classList.add("ux-select-select-all__text"), o.textContent = this.localization.selectAllText, t.append(l, o), this.uxSelectAll = t, this.uxSelectAll.addEventListener("click", this.onClickSelectAll.bind(this)), e.appendChild(t);
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
        const o = document.createElement("img");
        o.classList.add("ux-select-group-elem__image"), o.src = t.image.src, o.width = t.image.width, o.height = t.image.height, o.alt = t.image.alt, t.image.srcset && (o.srcset = `${t.image.src} 1x, ${t.image.srcset} 2x`), l.appendChild(o);
      }
      if (this.config.optionStyle === "image" && t.svg) {
        const o = document.createElementNS("http://www.w3.org/2000/svg", "svg"), n = document.createElementNS("http://www.w3.org/2000/svg", "use");
        o.classList.add("ux-select-group-elem__image"), o.setAttribute(
          "viewBox",
          `0 0 ${String(t.svg.width)} ${String(t.svg.height)}`
        ), o.setAttribute("width", String(t.svg.width)), o.setAttribute("height", String(t.svg.height)), n.setAttribute("href", t.svg.src), o.appendChild(n), l.appendChild(o);
      }
      l.addEventListener("click", this.onClickOption.bind(this)), i[t.attributes.group].appendChild(l), t.uxOption = l;
    }
    for (const t of this.groups) {
      const l = i[t], o = e.querySelector(
        `[data-ux-group="${t}"] .ux-select-group__list`
      );
      o && o.appendChild(l);
    }
    if (!this.uxBody) throw new Error("uxBody is undefined");
    const a = this.config.isSearchable ? 1 : 0;
    this.uxBody.childNodes[a] ? this.uxBody.replaceChild(e, this.uxBody.childNodes[a]) : this.uxBody.appendChild(e);
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
      const o = document.createElement("input");
      o.type = "search", this.config.searchName && (o.name = this.config.searchName), o.classList.add("ux-select-search__input"), o.placeholder = this.localization.searchText, this.uxSearchInput = o;
      const n = document.createElement("div");
      n.classList.add("ux-select-search__overlay"), n.textContent = this.localization.emptySearchText, this.uxSearchOverlay = n, l.appendChild(o), l.appendChild(n), i.appendChild(l);
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
    this.options = this.extractOptions(!0), this.groups = this.extractGroups(), s !== JSON.stringify(this.options) && this.createGroupAndOptions(), this.setSelectState(), this.el.disabled ? this.disable() : this.enable(), e && h(this.el);
  }
  clear() {
    for (const e of this.options)
      e.attributes.selected && (e.attributes.selected = !1, e.element.selected = !1, e.uxOption && e.uxOption.classList.remove("-selected"));
    this.setSelectState(), h(this.el);
  }
  destroy() {
    this.uxEl.remove(), this.el.style.display = "";
  }
  getSelectedValues() {
    return [...this.options].filter((e) => e.attributes.selected).map((e) => e.data.value);
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
    if (e.target === null) return;
    const s = (c) => c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), i = e.target, a = s(i.value), t = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), l = this.uxEl.querySelectorAll(".ux-select-group");
    if (a === "") {
      for (const c of this.options)
        c.uxOption && (c.uxOption.style.display = "");
      if (this.config.isGroupOptions)
        for (const c of l)
          c.style.display = "";
      this.uxSearchOverlay && (this.uxSearchOverlay.style.display = "none"), this.uxSelectAll && (this.uxSelectAll.style.display = "flex");
      return;
    }
    const o = new RegExp(t), n = this.options.some((c) => o.test(s(c.data.text)));
    for (const c of this.options) {
      const u = o.test(s(c.data.text));
      c.uxOption && (c.uxOption.style.display = u ? "" : "none");
    }
    if (this.config.isGroupOptions)
      for (const c of l) {
        c.style.display = "";
        const u = c.querySelector(".ux-select-group__list");
        u && (c.style.display = u.clientHeight !== 0 ? "" : "none");
      }
    this.uxSearchOverlay && (this.uxSearchOverlay.style.display = n ? "none" : "block"), this.uxSelectAll && (this.uxSelectAll.style.display = n ? "flex" : "none"), g(this.el);
  }
  bindEvents() {
    this.uxEl.addEventListener("click", this.onToggleShown.bind(this)), this.uxClearButton && this.uxClearButton.addEventListener("click", this.onClickClear.bind(this)), window.addEventListener("click", this.onClickOutside.bind(this)), this.config.isSearchable && this.uxSearchInput && this.uxSearchInput.addEventListener("input", this.onSearch.bind(this));
  }
}
export {
  m as default
};
//# sourceMappingURL=ux-select.es.js.map
