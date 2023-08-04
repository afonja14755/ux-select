import "./ux-select.scss";

import { UxSelectConstructorOptions, UxSelectOptionObject } from "./types.ts";

import triggerChange from "./utils/events/triggerChange.ts";
import triggerInput from "./utils/events/triggerInput.ts";

export default class UxSelect {
  el: HTMLSelectElement;
  config: {
    isSearchable: boolean;
    isGroupOptions: boolean;
    optionStyle: "checkbox" | "radio" | "default";
    placeholder: string | undefined;
    searchText: string | undefined;
    clearText: string | undefined;
    selectedText: string | undefined;
  };
  localization: {
    placeholder: string;
    searchText: string;
    clearText: string;
    selectedText: string;
  };
  state: { multiple: boolean; disabled: boolean };
  options: UxSelectOptionObject[];
  groups: string[];
  #uxEl: Element | undefined;

  constructor(element: HTMLSelectElement, options: UxSelectConstructorOptions) {
    this.el = element;
    this.config = options || {
      isSearchable: false,
      isGroupOptions: false,
      optionStyle: "default",
    };

    this.localization = {
      placeholder: this.el.dataset.placeholder || this.config.placeholder || "Select an option",
      searchText: this.el.dataset.searchText || this.config.searchText || "Search",
      clearText: this.el.dataset.clearText || this.config.clearText || "Clear option(s)",
      selectedText: this.el.dataset.selectedText || this.config.selectedText || "Selected:",
    };

    this.state = {
      multiple: this.el.multiple,
      disabled: this.el.disabled,
    };

    this.options = [];
    this.groups = [];

    this.#uxEl = undefined;

    this.#init();
  }

  #init(): void {
    this.#extractOptionsData();
    this.#renderSelect();
    this.#bindEvents();
  }

  #extractOptionsData(): void {
    const options: HTMLOptionsCollection = this.el.options;
    if (options.length <= 0) throw Error(`Null options at ${this.el}`);
    this.options = [];

    for (const option of options) {
      let group: string;
      if (this.config.isGroupOptions) {
        group = option.dataset.uxSelectGroup ? option.dataset.uxSelectGroup : "empty";
      } else {
        group = "empty";
      }

      if (this.groups.indexOf(group) === -1) this.groups.push(group);

      this.options.push({
        attributes: {
          selected: option.getAttribute("selected") !== null,
          disabled: option.disabled,
          group,
        },
        data: {
          text: option.textContent || "",
          value: option.value,
        },
        element: option,
      });
    }
  }

  #setSelectState(values: string[] = []): void {
    if (this.#uxEl) {
      const selectTitle = this.#uxEl.querySelector(".ux-select__title");
      if (!selectTitle) throw Error("selectTitle is null");
      if (values.length === 1) {
        selectTitle.textContent = values[0];
        this.#uxEl.classList.add("-filled");
      } else if (values.length > 0 && this.state.multiple) {
        selectTitle.textContent = `${this.localization.selectedText} ${values.length}`;
        this.#uxEl.classList.add("-filled");
      } else {
        selectTitle.textContent = this.localization.placeholder;
        this.#uxEl.classList.remove("-filled");
      }
    }
  }

  #renderOptions(): void {
    new Promise(resolve => {
      const selectedValues: string[] = [];

      this.options.forEach(option => {
        const selectListElem = document.createElement("li");
        selectListElem.classList.add("ux-select-group__elem");
        selectListElem.dataset.value = option.data.value;
        selectListElem.textContent = option.data.text;
        if (option.attributes.selected) {
          selectListElem.classList.add("-selected");
          selectedValues.push(option.data.text !== null ? option.data.text : "");
        }
        if (option.attributes.disabled) selectListElem.classList.add("-disabled");

        selectListElem.addEventListener("click", this.#onClickOption.bind(this));

        if (this.#uxEl) {
          const selectGroupList: HTMLElement | null = this.#uxEl.querySelector(
            `[data-ux-group="${option.attributes.group}"] .ux-select-group__list`,
          );
          if (selectGroupList) selectGroupList.appendChild(selectListElem);
        }
      });

      this.#setSelectState(selectedValues);

      this.config.isGroupOptions ? resolve(true) : resolve(false);
    }).then(isGroup => {
      if (!isGroup) return;

      if (this.#uxEl) {
        const groups: NodeListOf<HTMLDivElement> = this.#uxEl.querySelectorAll(".ux-select-group");
        if (groups.length > 0) {
          groups.forEach((group: HTMLElement) => {
            const groupList = group.querySelector(".ux-select-group__list");
            if (groupList) {
              const groupElements = groupList.querySelectorAll(".ux-select-group__elem"),
                groupDisabledElements = groupList.querySelectorAll(".ux-select-group__elem.-disabled");

              groupElements.length === groupDisabledElements.length
                ? group.classList.add("-disabled")
                : group.classList.remove("-disabled");
            }
          });
        }
      }
    });
  }

  #renderGroups(): void {
    if (this.#uxEl) {
      const uxSelectList = this.#uxEl.querySelector(".ux-select__dropdown");
      if (!uxSelectList) throw Error("uxSelectList is null");
      uxSelectList.innerHTML = "";
      this.groups.forEach(group => {
        const selectGroup = document.createElement("div");
        selectGroup.classList.add("ux-select__group", "ux-select-group");
        if (group === "empty") selectGroup.classList.add("-empty");
        selectGroup.dataset.uxGroup = group;

        if (group !== "empty") {
          const selectGroupTitle = document.createElement("div");
          selectGroupTitle.classList.add("ux-select-group__title");
          selectGroupTitle.textContent = group;

          selectGroup.appendChild(selectGroupTitle);
        }

        const selectGroupList = document.createElement("ul");
        selectGroupList.classList.add("ux-select-group__list");

        selectGroup.appendChild(selectGroupList);
        uxSelectList.appendChild(selectGroup);
      });

      this.#renderOptions();
    }
  }

  #renderSelect(): void {
    this.el.style.display = "none";

    /** Create select head */
    const selectHead = document.createElement("div");
    selectHead.classList.add("ux-select__head");

    const selectTitle = document.createElement("div");
    selectTitle.classList.add("ux-select__title");
    selectTitle.textContent = this.localization.placeholder;

    const selectClear = document.createElement("button");
    selectClear.type = "button";
    selectClear.classList.add("ux-select__clear");
    selectClear.title = this.localization.clearText;

    selectHead.append(selectTitle, selectClear);

    /** Create body */
    const selectBody = document.createElement("div");
    selectBody.classList.add("ux-select__body");

    if (this.config.isSearchable) {
      const selectSearchWrap = document.createElement("div");
      selectSearchWrap.classList.add("ux-select__search");

      const selectSearch = document.createElement("input");
      selectSearch.type = "search";
      selectSearch.classList.add("ux-select-search__input");
      selectSearch.placeholder = this.localization.searchText;

      selectSearchWrap.appendChild(selectSearch);
      selectBody.appendChild(selectSearchWrap);
    }

    const selectList = document.createElement("div");
    selectList.classList.add("ux-select__dropdown");

    selectBody.appendChild(selectList);

    /** Create select element */
    const select = document.createElement("div");

    /* Create class list for select element */
    const classes = ["ux-select", this.el.classList];
    if (this.state.multiple) classes.push("-multiple");
    if (this.state.disabled) classes.push("-disabled");
    if (this.config.optionStyle !== "default") classes.push(`-${this.config.optionStyle}`);
    select.className = classes.join(" ");

    select.append(selectHead, selectBody);
    /** Append UX select */
    this.el.insertAdjacentElement("afterend", select);

    if (this.el.nextElementSibling) this.#uxEl = this.el.nextElementSibling;

    this.#renderGroups();
  }

  disable(): void {
    if (!this.state.disabled && this.#uxEl) {
      this.el.disabled = true;
      this.#uxEl.classList.add("-disabled");
      this.state.disabled = true;
    }
  }

  enable(): void {
    if (this.state.disabled && this.#uxEl) {
      this.el.disabled = false;
      this.#uxEl.classList.remove("-disabled");
      this.state.disabled = false;
    }
  }

  update(isTriggerChange: boolean = true): void {
    this.#extractOptionsData();
    this.#renderGroups();

    this.el.disabled ? this.disable() : this.enable();

    if (isTriggerChange) triggerChange(this.el);
  }

  clear(): void {
    this.options.forEach(option => {
      if (option.attributes.selected && this.#uxEl) {
        option.attributes.selected = false;

        const uxOption = this.#uxEl.querySelector(`[data-value="${option.data.value}"]`);
        if (uxOption) uxOption.classList.remove("-selected");
        option.element.removeAttribute("selected");
      }
    });
    this.#setSelectState();

    triggerChange(this.el);
  }

  destroy(): void {
    if (this.#uxEl) {
      this.#uxEl.remove();
      this.el.style.display = "";
    }
  }

  #onToggleShown(e: Event): void {
    e.preventDefault();
    const targetEl = e.target as HTMLElement;

    if (this.state.disabled) return;
    if (!this.#uxEl) throw Error("uxEl is null");

    const uxSelectBody = this.#uxEl.querySelector(".ux-select__body");
    if (!uxSelectBody) throw Error("uxSelectBody is null");
    if (e.target !== this.#uxEl.querySelector(".ux-select__clear") && !uxSelectBody.contains(targetEl)) {
      if (this.#uxEl.classList.contains("-shown")) {
        this.#uxEl.classList.remove("-shown");
      } else {
        this.#uxEl.classList.add("-shown");
        if (this.config.isSearchable) {
          const uxSearch: HTMLInputElement | null = this.#uxEl.querySelector(".ux-select-search__input");
          if (!uxSearch) throw Error("Search input is null");
          uxSearch.value = "";
          uxSearch.dispatchEvent(new Event("input"));
          uxSearch.focus();
        }
      }
    }
  }

  #onClickOutside(e: Event): void {
    const targetEl = e.target as HTMLElement;
    if (!this.#uxEl) throw Error("uxEl is null");
    if (!this.#uxEl.contains(targetEl)) this.#uxEl.classList.remove("-shown");
  }

  #onClickClear(e: Event): boolean | void {
    e.preventDefault();

    if (this.state.disabled) return false;

    return this.clear();
  }

  #onClickOption(e: Event): boolean | void {
    e.preventDefault();

    if (e.target !== null) {
      const option = e.target as HTMLElement;
      if (option.classList.contains("-disabled")) return false;

      if (this.state.multiple) {
        e.stopPropagation();

        const currentOption: Element | null = this.el.querySelector(`[value="${option.dataset.value}"]`);
        if (!currentOption) throw Error("Option equal this value not found");

        option.classList.contains("-selected")
          ? currentOption.removeAttribute("selected")
          : currentOption.setAttribute("selected", "");
      } else {
        if (!option.classList.contains("-selected")) {
          this.el.querySelectorAll("option").forEach(optionEl => {
            optionEl.value === option.dataset.value
              ? optionEl.setAttribute("selected", "")
              : optionEl.removeAttribute("selected");
          });
        } else {
          return false;
        }
      }
      return this.update();
    }
  }

  #onSearch(e: Event): void {
    if (e.target !== null && this.#uxEl) {
      const input = e.target as HTMLInputElement,
        text = input.value.toLowerCase(),
        groups: NodeListOf<HTMLDivElement> = this.#uxEl.querySelectorAll(".ux-select-group");

      if (text === "") {
        const options: NodeListOf<HTMLDivElement> = this.#uxEl.querySelectorAll(".ux-select-group__elem");

        options.forEach((option: HTMLElement) => (option.style.display = ""));
        if (this.config.isGroupOptions) {
          groups.forEach((group: HTMLElement) => (group.style.display = ""));
        }
      } else {
        const searchValue = new RegExp(text);

        new Promise(resolve => {
          this.options.forEach(option => {
            if (!this.#uxEl) throw Error("uxEl is null");
            const match = searchValue.test(option.data.text.toLowerCase()),
              uxOption: HTMLDivElement | null = this.#uxEl.querySelector(`[data-value="${option.data.value}"]`);

            if (!uxOption) throw Error("uxOption is null");
            uxOption.style.display = match ? "" : "none";
          });
          this.config.isGroupOptions ? resolve(true) : resolve(false);
        }).then(res => {
          if (!res) return;
          groups.forEach((group: HTMLElement) => {
            const groupList = group.querySelector(".ux-select-group__list");
            group.style.display = "";
            if (groupList) group.style.display = groupList.clientHeight !== 0 ? "" : "none";
          });
        });
      }

      triggerInput(this.el);
    }
  }

  #bindEvents(): void {
    if (this.#uxEl) {
      this.#uxEl.addEventListener("click", this.#onToggleShown.bind(this));

      const clearBtn = this.#uxEl.querySelector(".ux-select__clear");
      if (clearBtn) clearBtn.addEventListener("click", this.#onClickClear.bind(this));

      window.addEventListener("click", this.#onClickOutside.bind(this));

      if (this.config.isSearchable) {
        const searchInput = this.#uxEl.querySelector(".ux-select-search__input");
        if (searchInput) searchInput.addEventListener("input", this.#onSearch.bind(this));
      }
    }
  }
}
