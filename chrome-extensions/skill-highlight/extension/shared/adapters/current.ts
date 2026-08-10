import { DjinniAdapter } from "./djinni";
import { DouAdapter } from "./dou";

const djinniAdapter = new DjinniAdapter();
const douAdapter = new DouAdapter()

export function getCurrentAdapter(url: string) {
  if (djinniAdapter.isCurrent(url)) {
    return djinniAdapter
  }

  if (douAdapter.isCurrent(url)) {
    return douAdapter;
  }

  return undefined;
}
