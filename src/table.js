import {html} from "htl";
import {arrayify, maybeColumns} from "./array.js";
import {length} from "./css.js";
import {formatDate, formatLocaleAuto, formatLocaleNumber} from "./format.js";
import {newId} from "./id.js";
import {identity} from "./identity.js";
import {defined, ascending, descending} from "./sort.js";

const rowHeight = 22;

export function table(data, options = {}) {
  const {
    rows = 11.5, // maximum number of rows to show
    height,
    maxHeight = height === undefined ? (rows + 1) * rowHeight - 1 : undefined,
    width = {}, // object of column name to width, or overall table width
    maxWidth
  } = options;
  const id = newId();
  const root = html`<form class="__ns__ __ns__-table" id=${id} style=${{height: length(height), maxHeight: length(maxHeight), width: typeof width === "string" || typeof width === "number" ? length(width) : undefined, maxWidth: length(maxWidth)}}>`;
  // The outer form element is created synchronously, while the table is lazily
  // created when the data promise resolves. This allows you to pass a promise
  // of data to the table without an explicit await.
  if (data && typeof data.then === "function") {
    Object.defineProperty(root, "value", {
      configurable: true, // allow defineProperty again on initialization
      set() {
        throw new Error("cannot set value while data is unresolved");
      }
    });
    Promise.resolve(data).then(data => initialize({root, id}, data, options));
  } else {
    initialize({root, id}, data, options);
  }
  return root;
}

function initialize(
  {
    root,
    id
  },
  data,
  {
    columns = maybeColumns(data), // array of column names
    value, // initial selection
    required = true, // if true, the value is everything if nothing is selected
    sort, // name of column to sort by, if any
    reverse = false, // if sorting, true for descending and false for ascending
    format, // object of column name to format function
    locale,
    align, // object of column name to left, right, or center
    header, // object of column name to string or HTML element
    rows = 11.5, // maximum number of rows to show
    width = {}, // object of column name to width, or overall table width
    multiple = true,
    select: selectable = true, // is the table selectable?
    layout // "fixed" or "auto"
  } = {}
) {
  columns = columns === undefined ? columnsof(data) : arrayify(columns);
  if (layout === undefined) layout = columns.length >= 12 ? "auto" : "fixed";
  format = formatof(format, data, columns, locale);
  align = alignof(align, data, columns);

  let array = [];
  let index = [];
  let iterator = data[Symbol.iterator]();
  let iterindex = 0;
  let N = lengthof(data); // total number of rows (if known)
  let n = minlengthof(rows * 2); // number of currently-shown rows

  // Defer materializing index and data arrays until needed.
  function materialize() {
    if (iterindex >= 0) {
      iterindex = iterator = undefined;
      index = Uint32Array.from(array = arrayify(data), (_, i) => i);
      N = index.length;
    }
  }

  function minlengthof(length) {
    length = Math.floor(length);
    if (N !== undefined) return Math.min(N, length);
    if (length <= iterindex) return length;
    while (length > iterindex) {
      const {done, value} = iterator.next();
      if (done) return N = iterindex;
      index.push(iterindex++);
      array.push(value);
    }
    return iterindex;
  }

  let currentSortHeader = null, currentReverse = false;
  let selected = new Set();
  let anchor = null, head = null;

  const tbody = html`<tbody>`;
  const tr = html`<tr><td>${selectable ? html`<input type=${multiple ? "checkbox" : "radio"} name=${multiple ? null : "radio"}>` : null}</td>${columns.map(() => html`<td>`)}`;
  const theadr = html`<tr><th>${selectable ? html`<input type=checkbox onclick=${reselectAll} disabled=${!multiple}>` : null}</th>${columns.map((column) => html`<th title=${column} onclick=${event => resort(event, column)}><span></span>${header && column in header ? header[column] : column}</th>`)}</tr>`;
  root.appendChild(html.fragment`<table style=${{tableLayout: layout}}>
  <thead>${minlengthof(1) || columns.length ? theadr : null}</thead>
  ${tbody}
</table>
<style>${columns.map((column, i) => {
  const rules = [];
  if (align[column] != null) rules.push(`text-align:${align[column]}`);
  if (width[column] != null) rules.push(`width:${length(width[column])}`);
  if (rules.length) return `#${id} tr>:nth-child(${i + 2}){${rules.join(";")}}`;
}).filter(identity).join("\n")}</style>`);
  function appendRows(i, j) {
    if (iterindex === i) {
      for (; i < j; ++i) {
        appendRow(iterator.next().value, i);
      }
      iterindex = j;
    } else {
      for (let k; i < j; ++i) {
        k = index[i];
        appendRow(array[k], k);
      }
    }
  }

  function appendRow(d, i) {
    const itr = tr.cloneNode(true);
    const input = inputof(itr);
    if (input != null) {
      input.onclick = reselect;
      input.checked = selected.has(i);
      input.value = i;
    }
    if (d != null) for (let j = 0; j < columns.length; ++j) {
      let column = columns[j];
      let value = d[column];
      if (!defined(value)) continue;
      value = format[column](value, i, data);
      if (!(value instanceof Node)) value = document.createTextNode(value);
      itr.childNodes[j + 1].appendChild(value);
    }
    tbody.append(itr);
  }

  function unselect(i) {
    materialize();
    let j = index.indexOf(i);
    if (j < tbody.childNodes.length) {
      const tr = tbody.childNodes[j];
      inputof(tr).checked = false;
    }
    selected.delete(i);
  }

  function select(i) {
    materialize();
    let j = index.indexOf(i);
    if (j < tbody.childNodes.length) {
      const tr = tbody.childNodes[j];
      inputof(tr).checked = true;
    }
    selected.add(i);
  }

  function* range(i, j) {
    materialize();
    i = index.indexOf(i), j = index.indexOf(j);
    if (i < j) while (i <= j) yield index[i++];
    else while (j <= i) yield index[j++];
  }

  function first(set) {
    return set[Symbol.iterator]().next().value;
  }

  function reselectAll(event) {
    materialize();
    if (this.checked) {
      selected = new Set(index);
      for (const tr of tbody.childNodes) {
        inputof(tr).checked = true;
      }
    } else {
      for (let i of selected) unselect(i);
      anchor = head = null;
      if (event.detail) event.currentTarget.blur();
    }
    reinput();
  }

  function reselect(event) {
    materialize();
    let i = +this.value;
    if (!multiple) {
      for (let i of selected) unselect(i);
      select(i);
    } else if (event.shiftKey) {
      if (anchor === null) anchor = selected.size ? first(selected) : index[0];
      else for (let i of range(anchor, head)) unselect(i);
      head = i;
      for (let i of range(anchor, head)) select(i);
    } else {
      anchor = head = i;
      if (selected.has(i)) {
        unselect(i);
        anchor = head = null;
        if (event.detail) event.currentTarget.blur();
      } else {
        select(i);
      }
    }
    reinput();
  }

  function resort(event, column) {
    materialize();
    const th = event.currentTarget;
    let compare;
    if (currentSortHeader === th && event.metaKey) {
      orderof(currentSortHeader).textContent = "";
      currentSortHeader = null;
      currentReverse = false;
      compare = ascending;
    } else {
      if (currentSortHeader === th) {
        currentReverse = !currentReverse;
      } else {
        if (currentSortHeader) {
          orderof(currentSortHeader).textContent = "";
        }
        currentSortHeader = th;
        currentReverse = event.altKey;
      }
      const order = currentReverse ? descending : ascending;
      compare = (a, b) => order(array[a][column], array[b][column]);
      orderof(th).textContent = currentReverse ? "▾"  : "▴";
    }
    index.sort(compare);
    selected = new Set(Array.from(selected).sort(compare));
    root.scrollTo(root.scrollLeft, 0);
    while (tbody.firstChild) tbody.firstChild.remove();
    appendRows(0, n = minlengthof(rows * 2));
    anchor = head = null;
    reinput();
  }

  function reinput() {
    const check = inputof(theadr);
    if (check == null) return;
    check.disabled = !multiple && !selected.size;
    check.indeterminate = multiple && selected.size && selected.size !== N; // assume materalized!
    check.checked = selected.size;
    value = undefined; // lazily computed
  }

  root.addEventListener("scroll", () => {
    if (root.scrollHeight - root.scrollTop < rows * rowHeight * 1.5 && n < minlengthof(n + 1)) {
      appendRows(n, n = minlengthof(n + rows));
    }
  });

  if (sort === undefined && reverse) {
    materialize();
    index.reverse();
  }

  if (value !== undefined) {
    materialize();
    if (multiple) {
      const values = new Set(value);
      selected = new Set(index.filter(i => values.has(array[i])));
    } else {
      const i = array.indexOf(value);
      selected = i < 0 ? new Set() : new Set([i]);
    }
    reinput();
  }

  if (minlengthof(1)) {
    appendRows(0, n);
  } else {
    tbody.append(html`<tr>${columns.length ? html`<td>` : null}<td rowspan=${columns.length} style="padding-left: var(--length3); font-style: italic;">No results.</td></tr>`);
  }

  if (sort !== undefined) {
    let i = columns.indexOf(sort);
    if (i >= 0) {
      if (reverse) currentSortHeader = theadr.childNodes[i + 1];
      resort({currentTarget: theadr.childNodes[i + 1]}, columns[i]);
    }
  }

  return Object.defineProperty(root, "value", {
    get() {
      if (value === undefined) {
        materialize();
        if (multiple) {
          value = Array.from(required && selected.size === 0 ? index : selected, i => array[i]);
          value.columns = columns;
        } else if (selected.size) {
          const [i] = selected;
          value = array[i];
        } else {
          value = null;
        }
      }
      return value;
    },
    set(v) {
      materialize();
      if (multiple) {
        const values = new Set(v);
        const selection = new Set(index.filter(i => values.has(array[i])));
        for (const i of selected) if (!selection.has(i)) unselect(i);
        for (const i of selection) if (!selected.has(i)) select(i);
      } else {
        const i = array.indexOf(v);
        selected = i < 0 ? new Set() : new Set([i]);
      }
      value = undefined; // lazily computed
    }
  });
}

function inputof(tr) {
  return tr.firstChild.firstChild;
}

function orderof(th) {
  return th.firstChild;
}

function formatof(base = {}, data, columns, locale) {
  const format = Object.create(null);
  for (const column of columns) {
    if (column in base) {
      format[column] = base[column];
      continue;
    }
    switch (type(data, column)) {
      case "number": format[column] = formatLocaleNumber(locale); break;
      case "date": format[column] = formatDate; break;
      default: format[column] = formatLocaleAuto(locale); break;
    }
  }
  return format;
}

function alignof(base = {}, data, columns) {
  const align = Object.create(null);
  for (const column of columns) {
    if (column in base) {
      align[column] = base[column];
    } else if (type(data, column) === "number") {
      align[column] = "right";
    }
  }
  return align;
}

function type(data, column) {
  if (isArrowTable(data)) return getArrowType(data, column);
  for (const d of data) {
    if (d == null) continue;
    const value = d[column];
    if (value == null) continue;
    if (typeof value === "number") return "number";
    if (value instanceof Date) return "date";
    return;
  }
}

// https://github.com/observablehq/stdlib/blob/746ca2e69135df6178e4f3a17244def35d8d6b20/src/arrow.js#L4-L16
function isArrowTable(value) {
  return (
    typeof value.getChild === "function" &&
    typeof value.toArray === "function" &&
    value.schema &&
    Array.isArray(value.schema.fields)
  );
}

// https://github.com/apache/arrow/blob/89f9a0948961f6e94f1ef5e4f310b707d22a3c11/js/src/enum.ts#L140-L141
function getArrowType(value, column) {
  const field = value.schema.fields.find((d) => d.name === column);
  switch (field?.type.typeId) {
    case 8: // Date
    case 10: // Timestamp
      return field.type.unit === 1 ? "date" : "number"; // millisecond
    case 2: // Int
    case 3: // Float
    case 7: // Decimal
    case 9: // Time
      return "number";
  }
}

function lengthof(data) {
  if (typeof data.length === "number") return data.length; // array or array-like
  if (typeof data.size === "number") return data.size; // map, set
  if (typeof data.numRows === "function") return data.numRows(); // arquero
}

function columnsof(data) {
  const columns = new Set();
  for (const row of data) {
    for (const name in row) {
      columns.add(name);
    }
  }
  return Array.from(columns);
}
