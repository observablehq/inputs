import {arrayify} from "./array.js";
import {dispatchInput, preventDefault} from "./event.js";
import {formatLocaleAuto} from "./format.js";
import {identity} from "./identity.js";
import {ascending, descending} from "./sort.js";

const first = ([x]) => x;
const second = ([, x]) => x;

export function createChooser({multiple: fixedMultiple, render, selectedIndexes, select}) {
  return function chooser(data, {
    locale,
    keyof = data instanceof Map ? first : identity,
    valueof = data instanceof Map ? second : identity,
    format = (f => (d, i, data) => f(keyof(d, i, data)))(formatLocaleAuto(locale)),
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
    if (typeof format !== "function") throw new TypeError("format is not a function");
    if (fixedMultiple !== undefined) multiple = fixedMultiple;
    sort = maybeSort(sort);
    let size = +multiple;
    if (value === undefined) value = key !== undefined && data instanceof Map ? (size > 0 ? Array.from(key, k => data.get(k)) : data.get(key)) : undefined;
    unique = !!unique;
    data = arrayify(data);
    let keys = data.map((d, i) => [keyof(d, i, data), i]);
    if (sort !== undefined) keys.sort(([a], [b]) => sort(a, b));
    if (unique) keys = [...new Map(keys.map(o => [intern(o[0]), o])).values()];
    const index = keys.map(second);
    if (multiple === true) size = Math.max(1, Math.min(10, index.length));
    else if (size > 0) multiple = true;
    else multiple = false, size = undefined;
    const [form, input] = render(
      data,
      index,
      maybeSelection(data, index, value, multiple, valueof),
      maybeDisabled(data, index, disabled, valueof),
      {
        ...options,
        format,
        multiple,
        size
      }
    );
    form.addEventListener("input", oninput);
    form.addEventListener("change", dispatchInput);
    form.addEventListener("submit", preventDefault);
    function oninput(event) {
      if (event && event.isTrusted) form.removeEventListener("change", dispatchInput);
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
          for (const e of input) {
            const i = +e.value;
            select(e, selection.has(valueof(data[i], i, data)));
          }
        } else {
          input.value = index.find(i => v === valueof(data[i], i, data));
        }
        oninput();
      }
    });
  };
}

function maybeSelection(data, index, value, multiple, valueof) {
  const values = new Set(value === undefined ? [] : multiple ? arrayify(value) : [value]);
  if (!values.size) return () => false;
  const selection = new Set();
  for (const i of index) {
    if (values.has(valueof(data[i], i, data))) {
      selection.add(i);
    }
  }
  return i => selection.has(i);
}

function maybeDisabled(data, index, value, valueof) {
  if (typeof value === "boolean") return value;
  const values = new Set(arrayify(value));
  const disabled = new Set();
  for (const i of index) {
    if (values.has(valueof(data[i], i, data))) {
      disabled.add(i);
    }
  }
  return i => disabled.has(i);
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
