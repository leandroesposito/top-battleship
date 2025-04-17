export function createElement(type, ...classNames) {
  const element = document.createElement(type);
  element.classList.add(...classNames);
  return element;
}
