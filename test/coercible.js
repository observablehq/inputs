export function number(x) {
  return x = +x, {valueOf: () => x};
}

export function string(x) {
  return x += "", {toString: () => x};
}
