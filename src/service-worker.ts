/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

importScripts('https://assets.magicbell.io/web-push-notifications/sw.js');

sw.addEventListener('fetch', () => {});
