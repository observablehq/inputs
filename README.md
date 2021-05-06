# Observable Inputs

**Observable Inputs** are lightweight user interface components — buttons, sliders, dropdowns, tables, and the like — to help you explore data and build interactive displays in [Observable notebooks](https://observablehq.com). Each input can be used as an [Observable view](https://observablehq.com/@observablehq/introduction-to-views). For example, to allow a number *x* to be manipulated by a slider:

```js
viewof x = Inputs.range([0, 100])
```

Now you can reference the live value of *x* in any cell, *e.g.*:

```js
md`The value of *x* is ${x}.`
```

Any cell that references *x* will run automatically when the *viewof x* slider is moved. For live examples, see:

https://observablehq.com/@observablehq/inputs

Observable Inputs provides basic inputs:

* [Button](#Button) - do something when a button is clicked
* [Checkbox](#Checkbox) - choose any from a set
* [Toggle](#Toggle) - toggle between two values (on or off)
* [Radio](#Radio) - choose one from a set
* [Range](#Range) - choose a numeric value in a range (slider)
* [Select](#Select) - choose one or many from a set (drop-down menu)
* [Text](#Text) - freeform single-line text input
* [Textarea](#Textarea) - freeform multi-line text input

Observable Inputs provides fancy inputs for tabular data:

* [Search](#Search) - query a tabular dataset
* [Table](#Table) - browse a tabular dataset

Lastly, Inputs provides low-level utilities for more advanced usage:

* [Input](#Input) - a programmatic interface for storing input state
* [bind](#bind) - synchronize two or more inputs
* [disposal](#disposal) - detect when an input is discarded

Observable Inputs are released under the [ISC license](./LICENSE) and depend only on [Hypertext Literal](https://github.com/observablehq/htl), our tagged template literal for safely generating dynamic HTML.

## Inputs

<a name="Button" href="#Button">#</a> Inputs.<b>button</b>(<i>content</i> = "≡", <i>options</i>) · [Source](./src/button.js), [Examples](https://observablehq.com/@observablehq/input-button)

<img src="./img/button.png" alt="A Button labeled OK" width="640">

```js
viewof clicks = Inputs.button("OK", {label: "Click me"})
```

A Button emits an *input* event when you click it. Buttons may be used to trigger the evaluation of cells, say to restart an animation. The given *content*, either a string or an HTML element, is displayed within the button. If *content* is not specified, it defaults to “≡”, but a more meaningful value is strongly encouraged for usability.

By default, the value of a solitary Button (when *content* is a string or HTML) is how many times it has been clicked. The *reduce* function allows you to compute the new value of the Button when clicked, given the old value. For example, to set the value as the time of last click:

```js
viewof time = Inputs.button("Refresh", {value: null, reduce: () => Date.now()})
```

If *content* is an array or iterable, then multiple buttons will be generated. Each element in *content* should be a tuple [*contenti*, *reducei*], where *contenti* is the content for the given button (a string or HTML), and *reducei* is the function to call when that button is clicked. For example, to have a counter that you can increment, decrement, or reset to zero:

```js
viewof counter = Inputs.button([
  ["Increment", value => value + 1],
  ["Decrement", value => value - 1],
  ["Reset", () => 0]
], {label: "Counter", value: 0})
```

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *required* - if true, the initial value defaults to undefined.
* *value* - the initial value; defaults to 0 or null if *required* is false.
* *reduce* - a function to update the value on click; by default returns *value* + 1.
* *width* - the width of the input (not including the label).
* *disabled* - whether input is disabled; defaults to false.

<a name="Checkbox" href="#Checkbox">#</a> Inputs.<b>checkbox</b>(<i>data</i>, <i>options</i>) · [Source](./src/checkbox.js), [Examples](https://observablehq.com/@observablehq/input-checkbox)

<img src="./img/checkbox.png" alt="A multi-choice Checkbox input of flavors" width="640">

```js
viewof flavor = Inputs.checkbox(["Salty", "Spicy", "Sour", "Umami"], {label: "Flavor"})
```

A Checkbox allows the user to choose any of a given set of values (any of the given elements in the iterable *data*). Unlike a [Select](#Select), a Checkbox’s choices are all visible up-front. The Checkbox’s value is an array of the elements from *data* that are currently selected.

The elements in *data* need not be strings; they can be anything. To customize display, optional *keyof* and *valueof* functions may be given; the result of the *keyof* function for each element in *data* is displayed to the user, while the result of the *valueof* function is exposed in the Checkbox’s value when selected. If *data* is a Map, the *keyof* function defaults to the map entry’s key (`([key]) => key`) and the *valueof* function defaults to the map entry’s value (`([, value]) => value`); otherwise, both *keyof* and *valueof* default to the identity function (`d => d`). For example, with [d3.group](https://github.com/d3/d3-array/blob/master/README.md#group):

```js
viewof sportAthletes = Inputs.checkbox(d3.group(athletes, d => d.sport))
```

Keys may be sorted and uniqued via the *sort* and *unique* options, respectively. Elements in *data* are formatted via an optional *format* function which has the same defaults as *keyof*. As with the *label* option, the *format* function may return either a string or an HTML element.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *sort* - true, “ascending”, “descending”, or a comparator function to sort keys; defaults to false.
* *unique* - true to only show unique keys; defaults to false.
* *locale* - the current locale; defaults to English.
* *format* - a format function; defaults to [formatLocaleAuto](#formatLocaleAuto).
* *keyof* - a function to return the key for the given element in *data*.
* *valueof* - a function to return the value of the given element in *data*.
* *value* - the initial value, an array; defaults to an empty array (no selection).
* *disabled* - whether input is disabled, or the disabled values; defaults to false.

<a name="Toggle" href="#Toggle">#</a> Inputs.<b>toggle</b>(<i>options</i>) · [Source](./src/checkbox.js), [Examples](https://observablehq.com/@observablehq/input-toggle)

```js
viewof mute = Inputs.toggle({label: "Mute"})
```

A Toggle is a solitary checkbox. By default, the Toggle’s value is whether the checkbox is checked (true or false); a *values* = [*on*, *off*] option can be specified to toggle between two arbitrary values.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *values* - the two values to toggle between; defaults to [true, false].
* *value* - the initial value; defaults to the second value (false).
* *disabled* - whether input is disabled; defaults to false.

<a name="Radio" href="#Radio">#</a> Inputs.<b>radio</b>(<i>data</i>, <i>options</i>) · [Source](./src/checkbox.js), [Examples](https://observablehq.com/@observablehq/input-radio)

<img src="./img/radio.png" alt="A single-choice Radio input of colors" width="640">

```js
viewof color = Inputs.radio(["red", "green", "blue"]), {label: "Color"})
```

A Radio allows the user to choose one of a given set of values. Unlike a [Select](#Select), a Radio’s choices are all visible up-front. The Radio’s value is an element from *data*, or null if no choice has been made.

The elements in *data* need not be strings; they can be anything. To customize display, optional *keyof* and *valueof* functions may be given; the result of the *keyof* function for each element in *data* is displayed to the user, while the result of the *valueof* function is exposed as the Radio’s value when selected. If *data* is a Map, the *keyof* function defaults to the map entry’s key (`([key]) => key`) and the *valueof* function defaults to the map entry’s value (`([, value]) => value`); otherwise, both *keyof* and *valueof* default to the identity function (`d => d`). For example, with [d3.group](https://github.com/d3/d3-array/blob/master/README.md#group):

```js
viewof sportAthletes = Inputs.radio(d3.group(athletes, d => d.sport))
```

Keys may be sorted and uniqued via the *sort* and *unique* options, respectively. Elements in *data* are formatted via an optional *format* function which has the same defaults as *keyof*. As with the *label* option, the *format* function may return either a string or an HTML element.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *sort* - true, “ascending”, “descending”, or a comparator function to sort keys; defaults to false.
* *unique* - true to only show unique keys; defaults to false.
* *locale* - the current locale; defaults to English.
* *format* - a format function; defaults to [formatLocaleAuto](#formatLocaleAuto).
* *keyof* - a function to return the key for the given element in *data*.
* *valueof* - a function to return the value of the given element in *data*.
* *value* - the initial value; defaults to null (no selection).
* *disabled* - whether input is disabled, or the disabled values; defaults to false.

<a name="Range" href="#Range">#</a> Inputs.<b>range</b>([<i>min</i>, <i>max</i>] = [0, 1], <i>options</i>) · [Source](./src/range.js), [Examples](https://observablehq.com/@observablehq/input-range)

<img src="./img/range.png" alt="A Range input of intensity, a number between 0 and 100" width="640">

```js
viewof intensity = Inputs.range([0, 100], {step: 1, label: "Intensity"})
```

A Range input specifies a number between the given *min* and *max* (inclusive). This number can be adjusted roughly with a slider, or precisely by typing a number.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *step* - the step (precision); the interval between adjacent values.
* *format* - a format function; defaults to [formatTrim](#formatTrim).
* *placeholder* - a placeholder string for when the input is empty.
* *transform* - an optional non-linear transform.
* *invert* - the inverse transform.
* *value* - the initial value; defaults to (*min* + *max*) / 2.
* *width* - the width of the input (not including the label).
* *disabled* - whether input is disabled; defaults to false.

The given *value* is clamped to the given extent, and rounded if *step* is defined. However, note that the *min*, *max* and *step* options affect only the slider behavior, the number input’s buttons, and whether the browser shows a warning if a typed number is invalid; they do not constrain the typed number.

The *format* function should return a string value that is compatible with native number parsing. Hence, the default [formatTrim](#formatTrim) is recommended.

If a *transform* function is specified, an inverse transform function *invert* is strongly recommended. If *invert* is not provided, the Range will fallback to Newton’s method, but this may be slow or inaccurate. Passing Math.sqrt, Math.log, or Math.exp as a *transform* will automatically supply the corresponding *invert*. If *min* is greater than *max*, *i.e.* if the extent is inverted, then *transform* and *invert* will default to `value => -value`.

<a name="Search" href="#Search">#</a> Inputs.<b>search</b>(<i>data</i>, <i>options</i>) · [Source](./src/search.js), [Examples](https://observablehq.com/@observablehq/input-search)

<img src="./img/search.png" alt="A Search input over a tabular dataset of athletes" width="640">

```js
viewof foundAthletes = Inputs.search(athletes, {label: "Athletes"})
```

A Search input allows freeform, full-text search of an in-memory tabular dataset or an iterable (column) of values using a simple query parser. It is often used in conjunction with a [Table](#Table). The value of a Search is an array of elements from the iterable *data* that match the current query. If the query is currently empty, the search input’s value is all elements in *data*.

A Search input can work with either tabular data (an array of objects) or a single column (an array of strings). When searching tabular input, all properties on each object in *data* are searched by default, but you can limit the search to a specific set of properties using the *column* option. For example, to only search the “sport” and “nationality” column:

```js
viewof foundAthletes = Inputs.search(athletes, {label: "Athletes", columns: ["sport", "nationality"]})
```

For example, to search U.S. state names:

```js
viewof state = Inputs.search(["Alabama", "Alaska", "Arizona", "Arkansas", "California", …], {label: "State"})
```

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *query* - the initial search terms; defaults to the empty string.
* *placeholder* - a placeholder string for when the query is empty.
* *columns* - an array of columns to search; defaults to *data*.columns.
* *locale* - the current locale; defaults to English.
* *format* - a function to show the number of results.
* *spellcheck* - whether to activate the browser’s spell-checker.
* *filter* - the filter factory: a function that receives the query and returns a filter.
* *width* - the width of the input (not including the label).
* *datalist* - an iterable of suggested values.
* *disabled* - whether input is disabled; defaults to false.
* *required* - if true, the search’s value is all *data* if no query; defaults to true.

If a *filter* function is specified, it is invoked whenever the query changes; the function it returns is then passed each element from *data*, along with its zero-based index, and should return a truthy value if the given element matches the query. The default filter splits the current query into space-separated tokens and checks that each token matches the beginning of at least one string in the data’s columns, case-insensitive. For example, the query [hello world] will match the string “Worldwide Hello Services” but not “hello”.

<a name="Select" href="#Select">#</a> Inputs.<b>select</b>(<i>data</i>, <i>options</i>) · [Source](./src/select.js), [Examples](https://observablehq.com/@observablehq/input-select)

<img src="./img/select.png" alt="A Select input asking to choose a t-shirt size" width="640">

```js
viewof size = Inputs.select(["Small", "Medium", "Large"], {label: "Size"})
```
```js
viewof inks = Inputs.select(["cyan", "magenta", "yellow", "black"], {multiple: true, label: "Inks"})
```

A Select allows the user to choose one of a given set of values (one of the given elements in the iterable *data*); or, if desired, multiple values may be chosen. Unlike a [Radio](#Radio), only one (or a few) choices are visible up-front, affording a compact display even when many options are available. If multiple choice is allowed via the *multiple* option, the Select’s value is an array of the elements from *data* that are currently selected; if single choice is required, the Select’s value is an element from *data*, or null if no choice has been made.

The elements in *data* need not be strings; they can be anything. To customize display, optional *keyof* and *valueof* functions may be given; the result of the *keyof* function for each element in *data* is displayed to the user, while the result of the *valueof* function is exposed as the Select’s value when selected. If *data* is a Map, the *keyof* function defaults to the map entry’s key (`([key]) => key`) and the *valueof* function defaults to the map entry’s value (`([, value]) => value`); otherwise, both *keyof* and *valueof* default to the identity function (`d => d`). For example, with [d3.group](https://github.com/d3/d3-array/blob/master/README.md#group):

```js
viewof sportAthletes = Inputs.select(d3.group(athletes, d => d.sport))
```

Keys may be sorted and uniqued via the *sort* and *unique* options, respectively. Elements in *data* are formatted via an optional *format* function which has the same defaults as *keyof*. While the *label* option may be either a string or an HTML element, the *format* function must return a string (unlike a Radio).

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *multiple* - whether to allow multiple choice; defaults to false.
* *size* - if *multiple* is true, the number of options to show.
* *sort* - true, “ascending”, “descending”, or a comparator function to sort keys; defaults to false.
* *unique* - true to only show unique keys; defaults to false.
* *locale* - the current locale; defaults to English.
* *format* - a format function; defaults to [formatLocaleAuto](#formatLocaleAuto).
* *keyof* - a function to return the key for the given element in *data*.
* *valueof* - a function to return the value of the given element in *data*.
* *value* - the initial value, an array if multiple choice is allowed.
* *width* - the width of the input (not including the label).
* *disabled* - whether input is disabled, or the disabled values; defaults to false.

<a name="Table" href="#Table">#</a> Inputs.<b>table</b>(<i>data</i>, <i>options</i>) · [Source](./src/table.js), [Examples](https://observablehq.com/@observablehq/input-table)

<img src="./img/table.png" alt="A Table input showing rows of Olympic athletes" width="988">

A Table displays a tabular dataset; *data* should be an iterable of objects, such as the result of loading a CSV file. Each object corresponds to a row, while each field corresponds to a column. To improve performance with large datasets, the rows of the table are lazily rendered on scroll. Rows may be sorted by clicking column headers (once for ascending, then again for descending).

While intended primarily for display, a Table also serves as an input. The value of the Table is its selected rows: a filtered (and possibly sorted) view of the *data*. Rows can be selected by clicking or shift-clicking checkboxes. See also [Search](#Search), which can be used for rapid filtering of the table’s rows.

By default, the Table infers the type of each column by inspecting values, assuming that non-null values in each column have consistent types. Numbers are formatted in English; dates are formatted in ISO 8601 UTC. Numbers columns are further right-aligned with [tabular figures](https://practicaltypography.com/alternate-figures.html) to assist comparison. The *format* and *align* of each column can be customized as options if desired.

By default, the Table uses fixed layout if *data* has fewer than twelve columns. This improves performance and avoids reflow when scrolling due to lazily-rendered rows. If *data* has twelve or more columns, the auto layout is used instead, which automatically sizes columns based on the content. This behavior can be changed by specifying the *layout* option explicitly.

The available *options* are:

* *columns* - the columns (property names) to show; defaults to *data*.columns.
* *value* - a subset of *data* to use as the initial selection (checked rows).
* *rows* - the maximum number of rows to show; defaults to 11.5.
* *sort* - the column to sort by; defaults to null (input order).
* *reverse* - whether to reverse the initial sort (descending instead of ascending).
* *format* - an object of column name to format function.
* *align* - an object of column name to “left”, “right”, or “center”.
* *width* - the table width, or an object of column name to width.
* *maxWidth* - the maximum table width, if any.
* *height* - the fixed table height, if any.
* *maxHeight* - the maximum table height, if any; defaults to (*rows* + 1) * 22 - 1.
* *layout* - the [table layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout); defaults to fixed for ≤12 columns.
* *required* - if true, the table’s value is all *data* if no selection; defaults to true.
* *multiple* - if true, allow multiple rows to be selected; defaults to true.

If *width* is “auto”, the table width will be based on the table contents; note that this may cause the table to resize as rows are lazily rendered.

<a name="Text" href="#Text">#</a> Inputs.<b>text</b>(<i>options</i>) · [Source](./src/text.js), [Examples](https://observablehq.com/@observablehq/input-text)

<img src="./img/text.png" alt="A Text input asking to enter your name" width="640">

```js
viewof name = Inputs.text({label: "Name", placeholder: "Enter your name"})
```

A Text allows freeform single-line text input. For example, a Text might be used to allow the user to enter a search query. (See also [Search](#Search).) By default, a Text will report its value immediately on input. If more deliberate behavior is desired, say if the input will trigger an expensive computation or remote API, the *submit* option can be set to true to wait until a button is clicked or the Enter key is pressed.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *type* - the [input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types), such as “password” or “email”; defaults to “text”.
* *value* - the initial value; defaults to the empty string.
* *placeholder* - the [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/placeholder) attribute.
* *spellcheck* - whether to activate the browser’s spell-checker.
* *pattern* - the [pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern) attribute.
* *minlength* - [minimum length](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/minlength) attribute.
* *maxlength* - [maximum length](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/maxlength) attribute.
* *required* - if true, the input must be non-empty; defaults to *minlength* > 0.
* *validate* - a function to check whether the text input is valid.
* *width* - the width of the input (not including the label).
* *submit* - whether to require explicit submission before updating; defaults to false.
* *datalist* - an iterable of suggested values.
* *readonly* - whether input is readonly; defaults to false.
* *disabled* - whether input is disabled; defaults to false.

If *validate* is not defined, [*text*.checkValidity](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-checkvalidity) is used. While the input is not considered valid, changes to the input will not be reported.

<a name="Textarea" href="#Textarea">#</a> Inputs.<b>textarea</b>(<i>options</i>) · [Source](./src/textarea.js)

<img src="./img/textarea.png" alt="A Textarea asking for your biography" width="660">

```js
viewof bio = Inputs.textarea({label: "Biography", placeholder: "Tell us a little about yourself…"})
```

A Textarea allows multi-line freeform text input. By default, a Textarea will report its value immediately on input. If more deliberate behavior is desired, the *submit* option can be set to true to wait until a button is clicked or Command-Enter is pressed.

The available *options* are:

* *label* - a label; either a string or an HTML element.
* *value* - the initial value; defaults to the empty string.
* *placeholder* - the [placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/placeholder) attribute.
* *spellcheck* - whether to activate the browser’s spell-checker.
* *minlength* - [minimum length](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/minlength) attribute.
* *maxlength* - [maximum length](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/maxlength) attribute.
* *required* - if true, the input must be non-empty; defaults to *minlength* > 0.
* *validate* - a function to check whether the text input is valid.
* *width* - the width of the input (not including the label).
* *rows* - the number of rows of text to show.
* *resize* - if true, allow vertical resizing; defaults to *rows* < 12.
* *submit* - whether to require explicit submission before updating; defaults to false.
* *readonly* - whether input is readonly; defaults to false.
* *disabled* - whether input is disabled; defaults to false.
* *monospace* - if true, use a monospace font.

If *validate* is not defined, [*text*.checkValidity](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-checkvalidity) is used. While the input is not considered valid, changes to the input will not be reported.

## Utilities

<a name="Input" href="#Input">#</a> Inputs.<b>input</b>(<i>value</i>) · [Source](./src/input.js), [Examples](https://observablehq.com/@observablehq/synchronized-inputs)

Returns an [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) with the specified *value*. This is typically used in conjunction with [bind](#bind) to synchronize multiple inputs, with the Input being the primary state store. An Input is similar to a [mutable](https://observablehq.com/@observablehq/introduction-to-mutable-state), except that it allows listeners.

<a name="bind" href="#bind">#</a> Inputs.<b>bind</b>(<i>target</i>, <i>source</i>, <i>invalidation</i>) · [Source](./src/bind.js), [Examples](https://observablehq.com/@observablehq/synchronized-inputs)

The bind function allows a *target* input to be bound to a *source* input, synchronizing the two: interaction with the *source* input will propagate to the *target* input and *vice versa*.

The relationship between *target* and *source* is not symmetric: the *target* input should be considered a dependant of the *source* input, and if desired, only the *source* should be declared an Observable view. For example:

```js
viewof i = Inputs.input(42) // the “primary” input
```
```js
Inputs.bind(Inputs.range([0, 100]), viewof i) // a bound “secondary” input
```

When the *target* emits a type-appropriate event, the *target*’s type-appropriate value will be applied to the *source* and a type-appropriate event will be dispatched on the *source*; when the *source* emits a type-appropriate event, the *source*’s type-appropriate value will be applied to the *target*, but *no event will be dispatched*, avoiding an infinite loop.

The type-appropriate event is a *click* event for buttons and submit inputs, a *change* event for file inputs, and an *input* event for anything else. The type-appropriate value is *input*.valueAsNumber for range and number inputs, *input*.valueAsDate for date inputs, *input*.checked for checkbox inputs, *input*.files for multiple file inputs, *input*.files[0] for single-file inputs, and *input*.value for anything else.

If *invalidation* is specified, it is a promise; when the promise resolves, the target will stop listening to the source. If *invalidation* is not specified, it defaults to the [disposal promise](#disposal) on the specified *target*. Note that source will remain listening to the target, however, until the target is garbage-collected.

<a name="disposal" href="#disposal">#</a> Inputs.<b>disposal</b>(<i>element</i>) · [Source](./src/disposal.js)

The disposal promise is a heuristic for detecting when an input has been removed from the DOM, say to detach synchronized inputs. It is used by [bind](#bind) by default as the invalidation promise, but is exported here for convenience.

<a name="searchFilter" href="#searchFilter">#</a> Inputs.<b>searchFilter</b>(<i>query</i>) · [Source](./src/search.js)

The default query parser used by [Search](#Search).

<a name="formatLocaleAuto" href="#formatLocaleAuto">#</a> Inputs.<b>formatLocaleAuto</b>(<i>locale</i> = "en") · [Source](./src/format.js)

If *value* is null, returns the empty string; if *value* is a number, calls [formatLocaleNumber](#formatLocaleNumber) if *value* is a date, calls [formatDate](#formatDate); otherwise coerces *value* to a string.

<a name="formatLocaleNumber" href="#formatLocaleNumber">#</a> Inputs.<b>formatLocaleNumber</b>(<i>locale</i> = "en) · [Source](./src/format.js)

The default number formatter used by [Table](#Table).

<a name="formatTrim" href="#formatTrim">#</a> Inputs.<b>formatTrim</b>(<i>number</i>) · [Source](./src/format.js)

The default number formatter used by [Range](#Range).

<a name="formatDate" href="#formatDate">#</a> Inputs.<b>formatDate</b>(<i>date</i>) · [Source](./src/format.js)

The default date formatter used by [Table](#Table).
