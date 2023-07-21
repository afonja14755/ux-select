# UX Select

UX Select — free and lightweight native JavaScript plugin that replace native select elements with customization.

## Usage

### Include plugin file to your project from _dist_ directory:

```html
<script src="path/to/ux-select.min.js"></script>
```

### Initialize plugin
```javascript
const myUxSelect = new UxSelect(element, options);
```

## Options
### Configuration
- `searchable`. Default: `false`. If true adding search input.
- `groupOptions`. Default: `false`. Description below.
  - To add groups, need add **data-ux-select-group** attribute to options.
    ```html
    <option value="" data-ux-select-group="MyUxGroup"></option>
    ```

### Text

Options for translating text values into the required language.

- `placeholder`. Default: **"Select an option"**. Placeholder
- `searchText`. Default: **"Search"**. Search field placeholder
- `clearText`. Default: **"Clear option(s)"**. Clear button title
- `selectedText`. Default: **"Selected:"**. Multiple select, when selected more than 1 option.

All this options can be added by html attribute data-option-name.

Example: `data-clear-text="Clear all"`.

## Methods

- `disable()`: disable select
- `enable()`: enable select
- `update()`: update ux-select to match with native select (options and disable state)
- `clear()`: clear selected options

## Future additions
- Add focus events
- Group sorting
