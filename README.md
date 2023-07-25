# UX Select

UX Select — free and lightweight native(vanilla) JavaScript plugin that replace native select elements with customization.

## Installation

1. Install plugin files from _dist_ directory;
2. Add files to your project:
   - **ux-select.min.js** - ES-module;
   - **ux-select.min.iife.js** - Non ES-module.

## Usage

```javascript
const myUxSelect = new UxSelect(element, options);
```

## Options

### Configuration

- `isSearchable`. Default: `false`. If true adding search input.
- `isGroupOptions`. Default: `false`. Description below.
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
- `update(isTriggerChange)`: update ux-select to match with native select (options and disable state). Add false if you 
don't need to trigger "change" event at native select.
- `clear()`: clear selected options

## License

UX Select is licensed by [MIT](https://choosealicense.com/licenses/mit/)

It can be used **for free** and **without any attribution**, in any personal or commercial project.

## Future additions

- Documentation
- Focus events
- Group sorting
