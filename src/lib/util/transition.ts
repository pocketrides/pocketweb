import { quartInOut } from 'svelte/easing';

export function typewriter(node: HTMLElement) {
  const text = node.textContent as string;
  const duration = 50;

  return {
    duration,
    tick: (t: number) => {
      const i = Math.trunc(text.length * quartInOut(t));
      node.textContent = text.slice(0, i);
    }
  };
}
