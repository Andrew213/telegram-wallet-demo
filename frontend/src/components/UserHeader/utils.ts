export function cropEmail({
  email,
  maxLength,
}: {
  email: string;
  maxLength: number;
}) {
  const [name, domain] = email.split("@");

  const maxDots = maxLength - domain.length - 3; // first letter + last letter + "@";

  // can we crop only name part?
  if (maxDots >= 1) {
    const dots = Math.min(maxDots, name.length - 2);
    return [name.at(0), "*".repeat(dots), name.at(-1), "@", domain].join("");
  } else {
    // if not, crop name and domain together
    const fullLength = name.length + 1 + domain.length;
    const dots = Math.min(maxLength, fullLength) - 2;
    return [name.at(0), "*".repeat(dots), domain.at(-1)].join("");
  }
}
