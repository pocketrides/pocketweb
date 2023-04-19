import { quartInOut } from 'svelte/easing';

export function typewriter(node: HTMLElement, { duration = 50 }) {
  const text = node.textContent as string;

  return {
    duration,
    tick: (t: number) => {
      const i = Math.trunc(text.length * quartInOut(t));
      node.textContent = text.slice(0, i);
    }
  };
}
