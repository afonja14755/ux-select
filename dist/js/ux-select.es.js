var d = Object.defineProperty;
var h = (c, t, e) => t in c ? d(c, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : c[t] = e;
var a = (c, t, e) => (h(c, typeof t != "symbol" ? t + "" : t, e), e);
function u(c) {
  const t = new Event("change");
  c.dispatchEvent(t);
}
function p(c) {
  const t = new Event("input");
  c.dispatchEvent(t);
}
class x {
  constructor(t, e = {}) {
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
      isSearchable: e.isSearchable ?? !1,
      isSearchFocus: e.isSearchFocus ?? !1,
      isGroupOptions: e.isGroupOptions ?? !1,
      hideOnClear: e.hideOnClear ?? !0,
      hideOnSelect: e.hideOnSelect ?? !1,
      optionStyle: e.optionStyle ?? "default",
      closeButton: e.closeButton ?? !0
    }, this.localization = {
      placeholder: this.el.dataset.placeholder ?? e.placeholder ?? "Select an option",
      searchText: this.el.dataset.searchText ?? e.searchText ?? "Search",
      clearText: this.el.dataset.clearText ?? e.clearText ?? "Clear option(s)",
      selectedText: this.el.dataset.selectedText ?? e.selectedText ?? "Selected:"
    }, this.state = {
      multiple: this.el.multiple,
      disabled: this.el.disabled
    }, this.options = this.extractOptions(), this.groups = this.extractGroups(), this.uxEl = this.create(), this.setSelectState(), this.bindEvents();
  }
  extractOptions(t = !1) {
    const e = this.el.options, o = this.config.isGroupOptions, s = [];
    for (const i of e) {
      if (i.value === "")
        continue;
      let l = "empty";
      o && i.dataset.uxSelectGroup && (l = i.dataset.uxSelectGroup);
      let n;
      t && (n = this.uxEl.querySelector(`.ux-select-group__elem[data-value='${i.value}']`));
      let r;
      this.config.optionStyle === "image" && i.dataset.imageSrc && (r = {
        src: i.dataset.imageSrc,
        srcset: i.dataset.imageSrcset ?? void 0,
        alt: i.dataset.imageAlt ?? "",
        width: i.dataset.imageWidth ? Number(i.dataset.imageWidth) : 24,
        height: i.dataset.imageHeight ? Number(i.dataset.imageHeight) : 24
      }), s.push({
        attributes: {
          selected: i.selected,
          disabled: i.disabled,
          group: l
        },
        data: {
          text: i.textContent ? i.textContent.trim() : "",
          value: i.value
        },
        image: r,
        element: i,
        uxOption: n
      });
    }
    return s;
  }
  extractGroups() {
    const t = this.el.options, e = this.config.isGroupOptions, o = /* @__PURE__ */ new Set();
    for (const s of t) {
      if (s.value === "")
        continue;
      let i = "empty";
      e && s.dataset.uxSelectGroup && (i = s.dataset.uxSelectGroup), o.add(i);
    }
    return Array.from(o);
  }
  setSelectState() {
    const t = this.uxEl.querySelector(".ux-select__title"), e = this.options.reduce((o, s) => (s.attributes.selected && o.push(s.data.text), o), []);
    if (e.length > 0 ? (e.length === 1 ? t.textContent = e[0] : this.state.multiple && (t.textContent = `${this.localization.selectedText} ${e.length}`), this.uxEl.classList.add("-filled")) : (t.textContent = this.localization.placeholder, this.uxEl.classList.remove("-filled")), this.config.isGroupOptions)
      for (const o of this.groups) {
        const s = this.uxEl.querySelector(`[data-ux-group="${o}"]`);
        if (!s)
          continue;
        const i = s.querySelector(".ux-select-group__list");
        if (!i)
          continue;
        const n = Array.from(i.querySelectorAll(".ux-select-group__elem")).every((r) => {
          r.classList.contains("-disabled");
        });
        s.classList.toggle("-disabled", n);
      }
  }
  createGroupElement(t) {
    const e = document.createElement("div");
    if (e.classList.add("ux-select__group", "ux-select-group"), e.dataset.uxGroup = t, t === "empty")
      e.classList.add("-empty");
    else {
      const s = document.createElement("div");
      s.classList.add("ux-select-group__title"), s.textContent = t, e.appendChild(s);
    }
    const o = document.createElement("ul");
    return o.classList.add("ux-select-group__list"), e.appendChild(o), e;
  }
  createGroupAndOptions() {
    const t = document.createElement("div");
    t.classList.add("ux-select__dropdown");
    const e = document.createDocumentFragment(), o = {};
    for (const s of this.groups) {
      const i = this.createGroupElement(s);
      e.appendChild(i), o[s] = document.createDocumentFragment();
    }
    t.appendChild(e);
    for (const s of this.options) {
      const i = document.createElement("li");
      if (i.classList.add("ux-select-group__elem"), i.dataset.value = s.data.value, i.textContent = s.data.text, s.attributes.selected && i.classList.add("-selected"), s.attributes.disabled && i.classList.add("-disabled"), this.config.optionStyle === "image" && s.image) {
        const l = document.createElement("img");
        l.classList.add("ux-select-group-elem__image"), l.src = s.image.src, l.width = s.image.width, l.height = s.image.height, l.alt = s.image.alt, s.image.srcset && (l.srcset = `${s.image.src} 1x, ${s.image.srcset} 2x`), i.appendChild(l);
      }
      i.addEventListener("click", this.onClickOption.bind(this)), o[s.attributes.group].appendChild(i), s.uxOption = i;
    }
    for (const s of this.groups) {
      const i = o[s], l = t.querySelector(`[data-ux-group="${s}"] .ux-select-group__list`);
      l && l.appendChild(i);
    }
    if (!this.uxBody)
      throw new Error("uxBody is undefined");
    this.uxBody.childNodes[1] ? this.uxBody.replaceChild(t, this.uxBody.childNodes[1]) : this.uxBody.appendChild(t);
  }
  create() {
    const t = document.createElement("div");
    t.classList.add("ux-select__head");
    const e = document.createElement("div");
    if (e.classList.add("ux-select__title"), e.textContent = this.localization.placeholder, t.appendChild(e), this.config.closeButton) {
      const l = document.createElement("button");
      l.type = "button", l.classList.add("ux-select__clear"), l.title = this.localization.clearText, this.uxClearButton = l, t.appendChild(l);
    }
    const o = document.createElement("div");
    if (o.classList.add("ux-select__body"), this.uxBody = o, this.config.isSearchable) {
      const l = document.createElement("div");
      l.classList.add("ux-select__search");
      const n = document.createElement("input");
      n.type = "search", n.classList.add("ux-select-search__input"), n.placeholder = this.localization.searchText, this.uxSearchInput = n, l.appendChild(n), o.appendChild(l);
    }
    this.createGroupAndOptions();
    const s = document.createElement("div"), i = ["ux-select", this.el.classList];
    return this.state.multiple && i.push("-multiple"), this.state.disabled && i.push("-disabled"), this.config.optionStyle !== "default" && i.push(`-${this.config.optionStyle}`), s.className = i.join(" "), s.append(t, o), this.el.style.display = "none", this.el.insertAdjacentElement("afterend", s), this.el.nextElementSibling;
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
    const e = JSON.stringify(this.options);
    this.options = this.extractOptions(!0), this.groups = this.extractGroups(), e !== JSON.stringify(this.options) && this.createGroupAndOptions(), this.setSelectState(), this.el.disabled ? this.disable() : this.enable(), t && u(this.el);
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
    const e = t.target;
    if (!this.state.disabled && !(this.uxClearButton && t.target === this.uxClearButton) && !(this.uxBody && this.uxBody.contains(e))) {
      if (this.uxEl.classList.contains("-shown")) {
        this.uxEl.classList.remove("-shown");
        return;
      }
      this.uxEl.classList.add("-shown"), this.config.isSearchable && this.uxSearchInput && (this.uxSearchInput.value = "", this.uxSearchInput.dispatchEvent(new Event("input")), this.config.isSearchFocus && this.uxSearchInput.focus());
    }
  }
  onClickOutside(t) {
    const e = t.target;
    this.uxEl.contains(e) || this.uxEl.classList.remove("-shown");
  }
  onClickClear(t) {
    if (t.preventDefault(), !this.state.disabled)
      return this.config.hideOnClear && this.uxEl.classList.remove("-shown"), this.clear();
  }
  onClickOption(t) {
    t.preventDefault();
    const e = t.target;
    if (!e.classList.contains("-disabled") && !(!this.state.multiple && e.classList.contains("-selected"))) {
      if (this.state.multiple) {
        t.stopPropagation();
        const o = this.options.find((s) => s.uxOption === e);
        o && o.uxOption && (o.attributes.selected = !o.attributes.selected, o.element.selected = o.attributes.selected, o.uxOption.classList.toggle("-selected"));
      } else
        for (const o of this.options) {
          const s = o.uxOption === e;
          o.attributes.selected = s, o.element.selected = s, o.uxOption && o.uxOption.classList.toggle("-selected", s);
        }
      return this.config.hideOnSelect && this.uxEl.classList.remove("-shown"), this.update();
    }
  }
  onSearch(t) {
    if (t.target === null)
      return;
    const o = t.target.value.toLowerCase(), s = o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), i = this.uxEl.querySelectorAll(".ux-select-group");
    if (o === "") {
      for (const n of this.options)
        n.uxOption && (n.uxOption.style.display = "");
      if (this.config.isGroupOptions)
        for (const n of i)
          n.style.display = "";
      return;
    }
    const l = new RegExp(s);
    for (const n of this.options) {
      const r = l.test(n.data.text.toLowerCase());
      n.uxOption && (n.uxOption.style.display = r ? "" : "none");
    }
    if (this.config.isGroupOptions)
      for (const n of i) {
        n.style.display = "";
        const r = n.querySelector(".ux-select-group__list");
        r && (n.style.display = r.clientHeight !== 0 ? "" : "none");
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
