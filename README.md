# UX Select

Free and lightweight native(vanilla) JavaScript plugin that replace native select elements with customization.

## Status

[![npm](https://img.shields.io/npm/v/ux-select?logo=npm&logoColor=%232088FF&labelColor=%23FFF)](https://www.npmjs.com/package/ux-select)
[![jsDelivr hits (npm scoped)](https://img.shields.io/jsdelivr/npm/hm/ux-select?logo=jsdelivr&logoColor=blue&labelColor=white&color=blue)](https://cdn.jsdelivr.net/npm/ux-select/)
[![Static Badge](https://img.shields.io/badge/StackBlitz-examples-blue?logo=stackblitz&logoColor=blue&labelColor=white)](https://stackblitz.com/@afonja14755/collections/ux-select)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/afonja14755/ux-select/format.yml?logo=github%20actions&label=Prettier&labelColor=%23fff)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/afonja14755/ux-select/lint.yml?logo=github%20actions&label=ESLint&labelColor=%23fff)

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
import UxSelect from "ux-select/dist/ux-select.min.js";
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

## Documentation

More details on **[ux-select.com](https://ux-select.com/)**.

## License

UX Select is licensed by [MIT](https://choosealicense.com/licenses/mit/)

It can be used **for free** and **without any attribution**, in any personal or commercial project.

## Future additions

- Images for options and groups
- Focus events
- Group sorting
