export type UxSelectParams = {
  isSearchable?: boolean
  isSearchFocus?: boolean
  searchName?: string
  isDisplaySelectedItems?: boolean
  isGroupOptions?: boolean
  hideOnClear?: boolean
  hideOnSelect?: boolean
  optionStyle?: string
  closeButton?: boolean
  selectAllOption?: boolean
  placeholder?: string
  searchText?: string
  clearText?: string
  selectedText?: string
  selectAllText?: string
}

export type UxSelectOptions = {
  attributes: {
    selected: boolean
    disabled: boolean
    group: string
  }
  data: {
    text: string
    value: string
    selectedDisplayText?: string
  }
  image?: {
    src: string
    srcset: string | undefined
    alt: string
    width: number
    height: number
  }
  svg?: {
    src: string
    width: number
    height: number
  }
  element: HTMLOptionElement
  uxOption: HTMLLIElement | undefined
}

export type UxSelectConfig = Pick<
  UxSelectParams,
  | 'isSearchable'
  | 'isSearchFocus'
  | 'searchName'
  | 'isDisplaySelectedItems'
  | 'isGroupOptions'
  | 'hideOnClear'
  | 'hideOnSelect'
  | 'optionStyle'
  | 'closeButton'
  | 'selectAllOption'
>

export type UxSelectLocalization = Pick<
  UxSelectParams,
  'placeholder',
  'searchText',
  'clearText',
  'selectedText',
  'selectAllText'
>

export type UxSelectState = {
  multiple: boolean
  disabled: boolean
  isAllSelected: boolean
}
