export interface UxSelectConstructorOptions {
  isSearchable: boolean;
  isGroupOptions: boolean;
  optionStyle: "checkbox" | "radio" | "default";
  placeholder: string | undefined;
  searchText: string | undefined;
  clearText: string | undefined;
  selectedText: string | undefined;
}

export interface UxSelectOptionObject {
  attributes: {
    selected: boolean;
    disabled: boolean;
    group: string;
  };
  data: {
    text: string;
    value: string;
  };
  element: HTMLOptionElement;
}
