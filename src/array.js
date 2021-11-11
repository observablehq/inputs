export function arrayify(array) {
  return Array.isArray(array) ? array : Array.from(array);
}

function iterable(array) {
  return array ? typeof array[Symbol.iterator] === "function" : false;
}

export function maybeColumns(data) {
  if (iterable(data.columns)) return data.columns; // d3-dsv, FileAttachment
  if (data.schema && iterable(data.schema.fields)) return Array.from(data.schema.fields, f => f.name); // apache-arrow
  if (typeof data.columnNames === "function") return data.columnNames(); // arquero
}
