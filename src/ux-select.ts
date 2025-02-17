import './scss/ux-select.scss'

import { triggerChange, triggerInput } from './utils/events'

import {
  UxSelectParams,
  UxSelectOptions,
  UxSelectConfig,
  UxSelectLocalization,
  UxSelectState
} from './types'

/**
 * @class
 * @classdesc Creating a custom select element with support for grouping, searching, and other features.
 * @param {HTMLSelectElement} element - The original HTML <select> element to be transformed.
 * @param {Partial<UxSelectParams>} [params={}] - Optional parameters for configuring the behavior and appearance of UxSelect.
 */
export default class UxSelect {
  el: HTMLSelectElement

  config: UxSelectConfig
  localization: UxSelectLocalization
  state: UxSelectState

  options: UxSelectOptions[]
  groups: string[]

  uxEl: Element

  private uxBody: HTMLDivElement | undefined
  private uxSearchInput: HTMLInputElement | undefined
  private uxSearchOverlay: HTMLDivElement | undefined
  private uxClearButton: HTMLButtonElement | undefined
  private uxSelectAll: HTMLDivElement | undefined

  constructor(element: HTMLSelectElement, params: UxSelectParams = {}) {
    this.el = element

    this.config = {
      isSearchable:
        this.el.dataset.isSearchable !== undefined
          ? this.el.dataset.isSearchable === 'true'
          : (params.isSearchable ?? false),
      isSearchFocus:
        this.el.dataset.isSearchFocus !== undefined
          ? this.el.dataset.isSearchFocus === 'true'
          : (params.isSearchFocus ?? false),
      searchName:
        this.el.dataset.searchName !== undefined
          ? this.el.dataset.searchName
          : (params.searchName ?? ''),
      isDisplaySelectedItems:
        this.el.dataset.isDisplaySelectedItems !== undefined
          ? this.el.dataset.isDisplaySelectedItems === 'true'
          : (params.isDisplaySelectedItems ?? false),
      isGroupOptions:
        this.el.dataset.isGroupOptions !== undefined
          ? this.el.dataset.isGroupOptions === 'true'
          : (params.isGroupOptions ?? false),
      hideOnClear:
        this.el.dataset.hideOnClear !== undefined
          ? this.el.dataset.hideOnClear === 'true'
          : (params.hideOnClear ?? true),
      hideOnSelect:
        this.el.dataset.hideOnSelect !== undefined
          ? this.el.dataset.hideOnSelect === 'true'
          : (params.hideOnSelect ?? false),
      optionStyle: this.el.dataset.optionStyle ?? params.optionStyle ?? 'default',
      closeButton:
        this.el.dataset.closeButton !== undefined
          ? this.el.dataset.closeButton === 'true'
          : (params.closeButton ?? true),
      selectAllOption:
        this.el.dataset.selectAllOption !== undefined
          ? this.el.dataset.selectAllOption === 'true'
          : (params.selectAllOption ?? false)
    }
    this.localization = {
      placeholder: this.el.dataset.placeholder ?? params.placeholder ?? 'Select an option',
      searchText: this.el.dataset.searchText ?? params.searchText ?? 'Search',
      emptySearchText:
        this.el.dataset.emptySearchText ?? params.emptySearchText ?? 'No results found',
      clearText: this.el.dataset.clearText ?? params.clearText ?? 'Clear option(s)',
      selectedText: this.el.dataset.selectedText ?? params.selectedText ?? 'Selected:',
      selectAllText: this.el.dataset.selectAllText ?? params.selectAllText ?? 'Select all'
    }
    this.state = {
      multiple: this.el.multiple,
      disabled: this.el.disabled,
      isAllSelected: false
    }

    this.options = this.extractOptions()
    this.groups = this.extractGroups()

    this.uxEl = this.create()

    this.setSelectState()
    this.bindEvents()
  }

  private extractOptions(isUpdate = false): UxSelectOptions[] {
    const options: HTMLOptionsCollection = this.el.options
    const isGroupingEnabled = this.config.isGroupOptions
    const optionsData: UxSelectOptions[] = []

    for (const option of options) {
      if (option.value === '') continue

      let group = 'empty'
      if (isGroupingEnabled && option.dataset.uxSelectGroup) {
        group = option.dataset.uxSelectGroup
      }

      let uxOption = undefined
      if (isUpdate) {
        uxOption = this.uxEl.querySelector(`.ux-select-group__elem[data-value='${option.value}']`)
      }

      let optionImage = undefined
      let optionSvg = undefined
      if (this.config.optionStyle === 'image' && option.dataset.imageSrc) {
        optionImage = {
          src: option.dataset.imageSrc,
          srcset: option.dataset.imageSrcset ?? undefined,
          alt: option.dataset.imageAlt ?? '',
          width: option.dataset.imageWidth ? Number(option.dataset.imageWidth) : 24,
          height: option.dataset.imageHeight ? Number(option.dataset.imageHeight) : 24
        }
      } else if (this.config.optionStyle === 'image' && option.dataset.svgSrc) {
        optionSvg = {
          src: option.dataset.svgSrc,
          width: option.dataset.svgWidth ? Number(option.dataset.svgWidth) : 24,
          height: option.dataset.svgHeight ? Number(option.dataset.svgHeight) : 24
        }
      }

      optionsData.push(<UxSelectOptions>{
        attributes: {
          selected: option.selected,
          disabled: option.disabled,
          group
        },
        data: {
          text: option.textContent ? option.textContent.trim() : '',
          value: option.value,
          selectedDisplayText: option.dataset.selectedDisplayText
        },
        image: optionImage,
        svg: optionSvg,
        element: option,
        uxOption
      })
    }

    return optionsData
  }

  private extractGroups(): string[] {
    const options: HTMLOptionsCollection = this.el.options
    const isGroupingEnabled = this.config.isGroupOptions
    const uniqueGroups = new Set<string>()

    for (const option of options) {
      if (option.value === '') continue

      let group = 'empty'
      if (isGroupingEnabled && option.dataset.uxSelectGroup) {
        group = option.dataset.uxSelectGroup
      }
      uniqueGroups.add(group)
    }

    return Array.from(uniqueGroups)
  }

  private setSelectState(): void {
    const selectTitle = this.uxEl.querySelector('.ux-select__title') as Element

    const selectedTexts = this.options.reduce<string[]>((acc, item) => {
      if (item.attributes.selected) acc.push(item.data.selectedDisplayText || item.data.text)
      return acc
    }, [])

    if (selectedTexts.length > 0) {
      if (selectedTexts.length === 1) {
        selectTitle.textContent = selectedTexts[0]
      } else if (this.state.multiple) {
        selectTitle.textContent = this.config.isDisplaySelectedItems
          ? selectedTexts.join(', ')
          : `${this.localization.selectedText} ${selectedTexts.length}`
      }
      this.uxEl.classList.add('-filled')
    } else {
      selectTitle.textContent = this.localization.placeholder
      this.uxEl.classList.remove('-filled')
    }

    if (this.config.isGroupOptions) {
      for (const group of this.groups) {
        const htmlGroup = this.uxEl.querySelector(`[data-ux-group="${group}"]`)
        if (!htmlGroup) continue

        const groupList = htmlGroup.querySelector('.ux-select-group__list')
        if (!groupList) continue

        const groupElements = Array.from(groupList.querySelectorAll('.ux-select-group__elem'))
        const isAllDisabled = groupElements.every((elem) => {
          elem.classList.contains('-disabled')
        })
        htmlGroup.classList.toggle('-disabled', isAllDisabled)
      }
    }

    if (this.uxSelectAll) {
      this.uxSelectAll
        .querySelector('.ux-select-select-all__checkbox')
        ?.classList.remove('-null', '-all', '-some')

      const allSelected = this.options.every((option) => option.attributes.selected)
      const someSelected = this.options.some((option) => option.attributes.selected)

      this.state.isAllSelected = allSelected

      let selectAllClass = '-null'

      if (allSelected) {
        selectAllClass = '-all'
      } else if (someSelected) {
        selectAllClass = '-some'
      }

      this.uxSelectAll
        .querySelector('.ux-select-select-all__checkbox')
        ?.classList.add(selectAllClass)
    }
  }

  private createGroupElement(group: string): HTMLElement {
    const selectGroup = document.createElement('div')
    selectGroup.classList.add('ux-select__group', 'ux-select-group')
    selectGroup.dataset.uxGroup = group

    if (group === 'empty') {
      selectGroup.classList.add('-empty')
    } else {
      const selectGroupTitle = document.createElement('div')
      selectGroupTitle.classList.add('ux-select-group__title')
      selectGroupTitle.textContent = group
      selectGroup.appendChild(selectGroupTitle)
    }

    const selectGroupList = document.createElement('ul')
    selectGroupList.classList.add('ux-select-group__list')
    selectGroup.appendChild(selectGroupList)

    return selectGroup
  }

  private createGroupAndOptions() {
    const selectList = document.createElement('div')
    selectList.classList.add('ux-select__dropdown')

    if (this.state.multiple && this.config.selectAllOption) {
      const selectAllWrap = document.createElement('div')
      selectAllWrap.classList.add('ux-select__select-all')

      const selectAllCheckbox = document.createElement('div')
      selectAllCheckbox.classList.add('ux-select-select-all__checkbox')

      const selectAllText = document.createElement('div')
      selectAllText.classList.add('ux-select-select-all__text')
      selectAllText.textContent = this.localization.selectAllText

      selectAllWrap.append(selectAllCheckbox, selectAllText)

      this.uxSelectAll = selectAllWrap
      this.uxSelectAll.addEventListener('click', this.onClickSelectAll.bind(this))
      selectList.appendChild(selectAllWrap)
    }

    const groupFragment = document.createDocumentFragment()
    const optionsFragmentsByGroup: { [key: string]: DocumentFragment } = {}

    for (const group of this.groups) {
      const selectGroup = this.createGroupElement(group)
      groupFragment.appendChild(selectGroup)

      optionsFragmentsByGroup[group] = document.createDocumentFragment()
    }

    selectList.appendChild(groupFragment)

    for (const option of this.options) {
      const selectListElem = document.createElement('li')
      selectListElem.classList.add('ux-select-group__elem')
      selectListElem.dataset.value = option.data.value
      selectListElem.textContent = option.data.text

      if (option.attributes.selected) selectListElem.classList.add('-selected')
      if (option.attributes.disabled) selectListElem.classList.add('-disabled')

      if (this.config.optionStyle === 'image' && option.image) {
        const optionImageElem = document.createElement('img')
        optionImageElem.classList.add('ux-select-group-elem__image')
        optionImageElem.src = option.image.src
        optionImageElem.width = option.image.width
        optionImageElem.height = option.image.height
        optionImageElem.alt = option.image.alt

        if (option.image.srcset) {
          optionImageElem.srcset = `${option.image.src} 1x, ${option.image.srcset} 2x`
        }

        selectListElem.appendChild(optionImageElem)
      }

      if (this.config.optionStyle === 'image' && option.svg) {
        const optionSvgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
          optionUseElem = document.createElementNS('http://www.w3.org/2000/svg', 'use')

        optionSvgElem.classList.add('ux-select-group-elem__image')
        optionSvgElem.setAttribute(
          'viewBox',
          `0 0 ${String(option.svg.width)} ${String(option.svg.height)}`
        )
        optionSvgElem.setAttribute('width', String(option.svg.width))
        optionSvgElem.setAttribute('height', String(option.svg.height))
        optionUseElem.setAttribute('href', option.svg.src)

        optionSvgElem.appendChild(optionUseElem)

        selectListElem.appendChild(optionSvgElem)
      }

      selectListElem.addEventListener('click', this.onClickOption.bind(this))

      optionsFragmentsByGroup[option.attributes.group].appendChild(selectListElem)

      option.uxOption = selectListElem
    }

    for (const group of this.groups) {
      const fragment = optionsFragmentsByGroup[group]
      const selectGroupList = selectList.querySelector(
        `[data-ux-group="${group}"] .ux-select-group__list`
      )

      if (selectGroupList) selectGroupList.appendChild(fragment)
    }

    if (!this.uxBody) throw new Error('uxBody is undefined')

    const replacementChildIndex = this.config.isSearchable ? 1 : 0
    if (this.uxBody.childNodes[replacementChildIndex]) {
      this.uxBody.replaceChild(selectList, this.uxBody.childNodes[replacementChildIndex])
    } else {
      this.uxBody.appendChild(selectList)
    }
  }

  private create(): Element {
    /** Create select head */
    const selectHead = document.createElement('div')
    selectHead.classList.add('ux-select__head')

    const selectTitle = document.createElement('div')
    selectTitle.classList.add('ux-select__title')
    selectTitle.textContent = this.localization.placeholder
    selectHead.appendChild(selectTitle)

    if (this.config.closeButton) {
      const selectClear = document.createElement('button')
      selectClear.type = 'button'
      selectClear.classList.add('ux-select__clear')
      selectClear.title = this.localization.clearText
      this.uxClearButton = selectClear
      selectHead.appendChild(selectClear)
    }

    /** Create body */
    const selectBody = document.createElement('div')
    selectBody.classList.add('ux-select__body')
    this.uxBody = selectBody

    if (this.config.isSearchable) {
      const selectSearchWrap = document.createElement('div')
      selectSearchWrap.classList.add('ux-select__search')

      const selectSearch = document.createElement('input')
      selectSearch.type = 'search'
      if (this.config.searchName) selectSearch.name = this.config.searchName
      selectSearch.classList.add('ux-select-search__input')
      selectSearch.placeholder = this.localization.searchText
      this.uxSearchInput = selectSearch

      const selectSearchOverlay = document.createElement('div')
      selectSearchOverlay.classList.add('ux-select-search__overlay')
      selectSearchOverlay.textContent = this.localization.emptySearchText
      this.uxSearchOverlay = selectSearchOverlay

      selectSearchWrap.appendChild(selectSearch)
      selectSearchWrap.appendChild(selectSearchOverlay)
      selectBody.appendChild(selectSearchWrap)
    }

    this.createGroupAndOptions()

    /** Create select element */
    const select = document.createElement('div')

    /** Create class list for select element */
    const classes = ['ux-select', this.el.classList]
    if (this.state.multiple) classes.push('-multiple')
    if (this.state.disabled) classes.push('-disabled')
    if (this.config.optionStyle !== 'default') {
      classes.push(`-${this.config.optionStyle}`)
    }
    select.className = classes.join(' ')

    select.append(selectHead, selectBody)

    this.el.style.display = 'none'
    this.el.insertAdjacentElement('afterend', select)

    return this.el.nextElementSibling as Element
  }

  enable(): void {
    if (this.state.disabled) {
      this.el.disabled = false
      this.uxEl.classList.remove('-disabled')
      this.state.disabled = false
    }
  }

  disable(): void {
    if (!this.state.disabled) {
      this.el.disabled = true
      this.uxEl.classList.add('-disabled')
      this.state.disabled = true
    }
  }

  /**
   *
   * @param {Boolean} [isTriggerChange] Skip triggering "change" event
   */
  update(isTriggerChange: boolean = true): void {
    const originalOptions = JSON.stringify(this.options)

    this.options = this.extractOptions(true)
    this.groups = this.extractGroups()

    if (originalOptions !== JSON.stringify(this.options)) {
      this.createGroupAndOptions()
    }

    this.setSelectState()

    if (this.el.disabled) {
      this.disable()
    } else {
      this.enable()
    }

    if (isTriggerChange) triggerChange(this.el)
  }

  clear(): void {
    for (const option of this.options) {
      if (!option.attributes.selected) continue

      option.attributes.selected = false
      option.element.selected = false
      if (option.uxOption) option.uxOption.classList.remove('-selected')
    }

    this.setSelectState()

    triggerChange(this.el)
  }

  destroy(): void {
    this.uxEl.remove()
    this.el.style.display = ''
  }

  getSelectedValues(): string[] {
    return [...this.options]
      .filter((option) => option.attributes.selected)
      .map((option) => option.data.value)
  }

  private onToggleShown(e: Event): void {
    e.preventDefault()
    const targetEl = e.target as HTMLElement

    if (this.state.disabled) return
    if (this.uxClearButton && e.target === this.uxClearButton) return
    if (this.uxBody && this.uxBody.contains(targetEl)) return

    if (this.uxEl.classList.contains('-shown')) {
      this.uxEl.classList.remove('-shown')
      return
    }

    this.uxEl.classList.add('-shown')
    if (this.config.isSearchable && this.uxSearchInput) {
      this.uxSearchInput.value = ''
      this.uxSearchInput.dispatchEvent(new Event('input'))
      if (this.config.isSearchFocus) this.uxSearchInput.focus()
    }
  }

  private onClickOutside(e: Event): void {
    const targetEl = e.target as HTMLElement
    if (!this.uxEl.contains(targetEl)) {
      this.uxEl.classList.remove('-shown')
    }
  }

  private onClickClear(e: Event): void {
    e.preventDefault()

    if (this.state.disabled) return

    if (this.config.hideOnClear) this.uxEl.classList.remove('-shown')

    return this.clear()
  }

  private onClickSelectAll(e: Event): void {
    e.preventDefault()

    const allSelected = this.options.every((option) => option.attributes.selected)
    for (const option of this.options) {
      if (!option.attributes.disabled) {
        option.attributes.selected = !allSelected
        option.element.selected = !allSelected
        option.uxOption?.classList.toggle('-selected', !allSelected)
      }
    }

    if (this.config.hideOnSelect) this.uxEl.classList.remove('-shown')

    return this.update()
  }

  private onClickOption(e: Event): void {
    e.preventDefault()

    const uxOption = e.target as HTMLElement
    if (uxOption.classList.contains('-disabled')) return
    if (!this.state.multiple && uxOption.classList.contains('-selected')) {
      return
    }

    if (this.state.multiple) {
      e.stopPropagation()

      const matchingOption = this.options.find((option) => {
        return option.uxOption === uxOption
      })

      if (matchingOption && matchingOption.uxOption) {
        matchingOption.attributes.selected = !matchingOption.attributes.selected
        matchingOption.element.selected = matchingOption.attributes.selected

        matchingOption.uxOption.classList.toggle('-selected')
      }
    } else {
      for (const option of this.options) {
        const isSelected = option.uxOption === uxOption
        option.attributes.selected = isSelected
        option.element.selected = isSelected

        if (option.uxOption) {
          option.uxOption.classList.toggle('-selected', isSelected)
        }
      }
    }

    if (this.config.hideOnSelect) this.uxEl.classList.remove('-shown')

    return this.update()
  }

  private onSearch(e: Event): void {
    if (e.target === null) return

    const normalizeText = (str: string): string =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

    const input = e.target as HTMLInputElement
    const text = normalizeText(input.value)
    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const groups: NodeListOf<HTMLElement> = this.uxEl.querySelectorAll('.ux-select-group')

    if (text === '') {
      for (const option of this.options) {
        if (option.uxOption) option.uxOption.style.display = ''
      }

      if (this.config.isGroupOptions) {
        for (const group of groups) {
          group.style.display = ''
        }
      }

      if (this.uxSearchOverlay) this.uxSearchOverlay.style.display = 'none'
      if (this.uxSelectAll) this.uxSelectAll.style.display = 'flex'

      return
    }

    const searchValue = new RegExp(escapedText)

    const isMatch = this.options.some((option) => {
      return searchValue.test(normalizeText(option.data.text))
    })

    for (const option of this.options) {
      const match = searchValue.test(normalizeText(option.data.text))
      if (option.uxOption) option.uxOption.style.display = match ? '' : 'none'
    }

    if (this.config.isGroupOptions) {
      for (const group of groups) {
        group.style.display = ''

        const groupList = group.querySelector('.ux-select-group__list')
        if (groupList) {
          group.style.display = groupList.clientHeight !== 0 ? '' : 'none'
        }
      }
    }

    if (this.uxSearchOverlay) this.uxSearchOverlay.style.display = isMatch ? 'none' : 'block'
    if (this.uxSelectAll) this.uxSelectAll.style.display = isMatch ? 'flex' : 'none'

    triggerInput(this.el)
  }

  private bindEvents(): void {
    this.uxEl.addEventListener('click', this.onToggleShown.bind(this))

    if (this.uxClearButton) {
      this.uxClearButton.addEventListener('click', this.onClickClear.bind(this))
    }

    window.addEventListener('click', this.onClickOutside.bind(this))

    if (this.config.isSearchable && this.uxSearchInput) {
      this.uxSearchInput.addEventListener('input', this.onSearch.bind(this))
    }
  }
}
