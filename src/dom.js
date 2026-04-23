export function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}
