var d = Object.defineProperty;
var h = (c, t, s) => t in c ? d(c, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : c[t] = s;
var a = (c, t, s) => (h(c, typeof t != "symbol" ? t + "" : t, s), s);
function u(c) {
  const t = new Event("change");
  c.dispatchEvent(t);
}
function p(c) {
  const t = new Event("input");
  c.dispatchEvent(t);
}
class x {
  constructor(t, s = {}) {
    a(this, "el");
    a(this, "config");
    a(this, "localization");
    a(this, "state");
    a(this, "options");
    a(this, "groups");
    a(this, "uxEl");
    a(this, "uxBody");
    a(this, "uxSearchInput");
    a(this, "uxClearButton");
    this.el = t, this.config = {
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
  extractOptions(t = !1) {
    const s = this.el.options, i = this.config.isGroupOptions, l = [];
    for (const e of s) {
      if (e.value === "")
        continue;
      let n = "empty";
      i && e.dataset.uxSelectGroup && (n = e.dataset.uxSelectGroup);
      let o;
      t && (o = this.uxEl.querySelector(`.ux-select-group__elem[data-value='${e.value}']`));
      let r;
      this.config.optionStyle === "image" && e.dataset.imageSrc && (r = {
        src: e.dataset.imageSrc,
        srcset: e.dataset.imageSrcset ?? void 0,
        alt: e.dataset.imageAlt ?? "",
        width: e.dataset.imageWidth ? Number(e.dataset.imageWidth) : 24,
        height: e.dataset.imageHeight ? Number(e.dataset.imageHeight) : 24
      }), l.push({
        attributes: {
          selected: e.selected,
          disabled: e.disabled,
          group: n
        },
        data: {
          text: e.textContent ? e.textContent.trim() : "",
          value: e.value
        },
        image: r,
        element: e,
        uxOption: o
      });
    }
    return l;
  }
  extractGroups() {
    const t = this.el.options, s = this.config.isGroupOptions, i = /* @__PURE__ */ new Set();
    for (const l of t) {
      if (l.value === "")
        continue;
      let e = "empty";
      s && l.dataset.uxSelectGroup && (e = l.dataset.uxSelectGroup), i.add(e);
    }
    return Array.from(i);
  }
  setSelectState() {
    const t = this.uxEl.querySelector(".ux-select__title"), s = this.options.reduce((i, l) => (l.attributes.selected && i.push(l.data.text), i), []);
    if (s.length > 0 ? (s.length === 1 ? t.textContent = s[0] : this.state.multiple && (t.textContent = `${this.localization.selectedText} ${s.length}`), this.uxEl.classList.add("-filled")) : (t.textContent = this.localization.placeholder, this.uxEl.classList.remove("-filled")), this.config.isGroupOptions)
      for (const i of this.groups) {
        const l = this.uxEl.querySelector(`[data-ux-group="${i}"]`);
        if (!l)
          continue;
        const e = l.querySelector(".ux-select-group__list");
        if (!e)
          continue;
        const o = Array.from(e.querySelectorAll(".ux-select-group__elem")).every((r) => {
          r.classList.contains("-disabled");
        });
        l.classList.toggle("-disabled", o);
      }
  }
  createGroupElement(t) {
    const s = document.createElement("div");
    if (s.classList.add("ux-select__group", "ux-select-group"), s.dataset.uxGroup = t, t === "empty")
      s.classList.add("-empty");
    else {
      const l = document.createElement("div");
      l.classList.add("ux-select-group__title"), l.textContent = t, s.appendChild(l);
    }
    const i = document.createElement("ul");
    return i.classList.add("ux-select-group__list"), s.appendChild(i), s;
  }
  createGroupAndOptions() {
    const t = document.createElement("div");
    t.classList.add("ux-select__dropdown");
    const s = document.createDocumentFragment(), i = {};
    for (const e of this.groups) {
      const n = this.createGroupElement(e);
      s.appendChild(n), i[e] = document.createDocumentFragment();
    }
    t.appendChild(s);
    for (const e of this.options) {
      const n = document.createElement("li");
      if (n.classList.add("ux-select-group__elem"), n.dataset.value = e.data.value, n.textContent = e.data.text, e.attributes.selected && n.classList.add("-selected"), e.attributes.disabled && n.classList.add("-disabled"), this.config.optionStyle === "image" && e.image) {
        const o = document.createElement("img");
        o.classList.add("ux-select-group-elem__image"), o.src = e.image.src, o.width = e.image.width, o.height = e.image.height, o.alt = e.image.alt, e.image.srcset && (o.srcset = `${e.image.src} 1x, ${e.image.srcset} 2x`), n.appendChild(o);
      }
      n.addEventListener("click", this.onClickOption.bind(this)), i[e.attributes.group].appendChild(n), e.uxOption = n;
    }
    for (const e of this.groups) {
      const n = i[e], o = t.querySelector(`[data-ux-group="${e}"] .ux-select-group__list`);
      o && o.appendChild(n);
    }
    if (!this.uxBody)
      throw new Error("uxBody is undefined");
    const l = this.config.isSearchable ? 1 : 0;
    this.uxBody.childNodes[l] ? this.uxBody.replaceChild(t, this.uxBody.childNodes[l]) : this.uxBody.appendChild(t);
  }
  create() {
    const t = document.createElement("div");
    t.classList.add("ux-select__head");
    const s = document.createElement("div");
    if (s.classList.add("ux-select__title"), s.textContent = this.localization.placeholder, t.appendChild(s), this.config.closeButton) {
      const n = document.createElement("button");
      n.type = "button", n.classList.add("ux-select__clear"), n.title = this.localization.clearText, this.uxClearButton = n, t.appendChild(n);
    }
    const i = document.createElement("div");
    if (i.classList.add("ux-select__body"), this.uxBody = i, this.config.isSearchable) {
      const n = document.createElement("div");
      n.classList.add("ux-select__search");
      const o = document.createElement("input");
      o.type = "search", o.classList.add("ux-select-search__input"), o.placeholder = this.localization.searchText, this.uxSearchInput = o, n.appendChild(o), i.appendChild(n);
    }
    this.createGroupAndOptions();
    const l = document.createElement("div"), e = ["ux-select", this.el.classList];
    return this.state.multiple && e.push("-multiple"), this.state.disabled && e.push("-disabled"), this.config.optionStyle !== "default" && e.push(`-${this.config.optionStyle}`), l.className = e.join(" "), l.append(t, i), this.el.style.display = "none", this.el.insertAdjacentElement("afterend", l), this.el.nextElementSibling;
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
  update(t = !0) {
    const s = JSON.stringify(this.options);
    this.options = this.extractOptions(!0), this.groups = this.extractGroups(), s !== JSON.stringify(this.options) && this.createGroupAndOptions(), this.setSelectState(), this.el.disabled ? this.disable() : this.enable(), t && u(this.el);
  }
  clear() {
    for (const t of this.options)
      t.attributes.selected && (t.attributes.selected = !1, t.element.selected = !1, t.uxOption && t.uxOption.classList.remove("-selected"));
    this.setSelectState(), u(this.el);
  }
  destroy() {
    this.uxEl.remove(), this.el.style.display = "";
  }
  onToggleShown(t) {
    t.preventDefault();
    const s = t.target;
    if (!this.state.disabled && !(this.uxClearButton && t.target === this.uxClearButton) && !(this.uxBody && this.uxBody.contains(s))) {
      if (this.uxEl.classList.contains("-shown")) {
        this.uxEl.classList.remove("-shown");
        return;
      }
      this.uxEl.classList.add("-shown"), this.config.isSearchable && this.uxSearchInput && (this.uxSearchInput.value = "", this.uxSearchInput.dispatchEvent(new Event("input")), this.config.isSearchFocus && this.uxSearchInput.focus());
    }
  }
  onClickOutside(t) {
    const s = t.target;
    this.uxEl.contains(s) || this.uxEl.classList.remove("-shown");
  }
  onClickClear(t) {
    if (t.preventDefault(), !this.state.disabled)
      return this.config.hideOnClear && this.uxEl.classList.remove("-shown"), this.clear();
  }
  onClickOption(t) {
    t.preventDefault();
    const s = t.target;
    if (!s.classList.contains("-disabled") && !(!this.state.multiple && s.classList.contains("-selected"))) {
      if (this.state.multiple) {
        t.stopPropagation();
        const i = this.options.find((l) => l.uxOption === s);
        i && i.uxOption && (i.attributes.selected = !i.attributes.selected, i.element.selected = i.attributes.selected, i.uxOption.classList.toggle("-selected"));
      } else
        for (const i of this.options) {
          const l = i.uxOption === s;
          i.attributes.selected = l, i.element.selected = l, i.uxOption && i.uxOption.classList.toggle("-selected", l);
        }
      return this.config.hideOnSelect && this.uxEl.classList.remove("-shown"), this.update();
    }
  }
  onSearch(t) {
    if (t.target === null)
      return;
    const i = t.target.value.toLowerCase(), l = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), e = this.uxEl.querySelectorAll(".ux-select-group");
    if (i === "") {
      for (const o of this.options)
        o.uxOption && (o.uxOption.style.display = "");
      if (this.config.isGroupOptions)
        for (const o of e)
          o.style.display = "";
      return;
    }
    const n = new RegExp(l);
    for (const o of this.options) {
      const r = n.test(o.data.text.toLowerCase());
      o.uxOption && (o.uxOption.style.display = r ? "" : "none");
    }
    if (this.config.isGroupOptions)
      for (const o of e) {
        o.style.display = "";
        const r = o.querySelector(".ux-select-group__list");
        r && (o.style.display = r.clientHeight !== 0 ? "" : "none");
      }
    p(this.el);
  }
  bindEvents() {
    this.uxEl.addEventListener("click", this.onToggleShown.bind(this)), this.uxClearButton && this.uxClearButton.addEventListener("click", this.onClickClear.bind(this)), window.addEventListener("click", this.onClickOutside.bind(this)), this.config.isSearchable && this.uxSearchInput && this.uxSearchInput.addEventListener("input", this.onSearch.bind(this));
  }
}
export {
  x as default
};
//# sourceMappingURL=ux-select.es.js.map
