export interface UxSelectParams {
  isSearchable: boolean;
  isSearchFocus: boolean;
  isGroupOptions: boolean;
  optionStyle: 'checkbox' | 'radio' | 'default';
  closeButton: boolean;
  placeholder: string;
  searchText: string;
  clearText: string;
  selectedText: string;
}

export interface UxSelectOptions {
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
  uxOption: HTMLLIElement | undefined;
}

export interface UxSelectConfig {
  isSearchable: boolean;
  isSearchFocus: boolean;
  isGroupOptions: boolean;
  optionStyle: 'checkbox' | 'radio' | 'default';
  closeButton: boolean;
}

export interface UxSelectLocalization {
  placeholder: string;
  searchText: string;
  clearText: string;
  selectedText: string;
}

export interface UxSelectState {
  multiple: boolean;
  disabled: boolean;
}
