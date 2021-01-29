# Observable Inputs

**Observable Inputs** are lightweight user interface components — buttons, sliders, dropdowns, tables, and the like — to help you explore data and build interactive displays in [Observable notebooks](https://observablehq.com). (Although intended for use as [Observable views](https://observablehq.com/@observablehq/introduction-to-views), this library is vanilla JavaScript that creates plain old HTML input elements, so you can use them anywhere else on the web, too!)

* [Button](#Button) - click a button
* [Radio](#Radio) - choose one or many from a set (radio or checkbox)
* [Range](#Range) - choose a numeric value in a range (slider)
* [Search](#Search) - query a tabular dataset
* [Select](#Select) - choose one or many from a set (drop-down menu)
* [Table](#Table) - browse a tabular dataset
* [Text](#Text) - freeform text input
* [Input](#Input) - a programmatic interface for storing input state
* [bind](#bind) - synchronize two or more inputs
* [disposal](#disposal) - detect when an input is discarded

Observable Inputs are released under the [ISC license](./LICENSE) and depend only on [Hypertext Literal](https://github.com/observablehq/htl), our tagged template literal for safely generating dynamic HTML.

## Installing

In the future, these components will be incorporated into the [Observable standard library](https://github.com/observablehq/stdlib) and available in new notebooks by default; to use on Observable now:

```js
import {Radio, Range, Select, Table} from "@observablehq/inputs"
```

To install on Node:

```
yarn add @observablehq/inputs
```

Or in vanilla JavaScript:

```html
<script type="module">

import {Radio, Range, Select, Table} from "https://cdn.jsdelivr.net/npm/@observablehq/inputs@0.1/dist/inputs.js";

const radio = Radio(["red", "green", "blue"]);
radio.addEventListener("input", () => console.log(`you picked ${radio.value}`));
document.body.appendChild(radio);

</script>
```

## Inputs

<a name="Button" href="#Button">#</a> <b>Button</b>(<i>text</i>, <i>options</i>) · [Source](./src/button.js)

<img src="./img/button.png" alt="A Button labeled OK" width="640">

Possibly the simplest input, the Button input emits an *input* event when you click it. Buttons are often used to trigger the evaluation of cells, say to restart an animation. By default, the value of a button is the number of times it has been clicked.

Options:
- <a name="button_label" href="#button_label">#</a> options.<i>label</i>, the input label.
- <a name="button_style" href="#button_style">#</a> options.<i>style</i>, additional styles as a {key: value} object.
- <a name="button_value" href="#button_value">#</a> options.<i>value</i>, the button’s initial value. Defaults to 0.
- <a name="button_reduce" href="#button_reduce">#</a> options.<i>reduce</i>, a function that updates the value on submit events. The default reduce increments *value* by 1.

<a name="Radio" href="#Radio">#</a> <b>Radio</b>(<i>data</i>, <i>options</i>) · [Source](./src/radio.js)

<img src="./img/radio.png" alt="A single-choice Radio input of colors" width="640">

The Radio input allows the user to choose one of a given set of options; or, if desired, multiple values may be chosen with checkboxes. Unlike the [Select](#Select) input, all of the Radio input’s choices are visible up-front.

Options:
- <a name="radio_label" href="#radio_label">#</a> options.<i>label</i>, the label.
- <a name="radio_style" href="#radio_style">#</a> options.<i>style</i>, additional styles as a {key: value} object.
- <a name="radio_format" href="#radio_format">#</a> options.<i>format</i>, the formatting function (defaults to identity).
- <a name="radio_multiple" href="#radio_multiple">#</a> options.<i>multiple</i>, indicates whether the input offers multiple choices (as checkboxes). Defaults to false (radio buttons).
- <a name="radio_value" href="#radio_value">#</a> options.<i>value</i>, the input’s initial value, which must be passed as an array if the input offers multiple choices. Defaults to null (no selection).


<a name="Range" href="#Range">#</a> <b>Range</b>(<i>extent</i> = [0, 1], <i>options</i>) · [Source](./src/range.js)

<img src="./img/range.png" alt="A Range input of intensity, a number between 0 and 100" width="640">

The Range input allows the user to specify a numeric value between the given minimum and maximum. This value can be adjust roughly with a slider, or precisely by typing in a number.

Options:
- <a name="range_label" href="#range_label">#</a> options.<i>label</i>, the label.
- <a name="range_style" href="#range_style">#</a> options.<i>style</i>, additional styles as a {key: value} object.
- <a name="range_step" href="#range_step">#</a> options.<i>step</i>, the step, or precision, of the slider input. Does not constrain the number typed, but the browser may show a warning if the user types a decimal number when the step is integer. Defaults to null.
- <a name="range_value" href="#range_value">#</a> options.<i>value</i>, the input’s initial value. Clamped to the extent, and rounded to the closest possible if options.step is not null. Defaults to the middle of the extent.

<a name="Search" href="#Search">#</a> <b>Search</b>(<i>data</i>, <i>options</i>) · [Source](./src/search.js)

<img src="./img/search.png" alt="A Search input over a tabular dataset of athletes" width="640">

The Search input allows freeform full-text search of a tabular dataset using a simple (but extensible) query parser. It is often used in conjunction with a [Table](#Table).

Options:
- <a name="search_label" href="#search_label">#</a> options.<i>label</i>, the label.
- <a name="search_style" href="#search_style">#</a> options.<i>style</i>, additional styles as a {key: value} object.
- <a name="search_columns" href="#search_columns">#</a> options.<i>columns</i>, the list of columns (or property names) that contain text to search. Defaults to data.columns, which makes it work out of the box with csv data obtained from d3-array or observable’s FileAttachement's csv method.
- <a name="search_query" href="#search_query">#</a> options.<i>query</i>, the initial search query. Defaults to null.
- <a name="search_format" href="#search_format">#</a> options.<i>format</i>, the formatting function, receives the non-null number of results. The default function displays “n results”.
- <a name="search_spellcheck" href="#search_spellcheck">#</a> options.<i>spellcheck</i>, whether to activate the browser’s spell-checker on this input (defaults to false).
- <a name="search_filter" href="#search_filter">#</a> options.<i>filter</i>, the filter factory, a function that receives the query and returns a filter.

<a name="search_filter_query" href="#search_filter_query">#</a> <i>filter(query)</i> is passed the data value and index to test, and must return a truthy value for those that match the query.

The default filter splits the query into non-empty tokens, and checks that each of the tokens matches the beginning of at least one string in the data’s columns, in a case-insensitive way. In other words, the default search for "Hello, world" will match "Worldwide hello services", and will not match "Hello".

<a name="Select" href="#Select">#</a> <b>Select</b>(<i>data</i>, <i>options</i>) · [Source](./src/select.js)

<img src="./img/select.png" alt="A Select input asking to choose a t-shirt size" width="640">

The Select input allows the user to choose one of a given set of options; or, if desired, multiple values may be chosen. Unlike the [Radio](#Radio) input, only one (or a few) choices are visible up-front, affording a compact display even when many options are available.

The Select input is designed to work well with data passed as arrays of values as well as groups of values represented by Map objects. Given an array, it allows the user to select one or several values in the array; given a Map, it allows the user to select a key (or multiple keys), and retrieve the associated values.

For example, to create a menu that lists the sports in the athletes dataset:
```js
viewof selection = Select(d3.group(athletes, d => d.sport));
```

The *selection* will be the list of athletes practicing the selected sport. 


Options:
- <a name="select_label" href="#select_label">#</a> options.<i>label</i>, the label.
- <a name="select_style" href="#select_style">#</a> options.<i>style</i>, additional styles as a {key: value} object.
- <a name="select_format" href="#select_format">#</a> options.<i>format</i>, formats the option to display in the select. By default, if the data is a map, returns the selected key; if data is an array of values, returns the value.
- <a name="select_valueof" href="#select_valueof">#</a> options.<i>valueof</i>, creates the result. By default, if the data is a map, returns the elements associated to the selected key(s); if data is an array of values, returns the selected value(s).
- <a name="select_multiple" href="#select_multiple">#</a> options.<i>multiple</i>, a boolean allowing to select multiple values at once. Defaults to false.
- <a name="select_value" href="#select_value">#</a> options.<i>value</i>, the initial value of the select. If the data is a Map, use *key* instead.
- <a name="select_key" href="#select_key">#</a> options.<i>key</i>, the initial value of the select when data is a Map. If the data is an array, use *value* instead.
- <a name="select_sort" href="#select_sort">#</a> options.<i>sort</i>, whether to sort the options. Defaults to false (no sorting). Possible values are *true* or "ascending", to sort the options in natural ascending order, and "descending", to sort the options in natural descending order.
- <a name="select_unique" href="#select_unique">#</a> options.<i>unique</i>, a boolean that indicates that the input should reduce the initial list of options computed from the data to a unique Set.

<a name="Table" href="#Table">#</a> <b>Table</b>(<i>data</i>, <i>options</i>) · [Source](./src/table.js)

<img src="./img/table.png" alt="A Table input showing rows of Olympic athletes" width="988">

The Table input displays a tabular dataset. The value of the Table is the selected rows, a filtered (and possibly sorted) view of the input data: rows can be selected by clicking or shift-clicking checkboxes.

Options:
<!-- - <a name="table_label" href="#table_label">#</a> options.<i>label</i>, the label. -->
- <a name="table_style" href="#table_style">#</a> options.<i>style</i>, additional styles as a {key: value} object.
- <a name="table_columns" href="#table_columns">#</a> options.<i>columns</i>, the list of columns (or property names) that contain text to display. Defaults to data.columns, which makes it work out of the box with csv data obtained from d3-array or observable’s FileAttachement's csv method.
- <a name="table_value" href="#table_value">#</a> options.<i>value</i>, a subset of data to use as the initial selection. Defaults to null.
- <a name="table_rows" href="#table_rows">#</a> options.<i>rows</i>, maximum number of rows to show. Defaults to 11.5.
- <a name="table_sort" href="#table_sort">#</a> options.<i>sort</i>, name of column to sort by. Defaults to null (no sort).
- <a name="table_reverse" href="#table_reverse">#</a> options.<i>reverse</i>, boolean indicating whether the sorting should be reversed (for column sort, true indicates the descending natural order, and false the ascending natural order).
- <a name="table_format" href="#table_format">#</a> options.<i>format</i>, an object of column name to format function.
- <a name="table_align" href="#table_align">#</a> options.<i>align</i>, an object of column name to left, right, or center.
- <a name="table_width" href="#table_width">#</a> options.<i>width</i>, an object of column name object of column name to width.
- <a name="table_layout" href="#table_layout">#</a> options.<i>layout</i>, sets the [table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) CSS property: "fixed" or "auto". Defaults to "fixed" if the number of columns is greater than 12, "auto" if lower.

<a name="Text" href="#Text">#</a> <b>Text</b>(<i>options</i>) · [Source](./src/text.js)

<img src="./img/text.png" alt="A Text input asking to enter your name" width="640">

The Text input allows freeform text input. See also the [Search](#Search) input.

Options:
- <a name="text_label" href="#text_label">#</a> options.<i>label</i>, the label.
- <a name="text_style" href="#text_style">#</a> options.<i>style</i>, additional styles as a {key: value} object.
- <a name="text_value" href="#text_value">#</a> options.<i>value</i>, the initial value. Defaults to "".
- <a name="text_placeholder" href="#text_placeholder">#</a> options.<i>placeholder</i>, the [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/placeholder) attribute. Defaults to null.
- <a name="text_pattern" href="#text_pattern">#</a> options.<i>pattern</i>, the [pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern) attribute. Defaults to null.
- <a name="text_spellcheck" href="#text_spellcheck">#</a> options.<i>spellcheck</i>, whether to activate the browser’s spell-checker on this input (defaults to false).
- <a name="text_minlength" href="#text_minlength">#</a> options.<i>minlength</i>, [minimum length](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/minlength) attribute. Defaults to null.
- <a name="text_maxlength" href="#text_maxlength">#</a> options.<i>maxlength</i>, [maximum length](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/maxlength) attribute. Defaults to null.


## Utilities

<a name="Input" href="#Input">#</a> <b>Input</b>(<i>value</i>) · [Source](./src/input.js)

The base Input class extends EventTarget to provide a view-compatible store. This is typically used in conjunction with [bind](#bind) to synchronize multiple inputs, with the Input being the primary state store.

…

<a name="bind" href="#bind">#</a> <b>bind</b>(<i>target</i>, <i>source</i>, <i>invalidation</i>) · [Source](./src/bind.js)

The bind function allows a *target* input to be bound to a *source* input, synchronizing the two: interaction with the *source* input will propagate to the *target* input and *vice versa*.

…

<a name="disposal" href="#disposal">#</a> <b>disposal</b>(<i>element</i>) · [Source](./src/disposal.js)

The disposal promise is a heuristic for detecting when an input has been removed from the DOM, say to detach synchronized inputs. It is used by [bind](#bind) by default as the invalidation promise, but is exported here for convenience.

…
