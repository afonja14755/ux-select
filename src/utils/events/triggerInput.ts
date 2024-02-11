export default function triggerInput(el: HTMLElement): void {
  const input: Event = new Event('input');
  el.dispatchEvent(input);
}
