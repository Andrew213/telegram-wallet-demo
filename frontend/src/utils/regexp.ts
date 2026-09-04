export function isRegExp(re: string) {
  return /^\/.*\/$/.test(re); // starts with "/" and ends with "/"
}

export function parseRegExp(re: string) {
  return new RegExp(re.slice(1, -1)); // delete first "/" and last "/"
}
