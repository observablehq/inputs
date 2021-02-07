import {html} from "htl";
import {arrayify} from "./array.js";
import {length} from "./css.js";
import {formatDate, formatNumber, stringify} from "./format.js";
import {newId} from "./id.js";
import {identity} from "./identity.js";
import {defined, ascending, descending} from "./sort.js";

const ROW_HEIGHT = 24;

/**
 * We render two “chunks” of cells at once. Each chunk is twice the height of the table.
 *
 */

export function Table(
  data,
  {
    columns, // array of column names
    value, // initial selection
    rows = 11.5, // maximum number of rows to show
    sort, // name of column to sort by, if any
    reverse = false, // if sorting, true for descending and false for ascending
    format, // object of column name to format function
    align, // object of column name to left, right, or center
    width = {}, // object of column name to width
    layout // "fixed" or "auto"
  } = {}
) {
  columns = columns === undefined ? columnsof(data) : arrayify(columns);
  if (layout === undefined) layout = columns.length >= 12 ? "auto" : "fixed";
  format = formatof(format, data, columns);
  align = alignof(align, data, columns);

  const N = lengthof(data); // total number of rows
  const chunkRowCount = rows * 2;
  const lastChunk = Math.floor(N / chunkRowCount);

  let currentChunk = 0;
  let currentSortHeader = null, currentReverse = false;
  let selected = new Set();
  let anchor = null, head = null;

  let array;
  let index;
  let iterator = data[Symbol.iterator]();
  let cache = Array.isArray(data) ? data : Array(N);
  let iterindex = Array.isArray(data) ? N : 0;

  window._cache = cache;

  // Defer materializing index and data arrays until needed.
  function materialize() {
    if (iterindex >= 0) {
      iterindex = iterator = undefined;
      index = Uint32Array.from(array = arrayify(data), (_, i) => i);
      cache = undefined;
    }
  }

  const id = newId();
  const paddingRow = html`<tr>`;
  const tbody = html`<tbody>${paddingRow}`;
  const tr = html`<tr><td><input type=checkbox></td>${columns.map(() => html`<td>`)}`;
  const theadr = html`<tr><th><input type=checkbox onclick=${reselectAll}></th>${columns.map((column) => html`<th title=${column} onclick=${event => resort(event, column)}><span></span>${column}</th>`)}</tr>`;
  const table = html`<table style=${{tableLayout: layout}}>
    <thead>${N || columns.length ? theadr : null}</thead>
    ${tbody}
  </table>`;
  const root = html`<div class="__ns__ __ns__-table" id=${id} style="max-height: ${(rows + 1) * ROW_HEIGHT - 1}px;">
  ${table}
  <style>${columns.map((column, i) => {
    const rules = [];
    if (align[column]) rules.push(`text-align:${align[column]}`);
    if (width[column]) rules.push(`width:${length(width[column])}`);
    if (rules.length) return `#${id} tr>:nth-child(${i + 2}){${rules.join(";")}}`;
  }).filter(identity).join("\n")}</style>
</div>`;

  function createRow() {
    const itr = tr.cloneNode(true);
    const input = inputof(itr);
    input.onclick = reselect;
    return itr;
  }

  function render(i, itr) {
    if (i >= N) {
      itr.hidden = true;
      return;
    }
    let row;
    if (index) {
      row = array[index[i]];
    } else {
      for (; iterindex <= i; iterindex++) {
        cache[iterindex] = iterator.next().value;
      }
      row = cache[i];
    }
    const input = inputof(itr);
    input.checked = selected.has(i);
    input.name = i;
    itr.hidden = false;
    for (let j = 0; j < columns.length; ++j) {
      let column = columns[j];
      let value = row[column];
      if (!defined(value)) continue;
      value = format[column](value, i, data);
      if (!(value instanceof Node)) value = document.createTextNode(value);
      const cell = itr.childNodes[j + 1];
      while (cell.firstChild) cell.firstChild.remove();
      cell.appendChild(value);
    }
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
    if (selected.size) {
      for (let i of selected) unselect(i);
      anchor = head = null;
      if (event.detail) event.currentTarget.blur();
    } else {
      selected = new Set(index);
      for (const tr of tbody.childNodes) {
        inputof(tr).checked = true;
      }
    }
    reinput();
  }

  function reselect(event) {
    materialize();
    let i = +this.name;
    if (event.shiftKey) {
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
    currentChunk = 0;
    repad();
    for (let i = 0; i < chunkRowCount * 2; i++) {
      render(i, tbody.children[i + 1]);
    }
    anchor = head = null;
    reinput();
  }

  function reinput() {
    inputof(theadr).checked = selected.size;
    value = undefined; // lazily computed
    root.dispatchEvent(new Event("input"));
  }

  function repad() {
    paddingRow.style.height = `${currentChunk * chunkRowCount * ROW_HEIGHT}px`;
    const lastRenderedRowIdx = (currentChunk + 2) * chunkRowCount;
    table.style.paddingBottom = `${Math.max((N - lastRenderedRowIdx) * ROW_HEIGHT, 0)}px`;
  }

  root.onscroll = () => {
    const chunk = Math.min(Math.max(0, Math.floor(root.scrollTop / ROW_HEIGHT / (rows * 2))), lastChunk);
    if (chunk !== currentChunk) {
      for (let i = 0; i < chunkRowCount * 2; i++) {
        render((chunk * chunkRowCount) + i, tbody.children[i + 1]);
      }
      currentChunk = chunk;
      repad();
    }
  };

  if (sort === undefined && reverse) {
    materialize();
    index.reverse();
  }

  if (value !== undefined) {
    materialize();
    const values = new Set(value);
    selected = new Set(index.filter(i => values.has(array[i])));
    value = undefined; // lazily computed
  }

  if (N) {
    for (let i = 0; i < chunkRowCount * 2; i++) {
      const row = createRow();
      render(i, row);
      tbody.append(row);
    }
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

  setTimeout(repad, 25);

  return Object.defineProperty(root, "value", {
    get() {
      if (value === undefined) {
        materialize();
        value = Array.from(selected.size ? selected : index, i => array[i]);
        value.columns = columns;
      }
      return value;
    },
    set(v) {
      materialize();
      const values = new Set(v);
      const selection = new Set(index.filter(i => values.has(array[i])));
      for (const i of selected) if (!selection.has(i)) unselect(i);
      for (const i of selection) if (!selected.has(i)) select(i);
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

function formatof(base = {}, data, columns) {
  const format = Object.create(null);
  for (const column of columns) {
    if (column in base) {
      format[column] = base[column];
      continue;
    }
    switch (type(data, column)) {
      case "number": format[column] = formatNumber; break;
      case "date": format[column] = formatDate; break;
      default: format[column] = stringify; break;
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
  for (const d of data) {
    const value = d[column];
    if (value == null) continue;
    if (typeof value === "number") return "number";
    if (value instanceof Date) return "date";
    return;
  }
}

function lengthof(data) {
  if (typeof data.length === "number") return data.length; // array or array-like
  if (typeof data.size === "number") return data.size; // map, set
  if (typeof data.numRows === "function") return data.numRows(); // arquero
  let size = 0;
  for (const d of data) ++size; // eslint-disable-line no-unused-vars
  return size;
}

function columnsof(data) {
  if (Array.isArray(data.columns)) return data.columns; // d3-dsv, FileAttachment
  if (typeof data.columnNames === "function") return data.columnNames(); // arquero
  const columns = new Set();
  for (const row of data) {
    for (const name in row) {
      columns.add(name);
    }
  }
  return Array.from(columns);
}
