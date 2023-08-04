# UX Select

UX Select — free and lightweight native(vanilla) JavaScript plugin that replace native select elements with customization.

## Status

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/afonja14755/ux-select/format.yml?logo=github%20actions&label=Prettier&labelColor=%23fff)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/afonja14755/ux-select/lint.yml?logo=github%20actions&label=ESLint&labelColor=%23fff)
[![npm](https://img.shields.io/npm/v/ux-select?logo=npm&logoColor=%232088FF&labelColor=%23FFF)](https://www.npmjs.com/package/ux-select)

## Installation

### ES-module

```shell
npm i ux-select
```

### Non ES-module

Install plugin files from **_dist_** directory;

- ux-select.min.css
- ux-select.min.iife.js

## Usage

### ES-module

```javascript
import uxSelect from "ux-select/dist/ux-select.min.js";
```

### Non ES-module

#### Add styles and script to project

```html
<link rel="stylesheet" href="path/to/ux-select.min.css" type="text/css" />
<script src="path/to/ux-select.min.iife.js"></script>
```

#### Initialize ux-select in .js file

```javascript
const myUxSelect = new UxSelect(element, options);
```

## Style customization

You can customize styles by replace CSS-variables what contain "--uxs" prefix and placed on :root.

## Options

### Configuration

- `isSearchable`. Default: `false`. If true adding search input.
- `isGroupOptions`. Default: `false`. Description below.
  - To add groups, need add **data-ux-select-group** attribute to options.
    ```html
    <option value="" data-ux-select-group="MyUxGroup"></option>
    ```
- `optionStyle`. Default: `default`. Valid values: `checkbox` & `radio`. Adding styled option like checkbox or radio.

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
