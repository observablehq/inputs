# Observable Inputs

User interface components for Observable notebooks.

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

### Button

Possibly the simplest input, the Button input emits an *input* event when you click it. Buttons are often used to trigger the evaluation of cells, say to restart an animation.

<a name="Button" href="#Button">#</a> <b>Button</b>(<i>text</i>, <i>options</i>) · [Source](./src/button.js)

…

### Radio

The Radio input allows the user to choose one of a given set of options; or, if desired, multiple values may be chosen with checkboxes. Unlike the [Select](#Select) input, all of the Radio input’s choices are visible up-front.

<a name="Radio" href="#Radio">#</a> <b>Radio</b>(<i>data</i>, <i>options</i>) · [Source](./src/radio.js)

…

### Range

The Range input allows the user to specify a numeric value between the given minimum and maximum. This value can be adjust roughly with a slider, or precisely by typing in a number.

<a name="Range" href="#Range">#</a> <b>Range</b>(<i>extent</i> = [0, 1], <i>options</i>) · [Source](./src/range.js)

…

### Search

The Search input allows freeform full-text search of a tabular dataset using a simple (but extensible) query parser. It is often used inconjunction with a [Table](#Table).

<a name="Search" href="#Search">#</a> <b>Search</b>(<i>data</i>, <i>options</i>) · [Source](./src/search.js)

…

### Select

The Select input allows the user to choose one of a given set of options; or, if desired, multiple values may be chosen. Unlike the [Radio](#Radio) input, only one (or a few) choices are visible up-front, affording a compact display even when many options are available.

<a name="Select" href="#Select">#</a> <b>Select</b>(<i>data</i>, <i>options</i>) · [Source](./src/select.js)

…

### Table

The Table input displays a tabular dataset. The value of the Table is the selected rows, a filtered (and possibly sorted) view of the input data: rows can be selected by clicking or shift-clicking checkboxes.

<a name="Table" href="#Table">#</a> <b>Table</b>(<i>data</i>, <i>options</i>) · [Source](./src/table.js)

…

### Text

The Text input allows freeform text input. See also the [Search](#Search) input.

<a name="Text" href="#Text">#</a> <b>Text</b>(<i>options</i>) · [Source](./src/text.js)

…

## Utilities

### Input

The base Input class extends EventTarget to provide a view-compatible store. This is typically used in conjunction with [bind](#bind) to synchronize multiple inputs, with the Input being the primary state store.

<a name="Input" href="#Input">#</a> <b>Input</b>(<i>value</i>) · [Source](./src/input.js)

…

### bind

The bind function allows a *target* input to be bound to a *source* input, synchronizing the two: interaction with the *source* input will propagate to the *target* input and *vice versa*.

<a name="bind" href="#bind">#</a> <b>bind</b>(<i>target</i>, <i>source</i>, <i>invalidation</i>) · [Source](./src/bind.js)

…

### disposal

The disposal promise is a heuristic for detecting when an input has been removed from the DOM, say to detach synchronized inputs. It is used by [bind](#bind) by default as the invalidation promise, but is exported here for convenience.

<a name="disposal" href="#disposal">#</a> <b>disposal</b>(<i>element</i>) · [Source](./src/disposal.js)

…
