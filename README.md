# Observable Inputs

**Observable Inputs** are lightweight user interface components — buttons, sliders, dropdowns, tables, and the like — to help you explore data and build interactive displays in [Observable notebooks](https://observablehq.com). (Although intended for use as [Observable views](https://observablehq.com/@observablehq/introduction-to-views), this vanilla JavaScript library creates plain old HTML elements, so you can use them anywhere on the web!)

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

In the future, these components will be incorporated into the [Observable standard library](https://github.com/observablehq/stdlib) and available in notebooks by default; to use on Observable now:

```js
import {Radio, Range, Select, Table} from "@observablehq/inputs"
```

To use in vanilla JavaScript:

```html
<script type="module">

import {Radio, Range, Select, Table} from "https://cdn.jsdelivr.net/npm/@observablehq/inputs@0.1/dist/inputs.js";

const radio = Radio(["red", "green", "blue"]);
radio.addEventListener("input", () => console.log(`you picked ${radio.value}`));
document.body.appendChild(radio);

</script>
```

To install on Node:

```
yarn add @observablehq/inputs
```

## Inputs

<a name="Button" href="#Button">#</a> <b>Button</b>(<i>content</i> = "≡", <i>options</i>) · [Source](./src/button.js)

<img src="./img/button.png" alt="A Button labeled OK" width="640">

```js
viewof clicks = Button("OK", {label: "Click me"})
```

A Button emits an *input* event when you click it. Buttons are often used to trigger the evaluation of cells, say to restart an animation. By default, the value of a Button is how many times it has been clicked. The given *content*, either a string or an HTML element, is displayed within the button. If *content* is not specified, it defaults to “≡”, but a more meaningful value is strongly encouraged for usability.

The *reduce* function allows you to compute the new value of the Button when clicked, given the old value. For example, to set the value as the time of last click:

```js
viewof time = Button("Update", {value: null, reduce: () => Date.now()})
```

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *value* - the initial value; defaults to 0.
* *reduce* - a function to update the value on click; by default returns *value* + 1.
* *style* - additional styles as a {key: value} object.

<a name="Radio" href="#Radio">#</a> <b>Radio</b>(<i>data</i>, <i>options</i>) · [Source](./src/radio.js)

<img src="./img/radio.png" alt="A single-choice Radio input of colors" width="640">

```js
viewof color = Radio(new Map([["red", "#f00"], ["green", "#0f0"], ["blue", "#00f"]]), {label: "Color"})
```
```js
viewof flavor = Radio(["Salty", "Spicy", "Sour", "Umami"], {label: "Flavor", multiple: true})
```

A Radio allows the user to choose one of a given set of options (one of the given elements in the iterable *data*); or, if desired, multiple values may be chosen with checkboxes. Unlike a [Select](#Select), a Radio’s choices are all visible up-front. If multiple choice is allowed via the *multiple* option, the Radio’s value is an array of the elements from the iterable *data* that are currently selected; if single choice is required, the Radio’s value is an element from the iterable *data*, or null if no choice has been made.

The elements in *data* need not be strings; they can be anything. To customize the display of the corresponding options, optional *keyof* and *valueof* functions may be given; the result of the *keyof* function for each element in *data* is displayed to the user, while the result of the *valueof* function is exposed as the Radio’s value when selected. If *data* is a Map, the *keyof* function defaults to the map entry’s key (`([key]) => key`) and the *valueof* function defaults to the map entry’s value (`([, value]) => value`); otherwise, both *keyof* and *valueof* default to the identity function (`d => d`). For example, with [d3.group](https://github.com/d3/d3-array/blob/master/README.md#group):

```js
viewof sportAthletes = Radio(d3.group(athletes, d => d.sport))
```

Keys may be sorted and uniqued via the *sort* and *unique* options, respectively, and formatted via an optional *format* function. As with the *label* option, the *format* function may return either a string or an HTML element.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *multiple* - whether to allow multiple choice (checkboxes); defaults to false (radios).
* *sort* - true, “ascending”, “descending”, or a comparator function to sort keys; defaults to false.
* *unique* - true to only show unique keys; defaults to false.
* *format* - a format function; defaults to the identity function.
* *keyof* - a function to return the key for the given element in *data*.
* *valueof* - a function to return the value of the given element in *data*.
* *value* - the initial value, an array if multiple choice is allowed; defaults to null (no selection).
* *style* - additional styles as a {key: value} object.

<a name="Range" href="#Range">#</a> <b>Range</b>([<i>min</i>, <i>max</i>] = [0, 1], <i>options</i>) · [Source](./src/range.js)

<img src="./img/range.png" alt="A Range input of intensity, a number between 0 and 100" width="640">

```js
viewof intensity = Range([0, 100], {step: 1, label: "Intensity"})
```

A Range input specifies a number between the given *min* and *max* (inclusive). This number can be adjusted roughly with a slider, or precisely by typing a number.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *step* - the step (precision); the interval between adjacent values.
* *format* - a format function; must return a valid number string.
* *value* - the initial value; defaults to (*min* + *max*) / 2.
* *style* - additional styles as a {key: value} object.

The given *value* is clamped to the given extent, and rounded if *step* is defined. However, note that the *min*, *max* and *step* options do not constrain the number typed; these options affect the slider behavior, the number input’s buttons, and whether the browser shows a warning if a typed number is invalid.

<a name="Search" href="#Search">#</a> <b>Search</b>(<i>data</i>, <i>options</i>) · [Source](./src/search.js)

<img src="./img/search.png" alt="A Search input over a tabular dataset of athletes" width="640">

```js
viewof foundAthletes = Search(athletes, {label: "Athletes"})
```

A Search input allows freeform full-text search of a tabular dataset using a simple (but extensible) query parser. It is often used in conjunction with a [Table](#Table). The value of a Search is an array of elements from the iterable *data* that match the current query. If the query is currently empty, the search input’s value is all elements in *data*.

A Search input can work with either tabular data (an array of objects) or a single column (an array of strings). When searching tabular input, all properties on each object in *data* are searched by default, but you can limit the search to a specific set of properties using the *column* option. For example, to only search the “sport” and “nationality” column:

```js
viewof foundAthletes = Search(athletes, {label: "Athletes", columns: ["sport", "nationality"]})
```

For example, to search U.S. state names:

```js
viewof state = Search(["Alabama", "Alaska", "Arizona", "Arkansas", "California", …], {label: "State"})
```

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *query* - the initial search terms; defaults to the empty string.
* *placeholder* - a placeholder string for when the query is empty.
* *columns* - an array of columns to search; defaults to *data*.columns.
* *format* - a function to show the number of results.
* *spellcheck* - whether to activate the browser’s spell-checker.
* *filter* - the filter factory: a function that receives the query and returns a filter.
* *style* - additional styles as a {key: value} object.

If a *filter* function is specified, it is invoked whenever the query changes; the function it returns is then passed each element from *data*, along with its zero-based index, and should return a truthy value if the given element matches the query. The default filter splits the current query into space-separated tokens and checks that each token matches the beginning of at least one string in the data’s columns, case-insensitive. For example, the query [hello world] will match the string “Worldwide Hello Services” but not “hello”.

<a name="Select" href="#Select">#</a> <b>Select</b>(<i>data</i>, <i>options</i>) · [Source](./src/select.js)

<img src="./img/select.png" alt="A Select input asking to choose a t-shirt size" width="640">

```js
viewof size = Select(["Small", "Medium", "Large"], {label: "Size"})
```
```js
viewof inks = Select(["cyan", "magenta", "yellow", "black"], {multiple: true, label: "Inks"})
```

A Select allows the user to choose one of a given set of options (one of the given elements in the iterable *data*); or, if desired, multiple values may be chosen. Unlike a [Radio](#Radio), only one (or a few) choices are visible up-front, affording a compact display even when many options are available. If multiple choice is allowed via the *multiple* option, the Select’s value is an array of the elements from the iterable *data* that are currently selected; if single choice is required, the Select’s value is an element from the iterable *data*, or null if no choice has been made.

The elements in *data* need not be strings; they can be anything. To customize the display of the corresponding options, optional *keyof* and *valueof* functions may be given; the result of the *keyof* function for each element in *data* is displayed to the user, while the result of the *valueof* function is exposed as the Select’s value when selected. If *data* is a Map, the *keyof* function defaults to the map entry’s key (`([key]) => key`) and the *valueof* function defaults to the map entry’s value (`([, value]) => value`); otherwise, both *keyof* and *valueof* default to the identity function (`d => d`). For example, with [d3.group](https://github.com/d3/d3-array/blob/master/README.md#group):

```js
viewof sportAthletes = Select(d3.group(athletes, d => d.sport))
```

Keys may be sorted and uniqued via the *sort* and *unique* options, respectively, and formatted via an optional *format* function. While the *label* option may be either a string or an HTML element, the *format* function must return a string (unlike a Radio).

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *multiple* - whether to allow multiple choice; defaults to false.
* *size* - if *multiple* is true, the number of options to show.
* *sort* - true, “ascending”, “descending”, or a comparator function to sort keys; defaults to false.
* *unique* - true to only show unique keys; defaults to false.
* *format* - a format function; defaults to the identity function.
* *keyof* - a function to return the key for the given element in *data*.
* *valueof* - a function to return the value of the given element in *data*.
* *value* - the initial value, an array if multiple choice is allowed; defaults to null (no selection).
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
