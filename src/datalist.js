import {html} from "htl";
import {stringify} from "./format.js";
import {newId} from "./id.js";

export function maybeDatalist(datalist) {
  if (datalist === undefined) return [null, null];
  const listId = newId();
  const list = html`<datalist id=${listId}>${Array.from(datalist, value => html`<option value=${stringify(value)}>`)}`;
  return [list, listId];
}
