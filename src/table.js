import {html} from "htl";
import {arrayify} from "./array.js";
import {length} from "./css.js";
import {formatDate, formatNumber, stringify} from "./format.js";
import {defined, ascending, descending} from "./sort.js";

const ROW_HEIGHT = 24;

/**
 * We render two “chunks” of cells at once. Each chunk is twice the height of the table.
 *
 */

export function Table(
  data,
  {
    columns = data.columns, // array of column names
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
  data = arrayify(data);
  if (columns === undefined) columns = columnsof(data);
  else columns = arrayify(columns);
  if (layout === undefined) layout = columns.length >= 12 ? "auto" : "fixed";
  format = formatof(format, data, columns);
  align = alignof(align, data, columns);

  let currentChunk = 0;
  const chunkRowCount = rows * 2;
  const chunkHeight = chunkRowCount * ROW_HEIGHT;
  const lastChunk = Math.floor(data.length / chunkRowCount);
  let currentSortHeader = null, currentReverse = false;
  let selected = new Set();
  let anchor = null, head = null;
  let index = Uint32Array.from(data, (_, i) => i);

  const paddingRow = html`<tr>`;
  const tbody = html`<tbody>${paddingRow}`;
  const tr = html`<tr><td><input type=checkbox></td>${columns.map(column => html`<td style=${{textAlign: align[column]}}>`)}`;
  const theadr = html`<tr><th><input type=checkbox onclick=${reselectAll}></th>${columns.map((column) => html`<th title=${column} style=${{width: length(width[column]), textAlign: align[column]}} onclick=${event => resort(event, column)}><span></span>${column}</th>`)}</tr>`;
  const table = html`<table style=${{tableLayout: layout}}>
    <thead>${data.length || columns.length ? theadr : null}</thead>
    ${tbody}
  </table>`;
  const root = html`<div class="__ns__ __ns__-table" style="max-height: ${(rows + 1) * ROW_HEIGHT - 1}px;">
  ${table}
</div>`;

  function createRow() {
    const itr = tr.cloneNode(true);
    const input = inputof(itr);
    input.onclick = reselect;
    return itr;
  }

  function render(i, itr) {
    if (i >= index.length) {
      itr.hidden = true;
      return;
    }
    const row = data[index[i]];
    const input = inputof(itr);
    input.checked = selected.has(i);
    input.name = i;
    itr.hidden = false;
    for (let j = 0; j < columns.length; ++j) {
      let column = columns[j];
      let value = row[column];
      if (!defined(value)) continue;
      value = format[column](value);
      if (!(value instanceof Node)) value = document.createTextNode(value);
      itr.childNodes[j + 1].replaceChildren(value);
    }
  }

  function unselect(i) {
    let j = index.indexOf(i);
    if (j < tbody.childNodes.length) {
      const tr = tbody.childNodes[j];
      inputof(tr).checked = false;
    }
    selected.delete(i);
  }

  function select(i) {
    let j = index.indexOf(i);
    if (j < tbody.childNodes.length) {
      const tr = tbody.childNodes[j];
      inputof(tr).checked = true;
    }
    selected.add(i);
  }

  function* range(i, j) {
    i = index.indexOf(i), j = index.indexOf(j);
    if (i < j) while (i <= j) yield index[i++];
    else while (j <= i) yield index[j++];
  }

  function first(set) {
    return set[Symbol.iterator]().next().value;
  }

  function reselectAll(event) {
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
    const th = event.currentTarget;
    let compare;
    if (currentSortHeader === th && currentReverse) {
      orderof(currentSortHeader).textContent = "";
      currentSortHeader = null;
      currentReverse = false;
      compare = ascending;
    } else {
      if (currentSortHeader === th) {
        currentReverse = true;
      } else {
        if (currentSortHeader) {
          orderof(currentSortHeader).textContent = "";
        }
        currentSortHeader = th, currentReverse = false;
      }
      const order = currentReverse ? descending : ascending;
      compare = (a, b) => order(data[a][column], data[b][column]);
      orderof(th).textContent = currentReverse ? "▾"  : "▴";
    }
    index.sort(compare);
    selected = new Set(Array.from(selected).sort(compare));
    root.scrollTo(0, 0);
    currentChunk = 0;
    repad();
    for (let i = 0; i < rows * 2; i++) {
      // render(i, row);
    }
    anchor = head = null;
    reinput();
  }

  function reinput() {
    inputof(theadr).checked = selected.size;
    revalue();
    root.dispatchEvent(new CustomEvent("input"));
  }

  function revalue() {
    value = Array.from(selected.size ? selected : index, i => data[i]);
    value.columns = columns;
  }

  function repad() {
    paddingRow.style.height = `${currentChunk * chunkHeight}px`;
    const lastRenderedRowIdx = (currentChunk + 2) * chunkRowCount;
    console.log(data.length - lastRenderedRowIdx);
    table.style.paddingBottom = `${Math.max((data.length - lastRenderedRowIdx) * ROW_HEIGHT, 0)}px`;
  }

  root.onscroll = () => {
    const chunk = Math.min(Math.max(0, Math.floor(root.scrollTop / ROW_HEIGHT / (rows * 2))), lastChunk);
    if (chunk !== currentChunk) {
      if (chunk === currentChunk - 1) {
        // scrolling up normally; reuse top half
        for (let i = 0; i < chunkRowCount; i++) {
          const row = tbody.lastChild;
          render(chunk * chunkRowCount + i, row);
          tbody.firstChild.insertAdjacentElement('afterend', row);
        }
      } else if (chunk === currentChunk + 1) {
        // scrolling down normally; reuse bottom half
        for (let i = 0; i < chunkRowCount; i++) {
          const row = tbody.children[1];
          render(chunk * chunkRowCount + i, row);
          tbody.append(row);
        }
      } else {
        for (let i = 0; i < chunkRowCount * 2; i++) {
          render((chunk * chunkRowCount) + i, tbody.children[i + 1]);
        }
      }
      currentChunk = chunk;
      repad();
    }
  };

  if (sort === undefined && reverse) {
    index.reverse();
  }

  if (value !== undefined) {
    const values = new Set(value);
    selected = new Set(index.filter(i => values.has(data[i])));
  }

  if (data.length) {
    for (let i = 0; i < chunkRowCount * 2; i++) {
      const row = createRow();
      render(i, row);
      tbody.append(row);
    }
  } else {
    tbody.append(html`<tr>${columns.length ? html`<td>` : null}<td rowspan=${columns.length} style="padding-left: 1em; font-variant: italic;">No results.</td></tr>`);
  }

  if (sort !== undefined) {
    let i = columns.indexOf(sort);
    if (i >= 0) {
      if (reverse) currentSortHeader = theadr.childNodes[i + 1];
      resort({currentTarget: theadr.childNodes[i + 1]}, columns[i]);
    }
  }

  revalue();

  setTimeout(repad, 25);

  return Object.defineProperty(root, "value", {
    get() {
      return value;
    },
    set(v) {
      const values = new Set(v);
      const selection = new Set(index.filter(i => values.has(data[i])));
      for (const i of selected) if (!selection.has(i)) unselect(i);
      for (const i of selection) if (!selected.has(i)) select(i);
      revalue();
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

function columnsof(data) {
  const columns = {};
  for (const row of data) {
    for (const name in row) {
      columns[name] = true;
    }
  }
  return Object.keys(columns);
}
