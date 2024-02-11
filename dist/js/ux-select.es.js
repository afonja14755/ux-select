var d = Object.defineProperty;
var p = (a, t, e) => t in a ? d(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var c = (a, t, e) => (p(a, typeof t != "symbol" ? t + "" : t, e), e);
function r(a) {
  const t = new Event("change");
  a.dispatchEvent(t);
}
function h(a) {
  const t = new Event("input");
  a.dispatchEvent(t);
}
class f {
  constructor(t, e = {}) {
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
    this.el = t, this.config = {
      isSearchable: e.isSearchable ?? !1,
      isSearchFocus: e.isSearchFocus ?? !1,
      isGroupOptions: e.isGroupOptions ?? !1,
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
    const e = this.el.options, i = this.config.isGroupOptions, s = [];
    for (const o of e) {
      if (o.value === "")
        continue;
      let n = "empty";
      i && o.dataset.uxSelectGroup && (n = o.dataset.uxSelectGroup);
      let l;
      t && (l = this.uxEl.querySelector(`.ux-select-group__elem[data-value='${o.value}']`)), s.push({
        attributes: {
          selected: o.selected,
          disabled: o.disabled,
          group: n
        },
        data: {
          text: o.textContent ? o.textContent.trim() : "",
          value: o.value
        },
        element: o,
        uxOption: l
      });
    }
    return s;
  }
  extractGroups() {
    const t = this.el.options, e = this.config.isGroupOptions, i = /* @__PURE__ */ new Set();
    for (const s of t) {
      if (s.value === "")
        continue;
      let o = "empty";
      e && s.dataset.uxSelectGroup && (o = s.dataset.uxSelectGroup), i.add(o);
    }
    return Array.from(i);
  }
  setSelectState() {
    const t = this.uxEl.querySelector(".ux-select__title"), e = this.options.reduce((i, s) => (s.attributes.selected && i.push(s.data.text), i), []);
    if (e.length > 0 ? (e.length === 1 ? t.textContent = e[0] : this.state.multiple && (t.textContent = `${this.localization.selectedText} ${e.length}`), this.uxEl.classList.add("-filled")) : (t.textContent = this.localization.placeholder, this.uxEl.classList.remove("-filled")), this.config.isGroupOptions)
      for (const i of this.groups) {
        const s = this.uxEl.querySelector(`[data-ux-group="${i}"]`);
        if (!s)
          continue;
        const o = s.querySelector(".ux-select-group__list");
        if (!o)
          continue;
        const l = Array.from(o.querySelectorAll(".ux-select-group__elem")).every((u) => {
          u.classList.contains("-disabled");
        });
        s.classList.toggle("-disabled", l);
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
    const i = document.createElement("ul");
    return i.classList.add("ux-select-group__list"), e.appendChild(i), e;
  }
  createGroupAndOptions() {
    const t = document.createElement("div");
    t.classList.add("ux-select__dropdown");
    const e = document.createDocumentFragment(), i = {};
    for (const s of this.groups) {
      const o = this.createGroupElement(s);
      e.appendChild(o), i[s] = document.createDocumentFragment();
    }
    t.appendChild(e);
    for (const s of this.options) {
      const o = document.createElement("li");
      o.classList.add("ux-select-group__elem"), o.dataset.value = s.data.value, o.textContent = s.data.text, s.attributes.selected && o.classList.add("-selected"), s.attributes.disabled && o.classList.add("-disabled"), o.addEventListener("click", this.onClickOption.bind(this)), i[s.attributes.group].appendChild(o), s.uxOption = o;
    }
    for (const s of this.groups) {
      const o = i[s], n = t.querySelector(`[data-ux-group="${s}"] .ux-select-group__list`);
      n && n.appendChild(o);
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
      const n = document.createElement("button");
      n.type = "button", n.classList.add("ux-select__clear"), n.title = this.localization.clearText, this.uxClearButton = n, t.appendChild(n);
    }
    const i = document.createElement("div");
    if (i.classList.add("ux-select__body"), this.uxBody = i, this.config.isSearchable) {
      const n = document.createElement("div");
      n.classList.add("ux-select__search");
      const l = document.createElement("input");
      l.type = "search", l.classList.add("ux-select-search__input"), l.placeholder = this.localization.searchText, this.uxSearchInput = l, n.appendChild(l), i.appendChild(n);
    }
    this.createGroupAndOptions();
    const s = document.createElement("div"), o = ["ux-select", this.el.classList];
    return this.state.multiple && o.push("-multiple"), this.state.disabled && o.push("-disabled"), this.config.optionStyle !== "default" && o.push(`-${this.config.optionStyle}`), s.className = o.join(" "), s.append(t, i), this.el.style.display = "none", this.el.insertAdjacentElement("afterend", s), this.el.nextElementSibling;
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
    this.options = this.extractOptions(!0), this.groups = this.extractGroups(), e !== JSON.stringify(this.options) && this.createGroupAndOptions(), this.setSelectState(), this.el.disabled ? this.disable() : this.enable(), t && r(this.el);
  }
  clear() {
    for (const t of this.options)
      t.attributes.selected && (t.attributes.selected = !1, t.element.selected = !1, t.uxOption && t.uxOption.classList.remove("-selected"));
    this.setSelectState(), r(this.el);
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
      return this.clear();
  }
  onClickOption(t) {
    t.preventDefault();
    const e = t.target;
    if (!e.classList.contains("-disabled") && !(!this.state.multiple && e.classList.contains("-selected"))) {
      if (this.state.multiple) {
        t.stopPropagation();
        const i = this.options.find((s) => s.uxOption === e);
        i && i.uxOption && (i.attributes.selected = !i.attributes.selected, i.element.selected = i.attributes.selected, i.uxOption.classList.toggle("-selected"));
      } else
        for (const i of this.options) {
          const s = i.uxOption === e;
          i.attributes.selected = s, i.element.selected = s, i.uxOption && i.uxOption.classList.toggle("-selected", s);
        }
      return this.update();
    }
  }
  onSearch(t) {
    if (t.target === null)
      return;
    const i = t.target.value.toLowerCase(), s = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), o = this.uxEl.querySelectorAll(".ux-select-group");
    if (i === "") {
      for (const l of this.options)
        l.uxOption && (l.uxOption.style.display = "");
      if (this.config.isGroupOptions)
        for (const l of o)
          l.style.display = "";
      return;
    }
    const n = new RegExp(s);
    for (const l of this.options) {
      const u = n.test(l.data.text.toLowerCase());
      l.uxOption && (l.uxOption.style.display = u ? "" : "none");
    }
    if (this.config.isGroupOptions)
      for (const l of o) {
        l.style.display = "";
        const u = l.querySelector(".ux-select-group__list");
        u && (l.style.display = u.clientHeight !== 0 ? "" : "none");
      }
    h(this.el);
  }
  bindEvents() {
    this.uxEl.addEventListener("click", this.onToggleShown.bind(this)), this.uxClearButton && this.uxClearButton.addEventListener("click", this.onClickClear.bind(this)), window.addEventListener("click", this.onClickOutside.bind(this)), this.config.isSearchable && this.uxSearchInput && this.uxSearchInput.addEventListener("input", this.onSearch.bind(this));
  }
}
export {
  f as default
};
//# sourceMappingURL=ux-select.es.js.map
