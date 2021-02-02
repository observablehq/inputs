let nextId = 0;

export function newId() {
  return `__ns__-${++nextId}`;
}
