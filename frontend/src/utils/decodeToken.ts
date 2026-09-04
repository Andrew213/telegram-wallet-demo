export function decodeToken(token: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(token);
  const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join(
    "",
  );
  return btoa(binString);
}
