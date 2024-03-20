export type UxSelectParams = {
  isSearchable?: boolean;
  isSearchFocus?: boolean;
  isGroupOptions?: boolean;
  hideOnClear?: boolean;
  hideOnSelect?: boolean;
  optionStyle?: 'checkbox' | 'radio' | 'image' | 'default';
  closeButton?: boolean;
  placeholder?: string;
  searchText?: string;
  clearText?: string;
  selectedText?: string;
};

export type UxSelectOptions = {
  attributes: {
    selected: boolean;
    disabled: boolean;
    group: string;
  };
  data: {
    text: string;
    value: string;
  };
  image?: {
    src: string;
    srcset: string | undefined;
    alt: string;
    width: number;
    height: number;
  };
  element: HTMLOptionElement;
  uxOption: HTMLLIElement | undefined;
};

export type UxSelectConfig = Pick<
  UxSelectParams,
  'isSearchable' | 'isSearchFocus' | 'isGroupOptions' | 'hideOnClear' | 'hideOnSelect' | 'optionStyle' | 'closeButton'
>;

export type UxSelectLocalization = Pick<UxSelectParams, 'placeholder', 'searchText', 'clearText', 'selectedText'>;

export type UxSelectState = {
  multiple: boolean;
  disabled: boolean;
};
