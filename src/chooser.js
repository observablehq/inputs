import {arrayify} from "./array.js";
import {dispatchInput, preventDefault} from "./event.js";
import {ascending, descending} from "./sort.js";

export function createChooser({render, selectedIndexes, select}) {
  return function Chooser(data, {
    keyof = data instanceof Map ? ([key]) => key : d => d,
    valueof = data instanceof Map ? ([, value]) => value : d => d,
    multiple,
    key,
    value,
    disabled = false,
    sort,
    unique,
    ...options
  } = {}) {
    if (typeof keyof !== "function") throw new TypeError("keyof is not a function");
    if (typeof valueof !== "function") throw new TypeError("valueof is not a function");
    sort = maybeSort(sort);
    let size = +multiple;
    if (value === undefined) value = key !== undefined && data instanceof Map ? (size > 0 ? Array.from(key, k => data.get(k)) : data.get(key)) : undefined;
    unique = !!unique;
    data = arrayify(data);
    let keys = data.map((d, i) => [keyof(d, i, data), i]);
    if (sort !== undefined) keys.sort(([a], [b]) => sort(a, b));
    if (unique) keys = [...new Map(keys.map(o => [intern(o[0]), o])).values()];
    if (multiple === true) size = Math.max(1, Math.min(10, data.length));
    else if (size > 0) multiple = true;
    else multiple = false, size = undefined;
    const [form, input = form.elements.input] = render(
      data,
      keys,
      maybeSelection(data, value, multiple, valueof),
      maybeDisabled(data, disabled, valueof),
      {
        ...options,
        multiple,
        size
      }
    );
    form.onchange = dispatchInput;
    form.oninput = oninput;
    form.onsubmit = preventDefault;
    function oninput(event) {
      if (event && event.isTrusted) form.onchange = null;
      if (multiple) {
        value = selectedIndexes(input).map(i => valueof(data[i], i, data));
      } else {
        const i = selectedIndex(input);
        value = i < 0 ? null : valueof(data[i], i, data);
      }
    }
    oninput();
    return Object.defineProperty(form, "value", {
      get() {
        return value;
      },
      set(v) {
        if (multiple) {
          const selection = new Set(v);
          for (const i of input) {
            select(i, selection.has(data[i.value]));
          }
        } else {
          input.value = data.indexOf(v);
        }
        oninput();
      }
    });
  };
}

function maybeSelection(data, value, multiple, valueof) {
  const values = new Set(value === undefined ? [] : multiple ? arrayify(value) : [value]);
  if (!values.size) return () => false;
  const index = new Set();
  for (let i = 0; i < data.length; ++i) {
    if (values.has(valueof(data[i], i, data))) {
      index.add(i);
    }
  }
  return i => index.has(i);
}

function maybeDisabled(data, disabled, valueof) {
  if (typeof disabled === "boolean") return disabled;
  const values = new Set(arrayify(disabled));
  const index = new Set();
  for (let i = 0; i < data.length; ++i) {
    if (values.has(valueof(data[i], i, data))) {
      index.add(i);
    }
  }
  return i => index.has(i);
}

function maybeSort(sort) {
  if (sort === undefined || sort === false) return;
  if (sort === true || sort === "ascending") return ascending;
  if (sort === "descending") return descending;
  if (typeof sort === "function") return sort;
  throw new TypeError("sort is not a function");
}

function selectedIndex(input) {
  return input.value ? +input.value : -1;
}

function intern(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}
