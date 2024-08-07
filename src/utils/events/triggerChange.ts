export function triggerChange(el: HTMLElement): void {
  const change: Event = new Event('change')
  el.dispatchEvent(change)
}
