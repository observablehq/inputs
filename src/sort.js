export function ascending(a, b) {
  return defined(b) - defined(a) || (a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN);
}

export function descending(b, a) {
  return defined(a) - defined(b) || (a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN);
}

export function defined(d) {
  return d != null && !Number.isNaN(d);
}
