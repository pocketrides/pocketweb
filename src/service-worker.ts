/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

try {
  importScripts('https://assets.magicbell.io/web-push-notifications/sw.js');
} catch (e) {
  try {
    // @ts-ignore
    import('https://assets.magicbell.io/web-push-notifications/sw.js');
  } catch (e) {}
}

sw.addEventListener('fetch', () => {});
