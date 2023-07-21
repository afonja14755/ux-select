import uxSelect from "./src/ux-select.js";

document.addEventListener("DOMContentLoaded", () => {
  const defaultSelect = document.getElementById("test-default");
  if (defaultSelect) {
    defaultSelect.uxSelect = new uxSelect(defaultSelect);
  }

  const disabledSelect = document.getElementById("test-disabled");
  if (disabledSelect) {
    disabledSelect.uxSelect = new uxSelect(disabledSelect);
  }

  const searchableByOptionsSelect = document.getElementById("test-searchable-options");
  if (searchableByOptionsSelect) {
    searchableByOptionsSelect.uxSelect = new uxSelect(searchableByOptionsSelect, {
      searchable: true,
      searchText: "Поиск...",
      placeholder: "Выберите опцию",
      clearText: "Сбросить"
    });
  }

  const multipleSelect = document.getElementById("test-multiple");
  if (multipleSelect) {
    multipleSelect.uxSelect = new uxSelect(multipleSelect);
  }

  const multipleSelectGroup = document.getElementById("test-multiple-group");
  if (multipleSelectGroup) {
    multipleSelectGroup.uxSelect = new uxSelect(multipleSelectGroup, {
      searchable: true,
      groupOptions: true
    });

    multipleSelectGroup.addEventListener("change", function () {
      //console.log("change");
    });
  }
});
