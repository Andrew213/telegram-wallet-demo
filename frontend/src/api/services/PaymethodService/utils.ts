import {isRegExp, parseRegExp} from "@/utils";

export function parseMask(mask?: string[]) {
  if (!mask) {
    return undefined;
  }

  return mask.map(m => {
    if (isRegExp(m)) {
      return parseRegExp(m);
    }
    return m;
  });
}
