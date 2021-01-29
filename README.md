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

<a name="Button" href="#Button">#</a> <b>Button</b>(<i>contents</i> = "≡", <i>options</i>) · [Source](./src/button.js)

<img src="./img/button.png" alt="A Button labeled OK" width="640">

Possibly the simplest input, a Button emits an *input* event when you click it. Buttons are often used to trigger the evaluation of cells, say to restart an animation. By default, the value of a Button is how many times it has been clicked. The given *contents*, either a string or an HTML element, are displayed within the button. If *contents* is not specified, it defaults to “≡”, but a more meaningful *contents* is strongly encouraged for usability.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *value* - the initial value; defaults to 0.
* *reduce* - a function to update the value on click; by default returns *value* + 1.
* *style* - additional styles as a {key: value} object.

<a name="Radio" href="#Radio">#</a> <b>Radio</b>(<i>data</i>, <i>options</i>) · [Source](./src/radio.js)

<img src="./img/radio.png" alt="A single-choice Radio input of colors" width="640">

A Radio allows the user to choose one of a given set of options; or, if desired, multiple values may be chosen with checkboxes. Unlike a [Select](#Select), all of a Radio’s choices are visible up-front. If multiple choice is allowed via the *multiple* option, the Radio’s value is the array of elements from the iterable *data* that are currently selected; if single choice is required, the Radio’s value is the selected element from the iterable *data*, or null if no choice has been made.

If *data* is a Map, the displayed options are the keys from the Map, while the Radio’s value is a value from the Map, or an array of values if multiple choice is allowed.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *multiple* - whether to allow multiple choice (checkboxes); defaults to false (radios).
* *format* - a formatting function; defaults to the identity function.
* *keyof* -
* *valueof* -
* *sort* -
* *unique* -
* *value* - the initial value, which must be an array if multiple choice is allowed; defaults to null (no selection).
* *style* - additional styles as a {key: value} object.

<a name="Range" href="#Range">#</a> <b>Range</b>(<i>[*min*, *max*]</i> = [0, 1], <i>options</i>) · [Source](./src/range.js)

<img src="./img/range.png" alt="A Range input of intensity, a number between 0 and 100" width="640">

The Range input allows the user to specify a numeric value between the given *min* and *max*. This value can be adjust roughly with a slider, or precisely by typing a number.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *format* -
* *step* - the step, or precision, of the slider. This does not constrain the number typed, but the browser may show a warning if the user types a decimal number when the step is integer.
* *value* - the initial value. Clamped to the extent, and rounded to the closest possible if *step* is defined. Defaults to the middle of the extent.
* *style* - additional styles as a {key: value} object.

<a name="Search" href="#Search">#</a> <b>Search</b>(<i>data</i>, <i>options</i>) · [Source](./src/search.js)

<img src="./img/search.png" alt="A Search input over a tabular dataset of athletes" width="640">

The Search input allows freeform full-text search of a tabular dataset using a simple (but extensible) query parser. It is often used in conjunction with a [Table](#Table). The value of the input is an array of elements from the iterable *data* that match the current search query. If the query is currently empty, the search input’s value is all elements in *data*.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *query* - the initial search query; defaults to the empty string.
* *placeholder* -
* *columns* - an array of columns (property names) to search; defaults to *data*.columns. If not defined, all properties in each object in *data* will be searched.
* *format* - a format function, receives the number of results when a query is entered; by default returns “{n} results”.
* *spellcheck* - whether to activate the browser’s spell-checker.
* *filter* - the filter factory: a function that receives the query and returns a filter.
* *style* - additional styles as a {key: value} object.

If specified, the function returned by *filter* is passed each element from *data*, along with its index, and returns a truthy value if the given element matches the query. The default filter splits the current query into space-separated tokens, and checks that each token matches the beginning of at least one string in the data’s columns, case-insensitive. For example, the query [Hello, world] will match the string “Worldwide hello services” but not “Hello”.

<a name="Select" href="#Select">#</a> <b>Select</b>(<i>data</i>, <i>options</i>) · [Source](./src/select.js)

<img src="./img/select.png" alt="A Select input asking to choose a t-shirt size" width="640">

The Select input allows the user to choose one of a given set of options; or, if desired, multiple values may be chosen. Unlike the [Radio](#Radio) input, only one (or a few) choices are visible up-front, affording a compact display even when many options are available.

The Select input is designed to work well with data passed as arrays of values as well as groups of values represented by Map objects. Given an array, it allows the user to select one or several values in the array; given a Map, it allows the user to select a key (or multiple keys), and retrieve the associated values.

For example, to create a menu that lists the sports in the athletes dataset:
```js
viewof selection = Select(d3.group(athletes, d => d.sport));
```

The *selection* will be the list of athletes practicing the selected sport.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *multiple* - a boolean allowing to select multiple values at once. Defaults to false.
* *value* - the initial value of the select. If the data is a Map, use *key* instead.
* *key* - the initial value of the select when data is a Map. If the data is an array, use *value* instead.
* *format* - formats the option to display in the select.
* *sort* - whether to sort the options. Defaults to false (no sorting). Possible values are *true* or "ascending", to sort the options in natural ascending order, and "descending", to sort the options in natural descending order.
* *unique* - a boolean that indicates that the input should reduce the initial list of options computed from the data to a unique Set.
* *keyof* - By default, if the data is a map, returns the selected key; if data is an array of values, returns the value.
* *valueof* - creates the result. By default, if the data is a map, returns the elements associated to the selected key(s); if data is an array of values, returns the selected value(s).
* *style* - additional styles as a {key: value} object.

<a name="Table" href="#Table">#</a> <b>Table</b>(<i>data</i>, <i>options</i>) · [Source](./src/table.js)

<img src="./img/table.png" alt="A Table input showing rows of Olympic athletes" width="988">

The Table input displays a tabular dataset. The value of the Table is the selected rows, a filtered (and possibly sorted) view of the input data: rows can be selected by clicking or shift-clicking checkboxes.

The available *options* are:

* *columns* - the list of columns (or property names) that contain text to display. Defaults to data.columns, which makes it work out of the box with csv data obtained from d3-array or observable’s FileAttachement's csv method.
* *value* - a subset of data to use as the initial selection. Defaults to null.
* *rows* - maximum number of rows to show. Defaults to 11.5.
* *sort* - name of column to sort by. Defaults to null (no sort).
* *reverse* - boolean indicating whether the sorting should be reversed (for column sort, true indicates the descending natural order, and false the ascending natural order).
* *format* - an object of column name to format function.
* *align* - an object of column name to left, right, or center.
* *width* - an object of column name object of column name to width.
* *layout* - sets the [table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) CSS property: "fixed" or "auto". Defaults to "fixed" if the number of columns is greater than 12, "auto" if lower.
* *style* - additional styles as a {key: value} object.

<a name="Text" href="#Text">#</a> <b>Text</b>(<i>options</i>) · [Source](./src/text.js)

<img src="./img/text.png" alt="A Text input asking to enter your name" width="640">

The Text input allows freeform text input. See also the [Search](#Search) input.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *value* - the initial value. Defaults to "".
* *placeholder* - the [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/placeholder) attribute. Defaults to null.
* *pattern* - the [pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern) attribute. Defaults to null.
* *spellcheck* - whether to activate the browser’s spell-checker on this input (defaults to false).
* *minlength* - [minimum length](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/minlength) attribute. Defaults to null.
* *maxlength* - [maximum length](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/maxlength) attribute. Defaults to null.
* *style* - additional styles as a {key: value} object.

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
