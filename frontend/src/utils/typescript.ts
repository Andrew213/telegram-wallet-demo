// Utility to safely return the values of an object
export const safeObjectValues = <T extends object>(obj: T): T[keyof T][] => {
  return Object.values(obj) as T[keyof T][];
};

export type NativeProps<T extends HTMLElement> = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<T>,
  T
>;

export function replace<V, R extends V, S>(
  value: V,
  replaceValue: R,
  substituteValue: S,
): Exclude<V, R> | S {
  if (value === replaceValue) {
    return substituteValue;
  }

  return value as Exclude<V, R>;
}

interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export type Falsy = false | null | undefined | "" | 0;

export function notFalsy<T>(v: T | Falsy): v is T {
  return Boolean(v);
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = {...obj};
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}
