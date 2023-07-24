# UX Select

UX Select — free and lightweight native(vanilla) JavaScript plugin that replace native select elements with customization.

## Usage

### Include plugin files to your project from _dist_ directory:

### Add styles

```html
<link rel="stylesheet" href="path/to/ux-select.min.css" type="text/css"/>
```

### Add Script

#### ES-module

```javascript
import UxSelect from "path/to/ux-select.min.js";
```

#### Non ES-module

```html
<script src="path/to/ux-select.min.iife.js"></script>
```

### Initialize plugin

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

## Future additions

- Documentation
- Focus events
- Group sorting
