interface UxSelectConstructorOptions {
  isSearchable: boolean;
  isGroupOptions: boolean;
  placeholder: string | undefined;
  searchText: string | undefined;
  clearText: string | undefined;
  selectedText: string | undefined;
}

interface UxSelectOptionObject {
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
